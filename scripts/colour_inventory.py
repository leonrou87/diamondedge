#!/usr/bin/env python3
"""Colour inventory for app/globals.css — counts distinct colours and how they're spelled.

Distinct COLOUR = a resolved sRGB triple (alpha ignored). That is the number that
matters for "how many colours does this app use"; alpha variants of one ink are one
colour, not thirty.
"""
import re, sys, json, collections, os

CSS = os.path.join(os.path.dirname(__file__), "..", "app", "globals.css")
src = open(CSS).read()

# strip comments so prose examples don't count
code = re.sub(r"/\*.*?\*/", "", src, flags=re.S)

NAMED = {"white": (255, 255, 255), "black": (0, 0, 0), "transparent": None,
         "currentColor": None, "inherit": None, "none": None}


def hex_rgb(h):
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) == 4:
        h = "".join(c * 2 for c in h[:3])
    if len(h) == 8:
        h = h[:6]
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


hexes = re.findall(r"#[0-9a-fA-F]{3,8}\b", code)
hex_rgbs = collections.Counter(hex_rgb(h) for h in hexes)

# rgb()/rgba() with literal channels (skip var(--x) channel forms — those resolve to a token)
lit_rgba = re.findall(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)", code)
lit_rgbs = collections.Counter(tuple(int(x) for x in t) for t in lit_rgba)

# channel tokens (--xc:R,G,B) — each is one colour used at many alphas
chan = {}
for m in re.finditer(r"(--[a-z0-9-]+c)\s*:\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)", code):
    chan.setdefault(m.group(1), set()).add(tuple(int(m.group(i)) for i in (2, 3, 4)))

var_channel_uses = len(re.findall(r"rgba?\(var\(--[a-z0-9-]+\)", code))

all_rgb = collections.Counter()
all_rgb.update(hex_rgbs)
all_rgb.update(lit_rgbs)
for vals in chan.values():
    for v in vals:
        all_rgb[v] += 1

tokens = sorted(set(re.findall(r"^\s*(--[a-z0-9-]+)\s*:", code, flags=re.M)))

# raw (untokenised) colour literals used OUTSIDE the :root token blocks
root_spans = []
for m in re.finditer(r":root\s*\{", code):
    depth, i = 0, m.end() - 1
    while i < len(code):
        if code[i] == "{":
            depth += 1
        elif code[i] == "}":
            depth -= 1
            if depth == 0:
                break
        i += 1
    root_spans.append((m.start(), i))


def in_root(pos):
    return any(a <= pos <= b for a, b in root_spans)


raw_outside = collections.Counter()
for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b", code):
    if not in_root(m.start()):
        raw_outside[m.group(0).lower()] += 1
for m in re.finditer(r"rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+[^)]*\)", code):
    if not in_root(m.start()):
        raw_outside[m.group(0)] += 1

report = {
    "distinct_colours_resolved": len(all_rgb),
    "distinct_hex_literals": len(set(h.lower() for h in hexes)),
    "hex_occurrences": len(hexes),
    "distinct_literal_rgba_triples": len(lit_rgbs),
    "literal_rgba_occurrences": len(lit_rgba),
    "channel_tokens": {k: sorted(v) for k, v in sorted(chan.items())},
    "channel_token_count": len(chan),
    "rgba_var_channel_uses": var_channel_uses,
    "custom_properties_declared": len(tokens),
    "raw_literals_outside_root_distinct": len(raw_outside),
    "raw_literals_outside_root_occurrences": sum(raw_outside.values()),
    "top_raw_outside": raw_outside.most_common(25),
}
print(json.dumps(report, indent=2))
