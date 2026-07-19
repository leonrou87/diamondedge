#!/usr/bin/env bash
# sync_history.sh — push the archived HISTORICAL pick payload to Supabase so prior-day picks
# stay fresh WITHOUT a git deploy (the recurring "yesterday shows all-PASS" bug: this file is a
# static Vercel asset that only updated on git push). Upserts slate_snapshots(key='picks_v4_beta');
# the app reads Supabase first, static file as fallback. Payload is ~8MB so we stream from a file.
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/picks_v4_beta.json"
STAMP="$DIR/scripts/.history_sync.sha"
TMP="$(mktemp /tmp/history_sync_body.XXXXXX.json)"
trap 'rm -f "$TMP"' EXIT
[ -f "$FILE" ] || exit 0
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
[ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ] && exit 0
python3 - "$FILE" "$TMP" <<'PY'
import json,sys
payload=json.load(open(sys.argv[1]))
json.dump([{"key":"picks_v4_beta","payload":payload}], open(sys.argv[2],"w"))
PY
HTTP=$(curl -s -o /tmp/history_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"; echo "$(date '+%F %T') synced history ($HTTP)"
else
  echo "$(date '+%F %T') HISTORY SYNC FAILED http=$HTTP $(head -c 300 /tmp/history_sync_resp.txt)" >&2; exit 1
fi
