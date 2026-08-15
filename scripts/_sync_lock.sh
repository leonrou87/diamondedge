# shellcheck shell=bash
# _sync_lock.sh — ONE WRITER PER SUPABASE KEY, ACROSS BOTH SCHEDULERS.
#
# ═══ WHY THIS EXISTS ═══
# Every one of these sync scripts has two schedulers, and neither knew about
# the other:
#
#   * a launchd job (com.diamondedge.historypicks and friends) every ~10 min
#   * `nightly_scrub.SYNC_SET`, which shells out to THE SAME FOUR SCRIPTS
#     during the overnight cycle
#
# So twice a night two processes POST a multi-megabyte JSONB upsert at the same
# `slate_snapshots` row. One takes the row lock; the other waits on it, and the
# wait counts against Postgres `statement_timeout`. The loser dies with
#
#     http=500 {"code":"57014","message":"canceling statement due to statement timeout"}
#
# MEASURED, three nights running — every 57014 in the sync logs lands inside
# the overnight cycle's window:
#
#     2026-08-13 09:46Z / 09:51Z / 09:52Z / 09:53Z   cycle 09:05–09:59Z
#     2026-08-14 09:45Z                              cycle 09:02–09:16Z
#     2026-08-15 09:11Z                              cycle 09:03–09:19Z
#
# It is not a slow row and it is not a flaky upstream. It is a lock queue, and
# retrying harder only lengthens the queue — which is why the 3-attempt retry
# in sync_unified_history.sh has burned all three attempts twice.
#
# ═══ WHY LOSING IS EXIT 0, NOT A FAILURE ═══
# The other holder is publishing THE SAME BYTES from THE SAME FILE — both
# schedulers read `public/<key>.json`. There is nothing for this process to
# add, and nothing was lost. Reporting that as a failure is how the owner got
# mailed "com.diamondedge.historypicks: FAILING" about a row that was being
# written correctly, by us, one process over.
#
# It is also self-correcting rather than fire-and-forget: the loser does NOT
# advance its `.sha` stamp, so if the winner somehow published something else,
# the next run (≤10 min) sees a stale stamp and publishes for real.
#
# macOS has no flock(1). `mkdir` is atomic on every filesystem in play, which
# is the whole requirement. A lock older than SYNC_LOCK_STALE_S is assumed to
# belong to a process that died holding it and is taken — a permanent lock left
# by a crash would be a worse outage than the one this prevents.
SYNC_LOCK_STALE_S="${SYNC_LOCK_STALE_S:-600}"
SYNC_LOCK_DIR=""

_sync_lock_release() {
  [ -n "$SYNC_LOCK_DIR" ] && rmdir "$SYNC_LOCK_DIR" 2>/dev/null
  return 0
}

# sync_lock <key> — acquire, or exit 0 having explained why not.
sync_lock() {
  local key="$1"
  local dir="${TMPDIR:-/tmp}/de_sync_lock.${key}"
  if mkdir "$dir" 2>/dev/null; then
    SYNC_LOCK_DIR="$dir"
    trap _sync_lock_release EXIT INT TERM
    return 0
  fi
  # held — is the holder alive, or did something die on top of it?
  local age=9999
  if [ -d "$dir" ]; then
    local mtime now
    mtime=$(stat -f %m "$dir" 2>/dev/null || echo 0)
    now=$(date +%s)
    age=$(( now - mtime ))
  fi
  if [ "$age" -gt "$SYNC_LOCK_STALE_S" ]; then
    echo "$(date '+%F %T') ${key}: stole a ${age}s-old sync lock (holder is gone)"
    rmdir "$dir" 2>/dev/null || true
    if mkdir "$dir" 2>/dev/null; then
      SYNC_LOCK_DIR="$dir"
      trap _sync_lock_release EXIT INT TERM
      return 0
    fi
  fi
  echo "$(date '+%F %T') ${key}: another sync of this key is in flight (${age}s) — skipping this run. Same source file, same bytes; the .sha stamp is left alone so the next run republishes if it turns out otherwise."
  exit 0
}
