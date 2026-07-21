#!/usr/bin/env bash
# sync_unified_history.sh — push the UNIFIED single-pick HISTORY board to Supabase
# so prior-day unified picks stay fresh WITHOUT a git deploy. The overnight cycle
# rewrites public/picks_unified.json (unified_model.build_unified_history);
# this upserts slate_snapshots(key='picks_unified'); the app reads Supabase first,
# static file as fallback. Mirrors sync_history.sh (streams from a file).
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
FILE="$DIR/public/picks_unified.json"
STAMP="$DIR/scripts/.unified_history_sync.sha"
TMP="$(mktemp /tmp/unified_history_sync_body.XXXXXX.json)"
trap 'rm -f "$TMP"' EXIT
[ -f "$FILE" ] || exit 0
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
# FRESHNESS GUARD — warn loudly if the unified history is missing recent days
LATEST=$(python3 -c "import json; d=json.load(open('$FILE')); ds=sorted(g.get('date') for g in d.get('games',[])); print(ds[-1] if ds else '')" 2>/dev/null)
YEST=$(date -v-1d '+%Y-%m-%d' 2>/dev/null || date -d yesterday '+%Y-%m-%d' 2>/dev/null)
if [ -n "$LATEST" ] && [ -n "$YEST" ] && [ "$LATEST" \< "$YEST" ]; then
  echo "$(date '+%F %T') WARN: unified history latest=$LATEST < yesterday=$YEST — archive may be stale (self-heal runs overnight)" >&2
fi
[ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ] && exit 0
python3 - "$FILE" "$TMP" <<'PY'
import json,sys
payload=json.load(open(sys.argv[1]))
json.dump([{"key":"picks_unified","payload":payload}], open(sys.argv[2],"w"))
PY
HTTP=$(curl -s -o /tmp/unified_history_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"; echo "$(date '+%F %T') synced unified history ($HTTP)"
else
  echo "$(date '+%F %T') UNIFIED HISTORY SYNC FAILED http=$HTTP $(head -c 300 /tmp/unified_history_sync_resp.txt)" >&2; exit 1
fi
