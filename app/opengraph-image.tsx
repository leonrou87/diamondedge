import { ImageResponse } from "next/og";

// Node runtime — reads the record block behind every record surface in the app.
export const runtime = "nodejs";

/* ═══ THE SHARE CARD SAYS WHAT THE SITE SAYS ═══════════════════════════════════
   Branded 1200×630 card, rendered for any DiamondEdge link shared to social or
   messages. It is the FIRST number most people ever see from this product, and
   until 2026-08-09 it was the only surface that made its numbers up.

   WHAT IT USED TO DO. It read `value_record.validated_history` — a store no other
   surface in the app touches — and then printed three figures that were not read
   from anywhere at all, hardcoded as JSX literals: "≈55%", "56.9% on 239 picks we
   never trained on", "+3–4%", plus an in-sample backtest line ("58.1% · 886
   graded · +11%"). On 2026-08-09 the Record screen's hero said 84-77-9 / 52.2%
   on 170 graded, and a link pasted from that same screen unfurled a card claiming
   56.9% on 239 and 58.1% on 886. Four numbers for one claim, and the biggest of
   them lived nowhere but in this file.

   Re-pointing it at a different store would not have been enough — the literals
   had no store. So it is RE-SOURCED: it now reads `record.headline`, the same
   block `recordRoot()` → `headlineRecordBlock()` serves to the Desk hero, the
   scope rows and the share string, merged across the two feeds by the same rule
   (newest `generated_utc` wins per key). If the record cannot be read, the card
   says nothing numeric rather than inventing a figure.

   THE CURVE IS THE SAME LEDGER AS THE NUMBER ABOVE IT. It is cumulative units
   through `record.daily` — the days that make up the headline — not a separate
   per-year backtest. Card and site cannot disagree, because there is one source.
   ══════════════════════════════════════════════════════════════════════════════ */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DiamondEdge — every sports pick graded in the open";

// ---- Data --------------------------------------------------------------------

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/* A NARROW READ, ON PURPOSE. picks_unified is ~13 MB and 93% of it is games[];
   this card needs two JSON paths out of it. Selecting them server-side keeps the
   read at ~42 KB — the same discipline as /api/snap's ?lite= projection, which
   exists because direct full-payload reads are what ran the project to 208% of
   its egress allowance. */
const SELECT =
  "headline:payload->record->headline,daily:payload->record->daily,gen:payload->generated_utc";

async function readSnapshot(key: string) {
  try {
    if (!SUPA || !KEY) return null;
    const r = await fetch(
      `${SUPA}/rest/v1/slate_snapshots?key=eq.${key}&select=${SELECT}`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, next: { revalidate: 300 } }
    );
    if (!r.ok) return null;
    const rows = await r.json();
    return (rows && rows[0]) || null;
  } catch {
    return null;
  }
}

const stampMs = (row: any) => {
  const t = Date.parse(String((row && row.gen) || ""));
  return Number.isFinite(t) ? t : 0;
};
const fin = (v: any) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/* The two feeds carrying a record block, merged exactly as recordRoot() merges
   them in the app: newest generated_utc wins per key, and `daily` is merged
   PER DATE rather than wholesale — the live feed only carries a short recent
   window, so taking its map whole would drop every older day from the curve. */
async function getRecord() {
  const [hist, live] = await Promise.all([
    readSnapshot("picks_unified"),
    readSnapshot("picks_unified_live"),
  ]);
  const rows = [hist, live].filter(Boolean).sort((a, b) => stampMs(a) - stampMs(b));
  if (!rows.length) return null;

  const headline = rows.reduce<any>((acc, r) => (r.headline && typeof r.headline === "object" ? r.headline : acc), null);
  if (!headline) return null;

  const byDate: Record<string, any> = {};
  rows.forEach((r) => {
    const d = r.daily;
    const put = (k: string, block: any) => {
      const key = String(k || "").slice(0, 10);
      if (key && block && typeof block === "object") byDate[key] = block;
    };
    if (Array.isArray(d)) d.forEach((x: any) => put(x && x.date, x));
    else if (d && typeof d === "object") Object.keys(d).forEach((k) => put(k, d[k]));
  });

  const w = fin(headline.win) || 0;
  const l = fin(headline.loss) || 0;
  const p = fin(headline.push) || 0;
  if (w + l <= 0) return null;

  const rec = {
    // The en dash is the score dash everywhere else in the product; the served
    // string uses hyphens, so it is normalised rather than reprinted.
    wl: headline.record ? String(headline.record).replace(/-/g, "–") : `${w}–${l}${p ? `–${p}` : ""}`,
    // HIT RATE IS DERIVED, ALWAYS — never the served number. A push is not a
    // loss and not a win; w/(w+l) is the only definition this app uses, and the
    // card taking a served hit_rate while the site derives it is precisely how
    // one record ends up showing two percentages.
    hit: w + l > 0 ? w / (w + l) : null,
    units: fin(headline.units),
    n: fin(headline.n) != null ? fin(headline.n) : w + l + p,
    start: String(headline.start || "").slice(0, 10),
    days: fin(headline.n_days),
  };
  return { rec, series: equitySeries(byDate) };
}

/* Cumulative units through each served day, oldest first. Same arithmetic as the
   app's own units curve: sum record.daily[d].units. A day with no `units` is a
   day that staked nothing, so it carries the running total forward unchanged —
   it is never imputed from roi, because two builders with two missing-units
   policies is how the Desk and Research ended up drawing opposite signs. */
function equitySeries(byDate: Record<string, any>) {
  try {
    const dates = Object.keys(byDate).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
    if (dates.length < 2) return null;
    let cum = 0;
    const pts: any[] = [{ date: dates[0], units: 0, origin: true }];
    dates.forEach((d) => {
      cum += Number(byDate[d] && byDate[d].units) || 0;
      pts.push({ date: d, units: cum });
    });
    if (pts.length < 3) return null;
    const last = pts[pts.length - 1];
    if (!isFinite(last.units)) return null;
    return { pts, totalUnits: cum, last, first: dates[0], through: dates[dates.length - 1] };
  } catch {
    return null;
  }
}

const dayLabel = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ---- SVG curve builder -------------------------------------------------------
// Monotone-cubic path THROUGH the real day anchors (no fabricated intermediate
// points), with a filled area to the zero baseline.
function buildCurveSvg(s: any) {
  const W = 1040, H = 292, PL = 8, PR = 70, PT = 26, PB = 46;
  const iw = W - PL - PR, ih = H - PT - PB;
  const pts = s.pts;
  const n = pts.length;
  const us = pts.map((p: any) => p.units);
  let yMin = Math.min(0, ...us), yMax = Math.max(0, ...us);
  const ypad = (yMax - yMin) * 0.12 || 1;
  yMax += ypad;
  if (yMin < 0) yMin -= ypad;
  const sx = (i: number) => PL + (i / (n - 1)) * iw;
  const sy = (v: number) => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * ih;
  const y0 = sy(0);
  const X = pts.map((_: any, i: number) => sx(i));
  const Y = pts.map((p: any) => sy(p.units));
  // Monotone-cubic tangents (never overshoot the data).
  const dxs: number[] = [], slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = X[i + 1] - X[i];
    dxs.push(dx);
    slopes.push((Y[i + 1] - Y[i]) / (dx || 1));
  }
  const m: number[] = new Array(n);
  m[0] = slopes[0];
  m[n - 1] = slopes[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) m[i] = 0;
    else m[i] = (slopes[i - 1] + slopes[i]) / 2;
  }
  let line = `M${X[0].toFixed(1)} ${Y[0].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = dxs[i];
    line += ` C${(X[i] + dx / 3).toFixed(1)} ${(Y[i] + (m[i] * dx) / 3).toFixed(1)} ${(X[i + 1] - dx / 3).toFixed(1)} ${(Y[i + 1] - (m[i + 1] * dx) / 3).toFixed(1)} ${X[i + 1].toFixed(1)} ${Y[i + 1].toFixed(1)}`;
  }
  const area = `${line} L${X[n - 1].toFixed(1)} ${y0.toFixed(1)} L${X[0].toFixed(1)} ${y0.toFixed(1)} Z`;
  const dotX = X[n - 1], dotY = Y[n - 1];
  const up = s.totalUnits >= 0;
  const stroke = up ? "#2fbf71" : "#e0574f";
  const endLab = `${up ? "+" : ""}${s.totalUnits.toFixed(1)}u`;

  /* Satori in this next/og build does NOT support <text> inside <svg> ("<text>
     nodes are not currently supported"). So the SVG draws ONLY paths/lines/
     circles; every text label is an absolutely-positioned flex <div> overlaid on
     it. The viewBox is W×H and the overlay box is the same size, so pixel
     coordinates map 1:1. */
  const edgeLabel = (i: number, text: string) => {
    const anchor = i === n - 1 ? "flex-end" : "flex-start";
    const cx = sx(i);
    const left = anchor === "flex-start" ? cx - 6 : cx - 114;
    return (
      <div
        key={`dl${i}`}
        style={{
          position: "absolute",
          left: `${left.toFixed(1)}px`,
          top: `${(H - 34).toFixed(1)}px`,
          width: "120px",
          display: "flex",
          justifyContent: anchor,
          fontSize: 22,
          color: "#7d8ba3",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {text}
      </div>
    );
  };

  return (
    <div style={{ position: "relative", display: "flex", width: `${W}px`, height: `${H}px` }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eqvfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={stroke} stopOpacity="0.30" />
            <stop offset="1" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* zero baseline */}
        <line x1={PL} y1={y0.toFixed(1)} x2={W - PR} y2={y0.toFixed(1)} stroke="#2c3648" strokeWidth="2" />
        <path d={area} fill="url(#eqvfill)" />
        <path d={line} fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={dotX.toFixed(1)} cy={dotY.toFixed(1)} r="9" fill={stroke} />
        <circle cx={dotX.toFixed(1)} cy={dotY.toFixed(1)} r="16" fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth="3" />
      </svg>
      {/* "0" baseline label */}
      <div
        style={{
          position: "absolute",
          left: `${(W - PR + 8).toFixed(1)}px`,
          top: `${(y0 - 15).toFixed(1)}px`,
          display: "flex",
          fontSize: 22,
          color: "#7d8ba3",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        0
      </div>
      {/* endpoint value label, sitting up-left of the end dot */}
      <div
        style={{
          position: "absolute",
          left: `${(dotX - 128).toFixed(1)}px`,
          top: `${(dotY - 54).toFixed(1)}px`,
          width: "120px",
          display: "flex",
          justifyContent: "flex-end",
          fontSize: 36,
          fontWeight: 800,
          color: up ? "#4fe08a" : "#ff7a70",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {endLab}
      </div>
      {edgeLabel(1, dayLabel(pts[1].date))}
      {edgeLabel(n - 1, dayLabel(s.through))}
    </div>
  );
}

// ---- Card pieces -------------------------------------------------------------

/* The share card carries the same lockup as the masthead and the app icon: the
   drawn house mark (rhombus outline + solid core, flat gold, no bevel) and the
   wordmark whose contrast is WEIGHT rather than a second use of the accent.
   See the mark note in globals.css. */
function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg width="58" height="58" viewBox="0 0 32 32">
        <path d="M16 3.4 28.6 16 16 28.6 3.4 16Z" fill="none" stroke="#f5be42" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 10.6 21.4 16 16 21.4 10.6 16Z" fill="#f5be42" />
      </svg>
      <div style={{ display: "flex", fontSize: 44, letterSpacing: "5px", color: "#f2f6fc" }}>
        <span style={{ fontWeight: 300 }}>DIAMOND</span>
        <span style={{ fontWeight: 800, letterSpacing: "3px" }}>EDGE</span>
      </div>
    </div>
  );
}

function Frame({ children }: { children: any }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background:
          "radial-gradient(1000px 500px at 100% -10%, rgba(224,172,32,0.18), transparent 60%), linear-gradient(135deg, #0b0f18 0%, #141b28 100%)",
        color: "#f0f4fa",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

const Domain = () => (
  <div
    style={{
      display: "flex",
      fontSize: 24,
      color: "#e0ac20",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: 700,
      letterSpacing: "3px",
    }}
  >
    DIAMONDEDGE.KYTEPUSH.COM
  </div>
);

/* The record, in the site's own words, from the site's own block. `sinceTxt` is
   the headline's own start date — never a date this file chose. */
function RecordLine(rec: any) {
  const since = rec.start ? dayLabel(rec.start) : "";
  const bits = [
    rec.hit != null ? `${(rec.hit * 100).toFixed(1)}% hit rate` : "",
    rec.units != null ? `${rec.units >= 0 ? "+" : ""}${rec.units.toFixed(1)}u` : "",
    rec.n ? `${rec.n.toLocaleString()} picks graded` : "",
  ].filter(Boolean).join(" · ");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#f0f4fa", fontFamily: "Helvetica, Arial, sans-serif", lineHeight: 1 }}>
          {rec.wl}
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#8fa0b8", fontFamily: "Helvetica, Arial, sans-serif" }}>
          every pick we published{since ? `, since ${since}` : ""}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28, color: "#cbd6e6", fontFamily: "Helvetica, Arial, sans-serif" }}>
        {bits}
      </div>
    </div>
  );
}

// TEXT card — used whenever the curve can't be built (fewer than two served
// days). Still quotes the real record; never a figure from anywhere else.
function TextCard(rec: any) {
  return (
    <Frame>
      <Brand />
      {rec ? (
        RecordLine(rec)
      ) : (
        <div style={{ display: "flex", fontSize: 62, fontWeight: 800, lineHeight: 1.06, maxWidth: 1000 }}>
          Every pick, graded against the final score.
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontSize: 26, color: "#8fa0b8", fontFamily: "Helvetica, Arial, sans-serif" }}>
          Graded in the open — win or lose.
        </div>
        <Domain />
      </div>
    </Frame>
  );
}

// HERO card — the record, then the same ledger drawn as cumulative units.
function CurveCard(rec: any, series: any) {
  return (
    <Frame>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Brand />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7d8ba3",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "3px",
          }}
        >
          GRADED IN THE OPEN
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: "2px" }}>
        {RecordLine(rec)}
        <div style={{ display: "flex", marginTop: "6px" }}>{buildCurveSvg(series)}</div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px" }}>
        <div style={{ display: "flex", fontSize: 24, color: "#7d8ba3", fontFamily: "Helvetica, Arial, sans-serif" }}>
          Net units, every day we served a pick.
        </div>
        <Domain />
      </div>
    </Frame>
  );
}

// ---- Route -------------------------------------------------------------------

export default async function OpengraphImage() {
  const data = await getRecord();
  const rec = data && data.rec;
  const series = data && data.series;
  const el = rec && series && series.pts && series.pts.length >= 3 ? CurveCard(rec, series) : TextCard(rec);
  return new ImageResponse(el, { ...size });
}
