# seal_lib.sh — SEAL A FULL BOARD FOR MEMBERS, ONCE, IN ONE PLACE.
#
# Sourced by every publisher that has a premium twin. Not executable on its own.
#
# ═══ WHY THIS FILE EXISTS (2026-08-14) ═══
# `seal_full_guarded` was defined twice — sync_unified_live.sh and
# sync_unified_history.sh — with byte-identical bodies and two different
# comments above the node resolver. A third publisher (sync_live_picks.sh) then
# needed it, and the honest options were "paste it a third time" or "put it
# somewhere". The sprint that produced this file spent a week on the cost of
# the same decision living in six shell scripts, so: somewhere.
#
# ═══ THE CONTRACT ═══
# Callers must define $DIR (the diamondedge checkout) before sourcing, because
# that is where seal_premium.mjs lives. Callers get:
#
#   SEAL_WROTE          0/1 — set to 1 when a seal was actually uploaded, so a
#                       publisher can invalidate the edge tag on the heartbeat
#                       branch when the FULL twin moved and the public bytes
#                       did not.
#   seal_full_guarded <full.json> <key> <stamp-file>
#                       Seals the twin into `<key>__sealed` unless its content
#                       hash is unchanged. Returns 0 on success or skip.
#
# ═══ THE FAILURE RULE, AND IT IS THE WHOLE POINT ═══
# A seal failure must NEVER take down the public publish and must NEVER fall
# back to pushing the full board in the clear. Members lose freshness; the
# public board is already published and correct. Every caller invokes this
# with `|| true` for that reason.
#
# ═══ OPEN ACCESS SKIPS THE SEAL ENTIRELY (2026-08-15) ═══
# With DE_OPEN_ACCESS=1 the platform publishes every public variant WHOLE, so
# the sealed twin is a second copy of a board the public route already gives
# away. /api/premium now answers 402 `open_access` without reading it, which
# means nothing on the internet can open a sealed row — and a row nobody can
# read is not worth a node process, an upsert, or a seal-failure line in the
# log every ten minutes (29 of them on 2026-08-14 alone). So: skip.
#
# The stamp file is deliberately NOT cleared. If open access is turned off, the
# next cycle hashes the twin, finds the stamp stale the moment content moves,
# and seals again with no manual step. Nothing here is deleted; the sealer, the
# key and the route all still work the day the paywall comes back.
SEAL_WROTE=0

seal_full_guarded() {
  local FULL="$1" KEY="$2" SEAL_STAMP="$3" SSHA
  [ -f "$FULL" ] || return 0
  if [ "${DE_OPEN_ACCESS:-0}" = "1" ]; then
    echo "$(date '+%F %T') premium seal $KEY skipped — DE_OPEN_ACCESS=1 (the public board is the full board; nothing can open a sealed row)"
    return 0
  fi
  # Hash the CONTENT, not the bytes: the twin is rewritten every cycle and only
  # `generated_utc` moves, so hashing the file would re-upsert a multi-MB
  # identical sealed row every few minutes and pay for it in egress.
  SSHA=$(/opt/homebrew/bin/python3 - "$FULL" <<'PY'
import hashlib, json, sys
p = json.load(open(sys.argv[1]))
for k in ("generated_utc", "generated_at"):
    p.pop(k, None)
print(hashlib.sha256(json.dumps(p, sort_keys=True).encode()).hexdigest())
PY
) || SSHA=""  # unreadable twin: fall through and let seal_premium.mjs say why
  if [ -n "$SSHA" ] && [ -f "$SEAL_STAMP" ] && [ "$(cat "$SEAL_STAMP")" = "$SSHA" ]; then
    echo "$(date '+%F %T') premium seal $KEY unchanged (sha=${SSHA:0:12}) — skipped"
    return 0
  fi
  # NODE RESOLVER (2026-08-13): under launchd PATH is /usr/bin:/bin:... — bare
  # `node` was "command not found" on EVERY launchd run, so the seal only ever
  # succeeded when this script was run from a user shell. That is why the
  # sealed rows sat at Aug 11 while the public board stayed current.
  local NODE
  NODE="$(command -v node || true)"
  [ -n "$NODE" ] || NODE="$(ls -t "$HOME"/.nvm/versions/node/*/bin/node 2>/dev/null | head -1)"
  [ -n "$NODE" ] || NODE="/opt/homebrew/bin/node"
  if "$NODE" "$DIR/scripts/seal_premium.mjs" "$FULL" "$KEY"; then
    [ -n "$SSHA" ] && echo "$SSHA" > "$SEAL_STAMP"
    SEAL_WROTE=1
    return 0
  fi
  echo "$(date '+%F %T') WARN premium seal failed (public board is published and correct)" >&2
  return 1
}
