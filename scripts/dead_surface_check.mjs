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
 * WHAT IT CHECKS — TWO DIRECTIONS, BECAUSE A COLLAPSE BREAKS BOTH
 * --------------------------------------------------------------
 * (A) SURFACE WITH NO DOOR. For every `function render*` / `open*` declaration, count
 *     references from OUTSIDE that function's own body. A renderer whose only callers are
 *     its own re-render handlers is unreachable — which is precisely how renderBeta()
 *     survived review: it had three call sites and all three were inside itself.
 *
 * (B) DOOR WITH NO ROOM. Every `<button id>` / `<a id>` this file renders must have SOME
 *     handler referencing that id. This is the mirror image, and it is the one a
 *     consolidation actually produces: you delete a destination, its handler goes with it,
 *     and the markup that pointed at the destination is three thousand lines away and stays.
 *
 *     Found on 2026-08-09, after the five-tab collapse had already shipped: `#sb-more`
 *     ("See every graded pick by strength →") still rendered on Research, in the tab order,
 *     carrying `aria-haspopup="dialog"` — and clicking it did nothing, because the sheet it
 *     opened (tierPicksList) had been deleted as an unreachable duplicate. Neither the
 *     runtime dead-click-target guard nor check (A) could see it: (A) watches functions and
 *     this was markup; the runtime guard watches bindings and there was no binding left to
 *     fire. The reader got a button that lies.
 *
 * HOW (B) AVOIDS FALSE POSITIVES. Handler keys are STRING LITERALS in code — bindClick("x"),
 * railTap("x"), $("x"), querySelector("#x"). Rendered markup lives in TEMPLATE literal text.
 * The TS parser keeps those node kinds apart, so "is this id ever named by code?" is answered
 * without a single regex over the source. Anchors carrying `href` are navigation, not
 * handlers, and are exempt. An id assembled dynamically goes in ALLOW_IDS with its reason.
 *
 * It uses the TypeScript parser rather than brace-matching on purpose. A hand-rolled scanner
 * mis-handles nested template literals — this file is 17k lines of them — and a guard that
 * reports false positives gets switched off, which is worse than not having one.
 *
 * Exit 1 if anything is unreachable. Add a name to ALLOW / ALLOW_IDS only with a reason.
 * ════════════════════════════════════════════════════════════════════════════════════════ */
import ts from "typescript";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = join(ROOT, "app", "page.tsx");

/** Reached by a route or lifecycle rather than a call site in this file. name -> reason */
const ALLOW = Object.create(null);

/** Rendered ids whose handler is attached by a means this script cannot see (a selector
 *  built at runtime, a delegated listener keyed on something other than the id). id -> reason */
const ALLOW_IDS = Object.create(null);

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

/* ---- 3. (B) every rendered <button id> / <a id>, and every id CODE names ----
   The split is the whole trick: markup is template-literal TEXT, handler keys are STRING
   LITERALS. Collecting them from different AST node kinds means an id that only ever appears
   inside rendered HTML — i.e. a button nothing binds — stands out with no regex heuristics. */
const namedByCode = new Set(); // ids/selectors that appear as a string literal in code
const renderedIds = new Map(); // id -> {line, tag, hasHref}

(function walk(node) {
  // Handler keys: bindClick("x") · railTap("x") · $("x") · querySelector("#x")
  if (ts.isStringLiteral(node)) {
    namedByCode.add(node.text);
    if (node.text.startsWith("#")) namedByCode.add(node.text.slice(1));
  }
  // Rendered markup: only the literal TEXT of template pieces, never their ${...} spans.
  if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) ||
      ts.isNoSubstitutionTemplateLiteral(node)) {
    const t = node.text;
    const line0 = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
    for (const m of t.matchAll(/<(button|a)\b([^>]*?)\bid="([A-Za-z][\w-]*)"([^>]*)>/g)) {
      const [, tag, pre, id, post] = m;
      if (renderedIds.has(id)) continue;
      renderedIds.set(id, {
        line: line0 + t.slice(0, m.index).split("\n").length - 1,
        tag,
        hasHref: /\bhref=/.test(pre + post),
      });
    }
  }
  ts.forEachChild(node, walk);
})(sf);

// ---- 4. report ----
const rel = relative(ROOT, TARGET);
const dead = [...decls.entries()]
  .filter(([name]) => refsOutside.get(name) === 0 && !(name in ALLOW))
  .map(([name, d]) => ({ name, line: d.line }))
  .sort((a, b) => a.line - b.line);

// An <a href> navigates on its own; everything else needs code to name it.
const orphanButtons = [...renderedIds.entries()]
  .filter(([id, info]) => !info.hasHref && !namedByCode.has(id) && !(id in ALLOW_IDS))
  .map(([id, info]) => ({ id, ...info }))
  .sort((a, b) => a.line - b.line);

console.log(
  `dead-surface check — ${decls.size} render*/open* declarations, ` +
  `${renderedIds.size} rendered button/link ids in ${rel}`
);

if (!dead.length && !orphanButtons.length) {
  console.log("  ✓ every surface has a door, and every door has a room");
  process.exit(0);
}

if (dead.length) {
  console.log(`\n  ✗ ${dead.length} UNREACHABLE surface(s) — no call site outside the function itself:\n`);
  for (const { name, line } of dead) console.log(`      ${name}()   ${rel}:${line}`);
  console.log(`
  Each one is a second place a fact can live. Either give it a door or delete it — do not
  leave it looking wired up. If it is genuinely reached another way (a route, a lifecycle
  hook), add it to ALLOW in this script WITH the reason.`);
}

if (orphanButtons.length) {
  console.log(`\n  ✗ ${orphanButtons.length} DEAD CLICK TARGET(S) — rendered, focusable, and bound to nothing:\n`);
  for (const { id, line, tag } of orphanButtons) console.log(`      <${tag} id="${id}">   ${rel}:${line}`);
  console.log(`
  No code in this file ever names these ids, so tapping them does nothing at all. This is
  what a consolidation leaves behind: the destination was deleted, the handler went with it,
  and the markup pointing at the destination stayed. Delete the element, or give it a
  handler. If the binding is genuinely attached some way this script cannot see, add the id
  to ALLOW_IDS in this script WITH the reason.`);
}
process.exit(1);
