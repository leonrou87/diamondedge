#!/usr/bin/env python3
"""board_contract_check.py — THE OFF-MACHINE DEAD-MAN'S SWITCH, made honest.

═══════════════════════════════════════════════════════════════════════════════
WHY THIS IS A FILE AND NOT TEN LINES OF BASH IN THE WORKFLOW
═══════════════════════════════════════════════════════════════════════════════
The switch it replaces had a perfect record: 35 runs, 35 successes, ZERO alerts
ever emitted. Its alert path had never executed in production even once, and it
went live 2026-08-13T09:09Z — after all four of the bad mornings it was built
for. An alarm nobody has ever seen fire is a hypothesis, not a safety net.

So the decision logic lives here, where `test_board_contract.py` can drill every
branch of it on a laptop in a second, and the workflow keeps only the plumbing.

═══════════════════════════════════════════════════════════════════════════════
THE THREE DEFECTS THIS FIXES (2026-08-14 forensics)
═══════════════════════════════════════════════════════════════════════════════
1. IT WAS BLIND AT DAWN, which is the whole point of it.
       H=$(date -u +%H)
       IN_HOURS=0; { [ "$H" -ge 15 ] || [ "$H" -lt 7 ]; } && IN_HOURS=1
   15:00-07:00 UTC is 08:00-24:00 PT. The pick freeze is 03:10 PT and the
   engine's own contract (daily_cycle_report.json) is "the UI should expect the
   board by 06:00 PT" — BOTH inside the excluded block. The comment even
   reasoned "overnight the board legitimately sleeps until the 03:10 PT freeze",
   and then kept sleeping for five more hours past it. 11 of its last 35 runs
   landed inside that blind window. Replay 2026-08-11 and its first possible
   alert is 08:00 PT, roughly five hours after the picks were due.
   -> the window now opens at the CONTRACT hour, 06:00 PT (13:00 UTC).

2. IT MEASURED FRESHNESS AND CALLED IT CORRECTNESS. A board republished every
   five minutes carrying ZERO picks on a 14-game slate — exactly 2026-08-14 —
   passed it perfectly. Freshness is not correctness.
   -> it now also asserts the board PREDATES nothing: a stamp older than today's
      freeze cannot contain today's decisions, whatever its age in minutes.

3. IT PULLED THE WHOLE BOARD TO READ ONE TIMESTAMP, from the UNPINNED
   /api/snap/picks_unified_live — 529 KB, uncompressed, every run. That is the
   same check/repair mismatch that produced 28 false "REPAIR FAILED" alarms in
   publish_guard.sh (the unpinned URL carries stale-while-revalidate=900, so the
   edge is entitled to serve a copy older than the threshold being measured).
   The platform side was swept to /api/manifest in 474bc3a; this was left.
   -> /api/manifest, ~313 bytes compressed, and it is the object readers
      themselves poll to learn which generation to ask for.

RAIL: this may only ever READ. It holds no credentials for anything but SMTP,
never writes to Supabase, and cannot repair — a dead-man's switch that can act
on production is a dead-man's switch that can break it.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import sys
import urllib.request
from zoneinfo import ZoneInfo

PT = ZoneInfo("America/Los_Angeles")
ORIGIN = "https://diamondedge.kytepush.com"
MANIFEST_URL = f"{ORIGIN}/api/manifest"
VERSION_URL = f"{ORIGIN}/api/snap/picks_unified_live?v=1"

FREEZE_PT_H, FREEZE_PT_M = 3, 10     # the pick freeze
CONTRACT_HOUR_PT = 6                 # publish_ready_hour_pt, from the engine
MAX_AGE_MIN = 90                     # generous: GitHub's cron is ~1h-resolution


def in_window(now_pt: dt.datetime) -> bool:
    """Is a current board contracted to exist right now?

    06:00 -> 24:00 PT. Before 06:00 the board legitimately sleeps: the freeze
    runs at 03:10 and the build follows it. That is a STATED reason now, not the
    accidental consequence of a UTC constant.
    """
    return now_pt.hour >= CONTRACT_HOUR_PT


def fetch_stamp(timeout: int = 20) -> str:
    """The board's CONTENT generation stamp, cheapest source first.

    /api/manifest builds `v` from the payload's own generated_utc (see
    app/api/manifest-source.ts — deliberately NOT the updated_at column, which
    the sync scripts heartbeat every cycle). So this is the content clock, and a
    heartbeat cannot make a stale board look fresh to it.
    """
    req = urllib.request.Request(
        MANIFEST_URL, headers={"User-Agent": "board-contract-check/1",
                               "Accept-Encoding": "br, gzip"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            v = (json.load(r).get("v") or {}).get("picks_unified_live") or ""
        if v:
            return v
    except Exception:  # noqa: BLE001 — fall through to the one-key stamp
        pass
    req = urllib.request.Request(
        VERSION_URL, headers={"User-Agent": "board-contract-check/1"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r).get("v") or ""


def evaluate(now_pt: dt.datetime, stamp: "str | None") -> tuple[str, str]:
    """-> (verdict, human reason). verdict in {ok, sleeping, stale,
    contract-broken, unreachable, unparseable}.

    `stamp is None` means the fetch itself failed — that is `unreachable`, and
    it is an alert in its own right: if GitHub cannot read the board, neither
    can a reader.
    """
    if not in_window(now_pt):
        return "sleeping", (f"{now_pt:%H:%M} PT — before the {CONTRACT_HOUR_PT}:00 PT "
                            f"contract hour; the board is allowed to be last "
                            f"night's.")
    if stamp is None:
        return "unreachable", ("the board could not be read at all from outside "
                               "the network. If GitHub cannot reach it, neither "
                               "can a reader.")
    if not stamp:
        return "unreachable", "the board served no version stamp at all."
    try:
        gen_pt = dt.datetime.fromisoformat(
            stamp.replace("Z", "+00:00")).astimezone(PT)
    except ValueError:
        return "unparseable", f"the board's version stamp is not a date: {stamp!r}"

    freeze = now_pt.replace(hour=FREEZE_PT_H, minute=FREEZE_PT_M,
                            second=0, microsecond=0)
    if gen_pt < freeze:
        return "contract-broken", (
            f"it is {now_pt:%H:%M} PT and the served board was generated "
            f"{gen_pt:%F %H:%M} PT — BEFORE today's "
            f"{FREEZE_PT_H:02d}:{FREEZE_PT_M:02d} PT freeze. It cannot contain "
            f"today's decisions, however recently it was republished.")

    age_min = (now_pt - gen_pt).total_seconds() / 60.0
    if age_min > MAX_AGE_MIN:
        return "stale", (f"the served board is {age_min:.0f} minutes old "
                         f"(limit {MAX_AGE_MIN}). Generated {gen_pt:%F %H:%M} PT.")
    return "ok", (f"board generated {gen_pt:%F %H:%M} PT, {age_min:.0f} min ago.")


ALERTING = {"stale", "contract-broken", "unreachable", "unparseable"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--drill", default="none",
                    help="force a verdict without touching production — the "
                         "canary that proves the mail path works")
    ap.add_argument("--github-output", default=None)
    a = ap.parse_args()

    now_pt = dt.datetime.now(PT)
    if a.drill and a.drill != "none":
        verdict = a.drill
        reason = ("THIS IS A DRILL. No real fault. It exists to prove this "
                  "alarm's email path actually works — the switch it replaced "
                  "ran 35 times and never once executed its alert branch.")
    else:
        try:
            stamp = fetch_stamp()
        except Exception as e:  # noqa: BLE001
            stamp = None
            print(f"fetch failed: {type(e).__name__}: {e}", file=sys.stderr)
        verdict, reason = evaluate(now_pt, stamp)

    alert = verdict in ALERTING
    print(f"verdict={verdict} alert={int(alert)}")
    print(f"reason: {reason}")
    if a.github_output:
        with open(a.github_output, "a") as f:
            f.write(f"verdict={verdict}\n")
            f.write(f"alert={'true' if alert else 'false'}\n")
            f.write(f"reason={reason}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
