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
curl -s -o /dev/null --max-time 6 \
  -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $SNAP_REVALIDATE_SECRET" \
  --data-binary "$BODY" 2>/dev/null || true

exit 0
