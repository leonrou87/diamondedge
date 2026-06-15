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
        <div class="modetoggle"><button id="m-today" class="on">Today</button><button id="m-history">History</button></div>
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
      if (mode === "today") {
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

    function setMode(m: string) {
      if (m === mode) return; mode = m;
      $("m-today").classList.toggle("on", m === "today"); $("m-history").classList.toggle("on", m === "history");
      if (m === "history") { location.hash = "history"; loadHistoryInit(); } else { location.hash = ""; load(); }
    }
    $("m-today").onclick = () => setMode("today");
    $("m-history").onclick = () => setMode("history");

    if (location.hash === "#history") setMode("history"); else load();
  }, []);

  return <div id="app-root" />;
}
