#!/usr/bin/env bash
# sync_research_papers.sh — push the KYTEPUSH RESEARCH PAPER LIBRARY to Supabase so
# the Research tab stays fresh without a deploy. Mirrors sync_research_roadmap.sh
# exactly, including the heartbeat and the updated_at read-back.
#
# WHY A SEPARATE KEY FROM THE ROADMAP. The roadmap payload is rewritten and
# re-uploaded every research wave; the paper library changes rarely and is about
# twice the size. Two keys means neither job blocks or slows the other, and a
# roadmap wave never has to re-upload 350 KB of unchanged prose.
#   research_roadmap  -> the 89-item roadmap + a ~10 KB `papers_index` pointer
#   research_papers   -> the full library (papers[].sections[], visuals[], ...)
# The app should read `research_papers` first and fall back to the static
# /research_papers.json.
#
# THE BUILDER RUNS FIRST, ON PURPOSE. build_papers.py validates the library
# (every key figure and every visual must name a source that is declared AND
# exists on disk) and re-folds `papers_index` into research_roadmap.json — which
# the roadmap coordinator drops each time it regenerates that file. Running the
# builder here means every papers sync repairs the pointer.
set -euo pipefail
SBP="$HOME/Desktop/sports-betting-platform"
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/research_papers.json"
STAMP="$DIR/scripts/.research_papers_sync.sha"

# 1. Build + validate. A failure here must NOT publish a stale-but-valid payload
#    silently, so we exit non-zero and leave the previous upload in place.
if [ -d "$SBP/v4/models/research_papers" ]; then
  python3 "$SBP/v4/models/research_papers/build_papers.py" >/dev/null
  cp "$SBP/v4/models/research_papers/papers.json" "$FILE"
  cp "$SBP/v4/models/research_roadmap.json" "$DIR/public/research_roadmap.json"
fi
[ -f "$FILE" ] || exit 0

# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
if [ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ]; then
  # HEARTBEAT. Nothing changed, so there is nothing to upload — but the row IS
  # current, and a watchdog cannot tell "nothing changed" apart from "this job
  # died" unless something says so. Stamp updated_at alone (tiny PATCH, no
  # payload). CONTRACT: updated_at is the LIVENESS signal; the CONTENT age lives
  # inside the payload at generated_utc.
  curl -s -o /dev/null -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.research_papers" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}" || true
  exit 0
fi
# BSD mktemp substitutes only TRAILING X's — see sync_history.sh.
TMP=$(mktemp "${TMPDIR:-/tmp}/research_papers_body.XXXXXX")
RESP=$(mktemp "${TMPDIR:-/tmp}/research_papers_resp.XXXXXX")
trap 'rm -f "$TMP" "$RESP"' EXIT
# updated_at IS SET EXPLICITLY. PostgREST's merge-duplicates upsert only writes
# columns present in the body, so omitting it would leave this key advertising
# its original INSERT time forever. A freshness signal that lies is worse than
# no signal. See RUNBOOK "Watchdog" gotcha.
python3 - "$FILE" "$TMP" <<'PY'
import datetime,json,sys
# ═══ THE WRITE GATE — AND IT DEGRADES, IT DOES NOT STOP (2026-08-14) ═══
# Every row on slate_snapshots is readable by anyone holding the anon JWT in the
# site's JS bundle, so this upload is a publication. The gate redacts by schema
# (DEFAULT-DENY: a field no allowlist names is dropped before any scan) and
# REFUSES a key nobody has registered.
#
# WHAT `set -e` NOW MEANS HERE. It used to mean "any gate complaint kills the
# publish", which cost 24 hours of frozen board in five days across three
# incidents in which THE PICKS WERE FINE. `gate_to_file` drops the smallest
# thing that fails — one card, one block — publishes the rest, logs it loudly
# and mails the owner. It raises, and therefore fails this script, ONLY when
# there is genuinely nothing safe to serve. See
# /Users/leonrou/Desktop/sports-betting-platform/v4/serve/snapshot_gate.py.
sys.path.insert(0,"/Users/leonrou/Desktop/sports-betting-platform")
from v4.serve import snapshot_gate as _GATE
payload=json.load(open(sys.argv[1]))
now=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
_GATE.gate_to_file("research_papers",payload,sys.argv[2],updated_at=now)
PY
HTTP=$(curl -s -o "$RESP" -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary @"$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  # THE PUBLISH IS THE INVALIDATION (2026-08-09). Only on this branch — the
  # heartbeat branch above is the "nothing changed" case and must stay free.
  "$DIR/scripts/revalidate_edge.sh" research_papers || true
  # VERIFY THE ROUND TRIP — read the row back through the REST API so every run
  # leaves proof in the log that the payload landed and the stamp moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.research_papers&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  N=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["summary"]["n_papers"])' "$FILE" 2>/dev/null || echo "?")
  echo "$(date '+%F %T') synced research papers ($HTTP) n=$N updated_at=$BACK"
else
  echo "$(date '+%F %T') RESEARCH PAPERS SYNC FAILED http=$HTTP $(head -c 200 "$RESP")" >&2
  exit 1
fi
