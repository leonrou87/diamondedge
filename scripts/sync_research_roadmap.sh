#!/usr/bin/env bash
# sync_research_roadmap.sh — push the RESEARCH ROADMAP payload to Supabase so the
# Research tab stays fresh without a deploy. The coordinator rewrites
# v4/models/research_roadmap.json each wave and copies it to
# public/research_roadmap.json; this upserts it into slate_snapshots
# (key='research_roadmap'), which the app reads first (static file as fallback).
# Mirrors sync_unified_live.sh. Skips when unchanged.
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/research_roadmap.json"
STAMP="$DIR/scripts/.research_roadmap_sync.sha"
[ -f "$FILE" ] || exit 0
# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
if [ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ]; then
  # HEARTBEAT (2026-07-31). The payload has not changed, so there is nothing to
  # upload — but the row IS current, and a watchdog cannot tell "nothing changed"
  # apart from "this job died" unless something says so. Stamp updated_at alone
  # (a tiny PATCH, no payload, negligible egress). CONTRACT: updated_at is the
  # LIVENESS signal — when the sync last confirmed this key current. The CONTENT
  # age lives inside the payload (generated_utc), where it always has.
  # THE HEARTBEAT TELLS THE TRUTH (2026-08-10). This branch used to
  # `curl … || true; exit 0`, swallowing the PATCH's HTTP status: a heartbeat
  # that silently failed left updated_at un-advanced while the job still exited
  # GREEN and logged nothing, so the Supabase key-age rail was the only thing
  # that could ever notice — hours later. Now it captures the code, reports
  # plainly that the row was ALREADY current (not that it wrote fresh data),
  # and exits non-zero when the stamp did not move. Mirrors sync_unified_history.
  HB_HTTP=$(curl -s -o /tmp/research_roadmap_heartbeat_resp.txt -w "%{http_code}" \
    --max-time 30 -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.research_roadmap" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}")
  if [ "$HB_HTTP" = "200" ] || [ "$HB_HTTP" = "204" ]; then
    echo "$(date '+%F %T') research roadmap heartbeat ($HB_HTTP) sha=$SHA — unchanged, already on production"
  else
    echo "$(date '+%F %T') RESEARCH ROADMAP HEARTBEAT FAILED http=$HB_HTTP $(head -c 200 /tmp/research_roadmap_heartbeat_resp.txt)" >&2
    exit 1
  fi
  exit 0
fi
# BSD mktemp substitutes only TRAILING X's — see sync_history.sh.
TMP=$(mktemp "${TMPDIR:-/tmp}/research_roadmap_body.XXXXXX")
RESP=$(mktemp "${TMPDIR:-/tmp}/research_roadmap_resp.XXXXXX")
trap 'rm -f "$TMP" "$RESP"' EXIT
# updated_at IS SET EXPLICITLY (2026-07-31). PostgREST's
# `Prefer: resolution=merge-duplicates` upsert only writes the columns present
# in the request body, so omitting updated_at left this key advertising its
# original INSERT time forever while the payload was being rewritten each
# wave — research_roadmap sat at 2026-07-26 while syncing fine. A freshness
# signal that lies is worse than no signal: the watchdog cannot see a real
# outage on a key that is always stale. See RUNBOOK "Watchdog" gotcha.
# …AND generated_utc IS RE-STAMPED FROM THE FILE ITSELF (2026-08-09). This is a
# DIFFERENT stamp from updated_at above and it drifted the other way: the
# coordinator writes `generated_utc` by hand, so on 2026-08-09 the payload
# carried an entry dated 08-09 under a stamp that said 08-03, and the Research
# masthead — which reads exactly this field — told every reader the study index
# was six days old on a night it had just been rewritten. A freshness signal
# that lies is worse than no signal, in both directions: the earlier fix demoted
# the masthead's wording, which dressed a broken stamp up as an honest staleness
# disclosure. The bug was here.
# It is the file's own MODIFIED TIME, never `now`: stamping the publish would
# make the index permanently "fresh" whether or not a word of it had changed,
# which is the same lie with the sign flipped. mtime is observed, and it is what
# "when was this index last rebuilt" actually means.
python3 - "$FILE" "$TMP" <<'PY'
import datetime,json,os,sys
# ═══ THE WRITE GATE ═══ every row on slate_snapshots is readable by anyone
# holding the anon JWT in the site's JS bundle, so this upload is a
# publication. The gate redacts by schema and REFUSES a key nobody has
# registered; `set -e` turns a leak into a failed sync rather than a published
# board. See ~/Desktop/sports-betting-platform/v4/serve/snapshot_gate.py.
sys.path.insert(0,"/Users/leonrou/Desktop/sports-betting-platform")
from v4.serve import snapshot_gate as _GATE
src=sys.argv[1]
payload=json.load(open(src))
mtime=datetime.datetime.fromtimestamp(os.path.getmtime(src),datetime.timezone.utc)
payload["generated_utc"]=mtime.isoformat()
now=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
json.dump(_GATE.gate_rows([{"key":"research_roadmap","payload":payload,"updated_at":now}],verbose=False),
          open(sys.argv[2],"w"))
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
  "$DIR/scripts/revalidate_edge.sh" research_roadmap || true
  # VERIFY updated_at ROUND-TRIP — read the column back through the REST API so
  # every run leaves proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.research_roadmap&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$(date '+%F %T') synced research roadmap ($HTTP) updated_at=$BACK"
else
  echo "$(date '+%F %T') RESEARCH ROADMAP SYNC FAILED http=$HTTP $(head -c 200 "$RESP")" >&2
  exit 1
fi
