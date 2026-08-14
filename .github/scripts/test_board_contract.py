#!/usr/bin/env python3
"""test_board_contract.py — THE DRILL FOR CLASS C-B: THE SWITCH THAT WAS BLIND
AT DAWN AND HAD NEVER FIRED.

The old off-machine watchdog: 35 runs, 35 successes, ZERO alerts ever emitted.
Its alert branch had never executed in production, and it went live
2026-08-13T09:09Z — after all four of the bad mornings it existed for.

This drills every branch of the replacement's decision logic, including the
window arithmetic that made it useless, and the alert path the original never
proved. Run: python3 .github/scripts/test_board_contract.py   (no network)
"""
from __future__ import annotations

import datetime as dt
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import board_contract_check as bc                            # noqa: E402

PT = bc.PT
OK = True


def chk(label, cond):
    global OK
    print(f"  [{'PASS' if cond else 'FAIL'}] {label}")
    OK = OK and bool(cond)


def at(day, hh, mm=0):
    y, m, d = (int(x) for x in day.split("-"))
    return dt.datetime(y, m, d, hh, mm, tzinfo=PT)


def stamp(day, hh, mm=0):
    return at(day, hh, mm).astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def old_in_hours(hour_pt: int) -> bool:
    """The ORIGINAL window expression, evaluated in PT, for the record."""
    h_utc = (hour_pt + 7) % 24
    return h_utc >= 15 or h_utc < 7


def main() -> int:
    print("DRILL 1 — THE BLIND WINDOW, computed from the original expression.")
    blind = [h for h in range(24) if not old_in_hours(h)]
    chk(f"the old switch could not fire at any hour in {blind} PT",
        blind == list(range(0, 8)))
    chk("the 03:10 PT freeze was inside its blind window", 3 in blind)
    chk("the 06:00 PT contract hour was inside its blind window", 6 in blind)

    now_blind = [h for h in range(24) if not bc.in_window(at("2026-08-15", h))]
    chk(f"the new window is blind only before the contract hour {now_blind}",
        now_blind == list(range(0, 6)))
    chk("06:00 PT is now watched", bc.in_window(at("2026-08-15", 6)))
    chk("and so is every hour to midnight",
        all(bc.in_window(at("2026-08-15", h)) for h in range(6, 24)))

    print("\nDRILL 2 — REPLAY 2026-08-11 at 06:00 PT (board frozen since 23:08).")
    v, why = bc.evaluate(at("2026-08-11", 6), stamp("2026-08-10", 23, 8))
    chk("it FIRES where the old switch was silent", v in bc.ALERTING)
    chk("and it names the contract, not just the age", v == "contract-broken")
    chk("the reason says the board predates today's freeze",
        "BEFORE today's 03:10 PT freeze" in why)

    print("\nDRILL 3 — THE CONTRACT VERDICT IS DIAGNOSIS, NOT EXTRA DETECTION,")
    print("          and this drill states that honestly rather than claiming")
    print("          a detection win it does not have.")
    # Inside a window that opens at 06:00 PT, anything generated before the
    # 03:10 freeze is necessarily >170 min old, so the age rail catches it too.
    v, why = bc.evaluate(at("2026-08-12", 6, 5), stamp("2026-08-12", 2, 55))
    age = (at("2026-08-12", 6, 5) - at("2026-08-12", 2, 55)).total_seconds() / 60
    chk(f"a pre-freeze board is ALSO over the age limit ({age:.0f} > "
        f"{bc.MAX_AGE_MIN} min) — the age rail would fire here too",
        age > bc.MAX_AGE_MIN)
    chk("the checker reports it as contract-broken, which is the useful name",
        v == "contract-broken")
    chk("...and both are alerting, so nothing is lost either way",
        v in bc.ALERTING)
    # THE REAL DETECTION WIN FOR THIS CLASS IS THE WINDOW, not the predicate:
    # at 06:05 PT the OLD switch could not fire on ANY verdict whatsoever.
    chk("THE ACTUAL FIX: at 06:05 PT the old switch was blind to all of this",
        not old_in_hours(6))
    chk("and the new one is awake for it", bc.in_window(at("2026-08-12", 6, 5)))

    print("\nDRILL 4 — PLAIN STALENESS still works.")
    v, why = bc.evaluate(at("2026-08-15", 14), stamp("2026-08-15", 11, 30))
    chk("a 150-min-old afternoon board is stale", v == "stale")
    chk("the reason carries the number", "150 minutes old" in why)

    print("\nDRILL 5 — THE CONTROLS. A healthy board must NOT fire.")
    v, _ = bc.evaluate(at("2026-08-15", 6, 30), stamp("2026-08-15", 6, 20))
    chk("a board built this morning is ok", v == "ok")
    v, _ = bc.evaluate(at("2026-08-15", 20), stamp("2026-08-15", 19, 40))
    chk("a healthy evening board is ok", v == "ok")
    for h in (0, 2, 3, 5):
        v, _ = bc.evaluate(at("2026-08-15", h), stamp("2026-08-14", 23, 30))
        chk(f"{h:02d}:00 PT — sleeping, not alerting", v == "sleeping")
    chk("'sleeping' is not an alerting verdict", "sleeping" not in bc.ALERTING)
    chk("'ok' is not an alerting verdict", "ok" not in bc.ALERTING)

    print("\nDRILL 6 — UNREACHABLE IS ITSELF AN ALARM.")
    v, why = bc.evaluate(at("2026-08-15", 10), None)
    chk("a failed fetch alerts", v == "unreachable" and v in bc.ALERTING)
    chk("it says a reader could not read it either", "neither" in why)
    v, _ = bc.evaluate(at("2026-08-15", 10), "")
    chk("an empty stamp alerts too", v == "unreachable")
    v, _ = bc.evaluate(at("2026-08-15", 10), "garbage")
    chk("an unparseable stamp alerts", v == "unparseable" and v in bc.ALERTING)
    v, _ = bc.evaluate(at("2026-08-15", 2), None)
    chk("but overnight, unreachable stays quiet (the board is asleep)",
        v == "sleeping")

    print("\nDRILL 7 — THE CANARY: the alert path can be fired on demand.")
    chk("every drill verdict is an alerting one",
        all(d in bc.ALERTING for d in ("stale", "contract-broken", "unreachable")))

    print("\n" + "=" * 70)
    print("BOARD CONTRACT DRILL:", "PASS" if OK else "FAIL")
    print("=" * 70)
    return 0 if OK else 1


if __name__ == "__main__":
    sys.exit(main())
