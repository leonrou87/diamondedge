import { ImageResponse } from "next/og";

// Node runtime — fetches the multi-MB pregame_picks payload for the live record.
export const runtime = "nodejs";

// Branded 1200×630 share card — rendered for any DiamondEdge link shared to social/messages.
// HERO: the rising cumulative-units EQUITY CURVE (the validated record as visual proof).
// Built from value_record.validated_history.by_year — the SAME honest per-YEAR ledger behind
// the on-site curve (app/page.tsx validatedEquitySeries) and the 886 / 58.1% / +11% headline.
// If the curve can't be built (no/short by_year), FALL BACK to the text-only card. Never breaks.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DiamondEdge — every sports pick graded in the open";

// ---- Data --------------------------------------------------------------------

async function getRecord() {
  try {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA || !KEY) return null;
    const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.pregame_picks&select=payload`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 300 },
    });
    const rows = await r.json();
    const vh =
      rows && rows[0] && rows[0].payload && rows[0].payload.value_record &&
      rows[0].payload.value_record.validated_history;
    if (!vh) return null;
    const mp = vh.median_price || {};
    const rec =
      mp.hit != null
        ? {
            hit: Number(mp.hit),
            roi: mp.roi != null ? Number(mp.roi) : null,
            n: vh.bets_graded ? Number(vh.bets_graded) : null,
          }
        : null;
    return { rec, series: validatedEquitySeries(vh) };
  } catch {
    return null;
  }
}

// Cumulative units through each real per-YEAR anchor. Mirrors page.tsx exactly:
//   profit(year) = n * roi (return per unit at median price); cumulative = running sum.
// Returns null (→ text fallback) unless there are ≥2 real year anchors.
function validatedEquitySeries(vh: any) {
  try {
    const by = vh && vh.by_year;
    if (!by || typeof by !== "object") return null;
    const years = Object.keys(by)
      .filter((y) => /^\d{4}$/.test(y) && by[y] && by[y].n != null)
      .sort();
    if (years.length < 2) return null;
    let cumN = 0,
      cumU = 0;
    // Origin anchor: start of the record, zero units / zero profit.
    const pts: any[] = [{ year: years[0], cumN: 0, units: 0, origin: true }];
    years.forEach((y) => {
      const r = by[y] || {};
      const n = Number(r.n) || 0;
      const roi = Number(r.roi) || 0;
      cumN += n;
      cumU += n * roi;
      pts.push({ year: y, cumN, units: cumU });
    });
    if (pts.length < 3) return null;
    const last = pts[pts.length - 1];
    if (!isFinite(last.units)) return null;
    return { pts, totalN: cumN, totalUnits: cumU, blendedRoi: cumN ? cumU / cumN : 0, last };
  } catch {
    return null;
  }
}

// ---- SVG curve builder -------------------------------------------------------
// Monotone-cubic path THROUGH the real year anchors (no fabricated intermediate points),
// with a filled area to the zero baseline. Coordinates computed in JS, mapped to the viewBox.
function buildCurveSvg(s: any) {
  const W = 1040,
    H = 300,
    PL = 8,
    PR = 70,
    PT = 26,
    PB = 46;
  const iw = W - PL - PR,
    ih = H - PT - PB;
  const pts = s.pts;
  const n = pts.length;
  const us = pts.map((p: any) => p.units);
  let yMin = Math.min(0, ...us),
    yMax = Math.max(0, ...us);
  const ypad = (yMax - yMin) * 0.12 || 1;
  yMax += ypad;
  if (yMin < 0) yMin -= ypad;
  const sx = (i: number) => PL + (i / (n - 1)) * iw;
  const sy = (v: number) => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * ih;
  const y0 = sy(0);
  const X = pts.map((_: any, i: number) => sx(i));
  const Y = pts.map((p: any) => sy(p.units));
  // Monotone-cubic tangents (never overshoot the data).
  const dxs: number[] = [],
    slopes: number[] = [];
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
  const dotX = X[n - 1],
    dotY = Y[n - 1];
  const endLab = `+${Math.round(s.totalUnits)}u`;
  const nodes = pts.map((p: any, i: number) =>
    p.origin ? null : (
      <circle key={`n${i}`} cx={sx(i).toFixed(1)} cy={sy(p.units).toFixed(1)} r="4.5" fill="#2fbf71" />
    )
  );

  // Satori in this next/og build does NOT support <text> inside <svg> ("<text> nodes are not
  // currently supported"). So the SVG draws ONLY paths/lines/circles; every text label (year
  // ticks, the "0" baseline label, the endpoint "+96u") is rendered as an absolutely-positioned
  // flex <div> overlaid on the SVG. The SVG viewBox is W×H; the overlay box is the same size, so
  // pixel coords map 1:1.
  const yearLabels = pts.map((p: any, i: number) => {
    if (p.origin) return null;
    const anchor = i === n - 1 ? "flex-end" : i === 1 ? "flex-start" : "center";
    // Center a 120px-wide label box on the x-tick; clamp within the frame.
    const cx = sx(i);
    let left = cx - 60;
    if (anchor === "flex-start") left = cx - 6;
    if (anchor === "flex-end") left = cx - 114;
    return (
      <div
        key={`yl${i}`}
        style={{
          position: "absolute",
          left: `${left.toFixed(1)}px`,
          top: `${(H - 34).toFixed(1)}px`,
          width: "120px",
          display: "flex",
          justifyContent: anchor,
          fontSize: 22,
          color: "#7d8ba3",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {p.year}
      </div>
    );
  });

  return (
    <div style={{ position: "relative", display: "flex", width: `${W}px`, height: `${H}px` }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eqvfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2fbf71" stopOpacity="0.30" />
            <stop offset="1" stopColor="#2fbf71" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* zero baseline */}
        <line x1={PL} y1={y0.toFixed(1)} x2={W - PR} y2={y0.toFixed(1)} stroke="#2c3648" strokeWidth="2" />
        <path d={area} fill="url(#eqvfill)" />
        <path d={line} fill="none" stroke="#2fbf71" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        {nodes}
        <circle cx={dotX.toFixed(1)} cy={dotY.toFixed(1)} r="9" fill="#2fbf71" />
        <circle cx={dotX.toFixed(1)} cy={dotY.toFixed(1)} r="16" fill="none" stroke="#2fbf71" strokeOpacity="0.35" strokeWidth="3" />
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
          fontFamily: "Arial, sans-serif",
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
          color: "#4fe08a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {endLab}
      </div>
      {yearLabels}
    </div>
  );
}

// ---- Card variants -----------------------------------------------------------

function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
      <div
        style={{
          width: 56,
          height: 56,
          transform: "rotate(45deg)",
          borderRadius: 13,
          background: "linear-gradient(135deg, #f6dd94, #e0ac20)",
          boxShadow: "0 0 40px rgba(224,172,32,0.5)",
        }}
      />
      <div style={{ display: "flex", fontSize: 50, fontWeight: 800, letterSpacing: "-1px" }}>
        <span>Diamond</span>
        <span style={{ color: "#e0ac20" }}>Edge</span>
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
        fontFamily: "Georgia, serif",
      }}
    >
      {children}
    </div>
  );
}

// TEXT fallback — the prior card. Used whenever the curve can't be built safely.
function TextCard(rec: any) {
  const stat = rec
    ? `${(rec.hit * 100).toFixed(1)}% winners${rec.n ? ` · ${rec.n.toLocaleString()} graded picks` : ""}${
        rec.roi != null ? ` · ${rec.roi >= 0 ? "+" : ""}${(rec.roi * 100).toFixed(0)}% return` : ""
      }`
    : "";
  return (
    <Frame>
      <Brand />
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
          Every pick, graded in the open.
        </div>
        {stat ? (
          <div style={{ display: "flex", fontSize: 40, color: "#e0ac20", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>
            {stat}
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 34, color: "#8fa0b8", fontFamily: "Arial, sans-serif", maxWidth: 900 }}>
            The story, the bets worth taking, and every call graded against the final score.
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 26,
          color: "#e0ac20",
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          letterSpacing: "3px",
        }}
      >
        DIAMONDEDGE.KYTEPUSH.COM
      </div>
    </Frame>
  );
}

// HERO card — the equity curve is the hero, record numbers beneath, brand + domain.
function CurveCard(rec: any, series: any) {
  const hitPct = rec && rec.hit != null ? `${(rec.hit * 100).toFixed(1)}%` : null;
  const nPicks = rec && rec.n ? rec.n.toLocaleString() : series.totalN.toLocaleString();
  const roiPct =
    rec && rec.roi != null
      ? `${rec.roi >= 0 ? "+" : ""}${(rec.roi * 100).toFixed(0)}%`
      : `+${(series.blendedRoi * 100).toFixed(0)}%`;
  const yr0 = series.pts[1] ? series.pts[1].year : "";
  const yr1 = series.last.year;
  return (
    <Frame>
      {/* Top row: brand + section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Brand />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7d8ba3",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "3px",
          }}
        >
          HISTORICAL VALIDATED RECORD
        </div>
      </div>

      {/* Hero: the curve */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
          <div style={{ display: "flex", fontSize: 42, fontWeight: 800, color: "#f0f4fa", fontFamily: "Georgia, serif" }}>
            Cumulative units, {yr0}–{yr1}
          </div>
        </div>
        <div style={{ display: "flex", marginTop: "6px" }}>{buildCurveSvg(series)}</div>
      </div>

      {/* Record numbers + domain */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {hitPct && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 46, fontWeight: 800, color: "#e0ac20", fontFamily: "Arial, sans-serif" }}>
                {hitPct}
              </div>
              <div style={{ display: "flex", fontSize: 22, color: "#8fa0b8", fontFamily: "Arial, sans-serif" }}>winners</div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 800, color: "#f0f4fa", fontFamily: "Arial, sans-serif" }}>
              {nPicks}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#8fa0b8", fontFamily: "Arial, sans-serif" }}>graded picks</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 800, color: "#4fe08a", fontFamily: "Arial, sans-serif" }}>
              {roiPct}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#8fa0b8", fontFamily: "Arial, sans-serif" }}>return</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#e0ac20",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            letterSpacing: "3px",
          }}
        >
          DIAMONDEDGE.KYTEPUSH.COM
        </div>
      </div>
    </Frame>
  );
}

// ---- Route -------------------------------------------------------------------

export default async function OpengraphImage() {
  const data = await getRecord();
  const rec = data && data.rec;
  const series = data && data.series;
  // HERO when we have a real, plottable curve; else honest text fallback (never breaks).
  const el = series && series.pts && series.pts.length >= 3 ? CurveCard(rec, series) : TextCard(rec);
  return new ImageResponse(el, { ...size });
}
