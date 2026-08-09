#!/usr/bin/env python3
"""WCAG contrast for the colour system — measured against EVERY surface, not a
hand-picked exam.

WHY THIS FILE WAS REWRITTEN. The previous version gated 28 hand-listed pairs and
reported "0 fail", and the 0 was true and nearly meaningless:

  * it composited text against `--paper` (#ffffff) and `#f8fbff` ONLY. `body` is
    `linear-gradient(180deg,#f8fbff 0%,#f8fbff 44%,#eef3fa 100%)` and cards sit
    on `--sunken` (#f0f2f5). Below the 44% stop, and inside every sunken well,
    the real background is DARKER than anything the gate measured, so a token
    could pass the gate and fail on the page. `--ink4` did exactly that: it was
    "fixed" to 4.51 against the lightest surface and still read 4.17 on
    --sunken, under the 10px team record the fix was written for.
  * it DEFINED `P["push"]` and then never tested it. The row labelled "PUSH
    slate on card" tested `P["slate"]`, a different value. The push semantic
    colour had never been measured at all — and it failed, at 4.16.
  * a pair that is not on the list cannot fail. `.bx-tbl thead th` (10px,
    --ink4 on --sunken) was never on the list.

So the gate is now a MATRIX, not a list: every token the sheet uses as text is
measured against every surface the app actually paints text on, and the WORST
of them is what has to clear. Adding a colour cannot quietly skip the gate,
because there is no list to forget to add it to.

Run:  python3 scripts/contrast_check.py [--verbose]
"""
import sys


def rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def over(fg, bg, a):
    """composite fg at alpha a over bg"""
    return tuple(round(f * a + b * (1 - a)) for f, b in zip(fg, bg))


def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(x) for x in c)
    return .2126 * r + .7152 * g + .0722 * b


def ratio(fg, bg):
    a, b = lum(fg), lum(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + .05) / (lo + .05)


# ── EVERY SURFACE THE APP PAINTS TEXT ON, read off the shipped light theme ──
# The card is rgba(255,255,255,.76) over the page, so its true fill sits between
# the page and pure white; both ends are here, and so is every step below it.
SURFACES = {
    "paper #ffffff":        rgb("#ffffff"),   # --paper, card upper bound
    "page top #f8fbff":     rgb("#f8fbff"),   # --bg / gradient 0–44%
    "page bottom #eef3fa":  rgb("#eef3fa"),   # gradient 100% — WAS NEVER TESTED
    "card #f4f6f8":         rgb("#f4f6f8"),
    "sunken #f0f2f5":       rgb("#f0f2f5"),   # wells, box-score heads — NEVER TESTED
}

INK = rgb("#0b1220")

# ── every token used as TEXT, at its shipped value ──────────────────────────
TEXT = {
    "--ink":       INK,
    "--ink2":      rgb("#334155"),
    "--ink3/--slate/--push": rgb("#5c6879"),
    "--ink4":      rgb("#656f7d"),   # the app's smallest type (10px team record)
    "--gold/--live": rgb("#8a5f06"),
    "--golddeep":  rgb("#6d4c06"),
    "--green/--hit": rgb("#07734f"),
    "--red/--miss": rgb("#c02038"),
    "--blue/--pick/--acc/--over/--under": rgb("#1a5bc4"),
    "--acc2/--b1": rgb("#154a9e"),
    "--amber/--dirbad": rgb("#9c4a08"),
    "--dirnear":   rgb("#5c6879"),
    "--n3/--navy2": rgb("#626d7e"),
    "--cyan":      rgb("#08749e"),
    "--g3":        rgb("#077250"),
    "--r3":        rgb("#b8213c"),
    "--a3":        rgb("#845c06"),
    "--b3":        rgb("#1c5fd0"),
}

# ── non-text marks: dots, rules, rings, meter fills. WCAG 1.4.11 floor of 3.0 ──
MARKS = {
    "--livemark (live rule/dot)": rgb("#a67208"),
    "--dirgood fill":  rgb("#1a5bc4"),
    "--dirbad fill":   rgb("#9c4a08"),
    "--dirnear fill":  rgb("#5c6879"),
}

# ── text on a TINTED wash of its own hue (chips, pills, plates) ─────────────
WASHES = [
    ("gold ink on gold wash .09 (live chip / --livebg)", rgb("#8a5f06"), rgb("#a67208"), .09, 4.5),
    ("green ink on green wash .10 (WIN chip)", rgb("#07734f"), rgb("#06784f"), .10, 4.5),
    ("red ink on red wash .09 (LOSS chip)", rgb("#c02038"), rgb("#c4203a"), .09, 4.5),
    ("blue ink on blue wash .09 (in-flight OUR WAY)", rgb("#1a5bc4"), rgb("#1456d6"), .09, 4.5),
    ("amber ink on amber wash .10 (in-flight CHASING)", rgb("#9c4a08"), rgb("#9c4a08"), .10, 4.5),
    ("slate ink on slate wash .10 (in-flight TIGHT)", rgb("#5c6879"), rgb("#697588"), .10, 4.5),
    ("push ink on push wash .08", rgb("#5c6879"), rgb("#5c6879"), .08, 4.5),
    ("cyan icon on cyan wash .14 (news)", rgb("#08749e"), rgb("#08749e"), .14, 3.0),
]

# ── white glyph/word on a saturated fill (the seals, the LIVE badge, tabs) ──
FILLS = [
    ("white on WIN fill        (won seal)", rgb("#07734f"), 4.5),
    ("white on LOSS fill       (lost seal)", rgb("#c02038"), 4.5),
    ("white on GOLD fill       (masthead LIVE badge)", rgb("#8a5f06"), 4.5),
    ("white on ACCENT fill     (active tab, was the WIN green)", rgb("#1a5bc4"), 4.5),
    ("white on --b1 fill       (sharp-toward chip, shipped chip)", rgb("#154a9e"), 4.5),
    ("white on --b2 fill       (switch ON, strength pill)", rgb("#1a5bc4"), 4.5),
]

# ── pairs that must be DISTINGUISHABLE from each other, not just legible ────
# The system claims these carry different meanings; if two of them resolve to
# the same ink the claim is false, and that is how --live/--gold/--amber shipped
# as one colour wearing three names.
DISTINCT = [
    ("--live vs --amber   (a game being played vs a bet chasing)",
     rgb("#8a5f06"), rgb("#9c4a08")),
    ("--under vs --miss   (the side we took vs a graded loss)",
     rgb("#1a5bc4"), rgb("#c02038")),
    ("--over vs --hit     (the side we took vs a graded win)",
     rgb("#1a5bc4"), rgb("#07734f")),
    ("--acc vs --hit      (the app's accent vs a graded win)",
     rgb("#1a5bc4"), rgb("#07734f")),
    ("--dirgood vs --hit  (an ungraded bet running our way vs a win)",
     rgb("#1a5bc4"), rgb("#07734f")),
    ("--dirbad vs --miss  (an ungraded bet running against us vs a loss)",
     rgb("#9c4a08"), rgb("#c02038")),
]


def de76(a, b):
    """CIE76 ΔE — crude, and entirely good enough to answer 'are these the same
    colour wearing two names'. Anything under ~2 is at or below the JND."""
    def lab(c):
        def f(v):
            v /= 255
            return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
        r, g, bb = (f(x) for x in c)
        X = (r * .4124 + g * .3576 + bb * .1805) / .95047
        Y = r * .2126 + g * .7152 + bb * .0722
        Z = (r * .0193 + g * .1192 + bb * .9505) / 1.08883

        def gg(t):
            return t ** (1 / 3) if t > 216 / 24389 else (841 / 108) * t + 4 / 29
        fx, fy, fz = gg(X), gg(Y), gg(Z)
        return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))
    la, lb = lab(a), lab(b)
    return sum((x - y) ** 2 for x, y in zip(la, lb)) ** .5


if __name__ == "__main__":
    verbose = "--verbose" in sys.argv
    fails = []
    n = 0

    print("═══ TEXT TOKENS × EVERY SURFACE  (min 4.5, worst surface must clear) ═══")
    print(f"{'TOKEN':38} {'WORST':>6} {'ON':<22} RESULT")
    print("─" * 88)
    for name, fg in sorted(TEXT.items()):
        rs = {s: ratio(fg, bg) for s, bg in SURFACES.items()}
        worst_s = min(rs, key=rs.get)
        worst = rs[worst_s]
        n += 1
        ok = worst >= 4.5
        if not ok:
            fails.append(f"{name} = {worst:.2f} on {worst_s}")
        print(f"{name:38} {worst:6.2f} {worst_s:<22} {'PASS' if ok else '**FAIL**'}")
        if verbose:
            for s, r in rs.items():
                print(f"    {s:24} {r:5.2f}")

    print("\n═══ NON-TEXT MARKS × EVERY SURFACE  (min 3.0) ═══")
    for name, fg in sorted(MARKS.items()):
        rs = {s: ratio(fg, bg) for s, bg in SURFACES.items()}
        worst_s = min(rs, key=rs.get)
        worst = rs[worst_s]
        n += 1
        ok = worst >= 3.0
        if not ok:
            fails.append(f"{name} = {worst:.2f} on {worst_s}")
        print(f"{name:38} {worst:6.2f} {worst_s:<22} {'PASS' if ok else '**FAIL**'}")

    print("\n═══ INK ON ITS OWN TINTED WASH (over every surface) ═══")
    for label, fg, tint, alpha, mn in WASHES:
        worst, worst_s = 99.0, ""
        for s, bg in SURFACES.items():
            r = ratio(fg, over(tint, bg, alpha))
            if r < worst:
                worst, worst_s = r, s
        n += 1
        ok = worst >= mn
        if not ok:
            fails.append(f"{label} = {worst:.2f} on {worst_s}")
        print(f"{label:56} {worst:6.2f} {mn:4.1f}  {'PASS' if ok else '**FAIL**'}")

    print("\n═══ WHITE ON A SATURATED FILL ═══")
    for label, bg, mn in FILLS:
        r = ratio(rgb("#ffffff"), bg)
        n += 1
        ok = r >= mn
        if not ok:
            fails.append(f"{label} = {r:.2f}")
        print(f"{label:56} {r:6.2f} {mn:4.1f}  {'PASS' if ok else '**FAIL**'}")

    print("\n═══ MEANINGS THAT MUST NOT SHARE AN INK  (ΔE ≥ 10) ═══")
    for label, a, b in DISTINCT:
        d = de76(a, b)
        n += 1
        ok = d >= 10
        if not ok:
            fails.append(f"{label} = ΔE {d:.1f} — same ink, two meanings")
        print(f"{label:58} ΔE {d:6.1f}  {'PASS' if ok else '**FAIL**'}")

    print("\n" + "═" * 88)
    print(f"{n} checks · {len(fails)} fail")
    for f in fails:
        print(f"  FAIL  {f}")
    sys.exit(1 if fails else 0)
