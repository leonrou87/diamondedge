#!/usr/bin/env python3
"""WCAG contrast for the pairs this colour sprint touches.

Every pair below is (label, foreground, background, min_ratio). min_ratio is 4.5
for body/small text, 3.0 for >=18.66px bold or >=24px text and for non-text UI
marks (dots, rules, rings) per WCAG 1.4.11.
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


# ── the palette, read off the SHIPPED page (getComputedStyle on :root) ───────
# The card is rgba(255,255,255,.76) over --bg, so its true fill sits between BG and
# pure white; every text pair is therefore checked against BOTH, and the worse of
# the two is what must clear. That brackets the real surface without guessing.
PAPER = rgb("#ffffff")           # --paper, upper bound of the card fill
BG = rgb("#f8fbff")              # --bg, lower bound of the card fill / the page
INK = rgb("#0b1220")             # --ink

P = {
    "gold":      rgb("#8a5f06"),   # --gold / --live   (text-safe gold)
    "goldc":     rgb("#a67208"),   # --livemark        (rules, dots, rings)
    "golddeep":  rgb("#6d4c06"),   # --golddeep
    "green":     rgb("#07734f"),   # --green / --hit / --over / --acc
    "red":       rgb("#c02038"),   # --red / --miss / --under
    "blue":      rgb("#1a5bc4"),   # --blue / --pick
    "slate":     rgb("#5c6879"),   # --slate
    "push":      rgb("#697588"),   # --push
    "cyan":      rgb("#08749e"),   # --cyan
    "ink":       INK,
    "ink2":      rgb("#334155"),
    "ink3":      rgb("#667085"),
    "ink4":      rgb("#6a7583"),   # darkened this sprint from #7a8797 (was 3.66:1)
    "ink4_old":  rgb("#7a8797"),
    "white":     rgb("#ffffff"),
}

PAIRS = [
    # ── CHANGED IN THIS SPRINT ────────────────────────────────────────────
    ("live state text  'Top 9th'      gold on card", P["gold"], PAPER, 4.5, "changed red→gold"),
    ("live state text  'Top 9th'      gold on page", P["gold"], BG, 4.5, "changed red→gold"),
    ("live dot                        gold on card", P["goldc"], PAPER, 3.0, "changed red→gold"),
    ("live card top rule              gold on card", P["goldc"], PAPER, 3.0, "changed red→gold"),
    ("live rule on gold wash          gold on tint", P["goldc"], over(P["goldc"], PAPER, .10), 3.0, "changed"),
    ("IN PLAY chip ink on gold wash", P["gold"], over(P["goldc"], PAPER, .11), 4.5, "changed green→gold"),
    ("live section label              gold on page", P["gold"], BG, 4.5, "changed red→gold"),
    ("game-page live 'BOTTOM 11TH'    gold on card", P["gold"], PAPER, 4.5, "changed red→gold"),
    ("live pill on gold wash (count)", P["gold"], over(P["goldc"], PAPER, .12), 4.5, "changed red→gold"),
    ("masthead LIVE badge  white on gold fill", P["white"], P["gold"], 4.5, "changed red→gold"),
    ("lead-story kicker    gold on card", P["gold"], PAPER, 4.5, "changed red→gold"),
    ("preview masthead kicker gold on page", P["gold"], BG, 4.5, "changed red→gold"),
    ("news story icon      cyan on card", P["cyan"], PAPER, 3.0, "changed red→cyan (icon)"),
    ("news story icon      cyan on cyan wash", P["cyan"], over(P["cyan"], PAPER, .14), 3.0, "changed"),
    ("micro ink4 on card   AFTER darkening", P["ink4"], PAPER, 4.5, "changed, was 3.66 FAIL"),
    ("micro ink4 on page   AFTER darkening", P["ink4"], BG, 4.5, "changed, was 3.53 FAIL"),

    # ── UNCHANGED, RE-VERIFIED (must not regress) ─────────────────────────
    ("WIN  green on card", P["green"], PAPER, 4.5, "unchanged"),
    ("WIN  green on green wash", P["green"], over(P["green"], PAPER, .10), 4.5, "unchanged"),
    ("LOSS red on card", P["red"], PAPER, 4.5, "unchanged"),
    ("LOSS red on red wash", P["red"], over(P["red"], PAPER, .09), 4.5, "unchanged"),
    ("PUSH slate on card", P["slate"], PAPER, 4.5, "unchanged"),
    ("PICK blue on card", P["blue"], PAPER, 4.5, "unchanged"),
    ("white on WIN fill (won seal)", P["white"], P["green"], 4.5, "unchanged"),
    ("white on LOSS fill (lost seal)", P["white"], P["red"], 4.5, "unchanged"),
    ("body ink on page", INK, BG, 4.5, "unchanged"),
    ("caption ink3 on card", P["ink3"], PAPER, 4.5, "unchanged"),
    ("gold kicker (brand) on card", P["gold"], PAPER, 4.5, "unchanged"),
    ("gold rail on card (non-text)", P["goldc"], PAPER, 3.0, "unchanged"),
]

if __name__ == "__main__":
    print(f"{'PAIR':52} {'RATIO':>6}  {'MIN':>4}  RESULT   NOTE")
    print("─" * 104)
    fails = 0
    for label, fg, bg, mn, note in PAIRS:
        r = ratio(fg, bg)
        ok = r >= mn
        if not ok:
            fails += 1
        print(f"{label:52} {r:6.2f}  {mn:4.1f}  {'PASS  ' if ok else '**FAIL'}   {note}")
    print("─" * 104)
    print(f"{len(PAIRS)} pairs · {fails} fail")
    sys.exit(1 if fails else 0)
