#!/usr/bin/env bash
# sync_unified_live.sh — push the UNIFIED single-pick LIVE board to Supabase so
# production stays fresh intraday (no deploy). The modeling job rewrites
# public/picks_unified_live.json every cycle (daily_cycle --intraday builds it via
# unified_model.build_unified_live); this upserts it into slate_snapshots
# (key='picks_unified_live'), which the app reads first (static file as fallback).
# Mirrors sync_live_picks.sh. Runs from cron every 5 min; skips when unchanged.
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/picks_unified_live.json"
STAMP="$DIR/scripts/.unified_live_sync.sha"
# STREAM THE BODY FROM A FILE, NEVER FROM argv (2026-07-31). This script used to
# build the request body into a shell variable and pass it as `--data-binary
# "$BODY"`, which puts the entire payload on curl's ARGUMENT LIST. macOS caps
# that at 1 MiB for argv+env combined, so the job died with
# "/usr/bin/curl: Argument list too long" the first cycle the live board crossed
# it — a hard cliff with no warning shoulder, and one the sync would have walked
# into on its own as the board grew. sync_unified_history.sh has always streamed
# from a file for exactly this reason; this now matches it.
TMP="$(mktemp "${TMPDIR:-/tmp}/unified_live_sync_body.XXXXXX")"
trap 'rm -f "$TMP"' EXIT
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
  curl -s -o /dev/null -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_unified_live" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}" || true
  exit 0
fi
# updated_at IS SET EXPLICITLY (2026-07-31). PostgREST's
# `Prefer: resolution=merge-duplicates` upsert only writes the columns present
# in the request body, so omitting updated_at left this key advertising its
# original INSERT time forever while the payload was being rewritten every
# cycle — picks_unified_live sat at 2026-07-21 while syncing fine. A freshness
# signal that lies is worse than no signal: the watchdog cannot see a real
# outage on a key that is always stale. See RUNBOOK "Watchdog" gotcha.
python3 - "$FILE" "$TMP" <<'PY'
import datetime,json,sys
payload=json.load(open(sys.argv[1]))
now=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
json.dump([{"key":"picks_unified_live","payload":payload,"updated_at":now}],
          open(sys.argv[2],"w"))
PY
HTTP=$(curl -s -o /tmp/unified_live_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  # VERIFY updated_at ROUND-TRIP — read the column back through the REST API so
  # every run leaves proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_unified_live&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$(date '+%F %T') synced unified live ($HTTP) updated_at=$BACK"
else
  echo "$(date '+%F %T') UNIFIED LIVE SYNC FAILED http=$HTTP $(head -c 200 /tmp/unified_live_sync_resp.txt)" >&2
  exit 1
fi
