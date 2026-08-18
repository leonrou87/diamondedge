// INDEPENDENT verification of the 2026-08-18 polish pass, run against production.
// Writes verify-*.png beside the before/after shots in audit-screenshots/polish/
// and prints a JSON report. Does not reuse shot_polish.mjs's measurements.
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync } from "node:fs";

const base = process.argv[2] || "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/polish";
mkdirSync(out, { recursive: true });

const R = { consoleErrors: {}, pageErrors: {} };
const settle = async (p, ms = 2600) => {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.waitForTimeout(ms);
};
const shot = (p, n) => p.screenshot({ path: `${out}/${n}.png` }).then(() => console.log("  shot", n));
const clickTab = (p, re) =>
  p.evaluate((src) => {
    const t = [...document.querySelectorAll(".sporttab")].find((b) => new RegExp(src, "i").test(b.textContent || ""));
    if (t) { t.scrollIntoView({ inline: "center" }); t.click(); }
    return !!t;
  }, re);

for (const [tag, vp] of [["375", { width: 375, height: 812 }], ["1280", { width: 1280, height: 800 }]]) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 200)));

  // ---- board today (MLB)
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await clickTab(page, "mlb");
  await page.waitForTimeout(900);
  await shot(page, `verify-board-mlb-${tag}`);
  R[`board-${tag}`] = await page.evaluate(() => {
    const s = document.querySelector(".slate");
    const rows = {};
    if (s) [...s.children].forEach((c) => {
      const b = c.getBoundingClientRect();
      const k = Math.round(b.top + scrollY);
      (rows[k] = rows[k] || []).push((c.className || "").split(" ")[0] || c.tagName.toLowerCase());
    });
    const strip = document.querySelector(".datestrip");
    const rail = document.querySelector(".subhead.subtle .sporttabs") || document.querySelector(".sporttabs");
    const ads = [...document.querySelectorAll(".ad-slot")].map((a) => {
      const r = a.getBoundingClientRect();
      return { h: Math.round(r.height), hasContent: a.childElementCount > 0 && r.height > 40 };
    });
    const dirtyDcell = [...document.querySelectorAll(".dcell")].filter((e) => /\s{2,}/.test(e.className)).length;
    const big = document.querySelector(".state .big");
    return {
      gridFlow: s ? getComputedStyle(s).gridAutoFlow : null,
      rows: Object.values(rows).map((r) => r.join(",")),
      stripMask: strip ? (getComputedStyle(strip).webkitMaskImage || getComputedStyle(strip).maskImage || "").slice(0, 120) : null,
      railMask: rail ? (getComputedStyle(rail).webkitMaskImage || getComputedStyle(rail).maskImage || "").slice(0, 120) : null,
      ads, dirtyDcell,
      tiles: document.querySelectorAll(".tile").length,
      bigBalance: big ? getComputedStyle(big).textWrap : null,
    };
  });

  // record chip on board (for cross-check with /record)
  R[`boardRecord-${tag}`] = await page.evaluate(() => {
    const el = [...document.querySelectorAll("*")].find((e) => e.children.length === 0 && /^\d+-\d+(-\d+)?$/.test((e.textContent || "").trim()));
    return el ? el.textContent.trim() : null;
  });

  // ---- empty league states
  for (const lg of ["nhl", "nfl"]) {
    if (await clickTab(page, lg)) {
      await page.waitForTimeout(800);
      await shot(page, `verify-board-${lg}-${tag}`);
      R[`state-${lg}-${tag}`] = await page.evaluate(() => {
        const st = document.querySelector(".state");
        if (!st) return null;
        const big = st.querySelector(".big"), sm = st.querySelector(".sm");
        const dock = document.querySelector(".dock");
        const msg = (sm || big).getBoundingClientRect();
        const cs = getComputedStyle(st);
        return {
          padding: cs.padding,
          bigText: big ? big.textContent.trim() : null,
          bigLines: big ? Math.round(big.getBoundingClientRect().height / parseFloat(getComputedStyle(big).lineHeight || "22")) : null,
          msgBottom: Math.round(msg.bottom),
          dockTop: dock ? Math.round(dock.getBoundingClientRect().top) : null,
          clearOfDock: dock ? msg.bottom < dock.getBoundingClientRect().top : null,
        };
      });
    }
  }

  // ---- future day
  await clickTab(page, "all");
  await page.waitForTimeout(600);
  const fut = await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dcell.future")].find((c) => c.dataset.date);
    if (d) d.click();
    return d ? d.dataset.date : null;
  });
  if (fut) {
    await page.waitForTimeout(1400);
    await shot(page, `verify-board-future-${tag}`);
    R[`future-${tag}`] = await page.evaluate(() => {
      const fn = document.querySelector(".future-note:not(.msrec)");
      if (!fn) return null;
      const chip = fn.querySelector(".fn-countdown");
      const body = fn.querySelector(".fn-body");
      const ic = fn.querySelector(".fn-ic");
      const c = chip ? chip.getBoundingClientRect() : null;
      const bb = body ? body.getBoundingClientRect() : null;
      const ib = ic ? ic.getBoundingClientRect() : null;
      const val = chip ? chip.querySelector(".fnc-val") : null;
      return {
        chip: c ? `${Math.round(c.width)}x${Math.round(c.height)}` : null,
        chipIsPill: c ? c.width > c.height * 1.8 : null,
        chipOneLine: val ? val.getBoundingClientRect().height < 26 : null,
        chipOnOwnRow: c && bb ? c.top >= bb.bottom - 2 : null,
        bodyBesideIcon: bb && ib ? Math.abs(bb.top - ib.top) < 30 && bb.left > ib.right : null,
        headlineBalance: body ? getComputedStyle(body.querySelector("b") || body).textWrap : null,
      };
    });
  }

  // ---- game page odds tab
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  const opened = await page.evaluate(() => { const t = document.querySelector(".tile"); if (t) t.click(); return !!t; });
  if (opened) {
    await page.waitForTimeout(1400);
    await page.evaluate(() => {
      const o = [...document.querySelectorAll(".gp-tab")].find((b) => /odds/i.test(b.textContent || ""));
      if (o) o.click();
    });
    await page.waitForTimeout(1000);
    await shot(page, `verify-game-odds-${tag}`);
    R[`odds-${tag}`] = await page.evaluate(() => {
      const svg = document.querySelector(".omv-svg");
      if (!svg) return null;
      const ys = [...svg.querySelectorAll("circle,path,polyline")].length;
      // flatness: collect numeric y coords from polyline/path of the series if present
      const poly = svg.querySelector("polyline");
      let flat = null;
      if (poly) {
        const pts = (poly.getAttribute("points") || "").trim().split(/\s+/).map((p) => parseFloat(p.split(",")[1]));
        flat = pts.length > 1 ? Math.max(...pts) - Math.min(...pts) < 1 : null;
      }
      return { viewBox: svg.getAttribute("viewBox"), shapes: ys, seriesFlat: flat, renderedH: Math.round(svg.getBoundingClientRect().height) };
    });
  }

  // ---- news briefing
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.evaluate(() => {
    const n = [...document.querySelectorAll(".dock-item")].find((b) => /news/i.test(b.textContent || ""));
    if (n) n.click();
  });
  await page.waitForTimeout(1800);
  await shot(page, `verify-news-${tag}`);
  R[`news-${tag}`] = await page.evaluate(() => {
    const sep = document.querySelector(".sg-sep");
    const stories = document.querySelectorAll(".story,.stories>*").length;
    return { sepMargin: sep ? getComputedStyle(sep).margin : "no .sg-sep rendered", storyNodes: stories };
  });

  // ---- desk
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await settle(page);
  await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dock-item")].find((b) => /desk/i.test(b.textContent || ""));
    if (d) d.click();
  });
  await page.waitForTimeout(1800);
  await shot(page, `verify-desk-${tag}`);
  R[`desk-${tag}`] = await page.evaluate(() => {
    const m = document.querySelector(".dp-mast");
    const rl = document.querySelector(".rlink");
    const eras = document.querySelectorAll("[class*='era']").length;
    let rlinkHit = null;
    if (rl) {
      const cs = getComputedStyle(rl);
      rlinkHit = { padding: cs.padding, margin: cs.margin, boxH: Math.round(rl.getBoundingClientRect().height) };
    }
    return {
      mastCenter: m ? Math.round(m.getBoundingClientRect().left + m.getBoundingClientRect().width / 2) : null,
      viewportCenter: Math.round(innerWidth / 2),
      rlink: rlinkHit,
      eraNodes: eras,
    };
  });

  // ---- research: "Read the paper" tap target
  await page.evaluate(() => {
    const d = [...document.querySelectorAll(".dock-item")].find((b) => /research/i.test(b.textContent || ""));
    if (d) d.click();
  });
  await page.waitForTimeout(1800);
  R[`research-${tag}`] = await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) => /read the paper/i.test(x.textContent || ""));
    if (!b) return "no Read-the-paper button rendered";
    const r = b.getBoundingClientRect();
    return { size: `${Math.round(r.width)}x${Math.round(r.height)}` };
  });
  await shot(page, `verify-research-${tag}`);

  // ---- /record
  await page.goto(`${base}/record`, { waitUntil: "domcontentloaded" });
  await settle(page, 1800);
  await shot(page, `verify-record-${tag}`);
  R[`record-${tag}`] = await page.evaluate(() => {
    const b = document.querySelector(".rec-mast-back");
    const r = b ? b.getBoundingClientRect() : null;
    const rec = [...document.querySelectorAll("*")].find((e) => e.children.length === 0 && /^\d+-\d+(-\d+)?$/.test((e.textContent || "").trim()));
    return {
      backTarget: r ? `${Math.round(r.width)}x${Math.round(r.height)}` : null,
      headlineRecord: rec ? rec.textContent.trim() : null,
      bodyScrollX: document.documentElement.scrollWidth > innerWidth,
    };
  });

  R.consoleErrors[tag] = errs;
  await browser.close();
}

// served-CSS deploy check: focus-visible ring + sep margin actually in the shipped bundle
{
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  const cssBodies = [];
  page.on("response", async (r) => {
    if (/\.css/.test(r.url())) { try { cssBodies.push(await r.text()); } catch {} }
  });
  await page.goto(base, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
  const css = cssBodies.join("\n");
  R.servedCss = {
    bytes: css.length,
    focusRing: /\.dock-item:focus-visible/.test(css) && /\.dtool:focus-visible/.test(css),
    denseFlow: /grid-auto-flow:\s*row dense/.test(css),
    sepMargin: /sg-sep\{[^}]*margin:0 6px/.test(css) || /sg-sep[^}]*margin:\s*0 6px/.test(css),
    statePad26: /\.state\{padding:26px 18px 34px\}/.test(css) || /max-width:719px[^@]*\.state\{padding:26px 18px 34px/.test(css),
  };
  await browser.close();
}

writeFileSync(`${out}/verify-audit.json`, JSON.stringify(R, null, 2));
console.log(JSON.stringify(R, null, 2));
