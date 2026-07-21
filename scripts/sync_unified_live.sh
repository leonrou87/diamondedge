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
[ -f "$FILE" ] || exit 0
# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
[ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ] && exit 0
BODY=$(python3 - "$FILE" <<'PY'
import json,sys
payload=json.load(open(sys.argv[1]))
print(json.dumps([{"key":"picks_unified_live","payload":payload}]))
PY
)
HTTP=$(curl -s -o /tmp/unified_live_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "$BODY")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  echo "$(date '+%F %T') synced unified live ($HTTP)"
else
  echo "$(date '+%F %T') UNIFIED LIVE SYNC FAILED http=$HTTP $(head -c 200 /tmp/unified_live_sync_resp.txt)" >&2
  exit 1
fi
