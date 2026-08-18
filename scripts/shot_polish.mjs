// POLISH PASS (2026-08-18) verification: after-shots for each landed polish fix, both
// viewports where the finding named both. Files land next to the originals in
// audit-screenshots/polish/ as fix-*.png so before/after pairs read side by side.
// Usage: node scripts/shot_polish.mjs [base]   (default production)
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/polish";
mkdirSync(out, { recursive: true });

const settle = async (p, ms = 2500) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.waitForTimeout(ms);
};
const shot = async (p, name) => {
  await p.screenshot({ path: `${out}/${name}.png` });
  console.log("  ✓", name);
};
const clickTab = (p, re) =>
  p.evaluate((src) => {
    const t = [...document.querySelectorAll(".sporttab")].find((b) => new RegExp(src, "i").test(b.textContent || ""));
    if (t) { t.scrollIntoView({ inline: "center" }); t.click(); }
    return !!t;
  }, re.source);

const report = {};
for (const [tag, vp] of [["375", { width: 375, height: 812 }], ["1280", { width: 1280, height: 800 }]]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();

  // board today (datestrip fades both edges; desktop: no orphaned grid row before the mid ad)
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await clickTab(page, /mlb/);
  await page.waitForTimeout(800);
  await shot(page, `fix-board-mlb-${tag}`);
  report[`grid-${tag}`] = await page.evaluate(() => {
    const s = document.querySelector(".slate");
    if (!s) return null;
    const rows = {};
    [...s.children].forEach((c) => {
      const b = c.getBoundingClientRect();
      const k = Math.round(b.top + scrollY);
      (rows[k] = rows[k] || []).push((c.className || "").split(" ")[0]);
    });
    return { flow: getComputedStyle(s).gridAutoFlow, rows: Object.values(rows).map((r) => r.join(",")) };
  });

  // league empty states (mobile: message must paint above the dock)
  for (const lg of ["nhl", "nfl"]) {
    if (await clickTab(page, new RegExp(lg))) {
      await page.waitForTimeout(700);
      await shot(page, `fix-board-${lg}-${tag}`);
    }
  }
  report[`state-${tag}`] = await page.evaluate(() => {
    const big = document.querySelector(".state .big"), sm = document.querySelector(".state .sm");
    const dock = document.querySelector(".dock");
    if (!big || !dock) return null;
    const b = sm ? sm.getBoundingClientRect() : big.getBoundingClientRect();
    return { messageBottom: Math.round(b.bottom), dockTop: Math.round(dock.getBoundingClientRect().top), clear: b.bottom < dock.getBoundingClientRect().top };
  });

  // future-day banner (chip is a one-line pill on its own row at 375, headline balanced)
  await page.evaluate(() => {
    const all = [...document.querySelectorAll(".sporttab")].find((b) => /all/i.test(b.textContent || ""));
    if (all) all.click();
  });
  await page.waitForTimeout(500);
  const fut = await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dcell.future")].find((c) => c.dataset.date);
    if (d) d.click();
    return d ? d.dataset.date : null;
  });
  if (fut) { await page.waitForTimeout(1200); await shot(page, `fix-board-future-${tag}`); }

  // pregame game page, odds tab (flat total = compact chart, no dead plot)
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  const openedGame = await page.evaluate(() => { const t = document.querySelector(".tile"); if (t) t.click(); return !!t; });
  if (openedGame) {
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      const o = [...document.querySelectorAll(".gp-tab")].find((b) => /odds/i.test(b.textContent || ""));
      if (o) o.click();
    });
    await page.waitForTimeout(900);
    await shot(page, `fix-game-pre-odds-${tag}`);
    report[`omv-${tag}`] = await page.evaluate(() => {
      const svg = document.querySelector(".omv-svg");
      return svg ? svg.getAttribute("viewBox") : null;
    });
  }

  // the briefing's flagship slide (interpunct now has air)
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.evaluate(() => {
    const n = [...document.querySelectorAll(".dock-item")].find((b) => /news/i.test(b.textContent || ""));
    if (n) n.click();
  });
  await page.waitForTimeout(1500);
  await shot(page, `fix-news-${tag}`);
  report[`sep-${tag}`] = await page.evaluate(() => {
    const sep = document.querySelector(".sg-sep");
    return sep ? getComputedStyle(sep).margin : null;
  });

  // the desk (desktop: mast centred with the wordmark)
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dock-item")].find((b) => /desk/i.test(b.textContent || ""));
    if (d) d.click();
  });
  await page.waitForTimeout(1500);
  await shot(page, `fix-desk-${tag}`);
  report[`desk-${tag}`] = await page.evaluate(() => {
    const m = document.querySelector(".dp-mast");
    if (!m) return null;
    const b = m.getBoundingClientRect();
    return { center: Math.round(b.left + b.width / 2), viewportCenter: Math.round(innerWidth / 2) };
  });

  // /record masthead link tap target
  await page.goto(`${base}/record`, { waitUntil: "domcontentloaded" });
  await settle(page, 1500);
  report[`recback-${tag}`] = await page.evaluate(() => {
    const b = document.querySelector(".rec-mast-back");
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  });

  await browser.close();
}
writeFileSync(`${out}/fix-verify.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
