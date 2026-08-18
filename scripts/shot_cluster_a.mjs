// CLUSTER A VERIFICATION — records and ratings display, shot from PRODUCTION
// at 375px and desktop 1280px into audit-screenshots/bugfix/.
//
//   a-wnba-strip-*.png     WNBA tab: ONE cumulative record line ("Regular season 2-1"),
//                          NO "New era · Aug 17" sub-row.
//   a-desk-records-*.png   Desk record region: League records rows with no .sc-era
//                          sub-lines; the 14-day map with every league's graded days.
//   a-desk-archive-*.png   "Every pick, day by day": Aug 15 open, WNBA/NFL rows tagged.
//   a-calendar-*.png       The calendar page: Aug 15 pill = the merged W-L.
//   a-research-tiers-*.png Research "cut by pick strength": n= on rows, dated foot.
//   a-board-aug16-*.png    Aug 16 board (control): served stars still render on tiles.
//
// Usage: node scripts/shot_cluster_a.mjs [url]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/bugfix";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const facts = {};

async function shoot(width, height, tag) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/?shot=${Date.now()}`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(3500);

  const clickTab = async (lg) => {
    await page.evaluate((l) => {
      const t = [...document.querySelectorAll(".sporttab")].find((el) => (el.dataset.lg || "") === l);
      if (t) t.click();
    }, lg);
    await page.waitForTimeout(2200);
  };
  const dock = async (name) => {
    await page.evaluate((n) => {
      const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === n);
      if (b) b.click();
    }, name);
    await page.waitForTimeout(2500);
  };

  // 1) WNBA strip — no era row, one cumulative line
  await clickTab("wnba");
  await page.screenshot({ path: `${out}/a-wnba-strip-${tag}.png` });
  facts[`eraRow-${tag}`] = await page.evaluate(() =>
    document.querySelectorAll(".msrec-erarow, .sc-era").length);
  facts[`wnbaStrip-${tag}`] = await page.evaluate(() => {
    const el = document.querySelector(".future-note.msrec");
    return el ? el.textContent.replace(/\s+/g, " ").slice(0, 220) : "ABSENT";
  });

  // 2) Desk — records region + 14-day map (give the lazy league loads a beat)
  await dock("Desk");
  await page.waitForTimeout(2500);
  facts[`lgRecs-${tag}`] = await page.evaluate(() =>
    [...document.querySelectorAll(".scoperow.lgr")].map((r) => r.textContent.trim().replace(/\s+/g, " ").slice(0, 90)));
  facts[`cal15-${tag}`] = await page.evaluate(() =>
    [...document.querySelectorAll(".cal-cell")].map((c) => c.getAttribute("title")).filter((t) => t && t.startsWith("2026-08-15")));
  await page.evaluate(() => {
    const el = document.querySelector(".dp-14");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/a-desk-14day-${tag}.png` });
  await page.evaluate(() => {
    const el = document.getElementById("league-records");
    if (el) el.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/a-desk-records-${tag}.png` });

  // 3) Archive — open Aug 15's day, count league-tagged rows
  facts[`msRows-${tag}`] = await page.evaluate(() => {
    const days = [...document.querySelectorAll("#desk-archive .pp-day")];
    const d15 = days.find((d) => (d.querySelector(".pp-date") || {}).textContent?.includes("Aug 15"));
    if (d15 && d15.tagName === "DETAILS") d15.open = true;
    return {
      ppms: document.querySelectorAll("#desk-archive .pp-row.ppms").length,
      d15sum: d15 ? d15.querySelector("summary").textContent.trim().replace(/\s+/g, " ") : "ABSENT",
    };
  });
  await page.evaluate(() => {
    const days = [...document.querySelectorAll("#desk-archive .pp-day")];
    const d15 = days.find((d) => (d.querySelector(".pp-date") || {}).textContent?.includes("Aug 15"));
    if (d15) d15.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/a-desk-archive-${tag}.png` });

  // 4) Research — the strength cut with its sample said
  await dock("Research");
  await page.waitForTimeout(2000);
  facts[`rstr-${tag}`] = await page.evaluate(() => {
    const s = document.querySelector(".rstr");
    if (!s) return "ABSENT";
    return {
      rows: [...s.querySelectorAll(".rstr-row")].map((r) => r.textContent.trim().replace(/\s+/g, " ")),
      foot: (s.querySelector(".rstr-foot") || {}).textContent,
    };
  });
  await page.evaluate(() => {
    const s = document.querySelector(".rstr");
    if (s) s.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/a-research-tiers-${tag}.png` });

  // 5) Calendar page — merged pills
  await dock("Games");
  await page.waitForTimeout(1200);
  await page.evaluate(() => { const c = document.getElementById("cal-btn"); if (c) c.click(); });
  await page.waitForTimeout(1800);
  facts[`cpPills-${tag}`] = await page.evaluate(() =>
    [...document.querySelectorAll(".cp-cell[data-cd]")]
      .filter((c) => (c.dataset.cd || "") >= "2026-08-14" && (c.dataset.cd || "") <= "2026-08-16")
      .map((c) => `${c.dataset.cd}: ${(c.querySelector(".cp-wl") || {}).textContent || "-"}`));
  await page.screenshot({ path: `${out}/a-calendar-${tag}.png` });
  await page.evaluate(() => { const b = document.getElementById("gp-back"); if (b) b.click(); });
  await page.waitForTimeout(800);

  // 6) Control: a graded past board still wears its served stars
  await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dcell")].find((x) => x.dataset.date === "2026-08-16");
    if (d) d.click();
  });
  await page.waitForTimeout(2500);
  facts[`stars16-${tag}`] = await page.evaluate(() => document.querySelectorAll(".de-stars").length);
  await page.screenshot({ path: `${out}/a-board-aug16-${tag}.png` });

  await ctx.close();
}

await shoot(375, 812, "375");
await shoot(1280, 900, "1280");
await browser.close();
writeFileSync(`${out}/a-verify-facts.json`, JSON.stringify(facts, null, 1));
console.log(JSON.stringify(facts, null, 1));
