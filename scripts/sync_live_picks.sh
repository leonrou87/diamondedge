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
# ═══ THE MEMBERS' HALF OF THIS BOARD (2026-08-14) ═══
# This key had NO sealed twin, and that was not cosmetic. `picks_v4_beta_live`
# is in the client's PREMIUM_SHAPES (app/page.tsx:981), so an entitled reader
# asks /api/premium for it on every board poll and got a 404 — and the client's
# `premiumOk` flag is MODULE-WIDE (app/page.tsx:997): one 404 suppresses the
# premium path for EVERY key for 120 s, so a member's next picks_unified_live
# read silently fell through to the public, locked board.
# It mattered more after the publish sprint inverted this schema to default-deny:
# the public grid row is now 4 top-level keys, so the full grid exists for a
# member ONLY through the sealed twin this script now writes.
# shellcheck source=scripts/seal_lib.sh
source "$DIR/scripts/seal_lib.sh"
FULL_TWIN="$HOME/Desktop/sports-betting-platform/v4/serve/state/private/picks_v4_beta_live.full.json"
SEAL_STAMP="$DIR/scripts/.live_picks_seal.sha"
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
  HB_HTTP=$(curl -s -o /tmp/live_picks_heartbeat_resp.txt -w "%{http_code}" \
    --max-time 30 -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_v4_beta_live" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}")
  if [ "$HB_HTTP" = "200" ] || [ "$HB_HTTP" = "204" ]; then
    echo "$(date '+%F %T') live picks heartbeat ($HB_HTTP) sha=$SHA — unchanged, already on production"
  else
    echo "$(date '+%F %T') LIVE PICKS HEARTBEAT FAILED http=$HB_HTTP $(head -c 200 /tmp/live_picks_heartbeat_resp.txt)" >&2
    exit 1
  fi
  # THE TWIN CAN MOVE WHEN THE PUBLIC BYTES DID NOT. The public row is now a
  # 4-key allowlisted projection, so the full board can change materially
  # while these bytes are identical — seal on this branch too. Non-fatal:
  # members lose freshness, never the public board.
  seal_full_guarded "$FULL_TWIN" picks_v4_beta_live "$SEAL_STAMP" || true
  if [ "$SEAL_WROTE" = "1" ]; then
    bash "$DIR/scripts/revalidate_edge.sh" picks_v4_beta_live || true
  fi
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
_GATE.gate_to_file("picks_v4_beta_live",payload,sys.argv[2],updated_at=now)
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
  # Seal the members' twin from the PRIVATE full board. Never fatal, and it
  # never falls back to pushing the full board in the clear — see seal_lib.sh.
  seal_full_guarded "$FULL_TWIN" picks_v4_beta_live "$SEAL_STAMP" || true
  # THE PUBLISH IS THE INVALIDATION (2026-08-09). Only on this branch — the
  # heartbeat branch above is the "nothing changed" case and must stay free.
  bash "$DIR/scripts/revalidate_edge.sh" picks_v4_beta_live || true
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
