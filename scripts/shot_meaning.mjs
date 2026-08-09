// WHAT DO RED AND GREEN MEAN NOW? Shot from PRODUCTION at 375px.
//
// Two frames, and the second one is labelled for a reason.
//
//   1 · board-real.png      the production board, untouched. It carries a WON
//                           pick, a LOST pick, a PUSH, and a game we have no
//                           pick on. The thing to look at is that the pick pill
//                           reads the SAME cyan UNDER on the won card and on the
//                           lost card — a side is not an outcome — while the
//                           seal and the leading edge are what change.
//
//   2 · board-live.png      the same production page with the app's own `.live`
//                           class applied to two real cards, because at capture
//                           time NO MLB GAME WAS LIVE (14 finals, 1 scheduled).
//                           This is a state demonstration on the shipped build,
//                           not a live moment, and it is named that way rather
//                           than passed off as one. It exists because "gold edge
//                           = a game is being played, red edge = our bet died"
//                           is the whole claim and it needs both edges in one
//                           frame to be checkable.
//
// Usage: node scripts/shot_meaning.mjs [url]
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/colour-meaning";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 2,
  colorScheme: "light",
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(`${base}/?shot=${Date.now()}`, { waitUntil: "domcontentloaded" });
await page.waitForLoadState("networkidle").catch(() => {});
await page.waitForTimeout(3500);

// what is actually on the board, read off the DOM rather than assumed
const census = await page.evaluate(() => {
  const els = [...document.querySelectorAll(".tile")];
  return els.map((el, i) => ({
    i,
    edge: ["res-won", "res-lost", "res-push"].filter(c => el.classList.contains(c))[0] || "none",
    live: el.classList.contains("live"),
    nopick: !el.querySelector(".de-mini-word"),
    side: (el.querySelector(".de-mini-word") || {}).innerText || "",
    sideColor: el.querySelector(".de-mini-word")
      ? getComputedStyle(el.querySelector(".de-mini-word")).color : "",
  }));
});
console.log(JSON.stringify(census, null, 1));

const scrollToTile = async (idx, pad = 58) => {
  await page.evaluate(([i, p]) => {
    const els = [...document.querySelectorAll(".tile")];
    window.scrollTo(0, els[i].getBoundingClientRect().top + window.scrollY - p);
  }, [idx, pad]);
  await page.waitForTimeout(700);
};

// ── 1 · the real board ──────────────────────────────────────────────────────
// pick the frame that carries the most distinct meanings at once
const lost = census.findIndex(t => t.edge === "res-lost" && !t.nopick);
await scrollToTile(Math.max(0, lost));
await page.screenshot({ path: `${out}/board-real.png` });
console.log("✓ board-real.png  (untouched production board)");

// ── 2 · the same build with the live state applied ──────────────────────────
// Pick a run of three ROWS that already contains a WON card and a LOST card,
// then make the two cards in the middle row live — one we have a pick on and
// one we do not. That puts all four meanings in a single 812px frame:
//   gold top edge   = this game is being played        (both middle cards)
//   red left edge   = our bet on this game is dead
//   green left edge = our bet on this game cashed
//   no edge at all  = we have no pick on this game
const applied = await page.evaluate(() => {
  const els = [...document.querySelectorAll(".tile")];
  const edgeOf = el => ["res-won", "res-lost", "res-push"]
    .filter(c => el.classList.contains(c))[0] || "none";
  // rows are 2-up on this breakpoint
  const rows = [];
  for (let i = 0; i < els.length; i += 2) rows.push([i, i + 1].filter(j => els[j]));
  const nopick = i => !els[i].querySelector(".de-mini-word");
  let best = null;
  // FOUR MEANINGS IN ONE FRAME or it does not prove the claim: a live game, a
  // won pick, a lost pick, and a game we never bet. Fall back to won+lost only
  // if the board has no such window rather than shipping a frame that lies.
  for (let r = 0; r + 2 < rows.length; r++) {
    const win = [rows[r], rows[r + 1], rows[r + 2]].flat();
    const kinds = new Set(win.map(i => edgeOf(els[i])));
    if (kinds.has("res-won") && kinds.has("res-lost") && win.some(nopick)) { best = r; break; }
  }
  for (let r = 0; best === null && r + 2 < rows.length; r++) {
    const win = [rows[r], rows[r + 1], rows[r + 2]].flat();
    const kinds = new Set(win.map(i => edgeOf(els[i])));
    if (kinds.has("res-won") && kinds.has("res-lost")) best = r;
  }
  if (best === null) return { marked: [], top: 0 };
  const mid = rows[best + 1];
  for (const i of mid) {
    els[i].classList.add("live");
    const st = els[i].querySelector(".statechip, .t-state, [class*='state']");
    if (st) st.textContent = "Bot 6th";
  }
  return { marked: mid, top: rows[best][0] };
});
console.log("live state applied to tiles", applied.marked);
if (applied.marked.length) {
  await scrollToTile(applied.top, 8);
  await page.screenshot({ path: `${out}/board-live.png` });
  console.log("✓ board-live.png  (STATE DEMO — no game was live at capture time)");
}

await browser.close();
