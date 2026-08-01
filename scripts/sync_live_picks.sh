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
if [ -f "$STAMP" ] && [ "$(cat "$STAMP")" = "$SHA" ]; then
  # HEARTBEAT (2026-07-31). The payload has not changed, so there is nothing to
  # upload — but the row IS current, and a watchdog cannot tell "nothing changed"
  # apart from "this job died" unless something says so. Stamp updated_at alone
  # (a tiny PATCH, no payload, negligible egress). CONTRACT: updated_at is the
  # LIVENESS signal — when the sync last confirmed this key current. The CONTENT
  # age lives inside the payload (generated_utc), where it always has.
  curl -s -o /dev/null -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_v4_beta_live" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}" || true
  exit 0
fi
# wrap as a slate_snapshots row: {key, payload, updated_at}
# updated_at IS SET EXPLICITLY (2026-07-31). PostgREST's
# `Prefer: resolution=merge-duplicates` upsert only writes the columns present
# in the request body, so omitting updated_at left this key advertising its
# original INSERT time forever while the payload was being rewritten every
# cycle — picks_v4_beta_live sat at 2026-07-06 while syncing fine. A freshness
# signal that lies is worse than no signal: the watchdog cannot see a real
# outage on a key that is always stale. See RUNBOOK "Watchdog" gotcha.
# BODY GOES TO A FILE, NEVER TO argv. `--data-binary "$BODY"` puts the whole
# payload on curl's argument list, and macOS caps that at 1 MiB (ARG_MAX): the
# moment the payload crosses it the sync dies with "Argument list too long" —
# a hard cliff with no warning shoulder, which is exactly how sync_unified_live
# broke on 2026-07-31. `@file` streams it instead, so size stops being a cliff.
BODYFILE=$(mktemp -t live_picks_sync_body)
trap 'rm -f "$BODYFILE"' EXIT
python3 - "$FILE" "$BODYFILE" <<'PY'
import datetime,json,sys
payload=json.load(open(sys.argv[1]))
now=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
with open(sys.argv[2],"w") as fh:
    json.dump([{"key":"picks_v4_beta_live","payload":payload,
                "updated_at":now}], fh)
PY
HTTP=$(curl -s -o /tmp/live_picks_sync_resp.txt -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$BODYFILE")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP"
  # VERIFY updated_at ROUND-TRIP — read the column back through the REST API so
  # every run leaves proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_v4_beta_live&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$(date '+%F %T') synced live picks ($HTTP) updated_at=$BACK"
else
  echo "$(date '+%F %T') SYNC FAILED http=$HTTP $(head -c 200 /tmp/live_picks_sync_resp.txt)" >&2
  exit 1
fi
