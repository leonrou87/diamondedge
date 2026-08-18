// UX iter 2 copy-debt audit: verify the landed fixes on PRODUCTION at 375px + desktop.
// Usage: node scripts/shot_uxiter2.mjs [base]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/uxiter2";
mkdirSync(out, { recursive: true });

const settle = async (p, ms = 3000) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.waitForTimeout(ms);
};
const shot = async (p, name) => {
  await p.screenshot({ path: `${out}/${name}.png` });
  console.log("  ✓", name);
};
const counts = async (p) =>
  p.evaluate(() => {
    const t = document.body.innerText;
    const c = (s) => (t.match(new RegExp(s, "gi")) || []).length;
    return {
      title: document.title,
      chips: document.querySelectorAll(".pit-chip").length,
      chipFaces: document.querySelectorAll(".pit-chip .pav img").length,
      seasonSeries: c("SEASON SERIES"),
      mound: c("On the mound"),
      wordmarksVisible: [...document.querySelectorAll(".brand, .gp-brand")].filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        const tx = el.querySelector(".gp-brand-tx, .brand-tx");
        return tx ? !!tx.offsetParent : /DIAMOND/i.test(el.textContent);
      }).length,
    };
  });

const report = {};
for (const [tag, vp] of [["375", { width: 375, height: 812 }], ["desktop", { width: 1280, height: 800 }]]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();

  // 1. today's board — the honest pass state and ad compliance copy must be intact
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await shot(page, `board-${tag}`);
  report[`board-${tag}`] = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      honestPass: /Nothing cleared the bar|NO PLAY TONIGHT|pass costs nothing/i.test(t),
      adCompliance: /21\+ .*Play responsibly|1-800-GAMBLER/i.test(t),
    };
  });

  // 2. an upcoming (pregame) game page — chips with headshots, single wordmark on desktop
  const opened = await page.evaluate(() => {
    const cell = [...document.querySelectorAll(".dcell")].find((x) => x.classList.contains("future"));
    if (cell) cell.click();
    return !!cell;
  });
  await settle(page, 2500);
  const tile = await page.evaluate(() => {
    const el = document.querySelector(".tile.pre");
    if (el) el.click();
    return el ? el.dataset.gid : null;
  });
  await settle(page, 3500);
  if (tile) {
    await page.evaluate(() => {
      const chip = document.querySelector(".pit-chip");
      if (chip) chip.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(1200);
    await shot(page, `game-pregame-${tag}`);
    report[`game-pregame-${tag}`] = { gid: tile, opened, ...(await counts(page)) };
  } else {
    report[`game-pregame-${tag}`] = { error: "no pregame tile found" };
  }

  // 3. a FINAL game page — the started-game de-dup (no chip card, mound section once)
  await page.goto(`${base}/?g=822939`, { waitUntil: "domcontentloaded" });
  await settle(page, 4000);
  report[`game-final-${tag}`] = await counts(page);
  report[`game-final-${tag}`].names = await page.evaluate(() => {
    const t = document.body.innerText;
    const c = (s) => (t.match(new RegExp(s, "gi")) || []).length;
    return { mcclanahan: c("McClanahan"), young: c("Brandon Young") + c("B\\. Young") };
  });
  await shot(page, `game-final-${tag}`);
  await page.evaluate(() => {
    const gl = [...document.querySelectorAll(".st-h")].find((h) => /On the mound/i.test(h.textContent));
    if (gl) gl.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(900);
  await shot(page, `game-final-mound-${tag}`);

  await browser.close();
}
writeFileSync(`${out}/verify.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
