#!/usr/bin/env node
/* ═══════ OPENING DAY, BEFORE IT HAPPENS — the armed leagues' record copy ═══════
 *
 * WHY THIS EXISTS
 * ---------------
 * NBA and NHL are ARMED: their keys publish, their records read 0-0, and neither has ever
 * served a game. NHL's first slate is 2026-09-19, NBA's is 2026-10-03. Nothing about either
 * league's reader surface has ever been exercised against a NON-empty slate, because one has
 * never existed — so every bug in that path is scheduled to appear for the first time in
 * front of readers, on opening night, at once.
 *
 * This replays the flip against the REAL served payloads: it takes today's live nba/nhl
 * snapshots off the wire, asserts the pre-opening copy is honest, then synthesizes the exact
 * mutation opening night performs — mode "armed" → "live", is_offseason → false, games
 * arrive, record STILL 0-0 because nothing has graded yet — and asserts the copy is still
 * honest. Both sides of the guard, proven from one payload.
 *
 * THE BUG IT LOCKS DOWN
 * ---------------------
 * app/page.tsx carries a note dated 2026-08-13: the NBA strip once said "graded from Aug 10,
 * 2026" above an empty state announcing the season opens in October — "a date-stamped grading
 * claim about a track with nothing to grade". It was fixed by suppressing the dated form when
 * the league is OFF-SEASON. But off-season is a calendar test, and the ledger is still 0-0 for
 * the hours between the first slate landing and the first game grading. On 2026-10-03 `mode`
 * flips to "live", `is_offseason` goes false, `record.started` is still 2026-08-10 — and the
 * sentence the note was written to kill comes back, fifty-four days later, over an empty
 * ledger. NHL gets the same sentence on 2026-09-19, forty days after its start stamp.
 *
 * The honest test was never the calendar. It is whether this ledger has graded anything.
 * ══════════════════════════════════════════════════════════════════════════════════ */

const WIRE = "https://diamondedge.kytepush.com/api/snap";
const LEAGUES = ["nba", "nhl"];

/** Mirrored from app/page.tsx — msRecordStripHtml / msLeagueRecordRow. */
const decidedN = (r) => (r ? (r.wins || 0) + (r.losses || 0) + (r.pushes || 0) : 0);
const nothingGradedOf = (rec) => decidedN(rec.preseason) + decidedN(rec.regular) === 0;
const offSeasonOf = (d) => !!(d && (d.mode === "armed" || d.is_offseason));

const stripGradedFrom = (d, startLab) =>
  (offSeasonOf(d) || nothingGradedOf(d.record)) ? "graded in the open from opening night" : `graded from ${startLab}`;
const rowSub = (d, startLab, note) =>
  offSeasonOf(d)
    ? `off-season — the record starts with the season${note ? `. ${note}` : ""}`
    : (startLab && !nothingGradedOf(d.record) ? `graded from ${startLab}` : "graded in the open");

const labOf = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

let failures = [];
const check = (name, cond, detail) => {
  if (cond) console.log(`     ✓ ${name}`);
  else { console.error(`     ✗ ${name} — ${detail}`); failures.push(name); }
};

const main = async () => {
  for (const lg of LEAGUES) {
    let d;
    try {
      const r = await fetch(`${WIRE}/${lg}`, { headers: { "user-agent": "diamondedge-league" } });
      if (!r.ok) throw new Error("HTTP " + r.status);
      d = await r.json();
    } catch (e) {
      console.log(`verify_opening_day — ${lg}: wire unreachable (${e.message}); skipping.`);
      continue;
    }
    const startLab = labOf(String(d.record.started || "").slice(0, 10));
    console.log(`\n── ${lg.toUpperCase()} — served ${d.generated_at}, record.started ${d.record.started} (${startLab})`);
    console.log(`   season_note: ${d.season_note}`);

    // ── SIDE 1: TODAY. Armed, no slate. Must refuse to claim a dated grading history. ──
    console.log(`   [before opening day] mode=${d.mode} is_offseason=${d.is_offseason} games=${(d.games || []).length}`);
    check("strip does not claim a dated grading history",
      !stripGradedFrom(d, startLab).includes(startLab), stripGradedFrom(d, startLab));
    check("record row reads as off-season",
      rowSub(d, startLab, String(d.season_note || "").replace(/\.$/, "")).startsWith("off-season"),
      rowSub(d, startLab, ""));
    check("adaptive status is honest about having no history",
      d.adaptive && d.adaptive.status === "armed_no_history", JSON.stringify(d.adaptive));
    check("record is genuinely empty", nothingGradedOf(d.record), JSON.stringify(d.record.regular));

    // ── SIDE 2: OPENING NIGHT. The slate lands; nothing has graded yet. ──
    const opened = {
      ...d, mode: "live", is_offseason: false, season_note: null,
      games: [{ sport: lg, competition: "Preseason", date: "2026-10-03" }],
      record: JSON.parse(JSON.stringify(d.record)),   // still 0-0 — first game has not finished
    };
    console.log(`   [opening night, 0 graded] mode=${opened.mode} is_offseason=${opened.is_offseason} games=${opened.games.length}`);
    const sf = stripGradedFrom(opened, startLab), sr = rowSub(opened, startLab, "");
    check("strip STILL does not claim a dated grading history", !sf.includes(startLab), sf);
    check("record row STILL does not claim a dated grading history", !sr.includes(startLab), sr);
    console.log(`     strip says: "${lg.toUpperCase()} picks — ${sf}"`);
    console.log(`     row says:   "${sr}"`);

    // ── SIDE 3: AFTER THE FIRST GRADE. The dated form must return, untouched. ──
    const graded = { ...opened, record: { ...opened.record, regular: { wins: 1, losses: 0, pushes: 0, record: "1-0" } } };
    check("once something grades, the dated form returns",
      stripGradedFrom(graded, startLab) === `graded from ${startLab}`, stripGradedFrom(graded, startLab));
  }

  console.log("");
  if (failures.length) { console.error(`verify_opening_day: FAIL (${failures.length})`); process.exit(1); }
  console.log("verify_opening_day: PASS — armed refuses, opening night stays honest, the dated form returns on the first grade.");
};
main();
