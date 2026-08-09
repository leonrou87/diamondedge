// Colour-system sprint: capture the four surfaces at 375px, light + dark.
// Usage: node scripts/shot_colour.mjs <before|after> [port]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";

const tag = process.argv[2] || "before";
const port = process.argv[3] || "3100";
const base = `http://localhost:${port}`;
const out = `/Users/leonrou/Desktop/diamondedge/audit-screenshots/colour-system/${tag}`;
mkdirSync(out, { recursive: true });

const settle = async (p, ms = 2600) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.waitForTimeout(ms);
};

async function shot(page, name) {
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log("  ✓", name);
}

for (const scheme of ["light", "dark"]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    colorScheme: scheme,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const sfx = scheme === "dark" ? "-dark" : "";
  console.log(`[${tag}/${scheme}]`);

  // 1 — THE BOARD
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await shot(page, `board${sfx}`);

  // 2 — A GAME PAGE (first tile on the board)
  const tile = page.locator("article.tile[data-gid]").first();
  if (await tile.count()) {
    await tile.click({ force: true });
    await settle(page, 2400);
    await shot(page, `game${sfx}`);
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(700);
  }

  // 3/4 — DESK and RESEARCH
  for (const [tab, name] of [["desk", "desk"], ["research", "research"]]) {
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await settle(page, 1800);
    const btn = page.locator(`.dock-item[data-tab="${tab}"]`);
    if (await btn.count()) {
      await btn.click({ force: true });
      await settle(page, 2400);
      await shot(page, `${name}${sfx}`);
    }
  }

  await browser.close();
}
console.log("→", out);
