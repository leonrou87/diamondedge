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
        <div class="modetoggle"><button id="m-today" class="on">Today</button><button id="m-history">History</button><button id="m-perf">Performance</button></div>
        <div class="datectl" id="datectl"></div><div class="hspacer"></div><div class="recordchip" id="record"></div>
      </div></header>
      <main>
        <div class="subbar"><h2 id="slatehead">Today's Slate</h2><div class="rule"></div>
          <div class="legend"><span><i class="dot" style="background:var(--green)"></i>High</span><span><i class="dot" style="background:var(--blue)"></i>Med</span><span><i class="dot" style="background:var(--amber)"></i>Low</span></div></div>
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

    let mode = "today", histDates: any[] = [], histDate: any = null;

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
      return `<div class="rcontent"><span class="badge ${ouCls}">${ou} ${g.line != null ? g.line : ""}<span class="tier tier-${ouT}">${ouT}</span></span>${ouRes}${edge != null ? `<span class="edge ${eCls}">${edge > 0 ? "+" : ""}${num(edge)} edge</span>` : ""}<div class="vsep"></div>${winAb ? `<span class="badge pick">${winAb} ML${wp != null ? ` · ${wp}%` : ""}</span>` : ""}${wRes}</div>`;
    }
    function todayCard(g: any, i: number) {
      g._hr = g.home_score; g._ar = g.away_score; g._hh = g.home_hits; g._ah = g.away_hits; g._he = g.home_errors; g._ae = g.away_errors; g._final = g.is_final;
      const scls = g.is_live ? "live" : g.is_final ? "final" : "upcoming";
      const slabel = g.is_live ? "LIVE" : g.is_final ? "FINAL" : g.start_time || "SCHEDULED";
      const pill = g.is_live ? `<span class="statuspill live"><span class="pulse"></span>${g.inning_half || ""} ${g.current_inning || ""}</span>` : `<span class="statuspill ${scls}">${slabel}</span>`;
      const ph = num(g.predicted_home_runs), pa = num(g.predicted_away_runs);
      const wpHome = g.home_win_prob != null ? Math.round(g.home_win_prob * 100) : null;
      return `<div class="card" style="animation-delay:${i * 40}ms"><div class="cardtop">${pill}<div class="venue">${g.venue || ""}</div></div>
        ${boxScore(g, g.linescore_innings || [], g.evolving_predictions, "today")}
        <div class="rows">
          <div class="r3 vegas"><div class="rlab">Vegas</div><div class="rcontent">
            <div class="stat"><span class="sk">O / U Line</span><span class="sv">${g.line != null ? g.line : "—"} <small style="color:var(--ink2)">(${fmtOdds(g.over_odds)}/${fmtOdds(g.under_odds)})</small></span></div><div class="vsep"></div>
            <div class="stat"><span class="sk">${g.away_abbr} ML</span><span class="sv">${fmtOdds(g.away_ml)}</span></div>
            <div class="stat"><span class="sk">${g.home_abbr} ML</span><span class="sv">${fmtOdds(g.home_ml)}</span></div>
            <div class="stat" style="margin-left:auto"><span class="sk">Book</span><span class="sv" style="font-size:11px;text-transform:capitalize">${g.bookmaker || "—"}</span></div></div></div>
          <div class="r3 pick"><div class="rlab">Our Pick</div>${pickRow(g)}</div>
          <div class="r3 model"><div class="rlab">Pred Score</div><div class="rcontent">
            <span class="score-pred">${pa}<small> ${g.away_abbr}</small> &nbsp;–&nbsp; ${ph}<small> ${g.home_abbr}</small></span><div class="vsep"></div>
            <div class="stat"><span class="sk">Total</span><span class="sv big">${num(g.model_prediction)}</span></div>
            ${wpHome != null ? `<div class="winprob"><span class="stat"><span class="sk">Win Prob</span><span class="sv">${g.home_abbr} ${wpHome}%</span></span><div class="pbar"><i style="width:${wpHome}%"></i></div></div>` : ""}</div></div>
        </div></div>`;
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
      const acc = (v: any) => (v == null ? "—" : Math.round(v * 100) + "%");
      el.innerHTML = `<div><div class="k">Live</div><div class="v live">${s.live || 0}</div></div><div><div class="k">Final</div><div class="v">${s.final || 0}</div></div><div><div class="k">O/U</div><div class="v g">${acc((s.ou || {}).accuracy)}</div></div><div><div class="k">Winner</div><div class="v g">${acc((s.winner || {}).accuracy)}</div></div>`;
    }
    function renderDateCtl(label?: string) {
      const el = $("datectl");
      if (mode === "perf") {
        el.innerHTML = `<div class="dlabel"><span>Out-of-Sample</span><small>2025–2026</small></div>`;
      } else if (mode === "today") {
        el.innerHTML = `<div class="dlabel"><span>${label || "Live"}</span><small>SNAPSHOT</small></div>`;
      } else {
        const opts = histDates.map((d) => `<option value="${d}" ${d === histDate ? "selected" : ""}>${d}</option>`).join("");
        el.innerHTML = `<button id="h-prev">‹</button><select id="h-sel">${opts}</select><button id="h-next">›</button>`;
        $("h-prev").onclick = () => stepHist(-1);
        $("h-next").onclick = () => stepHist(1);
        $("h-sel").onchange = (e: any) => { histDate = e.target.value; loadHistory(); };
      }
    }
    function stepHist(dir: number) { const i = histDates.indexOf(histDate), j = i + dir; if (j >= 0 && j < histDates.length) { histDate = histDates[j]; loadHistory(); } }

    async function load() {
      const grid = $("grid");
      $("slatehead").textContent = "Today's Slate";
      try {
        const d = await snap("today");
        const games = (d && d.games) || []; renderRecord(d && d.summary);
        renderDateCtl(d && d.date ? new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Live");
        if (!games.length) grid.innerHTML = `<div class="state"><div class="ds">No games</div></div>`;
        else { games.sort((a: any, b: any) => b.is_live - a.is_live || a.is_final - b.is_final); grid.innerHTML = games.map(todayCard).join(""); }
        $("refnote").innerHTML = `DiamondEdge mid-game simulation model · data via Supabase`;
      } catch (e) { grid.innerHTML = `<div class="state"><div class="ds">Connection error</div><div>Could not load snapshot.</div></div>`; }
    }
    async function loadHistoryInit() {
      const grid = $("grid"); grid.innerHTML = `<div class="state"><div class="spinner"></div><div class="ds">Loading history</div></div>`;
      $("slatehead").textContent = "Game History"; $("record").innerHTML = "";
      try { const hd = await snap("history_dates"); histDates = (hd && hd.dates) || []; histDate = histDate && histDates.includes(histDate) ? histDate : histDates[0]; await loadHistory(); }
      catch (e) { grid.innerHTML = `<div class="state"><div class="ds">No history</div></div>`; }
    }
    async function loadHistory() {
      const grid = $("grid"); renderDateCtl();
      try {
        const d = await snap("history:" + histDate);
        const games = (d && d.games) || [];
        grid.innerHTML = games.length ? games.map(historyCard).join("") : `<div class="state"><div class="ds">No games this date</div></div>`;
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

    function renderPerf(a: any) {
      const grid = $("grid");
      if (!a) { grid.innerHTML = `<div class="state"><div class="ds">No analytics</div><div>Analytics snapshot not published yet.</div></div>`; return; }
      const pv = a.pregame_vs_vegas, pp = a.performance_pack, ml = a.midgame_live;
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

      // 1. Pregame vs Vegas MAE time-series (by season)
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

      // 2. Reliability / calibration curve (win prob, mid-game model)
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

      html += `</div>`;
      grid.innerHTML = html;
      $("refnote").innerHTML = `Analytics snapshot${a.generated_at ? " · generated " + new Date(a.generated_at).toLocaleString() : ""} · all metrics out-of-sample, leakage-audited`;
    }

    async function loadPerf() {
      const grid = $("grid"); grid.innerHTML = `<div class="state"><div class="spinner"></div><div class="ds">Loading analytics</div></div>`;
      $("slatehead").textContent = "Model Performance"; $("record").innerHTML = "";
      try { const a = await snap("analytics"); renderPerf(a); }
      catch (e) { grid.innerHTML = `<div class="state"><div class="ds">Connection error</div><div>Could not load analytics snapshot.</div></div>`; }
    }

    function setMode(m: string) {
      if (m === mode) return; mode = m;
      $("m-today").classList.toggle("on", m === "today"); $("m-history").classList.toggle("on", m === "history"); $("m-perf").classList.toggle("on", m === "perf");
      renderDateCtl();
      if (m === "history") { location.hash = "history"; loadHistoryInit(); }
      else if (m === "perf") { location.hash = "performance"; loadPerf(); }
      else { location.hash = ""; load(); }
    }
    $("m-today").onclick = () => setMode("today");
    $("m-history").onclick = () => setMode("history");
    $("m-perf").onclick = () => setMode("perf");

    if (location.hash === "#history") setMode("history");
    else if (location.hash === "#performance") setMode("perf");
    else load();
  }, []);

  return <div id="app-root" />;
}
