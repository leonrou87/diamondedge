#!/usr/bin/env python3
"""Collapse perceptually identical colour literals in globals.css to one canonical value.

The sheet accreted over many sessions, each hand-picking "a very dark navy" or "a
near-white". The result is ~15 blacks and ~12 whites that differ by less than the eye
can resolve. This merges every cluster whose members are within dE(CIE76) <= THRESH of
each other, choosing the most-used member as canonical.

dE <= 2.0 is at/below the just-noticeable-difference for large flat areas, so this
changes the colour COUNT without changing the design. Pure white and pure black are
anchors and are never merged into anything.

  --apply  write the file (default: dry run)
"""
import re, sys, itertools, collections, os

THRESH = 2.0
CSS = os.path.join(os.path.dirname(__file__), "..", "app", "globals.css")
ANCHORS = {(255, 255, 255), (0, 0, 0)}


def rgbh(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) == 4:
        h = "".join(c * 2 for c in h[:3])
    if len(h) == 8:
        h = h[:6]
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lab(c):
    def f(v):
        v /= 255
        return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4
    r, g, b = map(f, c)
    X, Y, Z = (r * .4124 + g * .3576 + b * .1805,
               r * .2126 + g * .7152 + b * .0722,
               r * .0193 + g * .1192 + b * .9505)

    def g_(t):
        return t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    fx, fy, fz = g_(X / .95047), g_(Y / 1.0), g_(Z / 1.08883)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def de(a, b):
    return sum((x - y) ** 2 for x, y in zip(lab(a), lab(b))) ** .5


src = open(CSS).read()
code = re.sub(r"/\*.*?\*/", "", src, flags=re.S)

# count usage in code (not comments)
cnt = collections.Counter()
for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", code):
    cnt[rgbh(m.group(0))] += 1
for m in re.finditer(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)", code):
    cnt[tuple(int(m.group(i)) for i in (1, 2, 3))] += 1

cols = [c for c in cnt if c not in ANCHORS]

# ── GUARD: never flatten two steps of the same ladder ────────────────────────
# If two colours are the values of DIFFERENT tokens declared inside the SAME block,
# they are a deliberate ladder (--bg vs --sunken, --paper vs --paper2) and merging
# them would collapse a distinction the sheet documents, even where that block is
# currently overridden. Collect those pairs and refuse to merge them.
siblings = set()
for blk in re.finditer(r"\{[^{}]*\}", code):
    decls = re.findall(r"(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\b", blk.group(0))
    byval = {}
    for name, val in decls:
        byval.setdefault(rgbh(val), set()).add(name)
    vals = list(byval)
    for a, b in itertools.combinations(vals, 2):
        if byval[a] != byval[b]:            # different token names
            siblings.add(frozenset((a, b)))
print(f"ladder pairs protected from merging: {len(siblings)}")

# COMPLETE-LINKAGE, seeded by usage. Single-link chains ("a is near b, b is near c")
# can walk a cluster far past the JND, so instead: take the most-used unassigned
# colour as the seed and absorb only colours within THRESH *of the seed itself*.
# Every rewritten literal is therefore provably <= THRESH from what it replaces.
canon = {}
merged = 0
nclusters = 0
unassigned = sorted(cols, key=lambda c: (-cnt[c], c))
while unassigned:
    seed = unassigned.pop(0)
    near = [c for c in unassigned
            if de(c, seed) <= THRESH and frozenset((c, seed)) not in siblings]
    if not near:
        continue
    nclusters += 1
    for c in near:
        canon[c] = seed
        merged += 1
        unassigned.remove(c)

print(f"clusters merged : {nclusters}")
print(f"colours removed : {merged}")
print(f"before / after  : {len(cnt)} -> {len(cnt) - merged}")
maxde = 0.0
for c, b in sorted(canon.items(), key=lambda kv: -cnt[kv[0]]):
    d = de(c, b)
    maxde = max(maxde, d)
    print(f"  #{c[0]:02x}{c[1]:02x}{c[2]:02x} (x{cnt[c]:2}) -> #{b[0]:02x}{b[1]:02x}{b[2]:02x}   dE {d:.2f}")
print(f"largest shift applied: dE {maxde:.2f}  (JND ~2.0)")

if "--apply" not in sys.argv:
    print("\n(dry run — pass --apply to write)")
    sys.exit(0)


def hexs(c):
    return "#%02x%02x%02x" % c


# rewrite hex literals and literal rgb()/rgba() channel triples, comments included so
# documented values stay truthful
def sub_hex(m):
    c = rgbh(m.group(0))
    return hexs(canon[c]) if c in canon else m.group(0)


out = re.sub(r"#[0-9a-fA-F]{6,8}\b", sub_hex, src)
out = re.sub(r"#[0-9a-fA-F]{3,4}(?![0-9a-fA-F])", sub_hex, out)


def sub_rgb(m):
    c = tuple(int(m.group(i)) for i in (2, 3, 4))
    if c not in canon:
        return m.group(0)
    n = canon[c]
    return f"{m.group(1)}({n[0]},{n[1]},{n[2]}"


out = re.sub(r"(rgba?)\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)", sub_rgb, out)
open(CSS, "w").write(out)
print("\nwritten.")
