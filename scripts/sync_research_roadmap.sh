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
[ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ] && exit 0
TMP=$(mktemp /tmp/research_roadmap_body.XXXXXX.json)
trap 'rm -f "$TMP"' EXIT
python3 - "$FILE" "$TMP" <<'PY'
import json,sys
payload=json.load(open(sys.argv[1]))
json.dump([{"key":"research_roadmap","payload":payload}], open(sys.argv[2],"w"))
PY
HTTP=$(curl -s -o /tmp/research_roadmap_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary @"$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  echo "$(date '+%F %T') synced research roadmap ($HTTP)"
else
  echo "$(date '+%F %T') RESEARCH ROADMAP SYNC FAILED http=$HTTP $(head -c 200 /tmp/research_roadmap_sync_resp.txt)" >&2
  exit 1
fi
