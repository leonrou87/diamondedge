#!/usr/bin/env bash
# revalidate_edge.sh <key> [<key>...] — tell the edge a payload really changed.
#
# WHY. Until 2026-08-09 every cached payload expired on a TIMER, so the number of
# Supabase reads was 86400/ttl per cache shard — the same at nine users and at
# ten thousand, and utterly unrelated to how often the data actually moved.
# Measured on picks_unified: 564 origin reads a day against 4 real publishes.
#
# The sync scripts are the only things that know when a write is real: each one
# compares a content SHA and skips the upload when it matches, so it can tell a
# genuine publish from a heartbeat. This is the one line that lets it say so.
# Called ONLY on the changed branch of a sync — never on the heartbeat branch,
# because a heartbeat is precisely the "nothing moved" case whose whole purpose
# is to cost nothing.
#
# NEVER FAILS THE CALLER. By the time this runs the payload is already in
# Supabase and the site is already correct; this call only decides whether the
# edge finds out now or at its safety-net revalidate a few minutes from now. So
# it swallows every error and always exits 0. The sync scripts run under
# `set -e`, and a caching optimisation must not be able to kill a publish.
#
# RAILS: the secret is read from ~/.kytepush-platform.env into a variable and
# passed as a HEADER. Never echoed, never in the URL, never on the argument list.
set -uo pipefail

[ "$#" -ge 1 ] || exit 0

ENDPOINT="${DIAMONDEDGE_REVALIDATE_URL:-https://diamondedge.kytepush.com/api/revalidate}"

# creds: read from disk, never printed
set -a; source "$HOME/.kytepush-platform.env" 2>/dev/null || true; set +a
[ -n "${SNAP_REVALIDATE_SECRET:-}" ] || exit 0

# Build {"keys":["a","b"]} without a shell loop that could mangle quoting.
BODY=$(python3 -c '
import json,sys
print(json.dumps({"keys": sys.argv[1:]}))' "$@")

# --max-time so a hung edge cannot wedge a cron job that is otherwise finished.
# The REPLY is kept, because the reply is the new version map — see below.
REPLY=$(curl -s --max-time 10 \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SNAP_REVALIDATE_SECRET" \
  --data-binary "$BODY" 2>/dev/null || true)

# ── AND THEN BE THE FIRST READER, so nobody else finds the cache empty ───────
# Invalidating alone is only half the job, and the missing half is the expensive
# one. None of these cache layers COALESCE concurrent misses: measured
# 2026-08-09, fifty simultaneous requests against a cold entry cost up to 59
# Supabase reads, and an earlier pass measured 200 concurrent CDN misses costing
# 192. So "empty the cache and walk away" converts a steady drip into a spike,
# ~150 times a day, and at 10,000 users the spike is worse than the TTL it
# replaced.
#
# One request per key, issued now — while nobody is looking — fills the
# region-shared cache so every reader that follows hits it warm. The herd never
# forms because nothing cold is left for it to form around.
#
# ── AND IT MUST WARM THE **NEW** URL ────────────────────────────────────────
# This block used to learn the version by fetching /api/manifest, which the CDN
# holds for 10 s with 60 s of stale-while-revalidate. Measured on production
# straight after a publish: ages of 17 s, 29 s and 62 s with
# `x-vercel-cache: STALE`. So the warm read the PREVIOUS generation and warmed
# `?cv=<old>` — an already-warm URL nobody would request again — while the URL
# every reader was about to ask for was left cold. A warm aimed at the wrong
# object still returns HTTP 200, so nothing ever said so.
#
# The version now comes from the reply to the invalidation itself, which the
# endpoint reads fresh. A publisher never asks a cache what it just wrote.
#
# ONE SHAPE, not two. `?lite=1` used to be warmed for every key; page.tsx asks
# for it on exactly one (picks_unified). On picks_v4_beta the lite warm bought a
# guaranteed Postgres statement timeout on every publish. Since 2026-08-10 one
# origin read fills both shapes server-side, so `?cv=` alone leaves lite warm too.
#
# Entirely best-effort: the payload is already published and the safety-net
# revalidates already make the plain invalidate correct on its own.
BASE="${ENDPOINT%/api/*}"
for k in "$@"; do
  V=$(printf '%s' "$REPLY" | python3 -c '
import json,sys,urllib.parse
try:
    v=(json.load(sys.stdin).get("v") or {}).get(sys.argv[1])
    print(urllib.parse.quote(v) if v else "")
except Exception:
    print("")' "$k" 2>/dev/null || true)
  [ -n "$V" ] || continue
  curl -s -o /dev/null --max-time 45 --compressed \
    "$BASE/api/snap/$k?cv=$V" 2>/dev/null || true
done

exit 0
