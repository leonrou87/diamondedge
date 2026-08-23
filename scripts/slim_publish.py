#!/usr/bin/env python3
"""slim_publish.py <key> <in.json> <out.json> — REMOVE WHAT NOTHING READS,
BEFORE THE ROW IS WRITTEN.

═══════════════════════════════════════════════════════════════════════════
WHY THIS EXISTS
═══════════════════════════════════════════════════════════════════════════
`picks_unified` is one jsonb row. The write role (`service_role`) has
`rolconfig = null`, so it inherits `authenticator`'s `statement_timeout = 8s`,
and the upsert of that row peaks at 7,141 ms measured on production. An 859 ms
margin, against a document that gains ~388 KB every night. It tips over daily:
PG 57014 ("canceling statement due to statement timeout") has appeared every
day since 2026-08-13 — 31 times on 2026-08-23, eight consecutive failed ticks
between 00:33 and 02:31, and the published history stood ~7.7 h stale.

The one-line database fix (`alter role service_role set statement_timeout`) is
the OWNER's to make and is on their list. This is the CODE-side half, and it is
worth doing regardless of the role setting: the cheapest bytes to write are the
ones nobody ever reads.

═══════════════════════════════════════════════════════════════════════════
WHAT IT DOES, AND THE ONE RULE IT OBEYS
═══════════════════════════════════════════════════════════════════════════
It REMOVES KEYS. It never adds one, never renames one, never rewrites a value.
Every surviving path holds the byte-identical value it held in the input —
`verify_subset()` asserts exactly that on every run, and the publisher refuses
to post if it does not hold.

So this cannot restate, re-grade or renumber a served pick: a pick's identity
(side, line, price, stars, result, locked_at_utc, source) is not in the drop
set, and `assert_picks_intact()` proves it field by field on every run. The
write-once rail is a postcondition here, not a promise.

═══════════════════════════════════════════════════════════════════════════
THE DROP SET, AND THE EVIDENCE FOR EVERY ENTRY
═══════════════════════════════════════════════════════════════════════════
Nothing is dropped because it is big. Each entry below was checked against
EVERY reader of this payload: `app/page.tsx`, `app/record/*`, `app/api/snap/*`,
`app/opengraph-image.tsx`, and the platform's own consumer census in
`v4/serve/desk_policy.py` (`_CARD_KNOWN_DROP`, `_DE_KNOWN_DROP`,
`_UNIFIED_KNOWN_DROP`) — the census that already grepped all 39 frontend files.

A "near-miss reader" — a surface that reads the same NAME at a DIFFERENT path —
disqualifies a field, even when the field is provably dead today. That is why
`diamondedge.chief.coherence` is NOT in this list: the coherence panel reads
`diamondedge.coherence`, a path this payload does not carry, so the block is
unread — but it is unread because a reader is looking one level up, and
deleting the data would make that mismatch permanent and silent. Reported, not
removed. Same reasoning keeps `pick.forge_strategy.tier_basis`.

Measured on the 2026-08-23 payload (13,778,665 B compact, 699 games):

  A. WHOLE GAME-LEVEL BLOCKS WITH NO READER
     analysts_v2      688,272 B  desk_policy `_CARD_KNOWN_DROP`: "0 consumers;
                                 also in LITE_STRIP". Fresh grep: comments only.
     scout            453,613 B  `_CARD_KNOWN_DROP`: "0 consumers ... dead
                                 weight". The four `scout` hits in page.tsx are
                                 the ANALYST named Scout (DESK_ORDER), not
                                 `g.scout`. Also in LITE_STRIP.
     live_progress      2,740 B  `_CARD_KNOWN_DROP`: "0 consumers". Fresh grep:
                                 four hits, all prose in comment blocks.

  B. EXACT DUPLICATES — dropped ONLY when byte-identical to the copy that IS
     read, so no information leaves the document at all.
     pick.adaptive_strategy
                      587,010 B  identical to `diamondedge.adaptive_strategy`
                                 in 493 of 493 games carrying it. The reader is
                                 page.tsx:4105, which reads it off the
                                 diamondedge BLOCK; desk_policy:1354 says so in
                                 as many words ("0 consumers (page.tsx reads it
                                 off the diamondedge BLOCK, not the payload)").
                                 Also already stripped by BOARD_STRIP_PICK.
     pick.forge_strategy.game_case
                      206,319 B  identical to `pick.game_case` in 110 of 110.
                                 page.tsx:15055 reads `pick.game_case` first and
                                 falls back to the nested copy — and the comment
                                 above it says the case MOVED to the pick level.
                                 The fallback is kept alive: the nested copy is
                                 dropped only when the top-level copy is present
                                 AND identical.

  C. `diamondedge` SUB-BLOCKS WITH NO READER. There is exactly one reader of
     `g.diamondedge` in the whole app — `deskChief()`, page.tsx:4090 — and it
     reads: action, spread_call{side,side_team,line,rationale_line},
     predicted_score{away,home,source}, adaptive_strategy, chief.adaptive_strategy,
     coherence, rationale_line, and (via its `raw:` passthrough) side, line,
     is_bet, desk_agreement. Everything below is outside that set.
     chief.ou_call    254,310 B  no reader at any path.
     chief.desk_combined
                      212,286 B  no reader at any path.
     desk_call        231,776 B  zero code hits in the entire frontend; the one
                                 match is a comment describing a surface that
                                 was never wired to this field.
     pattern          250,096 B  `_DE_KNOWN_DROP` names pattern_line and
                                 pattern_downgraded as 0-consumer; every
                                 `.pattern` hit in page.tsx binds to
                                 `record.patterns`, a different block.
     action_basis      57,021 B  `_DE_KNOWN_DROP`: "0 consumers (prose
                                 describing how AVOID was reached)".
     spread_call.note 152,650 B  deskChief reads four fields off spread_call and
                                 `note` is not one of them. One distinct string,
                                 repeated 355x.
     predicted_score.note
                       51,960 B  deskChief reads away/home/source. 74 distinct
                                 strings over 687 games.

  D. CONSTANT BOILERPLATE WITH NO READER. Each is a fixed explainer paragraph
     stamped onto every game — the same bytes, hundreds of times.
     pregame_line.note
                      209,583 B  ONE distinct 640-byte string, repeated 319x.
                                 `pregameLine()` (page.tsx:4245) enumerates the
                                 fields it reads — total, ou, run_line, spread,
                                 runline, book, sportsbook, best_book,
                                 locked_at_utc, locked_at, timestamp, source —
                                 and `note` is not among them.
     pick.forge_strategy.selected_reason
                       56,172 B  zero hits anywhere in the frontend.
     pick.forge_strategy.progressive_note
                       36,456 B  zero hits anywhere in the frontend.
     pick.forge_strategy.search_scope
                       36,270 B  DELIBERATELY RETIRED. page.tsx:20764: '"WHAT
                                 WAS SEARCHED" IS GONE (2026-08-09)' — the
                                 surface that printed it was deleted because it
                                 described the search algorithm well enough to
                                 implement. The payload kept shipping it.
     pick.confidence.definition.why_not
                       53,431 B  zero hits. Its sibling `what_it_is` IS read
                                 (page.tsx:9848) and is kept.

  NOT DROPPED, though the arithmetic tempts: `forge_strategy.voice` (632,575 B
  — `forgeVoice()` reads status/name/paragraphs), `analysts[].completeness_note`
  (205,141 B — page.tsx:4000), `weather.as_of_basis` (36,680 B — page.tsx:7054),
  `chief.coherence` and `tier_basis` (near-miss readers, above).

═══════════════════════════════════════════════════════════════════════════
WHAT THIS IS NOT
═══════════════════════════════════════════════════════════════════════════
It is a CONSTANT-FACTOR cut against a document that grows ~388 KB a night. It
buys headroom; it does not bound the write. The bound is a split — a hot row
plus week-sharded frozen archives, each written once and thereafter only
heartbeat — and that is a bigger change than a failing sync should wait on.
The arithmetic is in the commit message; do not mistake this for the ceiling.

Runs post-gate on purpose: the gate is the only writer of the upsert body, and
a pass that only removes keys can never widen what the gate decided to publish.
"""
from __future__ import annotations

import json
import sys

# ── the drop set ────────────────────────────────────────────────────────────
# Paths are relative to one element of `games[]`. A tuple is a nested path.
# Dropping a path that is absent is a no-op, never an error: the engine emits
# different shapes on different eras and a missing block is not a surprise.
DROP_GAME = (
    ("analysts_v2",),
    ("scout",),
    ("live_progress",),
    ("pregame_line", "note"),
    ("diamondedge", "chief", "ou_call"),
    ("diamondedge", "chief", "desk_combined"),
    ("diamondedge", "desk_call"),
    ("diamondedge", "pattern"),
    ("diamondedge", "action_basis"),
    ("diamondedge", "spread_call", "note"),
    ("diamondedge", "predicted_score", "note"),
    ("pick", "forge_strategy", "selected_reason"),
    ("pick", "forge_strategy", "progressive_note"),
    ("pick", "forge_strategy", "search_scope"),
    ("pick", "forge_strategy", "line_basis"),
    ("pick", "forge_strategy", "grading_policy"),
    ("pick", "forge_strategy", "voice", "sources"),
    ("pick", "forge_strategy", "voice", "name_basis"),
    ("pick", "confidence", "definition", "why_not"),
)

#: Dropped ONLY when byte-identical to the copy that is read. (drop_path, kept_path)
DROP_IF_SAME = (
    (("pick", "adaptive_strategy"), ("diamondedge", "adaptive_strategy")),
    (("pick", "forge_strategy", "game_case"), ("pick", "game_case")),
)

#: Dropped ONLY when the value is exactly reconstructible from a sibling that
#: survives — same rule as DROP_IF_SAME, one step weaker on identity.
#: `forge_strategy.voice.text` is `"\n\n".join(voice.paragraphs)` in 186 of 186
#: games that carry it. `forgeVoice()` (page.tsx:11298) is the only reader of
#: the voice block and reads status / name / paragraphs — never `text`.
DROP_IF_JOINED = (
    (("pick", "forge_strategy", "voice", "text"),
     ("pick", "forge_strategy", "voice", "paragraphs"), "\n\n"),
)

#: Keys this pass applies to. Anything else passes through untouched — an
#: unregistered key is not an error here (the GATE is where a key must be
#: registered), it simply gets no slimming.
SLIM_KEYS = ("picks_unified",)

#: The fields that make a served pick the pick it is. Never in the drop set;
#: proved unchanged on every run. This is the write-once rail as a postcondition.
PICK_IDENTITY = ("side", "line", "price", "stars", "star_tier", "result",
                 "source", "locked_at_utc", "timestamp", "lead_time",
                 "suggested_units", "our_prob", "our_prob_basis", "vegas_line",
                 "certified", "superseded")


def _canon(x) -> str:
    return json.dumps(x, separators=(",", ":"), sort_keys=True)


def _get(node, path):
    for k in path:
        if not isinstance(node, dict) or k not in node:
            return None, False
        node = node[k]
    return node, True


def _drop(node, path) -> int:
    """Remove `path` from `node`. Returns bytes removed (0 if absent)."""
    for k in path[:-1]:
        if not isinstance(node, dict) or not isinstance(node.get(k), dict):
            return 0
        node = node[k]
    if not isinstance(node, dict) or path[-1] not in node:
        return 0
    return len(_canon(node.pop(path[-1])))


def slim(payload: dict, key: str) -> tuple[dict, dict]:
    """Return (slimmed_payload, per-path bytes removed). Pure key removal."""
    if key not in SLIM_KEYS:
        return payload, {}
    out = json.loads(_canon(payload)) if False else json.loads(json.dumps(payload))
    games = out.get("games")
    if not isinstance(games, list):
        return out, {}
    removed: dict[str, int] = {}
    for g in games:
        if not isinstance(g, dict):
            continue
        for path in DROP_GAME:
            n = _drop(g, path)
            if n:
                removed[".".join(path)] = removed.get(".".join(path), 0) + n
        for drop_path, kept_path in DROP_IF_SAME:
            a, has_a = _get(g, drop_path)
            b, has_b = _get(g, kept_path)
            if has_a and has_b and a is not None and _canon(a) == _canon(b):
                n = _drop(g, drop_path)
                if n:
                    lbl = ".".join(drop_path) + " (dup)"
                    removed[lbl] = removed.get(lbl, 0) + n
        for drop_path, src_path, sep in DROP_IF_JOINED:
            a, has_a = _get(g, drop_path)
            b, has_b = _get(g, src_path)
            if (has_a and has_b and isinstance(a, str) and isinstance(b, list)
                    and all(isinstance(x, str) for x in b) and a == sep.join(b)):
                n = _drop(g, drop_path)
                if n:
                    lbl = ".".join(drop_path) + " (= join(paragraphs))"
                    removed[lbl] = removed.get(lbl, 0) + n
        # an emptied container is noise, not data
        de = g.get("diamondedge")
        if isinstance(de, dict) and isinstance(de.get("chief"), dict) and not de["chief"]:
            de.pop("chief", None)
    return out, removed


# ── the postconditions ──────────────────────────────────────────────────────
def verify_subset(before, after, path="$") -> None:
    """Every surviving path holds the byte-identical value it held before.

    This is the whole safety argument: a pass that can only remove keys cannot
    restate a pick, cannot widen what the gate published, and cannot invent a
    field. Asserted on the real payload on every publish, not just in tests."""
    if isinstance(after, dict):
        if not isinstance(before, dict):
            raise AssertionError(f"{path}: type changed {type(before)} -> dict")
        for k, v in after.items():
            if k not in before:
                raise AssertionError(f"{path}.{k}: ADDED by the slim pass")
            verify_subset(before[k], v, f"{path}.{k}")
    elif isinstance(after, list):
        if not isinstance(before, list) or len(before) != len(after):
            raise AssertionError(f"{path}: list length changed")
        for i, v in enumerate(after):
            verify_subset(before[i], v, f"{path}[{i}]")
    elif _canon(before) != _canon(after):
        raise AssertionError(f"{path}: VALUE REWRITTEN")


def assert_picks_intact(before, after) -> None:
    """No served pick's identity moved. Games keep their count and their order."""
    gb = before.get("games") or []
    ga = after.get("games") or []
    if len(gb) != len(ga):
        raise AssertionError(f"games count changed {len(gb)} -> {len(ga)}")
    for i, (b, a) in enumerate(zip(gb, ga)):
        if str(b.get("game_id") or "") != str(a.get("game_id") or ""):
            raise AssertionError(f"games[{i}]: game_id moved — order changed")
        if str(b.get("date") or "") != str(a.get("date") or ""):
            raise AssertionError(f"games[{i}]: date changed")
        pb, pa = b.get("pick"), a.get("pick")
        if isinstance(pb, dict) != isinstance(pa, dict):
            raise AssertionError(f"games[{i}]: pick block appeared/vanished")
        if isinstance(pb, dict):
            for f in PICK_IDENTITY:
                if _canon(pb.get(f)) != _canon(pa.get(f)):
                    raise AssertionError(
                        f"games[{i}].pick.{f}: RESTATED {pb.get(f)!r} -> {pa.get(f)!r}")
        if _canon(b.get("final")) != _canon(a.get("final")):
            raise AssertionError(f"games[{i}].final: RESTATED")
    for k in ("record", "by_date_record", "adaptive_strategy_record",
              "adaptive_strategy_by_date", "days_incomplete", "generated_utc",
              "premium_variant", "featured", "picks_post_contract"):
        if _canon(before.get(k)) != _canon(after.get(k)):
            raise AssertionError(f"top-level `{k}` changed — record surfaces are not this pass's business")


def run(key: str, src: str, dst: str, quiet: bool = False) -> int:
    before = json.load(open(src))
    after, removed = slim(before, key)
    verify_subset(before, after)
    assert_picks_intact(before, after)
    nb, na = len(_canon(before)), len(_canon(after))
    with open(dst, "w") as f:
        json.dump(after, f, separators=(",", ":"))
    if not quiet:
        cut = nb - na
        pct = (100.0 * cut / nb) if nb else 0.0
        for p, n in sorted(removed.items(), key=lambda x: -x[1]):
            print(f"  slim {n:>9,} B  {p}", file=sys.stderr)
        print(f"slim {key}: {nb:,} -> {na:,} B  (-{cut:,} B, -{pct:.1f}%)",
              file=sys.stderr)
    return na


# ── selftest ────────────────────────────────────────────────────────────────
def _selftest() -> int:
    ok = fail = 0

    def check(name, cond):
        nonlocal ok, fail
        if cond:
            ok += 1
        else:
            fail += 1
            print(f"FAIL {name}")

    strat = {"rule_key": "x", "label": "L", "rationale_line": "r" * 400}
    doc = {
        "generated_utc": "2026-08-23T00:00:00Z",
        "record": {"headline": {"w": 1}},
        "games": [{
            "game_id": "g1", "date": "2026-08-22",
            "analysts_v2": [{"a": 1}], "scout": {"note": "n"},
            "live_progress": {"note": "n"},
            "pregame_line": {"total": {"line": 8.5}, "note": "boiler" * 50},
            "pick": {"side": "over", "line": 8.5, "price": -110, "stars": 3,
                     "result": "win", "adaptive_strategy": dict(strat),
                     "game_case": {"text": "case"},
                     "confidence": {"definition": {"what_it_is": "w", "why_not": "x" * 300}},
                     "forge_strategy": {"voice": {"status": "ACTIVE", "name": "N",
                                                  "paragraphs": ["one", "two"],
                                                  "text": "one\n\ntwo",
                                                  "sources": ["s1"], "name_basis": "nb"},
                                        "line_basis": "lb", "grading_policy": "gp",
                                        "game_case": {"text": "case"},
                                        "selected_reason": "s" * 200,
                                        "progressive_note": "p" * 200,
                                        "search_scope": "q" * 200,
                                        "tier_basis": "keep me"}},
            "diamondedge": {"action": "PLAY", "adaptive_strategy": dict(strat),
                            "chief": {"ou_call": {"x": 1}, "desk_combined": {"y": 2},
                                      "coherence": {"voices": [1, 2]}},
                            "desk_call": {"z": 3}, "pattern": {"line": "L"},
                            "action_basis": "a" * 100,
                            "spread_call": {"side": "home", "note": "n" * 100},
                            "predicted_score": {"away": 4, "home": 5, "note": "n" * 100}},
        }],
    }
    src = json.loads(json.dumps(doc))
    out, removed = slim(doc, "picks_unified")
    g = out["games"][0]

    check("analysts_v2 dropped", "analysts_v2" not in g)
    check("scout dropped", "scout" not in g)
    check("live_progress dropped", "live_progress" not in g)
    check("pregame_line.note dropped", "note" not in g["pregame_line"])
    check("pregame_line.total kept", g["pregame_line"]["total"]["line"] == 8.5)
    check("pick.adaptive_strategy dropped (dup)", "adaptive_strategy" not in g["pick"])
    check("diamondedge.adaptive_strategy KEPT", g["diamondedge"]["adaptive_strategy"] == strat)
    check("forge_strategy.game_case dropped (dup)", "game_case" not in g["pick"]["forge_strategy"])
    check("pick.game_case KEPT", g["pick"]["game_case"] == {"text": "case"})
    check("forge_strategy.voice KEPT", g["pick"]["forge_strategy"]["voice"]["status"] == "ACTIVE")
    check("tier_basis KEPT", g["pick"]["forge_strategy"]["tier_basis"] == "keep me")
    _v = g["pick"]["forge_strategy"]["voice"]
    check("voice.text dropped (= join)", "text" not in _v)
    check("voice.paragraphs KEPT", _v["paragraphs"] == ["one", "two"])
    check("voice.name KEPT", _v["name"] == "N")
    check("voice.sources dropped", "sources" not in _v)
    check("voice.name_basis dropped", "name_basis" not in _v)
    check("line_basis dropped", "line_basis" not in g["pick"]["forge_strategy"])
    check("grading_policy dropped", "grading_policy" not in g["pick"]["forge_strategy"])
    # a voice.text that is NOT the join must survive untouched
    d2 = json.loads(json.dumps(doc))
    d2["games"][0]["pick"]["forge_strategy"]["voice"]["text"] = "hand written"
    o2, _ = slim(d2, "picks_unified")
    check("voice.text KEPT when it differs from join(paragraphs)",
          o2["games"][0]["pick"]["forge_strategy"]["voice"]["text"] == "hand written")
    check("selected_reason dropped", "selected_reason" not in g["pick"]["forge_strategy"])
    check("progressive_note dropped", "progressive_note" not in g["pick"]["forge_strategy"])
    check("search_scope dropped", "search_scope" not in g["pick"]["forge_strategy"])
    check("why_not dropped", "why_not" not in g["pick"]["confidence"]["definition"])
    check("what_it_is KEPT", g["pick"]["confidence"]["definition"]["what_it_is"] == "w")
    check("chief.ou_call dropped", "ou_call" not in g["diamondedge"]["chief"])
    check("chief.desk_combined dropped", "desk_combined" not in g["diamondedge"]["chief"])
    check("chief.coherence KEPT (near-miss reader)", g["diamondedge"]["chief"]["coherence"] == {"voices": [1, 2]})
    check("desk_call dropped", "desk_call" not in g["diamondedge"])
    check("pattern dropped", "pattern" not in g["diamondedge"])
    check("action_basis dropped", "action_basis" not in g["diamondedge"])
    check("spread_call.note dropped", "note" not in g["diamondedge"]["spread_call"])
    check("spread_call.side KEPT", g["diamondedge"]["spread_call"]["side"] == "home")
    check("predicted_score.note dropped", "note" not in g["diamondedge"]["predicted_score"])
    check("predicted_score.away KEPT", g["diamondedge"]["predicted_score"]["away"] == 4)
    check("pick identity intact", all(g["pick"][k] == src["games"][0]["pick"][k]
                                      for k in ("side", "line", "price", "stars", "result")))
    check("input not mutated", src == doc)
    check("removed ledger non-empty", sum(removed.values()) > 0)

    # postconditions must actually bite
    try:
        verify_subset(src, out)
        ok += 1
    except AssertionError as e:
        fail += 1
        print(f"FAIL verify_subset on a legal slim: {e}")
    try:
        assert_picks_intact(src, out)
        ok += 1
    except AssertionError as e:
        fail += 1
        print(f"FAIL assert_picks_intact on a legal slim: {e}")

    bad = json.loads(json.dumps(out))
    bad["games"][0]["pick"]["line"] = 9.5
    try:
        assert_picks_intact(src, bad)
        fail += 1
        print("FAIL assert_picks_intact did NOT catch a restated line")
    except AssertionError:
        ok += 1
    bad2 = json.loads(json.dumps(out))
    bad2["games"][0]["NEW"] = 1
    try:
        verify_subset(src, bad2)
        fail += 1
        print("FAIL verify_subset did NOT catch an ADDED key")
    except AssertionError:
        ok += 1
    bad3 = json.loads(json.dumps(out))
    bad3["games"] = []
    try:
        assert_picks_intact(src, bad3)
        fail += 1
        print("FAIL assert_picks_intact did NOT catch a dropped game")
    except AssertionError:
        ok += 1

    # an unregistered key is passed through untouched
    other, rem2 = slim(json.loads(json.dumps(doc)), "picks_unified_live")
    check("non-slim key untouched", other == doc and rem2 == {})
    # idempotent
    twice, _ = slim(json.loads(json.dumps(out)), "picks_unified")
    check("idempotent", twice == out)
    # a payload with no games survives
    nog, _ = slim({"generated_utc": "x"}, "picks_unified")
    check("no games[] survives", nog == {"generated_utc": "x"})

    print(f"slim_publish selftest: {ok} passed, {fail} failed")
    return 1 if fail else 0


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "--selftest":
        sys.exit(_selftest())
    if len(sys.argv) != 4:
        print("usage: slim_publish.py <key> <in.json> <out.json> | --selftest",
              file=sys.stderr)
        sys.exit(2)
    run(sys.argv[1], sys.argv[2], sys.argv[3])
