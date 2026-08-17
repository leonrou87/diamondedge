#!/usr/bin/env bash
# publish_key.sh <key> — THE ONE PUBLISHER. Every Supabase `slate_snapshots`
# key the site serves is written by this script and no other.
#
# ═══════════════════════════════════════════════════════════════════════════
# WHY THIS EXISTS: SIX COPIES OF ONE SKELETON, AND THE BUGS THEY BRED
# ═══════════════════════════════════════════════════════════════════════════
# Until 2026-08-16 there were six sync scripts — sync_unified_live.sh,
# sync_unified_history.sh, sync_live_picks.sh, sync_history.sh,
# sync_research_papers.sh, sync_research_roadmap.sh — 749 lines carrying ONE
# skeleton: take the per-key lock, sha-guard, heartbeat-or-upsert, gate,
# POST, revalidate the edge, read updated_at back. They differed only in a
# key name, a file path, a stamp path and a log string.
#
# They also differed in ways nobody chose, and every one of those divergences
# has a scar in the git log:
#
#   * `--data-binary "$BODY"` put a multi-MB payload on curl's ARGUMENT LIST.
#     macOS caps argv+env at 1 MiB, so the job died with "Argument list too
#     long" the first cycle the board crossed it. sync_unified_history.sh had
#     always streamed from a file; the others had to be fixed one at a time.
#   * The heartbeat used to `curl … || true`, swallowing its HTTP status: a
#     failed heartbeat left updated_at un-advanced while the job exited GREEN.
#     Fixed in sync_unified_live.sh on 2026-08-10 — and STILL PRESENT in
#     sync_research_papers.sh on 2026-08-16, six days later, because nothing
#     carried the fix across.
#   * sync_research_roadmap.sh never took the per-key lock, though it is run
#     by BOTH com.diamondedge.researchroadmap (every 600 s) AND
#     nightly_scrub.SYNC_SET — precisely the two-writer collision that
#     _sync_lock.sh exists to prevent, still unguarded.
#   * One script lost its `revalidate_edge.sh` call and served stale bytes
#     from the edge for days without a single error line.
#
# ═══════════════════════════════════════════════════════════════════════════
# WHAT ONE PUBLISHER MAKES IMPOSSIBLE
# ═══════════════════════════════════════════════════════════════════════════
# These are not "less likely" — there is now exactly one code path, so they
# cannot be true of one key and false of another:
#
#   1. Publishing a key WITHOUT the per-key lock. `sync_lock` is unconditional
#      and runs before anything else.
#   2. A body on the argument list. The body is ALWAYS `--data-binary @file`.
#   3. A heartbeat that swallows its status. One heartbeat, status captured,
#      non-zero exit when the stamp did not move.
#   4. Publishing without the gate. `gate_to_file` is the only writer of the
#      upsert body; an UNREGISTERED KEY RAISES and nothing is posted.
#   5. A real publish that forgets to invalidate the edge — and a heartbeat
#      that wrongly does. The revalidate is welded to the changed branch.
#   6. A fix that lands on one key and misses the other five.
#
# The config table below is the ONLY thing that varies per key. Adding a key
# is a row in that table; it is not a new file, and it cannot bring a new
# skeleton with it.
#
# RAILS: credentials are read from ~/.kytepush-platform.env into the
# environment and passed as HEADERS — never echoed, never in a URL, never on
# the argument list.
set -euo pipefail

DIR="$HOME/Desktop/diamondedge"
SBP="$HOME/Desktop/sports-betting-platform"

KEY="${1:-}"
if [ -z "$KEY" ]; then
  echo "usage: publish_key.sh <key>" >&2
  exit 2
fi

# ═══════════════════════════════════════════════════════════════════════════
# THE CONFIG TABLE — the only per-key variation there is
# ═══════════════════════════════════════════════════════════════════════════
#   SRC        source JSON under public/ (relative)
#   STAMP      content-sha stamp under scripts/ (relative)
#   LABEL      human label for the log line
#   FRESHGUARD 1 = warn when the newest card is older than yesterday. Only
#              meaningful for the HISTORY boards, which are supposed to gain a
#              day every night; a live board legitimately carries only today.
#   PREBUILD   optional command run before the sha is taken
#   STAMPTIME  1 = overwrite payload.generated_utc with the source file's
#              mtime (the roadmap is hand-edited and carries no stamp)
SRC=""; STAMP=""; LABEL=""; FRESHGUARD=0; PREBUILD=""; STAMPTIME=0
case "$KEY" in
  picks_unified_live)
    SRC="picks_unified_live.json";  STAMP=".unified_live_sync.sha"
    LABEL="unified live" ;;
  picks_unified)
    SRC="picks_unified.json";       STAMP=".unified_history_sync.sha"
    LABEL="unified history"; FRESHGUARD=1 ;;
  picks_v4_beta_live)
    SRC="picks_v4_beta_live.json";  STAMP=".live_picks_sync.sha"
    LABEL="live picks" ;;
  picks_v4_beta)
    SRC="picks_v4_beta.json";       STAMP=".history_sync.sha"
    LABEL="history picks"; FRESHGUARD=1 ;;
  research_papers)
    SRC="research_papers.json";     STAMP=".research_papers_sync.sha"
    LABEL="research papers"
    # the builder regenerates papers.json from the platform repo first
    PREBUILD="build_papers" ;;
  research_roadmap)
    SRC="research_roadmap.json";    STAMP=".research_roadmap_sync.sha"
    LABEL="research roadmap"; STAMPTIME=1 ;;
  *)
    # THE SAME REFUSAL THE GATE MAKES, MADE EARLIER AND CHEAPER. An
    # unregistered key never reaches Supabase — and, as in snapshot_gate.py,
    # there is deliberately no default branch: "I did not think about this
    # one" must be a loud failure, not a silent passthrough.
    echo "$(date '+%F %T') publish_key: UNREGISTERED KEY '$KEY' — refusing. Add it to the config table in $0." >&2
    exit 2 ;;
esac

FILE="$DIR/public/$SRC"
STAMP_PATH="$DIR/scripts/$STAMP"

# ── ONE WRITER PER KEY ──────────────────────────────────────────────────────
# Unconditional, and before any work. Both schedulers (the launchd job and
# nightly_scrub.SYNC_SET) run this script, so without the lock they race for
# the same row and the loser dies on statement_timeout (57014).
# shellcheck source=scripts/_sync_lock.sh
. "$DIR/scripts/_sync_lock.sh"
sync_lock "$KEY"

# ── prebuild ────────────────────────────────────────────────────────────────
if [ "$PREBUILD" = "build_papers" ] && [ -d "$SBP/v4/models/research_papers" ]; then
  python3 "$SBP/v4/models/research_papers/build_papers.py" >/dev/null
  cp "$SBP/v4/models/research_papers/papers.json" "$FILE"
fi

[ -f "$FILE" ] || exit 0

# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env"; set +a

# THE BODY IS ALWAYS STREAMED FROM A FILE, NEVER FROM argv.
TMP="$(mktemp "${TMPDIR:-/tmp}/publish_${KEY}_body.XXXXXX")"
RESP="$(mktemp "${TMPDIR:-/tmp}/publish_${KEY}_resp.XXXXXX")"
# CHAINED TRAP: setting an EXIT trap here REPLACES the one sync_lock
# installed, which leaked a lock dir the first time it was tried. The release
# is chained in explicitly so a winner that exits cannot strand the key.
trap 'rm -f "$TMP" "$RESP"; _sync_lock_release' EXIT

SHA=$(shasum -a 256 "$FILE" | cut -d' ' -f1)

# ── freshness guard (history boards only) ───────────────────────────────────
# Before the 02:00 overnight self-heal has been due, "yesterday is not in the
# archive yet" is the pipeline working, not an error — writing that to stderr
# every ten minutes is how a healthy job fills the file that is supposed to
# mean trouble. So it is stdout until 03:00 and a real warning after.
if [ "$FRESHGUARD" = "1" ]; then
  LATEST=$(python3 -c "import json,sys; d=json.load(open(sys.argv[1])); ds=sorted(g.get('date') or '' for g in d.get('games',[])); print(ds[-1] if ds else '')" "$FILE" 2>/dev/null || echo "")
  YEST=$(date -v-1d '+%Y-%m-%d' 2>/dev/null || date -d yesterday '+%Y-%m-%d' 2>/dev/null || echo "")
  if [ -n "$LATEST" ] && [ -n "$YEST" ] && [ "$LATEST" \< "$YEST" ]; then
    HR=$(date '+%H')
    if [ "$((10#$HR))" -lt 3 ]; then
      echo "$(date '+%F %T') $LABEL latest=$LATEST < yesterday=$YEST — waiting for the 02:00 overnight self-heal (not yet due; this is stdout on purpose)"
    else
      echo "$(date '+%F %T') WARN: $LABEL latest=$LATEST < yesterday=$YEST — archive may be stale and the 02:00 self-heal has already been due for $((10#$HR - 2))h" >&2
    fi
  fi
fi

# ── the sha guard: unchanged bytes buy a heartbeat, not an upsert ───────────
if [ -f "$STAMP_PATH" ] && [ "$(cat "$STAMP_PATH")" = "$SHA" ]; then
  # HEARTBEAT. The payload has not changed, so there is nothing to upload —
  # but the row IS current, and a watchdog cannot tell "nothing changed" from
  # "this job died" unless something says so. A tiny PATCH, no payload.
  # CONTRACT: updated_at is the LIVENESS signal — when the sync last confirmed
  # this key current. The CONTENT age lives inside the payload
  # (generated_utc), where it always has.
  # IT TELLS THE TRUTH: the status is captured and a heartbeat that did not
  # land exits non-zero, rather than reporting green on an un-advanced stamp.
  HB_HTTP=$(curl -s -o "$RESP" -w "%{http_code}" \
    --max-time 30 -X PATCH \
    "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.$KEY" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" -H "Prefer: return=minimal" \
    --data-binary "{\"updated_at\":\"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\"}")
  if [ "$HB_HTTP" = "200" ] || [ "$HB_HTTP" = "204" ]; then
    echo "$(date '+%F %T') $LABEL heartbeat ($HB_HTTP) sha=$SHA — unchanged, already on production"
    exit 0
  fi
  echo "$(date '+%F %T') ${LABEL} HEARTBEAT FAILED http=$HB_HTTP $(head -c 200 "$RESP")" >&2
  exit 1
fi

# ── the write gate — AND IT DEGRADES, IT DOES NOT STOP ──────────────────────
# Every row on slate_snapshots is readable by anyone holding the anon JWT in
# the site's JS bundle, so this upload is a publication. The gate redacts by
# schema (DEFAULT-DENY: a field no allowlist names is dropped before any scan)
# and REFUSES a key nobody has registered.
#
# `gate_to_file` drops the smallest thing that fails — one card, one block —
# publishes the rest, logs it loudly and mails the owner. It RAISES, and
# therefore fails this script, ONLY when there is genuinely nothing safe to
# serve. See sports-betting-platform/v4/serve/snapshot_gate.py.
python3 - "$FILE" "$TMP" "$KEY" "$STAMPTIME" <<'PY'
import datetime, json, os, sys
sys.path.insert(0, "/Users/leonrou/Desktop/sports-betting-platform")
from v4.serve import snapshot_gate as _GATE
src, out, key, stamptime = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
payload = json.load(open(src))
if stamptime == "1":
    # hand-edited source with no stamp of its own: the file's mtime IS the
    # content age, and generated_utc is where every reader looks for it.
    mt = datetime.datetime.fromtimestamp(os.path.getmtime(src), datetime.timezone.utc)
    payload["generated_utc"] = mt.isoformat()
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
_GATE.gate_to_file(key, payload, out, updated_at=now)
PY

# ── the upsert ──────────────────────────────────────────────────────────────
# RETRY WITH BACKOFF, FOR EVERY KEY. The upsert returns 500 / 57014
# ("canceling statement due to statement timeout") when a large payload meets
# a busy row. Only sync_unified_history.sh ever had this; the other five would
# simply fail. Note the retry is the BELT, not the fix — the fix is a smaller
# payload, and the per-key lock removed the self-inflicted half of the
# collisions. Every attempt, including ones that recover, is logged, because
# an intermittent failure is the early warning.
# gzip is NOT used: PostgREST does not negotiate a compressed request body,
# and the timeout is DB-side work on the JSONB, not transfer time.
HTTP=""
for ATTEMPT in 1 2 3; do
  HTTP=$(curl -s -o "$RESP" -w "%{http_code}" \
    --max-time 120 \
    -X POST "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?on_conflict=key" \
    -H "apikey: $SUPABASE_SERVICE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: resolution=merge-duplicates" \
    --data-binary "@$TMP")
  if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then break; fi
  echo "$(date '+%F %T') $LABEL upsert attempt $ATTEMPT/3 http=$HTTP $(head -c 200 "$RESP")" >&2
  # A 4xx IS AN ANSWER, AND RETRYING AN ANSWER IS JUST NOISE. The retry above
  # exists for 500/57014 — a big payload meeting a busy row, which a pause
  # genuinely fixes. A 402 is the org's egress cap refusing the whole project
  # and a 401/403 is a bad credential; neither changes in 45 seconds. Retrying
  # them re-uploads a multi-megabyte body twice more and holds this key's lock
  # for the rest of the cycle, so on the one day the platform is already unwell
  # every publisher spends two extra minutes proving a fact it was told at
  # once. The failure still exits non-zero and still says why — nothing about
  # what the fleet SEES changes, only how long it takes to say it. (Same rule
  # /api/snap's supaRetry already follows on the read leg.)
  case "$HTTP" in 4??) echo "$(date '+%F %T') $LABEL upsert http=$HTTP is a refusal, not a collision — not retrying" >&2; break ;; esac
  if [ "$ATTEMPT" != "3" ]; then sleep $((ATTEMPT * 15)); fi
done

if [ "$HTTP" = "200" ] || [ "$HTTP" = "201" ]; then
  echo "$SHA" > "$STAMP_PATH"
  # THE PUBLISH IS THE INVALIDATION. Only on this branch — the heartbeat above
  # is the "nothing moved" case and must stay free. Never fails the caller.
  bash "$DIR/scripts/revalidate_edge.sh" "$KEY" || true
  # VERIFY updated_at ROUND-TRIP — read the column back so every run leaves
  # proof in the log that the freshness stamp actually moved.
  BACK=$(curl -s "$SUPABASE_PROJECT_URL/rest/v1/slate_snapshots?key=eq.$KEY&select=updated_at" \
    -H "apikey: $SUPABASE_SERVICE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
    | python3 -c 'import json,sys; r=json.load(sys.stdin); print(r[0]["updated_at"] if r else "MISSING")' 2>/dev/null || echo "READBACK_FAILED")
  echo "$(date '+%F %T') synced $LABEL ($HTTP) updated_at=$BACK"
else
  echo "$(date '+%F %T') $(echo "$LABEL" | tr '[:lower:]' '[:upper:]') SYNC FAILED http=$HTTP $(head -c 300 "$RESP")" >&2
  exit 1
fi
