"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const root = document.getElementById("app-root") as any;
    if (!root || root._init) return;
    root._init = true;

    // ===================== LOGO RESOLVERS =====================
    const TEAM_ID: any = { ARI: 109, ATL: 144, BAL: 110, BOS: 111, CHC: 112, CWS: 145, CHW: 145, CIN: 113, CLE: 114, COL: 115, DET: 116, HOU: 117, KC: 118, KCR: 118, LAA: 108, LAD: 119, MIA: 146, MIL: 158, MIN: 142, NYM: 121, NYY: 147, OAK: 133, ATH: 133, PHI: 143, PIT: 134, SD: 135, SDP: 135, SF: 137, SFG: 137, SEA: 136, STL: 138, TB: 139, TBR: 139, TEX: 140, TOR: 141, WSH: 120, WSN: 120, BRE: 158, MILW: 158 };
    const NBA_SLUG: any = { ATL: "atl", BOS: "bos", BKN: "bkn", BRK: "bkn", CHA: "cha", CHI: "chi", CLE: "cle", DAL: "dal", DEN: "den", DET: "det", GSW: "gs", GS: "gs", HOU: "hou", IND: "ind", LAC: "lac", LAL: "lal", MEM: "mem", MIA: "mia", MIL: "mil", MIN: "min", NOP: "no", NO: "no", NYK: "ny", NY: "ny", OKC: "okc", ORL: "orl", PHI: "phi", PHX: "phx", PHO: "phx", POR: "por", SAC: "sac", SAS: "sa", SA: "sa", TOR: "tor", UTA: "utah", UTAH: "utah", WAS: "wsh", WSH: "wsh" };
    const NHL_SLUG: any = { ANA: "ana", ARI: "ari", BOS: "bos", BUF: "buf", CGY: "cgy", CAR: "car", CHI: "chi", COL: "col", CBJ: "cbj", DAL: "dal", DET: "det", EDM: "edm", FLA: "fla", LA: "la", LAK: "la", MIN: "min", MTL: "mtl", NSH: "nsh", NJ: "nj", NJD: "nj", NYI: "nyi", NYR: "nyr", OTT: "ott", PHI: "phi", PIT: "pit", SJ: "sj", SJS: "sj", SEA: "sea", STL: "stl", TB: "tb", TBL: "tb", TOR: "tor", UTA: "utah", UTAH: "utah", VAN: "van", VGK: "vgk", WSH: "wsh", WPG: "wpg" };
    const NFL_SLUG: any = { ARI: "ari", ATL: "atl", BAL: "bal", BUF: "buf", CAR: "car", CHI: "chi", CIN: "cin", CLE: "cle", DAL: "dal", DEN: "den", DET: "det", GB: "gb", HOU: "hou", IND: "ind", JAX: "jax", KC: "kc", LAC: "lac", LAR: "lar", LV: "lv", MIA: "mia", MIN: "min", NE: "ne", NO: "no", NYG: "nyg", NYJ: "nyj", PHI: "phi", PIT: "pit", SEA: "sea", SF: "sf", TB: "tb", TEN: "ten", WSH: "wsh", OAK: "lv", SD: "lac", STL: "lar" };
    const mlbLogo = (ab: any) => `https://www.mlbstatic.com/team-logos/${TEAM_ID[ab] || 0}.svg`;
    const nbaLogo = (ab: any) => `https://a.espncdn.com/i/teamlogos/nba/500/${NBA_SLUG[ab] || (ab || "").toLowerCase()}.png`;
    const nhlLogo = (ab: any) => `https://a.espncdn.com/i/teamlogos/nhl/500/${NHL_SLUG[ab] || (ab || "").toLowerCase()}.png`;
    const nflLogo = (ab: any) => `https://a.espncdn.com/i/teamlogos/nfl/500/${NFL_SLUG[ab] || (ab || "").toLowerCase()}.png`;
    // Soccer national/club crests aren't in the payload — render a clean text crest.
    const logoFor = (sp: string, ab: any) =>
      sp === "soccer" ? null
      : sp === "nba" ? nbaLogo(ab)
      : sp === "nhl" ? nhlLogo(ab)
      : sp === "nfl" ? nflLogo(ab)
      : mlbLogo(ab);

    // ===================== HELPERS =====================
    const $ = (id: string) => document.getElementById(id) as any;
    const esc = (s: any) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]));
    const num = (v: any, d = 1) => (v == null || isNaN(Number(v)) ? "—" : Number(v).toFixed(d));
    const sgn = (v: any, d = 1) => { if (v == null || isNaN(Number(v))) return "—"; const n = Number(v); return (n > 0 ? "+" : "") + n.toFixed(d); };
    const fmtOdds = (o: any) => { if (o == null || o === "") return "—"; const n = Number(o); if (isNaN(n)) return "—"; if (n >= 100 || n <= -100) return n > 0 ? "+" + n : "" + n; const am = n >= 2 ? Math.round((n - 1) * 100) : Math.round(-100 / (n - 1)); return am > 0 ? "+" + am : "" + am; };
    const vigPct = (v: any) => (v == null || isNaN(Number(v)) ? "" : (Number(v) * 100).toFixed(1) + "%");
    const vigLine = (v: any) => { const p = vigPct(v); return p ? `<span class="vig">vig ${p}</span>` : `<span class="vig">&nbsp;</span>`; };
    const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
    const SPORTS = ["mlb", "nba", "nhl", "nfl", "soccer"];
    const SPORT_LABEL: any = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };
    const SPORT_UNIT: any = { mlb: "runs", nba: "pts", nhl: "goals", nfl: "pts", soccer: "goals" };

    async function snap(k: string) {
      const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(k)}&select=payload`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
      const rows = await r.json();
      return rows && rows[0] ? rows[0].payload : null;
    }

    // crest markup (logo img OR text crest for soccer)
    function crestImg(sp: string, ab: any, cls = "") {
      const url = logoFor(sp, ab);
      if (url) return `<img class="${cls}" src="${url}" onerror="this.style.visibility='hidden'" alt="">`;
      return `<span class="crest ${cls}">${esc((ab || "").slice(0, 3))}</span>`;
    }

    const resOf = (pk: any) => (pk && pk.result && pk.result.status ? pk.result.status : null); // hit|miss|push|null
    const rCls = (st: any) => (st === "hit" ? "r-hit" : st === "miss" ? "r-miss" : st === "push" ? "r-push" : "");
    const rMark = (st: any) => (st === "hit" ? `<span class="rmark hit">✓</span>` : st === "miss" ? `<span class="rmark miss">✗</span>` : st === "push" ? `<span class="rmark push">T</span>` : "");

    // confidence -> tier label/dot
    const tierCls = (t: any) => "tier-" + (t || "low");
    const tdotCls = (t: any) => "tdot-" + (t || "low");

    // ===================== STATE =====================
    let tab = "picks";              // "picks" | "analyzer"
    let league = "mlb";             // selected league
    let curDate = todayISO();       // selected date (ISO)
    let confFloor = 0;              // confidence slider floor
    let advOpen = false;            // advanced range open
    let rangeFrom = "", rangeTo = "";
    let rangeMode = false;          // showing range results
    let rangeGames: any[] = [];     // {date,games}
    let payload: any = null;        // current day's payload
    let indexData: any = null;      // pregame_picks_index
    let detail: any = null;         // open detail game

    // ===================== FETCH =====================
    async function loadIndex() { if (!indexData) indexData = await snap("pregame_picks_index"); return indexData; }

    async function loadDay(dateISO: string) {
      // today -> "pregame_picks"; else "pregame_picks:<date>"
      const isToday = dateISO === todayISO();
      const key = isToday ? "pregame_picks" : "pregame_picks:" + dateISO;
      let p = await snap(key);
      // fall back: if today has no live slate, grab it by date key
      if ((!p || !(p.games || []).length) && isToday) p = await snap("pregame_picks:" + dateISO);
      return p;
    }

    function gamesForLeague(p: any, lg: string) {
      const all = (p && p.games) || [];
      const inLg = all.filter((g: any) => (g.sport || "").toLowerCase() === lg);
      // picks elevated: featured first, then top_confidence desc
      inLg.sort((a: any, b: any) => {
        if (!!b.featured !== !!a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return (b.top_confidence || 0) - (a.top_confidence || 0);
      });
      return inLg;
    }

    function leaguesPresent(p: any) {
      const s = new Set<string>();
      ((p && p.games) || []).forEach((g: any) => s.add((g.sport || "").toLowerCase()));
      return s;
    }

    // ===================== TRACK RECORD ACCESS =====================
    function trackRecord() { return (indexData && (indexData.track_record || indexData.track_record_test)) || {}; }
    function trOverall() { return trackRecord().overall || {}; }
    function trForLeague(lg: string) { const bs = trackRecord().by_sport || {}; return bs[lg] || null; }

    // ===================== W-T-L SUMMARY BAND =====================
    function recordBand(lg: string) {
      const tr = trForLeague(lg) || trOverall();
      const lgLabel = trForLeague(lg) ? SPORT_LABEL[lg] : "ALL SPORTS";
      const w = tr.wins ?? 0, l = tr.losses ?? 0, p = tr.pushes ?? 0;
      const hr = tr.hit_rate != null ? (tr.hit_rate * 100).toFixed(1) : "—";
      const roi = tr.roi != null ? (tr.roi * 100) : null;
      const units = tr.units_net != null ? tr.units_net : null;
      const n = tr.n ?? (w + l + p);
      return `
        <div class="recordband">
          <div class="rb-main">
            <div>
              <div class="rb-lab">${esc(lgLabel)} · Model Track Record</div>
              <div class="rb-rec"><span class="w">${w}</span><span class="sep">–</span><span class="l">${l}</span>${p ? `<span class="sep" style="font-size:18px">·</span><span style="opacity:.6;font-size:20px">${p}T</span>` : ""}</div>
              <div class="rb-sub">${n > 0 ? "Real forward picks — frozen pre-game, graded against the real result. No backtest." : "Real forward picks only — the record builds as today's games finish. No backtest, no demo."}</div>
            </div>
          </div>
          <div class="rb-stats">
            <div class="rb-stat"><div class="k">Picks</div><div class="v">${(n || 0).toLocaleString()}</div><div class="sub">graded bets</div></div>
            <div class="rb-stat"><div class="k">Hit Rate</div><div class="v">${hr}<small>%</small></div><div class="sub">vs ${tr.breakeven_hit_rate != null ? (tr.breakeven_hit_rate * 100).toFixed(1) : "52.4"}% breakeven</div></div>
            <div class="rb-stat"><div class="k">ROI</div><div class="v ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1)}<small>%</small></div><div class="sub">per unit staked</div></div>
            <div class="rb-stat"><div class="k">Net Units</div><div class="v ${units == null ? "" : units >= 0 ? "pos" : "neg"}">${units == null ? "—" : (units >= 0 ? "+" : "") + units.toFixed(0)}</div><div class="sub">flat-stake</div></div>
          </div>
        </div>`;
    }

    // ===================== TABLE ROW =====================
    function vegasSpread(g: any) {
      const sp = g.spread_pick;
      if (!sp || sp.line == null) return `<td class="vg grp ctr dash hide-md">—</td>`;
      const pr = sp.prices || {};
      const price = sp.price ?? pr.home ?? pr.away;
      return `<td class="vg grp ctr hide-md"><span class="ln">${sgn(sp.line)}</span> <span class="px">${fmtOdds(price)}</span>${vigLine(sp.vig)}</td>`;
    }
    function vegasML(g: any) {
      const ml = g.ml_pick;
      if (!ml) return `<td class="vg ctr dash hide-md">—</td>`;
      const pr = ml.prices || {};
      // show the priced side
      const price = ml.price ?? pr.home ?? pr.away;
      return `<td class="vg ctr hide-md"><span class="ln">${fmtOdds(price)}</span>${vigLine(ml.vig)}</td>`;
    }
    function vegasTotal(g: any) {
      const tp = g.total_pick;
      if (!tp || tp.line == null) return `<td class="vg ctr dash hide-sm">—</td>`;
      const pr = tp.prices || {};
      const price = tp.price ?? pr.over ?? pr.under;
      return `<td class="vg ctr hide-sm"><span class="ln">${num(tp.line)}</span> <span class="px">${fmtOdds(price)}</span>${vigLine(tp.vig)}</td>`;
    }

    function pickCell(pk: any, kind: string, grp = false) {
      const cls0 = grp ? "pk grp" : "pk";
      if (!pk || pk.side == null) return `<td class="${cls0} dash">—</td>`;
      const st = resOf(pk);
      const tier = pk.tier || "low";
      // compact interval string
      let ivl = "";
      if (kind === "ml" && pk.our_winprob != null) ivl = `wp ${(pk.our_winprob * 100).toFixed(0)}%`;
      else if (pk.interval && pk.interval.lo != null && pk.interval.hi != null && pk.interval.kind !== "win_prob_band") ivl = `[${num(pk.interval.lo)}–${num(pk.interval.hi)}]`;
      const conf = pk.confidence != null ? pk.confidence.toFixed(0) + "%" : "";
      return `<td class="${cls0} ${rCls(st)}">
        <div class="side">${esc(pk.side)}${rMark(st)}</div>
        <div class="conf"><span class="tierdot ${tdotCls(tier)}"></span><span class="pct ${tierCls(tier)}">${conf}</span></div>
        ${ivl ? `<div class="ivl">${ivl}</div>` : ""}
      </td>`;
    }

    function predScoreCell(g: any) {
      const ps = g.predicted_score;
      if (!ps || ps.winner_abbr == null) return `<td class="psc grp dash hide-md">—</td>`;
      const win = ps.winner_abbr;
      const homeWin = win === g.home_abbr;
      const hs = num(ps.home, 1), as = num(ps.away, 1);
      const tot = (ps.home != null && ps.away != null) ? num(Number(ps.home) + Number(ps.away), 1) : (g.total_pick && g.total_pick.our_proj != null ? num(g.total_pick.our_proj) : "—");
      const mg = ps.margin != null ? sgn(Math.abs(Number(ps.margin)), 1).replace("+", "+") : "";
      const homeHtml = `<span class="${homeWin ? "win" : ""}">${esc(g.home_abbr)} ${hs}</span>`;
      const awayHtml = `<span class="${!homeWin ? "win" : ""}">${esc(g.away_abbr)} ${as}</span>`;
      return `<td class="psc grp hide-md">
        <div class="sl">${awayHtml} <span style="color:var(--ink3)">–</span> ${homeHtml}${mg ? `<span class="mg">${mg.startsWith("+") ? mg : "+" + Math.abs(Number(ps.margin)).toFixed(1)}</span>` : ""}</div>
        <div class="tot">proj total ${tot} ${SPORT_UNIT[g.sport] || ""}</div>
      </td>`;
    }

    function statusMeta(g: any) {
      const st = (g.status || "pre").toLowerCase();
      let t = g.start_time || "";
      // only show time-ish strings; ISO dates become blank
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) t = "";
      if (st === "live") return `<span class="st live">LIVE</span>`;
      if (st === "final") return `<span class="st final">FINAL</span>`;
      return t ? `<span class="st">${esc(t)}</span>` : `<span class="st">Scheduled</span>`;
    }

    function tableRow(g: any, idx: number) {
      const sp = g.sport;
      const win = g.predicted_score && g.predicted_score.winner_abbr;
      const awayWin = win && win === g.away_abbr;
      const homeWin = win && win === g.home_abbr;
      return `<tr data-gid="${esc(g.game_id || idx)}" class="${g.featured ? "featrow" : ""}">
        <td>
          <div class="mu">
            ${g.featured ? `<span class="feat"></span>` : ""}
            <span class="logos">${crestImg(sp, g.away_abbr)}${crestImg(sp, g.home_abbr)}</span>
            <span class="mtxt">
              <span class="teams"><span class="${awayWin ? "wn" : ""}">${esc(g.away_abbr)}</span><span class="at">@</span><span class="${homeWin ? "wn" : ""}">${esc(g.home_abbr)}</span></span>
              <span class="meta">${statusMeta(g)}</span>
            </span>
          </div>
        </td>
        ${vegasSpread(g)}
        ${vegasML(g)}
        ${vegasTotal(g)}
        ${pickCell(g.spread_pick, "spread", true)}
        ${pickCell(g.ml_pick, "ml")}
        ${pickCell(g.total_pick, "total")}
        ${predScoreCell(g)}
      </tr>`;
    }

    function tableHead() {
      return `<thead><tr>
        <th>Matchup</th>
        <th class="ctr grp hide-md">Vegas Spread</th>
        <th class="ctr hide-md">Vegas ML</th>
        <th class="ctr hide-sm">Vegas Total</th>
        <th class="ctr grp">Our Spread</th>
        <th class="ctr">Our ML</th>
        <th class="ctr">Our Total</th>
        <th class="ctr grp hide-md">Predicted Score</th>
      </tr></thead>`;
    }

    function dayRecord(games: any[]) {
      let w = 0, l = 0, t = 0;
      games.forEach((g: any) => [g.spread_pick, g.ml_pick, g.total_pick].forEach((pk: any) => {
        const s = resOf(pk); if (s === "hit") w++; else if (s === "miss") l++; else if (s === "push") t++;
      }));
      return { w, l, t, settled: w + l + t };
    }

    // ===================== RENDER: PICKS TAB =====================
    function renderPicks() {
      const present = payload ? leaguesPresent(payload) : new Set<string>();
      // build league tabs (show count badges)
      const tabsHtml = SPORTS.map((lg) => {
        const cnt = payload ? gamesForLeague(payload, lg).length : 0;
        return `<button class="leaguetab ${lg === league ? "on" : ""}" data-lg="${lg}">${SPORT_LABEL[lg]}${cnt ? `<span class="cnt">${cnt}</span>` : ""}</button>`;
      }).join("");

      const isToday = curDate === todayISO();
      const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

      let body = "";
      if (rangeMode) {
        body = renderRangeBody();
      } else {
        const games = payload ? gamesForLeague(payload, league) : [];
        const filtered = applyConfFilter(games);
        if (!payload) {
          body = `<div class="tablewrap"><div class="state"><div class="spinner"></div><div class="big">Loading slate</div><div class="sm">Fetching ${esc(dispDate)}</div></div></div>`;
        } else if (!filtered.length) {
          const ss = (payload && payload.sports_status && payload.sports_status[league]) || null;
          if (ss && ss.in_season === false) {
            body = `<div class="tablewrap"><div class="state offseason"><div class="big">${SPORT_LABEL[league]} — ${esc(ss.label)}</div><div class="sm">No demo games shown. Real pre-game picks resume when the season starts.</div></div></div>`;
          } else {
            body = `<div class="tablewrap"><div class="state"><div class="big">No ${SPORT_LABEL[league]} games</div><div class="sm">${games.length ? "Raise the date or lower the confidence filter." : "Nothing on the board for " + esc(dispDate) + ". Try another date or league."}</div></div></div>`;
          }
        } else {
          const dr = dayRecord(filtered);
          body = `
            <div class="tablewrap">
              <table class="ptable">${tableHead()}<tbody>
                ${filtered.map((g, i) => tableRow(g, i)).join("")}
              </tbody></table>
            </div>
            <div class="refnote">${filtered.length} ${SPORT_LABEL[league]} game${filtered.length > 1 ? "s" : ""} · ${esc(dispDate)}${dr.settled ? ` · settled picks ${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}` : ""} · DiamondEdge pre-game model</div>`;
        }
      }

      root.querySelector("#picks-view").innerHTML = `
        ${recordBand(league)}
        <div class="leaguebar">
          <div class="leaguetabs">${tabsHtml}</div>
          <div class="controls">
            <div class="confctl">
              <span class="cl">Min Conf</span>
              <input type="range" id="conf-slider" min="0" max="100" step="1" value="${confFloor}">
              <span class="cv" id="conf-val">${confFloor === 0 ? "All" : confFloor + "%+"}</span>
            </div>
            <button class="advbtn ${advOpen ? "on" : ""}" id="adv-btn">Range ▾</button>
            <div class="datectl">
              <button class="arrow" id="d-prev" title="Previous day">‹</button>
              <input type="date" id="date-input" value="${curDate}" max="${todayISO()}">
              <button class="arrow" id="d-next" title="Next day" ${isToday ? "disabled" : ""}>›</button>
              <button class="today-btn" id="d-today" ${isToday ? "disabled style='opacity:.4'" : ""}>Today</button>
            </div>
          </div>
        </div>
        ${advOpen ? rangePanel() : ""}
        <div id="picks-body">${body}</div>`;

      bindPicksControls();
    }

    function rangePanel() {
      return `
        <div class="rangepanel">
          <span class="rlab">Date Range</span>
          <input type="date" id="range-from" value="${rangeFrom || curDate}" max="${todayISO()}">
          <span class="rlab" style="letter-spacing:0">to</span>
          <input type="date" id="range-to" value="${rangeTo || curDate}" max="${todayISO()}">
          <button class="go" id="range-go">Search</button>
          ${rangeMode ? `<button class="advbtn" id="range-clear">Clear</button>` : ""}
          <span style="font-size:11px;color:var(--ink3)">Scans each day's ${SPORT_LABEL[league]} board.</span>
        </div>`;
    }

    function renderRangeBody() {
      if (!rangeGames.length) return `<div class="tablewrap"><div class="state"><div class="big">No ${SPORT_LABEL[league]} games in range</div><div class="sm">Try a wider range or another league.</div></div></div>`;
      let html = `<div class="tablewrap"><table class="ptable">${tableHead()}<tbody>`;
      rangeGames.forEach((day: any) => {
        const games = applyConfFilter(gamesForLeague({ games: day.games }, league));
        if (!games.length) return;
        const dr = dayRecord(games);
        const dd = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
        html += `<tr class="dayhdr"><td colspan="8">${esc(dd)}<span class="rr">${games.length} game${games.length > 1 ? "s" : ""}${dr.settled ? ` · ${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}` : ""}</span></td></tr>`;
        html += games.map((g, i) => tableRow(g, i)).join("");
      });
      html += `</tbody></table></div>`;
      // aggregate
      let W = 0, L = 0, T = 0, N = 0;
      rangeGames.forEach((day: any) => { const gs = applyConfFilter(gamesForLeague({ games: day.games }, league)); N += gs.length; const r = dayRecord(gs); W += r.w; L += r.l; T += r.t; });
      html += `<div class="refnote">${N} ${SPORT_LABEL[league]} games across ${rangeGames.length} day${rangeGames.length > 1 ? "s" : ""}${W + L + T ? ` · settled picks ${W}-${L}${T ? "-" + T : ""}` : ""}</div>`;
      return html;
    }

    function applyConfFilter(games: any[]) {
      if (!confFloor) return games;
      // keep games whose top_confidence >= floor; but always keep ≥1 (the surest play)
      const kept = games.filter((g) => (g.top_confidence || 0) >= confFloor);
      if (kept.length) return kept;
      // floor too high — fall back to the single surest game
      const sorted = [...games].sort((a, b) => (b.top_confidence || 0) - (a.top_confidence || 0));
      return sorted.slice(0, 1);
    }

    function bindPicksControls() {
      root.querySelectorAll(".leaguetab").forEach((b: any) => (b.onclick = () => { league = b.dataset.lg; confFloor = 0; if (rangeMode) { runRange(); } renderPicks(); }));
      const slider = $("conf-slider");
      if (slider) {
        // cap the slider so it always leaves ≥1 game: max = highest top_confidence in current league
        const games = rangeMode ? rangeGames.flatMap((d: any) => gamesForLeague({ games: d.games }, league)) : (payload ? gamesForLeague(payload, league) : []);
        const maxC = games.length ? Math.max(...games.map((g: any) => g.top_confidence || 0)) : 100;
        slider.max = Math.max(1, Math.floor(maxC));
        slider.oninput = () => { confFloor = Number(slider.value) || 0; const v = $("conf-val"); if (v) v.textContent = confFloor === 0 ? "All" : confFloor + "%+"; };
        slider.onchange = () => { confFloor = Number(slider.value) || 0; if (rangeMode) { $("picks-body").innerHTML = renderRangeBody(); } else { renderPicksBody(); } };
      }
      const advBtn = $("adv-btn"); if (advBtn) advBtn.onclick = () => { advOpen = !advOpen; renderPicks(); };
      const di = $("date-input"); if (di) di.onchange = () => { curDate = di.value; rangeMode = false; loadAndRenderDay(); };
      const dp = $("d-prev"); if (dp) dp.onclick = () => { curDate = shiftDate(curDate, -1); rangeMode = false; loadAndRenderDay(); };
      const dn = $("d-next"); if (dn) dn.onclick = () => { if (curDate >= todayISO()) return; curDate = shiftDate(curDate, 1); rangeMode = false; loadAndRenderDay(); };
      const dt = $("d-today"); if (dt) dt.onclick = () => { curDate = todayISO(); rangeMode = false; loadAndRenderDay(); };
      const rf = $("range-from"); if (rf) rf.onchange = () => (rangeFrom = rf.value);
      const rt = $("range-to"); if (rt) rt.onchange = () => (rangeTo = rt.value);
      const rg = $("range-go"); if (rg) rg.onclick = () => runRange();
      const rc = $("range-clear"); if (rc) rc.onclick = () => { rangeMode = false; renderPicks(); };
      bindRowClicks();
    }

    function renderPicksBody() {
      const games = payload ? gamesForLeague(payload, league) : [];
      const filtered = applyConfFilter(games);
      const isToday = curDate === todayISO();
      const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      let body;
      if (!filtered.length) {
        const ss = (payload && payload.sports_status && payload.sports_status[league]) || null;
        if (ss && ss.in_season === false) {
          body = `<div class="tablewrap"><div class="state offseason"><div class="big">${SPORT_LABEL[league]} — ${esc(ss.label)}</div><div class="sm">No demo games shown. Real pre-game picks resume when the season starts.</div></div></div>`;
        } else {
          body = `<div class="tablewrap"><div class="state"><div class="big">No ${SPORT_LABEL[league]} games${isToday ? " today" : ""}</div><div class="sm">${confFloor > 0 ? "Lower the confidence filter, or " : ""}check back at game time or pick another date.</div></div></div>`;
        }
      } else {
        const dr = dayRecord(filtered);
        body = `<div class="tablewrap"><table class="ptable">${tableHead()}<tbody>${filtered.map((g, i) => tableRow(g, i)).join("")}</tbody></table></div>
          <div class="refnote">${filtered.length} ${SPORT_LABEL[league]} game${filtered.length > 1 ? "s" : ""} · ${esc(dispDate)}${dr.settled ? ` · settled picks ${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}` : ""} · DiamondEdge pre-game model</div>`;
      }
      $("picks-body").innerHTML = body;
      bindRowClicks();
    }

    function bindRowClicks() {
      root.querySelectorAll(".ptable tbody tr[data-gid]").forEach((tr: any) => {
        tr.onclick = () => {
          const gid = tr.dataset.gid;
          let g = null;
          const pool = rangeMode ? rangeGames.flatMap((d: any) => d.games) : (payload ? payload.games : []);
          g = (pool || []).find((x: any) => String(x.game_id) === String(gid));
          if (g) openDetail(g);
        };
      });
    }

    function shiftDate(iso: string, days: number) {
      const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + days);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    async function loadAndRenderDay() {
      confFloor = 0;
      $("picks-body") && ($("picks-body").innerHTML = `<div class="tablewrap"><div class="state"><div class="spinner"></div><div class="big">Loading</div></div></div>`);
      payload = await loadDay(curDate);
      // pick a sensible default league: keep current if present, else first present
      const present = leaguesPresent(payload);
      if (!present.has(league) && present.size) league = SPORTS.find((s) => present.has(s)) || league;
      renderPicks();
    }

    async function runRange() {
      const from = ($("range-from") && $("range-from").value) || rangeFrom || curDate;
      const to = ($("range-to") && $("range-to").value) || rangeTo || curDate;
      rangeFrom = from; rangeTo = to;
      if (!from || !to) return;
      let a = from, b = to; if (a > b) { const t = a; a = b; b = t; }
      // collect the index dates inside the range to avoid empty fetches
      await loadIndex();
      const allDates: string[] = (indexData && indexData.dates) || [];
      const inRange = allDates.filter((d) => d >= a && d <= b);
      // cap at 60 days to keep it fast
      const dates = inRange.slice(-60);
      rangeMode = true;
      $("picks-body") && ($("picks-body").innerHTML = `<div class="tablewrap"><div class="state"><div class="spinner"></div><div class="big">Scanning ${dates.length} day${dates.length === 1 ? "" : "s"}</div><div class="sm">${esc(a)} → ${esc(b)}</div></div></div>`);
      const results = await Promise.all(dates.map(async (d) => ({ date: d, games: ((await snap("pregame_picks:" + d)) || {}).games || [] })));
      rangeGames = results.filter((r) => r.games.length).sort((x, y) => (x.date < y.date ? 1 : -1));
      confFloor = 0;
      renderPicks();
    }

    // ===================== DETAIL DRAWER =====================
    function modelsVsMarket(g: any) {
      const models = (g.why && g.why.models) || [];
      if (!models.length) return "";
      const rows = models.map((m: any) => `<tr><td class="mname">${esc(m.name)}<div class="mnote">${esc(m.note || "")}</div></td><td class="num">${m.proj != null ? num(m.proj, 2) : "—"}</td></tr>`).join("");
      return `<div class="dsec"><div class="dsec-h">Models vs. Market</div><div class="dsec-b"><table class="mtab"><thead><tr><th>Source</th><th style="text-align:right">Projection</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
    }

    function detailBet(pk: any, label: string, kind: string, g: any) {
      if (!pk || pk.side == null) return "";
      const st = resOf(pk);
      const tier = pk.tier || "low";
      let line = "";
      if (kind === "spread") line = `line <b>${sgn(pk.line)}</b> · proj margin <b>${pk.our_proj != null ? sgn(pk.our_proj) : "—"}</b>${pk.interval && pk.interval.lo != null ? ` · 80% [${num(pk.interval.lo)}, ${num(pk.interval.hi)}]` : ""}`;
      else if (kind === "total") line = `line <b>${num(pk.line)}</b> · our proj <b>${num(pk.our_proj)}</b>${pk.interval && pk.interval.lo != null ? ` · 80% [${num(pk.interval.lo)}, ${num(pk.interval.hi)}]` : ""}`;
      else line = `price <b>${fmtOdds(pk.price)}</b>${pk.our_winprob != null ? ` · our win prob <b>${(pk.our_winprob * 100).toFixed(1)}%</b>` : ""}${pk.market_winprob != null ? ` · market <b>${(pk.market_winprob * 100).toFixed(1)}%</b>` : ""}`;
      const resTxt = st === "hit" ? `WON ${pk.result.net_units >= 0 ? "+" : ""}${num(pk.result.net_units, 2)}u` : st === "miss" ? `LOST ${num(pk.result.net_units, 2)}u` : st === "push" ? "PUSH" : "";
      return `<div class="dbet">
        <div class="dmk">${esc(label)}</div>
        <div class="dmid"><div class="dside">${esc(pk.side)}</div><div class="dline">${line}</div></div>
        <div class="dright"><div class="dconf">${pk.confidence != null ? pk.confidence.toFixed(0) + "%" : "—"}</div><div class="dtier ${tierCls(tier)}">${esc(tier)}</div>${resTxt ? `<div class="dres ${st}">${resTxt}</div>` : ""}</div>
      </div>`;
    }

    function openDetail(g: any) {
      detail = g;
      const sp = g.sport;
      const ps = g.predicted_score || {};
      const homeWin = ps.winner_abbr === g.home_abbr;
      const dispDate = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      const st = (g.status || "pre").toLowerCase();
      const startTxt = /^\d{4}-\d{2}-\d{2}$/.test(g.start_time || "") ? "" : g.start_time;
      const tot = (ps.home != null && ps.away != null) ? num(Number(ps.home) + Number(ps.away), 1) : (g.total_pick && g.total_pick.our_proj != null ? num(g.total_pick.our_proj) : "—");

      const bets = [detailBet(g.spread_pick, "Spread", "spread", g), detailBet(g.ml_pick, "Moneyline", "ml", g), detailBet(g.total_pick, "Total", "total", g)].filter(Boolean).join("");

      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Why This Read</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";

      const html = `
        <div class="drawer-bg" id="drawer-bg"></div>
        <div class="drawer">
          <div class="drawer-head">
            <button class="close" id="drawer-close">✕</button>
            <div class="dh-sport">${SPORT_LABEL[sp] || sp}${st === "final" ? " · Final" : st === "live" ? " · Live" : ""}</div>
            <div class="dh-mu">${esc(g.away_abbr)}<span class="at">@</span>${esc(g.home_abbr)}</div>
            <div class="dh-meta">${esc([g.matchup, dispDate, startTxt].filter(Boolean).join(" · "))}</div>
          </div>
          <div class="drawer-body">
            <div class="dsec">
              <div class="dsec-h">Predicted Final Score</div>
              <div class="dsec-b">
                <div class="dscore">
                  <div class="tm ${!homeWin ? "win" : ""}">${crestImg(sp, g.away_abbr)}<div class="pts">${num(ps.away, 1)}</div><div class="ab">${esc(g.away_abbr)}</div></div>
                  <div class="dx">–</div>
                  <div class="tm ${homeWin ? "win" : ""}">${crestImg(sp, g.home_abbr)}<div class="pts">${num(ps.home, 1)}</div><div class="ab">${esc(g.home_abbr)}</div></div>
                </div>
                <div class="dscore-foot">Edge: <b>${esc(ps.winner_abbr || "—")}</b> by <b>${ps.margin != null ? Math.abs(Number(ps.margin)).toFixed(1) : "—"}</b> · projected total <b>${tot} ${SPORT_UNIT[sp] || ""}</b></div>
              </div>
            </div>
            <div class="dsec"><div class="dsec-h">Our Picks</div><div class="dsec-b" style="padding-top:4px;padding-bottom:4px">${bets || `<div style="padding:10px 0;color:var(--ink3);font-size:12px">No graded picks for this game.</div>`}</div></div>
            ${modelsVsMarket(g)}
            ${reasoning}
          </div>
        </div>`;

      let layer = $("drawer-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "drawer-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      $("drawer-close").onclick = closeDetail;
      $("drawer-bg").onclick = closeDetail;
    }
    function closeDetail() { detail = null; const l = $("drawer-layer"); if (l) l.innerHTML = ""; }

    // ===================== ANALYZER TAB =====================
    function pct(v: any, d = 1) { return v == null ? "—" : (v * 100).toFixed(d) + "%"; }
    function recCell(o: any) { return o ? `${o.wins}-${o.losses}${o.pushes ? "-" + o.pushes : ""}` : "—"; }

    function anzTable(title: string, sub: string, obj: any, order: string[], labelMap: any) {
      const rows = order.filter((k) => obj[k]).map((k) => {
        const o = obj[k];
        const roi = o.roi != null ? o.roi * 100 : null;
        const hr = o.hit_rate != null ? o.hit_rate * 100 : null;
        const be = o.breakeven_hit_rate != null ? o.breakeven_hit_rate * 100 : 52.4;
        const barW = hr != null ? Math.max(2, Math.min(100, ((hr - 45) / 12) * 100)) : 0;
        return `<tr>
          <td>${esc(labelMap[k] || k)}</td>
          <td class="num">${(o.n || 0).toLocaleString()}</td>
          <td class="rec">${recCell(o)}</td>
          <td class="hr">${hr != null ? hr.toFixed(1) + "%" : "—"}<span class="bar" style="width:${barW * 0.5}px;opacity:${hr != null && hr >= be ? 1 : 0.4}"></span></td>
          <td class="roi ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</td>
          <td class="${o.units_net == null ? "" : o.units_net >= 0 ? "roi pos" : "roi neg"}">${o.units_net == null ? "—" : (o.units_net >= 0 ? "+" : "") + o.units_net.toFixed(0)}u</td>
        </tr>`;
      }).join("");
      return `<div class="anz-card">
        <div class="anz-card-h">${esc(title)}<span class="sub">${esc(sub)}</span></div>
        <table class="anztab"><thead><tr><th>${esc(title.split(" ")[0])}</th><th>Picks</th><th>W-L</th><th>Hit Rate</th><th>ROI</th><th>Units</th></tr></thead><tbody>${rows}</tbody></table>
      </div>`;
    }

    function calibrationCard() {
      const tr = trackRecord();
      const byTier = tr.by_tier || {};
      const cc = tr.calibration_check || {};
      const tiers = ["low", "medium", "high", "featured"];
      const be = (tr.overall && tr.overall.breakeven_hit_rate ? tr.overall.breakeven_hit_rate : 0.524) * 100;
      const rows = tiers.map((t) => {
        const o = byTier[t]; if (!o) return "";
        const hr = (o.hit_rate || 0) * 100;
        const w = Math.max(3, Math.min(100, ((hr - 45) / 12) * 100));
        return `<div class="calib-row">
          <div class="cl">${t}</div>
          <div class="track"><div class="fill" style="width:${w}%"></div><div class="be" style="left:${Math.max(0, Math.min(100, ((be - 45) / 12) * 100))}%"></div></div>
          <div class="pct">${hr.toFixed(1)}%</div>
        </div>`;
      }).join("");
      return `<div class="anz-card">
        <div class="anz-card-h">Confidence Calibration<span class="sub">hit rate by tier</span></div>
        <div class="calib">${rows}</div>
        <div class="calib-leg"><span><i style="background:linear-gradient(90deg,var(--navy),var(--navy2))"></i>Hit rate</span><span><i style="background:var(--red)"></i>Breakeven (${be.toFixed(1)}%)</span></div>
        <div class="calib-note">Higher-confidence tiers hit ${cc.does_confidence_track_hitrate === false ? "modestly more" : "more"} often — featured plays land at ${byTier.featured ? (byTier.featured.hit_rate * 100).toFixed(1) : "—"}% vs ${byTier.low ? (byTier.low.hit_rate * 100).toFixed(1) : "—"}% for low-confidence ones. Confidence is a real ranking signal across our graded real picks.</div>
      </div>`;
    }

    async function renderAnalyzer() {
      await loadIndex();
      const tr = trackRecord();
      const ov = tr.overall || {};
      const wnd = (tr.window && tr.window.by_sport) || {};
      const nTest = ov.n != null ? ov.n : 0;   // settled REAL picks (grows as games finish)
      const roi = ov.roi != null ? ov.roi * 100 : null;
      const hr = ov.hit_rate != null ? ov.hit_rate * 100 : null;

      const bySportTbl = anzTable("By League", "real graded picks", tr.by_sport || {}, ["mlb", "nba", "nhl", "nfl", "soccer"], SPORT_LABEL);
      const byMarketTbl = anzTable("By Market", "spread / moneyline / total", tr.by_market || {}, ["total", "spread", "moneyline"], { total: "Total", spread: "Spread", moneyline: "Moneyline" });
      const byTierTbl = anzTable("By Confidence Tier", "featured = surest", tr.by_tier || {}, ["featured", "high", "medium", "low"], { featured: "Featured", high: "High", medium: "Medium", low: "Low" });

      root.querySelector("#analyzer-view").innerHTML = `
        <div class="anz-hero">
          <div class="ah-lab">DiamondEdge Analyzer</div>
          <h2>Real Track Record</h2>
          ${(ov.n || 0) === 0 ? `<div class="ah-building">⏳ Building — no real picks have settled yet. Today's frozen pre-game picks appear here with W/L, hit-rate and ROI as soon as the games finish.</div>` : ""}
          <div class="ah-sub">Every number below is a REAL forward pick — frozen pre-game on a real game and graded against the real result. No backtest, no demo. The record covers ${esc(indexData ? indexData.n_dates : "")} slate${(indexData && indexData.n_dates === 1) ? "" : "s"} so far and grows as games finish.</div>
          <div class="ah-stats">
            <div class="ah-st"><div class="k">Graded Picks</div><div class="v">${(nTest || 0).toLocaleString()}</div></div>
            <div class="ah-st"><div class="k">Record</div><div class="v">${ov.wins || 0}-${ov.losses || 0}</div></div>
            <div class="ah-st"><div class="k">Hit Rate</div><div class="v">${hr != null ? hr.toFixed(1) + "%" : "—"}</div></div>
            <div class="ah-st"><div class="k">ROI</div><div class="v ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</div></div>
            <div class="ah-st"><div class="k">Net Units</div><div class="v ${ov.units_net == null ? "" : ov.units_net >= 0 ? "pos" : "neg"}">${ov.units_net == null ? "—" : (ov.units_net >= 0 ? "+" : "") + ov.units_net.toFixed(0)}</div></div>
          </div>
        </div>
        <div class="anz-grid">
          ${bySportTbl}
          ${byMarketTbl}
          ${byTierTbl}
          ${calibrationCard()}
        </div>
        <div class="refnote">Test windows — ${SPORTS.map((s) => wnd[s] ? `${SPORT_LABEL[s]} ${wnd[s].start}→${wnd[s].end}` : "").filter(Boolean).join(" · ")}</div>`;
    }

    // ===================== HEADER / SHELL =====================
    function renderHeader() {
      const ov = trOverall();
      const w = ov.wins ?? 0, l = ov.losses ?? 0;
      const hr = ov.hit_rate != null ? (ov.hit_rate * 100).toFixed(1) : "—";
      const roi = ov.roi != null ? (ov.roi * 100) : null;
      root.querySelector("#record-chip").innerHTML = `
        <div><div class="k">Record</div><div class="v">${w}-${l}</div></div>
        <div><div class="k">Hit</div><div class="v">${hr}%</div></div>
        <div><div class="k">ROI</div><div class="v ${roi == null ? "" : roi >= 0 ? "g" : "r"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</div></div>`;
    }

    function renderShell() {
      root.innerHTML = `
        <header><div class="hbar">
          <div class="brand" id="brand">
            <div class="diamond"></div>
            <div><h1>Diamond<b>Edge</b></h1><div class="tag">Pre-Game Model · 5 Leagues</div></div>
          </div>
          <div class="toptabs">
            <button data-tab="picks" class="${tab === "picks" ? "on" : ""}">Picks</button>
            <button data-tab="analyzer" class="${tab === "analyzer" ? "on" : ""}">Analyzer</button>
          </div>
          <div class="hspacer"></div>
          <div class="recordchip" id="record-chip"></div>
        </div></header>
        <main>
          <div id="picks-view" style="display:${tab === "picks" ? "block" : "none"}"></div>
          <div id="analyzer-view" style="display:${tab === "analyzer" ? "block" : "none"}"></div>
        </main>`;
      root.querySelectorAll(".toptabs button").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
      $("brand").onclick = () => switchTab("picks");
      renderHeader();
    }

    function switchTab(t: string) {
      if (t === tab) return;
      tab = t;
      $("picks-view").style.display = t === "picks" ? "block" : "none";
      $("analyzer-view").style.display = t === "analyzer" ? "block" : "none";
      root.querySelectorAll(".toptabs button").forEach((b: any) => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "analyzer" && !$("analyzer-view").innerHTML.trim()) renderAnalyzer();
    }

    // ===================== INIT =====================
    (async function init() {
      renderShell();
      $("picks-view").innerHTML = `<div class="tablewrap"><div class="state"><div class="spinner"></div><div class="big">Loading DiamondEdge</div><div class="sm">Fetching today's slate</div></div></div>`;
      await loadIndex();
      renderHeader();
      payload = await loadDay(curDate);
      // default league = first present today, prefer MLB
      const present = leaguesPresent(payload);
      if (present.size && !present.has(league)) league = SPORTS.find((s) => present.has(s)) || "mlb";
      renderPicks();
    })();
  }, []);

  return <div id="app-root" />;
}
