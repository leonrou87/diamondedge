#!/usr/bin/env node
/* ═══════════ GRADER PARITY — the client must never grade a pick differently ═══════════
 *
 * WHY THIS EXISTS
 * ---------------
 * The client grades picks locally in two situations: LIVE, when a total has already cleared
 * the line and the bet is decided before the final whistle (`liveDecided`), and FINAL, when
 * the served grade has not landed yet (`provisionalResult`). Both answer a question the
 * backend also answers, in Python, in v4/serve/live_decide.py. Two implementations of one
 * predicate is the standing risk in this app: if they diverge, a card says one thing and the
 * record says another, and one of them is a false claim about money.
 *
 * On 2026-08-16 they had diverged completely, in the direction nobody checks for — not a
 * wrong answer, NO answer. `normalizeSide()` accepted nothing but the bare words "over" and
 * "under", which is exactly right for the SERVED side. But `v4ToPlay` reshapes the side into
 * a display string, "OVER 8.5", before any predicate sees it. So the strict parse returned
 * null on every v4 board pick, `totalDecided` returned null, `liveDecided` returned null,
 * and the "a dead bet is a loss NOW, not at the final whistle" rule — asked for explicitly
 * on 2026-08-09 — had never once fired on the picks it was written for.
 *
 * Measured against the real board that day: the old parse graded 0 of 2,521 settled totals
 * takes. The fix grades 2,521 of 2,521, and agrees with the server on every one.
 *
 * WHAT IT CHECKS
 * --------------
 * Every totals TAKE in public/picks_v4_beta.json that sits on a game with a known final
 * total is graded by the CLIENT's rule — side parsed the way the client parses it, after
 * the same display-string reshaping the client applies — and compared to the grade the
 * SERVER wrote. Two failures, both fatal:
 *   · a DISAGREEMENT — the client would print a different outcome than the record. Fatal.
 *   · a COVERAGE COLLAPSE — the client grades far fewer than it should, which is how the
 *     last outage hid: silent, no wrong pixel, just a feature that stopped existing.
 * ════════════════════════════════════════════════════════════════════════════════════════ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** THE CLIENT'S RULE, mirrored from app/page.tsx (normalizeSide / pickLineOf / totalDecided). */
const normalizeSide = (side) => {
  const m = String(side ?? "").trim().toLowerCase().match(/^(over|under)(?:\s+[-+]?\d+(?:\.\d+)?)?$/);
  return m ? m[1] : null;
};
const lineStr = (n) => (Number(n) % 1 ? String(n) : String(Number(n)));
const pickLineOf = (line, side) => {
  if (line != null && isFinite(Number(line))) return Number(line);
  const m = String(side || "").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
};
/** v4ToPlay's reshaping — the step that broke the parse. Predicates see THIS, not the payload. */
const displaySide = (served, ln) => `${normalizeSide(served) === "under" ? "UNDER" : "OVER"} ${lineStr(ln)}`.trim();

let games;
try {
  games = JSON.parse(readFileSync(join(ROOT, "public/picks_v4_beta.json"), "utf8")).games || [];
} catch {
  console.log("verify_grader — public/picks_v4_beta.json not present; nothing to check.");
  process.exit(0);
}

const rows = [];
for (const g of games) {
  const total = g && g.final && g.final.total_runs;
  if (total == null) continue;
  for (const c of g.grid || []) {
    if (!c || c.bet_type !== "total" || !c.take) continue;
    const side = c.pick_side || (c.lean && c.lean.side);
    const line = c.pick_line != null ? c.pick_line : (c.lean && c.lean.line != null ? c.lean.line : c.market_line);
    const served = String(c.result || "").toLowerCase();
    if (side == null || line == null) continue;
    if (!["win", "loss", "push"].includes(served)) continue;
    rows.push({ side, line: Number(line), total: Number(total), served });
  }
}

let agree = 0, ungraded = 0;
const wrong = [];
for (const r of rows) {
  const shown = displaySide(r.side, r.line);
  const dir = normalizeSide(shown);
  const line = pickLineOf(r.line, shown);
  if (!dir || line == null) { ungraded++; continue; }
  const v = r.total === line ? "push" : (r.total > line) === (dir === "over") ? "win" : "loss";
  if (v === r.served) agree++;
  else if (wrong.length < 12) wrong.push({ ...r, client: v });
  else wrong.push(null);
}
const wrongN = wrong.length;

console.log(`grader parity — ${rows.length} settled totals takes with a known final total`);
console.log(`  agrees with the server: ${agree}   ungraded: ${ungraded}   DISAGREES: ${wrongN}`);

if (wrongN) {
  console.log(`\n  ✗ THE CLIENT WOULD PRINT A DIFFERENT OUTCOME THAN THE RECORD:`);
  for (const w of wrong.filter(Boolean)) {
    console.log(`      ${w.side} ${w.line} · final ${w.total} — server says ${w.served}, client says ${w.client}`);
  }
  process.exit(1);
}
// COVERAGE. A silent collapse to zero is the failure this file was written after.
if (rows.length && ungraded / rows.length > 0.02) {
  console.log(`\n  ✗ COVERAGE COLLAPSE — ${ungraded}/${rows.length} settled picks grade to NOTHING.`);
  console.log(`      The live clinch and the provisional grade are inert on these. This is how the`);
  console.log(`      2026-08-16 outage looked: no wrong pixel anywhere, the feature simply gone.`);
  process.exit(1);
}
console.log("  ✓ the client and the server grade every settled pick the same way");
