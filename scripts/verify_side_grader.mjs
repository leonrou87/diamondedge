#!/usr/bin/env node
/* ═══════ SIDE-GRADER PARITY — a blank abbreviation must not grade a ticket ═══════
 *
 * WHY THIS EXISTS
 * ---------------
 * scripts/verify_grader.mjs proves the client's TOTALS rule matches the server's. Nothing
 * proved the SIDE rule — the one that decides, for a spread or moneyline ticket, which team
 * we actually backed. That rule lived twice (provisionalResult and the live tracking card),
 * copy-pasted, as:
 *
 *     backedHome = side.indexOf(g.home_abbr) >= 0 && side.indexOf(g.away_abbr) < 0
 *     backedAway = side.indexOf(g.away_abbr) >= 0 && side.indexOf(g.home_abbr) < 0
 *
 * `"ANYTHING".indexOf("")` is 0, not -1. So a game served with an EMPTY home abbreviation
 * makes `backedHome` true for every side string that exists, while the away test — hunting a
 * real abbr that is not in the string — reports false. The surface then grades the ticket
 * against the wrong team and prints a confident, wrong result. No error, no blank pixel: a
 * false claim about money.
 *
 * WHY AN ARMED LEAGUE MAKES THIS URGENT
 * -------------------------------------
 * This looks like a defensive nicety while MLB, NFL, WNBA and MLS all serve clean three-letter
 * abbreviations. NBA preseason does not. Measured on last season's real ESPN schedule
 * (basketball/nba scoreboard, 2025-10-01 .. 2025-10-25) there are 34 distinct team entities,
 * not 30 — the extras are Guangzhou Loong-Lions, Melbourne United, Hapoel Jerusalem, and one
 * entry, "Melbourne Pnx", that ESPN serves with NO `abbreviation` field at all. NBA opens on
 * a preseason slate (2026-10-03). This is the shape of the data that arrives that night.
 *
 * WHAT IT CHECKS
 * --------------
 *  1. EQUIVALENCE — over an exhaustive cross-product of side strings and abbreviation pairs
 *     in which both abbreviations are present, the new reader returns exactly what the old
 *     two lines returned. The fix must not move a single existing grade.
 *  2. REFUSAL — wherever an abbreviation is missing, empty, or whitespace, the old rule
 *     invents a side and the new one returns null (defer to the served grade).
 * Either failure is fatal.
 * ══════════════════════════════════════════════════════════════════════════════════ */

/** THE OLD RULE, verbatim in behaviour — both surfaces' copy-pasted pair. */
const oldRule = (side, homeAb, awayAb) => {
  const s = String(side || "");
  const backedHome = s.indexOf(homeAb) >= 0 && s.indexOf(awayAb) < 0;
  const backedAway = s.indexOf(awayAb) >= 0 && s.indexOf(homeAb) < 0;
  if (!backedHome && !backedAway) return null;
  return backedHome ? "home" : "away";
};

/** THE NEW RULE, mirrored from app/page.tsx (backedSideOf). */
const newRule = (side, homeAb, awayAb) => {
  const s = String(side ?? "");
  const h = String(homeAb ?? "").trim();
  const a = String(awayAb ?? "").trim();
  if (!s || !h || !a) return null;
  const inH = s.indexOf(h) >= 0, inA = s.indexOf(a) >= 0;
  if (inH === inA) return null;
  return inH ? "home" : "away";
};

const GOOD_ABBRS = ["BOS", "NY", "NYK", "GS", "LAL", "OKC", "UTAH", "WSH", "GUANGZHOU", "MEL", "HAPOEL"];
const BLANK_ABBRS = ["", "   ", null, undefined];
const SIDES = [
  "BOS", "NY -3.5", "NYK +2", "GS ML", "LAL -110", "OKC", "UTAH -6", "WSH +1.5",
  "GUANGZHOU +14", "MEL -2", "HAPOEL ML", "OVER 220.5", "UNDER 8.5", "PASS", "",
];

let checked = 0, mismatches = [], invented = [];

// ── 1. EQUIVALENCE where both abbreviations are real ──────────────────────────────
for (const side of SIDES)
  for (const h of GOOD_ABBRS)
    for (const a of GOOD_ABBRS) {
      if (h === a) continue;
      checked++;
      const o = oldRule(side, h, a), n = newRule(side, h, a);
      if (o !== n) mismatches.push({ side, h, a, old: o, new: n });
    }

// ── 2. REFUSAL where an abbreviation is blank ─────────────────────────────────────
let blankChecked = 0;
for (const side of SIDES)
  for (const blank of BLANK_ABBRS)
    for (const real of GOOD_ABBRS) {
      for (const [h, a] of [[blank, real], [real, blank], [blank, blank]]) {
        blankChecked++;
        const o = oldRule(side, h, a), n = newRule(side, h, a);
        if (n !== null) mismatches.push({ side, h, a, old: o, new: n, note: "new rule graded a blank-abbr game" });
        if (o !== null) invented.push({ side, h: JSON.stringify(h), a: JSON.stringify(a), old: o });
      }
    }

console.log(`verify_side_grader — ${checked} both-abbrs-present cases, ${blankChecked} blank-abbr cases`);

if (mismatches.length) {
  console.error(`\nFATAL: ${mismatches.length} behaviour change(s) where there should be none:`);
  for (const m of mismatches.slice(0, 12)) console.error("   ", JSON.stringify(m));
  process.exit(1);
}
console.log(`  ✓ EQUIVALENCE — all ${checked} real-abbreviation cases grade identically; no existing grade moves.`);

if (!invented.length) {
  console.error("\nFATAL: the blank-abbr battery never reproduced the bug — the harness is not testing what it claims.");
  process.exit(1);
}
console.log(`  ✓ REFUSAL     — the old rule invented a side on ${invented.length} of ${blankChecked} blank-abbr cases; the new rule grades none of them.`);
console.log("     e.g. " + invented.slice(0, 3).map((v) => `side ${JSON.stringify(v.side)} home=${v.h} away=${v.a} → old said "${v.old}"`).join("\n          "));
console.log("\nverify_side_grader: PASS");
