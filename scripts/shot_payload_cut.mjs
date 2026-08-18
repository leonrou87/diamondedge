// Cold-visitor payload cut: verify ?board=1 boot + deferred history on PRODUCTION
// at 375px + desktop. Usage: node scripts/shot_payload_cut.mjs [base]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/uxiter2";
mkdirSync(out, { recursive: true });

const settle = async (p, ms = 3500) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.waitForTimeout(ms);
};
const shot = async (p, name) => {
  await p.screenshot({ path: `${out}/${name}.png` });
  console.log("  ✓", name);
};
const netSnap = (p) =>
  p.evaluate(() => {
    const rs = performance.getEntriesByType("resource");
    const nav = performance.getEntriesByType("navigation")[0];
    const api = rs.filter((e) => e.name.includes("/api/snap") || e.name.includes("/api/manifest"));
    const sum = (arr, k) => arr.reduce((a, e) => a + (e[k] || 0), 0);
    return {
      totalTransfer: sum(rs, "transferSize") + (nav ? nav.transferSize : 0),
      totalDecoded: sum(rs, "decodedBodySize") + (nav ? nav.decodedBodySize : 0),
      jsonTransfer: sum(api, "transferSize"),
      jsonDecoded: sum(api, "decodedBodySize"),
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      requests: api
        .map((e) => ({
          url: e.name.replace(location.origin, "").slice(0, 100),
          transfer: e.transferSize,
          decoded: e.decodedBodySize,
        }))
        .sort((a, b) => b.decoded - a.decoded),
    };
  });

const report = {};
for (const [tag, vp] of [["375", { width: 375, height: 812 }], ["desktop", { width: 1280, height: 800 }]]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();

  // 1. COLD BOOT — fresh context, empty browser cache. The board must load from
  //    ?board=1 with NO ?lite=1 anywhere in the boot waterfall.
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page, 5000);
  await shot(page, `payload-board-${tag}`);
  const boot = await netSnap(page);
  report[`boot-${tag}`] = {
    ...boot,
    boardFetched: boot.requests.some((r) => r.url.includes("board=1")),
    liteFetchedAtBoot: boot.requests.some((r) => r.url.includes("lite=1")),
    tiles: await page.evaluate(() => document.querySelectorAll("article.tile").length),
  };

  // 2. THE BRIEFING (News) — recap slide rows + winner slides must be whole from the window.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /news/i.test(x.textContent || ""));
    if (b) b.click();
  });
  await page.waitForTimeout(2500);
  await shot(page, `payload-briefing-${tag}`);
  report[`briefing-${tag}`] = await page.evaluate(() => {
    const deck = [...document.querySelectorAll(".sts")].map((s) => s.className);
    const recap = document.querySelector(".sts-recap");
    return {
      slides: deck.length,
      winSlides: deck.filter((c) => /sts-win/.test(c)).length,
      recapSlide: !!recap,
      recapPickRows: recap ? recap.querySelectorAll(".sts-rrow").length : 0,
      liteFetched: performance.getEntriesByType("resource").some((e) => e.name.includes("lite=1")),
    };
  });

  // 3. THE DESK — first open must fetch ?lite=1 on demand and render the record + curve.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /desk/i.test(x.textContent || ""));
    if (b) b.click();
  });
  await page.waitForTimeout(4500);
  await shot(page, `payload-desk-${tag}`);
  report[`desk-${tag}`] = await page.evaluate(() => {
    const dv = document.getElementById("desk-view");
    return {
      rendered: !!(dv && dv.innerHTML.length > 5000),
      curveDrawn: !!document.querySelector("#desk-view svg.roicurve"),
      liteFetchedOnOpen: performance.getEntriesByType("resource").some((e) => e.name.includes("lite=1")),
      last14: /THE LAST 14 DAYS/i.test(document.body.innerText),
    };
  });

  // 4. RESEARCH — charts come off the full history; must render after its own load.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /research/i.test(x.textContent || ""));
    if (b) b.click();
  });
  await page.waitForTimeout(3500);
  await shot(page, `payload-research-${tag}`);
  report[`research-${tag}`] = await page.evaluate(() => ({
    charts: document.querySelectorAll("#research-view svg, .lab-chart svg, .chartcard svg").length,
    text: /Cumulative return|Calibration/i.test(document.body.innerText),
  }));

  // 5. A GAME PAGE — content whole (pick panel / box) with history hydrated on demand.
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /games/i.test(x.textContent || ""));
    if (b) b.click();
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const t = document.querySelector("article.tile:not(.ppd)");
    if (t) t.click();
  });
  await page.waitForTimeout(3500);
  await shot(page, `payload-gamepage-${tag}`);
  report[`gamepage-${tag}`] = await page.evaluate(() => {
    const gp = document.getElementById("gp-body");
    return { open: !!gp, contentLen: gp ? gp.innerHTML.length : 0 };
  });
  await page.evaluate(() => history.back());
  await page.waitForTimeout(1200);

  // 6. AN ANALYST CARD — the recent-calls ledger must populate after the in-place upgrade.
  const anOpened = await page.evaluate(() => {
    const a = document.querySelector("[data-an]");
    if (a) a.click();
    return a ? a.getAttribute("data-an") : null;
  });
  await page.waitForTimeout(4000);
  if (anOpened) await shot(page, `payload-analyst-${tag}`);
  report[`analyst-${tag}`] = await page.evaluate(() => {
    const sheet = document.querySelector(".gamepage.anlpage");
    return {
      open: !!sheet,
      recentCallRows: sheet ? sheet.querySelectorAll(".anl-row").length : 0,
    };
  });
  await page.evaluate(() => history.back());
  await page.waitForTimeout(1200);

  // 7. A PAST DATE — the day board (ppd cards included) still loads on demand.
  await page.evaluate(() => {
    const d = [...document.querySelectorAll("button, .dcell")].find((x) =>
      /^(SU|SA)\s*1[56]$/i.test((x.textContent || "").trim().replace(/\s+/g, " ")));
    if (d) d.click();
  });
  await page.waitForTimeout(4000);
  await shot(page, `payload-pastdate-${tag}`);
  report[`pastdate-${tag}`] = await page.evaluate(() => ({
    tiles: document.querySelectorAll("article.tile").length,
    errorState: /NO GAMES TO SHOW|Couldn't reach/i.test(document.body.innerText),
  }));

  await browser.close();
}

writeFileSync(`${out}/payload_verify.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
