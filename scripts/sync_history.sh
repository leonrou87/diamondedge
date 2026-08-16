#!/usr/bin/env bash
# sync_history.sh — publish the v4-beta HISTORY grid board (slate_snapshots key 'picks_v4_beta').
#
# THIS IS A SHIM. On 2026-08-16 the six sync scripts were collapsed into ONE
# publisher, scripts/publish_key.sh, with a per-key config table. They were
# 749 lines carrying a single skeleton — lock, sha-guard, heartbeat-or-upsert,
# gate, POST, revalidate, read back — and they had drifted apart in ways that
# caused real incidents: a body on argv, a heartbeat that swallowed its HTTP
# status, a missing per-key lock, a lost edge revalidation, retry logic in
# exactly one of the six. One code path makes that class of bug impossible.
#
# The FILENAME is kept because two schedulers name it: the launchd job
# com.diamondedge.* and v4/serve/nightly_scrub.py's SYNC_SET. Keeping the
# entry points stable meant the consolidation needed no change to either.
#
# All behaviour, and the config for this key, live in publish_key.sh.
exec bash "$HOME/Desktop/diamondedge/scripts/publish_key.sh" picks_v4_beta
