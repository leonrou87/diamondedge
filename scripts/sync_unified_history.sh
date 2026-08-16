#!/usr/bin/env bash
# sync_unified_history.sh — push the UNIFIED single-pick HISTORY board to Supabase
# so prior-day unified picks stay fresh WITHOUT a git deploy. The overnight cycle
# rewrites public/picks_unified.json (unified_model.build_unified_history);
# this upserts slate_snapshots(key='picks_unified'); the app reads Supabase first,
# static file as fallback. Mirrors sync_history.sh (streams from a file).
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
# ONE WRITER PER KEY — the launchd job and nightly_scrub.SYNC_SET both run
# this exact script. See scripts/_sync_lock.sh for the 57014 it prevents.
# shellcheck source=scripts/_sync_lock.sh
. "$HOME/Desktop/diamondedge/scripts/_sync_lock.sh"
sync_lock picks_unified

FILE="$DIR/public/picks_unified.json"
STAMP="$DIR/scripts/.unified_history_sync.sha"
TMP="$(mktemp "${TMPDIR:-/tmp}/unified_history_sync_body.XXXXXX")"
# …AND THE LOCK IS RELEASED HERE, NOT ONLY IN _sync_lock.sh. This script
# sets its own EXIT trap, which REPLACES the one sync_lock installed —
# proven by a leaked lock dir on the first concurrency test. Chained, so
# a winner that exits cannot strand the key for the full stale window.
trap 'rm -f "$TMP"; _sync_lock_release' EXIT
[ -f "$FILE" ] || exit 0
set -a; source "$HOME/.kytepush-platform.env"; set +a

# ═══ PREMIUM SEAL, SHA-GUARDED (2026-08-13, free-tier lockdown) ═══
# Same function as sync_unified_live.sh — see the comment there. Short form:
# the seal gets its own stamp (sha over the twin minus the per-cycle generated
# stamps, the sync_ms_premium.sh pattern), checked on EVERY run, so an
# unchanged twin never buys a ~13 MB re-upsert of an identical sealed row and
# a twin that moved while the public bytes did not still gets sealed.
# THE SEALED TWIN IS GONE (2026-08-16). The paywall it fed has been deleted,
# so there is no member-only variant of this board: the public bytes ARE the
# full board. This removes a multi-MB ciphertext upsert per cycle — the
# sealed twins measured 1.92 GB/month, 38% of the Supabase free egress cap.
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
# FRESHNESS GUARD — warn loudly if the unified history is missing recent days
LATEST=$(python3 -c "import json; d=json.load(open('$FILE')); ds=sorted(g.get('date') for g in d.get('games',[])); print(ds[-1] if ds else '')" 2>/dev/null)
YEST=$(date -v-1d '+%Y-%m-%d' 2>/dev/null || date -d yesterday '+%Y-%m-%d' 2>/dev/null)
# See the same guard in sync_history.sh for why the hour matters: before the
# 02:00 overnight self-heal has been due, "yesterday is not in the archive yet"
# is the pipeline working, not an error, and writing it to stderr every ten
# minutes is how a healthy job fills the file that is supposed to mean trouble.
if [ -n "$LATEST" ] && [ -n "$YEST" ] && [ "$LATEST" \< "$YEST" ]; then
  HR=$(date '+%H')
  if [ "$((10#$HR))" -lt 3 ]; then
    echo "$(date '+%F %T') unified history latest=$LATEST < yesterday=$YEST — waiting for the 02:00 overnight self-heal (not yet due; this is stdout on purpose)"
  else
    echo "$(date '+%F %T') WARN: unified history latest=$LATEST < yesterday=$YEST — archive may be stale and the 02:00 self-heal has already been due for $((10#$HR - 2))h" >&2
  fi
fi
if [ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ]; then
  # HEARTBEAT (2026-07-31). The payload has not changed, so there is nothing to
  # upload — but the row IS current, and a watchdog cannot tell "nothing changed"
  # apart from "this job died" unless something says so. Stamp updated_at alone
  # (a tiny PATCH, no payload, negligible egress). CONTRACT: updated_at is the
  # LIVENESS signal — when the sync last confirmed this key current. The CONTENT
  # age lives inside the payload (generated_utc), where it always has.
  HB_HTTP=$(curl -s -o /tmp/unified_history_heartbeat_resp.txt -w "%{http_code}" \
    --max-time 30 -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_unified" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}")
  if [ "$HB_HTTP" = "200" ] || [ "$HB_HTTP" = "204" ]; then
    echo "$(date '+%F %T') synced unified history heartbeat ($HB_HTTP) sha=$SHA"
  else
    echo "$(date '+%F %T') UNIFIED HISTORY HEARTBEAT FAILED http=$HB_HTTP $(head -c 200 /tmp/unified_history_heartbeat_resp.txt)" >&2
    exit 1
  fi
  # Seal check on the heartbeat branch too (2026-08-13) — a no-op sha compare
  # when nothing changed, a real seal when the full twin moved alone.
  exit 0
fi
# updated_at IS SET EXPLICITLY (2026-07-31). PostgREST's
# `Prefer: resolution=merge-duplicates` upsert only writes the columns present
# in the request body, so omitting updated_at left this key advertising its
# original INSERT time forever while the payload was being rewritten every
# night — picks_unified sat at 2026-07-21 while syncing fine. A freshness
# signal that lies is worse than no signal: the watchdog cannot see a real
# outage on a key that is always stale. See RUNBOOK "Watchdog" gotcha.
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
_GATE.gate_to_file("picks_unified",payload,sys.argv[2],updated_at=now)
PY
# RETRY WITH BACKOFF (2026-07-31). The upsert began returning 500 / 57014
# ("canceling statement due to statement timeout") as this payload grew past
# ~10 MB — intermittently, which is the worst kind: a single attempt fails,
# the next one succeeds, and the Supabase `updated_at` rail never sees a
# stale key, so the job walks up to the cliff invisibly. The real fix landed
# upstream (v4/serve/analyst_desk.history_diamondedge halves the payload by
# refusing to serialise the desk-invariant chief frame 392 times), and this
# is the belt: three attempts, widening pause, and the run only reports
# success if the row actually took. gzip is NOT used — PostgREST does not
# negotiate a compressed request body, and the timeout is DB-side work on
# the JSONB, not transfer time, so it would buy nothing.
# Every attempt, including the ones that recover, is logged: an intermittent
# failure is the early warning, and check_feed_freshness's sync-job rail
# reads this stream for exactly that reason.
HTTP=""
for ATTEMPT in 1 2 3; do
  HTTP=$(curl -s -o /tmp/unified_history_sync_resp.txt -w "%{http_code}" \
    --max-time 120 \
    -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates" \
    --data-binary "@$TMP")
  if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then break; fi
  echo "$(date '+%F %T') unified history upsert attempt $ATTEMPT/3 http=$HTTP $(head -c 200 /tmp/unified_history_sync_resp.txt)" >&2
  if [ "$ATTEMPT" != "3" ]; then sleep $((ATTEMPT * 15)); fi
done
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  # VERIFY updated_at ROUND-TRIP — read the column back through the REST API so
  # every run leaves proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_unified&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$SHA" > "$STAMP"; echo "$(date '+%F %T') synced unified history ($HTTP) updated_at=$BACK"
  # THE PUBLISH IS THE INVALIDATION (2026-08-09). Only on this branch — the
  # heartbeat branch above is the "nothing changed" case and must stay free.
  bash "$DIR/scripts/revalidate_edge.sh" picks_unified || true
else
  echo "$(date '+%F %T') UNIFIED HISTORY SYNC FAILED http=$HTTP $(head -c 300 /tmp/unified_history_sync_resp.txt)" >&2; exit 1
fi
