#!/usr/bin/env node
/* ═══════════════ DEAD SURFACE CHECK — every renderer must have a door ═══════════════
 *
 * WHY THIS EXISTS
 * ---------------
 * app/page.tsx already has a runtime dead-CLICK-TARGET guard: bind a handler to an element
 * that is not in the DOM and it shouts. That guard is good and it has caught real rot. But it
 * can only see a binding that EXISTS — it is blind to the opposite, more expensive failure:
 * a whole surface with no button at all. Nothing clicks, so nothing complains.
 *
 * That is not hypothetical here. The record-breakdown sheet went dead, was reported, was
 * revived, and went dead again — its own source comment still claimed it "opens from the Desk
 * and the Record screen, which are its two real front doors now" while neither door existed.
 * The 2026-08-09 simplification pass deleted ~1,500 lines of exactly this: a complete
 * three-tab "Totals" product nobody could open, a gold-headed strategy sheet with no button,
 * a date-range scan whose toggle had been dropped in an earlier redesign, and ~30 orphan
 * renderers left behind by previous consolidations.
 *
 * Every one of those was a second place a fact lived. That is the real cost — an unreachable
 * duplicate is not just dead weight, it is a number that will disagree with the live one the
 * moment somebody wires it back up.
 *
 * WHAT IT CHECKS
 * --------------
 * For every `function render*` / `open*` declaration, count references from OUTSIDE that
 * function's own body. A renderer whose only callers are its own re-render handlers is
 * unreachable — which is precisely how renderBeta() survived review: it had three call
 * sites and all three were inside itself.
 *
 * It uses the TypeScript parser rather than brace-matching on purpose. A hand-rolled scanner
 * mis-handles nested template literals — this file is 17k lines of them — and a guard that
 * reports false positives gets switched off, which is worse than not having one.
 *
 * Exit 1 if anything is unreachable. Add a name to ALLOW only with a reason.
 * ════════════════════════════════════════════════════════════════════════════════════════ */
import ts from "typescript";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "app", "page.tsx");

/** Reached by a route or lifecycle rather than a call site in this file. name -> reason */
const ALLOW = Object.create(null);

const src = readFileSync(TARGET, "utf8");
const sf = ts.createSourceFile(TARGET, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

// ---- 1. every render*/open* function declaration, with its exact source span ----
const decls = new Map(); // name -> {start, end, line}
(function walk(node) {
  if (ts.isFunctionDeclaration(node) && node.name) {
    const name = node.name.text;
    if (/^(render|open)/.test(name)) {
      decls.set(name, {
        start: node.getStart(sf),
        end: node.getEnd(),
        line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
      });
    }
  }
  ts.forEachChild(node, walk);
})(sf);

// ---- 2. every identifier reference, excluding the declaration's own name node ----
const refsOutside = new Map([...decls.keys()].map((n) => [n, 0]));
(function walk(node) {
  if (ts.isIdentifier(node)) {
    const name = node.text;
    const d = decls.get(name);
    if (d) {
      const pos = node.getStart(sf);
      const isOwnNameNode =
        node.parent && ts.isFunctionDeclaration(node.parent) && node.parent.name === node;
      // A reference from inside the function's own body is a re-render handler, not a door.
      if (!isOwnNameNode && !(pos >= d.start && pos < d.end)) {
        refsOutside.set(name, refsOutside.get(name) + 1);
      }
    }
  }
  ts.forEachChild(node, walk);
})(sf);

// ---- 3. report ----
const rel = relative(ROOT, TARGET);
const dead = [...decls.entries()]
  .filter(([name]) => refsOutside.get(name) === 0 && !(name in ALLOW))
  .map(([name, d]) => ({ name, line: d.line }))
  .sort((a, b) => a.line - b.line);

console.log(`dead-surface check — ${decls.size} render*/open* declarations in ${rel}`);

if (!dead.length) {
  console.log("  ✓ every surface has at least one door");
  process.exit(0);
}

console.log(`\n  ✗ ${dead.length} UNREACHABLE surface(s) — no call site outside the function itself:\n`);
for (const { name, line } of dead) console.log(`      ${name}()   ${rel}:${line}`);
console.log(`
  Each one is a second place a fact can live. Either give it a door or delete it — do not
  leave it looking wired up. If it is genuinely reached another way (a route, a lifecycle
  hook), add it to ALLOW in this script WITH the reason.`);
process.exit(1);
