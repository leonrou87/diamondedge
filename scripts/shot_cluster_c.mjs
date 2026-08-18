// CLUSTER C VERIFICATION — WNBA tiles no longer say "picks soon" forever.
// Shot from PRODUCTION at 375px and desktop 1280px.
//
//   wnba-today-*.png    today's WNBA board pre-wall: each tile states its REAL
//                       post moment ("PICKS 1:00 PM PT"), the same derivation
//                       the header's PICKS POST chip uses.
//   wnba-pass-*.png     Aug 17 DAL@GS, a final the engine PASSED: the tile now
//                       carries the NO BET pass mark with the engine's own
//                       served why sentence (was: a blank right half).
//   nfl-board-*.png     the NFL tab on its next slate date — same code path.
//   soccer-board-*.png  the SOCCER (MLS) tab — exercises the mls/soccer join.
//
// Usage: node scripts/shot_cluster_c.mjs [url]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/bugfix";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

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
      const t = [...document.querySelectorAll(".sporttab")].find(
        (el) => (el.textContent || "").toUpperCase().includes(l));
      if (t) t.click();
    }, lg);
    await page.waitForTimeout(2500);
  };
  const clickDate = async (dayNum) => {
    await page.evaluate((d) => {
      const b = [...document.querySelectorAll("button")].find(
        (el) => new RegExp(`August ${d}$`).test(el.getAttribute("aria-label") || "")
          || new RegExp(`, August ${d}$`).test(el.getAttribute("aria-label") || ""));
      if (b) b.click();
    }, dayNum);
    await page.waitForTimeout(2500);
  };

  // 1 · today's WNBA board
  await clickTab("WNBA");
  await page.screenshot({ path: `${out}/wnba-today-${tag}.png`, fullPage: false });
  const tags = await page.evaluate(() =>
    [...document.querySelectorAll(".tile")].map((el) => ({
      teams: (el.getAttribute("aria-label") || "").slice(0, 30),
      tag: (el.querySelector(".de-mini-word") || {}).innerText || "",
      nobet: !!el.querySelector(".tv-nobet"),
    })));
  console.log(`[${tag}] WNBA today:`, JSON.stringify(tags));

  // 2 · Aug 17, the final PASS
  await clickDate(17);
  await page.screenshot({ path: `${out}/wnba-pass-aug17-${tag}.png`, fullPage: false });
  const pass = await page.evaluate(() =>
    [...document.querySelectorAll(".tile")].map((el) => ({
      aria: (el.getAttribute("aria-label") || "").slice(0, 120),
      cls: el.className,
    })));
  console.log(`[${tag}] WNBA Aug 17:`, JSON.stringify(pass));

  // 3 · NFL tab (own next slate)
  await clickTab("NFL");
  await page.screenshot({ path: `${out}/nfl-board-${tag}.png`, fullPage: false });

  // 4 · SOCCER (MLS) tab
  await clickTab("SOCCER");
  await page.screenshot({ path: `${out}/soccer-board-${tag}.png`, fullPage: false });

  await ctx.close();
}

await shoot(375, 812, "375");
await shoot(1280, 800, "desktop");
await browser.close();
console.log("done ->", out);
