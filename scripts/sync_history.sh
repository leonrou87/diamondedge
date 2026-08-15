#!/usr/bin/env bash
# sync_history.sh — push the archived HISTORICAL pick payload to Supabase so prior-day picks
# stay fresh WITHOUT a git deploy (the recurring "yesterday shows all-PASS" bug: this file is a
# static Vercel asset that only updated on git push). Upserts slate_snapshots(key='picks_v4_beta');
# the app reads Supabase first, static file as fallback. Payload is ~8MB so we stream from a file.
set -euo pipefail
DIR="$HOME/Desktop/diamondedge"
# ONE WRITER PER KEY — the launchd job and nightly_scrub.SYNC_SET both run
# this exact script. See scripts/_sync_lock.sh for the 57014 it prevents.
# shellcheck source=scripts/_sync_lock.sh
. "$HOME/Desktop/diamondedge/scripts/_sync_lock.sh"
sync_lock picks_v4_beta

FILE="$DIR/public/picks_v4_beta.json"
STAMP="$DIR/scripts/.history_sync.sha"
# BSD mktemp only substitutes X's at the END of the template, so
# `history_sync_body.XXXXXX.json` was a FIXED filename and a second
# overlapping run died with "mkstemp failed: File exists" (seen in
# com.diamondedge.historypicks.err, 2026-08-09). Trailing X's, and the
# response body gets the same treatment for the same reason.
TMP="$(mktemp "${TMPDIR:-/tmp}/history_sync_body.XXXXXX")"
RESP="$(mktemp "${TMPDIR:-/tmp}/history_sync_resp.XXXXXX")"
# …AND THE LOCK IS RELEASED HERE, NOT ONLY IN _sync_lock.sh. This script
# sets its own EXIT trap, which REPLACES the one sync_lock installed —
# proven by a leaked lock dir on the first concurrency test. Chained, so
# a winner that exits cannot strand the key for the full stale window.
trap 'rm -f "$TMP" "$RESP"; _sync_lock_release' EXIT
[ -f "$FILE" ] || exit 0
set -a; source "$HOME/.kytepush-platform.env"; set +a
SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)
# FRESHNESS GUARD — warn loudly if the history is missing recent days (archive may be broken)
LATEST=$(python3 -c "import json,collections; d=json.load(open('$FILE')); ds=sorted(g.get('date') for g in d.get('games',[])); print(ds[-1] if ds else '')" 2>/dev/null)
YEST=$(date -v-1d '+%Y-%m-%d' 2>/dev/null || date -d yesterday '+%Y-%m-%d' 2>/dev/null)
# STDERR ONLY ONCE THE SELF-HEAL WAS ACTUALLY DUE (2026-08-15). This warning
# names its own remedy — "self-heal runs overnight" — and then wrote itself to
# stderr every ten minutes WHILE THAT WAS STILL PENDING: 77 lines in
# com.diamondedge.historypicks.err today, every one of them between 00:0x and
# 02:11 local, and none after the overnight run caught up. A job telling its
# error log that a scheduled repair has not happened yet, before the hour that
# repair is scheduled for, is the same defect the reconciliation rail was fixed
# for on 2026-08-15 (it mailed the owner at 07:15Z about a board that could not
# yet contain yesterday). The archive is rebuilt by the 02:00 local overnight
# run, so 03:00 is that promise plus an hour of slack — the same number
# v4/serve/unified_model.HANDOFF_GRACE_H uses for the same deadline.
#
# NOTHING IS HIDDEN: before the deadline it still prints, every run, on stdout,
# saying it is waiting. After it, it is stderr and it is a genuine WARN.
if [ -n "$LATEST" ] && [ -n "$YEST" ] && [ "$LATEST" \< "$YEST" ]; then
  HR=$(date '+%H')
  if [ "$((10#$HR))" -lt 3 ]; then
    echo "$(date '+%F %T') history latest=$LATEST < yesterday=$YEST — waiting for the 02:00 overnight self-heal (not yet due; this is stdout on purpose)"
  else
    echo "$(date '+%F %T') WARN: history latest=$LATEST < yesterday=$YEST — archive may be stale and the 02:00 self-heal has already been due for $((10#$HR - 2))h" >&2
  fi
fi
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
  HB_HTTP=$(curl -s -o /tmp/history_heartbeat_resp.txt -w "%{http_code}" \
    --max-time 30 -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_v4_beta" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}")
  if [ "$HB_HTTP" = "200" ] || [ "$HB_HTTP" = "204" ]; then
    echo "$(date '+%F %T') history heartbeat ($HB_HTTP) sha=$SHA — unchanged, already on production"
  else
    echo "$(date '+%F %T') HISTORY HEARTBEAT FAILED http=$HB_HTTP $(head -c 200 /tmp/history_heartbeat_resp.txt)" >&2
    exit 1
  fi
  exit 0
fi
# updated_at IS SET EXPLICITLY (2026-07-31). PostgREST's
# `Prefer: resolution=merge-duplicates` upsert only writes the columns present
# in the request body, so omitting updated_at left this key advertising its
# original INSERT time forever while the payload was being rewritten every
# night — picks_v4_beta sat at 2026-07-19 while syncing fine. A freshness
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
_GATE.gate_to_file("picks_v4_beta",payload,sys.argv[2],updated_at=now)
PY
HTTP=$(curl -s -o "$RESP" -w "%{http_code}" \
  -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates" \
  --data-binary "@$TMP")
if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  # VERIFY updated_at ROUND-TRIP — read the column back through the REST API so
  # every run leaves proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.picks_v4_beta&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$SHA" > "$STAMP"; echo "$(date '+%F %T') synced history ($HTTP) updated_at=$BACK"
  # THE PUBLISH IS THE INVALIDATION (2026-08-09). Only on this branch — the
  # heartbeat branch above is the "nothing changed" case and must stay free.
  "$DIR/scripts/revalidate_edge.sh" picks_v4_beta || true
else
  echo "$(date '+%F %T') HISTORY SYNC FAILED http=$HTTP $(head -c 300 "$RESP")" >&2; exit 1
fi
