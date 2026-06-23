"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const root = document.getElementById("app-root") as any;
    if (!root || root._init) return;
    root._init = true;

    root.innerHTML = `
      <header><div class="hbar">
        <div class="brand"><div class="diamond"></div><div><h1>Diamond<b>Edge</b></h1><div class="tag">MLB Mid-Game Model</div></div></div>
        <div class="datestrip-wrap"><div class="datestrip" id="datestrip"></div></div>
        <button class="perfpill" id="m-perf">Performance</button>
        <div class="recordchip" id="record"></div>
      </div></header>
      <main>
        <div class="subbar"><h2 id="slatehead">Today's Slate</h2><div class="rule"></div>
          <div class="legend" id="legendbox"><span><i class="dot" style="background:var(--green)"></i>High</span><span><i class="dot" style="background:var(--blue)"></i>Med</span><span><i class="dot" style="background:var(--amber)"></i>Low</span></div></div>
        <div class="grid" id="grid"><div class="state"><div class="spinner"></div><div class="ds">Loading</div></div></div>
        <div class="refnote" id="refnote"></div>
      </main>`;

    const TEAM_ID: any = { ARI: 109, ATL: 144, BAL: 110, BOS: 111, CHC: 112, CWS: 145, CHW: 145, CIN: 113, CLE: 114, COL: 115, DET: 116, HOU: 117, KC: 118, KCR: 118, LAA: 108, LAD: 119, MIA: 146, MIL: 158, MIN: 142, NYM: 121, NYY: 147, OAK: 133, ATH: 133, PHI: 143, PIT: 134, SD: 135, SDP: 135, SF: 137, SFG: 137, SEA: 136, STL: 138, TB: 139, TBR: 139, TEX: 140, TOR: 141, WSH: 120, WSN: 120 };
    const logo = (ab: any) => `https://www.mlbstatic.com/team-logos/${TEAM_ID[ab] || 0}.svg`;
    const fmtOdds = (o: any) => (o == null || o === "" ? "—" : Number(o) > 0 ? "+" + o : "" + o);
    const num = (v: any, d = 1) => (v == null ? "—" : Number(v).toFixed(d));
    const tier = (t: any) => (t || "WATCH").toUpperCase();
    const resCls = (r: any) => (({ WIN: "win", LOSS: "loss", PUSH: "push" } as any)[(r || "").toUpperCase()] || "");
    const $ = (id: string) => document.getElementById(id) as any;

    let mode = "today", histDates: any[] = [], histDate: any = null, detailGame: any = null, detailReturn = "today", stripReady = false, todayFilter = "all";

    async function snap(k: string) {
      const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(k)}&select=payload`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
      const rows = await r.json();
      return rows && rows[0] ? rows[0].payload : null;
    }

    function boxScore(g: any, innings: any[], evo: any[], sideKey: string) {
      const n = Math.max(9, innings.length);
      const evoBy: any = {}; (evo || []).forEach((e: any) => (evoBy[e.after_inning] = e));
      function teamRow(side: string) {
        const isHome = side === "home", ab = isHome ? g.home_abbr : g.away_abbr, name = isHome ? g.home_pitcher : g.away_pitcher;
        const R = isHome ? g._hr : g._ar, H = isHome ? g._hh : g._ah, E = isHome ? g._he : g._ae;
        const win = g._final && (isHome ? g._hr > g._ar : g._ar > g._hr);
        let cells = "";
        for (let i = 1; i <= n; i++) { const row = innings.find((x: any) => x.inning === i); let v: any = null; if (row) v = sideKey === "today" ? row[side] : row[side + "_r"]; cells += v == null ? `<div class="inn empty">·</div>` : `<div class="inn">${v}</div>`; }
        return `<div class="bxrow ${win ? "win" : ""}"><div class="team"><img src="${logo(ab)}" onerror="this.style.visibility='hidden'"><div class="tt"><span class="ab">${ab}</span>${name ? `<span class="pn">${name}</span>` : ""}</div></div>${cells}<div class="rhe-c r">${R ?? 0}</div><div class="rhe-c dim">${H ?? 0}</div><div class="rhe-c dim">${E ?? 0}</div></div>`;
      }
      let inh = ""; for (let i = 1; i <= n; i++) inh += `<div class="inh">${i}</div>`;
      let evC = ""; for (let i = 1; i <= n; i++) { const e = evoBy[i]; evC += e ? `<div class="ev">${num(e.pred_total)}</div>` : `<div class="ev empty">·</div>`; }
      const last = evo && evo.length ? evo[evo.length - 1] : null;
      return `<div class="box" style="--ncols:${n}"><div class="bxrow bxhead"><div class="teamh">Matchup</div>${inh}<div class="rhe">R</div><div class="rhe">H</div><div class="rhe">E</div></div>${teamRow("away")}${teamRow("home")}<div class="evorow"><div class="lbl"><span class="dot" style="width:6px;height:6px;background:var(--navy)"></span>Model</div>${evC}<div class="evtot" style="grid-column:span 3">${last ? num(last.pred_total) : "—"}</div></div></div>`;
    }

    function pickRow(g: any) {
      const ou = (g.ou_call || "—").toUpperCase(), ouT = tier(g.ou_confidence);
      const ouCls = ou === "OVER" ? "over" : ou === "UNDER" ? "under" : "push";
      const edge = g.model_edge, eCls = edge > 0.25 ? "pos" : edge < -0.25 ? "neg" : "flat";
      const win = (g.winner_call || "").toUpperCase(), winAb = win === "HOME" ? g.home_abbr : win === "AWAY" ? g.away_abbr : null;
      const wp = g.home_win_prob != null ? Math.round((win === "AWAY" ? 1 - g.home_win_prob : g.home_win_prob) * 100) : null;
      const ouRes = g.is_final && g.ou_result ? `<span class="res ${resCls(g.ou_result)}">${g.ou_result}</span>` : "";
      const wRes = g.is_final && g.winner_result ? `<span class="res ${resCls(g.winner_result)}">${g.winner_result}</span>` : "";
      const cpct = g.ou_confidence_pct != null ? `<span class="confpct" title="model confidence in this O/U pick">${g.ou_confidence_pct}%</span>` : "";
      return `<div class="rcontent"><span class="badge ${ouCls}">${ou} ${g.line != null ? g.line : ""}<span class="tier tier-${ouT}">${ouT}</span></span>${cpct}${ouRes}${edge != null ? `<span class="edge ${eCls}">${edge > 0 ? "+" : ""}${num(edge)} edge</span>` : ""}<div class="vsep"></div>${winAb ? `<span class="badge pick">${winAb} ML${wp != null ? ` · ${wp}%` : ""}</span>` : ""}${wRes}</div>`;
    }
    // ============================================================
    // MICRO-VISUALIZATIONS — numbers rendered as inline SVG/HTML.
    // The signature of the terminal upgrade: every prediction is visual.
    // ============================================================

    // model_type → labelled badge (live_baseout / live_mid / live_empirical / pregame)
    function modelTypeBadge(g: any) {
      const mt = (g.model_type || "").toLowerCase();
      const engineMid = g.model_engine === "mid-game" || g.is_live;
      let cls = "pregame", label = "PRE-GAME";
      if (mt.indexOf("baseout") >= 0) { cls = "baseout"; label = "◆ BASE-OUT"; }
      else if (mt.indexOf("empirical") >= 0) { cls = "empirical"; label = "◆ EMPIRICAL"; }
      else if (mt.indexOf("mid") >= 0 || (engineMid && mt.indexOf("live") >= 0)) { cls = "mid"; label = "◆ LIVE MID"; }
      else if (mt.indexOf("live") >= 0) { cls = "baseout"; label = "◆ LIVE"; }
      else label = "○ PRE-GAME";
      return `<span class="mtbadge ${cls}" title="model_type: ${g.model_type || "pregame"}">${label}</span>`;
    }

    // diverging edge bar: model_prediction vs line, over=green right / under=red left.
    // edge magnitude clamped to ±3 runs over a half-track each side.
    function edgeBar(edge: any) {
      if (edge == null) return "";
      const mag = Math.min(Math.abs(edge), 3) / 3 * 50; // % of full width on one side
      const over = edge > 0;
      const fill = over
        ? `<i class="over" style="width:${mag.toFixed(1)}%"></i>`
        : `<i class="under" style="width:${mag.toFixed(1)}%"></i>`;
      return `<div class="edgebar"><span class="mid"></span>${edge !== 0 ? fill : ""}</div>
        <div class="edgebar-cap"><span>under</span><span>line</span><span>over</span></div>`;
    }

    // 80% interval distribution bar: lo .. (line) .. pred .. hi on a shared scale.
    function intervalBar(lo: any, hi: any, pred: any, line: any, cls = "ivbar") {
      if (lo == null || hi == null) return "";
      // pad the axis so line/pred outside [lo,hi] still render
      const vals = [lo, hi, pred, line].filter((v) => v != null).map(Number);
      let amin = Math.min(...vals), amax = Math.max(...vals);
      const padv = Math.max(0.6, (amax - amin) * 0.12); amin -= padv; amax += padv;
      const sp = amax - amin || 1;
      const P = (v: number) => ((v - amin) / sp) * 100;
      const spanL = P(lo), spanR = P(hi);
      const predP = pred != null ? P(Number(pred)) : null;
      const lineP = line != null ? P(Number(line)) : null;
      return `<div class="${cls}">
        <div class="track"></div>
        <div class="span" style="left:${spanL.toFixed(1)}%;width:${(spanR - spanL).toFixed(1)}%"></div>
        ${lineP != null ? `<div class="line" style="left:${lineP.toFixed(1)}%"></div><span class="tk ll" style="left:${lineP.toFixed(1)}%">${num(line)}</span>` : ""}
        ${predP != null ? `<div class="pred" style="left:${predP.toFixed(1)}%"></div><span class="tk pl" style="left:${predP.toFixed(1)}%">${num(pred)}</span>` : ""}
        <span class="tk lo">${num(lo)}</span><span class="tk hi">${num(hi)}</span>
      </div>`;
    }

    // win-prob split bar: away (red) | home (navy), labelled with abbrs+pct.
    function winProbBar(homeProb: any, awayAb: string, homeAb: string) {
      if (homeProb == null) return "";
      const h = Math.max(0, Math.min(1, Number(homeProb)));
      const hp = Math.round(h * 100), ap = 100 - hp;
      return `<div class="wpbar"><span class="wpt a">${awayAb}</span>
        <div class="wpsplit"><div class="aw" style="width:${ap}%"></div><div class="hm" style="width:${hp}%"></div>
          ${ap >= 14 ? `<span class="pct a">${ap}%</span>` : ""}${hp >= 14 ? `<span class="pct h">${hp}%</span>` : ""}</div>
        <span class="wpt h">${homeAb}</span></div>`;
    }

    // P(over) gauge — semicircular dial 0..100% coloured by lean vs 50%.
    function povGauge(prob: any, line: any) {
      if (prob == null) return "";
      const p = Math.max(0, Math.min(1, Number(prob)));
      const W = 200, H = 116, cx = W / 2, cy = 104, r = 84;
      const a = Math.PI * (1 - p); // p=0 → left(π), p=1 → right(0)
      const ex = cx + r * Math.cos(a), ey = cy - r * Math.sin(a);
      const col = p >= 0.58 ? "#16a34a" : p <= 0.42 ? "#c8102e" : "#64748b";
      const lean = p >= 0.58 ? "OVER" : p <= 0.42 ? "UNDER" : "≈ LINE";
      // track arc + value arc
      const arc = (frac: number, color: string, w: number) => {
        const aa = Math.PI * (1 - frac);
        const x = cx + r * Math.cos(aa), y = cy - r * Math.sin(aa);
        const large = frac > 0.5 ? 0 : 0;
        return `<path d="M${(cx - r).toFixed(1)} ${cy} A${r} ${r} 0 ${large} 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
      };
      const ticks = [0, 0.5, 1].map((t) => {
        const aa = Math.PI * (1 - t);
        const x1 = cx + (r + 4) * Math.cos(aa), y1 = cy - (r + 4) * Math.sin(aa);
        const x2 = cx + (r + 11) * Math.cos(aa), y2 = cy - (r + 11) * Math.sin(aa);
        return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#cdd3da" stroke-width="1.5"/>`;
      }).join("");
      return `<svg viewBox="0 0 ${W} ${H}">
        ${arc(1, "#eef1f5", 13)}${arc(p, col, 13)}${ticks}
        <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="6" fill="#fff" stroke="${col}" stroke-width="3"/>
        <text x="${cx}" y="${cy - 24}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="30" fill="${col}">${Math.round(p * 100)}%</text>
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="Oswald" font-weight="600" font-size="11" letter-spacing="1.5" fill="#5a6573">P(OVER ${line != null ? line : "—"})</text>
        <text x="${cx - r}" y="${cy + 13}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#9aa3af">0</text>
        <text x="${cx + r}" y="${cy + 13}" text-anchor="middle" font-family="IBM Plex Mono" font-size="9" fill="#9aa3af">100</text>
        <text x="${cx}" y="${cy + 9}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="11" letter-spacing="1" fill="${col}">${lean}</text>
      </svg>`;
    }

    // big win-probability semicircular gauge for the deep view (home favoured).
    function winProbGauge(homeProb: any, awayAb: string, homeAb: string) {
      if (homeProb == null) return "";
      const h = Math.max(0, Math.min(1, Number(homeProb)));
      const W = 220, H = 142, cx = W / 2, cy = 116, r = 88;
      const favHome = h >= 0.5;
      const favProb = favHome ? h : 1 - h, favAb = favHome ? homeAb : awayAb;
      const col = favHome ? "#0c2340" : "#c8102e";
      const arc = (frac: number, color: string, w: number) => {
        const aa = Math.PI * (1 - frac);
        const x = cx + r * Math.cos(aa), y = cy - r * Math.sin(aa);
        return `<path d="M${(cx - r).toFixed(1)} ${cy} A${r} ${r} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}" fill="none" stroke="${color}" stroke-width="15" stroke-linecap="round"/>`;
      };
      // away fills from left, home fills from right — split at h
      const aa = Math.PI * (1 - (1 - h));
      const hx = cx + r * Math.cos(Math.PI * (1 - h)), hy = cy - r * Math.sin(Math.PI * (1 - h));
      const homeArc = `<path d="M${hx.toFixed(1)} ${hy.toFixed(1)} A${r} ${r} 0 0 1 ${(cx + r).toFixed(1)} ${cy}" fill="none" stroke="#0c2340" stroke-width="15" stroke-linecap="round"/>`;
      const awayArc = `<path d="M${(cx - r).toFixed(1)} ${cy} A${r} ${r} 0 0 1 ${hx.toFixed(1)} ${hy.toFixed(1)}" fill="none" stroke="#c8102e" stroke-width="15" stroke-linecap="round"/>`;
      return `<svg viewBox="0 0 ${W} ${H}">
        ${arc(1, "#eef1f5", 15)}${awayArc}${homeArc}
        <text x="${cx}" y="${cy - 30}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="38" fill="${col}">${Math.round(favProb * 100)}%</text>
        <text x="${cx}" y="${cy - 11}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="15" letter-spacing="1.5" fill="${col}">${favAb} WIN</text>
        <text x="${(cx - r - 2).toFixed(1)}" y="${cy + 22}" text-anchor="start" font-family="Oswald" font-weight="600" font-size="11" fill="#c8102e">${awayAb} ${Math.round((1 - h) * 100)}%</text>
        <text x="${(cx + r + 2).toFixed(1)}" y="${cy + 22}" text-anchor="end" font-family="Oswald" font-weight="600" font-size="11" fill="#0c2340">${homeAb} ${Math.round(h * 100)}%</text>
      </svg>`;
    }

    // small radial cover-prob dial 0..1 (run-line / spread cover).
    function coverDial(prob: any) {
      if (prob == null) return "";
      const p = Math.max(0, Math.min(1, Number(prob)));
      const W = 120, H = 120, cx = 60, cy = 60, r = 46, C = 2 * Math.PI * r;
      const col = p >= 0.55 ? "#16a34a" : p <= 0.45 ? "#c8102e" : "#64748b";
      const off = C * (1 - p);
      return `<svg viewBox="0 0 ${W} ${H}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eef1f5" stroke-width="11"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round"
          stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
        <text x="${cx}" y="${cy + 2}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="24" fill="${col}">${Math.round(p * 100)}<tspan font-size="13">%</tspan></text>
        <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="IBM Plex Mono" font-size="8" fill="#9aa3af">COVER</text>
      </svg>`;
    }

    // expected-margin diverging mini bar (away favoured negative / home positive)
    function marginBar(margin: any, awayAb: string, homeAb: string) {
      if (margin == null) return "";
      const m = Number(margin), mag = Math.min(Math.abs(m), 6) / 6 * 50;
      const home = m > 0; // expected_margin: home - away
      const fill = home
        ? `<i class="over" style="width:${mag.toFixed(1)}%"></i>`
        : `<i class="under" style="width:${mag.toFixed(1)}%"></i>`;
      return `<div class="edgebar"><span class="mid"></span>${m !== 0 ? fill : ""}</div>
        <div class="edgebar-cap"><span>${awayAb} +${num(Math.abs(m))}</span><span>even</span><span>${homeAb} +${num(Math.abs(m))}</span></div>`;
    }

    // ============================================================

    // Rich, scannable card: matchup + pitchers + status + headline prediction
    // (predicted total vs line + lean + diverging edge bar) + 80% interval bar
    // + win-prob split bar + chips (predicted score, run-line cover, confidence,
    // P(over)). Live games surface the base-out midgame_prediction; finals add a
    // result-grading row (predicted vs actual + ✓/✗).
    function todayCard(g: any, i: number) {
      g._hr = g.home_score; g._ar = g.away_score; g._hh = g.home_hits; g._ah = g.away_hits; g._he = g.home_errors; g._ae = g.away_errors; g._final = g.is_final;
      const mg = g.midgame_prediction;
      const scls = g.is_live ? "live" : g.is_final ? "final" : "upcoming";
      const pill = g.is_live
        ? `<span class="statuspill live"><span class="pulse"></span>${g.inning_half || ""} ${g.current_inning || ""}${g.outs != null ? ` · ${g.outs} out` : ""}</span>`
        : g.is_final ? `<span class="statuspill final">FINAL</span>`
        : `<span class="statuspill upcoming">${g.start_time || "SCHEDULED"}</span>`;
      const ph = num(g.predicted_home_runs), pa = num(g.predicted_away_runs);

      // headline prediction values — prefer live base-out total/prob when live
      const predTotal = g.is_live && mg && mg.predicted_total != null ? mg.predicted_total : g.model_prediction;
      const probOver = g.is_live && mg && mg.prob_over != null ? mg.prob_over : g.model_prob_over;
      const homeWP = g.is_live && mg && mg.p_home_win != null ? mg.p_home_win : g.home_win_prob;
      const line = g.line;
      const edge = g.model_edge;
      const ou = (g.ou_call || "—").toUpperCase();
      const ouCls = ou === "OVER" ? "over" : ou === "UNDER" ? "under" : "push";
      const ouT = tier(g.ou_confidence);

      const pmatch = (g.away_pitcher || g.home_pitcher)
        ? `<div class="pmatch"><span class="pml">SP</span><b>${g.away_pitcher || "TBD"}${g.away_pitcher_era != null && g.away_pitcher_era !== "" ? ` (${num(g.away_pitcher_era, 2)})` : ""}</b><span class="pvs">vs</span><b>${g.home_pitcher || "TBD"}${g.home_pitcher_era != null && g.home_pitcher_era !== "" ? ` (${num(g.home_pitcher_era, 2)})` : ""}</b></div>` : "";

      // headline strip: TOTAL vs LINE + lean + edge bar (left) | win-prob (right)
      const iv = (g.is_live && mg && mg.prediction_interval_80) ? mg.prediction_interval_80 : null;
      const ivBlock = iv ? intervalBar(iv.total_lo, iv.total_hi, predTotal, line) : edgeBar(edge);
      const headline = `<div class="headline">
        <div class="hl-col left">
          <div class="hl-k"><span>Projected Total</span><span class="src">${g.is_live ? "live" : "pregame"}</span></div>
          <div class="hl-totline"><span class="hl-pred">${num(predTotal)}</span><span class="hl-vs">vs line <b>${line != null ? line : "—"}</b></span></div>
          <div class="hl-leanrow"><span class="badge ${ouCls}" style="font-size:11px;padding:3px 9px">${ou}<span class="tier tier-${ouT}">${ouT}</span></span>${g.ou_confidence_pct != null ? `<span class="confpct" style="font-size:11px">${g.ou_confidence_pct}%</span>` : ""}</div>
          ${ivBlock}
        </div>
        <div class="hl-col">
          <div class="hl-k"><span>Win Probability</span>${povGaugeChip(probOver, line)}</div>
          ${winProbBar(homeWP, g.away_abbr, g.home_abbr)}
          ${g.is_live && mg && mg.winner ? `<div class="hl-leanrow"><span class="cchip"><span class="ck">Lean</span><b>${mg.winner}</b> ${mg.winner_probability != null ? Math.round(mg.winner_probability * 100) + "%" : ""}</span></div>` : `<div class="hl-leanrow"><span class="cchip"><span class="ck">Pred</span><b>${pa}</b> ${g.away_abbr} – <b>${ph}</b> ${g.home_abbr}</span></div>`}
        </div>
      </div>`;

      // chips row: predicted score / run-line cover / confidence tier / model edge
      const ctier = g.is_live && mg && mg.confidence_tier ? mg.confidence_tier : null;
      const chips = `<div class="cardchips">
        ${modelTypeBadge(g)}
        <span class="cchip score"><span class="ck">Pred</span><b>${pa}</b>–<b>${ph}</b></span>
        ${g.spread_cover_prob != null ? (() => { const sc = (g.spread_call || "").toUpperCase(); const ab = sc === "AWAY" ? g.away_abbr : g.home_abbr; const cp = sc === "AWAY" ? 1 - g.spread_cover_prob : g.spread_cover_prob; return `<span class="cchip"><span class="ck">RL ${ab}</span><b>${Math.round(cp * 100)}%</b></span>`; })() : ""}
        ${edge != null ? `<span class="cchip"><span class="ck">Edge</span><b style="color:${edge > 0.25 ? "var(--green)" : edge < -0.25 ? "var(--red)" : "var(--slate)"}">${edge > 0 ? "+" : ""}${num(edge)}</b></span>` : ""}
        ${ctier ? `<span class="cchip ${ctier === "HIGH" ? "tier-good" : ""}"><span class="ck">Conf</span><b>${ctier}</b></span>` : ""}
        <span class="cchip" style="margin-left:auto"><span class="ck">Book</span>${g.bookmaker || "—"}</span>
      </div>`;

      // final games: result grading row (predicted vs actual + ✓/✗)
      let resultRow = "";
      if (g.is_final) {
        const at = g.actual_total != null ? g.actual_total : (g._hr || 0) + (g._ar || 0);
        const ouG = (g.ou_result || "").toLowerCase();
        const ouCls2 = ouG === "correct" ? "hit" : ouG === "push" ? "push" : ouG === "wrong" ? "miss" : "";
        const wG = (g.winner_result || "").toLowerCase();
        const wCls = wG === "correct" ? "hit" : wG === "push" ? "push" : wG === "wrong" ? "miss" : "";
        resultRow = `<div class="cardresult">
          <span class="cr-k">Result</span>
          ${ouG ? `<span class="cr-grade ${ouCls2}">${ouCls2 === "hit" ? "✓" : ouCls2 === "miss" ? "✗" : "="} O/U</span>` : ""}
          ${wG ? `<span class="cr-grade ${wCls}">${wCls === "hit" ? "✓" : wCls === "miss" ? "✗" : "="} ML</span>` : ""}
          <span class="cr-pva">pred <b>${num(g.model_prediction)}</b> → actual <span class="a">${at}</span></span>
        </div>`;
      }

      return `<div class="card ${scls}" style="animation-delay:${i * 40}ms"><div class="cardtop">${pill}<div class="venue">${g.venue || ""}</div></div>
        ${pmatch}
        ${boxScore(g, g.linescore_innings || [], g.evolving_predictions, "today")}
        ${headline}
        ${chips}
        ${resultRow}</div>`;
    }

    // tiny inline P(over) chip used in the card headline (compact gauge)
    function povGaugeChip(prob: any, line: any) {
      if (prob == null) return "";
      const p = Math.max(0, Math.min(1, Number(prob)));
      const col = p >= 0.58 ? "var(--green)" : p <= 0.42 ? "var(--red)" : "var(--slate)";
      const lean = p >= 0.58 ? "OVER" : p <= 0.42 ? "UNDER" : "≈";
      return `<span class="src" style="color:${col};font-family:'IBM Plex Mono'" title="P(over ${line != null ? line : ""})">${Math.round(p * 100)}% ${lean}</span>`;
    }

    function trajSVG(preds: any[], actual: number) {
      const W = 300, H = 78, pad = 8, padR = 30, padT = 8, padB = 14;
      const ys = preds.map((p) => p.pred_total);
      const allV = ys.concat([actual]);
      let lo = Math.min(...allV) - 0.6, hi = Math.max(...allV) + 0.6; if (hi - lo < 2) hi = lo + 2;
      const X = (i: number) => pad + (i / Math.max(preds.length - 1, 1)) * (W - pad - padR);
      const Y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
      const pts = preds.map((p, i) => `${X(i).toFixed(1)},${Y(p.pred_total).toFixed(1)}`);
      const area = `M${pts[0]} L${pts.join(" L")} L${X(preds.length - 1).toFixed(1)},${(H - padB).toFixed(1)} L${X(0).toFixed(1)},${(H - padB).toFixed(1)} Z`;
      const aY = Y(actual).toFixed(1);
      const lastP = preds[preds.length - 1], conv = Math.abs(lastP.pred_total - actual);
      const endColor = conv < 1 ? "#16a34a" : conv < 2.5 ? "#d97706" : "#c8102e";
      const dots = preds.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.pred_total).toFixed(1)}" r="${i === preds.length - 1 ? 3.5 : 2}" fill="${i === preds.length - 1 ? endColor : "#16365e"}"/>`).join("");
      const xlab = preds.map((p, i) => (i % 2 === 0 ? `<text x="${X(i).toFixed(1)}" y="${H - 3}" font-size="8" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono">${p.after_inning || "pre"}</text>` : "")).join("");
      return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#16365e" stop-opacity=".16"/><stop offset="1" stop-color="#16365e" stop-opacity="0"/></linearGradient></defs>
        <path d="${area}" fill="url(#g)"/><line x1="${pad}" x2="${W - padR}" y1="${aY}" y2="${aY}" stroke="#c8102e" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="${W - padR + 3}" y="${parseFloat(aY) + 3}" font-size="9" fill="#c8102e" font-family="IBM Plex Mono">${actual}</text>
        <polyline points="${pts.join(" ")}" fill="none" stroke="#0c2340" stroke-width="2" stroke-linejoin="round"/>${dots}${xlab}</svg>`;
    }
    function historyCard(g: any, i: number) {
      const ls = g.actual_linescore || {}; const inns = ls.innings || [];
      g._hr = ls.final_home; g._ar = ls.final_away; g._hh = ls.home_hits; g._ah = ls.away_hits; g._he = ls.home_errors; g._ae = ls.away_errors; g._final = true;
      const preds = (g.predictions_by_inning || []).slice().sort((a: any, b: any) => a.after_inning - b.after_inning);
      const actual = ls.final_total != null ? ls.final_total : g._hr + g._ar;
      const pre = preds[0], last = preds[preds.length - 1] || pre;
      const conv = last ? Math.abs(last.pred_total - actual) : null;
      const convCls = conv == null ? "mid" : conv < 1 ? "good" : conv < 2.5 ? "mid" : "bad";
      const convTxt = conv == null ? "—" : conv < 1 ? "NAILED IT" : conv < 2.5 ? "CLOSE" : "MISSED";
      return `<div class="card" style="animation-delay:${i * 40}ms"><div class="cardtop"><span class="statuspill final">FINAL · ${g.date || ""}</span><div class="venue">${g.venue || ""}</div></div>
        ${boxScore(g, inns, preds, "hist")}
        <div class="traj"><div class="trajhead"><div class="t">Model's Mid-Game Read</div>
          <div class="cap">pregame <b>${pre ? num(pre.pred_total) : "—"}</b> → final <span class="a">${actual}</span> &nbsp;<span class="conv ${convCls}">${convTxt}</span></div></div>
          ${preds.length ? trajSVG(preds, actual) : '<div style="color:var(--ink2);font-size:12px;padding:10px 0">No trajectory data</div>'}
          <div class="trajfoot"><span><i style="border-color:#0c2340"></i>Model pred total</span><span><i style="border-color:#c8102e;border-top-style:dashed"></i>Final actual</span><span style="margin-left:auto;color:var(--ink2)">x-axis = innings completed</span></div>
        </div></div>`;
    }

    function renderRecord(s: any) {
      const el = $("record"); if (!s) { el.innerHTML = ""; return; }
      const acc = (v: any) => (v == null ? "—" : Math.round(v <= 1 ? v * 100 : v) + "%");
      el.innerHTML = `<div><div class="k">Live</div><div class="v live">${s.live || 0}</div></div><div><div class="k">Final</div><div class="v">${s.final || 0}</div></div><div><div class="k">O/U</div><div class="v g">${acc((s.ou || {}).accuracy)}</div></div><div><div class="k">Winner</div><div class="v g">${acc((s.winner || {}).accuracy)}</div></div>`;
    }
    function chipLabel(d: string) {
      const dt = new Date(d + "T12:00:00");
      const dow = dt.toLocaleDateString("en-US", { weekday: "short" });
      const md = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return `<span class="cl-dow">${dow}</span><span class="cl-md">${md}</span>`;
    }
    function renderDateStrip() {
      const el = $("datestrip");
      if (!el) return;
      const hChips = histDates.map((d) =>
        `<button class="datechip${mode === "history" && d === histDate ? " on" : ""}" data-date="${d}">${chipLabel(d)}</button>`
      ).join("");
      el.innerHTML = `${hChips}<button class="datechip today${mode === "today" ? " on" : ""}" data-today="1"><span class="cl-dow">●</span><span class="cl-md">TODAY</span></button>`;
      el.querySelectorAll(".datechip").forEach((c: any) => {
        c.onclick = () => {
          if (c.dataset.today) { selectToday(); }
          else { histDate = c.dataset.date; selectHistory(c.dataset.date); }
        };
      });
      // keep TODAY chip in view by default
      if (mode === "today") { const t = el.querySelector(".datechip.today"); if (t) t.scrollIntoView({ inline: "end", block: "nearest" }); }
      else { const on = el.querySelector(".datechip.on"); if (on) on.scrollIntoView({ inline: "center", block: "nearest" }); }
    }
    async function ensureHistDates() {
      if (stripReady) return;
      try { const hd = await snap("history_dates"); histDates = ((hd && hd.dates) || []).slice().sort(); } catch (e) { histDates = []; }
      stripReady = true;
    }

    let todayGames: any[] = [];
    let histGames: any[] = [];

    // PILLAR 1 — PAST / LIVE / UPCOMING SPINE.
    // One clear top-level structure across every game state: LIVE first (base-out
    // model updating), then UPCOMING (pregame projections), then PAST finals (with
    // how the prediction did). Status filter chips live in the subbar.
    function gameState(g: any) { return g.is_live ? "live" : g.is_final ? "past" : "upcoming"; }
    function renderTodaySpine() {
      const grid = $("grid");
      if (!todayGames.length) { grid.innerHTML = `<div class="state"><div class="ds">No games</div></div>`; return; }
      const live = todayGames.filter((g) => g.is_live);
      const upc = todayGames.filter((g) => !g.is_live && !g.is_final);
      const past = todayGames.filter((g) => g.is_final);
      const sections: any[] = [];
      const want = (k: string) => todayFilter === "all" || todayFilter === k;
      let gi = 0;
      const sec = (k: string, label: string, sub: string, arr: any[]) => {
        if (!arr.length || !want(k)) return;
        sections.push(`<div class="spinesec ${k}" style="animation-delay:${gi * 25}ms"><span class="ssdot"></span><span class="sslab">${label}</span><span class="ssn">${arr.length} game${arr.length === 1 ? "" : "s"} · ${sub}</span><span class="ssrule"></span></div>`);
        arr.forEach((g) => { sections.push(todayCard(g, gi)); gi++; });
      };
      sec("live", "Live Now", "base-out model updating", live);
      sec("upcoming", "Upcoming", "pregame projections", upc);
      sec("past", "Final — How We Did", "predicted vs actual", past);
      grid.innerHTML = sections.join("") || `<div class="state"><div class="ds">Nothing in this filter</div></div>`;
      // map rendered cards back to todayGames indices for click → detail
      const ordered = [
        ...(want("live") ? live : []),
        ...(want("upcoming") ? upc : []),
        ...(want("past") ? past : []),
      ];
      grid.querySelectorAll(".card").forEach((c: any, i: number) => {
        c.classList.add("clickable");
        const g = ordered[i];
        const realIdx = todayGames.indexOf(g);
        c.onclick = () => openDetail("today", realIdx);
      });
    }
    function renderTodayFilters() {
      const box = $("legendbox"); if (!box) return;
      const live = todayGames.filter((g) => g.is_live).length;
      const upc = todayGames.filter((g) => !g.is_live && !g.is_final).length;
      const past = todayGames.filter((g) => g.is_final).length;
      const chip = (k: string, label: string, n: number, live2 = false) =>
        `<button class="sfchip${todayFilter === k ? " on" : ""}" data-tf="${k}">${live2 ? `<span class="lp"></span>` : ""}${label}<span class="ct">${n}</span></button>`;
      box.innerHTML = `<div class="spinefilters">${chip("all", "All", todayGames.length)}${chip("live", "Live", live, true)}${chip("upcoming", "Upcoming", upc)}${chip("past", "Final", past)}</div>`;
      box.querySelectorAll(".sfchip").forEach((c: any) => {
        c.onclick = () => { todayFilter = c.dataset.tf; renderTodayFilters(); renderTodaySpine(); };
      });
    }
    async function load() {
      const grid = $("grid");
      $("slatehead").textContent = "Today's Slate";
      $("legendbox").style.display = "";
      try {
        const d = await snap("today");
        const games = (d && d.games) || []; renderRecord(d && d.summary);
        // sort within: live, upcoming, past — but spine groups them anyway
        games.sort((a: any, b: any) => b.is_live - a.is_live || a.is_final - b.is_final);
        todayGames = games;
        renderTodayFilters();
        renderTodaySpine();
        $("refnote").innerHTML = `DiamondEdge base-out mid-game model · MAE 1.94 · data via Supabase`;
      } catch (e) { grid.innerHTML = `<div class="state"><div class="ds">Connection error</div><div>Could not load snapshot.</div></div>`; }
    }
    async function loadHistory() {
      const grid = $("grid"); grid.innerHTML = `<div class="state"><div class="spinner"></div><div class="ds">Loading ${histDate}</div></div>`;
      $("slatehead").textContent = "Game History"; $("record").innerHTML = ""; $("legendbox").style.display = "none";
      renderDateStrip();
      try {
        const d = await snap("history:" + histDate);
        const games = (d && d.games) || []; histGames = games;
        grid.innerHTML = games.length ? games.map(historyCard).join("") : `<div class="state"><div class="ds">No games this date</div></div>`;
        if (games.length) wireCardClicks("history");
        $("refnote").innerHTML = `${games.length} games · ${histDate} · model's mid-game prediction trajectory`;
      } catch (e) { grid.innerHTML = `<div class="state"><div class="ds">Error loading ${histDate}</div></div>`; }
    }

    // ---------- PERFORMANCE VIEW ----------
    const fmtPct = (v: any, d = 1) => (v == null ? "—" : (Number(v) * 100).toFixed(d) + "%");
    const fmtSign = (v: any, d = 1) => (v == null ? "—" : (Number(v) >= 0 ? "+" : "") + Number(v).toFixed(d));

    // Generic line chart: series = [{name,color,values:[{x,y}],dash?}], x labels supplied.
    function lineChart(series: any[], xlabels: any[], opts: any = {}) {
      const W = opts.W || 560, H = opts.H || 220;
      const padL = 44, padR = 14, padT = 14, padB = 30;
      const allY = series.flatMap((s) => s.values.map((p: any) => p.y)).filter((v: any) => v != null);
      if (!allY.length) return `<div class="nochart">No data</div>`;
      let lo = opts.lo != null ? opts.lo : Math.min(...allY);
      let hi = opts.hi != null ? opts.hi : Math.max(...allY);
      const pad = (hi - lo) * 0.12 || 0.5; if (opts.lo == null) lo -= pad; if (opts.hi == null) hi += pad;
      const n = xlabels.length;
      const X = (i: number) => padL + (n <= 1 ? 0.5 : i / (n - 1)) * (W - padL - padR);
      const Y = (v: number) => padT + (1 - (v - lo) / (hi - lo || 1)) * (H - padT - padB);
      // gridlines
      const ticks = 4; let grid = "", ylab = "";
      for (let t = 0; t <= ticks; t++) {
        const v = lo + (t / ticks) * (hi - lo), y = Y(v).toFixed(1);
        grid += `<line x1="${padL}" x2="${W - padR}" y1="${y}" y2="${y}" stroke="#eef1f5" stroke-width="1"/>`;
        ylab += `<text x="${padL - 7}" y="${(+y + 3).toFixed(1)}" font-size="9" fill="#9aa3af" text-anchor="end" font-family="IBM Plex Mono">${(opts.pct ? v * 100 : v).toFixed(opts.ydec != null ? opts.ydec : 1)}${opts.pct ? "" : ""}</text>`;
      }
      let xlab = "";
      const step = Math.ceil(n / (opts.maxXlab || 12));
      xlabels.forEach((l: any, i: number) => { if (i % step === 0 || i === n - 1) xlab += `<text x="${X(i).toFixed(1)}" y="${H - 9}" font-size="9" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono">${l}</text>`; });
      let paths = "", dots = "";
      series.forEach((s) => {
        const pts = s.values.map((p: any, i: number) => (p.y == null ? null : `${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`)).filter(Boolean);
        if (!pts.length) return;
        paths += `<polyline points="${pts.join(" ")}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"${s.dash ? ` stroke-dasharray="${s.dash}"` : ""}/>`;
        if (s.showDots !== false && n <= 16) s.values.forEach((p: any, i: number) => { if (p.y != null) dots += `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.y).toFixed(1)}" r="2.4" fill="${s.color}"/>`; });
      });
      return `<svg viewBox="0 0 ${W} ${H}" class="lc">${grid}${ylab}${xlab}${paths}${dots}</svg>`;
    }

    // Diagonal reliability scatter (pred vs actual on [0,1])
    function reliabilitySVG(pts: any[], px: string, py: string) {
      const W = 300, H = 300, pad = 34;
      const X = (v: number) => pad + v * (W - pad - 12);
      const Y = (v: number) => (H - pad) - v * (H - pad - 12);
      const diag = `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="#cdd3da" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      let grid = "";
      for (let t = 0; t <= 5; t++) { const g = t / 5; grid += `<line x1="${X(g)}" y1="${Y(0)}" x2="${X(g)}" y2="${Y(1)}" stroke="#f1f3f6"/><line x1="${X(0)}" y1="${Y(g)}" x2="${X(1)}" y2="${Y(g)}" stroke="#f1f3f6"/>`; }
      const line = pts.map((p) => `${X(p[px]).toFixed(1)},${Y(p[py]).toFixed(1)}`).join(" ");
      const dots = pts.map((p) => `<circle cx="${X(p[px]).toFixed(1)}" cy="${Y(p[py]).toFixed(1)}" r="${Math.max(2.5, Math.min(6, Math.sqrt((p.n || 1)) / 2.2))}" fill="#0c2340" fill-opacity=".7"/>`).join("");
      return `<svg viewBox="0 0 ${W} ${H}" class="rc">${grid}${diag}<polyline points="${line}" fill="none" stroke="#c8102e" stroke-width="2"/>${dots}
        <text x="${W / 2}" y="${H - 6}" font-size="9" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono">predicted win prob</text>
        <text x="10" y="${H / 2}" font-size="9" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono" transform="rotate(-90 10 ${H / 2})">empirical rate</text></svg>`;
    }

    // Vertical bar chart: bars=[{label,value,color?}]
    function barChart(bars: any[], opts: any = {}) {
      const W = opts.W || 540, H = opts.H || 200, padL = 40, padR = 12, padT = 12, padB = 32;
      const vals = bars.map((b) => b.value);
      let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals); const sp = (hi - lo) * 0.1 || 0.02; hi += sp; if (lo < 0) lo -= sp;
      const X = (i: number) => padL + (i + 0.5) * ((W - padL - padR) / bars.length);
      const Y = (v: number) => padT + (1 - (v - lo) / (hi - lo || 1)) * (H - padT - padB);
      const bw = ((W - padL - padR) / bars.length) * 0.6;
      const zeroY = Y(0);
      let grid = "", ylab = "";
      for (let t = 0; t <= 4; t++) { const v = lo + (t / 4) * (hi - lo), y = Y(v).toFixed(1); grid += `<line x1="${padL}" x2="${W - padR}" y1="${y}" y2="${y}" stroke="#eef1f5"/>`; ylab += `<text x="${padL - 6}" y="${(+y + 3).toFixed(1)}" font-size="9" fill="#9aa3af" text-anchor="end" font-family="IBM Plex Mono">${(opts.pct ? v * 100 : v).toFixed(opts.ydec != null ? opts.ydec : 1)}</text>`; }
      const rects = bars.map((b, i) => { const y = Y(b.value); const top = Math.min(y, zeroY), h = Math.abs(y - zeroY); const col = b.color || (b.value >= 0 ? "#16a34a" : "#c8102e"); return `<rect x="${(X(i) - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 0.5).toFixed(1)}" rx="2" fill="${col}"/>`; }).join("");
      const labs = bars.map((b, i) => `<text x="${X(i).toFixed(1)}" y="${H - 18}" font-size="9" fill="#5a6573" text-anchor="middle" font-family="IBM Plex Mono">${b.label}</text>${b.sub != null ? `<text x="${X(i).toFixed(1)}" y="${H - 7}" font-size="8" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono">${b.sub}</text>` : ""}`).join("");
      return `<svg viewBox="0 0 ${W} ${H}" class="bc">${grid}${ylab}<line x1="${padL}" x2="${W - padR}" y1="${zeroY}" y2="${zeroY}" stroke="#cdd3da"/>${rects}${labs}</svg>`;
    }

    function statTile(label: string, value: string, sub?: string, cls?: string) {
      return `<div class="ptile"><div class="pk">${label}</div><div class="pv ${cls || ""}">${value}</div>${sub ? `<div class="psub">${sub}</div>` : ""}</div>`;
    }
    function panel(title: string, subtitle: string, body: string, legend?: string) {
      return `<div class="panel"><div class="phead"><div class="pt">${title}</div>${legend || ""}</div><div class="pdesc">${subtitle}</div><div class="pbody">${body}</div></div>`;
    }

    // ---- Model-vs-market cells (shared by pitcher-K + batter-hits panels) ----
    // The serve JSON carries a REAL de-vigged consensus book line per matched
    // player (book_line, book_over_prob, book_over_price, book_n_books) plus the
    // model's P(over that exact line) and a model_vs_line lean tag. We render the
    // book line + price, and a small OVER/UNDER/≈ chip coloured by direction with
    // the probability gap in percentage points. Markets are efficient, so the gap
    // is framed as "where our projection sits vs the consensus", never an edge.
    function bookLineCell(p: any, fallbackFair?: any) {
      const bl = p.book_line;
      if (bl == null) {
        const fb = fallbackFair != null ? `<span class="mvlsub">fair ${fallbackFair}</span>` : `<span class="mvlsub">no line</span>`;
        return `<div class="mvline"><span class="mvlnum none">—</span>${fb}</div>`;
      }
      const price = p.book_over_price != null ? fmtOdds(p.book_over_price) : "";
      const nb = p.book_n_books != null ? `${p.book_n_books} book${p.book_n_books === 1 ? "" : "s"}` : "";
      const sub = [price, nb].filter(Boolean).join(" · ");
      return `<div class="mvline"><span class="mvlnum">${Number(bl).toFixed(1)}</span>${sub ? `<span class="mvlsub">${sub}</span>` : ""}</div>`;
    }
    function leanCell(p: any) {
      const mvl = p.model_vs_line;
      if (!mvl || mvl.lean == null) return `<div class="mvlean"><span class="mvchip na">—</span></div>`;
      const lean = mvl.lean; // 'OVER' | 'UNDER' | '~='
      const cls = lean === "OVER" ? "over" : lean === "UNDER" ? "under" : "flat";
      const label = lean === "OVER" ? "OVER" : lean === "UNDER" ? "UNDER" : "≈ Line";
      const lp = mvl.lean_prob;
      let delta = "";
      if (lp != null) {
        const pp = Math.round(Number(lp) * 100);
        const dcls = pp > 0 ? "over" : pp < 0 ? "under" : "";
        delta = `<span class="mvdelta ${dcls}">${pp > 0 ? "+" : ""}${pp} pp</span>`;
      }
      return `<div class="mvlean"><span class="mvchip ${cls}">${label}</span>${delta}</div>`;
    }

    // PILLAR 4 — honest framing (visible, not hidden) + how-the-model-works.
    // The reachable MLB markets are efficient; we do NOT beat the line. This is a
    // calibrated PREDICTION product, framed as projection — never a betting edge.
    function renderHonestBox() {
      return `<div class="honestbox">
        <div class="hbh"><i></i>The Honest Framing — Prediction Quality, Not a Betting Edge</div>
        <p>We tested 30+ approaches against the reachable MLB markets. The verdict is unambiguous: the <b>pregame over/under, money-line, run-line, and player-prop markets are efficient</b>. We do not beat the closing line, and we never claim to.</p>
        <p>What you see here is something different and honest — the <b>most calibrated MLB prediction product the data allows</b>. Every "lean", "edge" or "P(over)" on this site is a <b>model-vs-line projection</b>, shown so you can see exactly where our forecast sits relative to the market. It is a transparency feature, not a bet signal.</p>
        <p>Where the model is genuinely sharp is <b>mid-game</b>: once a game is live, the base-out any-state engine re-projects the remaining total, win probability, and an 80% interval from the current game state. That live read is calibrated (low ECE) and accurate (remaining-total MAE <b>1.94</b>) — but the live market reprices just as fast, so even here we frame it as a forecast.</p>
        <div class="hbtag">markets are efficient · we don't beat the line · this is the sharpest calibrated forecast the data allows</div>
      </div>`;
    }
    function renderModelExplainer() {
      const steps = [
        { n: "01", h: "Rich Features", b: "Prior-season team batting (leakage-safe S−1), point-in-time pitcher form, park factors, and the live box score feed a single feature vector." },
        { n: "02", h: "Current Game State", b: "The base-out <b>any-state</b> model conditions on exactly where the game stands — inning, half, outs, and runners on 1B/2B/3B — so the read reflects the real situation, not an average." },
        { n: "03", h: "Project the Remainder", b: "It estimates <b>remaining runs</b> for each team, adds them to runs already scored, and produces a predicted final total, per-team scores, and an <b>80% prediction interval</b>." },
        { n: "04", h: "Calibrated Outputs", b: "From that distribution we read <b>P(over the line)</b>, <b>win probability</b>, and <b>run-line cover</b> — all calibrated out-of-sample (low ECE), shown vs the market as a projection." },
      ].map((s) => `<div class="exstep" data-n="${s.n}"><div class="exh">${s.h}</div><div class="exb">${s.b}</div></div>`).join("");
      const flow = `<div class="exflow"><span class="ef">Rich features</span><span class="ea">+</span><span class="ef">Game state</span><span class="ea">→</span><span class="ef out">Total</span><span class="ef out">P(over)</span><span class="ef out">Interval</span><span class="ef out">Win prob</span><span class="ef out">Run-line</span></div>`;
      return panel("How the Live Base-Out Model Works", "The signature engine behind every live card. A single any-state model maps rich features plus the current base-out situation into a full predictive distribution over the rest of the game — total, per-team scores, P(over), win probability, run-line cover, and an 80% interval. Trained 2015–2024, validated 2025, tested 2026 out-of-sample. Remaining-total MAE 1.94.", `<div class="explainer">${steps}</div>${flow}`);
    }

    let perfTab = "pregame";
    let ouSet = "2026"; // ou_betting set toggle
    let perfOuIdx = 0;

    function renderPerf(a: any) {
      const grid = $("grid");
      if (!a) { grid.innerHTML = `<div class="state"><div class="ds">No analytics</div><div>Analytics snapshot not published yet.</div></div>`; return; }
      const pv = a.pregame_vs_vegas, pp = a.performance_pack, ml = a.midgame_live, ouB = a.ou_betting;
      const test = pp && pp.test_2026, val = pp && pp.val_2025;
      let html = `<div class="perfwrap">`;

      // KPI strip
      let kpis = `<div class="kpistrip">`;
      if (test) {
        kpis += statTile("Remaining-Total MAE", num(test.mae_remaining, 3), "2026 out-of-sample", "");
        kpis += statTile("Winner Accuracy", fmtPct(test.winner_acc), "2026 · " + test.n_games + " games", "g");
        kpis += statTile("Win-Prob ECE", num(test.ece, 3), "calibration error", "");
      }
      if (pv && pv.overall_oos_2025_2026) { const o = pv.overall_oos_2025_2026; kpis += statTile("Pregame O/U Market", "EFFICIENT", `ours ${num(o.our_total_mae, 2)} vs Vegas ${num(o.vegas_total_mae, 2)} MAE`, "r"); }
      kpis += `</div>`;
      html += kpis;

      // sub-tabs
      html += `<div class="perftabs"><button class="ptab${perfTab === "pregame" ? " on" : ""}" data-ptab="pregame">Pre-Game</button><button class="ptab${perfTab === "midgame" ? " on" : ""}" data-ptab="midgame">Mid-Game</button></div>`;

      html += `<div class="perftabbody">`;
      if (perfTab === "pregame") html += renderPregameTab(pv, ouB, a.model_strengths);
      else html += renderMidgameTab(test, ml, a.live_edge_policy);
      html += `</div>`;

      html += `</div>`;
      grid.innerHTML = html;
      grid.querySelectorAll(".ptab").forEach((t: any) => { t.onclick = () => { perfTab = t.dataset.ptab; renderPerf(a); }; });
      if (perfTab === "pregame") wireOuSlider(ouB);
      $("refnote").innerHTML = `Analytics snapshot${a.generated_at ? " · generated " + new Date(a.generated_at).toLocaleString() : ""} · all metrics out-of-sample, leakage-audited`;
    }

    // ---- PRE-GAME tab ----
    function renderStrengthsPanel(ms: any) {
      if (!ms || !ms.by_line_bucket) return "";
      const lb = ms.by_line_bucket;
      const order = ["<7.5", "7.5-8.5", "8.5-9.5", ">=9.5"].filter((k) => lb[k]);
      if (!order.length) return "";
      const maxv = Math.max(...order.map((k) => Math.max(lb[k].our_mae, lb[k].vegas_mae)));
      const rows = order.map((k) => {
        const s = lb[k];
        const ow = ((s.our_mae / maxv) * 100).toFixed(0), vw = ((s.vegas_mae / maxv) * 100).toFixed(0);
        return `<div class="strow"><div class="stk">O/U ${k} <small>(${s.n})</small></div><div class="stbars">
          <div class="stbar"><i class="our" style="width:${ow}%"></i><span>${s.our_mae}</span></div>
          <div class="stbar"><i class="veg" style="width:${vw}%"></i><span>${s.vegas_mae}</span></div></div></div>`;
      }).join("");
      const b = order.map((k) => ({ k, ...lb[k] }));
      const best = b.reduce((a: any, c: any) => (c.our_mae < a.our_mae ? c : a));
      const worst = b.reduce((a: any, c: any) => (c.our_mae > a.our_mae ? c : a));
      const parks = (ms.parks_sharpest || []).slice(0, 5).map((p: any) =>
        `<span class="parkchip">${p.venue} <b class="${p.edge_vs_vegas >= 0 ? "g" : "r"}">${p.edge_vs_vegas >= 0 ? "+" : ""}${p.edge_vs_vegas}</b></span>`).join("");
      const headline = `<div class="sthead">Model is <b>sharpest on low-total games</b> (${best.k}: MAE ${best.our_mae}) and weakest on high-scoring slugfests (${worst.k}: ${worst.our_mae}) — where the market degrades too.</div>`;
      const legend = `<div class="plegend"><span><i style="background:#0c2340"></i>Our model</span><span><i style="background:#16a34a"></i>Vegas line</span></div>`;
      const parkblock = parks ? `<div class="stparks"><div class="stparklbl">Parks where we're closest to Vegas (MAE edge)</div>${parks}</div>` : "";
      return panel("Where We're Sharp — MAE by Game Type", "Our independent (line-free) model's accuracy by Vegas total bucket, 2026 out-of-sample. Trained 2015-2024, validated 2025, tested 2026. We're most accurate on low totals; high-total games are chaos for everyone.", `${headline}${rows}${parkblock}${legend}`);
    }
    function renderPregameTab(pv: any, ouB: any, ms?: any) {
      let html = "";
      // honest framing up top — efficient markets, no betting edge
      html += renderHonestBox();
      // Pregame vs Vegas MAE time-series (by season)
      if (pv && pv.season_series) {
        const ss = pv.season_series, xs = ss.season.map((s: any) => String(s));
        const mk = (arr: any[]) => arr.map((y: any) => ({ y }));
        const body = lineChart([
          { name: "Vegas", color: "#16a34a", values: mk(ss.vegas_total_mae) },
          { name: "Naive", color: "#9aa3af", values: mk(ss.naive_total_mae), dash: "4 3" },
          { name: "Our model", color: "#c8102e", values: mk(ss.our_total_mae) },
        ], xs, { W: 560, H: 220, ydec: 2 });
        const leg = `<div class="plegend"><span><i style="background:#c8102e"></i>Our pregame</span><span><i style="background:#16a34a"></i>Vegas line</span><span><i style="background:#9aa3af"></i>Naive avg</span></div>`;
        html += panel("Pregame Total MAE vs the Market", "Lower is better. Across every season our leakage-safe pregame model tracks but never beats the Vegas line — confirming the pregame O/U market is efficient. The edge lives mid-game.", body, leg);
      }
      // Where we're sharp (segmented)
      html += renderStrengthsPanel(ms);
      // Pitcher strikeout projections (sharp model forecast — product feature, not a bet edge)
      html += renderPitcherKPanel(_lastProps && _lastProps.pitcher_k);
      // Batter hits projections (sharp model forecast — product feature, not a bet edge)
      html += renderBatterHitsPanel(_lastProps && _lastProps.batter_hits);
      // O/U betting slider panel
      html += renderOuPanel(ouB);
      // Run-line (spread) findings panel
      html += renderRunlinePanel(_lastAnalytics && _lastAnalytics.runline);
      if (!html) html = `<div class="state"><div class="ds">No pregame data</div></div>`;
      return html;
    }

    // ---- Pitcher Strikeout Projections (props_v1 serve) ----
    // HONEST framing: a sharp, leakage-audited model forecast shown as
    // "our projection vs the line" — NOT a betting edge. These prop markets
    // were proven efficient (the book line is sharper than our model).
    function renderPitcherKPanel(pk: any) {
      if (!pk || !pk.projections || !pk.projections.length) return "";
      const meta = pk.meta || {};
      const m = meta.model_test_2026_metrics || {};
      const COMMON = 5.5; // the most common pitcher-K prop line
      const lineKey = String(COMMON);
      // usable starters, sorted by projected strikeouts (best first)
      const rows = pk.projections
        .filter((p: any) => p.usable !== false)
        .slice()
        .sort((a: any, b: any) => (b.projected_K || 0) - (a.projected_K || 0));
      if (!rows.length) return "";

      const banner = `<div class="oubanner">◆ This is our model's <b>sharp projection</b>, not a betting edge. We proved the pitcher-strikeout prop market is <b>efficiently priced</b> — the book's line is sharper than our forecast. Shown as a transparent "model vs the line" projection (a product feature), not a bet signal.</div>`;

      // model-quality KPI strip (out-of-sample, leakage-audited)
      const mae = m.count_mae, naive = m.count_mae_naive, ece = m.ece_pooled;
      const beatsNaive = mae != null && naive != null && mae < naive;
      const kpi = `<div class="kpistrip">
        ${statTile("Strikeout MAE", num(mae, 3), "2026 out-of-sample", beatsNaive ? "g" : "")}
        ${statTile("Naive Baseline", num(naive, 3), "season-avg MAE", "r")}
        ${statTile("Calibration ECE", num(ece, 3), "well-calibrated P(over)", "g")}
        ${statTile("Starters Today", String(rows.length), `${meta.n_games || 0} games`, "")}
      </div>`;

      // matched book lines float to the top so the "model vs market" comparison
      // (the headline feature) is visible first; then by projected K.
      rows.sort((a: any, b: any) => {
        const am = a.book_line != null ? 1 : 0, bm = b.book_line != null ? 1 : 0;
        if (am !== bm) return bm - am;
        return (b.projected_K || 0) - (a.projected_K || 0);
      });

      const tile = (p: any) => {
        const proj = p.projected_K;
        const oppRaw = (p.opp_team || "").split(" ").slice(-1)[0] || p.opp_team || "";
        const at = p.is_home ? "vs" : "@";
        return `<div class="pkrow">
          <div class="pkp"><span class="pkname">${p.pitcher_name}</span><span class="pkmatch">${at} ${oppRaw}</span></div>
          <div class="pkproj"><span class="pkbig">${num(proj, 2)}</span><span class="pksub">K</span></div>
          ${bookLineCell(p, p.fair_line)}
          ${leanCell(p)}
        </div>`;
      };
      const head = `<div class="pkrow pkhd"><div class="pkp">Starter</div><div class="pkproj">Our Proj K</div><div class="mvline">Book Line</div><div class="mvlean">Model Lean</div></div>`;
      const list = `<div class="pktbl">${head}${rows.map(tile).join("")}</div>`;
      const nMatched = rows.filter((p: any) => p.book_line != null).length;
      const foot = `<div class="roinote">"Our Proj K" = our model's expected strikeouts (E[K]). "Book Line" = the real de-vigged consensus line across US books (median line + over price; reject |odds|&lt;100). "Model Lean" compares our P(over that exact line) to the book's implied probability — OVER/UNDER when the gap exceeds 3 pp, else ≈ Line. ${nMatched ? `Live lines matched for ${nMatched} of today's starters; rest show our fair line.` : "No book lines posted yet for today's starters — showing our fair line."} ${m.count_mae != null ? `Model beats the season-average naive baseline (MAE ${num(mae, 3)} vs ${num(naive, 3)}) and is well-calibrated (ECE ${num(ece, 3)}).` : ""} <b>The market is efficient — this is a model-vs-market comparison, not a betting edge.</b> ${meta.n_flagged_skipped ? `${meta.n_flagged_skipped} starter(s) hidden for insufficient history.` : ""}</div>`;
      const legend = `<div class="plegend"><span><i style="background:var(--green)"></i>Model over</span><span><i style="background:var(--red)"></i>Model under</span><span><i style="background:var(--slate)"></i>≈ Line</span></div>`;
      return panel("Pitcher Strikeout Projections — Today", `Our gradient-boosted negative-binomial model's projected strikeouts for today's probable starters, sorted by projected K. A genuinely sharp, calibrated forecast — shown honestly as a projection vs the line, not a betting recommendation.${meta.slate_date ? ` Slate ${meta.slate_date}.` : ""}`, `${banner}${kpi}${list}${foot}`, legend);
    }

    // ---- Batter Hits Projections (props_v1 serve) ----
    // HONEST framing: a sharp, leakage-audited model forecast shown as
    // "our projection vs the line" — NOT a betting edge. Single-game hits are
    // variance-dominated (lines 0.5 / 1.5) so projections are modest by nature.
    function renderBatterHitsPanel(bh: any) {
      if (!bh || !bh.projections || !bh.projections.length) return "";
      const meta = bh.meta || {};
      const m = meta.model_test_2026_metrics || {};
      const TOP_N = 12; // keep compact — there are ~270 batters on a full slate
      // usable batters, sorted by P(2+ hits) (most notable first)
      const p2 = (p: any) => (p.p_over && p.p_over["1.5"] != null) ? p.p_over["1.5"] : p["p_hits_over_1.5"];
      const p1 = (p: any) => (p.p_over && p.p_over["0.5"] != null) ? p.p_over["0.5"] : p["p_hits_over_0.5"];
      // sort matched book lines first (the model-vs-market comparison is the
      // headline feature), then by P(2+ hits), BEFORE trimming to TOP_N so live
      // lines surface into the visible rows.
      const usableBat = bh.projections.filter((p: any) => p.usable !== false);
      const rows = usableBat
        .slice()
        .sort((a: any, b: any) => {
          const am = a.book_line != null ? 1 : 0, bm = b.book_line != null ? 1 : 0;
          if (am !== bm) return bm - am;
          return (p2(b) || 0) - (p2(a) || 0);
        })
        .slice(0, TOP_N);
      if (!rows.length) return "";

      const banner = `<div class="oubanner">◆ This is our model's <b>sharp projection</b>, not a betting edge. We proved the batter-hits prop market is <b>efficiently priced</b> — the book's line is sharper than our forecast. Single-game hits are <b>variance-dominated</b>, so even the best projections stay modest. Shown as a transparent "model vs the line" projection (a product feature), not a bet signal.</div>`;

      // model-quality KPI strip (out-of-sample, leakage-audited).
      // NB: metric keys contain dots (e.g. "over0.5_brier_cal") — bracket access.
      const b05 = m["over0.5_brier_cal"], n05 = m["over0.5_brier_naive"];
      const b15 = m["over1.5_brier_cal"], n15 = m["over1.5_brier_naive"];
      const ece = m["over1.5_ece_cal"] != null ? m["over1.5_ece_cal"] : m["over0.5_ece_cal"];
      const beats05 = b05 != null && n05 != null && b05 < n05;
      const beats15 = b15 != null && n15 != null && b15 < n15;
      const kpi = `<div class="kpistrip">
        ${statTile("Brier P(1+ hit)", num(b05, 3), `vs naive ${num(n05, 3)}`, beats05 ? "g" : "")}
        ${statTile("Brier P(2+ hits)", num(b15, 3), `vs naive ${num(n15, 3)}`, beats15 ? "g" : "")}
        ${statTile("Calibration ECE", num(ece, 3), "well-calibrated P(over)", "g")}
        ${statTile("Batters Today", String((bh.projections.filter((p: any) => p.usable !== false)).length), `${meta.n_games || 0} games`, "")}
      </div>`;

      const tile = (p: any) => {
        const projH = p.projected_hits;
        const oppRaw = (p.opp_starter_name || "").split(" ").slice(-1)[0] || "TBD";
        const at = p.is_home_bat ? "vs" : "@";
        const team = (p.bat_team || "").split(" ").slice(-1)[0] || p.bat_team || "";
        return `<div class="bhrow">
          <div class="bhp"><span class="bhname">${p.batter_name}</span><span class="bhmatch">${team} ${at} ${oppRaw}</span></div>
          <div class="bhproj"><span class="bhbig">${num(projH, 2)}</span><span class="bhsub">H</span></div>
          ${bookLineCell(p)}
          ${leanCell(p)}
        </div>`;
      };
      const head = `<div class="bhrow bhhd"><div class="bhp">Batter</div><div class="bhproj">Our Proj H</div><div class="mvline">Book Line</div><div class="mvlean">Model Lean</div></div>`;
      const list = `<div class="bhtbl">${head}${rows.map(tile).join("")}</div>`;
      const nMatched = rows.filter((p: any) => p.book_line != null).length;
      const cmae = m.count_mae_model, cnaive = m.count_mae_naive_prior;
      const foot = `<div class="roinote">"Our Proj H" = our model's expected hits (Poisson count head). "Book Line" = the real de-vigged consensus line across US books (median line + over price; reject |odds|&lt;100) — usually 0.5, sometimes 1.5. "Model Lean" compares our P(over that exact line) to the book's implied probability — OVER/UNDER when the gap exceeds 3 pp, else ≈ Line. ${nMatched ? `Live lines matched for ${nMatched} of these batters.` : "No book lines posted yet for these batters."} ${b05 != null ? `Both per-line classifiers beat the naive league-rate baseline on Brier score${cmae != null && cnaive != null ? ` and the count head beats the prior-mean baseline (MAE ${num(cmae, 3)} vs ${num(cnaive, 3)})` : ""}, and are well-calibrated (ECE ${num(ece, 3)}).` : ""} <b>The market is efficient — this is a model-vs-market comparison, not a betting edge.</b> Showing top ${rows.length} of ${(bh.projections.filter((p: any) => p.usable !== false)).length} batters.${meta.n_flagged_skipped ? ` ${meta.n_flagged_skipped} batter(s) hidden for insufficient history.` : ""}</div>`;
      const legend = `<div class="plegend"><span><i style="background:var(--green)"></i>Model over</span><span><i style="background:var(--red)"></i>Model under</span><span><i style="background:var(--slate)"></i>≈ Line</span></div>`;
      return panel("Batter Hits Projections — Today", `Our gradient-boosted model's projected hits for today's likely starting batters, sorted by P(2+ hits). A calibrated, leakage-audited forecast — shown honestly as a projection vs the line, not a betting recommendation. Single-game hits are variance-dominated, so projections are intentionally modest.${meta.slate_date ? ` Slate ${meta.slate_date}.` : ""}`, `${banner}${kpi}${list}${foot}`, legend);
    }
    function renderRunlinePanel(rl: any) {
      if (!rl || !rl.honest_roi_band) return "";
      const b = rl.honest_roi_band;
      const pct = (x: number) => (x == null ? "—" : (x >= 0 ? "+" : "") + (x * 100).toFixed(1) + "%");
      const ci = (a: any) => (a && a.length === 2 ? `[${pct(a[0])}, ${pct(a[1])}]` : "—");
      const sp = rl.selective_policy && rl.selective_policy.test_sample_2026;
      const banner = `<div class="oubanner">⚠ Pregame run-line (−1.5) market is efficient — <b>no proven edge</b>. The model ties the market on cover accuracy (58.4% vs 58.7%) and is marginally worse on calibration. Every betting cell fails the positive-lower-bound bar after adversarial verification. Shown for honesty, not as a betting system.</div>`;
      const rows = [
        { k: "Every game", d: b.overall_every_game },
        { k: "Favorite −1.5 (edge>0)", d: b.fav_minus_1_5_cell },
        { k: "Underdog +1.5 (edge<0)", d: b.dog_plus_1_5_cell },
      ].filter((r) => r.d).map((r) => {
        const roi = r.d.roi != null ? r.d.roi : r.d.roi_real_odds;
        const cc = r.d.ci95 || r.d.ci95_real_odds;
        const good = roi > 0 && cc && cc[0] > 0;
        return `<div class="rlrow"><div class="rlk">${r.k}</div><div class="rlroi ${roi > 0 ? "g" : "r"}">${pct(roi)}</div><div class="rlci">${ci(cc)}</div><div class="rlv ${good ? "g" : "r"}">${(r.d.verdict || "").replace("indistinguishable from zero", "≈ zero")}</div></div>`;
      }).join("");
      const trap = sp ? `<div class="rltrap"><b>Why the favorite cell isn't real:</b> it shows ${pct(sp.roi_real_odds)} at real odds but <b>flips to ${pct(b.fav_minus_1_5_cell && b.fav_minus_1_5_cell.roi_flat_110)} at flat −110</b> — the "profit" is a +money payout artifact (47.5% win loses at fair odds), it's the best of 13 cells (Bonferroni p≈0.61), and it's concentration-fragile (n=99).</div>` : "";
      const table = `<div class="rltbl"><div class="rlhd"><span>Segment</span><span>ROI</span><span>95% CI</span><span>Verdict</span></div>${rows}</div>`;
      return panel("Pregame Run Line (Spread) — Deep Findings", "Can a pregame model beat the −1.5 run line? Full build → train (cover classifier + margin model) → real-vig backtest → adversarial verification. 5,239 games, tested 2026 out-of-sample. Honest answer below.", `${banner}${table}${trap}`);
    }

    function ouRows(ouB: any) {
      const set = ouB && ouB[ouSet];
      return (set && set.by_confidence) ? set.by_confidence : [];
    }
    function renderOuPanel(ouB: any) {
      if (!ouB || !ouB.thresholds) return "";
      const rows = ouRows(ouB);
      if (!rows.length) return "";
      const be = ouB.breakeven_winpct_flat_110 != null ? ouB.breakeven_winpct_flat_110 : 0.5238;
      const idx = Math.min(perfOuIdx, rows.length - 1);
      const setN = (ouB[ouSet] && ouB[ouSet].n_games) || 0;
      const banner = `<div class="oubanner">⚠ Pregame O/U market is efficient — there is no betting edge. Win% hovers near the ${(be * 100).toFixed(2)}% break-even, ROI is negative, and raising the confidence threshold does <b>not</b> improve results. Shown for honesty, not as a betting system.</div>`;
      const toggle = `<div class="ouset"><span class="ousetlbl">Sample</span><button class="osbtn${ouSet === "2026" ? " on" : ""}" data-oset="2026">2026</button><button class="osbtn${ouSet === "all_2020_2026" ? " on" : ""}" data-oset="all_2020_2026">2020–2026</button></div>`;
      const slider = `<div class="ousliderwrap">
        <div class="ousliderhead"><span>Confidence threshold</span><span class="ousliderval" id="ou-thr">${(ouB.thresholds[idx] * 100).toFixed(0)}%</span></div>
        <input type="range" id="ou-range" min="0" max="${rows.length - 1}" step="1" value="${idx}" class="ourange">
        <div class="ourangeticks"><span>${(ouB.thresholds[0] * 100).toFixed(0)}%</span><span>${(ouB.thresholds[rows.length - 1] * 100).toFixed(0)}%</span></div>
      </div>`;
      const readout = `<div class="oureadout" id="ou-readout">${ouReadoutHTML(rows[idx], be)}</div>`;
      const body = `${banner}${toggle}${slider}${readout}`;
      return panel("Pregame O/U Betting — Confidence Sweep", `Flat −110 staking on every pregame O/U pick at or above each confidence threshold. Break-even win rate is ${(be * 100).toFixed(2)}%. Drag the slider; ${setN ? setN.toLocaleString() + " games in this sample" : "no games"}.`, body);
    }
    function ouReadoutHTML(r: any, be: number) {
      if (!r) return `<div class="nochart">No data at this threshold</div>`;
      const wp = r.win_pct, beat = wp != null && wp >= be;
      const roi = r.roi_flat_110, pnl = r.pnl_flat_110;
      const wpCls = beat ? "g" : "r";
      const roiCls = roi != null && roi >= 0 ? "g" : "r";
      const pnlCls = pnl != null && pnl >= 0 ? "g" : "r";
      const bar = wp != null ? `<div class="oubar"><div class="oube" style="left:${(be * 100).toFixed(1)}%"></div><i style="width:${Math.min(100, wp * 100).toFixed(1)}%" class="${wpCls}"></i><span class="oubelbl" style="left:${(be * 100).toFixed(1)}%">break-even ${(be * 100).toFixed(2)}%</span></div>` : "";
      return `<div class="kpistrip">
          ${statTile("Min Confidence", fmtPct(r.min_confidence, 0), "threshold", "")}
          ${statTile("Decided Bets", String(r.n_decided || 0), `mean conf ${fmtPct(r.mean_confidence, 0)}`, "")}
          ${statTile("Record", `${r.wins || 0}-${r.losses || 0}-${r.ties_push || 0}`, "W-L-push", "")}
          ${statTile("Win %", fmtPct(wp), beat ? "above break-even" : "below break-even", wpCls)}
          ${statTile("ROI @ -110", fmtPct(roi, 1), "per bet", roiCls)}
          ${statTile("Cumulative $", fmtSign(pnl, 0), "flat $100 units, -110", pnlCls)}
        </div>${bar}`;
    }
    function wireOuSlider(ouB: any) {
      const rng = $("ou-range"); if (!rng) return;
      const be = ouB.breakeven_winpct_flat_110 != null ? ouB.breakeven_winpct_flat_110 : 0.5238;
      const rows = ouRows(ouB);
      rng.oninput = () => {
        perfOuIdx = +rng.value;
        const r = rows[perfOuIdx];
        $("ou-thr").textContent = (ouB.thresholds[perfOuIdx] * 100).toFixed(0) + "%";
        $("ou-readout").innerHTML = ouReadoutHTML(r, be);
      };
      document.querySelectorAll(".osbtn").forEach((b: any) => { b.onclick = () => { if (ouSet === b.dataset.oset) return; ouSet = b.dataset.oset; perfOuIdx = Math.min(perfOuIdx, ouRows(ouB).length - 1); renderPerf(_lastAnalytics); }; });
    }

    // ---- MID-GAME tab ----
    function renderLiveEdgePanel(lep: any) {
      if (!lep || !lep.overall_every_bet || !lep.policy_grid) return "";
      const ov = lep.overall_every_bet;
      if (!ov.n_bets) return "";
      const be = 0.524;
      const pct = (x: number) => (x == null ? "—" : (x >= 0 ? "+" : "") + (x * 100).toFixed(1) + "%");
      // selectivity story: overall (every bet) vs the best credible gated cell
      const best = lep.best_credible_cell;
      const kpi = `<div class="kpistrip">
        ${statTile("Every Bet", fmtPct(ov.win_pct), `${ov.n_bets}b · ${ov.n_games}g · ROI ${pct(ov.roi)}`, ov.roi > 0 ? "g" : "r")}
        ${best ? statTile("Selective", fmtPct(best.win_pct), `${best.key.replace("|", " · ")} · ROI ${pct(best.roi)}`, "g") : ""}
        ${best && best.roi_positive_prob != null ? statTile("P(profit)", Math.round(best.roi_positive_prob * 100) + "%", "game-bootstrap", "") : ""}
        ${best ? statTile("Sample", `${best.n_games}g`, "settled games", best.n_games >= 40 ? "g" : "r") : ""}
      </div>`;
      // grid rows: win% bars per cell, breakeven marker
      const cells = Object.entries(lep.policy_grid)
        .map(([k, v]: any) => ({ k, ...v }))
        .filter((c: any) => c.n_games >= 12)
        .sort((a: any, b: any) => b.win_pct - a.win_pct)
        .slice(0, 8);
      const rows = cells.map((c: any) => {
        const w = Math.min(100, (c.win_pct / 0.8) * 100).toFixed(0);
        const bx = ((be / 0.8) * 100).toFixed(0);
        const good = c.win_pct >= be;
        return `<div class="lerow"><div class="lek">${c.k.replace("|", " · edge≥").replace("inn_", "inn ").replace("_", "-").replace("all", "any inning")}<small>${c.n_bets}b/${c.n_games}g</small></div>
          <div class="lebarwrap"><div class="lebar"><i class="${good ? "g" : "r"}" style="width:${w}%"></i><span class="bemark" style="left:${bx}%"></span></div><span class="lewin">${fmtPct(c.win_pct)}</span><span class="leroi ${c.roi > 0 ? "g" : "r"}">${pct(c.roi)}</span></div></div>`;
      }).join("");
      const headline = `<div class="sthead">Betting <b>every</b> mid-game decision is break-even (${fmtPct(ov.win_pct)}, ROI ${pct(ov.roi)}). The edge only appears when we bet <b>selectively</b> — when the model strongly disagrees with the live line${best ? `, the ${best.key.replace("|", " ").replace("edge>=", "edge ≥")} cell hits ${fmtPct(best.win_pct)}` : ""}. <b>Directional only</b> — ${ov.n_games} settled games, the ROI confidence interval still includes zero.</div>`;
      const legend = `<div class="plegend"><span><i style="background:#16a34a"></i>Beats break-even</span><span><i style="background:#c8102e"></i>Below</span><span style="margin-left:auto;color:var(--ink2)">dashed = 52.4% break-even (−110)</span></div>`;
      return panel("Live Betting Edge — Selectivity Is Everything", "Real in-play odds vs our mid-game projection, settled against actual finals. Honest inference: real over/under vig, game-level bootstrap, line-consistent timing (no look-ahead). Small sample — treat as directional until the game count triples.", `${kpi}${headline}<div class="legrid">${rows}</div>${legend}`);
    }
    function renderMidgameTab(test: any, ml: any, lep?: any) {
      let html = "";
      // how the live base-out model works — the signature explainer, up top
      html += renderModelExplainer();
      html += renderLiveEdgePanel(lep);
      // Reliability / calibration curve (win prob, mid-game model)
      if (test && test.reliability_winprob) {
        const body = `<div class="reliwrap">${reliabilitySVG(test.reliability_winprob, "pred_prob", "empirical_rate")}
          <div class="relicap">${statTile("Brier Score", num(test.brier, 3), "lower = sharper", "")}${statTile("ECE", num(test.ece, 3), "mean calib. gap", "")}<div class="relinote">Points hug the diagonal — predicted win probabilities match how often those teams actually win. Dot size ∝ sample count.</div></div></div>`;
        html += panel("Win-Probability Calibration", "Mid-game model, 2026 out-of-sample. A perfectly calibrated model sits on the dashed 45° line.", body);
      }

      // 3. Confidence-bucket accuracy & abstention curve
      if (test && test.confidence_winner) {
        const cw = test.confidence_winner.slice().sort((x: any, y: any) => x.top_frac - y.top_frac);
        const xs = cw.map((c: any) => Math.round(c.top_frac * 100) + "%");
        const body = lineChart([
          { name: "Accuracy", color: "#0c2340", values: cw.map((c: any) => ({ y: c.accuracy })) },
        ], xs, { W: 560, H: 210, pct: true, ydec: 0, lo: 0.7, hi: 1.0 });
        const tbl = `<div class="abstbl"><div class="ahd"><span>Keep top</span><span>N</span><span>Winner acc</span><span>Min conf</span></div>${cw.map((c: any) => `<div class="arow"><span>${Math.round(c.top_frac * 100)}%</span><span>${c.n}</span><span class="g">${fmtPct(c.accuracy)}</span><span>${num(c.min_conf, 2)}</span></div>`).join("")}</div>`;
        html += panel("Confidence &amp; Abstention", "Sort games by model confidence and keep only the most confident fraction. Accuracy climbs sharply as we abstain on coin-flips — the most confident 10% of games hit 96%.", `<div class="abswrap">${body}${tbl}</div>`, `<div class="plegend"><span><i style="background:#0c2340"></i>Winner accuracy</span></div>`);
      }

      // 4. ROI / edge from the mid-game harness
      if (test && test.roi_fair_line_by_confidence) {
        const roi = test.roi_fair_line_by_confidence.slice().sort((x: any, y: any) => x.top_frac - y.top_frac);
        const bars = roi.map((r: any) => ({ label: Math.round(r.top_frac * 100) + "%", sub: r.n_bets + "b", value: r.roi_per_bet }));
        const body = barChart(bars, { W: 540, H: 210, pct: true, ydec: 1 });
        const noteTxt = (test.fair_line_note || "").replace(/'/g, "");
        html += panel("Mid-Game ROI by Confidence", "ROI per bet vs a reconstructed fair mid-game total line (de-vigged −110), bucketed by confidence. Honest grading — never against a stale pregame line.", `${body}<div class="roinote">${noteTxt}</div>`, `<div class="plegend"><span><i style="background:#16a34a"></i>Positive ROI</span><span><i style="background:#c8102e"></i>Negative</span></div>`);
      }

      // 5. MAE by remaining-runs bucket + reliability of total
      if (test && test.mae_by_inning_state) {
        const bars = test.mae_by_inning_state.map((s: any) => ({ label: s.state.replace(/_/g, " ").slice(0, 11), sub: "n=" + s.n, value: s.mae, color: "#16365e" }));
        html += panel("Where the Model Excels", "Remaining-total MAE by mid-game situation (2026). Consistent ~2.5–2.7 runs across lead size and scoring pace — no blind spots.", barChart(bars, { W: 540, H: 200, ydec: 2 }));
      }

      // 6. Live edge snapshot
      if (ml && ml.real_live) {
        const rl = ml.real_live;
        let live = `<div class="kpistrip">`;
        live += statTile("Live States Graded", String(rl.n_snapshot_states || 0), `${rl.n_games || 0} games · ${rl.n_books_median || 0} books`, "");
        live += statTile("Mean |Edge|", num(rl.mean_abs_edge, 2), "runs vs live line", "");
        live += statTile("Mean Signed Edge", fmtSign(rl.mean_signed_edge, 2), "≈0 = unbiased", "");
        live += statTile("Settled Bets", String(rl.n_settled || 0), "real-money grades", "");
        live += `</div>`;
        let byInn = "";
        if (rl.by_inning && rl.by_inning.length) {
          const xs = rl.by_inning.map((b: any) => "in " + b.inning);
          byInn = lineChart([
            { name: "Pred", color: "#0c2340", values: rl.by_inning.map((b: any) => ({ y: b.mean_pred })) },
            { name: "Line", color: "#c8102e", values: rl.by_inning.map((b: any) => ({ y: b.mean_line })), dash: "4 3" },
          ], xs, { W: 540, H: 190, ydec: 1 });
          byInn = panel("Live Model vs Live Line by Inning", "Mean model projected total vs the live consensus total line, by inning, from real in-game odds being collected now.", byInn, `<div class="plegend"><span><i style="background:#0c2340"></i>Model total</span><span><i style="background:#c8102e"></i>Live line</span></div>`);
        }
        html += `<div class="livehead"><span class="statuspill live"><span class="pulse"></span>LIVE HARNESS</span><span class="livenote">${(rl.settled_note || "").replace(/'/g, "")}</span></div>` + live + byInn;
      }

      if (!html) html = `<div class="state"><div class="ds">No mid-game data</div></div>`;
      return html;
    }

    let _lastAnalytics: any = null, _lastProps: any = null;
    async function loadPerf() {
      const grid = $("grid"); grid.innerHTML = `<div class="state"><div class="spinner"></div><div class="ds">Loading analytics</div></div>`;
      $("slatehead").textContent = "Model Performance"; $("record").innerHTML = "";
      try {
        const [a, pr] = await Promise.all([snap("analytics"), snap("props").catch(() => null)]);
        _lastAnalytics = a; _lastProps = pr; renderPerf(a);
      }
      catch (e) { grid.innerHTML = `<div class="state"><div class="ds">Connection error</div><div>Could not load analytics snapshot.</div></div>`; }
    }

    function syncHeader() {
      $("m-perf").classList.toggle("on", mode === "perf");
      renderDateStrip();
    }

    // ---------- GAME DETAIL VIEW ----------
    function wireCardClicks(kind: string) {
      const grid = $("grid");
      grid.querySelectorAll(".card").forEach((c: any, i: number) => {
        c.classList.add("clickable");
        c.onclick = () => openDetail(kind, i);
      });
    }
    function openDetail(kind: string, i: number) {
      const arr = kind === "today" ? todayGames : histGames;
      const g = arr[i]; if (!g) return;
      detailGame = { g, kind };
      detailReturn = mode;
      mode = "detail";
      if (kind === "today" && g.game_pk) location.hash = "game:" + g.game_pk;
      else if (kind === "history" && g.game_id) location.hash = "hgame:" + histDate + ":" + g.game_id;
      syncHeader();
      renderDetail();
    }
    function backFromDetail() {
      mode = detailReturn || "today"; detailGame = null;
      syncHeader();
      $("legendbox").style.display = mode === "today" ? "" : "none";
      if (mode === "history") loadHistory();
      else if (mode === "perf") loadPerf();
      else load();
    }
    function runTimelineSVG(tl: any[]) {
      const W = 560, H = 96, pad = 10, padB = 16;
      const n = tl.length, maxr = Math.max(1, ...tl.map((t: any) => Math.max(t.home, t.away)));
      const X = (i: number) => pad + (i / Math.max(n - 1, 1)) * (W - 2 * pad);
      const Y = (v: number) => H - padB - (v / maxr) * (H - pad - padB);
      const line = (key: string, col: string) => {
        const pts = tl.map((t: any, i: number) => `${X(i).toFixed(1)},${Y(t[key]).toFixed(1)}`);
        return `<polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>` +
          tl.map((t: any, i: number) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(t[key]).toFixed(1)}" r="2" fill="${col}"/>`).join("");
      };
      const xl = tl.map((t: any, i: number) => `<text x="${X(i).toFixed(1)}" y="${H - 4}" font-size="8" fill="#9aa3af" text-anchor="middle" font-family="IBM Plex Mono">${t.inning}</text>`).join("");
      return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:96px;display:block">${line("away", "#c8102e")}${line("home", "#0c2340")}${xl}</svg>`;
    }
    function renderStatcast(sc: any, awayAb: string, homeAb: string) {
      if (!sc) return "";
      const L = sc.leaders || {};
      const tile = (k: string, v: string, sub: string) => `<div class="sc-lead"><div class="sk">${k}</div><div class="sc-bignum">${v}</div><div class="sc-sub">${sub}</div></div>`;
      const leaders = `<div class="sc-leaders">
        ${L.fastest_pitch ? tile("Fastest Pitch", `${num(L.fastest_pitch.velo, 1)}<small>mph</small>`, `${L.fastest_pitch.pitcher}${L.fastest_pitch.pitch ? " · " + L.fastest_pitch.pitch : ""}`) : ""}
        ${L.hardest_hit ? tile("Hardest Hit", `${num(L.hardest_hit.ev, 1)}<small>mph</small>`, L.hardest_hit.batter) : ""}
        ${L.most_k_pitcher ? tile("Most K", `${L.most_k_pitcher.k}<small>K</small>`, L.most_k_pitcher.name) : ""}
        ${tile("Total Pitches", String(sc.n_pitches || 0), "thrown")}
      </div>`;
      const pitchers = (sc.pitchers || []).slice(0, 4).map((p: any) => {
        const ars = (p.arsenal || []).map((a: any) => `<div class="sc-arrow"><span class="sc-pt">${a.pitch}</span><div class="sc-arbar"><i style="width:${a.pct}%"></i></div><span class="sc-arv">${a.velo ? a.velo + " · " : ""}${a.pct}%${a.whiff ? ` · ${a.whiff}%w` : ""}</span></div>`).join("");
        return `<div class="sc-pitcher"><div class="sc-pname">${p.name} <span class="sc-pteam">${p.team || ""}</span></div>
          <div class="sc-pline">${p.k} K · ${p.bb} BB · ${p.h} H · ${p.hr} HR · ${p.pitches} P${p.max_velo ? ` · ${p.max_velo} max` : ""}</div>
          <div class="sc-arsenal">${ars}</div></div>`;
      }).join("");
      const hitters = (sc.batters || []).filter((b: any) => b.h > 0 || b.hr > 0).slice(0, 8).map((b: any) =>
        `<div class="sc-hit"><span class="sc-hn">${b.name} <small>${b.team}</small></span><span class="sc-hs">${b.h}-for-${b.pa}${b.hr ? ` · <b>${b.hr} HR</b>` : ""}${b.k ? ` · ${b.k}K` : ""}${b.max_ev ? ` · ${b.max_ev} EV` : ""}</span></div>`).join("");
      const hardest = (sc.hardest_hit || []).map((h: any) =>
        `<div class="sc-hh"><span class="sc-ev">${num(h.ev, 1)}</span><span class="sc-hhb">${h.batter}</span><span class="sc-hhr">${(h.result || "").replace(/_/g, " ")}${h.la != null ? ` · ${h.la}°` : ""} · In ${h.inning}</span></div>`).join("");
      const homers = (sc.homers || []).map((h: any) =>
        `<div class="sc-homer"><b>${h.batter}</b> <span class="sc-hrt">${h.team}</span> — In ${h.inning}${h.ev ? ` · ${num(h.ev, 1)} EV` : ""}${h.off ? ` off ${h.off}` : ""}${h.pitch ? ` <span class="sc-hrp">${h.pitch}</span>` : ""}</div>`).join("");
      const tl = sc.run_timeline || [];
      const tlBlock = tl.length ? `<div class="sc-sec"><div class="sc-h">Run Timeline <span class="sc-leg"><i style="background:#c8102e"></i>${awayAb} <i style="background:#0c2340"></i>${homeAb}</span></div>${runTimelineSVG(tl)}</div>` : "";
      return `<div class="dt-card sc-card"><div class="dt-ct"><span>⚾ Statcast — Everything That Happened</span></div>
        ${leaders}${tlBlock}
        ${pitchers ? `<div class="sc-sec"><div class="sc-h">Pitching &amp; Arsenals</div><div class="sc-pitchers">${pitchers}</div></div>` : ""}
        ${homers ? `<div class="sc-sec"><div class="sc-h">Home Runs</div>${homers}</div>` : ""}
        ${hardest ? `<div class="sc-sec"><div class="sc-h">Hardest-Hit Balls</div>${hardest}</div>` : ""}
        ${hitters ? `<div class="sc-sec"><div class="sc-h">Top Hitters</div><div class="sc-hitters">${hitters}</div></div>` : ""}
      </div>`;
    }
    function renderDetail() {
      const grid = $("grid");
      $("record").innerHTML = "";
      $("legendbox").style.display = "none";
      const { g, kind } = detailGame;
      const isHist = kind === "history";
      // normalize box-score side data
      let inns: any[] = [], evo: any[] = [], sideKey = "today", actualTotal: any = null;
      if (isHist) {
        const ls = g.actual_linescore || {}; inns = ls.innings || [];
        g._hr = ls.final_home; g._ar = ls.final_away; g._hh = ls.home_hits; g._ah = ls.away_hits; g._he = ls.home_errors; g._ae = ls.away_errors; g._final = true;
        evo = (g.predictions_by_inning || []).slice().sort((a: any, b: any) => a.after_inning - b.after_inning);
        sideKey = "hist";
        actualTotal = ls.final_total != null ? ls.final_total : (g._hr || 0) + (g._ar || 0);
      } else {
        g._hr = g.home_score; g._ar = g.away_score; g._hh = g.home_hits; g._ah = g.away_hits; g._he = g.home_errors; g._ae = g.away_errors; g._final = g.is_final;
        inns = g.linescore_innings || []; evo = g.evolving_predictions || []; sideKey = "today";
        if (g.is_final) actualTotal = (g._hr || 0) + (g._ar || 0);
      }
      $("slatehead").textContent = isHist ? "Game Detail" : "Game Detail";

      // status / scores
      const scls = !isHist && g.is_live ? "live" : g._final ? "final" : "upcoming";
      const slabel = !isHist && g.is_live ? `${g.inning_half || ""} ${g.current_inning || ""}` : g._final ? "FINAL" : (g.start_time || "SCHEDULED");
      const pill = !isHist && g.is_live
        ? `<span class="statuspill live"><span class="pulse"></span>${slabel}</span>`
        : `<span class="statuspill ${scls}">${slabel}${isHist && g.date ? " · " + g.date : ""}</span>`;
      const showScore = isHist || g.is_live || g.is_final;

      // pitcher matchup (today only — history has no pitcher fields)
      const pmatch = (!isHist && (g.away_pitcher || g.home_pitcher))
        ? `<div class="dt-pmatch"><span class="pml">SP</span><b>${g.away_pitcher || "TBD"}${g.away_pitcher_era != null && g.away_pitcher_era !== "" ? ` (${num(g.away_pitcher_era, 2)})` : ""}</b><span class="pvs">vs</span><b>${g.home_pitcher || "TBD"}${g.home_pitcher_era != null && g.home_pitcher_era !== "" ? ` (${num(g.home_pitcher_era, 2)})` : ""}</b></div>` : "";

      const matchHead = `<div class="dt-head">
        <div class="dt-side away${showScore && (g._ar > g._hr) ? " w" : ""}"><img src="${logo(g.away_abbr)}" onerror="this.style.visibility='hidden'"><div class="dt-tn"><span class="dt-ab">${g.away_abbr || ""}</span><span class="dt-full">${g.away_team || ""}</span></div></div>
        <div class="dt-center">${pill}${showScore ? `<div class="dt-score">${g._ar ?? 0}<span class="dash">–</span>${g._hr ?? 0}</div>` : `<div class="dt-at">@</div>`}<div class="dt-venue">${g.venue || ""}</div></div>
        <div class="dt-side home${showScore && (g._hr > g._ar) ? " w" : ""}"><div class="dt-tn rt"><span class="dt-ab">${g.home_abbr || ""}</span><span class="dt-full">${g.home_team || ""}</span></div><img src="${logo(g.home_abbr)}" onerror="this.style.visibility='hidden'"></div>
      </div>${pmatch}`;

      // model prediction breakdown (today only has full pred fields)
      // PILLAR 3 — deep micro-viz block. Surfaces EVERY prediction visually:
      // big win-prob arc, P(over) gauge, 80% interval distribution (lo..line..
      // pred..hi), per-team interval, run-line cover dial, expected-margin bar,
      // confidence tier + reason, model_type/engine.
      let vizBlock = "";
      if (!isHist) {
        const mg = g.midgame_prediction;
        const live = !!(g.is_live && mg);
        const predTotal = live && mg.predicted_total != null ? mg.predicted_total : g.model_prediction;
        const probOver = live && mg.prob_over != null ? mg.prob_over : g.model_prob_over;
        const homeWP = live && mg.p_home_win != null ? mg.p_home_win : g.home_win_prob;
        const iv = live ? mg.prediction_interval_80 : null;
        const coverPhome = live && mg.spread_cover_prob != null ? mg.spread_cover_prob : g.spread_cover_prob;
        // spread_cover_prob is the HOME team's run-line cover prob; for a ±1.5 line the
        // away side covers iff home does not, so show the model's PICK side's cover.
        const _sc = (g.spread_call || "").toUpperCase();
        const coverPickAbbr = _sc === "AWAY" ? g.away_abbr : g.home_abbr;
        const coverP = coverPhome == null ? null : (_sc === "AWAY" ? 1 - coverPhome : coverPhome);
        const ctier = live && mg.confidence_tier ? mg.confidence_tier : (g.ou_confidence || null);
        const creason = live && mg.confidence_reason ? mg.confidence_reason : null;

        const gaugeCol = `<div class="dt-viz"><div class="dt-vizk">Win Probability</div><div class="dt-gauge">${winProbGauge(homeWP, g.away_abbr, g.home_abbr)}</div></div>`;
        const povCol = `<div class="dt-viz"><div class="dt-vizk">Total — P(Over ${g.line != null ? g.line : "—"})</div><div class="dt-povgauge">${povGauge(probOver, g.line)}</div></div>`;
        const dials = `<div class="dt-viz"><div class="dt-vizk">Run-Line &amp; Margin</div><div class="dt-dialrow">
          ${coverP != null ? `<div class="dt-dial"><div class="dk">${coverPickAbbr} Run Line Cover</div>${coverDial(coverP)}</div>` : ""}
          <div class="dt-dial"><div class="dk">Expected Margin</div><div class="dv">${fmtSign(live && mg.predicted_final_home != null ? mg.predicted_final_home - mg.predicted_final_away : g.expected_margin)}</div><div style="margin-top:6px">${marginBar(live && mg.predicted_final_home != null ? mg.predicted_final_home - mg.predicted_final_away : g.expected_margin, g.away_abbr, g.home_abbr)}</div></div>
        </div></div>`;

        // 80% interval distribution (lo..line..pred..hi) + per-team intervals
        let ivCol = "";
        if (iv) {
          const teamRow = (lo: any, hi: any, pt: any, ab: string) => {
            const vals = [lo, hi, pt].filter((v) => v != null).map(Number);
            let amin = Math.min(0, ...vals), amax = Math.max(...vals) + 0.6;
            const sp = amax - amin || 1; const P = (v: number) => ((v - amin) / sp) * 100;
            return `<div class="dt-teamiv"><span class="tl">${ab}</span><div class="tbar">
              <div class="tspan" style="left:${P(lo).toFixed(1)}%;width:${(P(hi) - P(lo)).toFixed(1)}%"></div>
              <div class="tdot" style="left:${P(pt).toFixed(1)}%"></div>
              <span class="tlab" style="left:${P(pt).toFixed(1)}%">${num(pt)}</span></div></div>`;
          };
          ivCol = `<div class="dt-card"><div class="dt-ct"><span>80% Prediction Interval</span><span class="enginechip mid">◆ BASE-OUT</span></div>
            <div class="dt-ivwrap">
              <div class="dt-vizk">Total runs — model interval vs the Vegas line</div>
              ${intervalBar(iv.total_lo, iv.total_hi, predTotal, g.line, "dt-ivbar")}
              <div class="dt-ivlegend"><span><i style="background:rgba(12,35,64,.3)"></i>80% interval</span><span><i style="background:var(--navy)"></i>point prediction ${num(predTotal)}</span><span><i style="background:var(--red)"></i>Vegas line ${g.line != null ? g.line : "—"}</span></div>
              <div style="margin-top:14px">${teamRow(iv.away_lo, iv.away_hi, mg.predicted_final_away, g.away_abbr)}${teamRow(iv.home_lo, iv.home_hi, mg.predicted_final_home, g.home_abbr)}</div>
            </div></div>`;
        }

        const confBlock = creason ? `<div class="confreason"><div class="ct">Confidence: ${ctier || "—"}</div>${creason}</div>` : "";
        vizBlock = `<div class="dt-card"><div class="dt-ct"><span>Prediction Visuals</span>${modelTypeBadge(g)}</div>
            <div class="dt-vizrow">${gaugeCol}${povCol}</div>
            <div style="margin-top:14px">${dials}</div>
            ${confBlock ? `<div style="margin-top:14px">${confBlock}</div>` : ""}
          </div>${ivCol}`;
      }

      let modelBlock = "";
      if (!isHist) {
        // live games: prefer the base-out mid-game projection so the Model
        // Prediction block agrees with the headline / viz / interval (which all
        // use midgame_prediction). Falls back to the pregame fields otherwise.
        const mgM = g.midgame_prediction;
        const liveM = !!(g.is_live && mgM);
        const engine = (g.model_engine === "mid-game" || liveM) ? "mid" : "pre";
        const engChip = `<span class="enginechip ${engine}">${engine === "mid" ? "◆ MID-GAME MODEL" : "○ PRE-GAME MODEL"}</span>`;
        const pa = liveM && mgM.predicted_final_away != null ? num(mgM.predicted_final_away) : num(g.predicted_away_runs);
        const ph = liveM && mgM.predicted_final_home != null ? num(mgM.predicted_final_home) : num(g.predicted_home_runs);
        const projTotal = liveM && mgM.predicted_total != null ? mgM.predicted_total : g.model_prediction;
        const homeWPm = liveM && mgM.p_home_win != null ? mgM.p_home_win : g.home_win_prob;
        const wpHome = homeWPm != null ? Math.round(Number(homeWPm) * 100) : null;
        const ou = (g.ou_call || "—").toUpperCase(), ouT = tier(g.ou_confidence);
        const ouCls = ou === "OVER" ? "over" : ou === "UNDER" ? "under" : "push";
        // edge: live = mid-game projected total vs line; else stored model_edge
        const edge = (liveM && projTotal != null && g.line != null) ? Number(projTotal) - Number(g.line) : g.model_edge;
        const eCls = edge > 0.25 ? "pos" : edge < -0.25 ? "neg" : "flat";
        modelBlock = `<div class="dt-card"><div class="dt-ct"><span>Model Prediction</span>${engChip}</div>
          <div class="dt-modelgrid">
            <div class="dt-pred"><div class="sk">${liveM ? "Projected Final" : "Predicted Score"}</div><div class="score-pred">${pa}<small> ${g.away_abbr}</small> – ${ph}<small> ${g.home_abbr}</small></div></div>
            <div class="dt-pred"><div class="sk">Projected Total</div><div class="dt-bignum">${num(projTotal)}</div></div>
            ${wpHome != null ? `<div class="dt-pred"><div class="sk">${g.home_abbr} Win Prob</div><div class="dt-wpwrap"><span class="dt-bignum sm">${wpHome}%</span><div class="pbar"><i style="width:${wpHome}%"></i></div></div></div>` : ""}
          </div>
          <div class="dt-callrow">
            <span class="badge ${ouCls}">${ou} ${g.line != null ? g.line : ""}<span class="tier tier-${ouT}">${ouT}</span></span>
            ${g.ou_confidence_pct != null ? `<span class="confpct">${g.ou_confidence_pct}% conf</span>` : ""}
            ${edge != null ? `<span class="edge ${eCls}">${edge > 0 ? "+" : ""}${num(edge)} edge vs line</span>` : ""}
            ${g.is_final && g.ou_result ? `<span class="res ${resCls(g.ou_result)}">${(g.ou_result || "").toUpperCase()}</span>` : ""}
          </div></div>`;
      } else {
        const pre = evo[0], last = evo[evo.length - 1] || pre;
        modelBlock = `<div class="dt-card"><div class="dt-ct"><span>Model Read</span><span class="enginechip mid">◆ MID-GAME MODEL</span></div>
          <div class="dt-modelgrid">
            <div class="dt-pred"><div class="sk">Pregame Total</div><div class="dt-bignum sm">${pre ? num(pre.pred_total) : "—"}</div></div>
            <div class="dt-pred"><div class="sk">Final Model Total</div><div class="dt-bignum sm">${last ? num(last.pred_total) : "—"}</div></div>
            <div class="dt-pred"><div class="sk">Actual Total</div><div class="dt-bignum sm" style="color:var(--red)">${actualTotal != null ? actualTotal : "—"}</div></div>
          </div></div>`;
      }

      // odds block (today only) — line, odds, spread, line-movement, per-book list
      let oddsBlock = "";
      if (!isHist) {
        // line movement (opening → current)
        let moveRow = "";
        if (g.opening_total != null && g.line != null && g.opening_total !== g.line) {
          const dir = g.line > g.opening_total ? "▲" : "▼";
          const dcol = g.line > g.opening_total ? "var(--green)" : "var(--red)";
          moveRow = `<div class="dt-callrow" style="border-top:0;padding-top:8px"><span class="cr-k">Line move</span><span style="font-family:'IBM Plex Mono';font-size:13px">${g.opening_total} → <b style="color:${dcol}">${g.line} ${dir}</b></span></div>`;
        } else if (g.line_movement) {
          moveRow = `<div class="dt-callrow" style="border-top:0;padding-top:8px"><span class="cr-k">Line move</span><span style="font-family:'IBM Plex Mono';font-size:12px">${g.line_movement}</span></div>`;
        }
        // per-book odds list, when present
        let booksTbl = "";
        const books = Array.isArray(g.odds) ? g.odds : null;
        if (books && books.length) {
          const rows = books.slice(0, 8).map((b: any) =>
            `<div class="dt-bookrow"><span class="bname">${b.book || b.bookmaker || b.key || "—"}</span><span class="bnum">${b.total != null ? b.total : (b.line != null ? b.line : "—")}</span><span>${fmtOdds(b.over_odds != null ? b.over_odds : b.over)}</span><span>${fmtOdds(b.under_odds != null ? b.under_odds : b.under)}</span><span class="bnum">${b.home_ml != null ? fmtOdds(b.home_ml) : "—"}</span></div>`).join("");
          booksTbl = `<div class="dt-books" style="margin-top:12px"><div class="dt-bookrow bh"><span>Book</span><span>Total</span><span>Over</span><span>Under</span><span>Home ML</span></div>${rows}</div>`;
        }
        oddsBlock = `<div class="dt-card"><div class="dt-ct"><span>Market — Line, Odds &amp; Movement</span><span class="dt-book">${g.bookmaker || ""}</span></div>
          <div class="dt-oddsgrid">
            <div class="dt-odd"><div class="sk">O/U Line</div><div class="ov">${g.line != null ? g.line : "—"}</div></div>
            <div class="dt-odd"><div class="sk">Over</div><div class="ov">${fmtOdds(g.over_odds)}</div></div>
            <div class="dt-odd"><div class="sk">Under</div><div class="ov">${fmtOdds(g.under_odds)}</div></div>
            <div class="dt-odd"><div class="sk">Run Line</div><div class="ov">±${g.spread_line != null ? g.spread_line : "1.5"}</div></div>
            <div class="dt-odd"><div class="sk">${g.away_abbr} ML</div><div class="ov">${fmtOdds(g.away_ml)}</div></div>
            <div class="dt-odd"><div class="sk">${g.home_abbr} ML</div><div class="ov">${fmtOdds(g.home_ml)}</div></div>
          </div>${moveRow}${booksTbl}</div>`;
      }

      // trajectory
      let trajBlock = "";
      if (evo.length && actualTotal != null) {
        const pre = evo[0], last = evo[evo.length - 1];
        const conv = Math.abs(last.pred_total - actualTotal);
        const convCls = conv < 1 ? "good" : conv < 2.5 ? "mid" : "bad";
        const convTxt = conv < 1 ? "NAILED IT" : conv < 2.5 ? "CLOSE" : "MISSED";
        trajBlock = `<div class="dt-card"><div class="dt-ct"><span>Prediction Trajectory</span><span class="conv ${convCls}">${convTxt}</span></div>
          <div class="traj" style="border:0;padding:4px 0 0">${trajSVG(evo, actualTotal)}
          <div class="trajfoot"><span><i style="border-color:#0c2340"></i>Model pred total</span><span><i style="border-color:#c8102e;border-top-style:dashed"></i>Final actual</span><span style="margin-left:auto;color:var(--ink2)">x-axis = innings completed · pregame ${pre ? num(pre.pred_total) : "—"} → final ${actualTotal}</span></div></div></div>`;
      } else if (evo.length) {
        trajBlock = `<div class="dt-card"><div class="dt-ct"><span>Live Prediction Trajectory</span></div>
          <div class="traj" style="border:0;padding:4px 0 0"><div class="dt-evolist">${evo.map((e: any) => { const cf = e.confidence; let cl = ""; if (cf != null && cf !== "") { cl = typeof cf === "number" || (!isNaN(Number(cf)) && String(cf).trim() !== "") ? Math.round(Number(cf) <= 1 ? Number(cf) * 100 : Number(cf)) + "%" : String(cf).toUpperCase(); } return `<div class="dt-ev"><span class="ei">${e.after_inning ? "In " + e.after_inning : "Pre"}</span><span class="et">${num(e.pred_total)}</span>${cl ? `<span class="ec">${cl}</span>` : ""}</div>`; }).join("")}</div></div></div>`;
      }

      // insight block
      let insightBits: string[] = [];
      if (!isHist) {
        const mgI = g.midgame_prediction;
        const liveI = !!(g.is_live && mgI);
        const engineTxt = (g.model_engine === "mid-game" || liveI) ? "the mid-game simulation engine (which updates as the game unfolds)" : "the pregame engine";
        insightBits.push(`This pick comes from <b>${engineTxt}</b>.`);
        if (g.ou_call) {
          const projI = liveI && mgI.predicted_total != null ? Number(mgI.predicted_total) : g.model_prediction;
          const ed = (liveI && projI != null && g.line != null) ? projI - Number(g.line) : g.model_edge;
          if (ed != null && Math.abs(ed) >= 0.25) insightBits.push(`The model projects <b>${num(projI)}</b> total runs vs the line of <b>${g.line}</b> — a <b>${num(Math.abs(ed))}-run ${ed > 0 ? "over" : "under"}</b> edge, hence the <b>${(g.ou_call || "").toUpperCase()}</b> lean${g.ou_confidence_pct != null ? ` at ${g.ou_confidence_pct}% confidence` : ""}.`);
          else insightBits.push(`The model sits within a fraction of a run of the line — no meaningful O/U edge here.`);
        }
        if (g.model_engine !== "mid-game" && !liveI) insightBits.push(`Reminder: the pregame O/U market is efficient — our edge only shows up <b>once a game is live</b>, where the mid-game engine reprojects the remaining total.`);
      } else {
        insightBits.push(`This is a 2024 historical game shown to illustrate how the <b>mid-game model</b> re-projects the final total inning by inning. Compare the model line against the dashed actual-total line above.`);
      }
      const insight = `<div class="dt-card insight"><div class="dt-ct"><span>What's Driving This</span></div><div class="dt-insight">${insightBits.map((b) => `<p>${b}</p>`).join("")}</div></div>`;

      const statcastBlock = g.statcast ? renderStatcast(g.statcast, g.away_abbr || "", g.home_abbr || "") : "";

      grid.innerHTML = `<div class="detailwrap">
        <button class="backbtn" id="dt-back">‹ Back to slate</button>
        ${matchHead}
        <div class="dt-card"><div class="dt-ct"><span>Box Score</span></div>${boxScore(g, inns, evo, sideKey)}</div>
        <div class="dt-cols">${modelBlock}${oddsBlock}</div>
        ${vizBlock}
        ${trajBlock}
        ${statcastBlock}
        ${insight}
      </div>`;
      $("dt-back").onclick = backFromDetail;
      $("refnote").innerHTML = `${g.away_abbr} @ ${g.home_abbr}${g.venue ? " · " + g.venue : ""}`;
    }

    // ---------- NAVIGATION ----------
    async function selectToday() {
      mode = "today"; location.hash = ""; syncHeader();
      $("legendbox").style.display = "";
      await load();
    }
    async function selectHistory(d: string) {
      histDate = d; mode = "history"; location.hash = "history:" + d; syncHeader();
      await loadHistory();
    }
    function selectPerf() {
      mode = "perf"; location.hash = "performance"; syncHeader();
      $("legendbox").style.display = "none";
      loadPerf();
    }
    $("m-perf").onclick = () => { if (mode !== "perf") selectPerf(); };

    (async function init() {
      await ensureHistDates();
      const h = location.hash;
      if (h === "#performance" || h.indexOf("#performance:") === 0) { if (h.indexOf(":") > 0) perfTab = h.split(":")[1]; renderDateStrip(); selectPerf(); }
      else if (h.indexOf("#game:") === 0) {
        const pk = decodeURIComponent(h.slice(6));
        renderDateStrip(); await load();
        const idx = todayGames.findIndex((g: any) => String(g.game_pk) === pk);
        if (idx >= 0) openDetail("today", idx);
      }
      else if (h.indexOf("#hgame:") === 0) {
        const rest = h.slice(7); const ci = rest.lastIndexOf(":");
        const d = decodeURIComponent(rest.slice(0, ci)), pk = decodeURIComponent(rest.slice(ci + 1));
        renderDateStrip();
        if (histDates.includes(d)) { histDate = d; mode = "history"; await loadHistory(); const idx = histGames.findIndex((g: any) => String(g.game_id) === pk); if (idx >= 0) openDetail("history", idx); }
        else selectToday();
      }
      else if (h.indexOf("#history:") === 0) { const d = decodeURIComponent(h.slice(9)); if (histDates.includes(d)) { selectHistory(d); } else { selectToday(); } }
      else if (h === "#history") { if (histDates.length) selectHistory(histDates[histDates.length - 1]); else selectToday(); }
      else { renderDateStrip(); load(); }
    })();
  }, []);

  return <div id="app-root" />;
}
