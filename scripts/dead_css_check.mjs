#!/usr/bin/env node
/* ═════════════════ DEAD CSS CHECK — a rule that can never match is a rule that lies ═════════════════
 *
 * WHY THIS EXISTS
 * ---------------
 * scripts/dead_surface_check.mjs guards the JS side: every renderer must have a door, every
 * door must have a room. It is blind to the stylesheet, and the stylesheet is where the
 * evidence of a deleted surface lingers longest — deleting a renderer takes its markup with
 * it, but the forty rules that dressed that markup sit in globals.css looking exactly like
 * live code. On 2026-08-16 this script found 1,881 such rules, 2,702 lines, a quarter of the
 * file: the whole Upgrade screen, the whole Subscribe screen, the unlock affordances, the
 * redaction chips — plus older fossils (.tierlegend, .dskst-card, .dp-system, .article-bg)
 * from rewrites nobody had swept after.
 *
 * That is not just weight. A stylesheet is a map of the product, and a map with two dead
 * cities on it sends the next reader — human or agent — to build against a surface that no
 * longer exists. It is the same failure dead_surface_check was written for, one file over.
 *
 * WHAT IT CHECKS
 * --------------
 * A rule is DEAD when EVERY comma-separated selector in it names at least one class that no
 * source file in the app can emit. That is deliberately strict: one live selector in the list
 * keeps the whole rule.
 *
 * FOUR RULES KEEP IT HONEST — a guard with false positives gets switched off, which is worse
 * than no guard:
 *   1. A selector with NO class token (element, id, attribute, pseudo) is never called dead.
 *      This script only reasons about classes, so it only judges classes.
 *   2. A class assembled at runtime is never called dead. `<span class="an-${who}">` emits
 *      .an-vega without the literal "an-vega" appearing anywhere, so every `ident${` fragment
 *      found INSIDE a class context (class="…", className=, classList.add(…)) is harvested as
 *      a prefix, and anything starting with one is treated as live-unproven. The harvest is
 *      scoped to class contexts on purpose: harvesting the whole file would pick up "L" from
 *      `L${n}` in an SVG path and shield every class beginning with L.
 *   3. A one- or two-letter prefix shields only an all-digit remainder. `c${si % 4}` is real
 *      (it emits .c0-.c3) but a bare "c" prefix would otherwise shield a quarter of the sheet.
 *   4. @keyframes, @font-face and @property are never touched. An @media/@supports block is
 *      called dead only when every rule inside it is dead.
 *
 * The search corpus is every .ts/.tsx/.js/.mjs/.html/.json under app/ and scripts/ — so a class
 * emitted by a server component, a route, an OG image or a shot script all count as live.
 *
 * Report-only by default. `--strict` exits 1 when the dead-line count exceeds BUDGET, so the
 * number can only go down; raise the budget deliberately, never incidentally.
 * ════════════════════════════════════════════════════════════════════════════════════════════ */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHEETS = ["app/globals.css", "app/record/record.css"];

/** Lines of dead rules tolerated before --strict fails. Ratchet DOWN only. */
const BUDGET = 0;

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", ".claude"].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|jsx?|mjs|html|json)$/.test(e)) out.push(p);
  }
  return out;
}

const corpus = walk(join(ROOT, "app"))
  .concat(walk(join(ROOT, "scripts")))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

// ---- rule 2: dynamic class prefixes, harvested from CLASS CONTEXTS ONLY ----
const classCtx = [
  ...(corpus.match(/class\s*=\s*"[^"]*"/g) || []),
  ...(corpus.match(/class\s*=\s*'[^']*'/g) || []),
  ...(corpus.match(/class\s*=\s*`[^`]*`/g) || []),
  ...(corpus.match(/className\s*=\s*[^;\n]{0,300}/g) || []),
  ...(corpus.match(/classList\.(?:add|toggle|remove|contains)\([^)]{0,200}\)/g) || []),
].join("\n");
const DYN = [...new Set((classCtx.match(/[a-zA-Z][a-zA-Z0-9_-]*\$\{/g) || []).map((s) => s.slice(0, -2)))];
// ---- rule 3: a short prefix shields only a numeric remainder ----
const shields = (p, name) =>
  name.startsWith(p) &&
  name.length > p.length &&
  (p.length >= 3 || /^\d+$/.test(name.slice(p.length)));

const memo = new Map();
function canEmit(name) {
  if (memo.has(name)) return memo.get(name);
  const v =
    DYN.some((p) => shields(p, name)) ||
    new RegExp(`(^|[^A-Za-z0-9_-])${name.replace(/-/g, "\\-")}([^A-Za-z0-9_-]|$)`).test(corpus);
  memo.set(name, v);
  return v;
}

/** Rules directly inside [from,to) of the comment-masked text, with exact spans. */
function parse(mask, from, to) {
  const nodes = [];
  let i = from, selStart = from;
  while (i < to) {
    if (mask[i] === "{") {
      let d = 1, j = i + 1;
      while (j < to && d > 0) { if (mask[j] === "{") d++; else if (mask[j] === "}") d--; j++; }
      nodes.push({ sel: mask.slice(selStart, i).trim(), selStart, bodyStart: i + 1, end: j });
      i = j; selStart = j;
    } else if (mask[i] === "}") { i++; selStart = i; }
    else i++;
  }
  return nodes;
}

// ---- rule 1: a selector with no class token is never judged ----
const selIsDead = (s) => {
  const cls = s.match(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g);
  return cls ? cls.some((c) => !canEmit(c.slice(1))) : false;
};

let worst = 0;
for (const sheet of SHEETS) {
  const css = readFileSync(join(ROOT, sheet), "utf8");
  const mask = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  const lineOf = (i) => mask.slice(0, i).split("\n").length;
  const dead = [];

  (function scan(from, to) {
    for (const n of parse(mask, from, to)) {
      if (/^@(media|supports|layer|container)/.test(n.sel)) { scan(n.bodyStart, n.end - 1); continue; }
      if (/^@/.test(n.sel)) continue; // rule 4
      const sels = n.sel.split(",").map((s) => s.trim()).filter(Boolean);
      if (sels.length && sels.every(selIsDead)) {
        dead.push({ line: lineOf(n.selStart), endLine: lineOf(n.end), sel: n.sel.replace(/\s+/g, " ").slice(0, 100) });
      }
    }
  })(0, css.length);

  const deadLines = dead.reduce((a, d) => a + (d.endLine - d.line + 1), 0);
  worst = Math.max(worst, deadLines);
  const total = css.split("\n").length;
  if (!dead.length) {
    console.log(`✓ ${sheet} — ${total} lines, every rule can match something the app emits`);
    continue;
  }
  console.log(`✗ ${sheet} — ${dead.length} rules (${deadLines} lines of ${total}) can never match:`);
  for (const d of dead.slice(0, 60)) console.log(`   L${d.line}-${d.endLine}  ${d.sel}`);
  if (dead.length > 60) console.log(`   … and ${dead.length - 60} more`);
}

if (process.argv.includes("--strict") && worst > BUDGET) {
  console.error(`\nDead CSS budget is ${BUDGET} lines; found ${worst}. Delete the rules or raise BUDGET deliberately.`);
  process.exit(1);
}
