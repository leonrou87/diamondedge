#!/usr/bin/env bash
# sync_live_picks.sh — push the locally-refreshing live pick feed to Supabase so PRODUCTION
# picks stay fresh intraday (no deploy needed). The modeling job rewrites
# public/picks_v4_beta_live.json every 10-30 min on this Mac; this script upserts it into
# slate_snapshots (key='picks_v4_beta_live'), which the app already knows how to read.
# Runs from cron every 5 min; skips silently when the file hasn't changed.
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/picks_v4_beta_live.json"
STAMP="$DIR/scripts/.live_picks_sync.sha"
[ -f "$FILE" ] || exit 0
# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
[ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ] && exit 0
# wrap as a slate_snapshots row: {key, payload}
BODY=$(python3 - "$FILE" <<'PY'
import json,sys
payload=json.load(open(sys.argv[1]))
print(json.dumps([{"key":"picks_v4_beta_live","payload":payload}]))
PY
)
HTTP=$(curl -s -o /tmp/live_picks_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "$BODY")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  echo "$(date '+%F %T') synced live picks ($HTTP)"
else
  echo "$(date '+%F %T') SYNC FAILED http=$HTTP $(head -c 200 /tmp/live_picks_sync_resp.txt)" >&2
  exit 1
fi
