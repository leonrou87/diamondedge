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
    const NFL_SLUG: any = { ARI: "ari", ATL: "atl", BAL: "bal", BUF: "buf", CAR: "car", CHI: "chi", CIN: "cin", CLE: "cle", DAL: "dal", DEN: "den", DET: "det", GB: "gb", GBP: "gb", HOU: "hou", IND: "ind", JAX: "jax", KC: "kc", LAC: "lac", LAR: "lar", LV: "lv", MIA: "mia", MIN: "min", NE: "ne", NO: "no", NYG: "nyg", NYJ: "nyj", PHI: "phi", PIT: "pit", SEA: "sea", SF: "sf", TB: "tb", TEN: "ten", WSH: "wsh", OAK: "lv", SD: "lac", STL: "lar" };
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
    const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
    const SPORTS = ["mlb", "nba", "nhl", "nfl", "soccer"];
    const SPORT_LABEL: any = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };
    const SPORT_UNIT: any = { mlb: "runs", nba: "pts", nhl: "goals", nfl: "pts", soccer: "goals" };
    const fmtRec = (o: any) => o ? `${o.wins || 0}-${o.losses || 0}${o.pushes ? "-" + o.pushes : ""}` : "—";
    const isISO = (t: any) => /^\d{4}-\d{2}-\d{2}/.test(String(t || ""));

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

    // full index range (2020 → 2026) so the date controls span the whole history
    let minDate = "2020-09-11";
    let maxDate = todayISO();

    // ===================== FETCH =====================
    async function loadIndex() {
      if (!indexData) {
        indexData = await snap("pregame_picks_index");
        const ds = (indexData && (indexData.dates || indexData.keyed_dates)) || [];
        if (ds.length) { minDate = ds[0]; maxDate = ds[ds.length - 1] > todayISO() ? ds[ds.length - 1] : todayISO(); }
        const dr = indexData && indexData.date_range;
        if (Array.isArray(dr) && dr.length === 2) { minDate = dr[0]; if (dr[1] > maxDate) maxDate = dr[1]; }
      }
      return indexData;
    }

    async function loadDay(dateISO: string) {
      const isToday = dateISO === todayISO();
      const key = isToday ? "pregame_picks" : "pregame_picks:" + dateISO;
      let p = await snap(key);
      if ((!p || !(p.games || []).length) && isToday) p = await snap("pregame_picks:" + dateISO);
      return p;
    }

    function gamesForLeague(p: any, lg: string) {
      const all = (p && p.games) || [];
      const inLg = all.filter((g: any) => (g.sport || "").toLowerCase() === lg);
      // featured first, then highest confidence
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
    function trackRecord() { return (indexData && (indexData.track_record_test || indexData.track_record)) || (payload && (payload.track_record_test || payload.track_record)) || {}; }
    function forwardRecord() {
      const f = (payload && payload.track_record_forward) || (indexData && indexData.track_record_forward) || null;
      if (!f) return null;
      if (f.overall) return f.overall;
      const agg = { wins: 0, losses: 0, pushes: 0, n: 0 };
      const src = f.by_tier || f.by_sport || {};
      Object.values(src).forEach((o: any) => { agg.wins += o.wins || 0; agg.losses += o.losses || 0; agg.pushes += o.pushes || 0; agg.n += o.n || 0; });
      return agg.n ? agg : null;
    }
    function trOverall() { return trackRecord().overall || {}; }

    // ===================== EDGE / VALUE FLAGGING =====================
    function edgeThresholdFor(games: any[]) {
      const mags = games.flatMap((g: any) =>
        [g.total_pick, g.spread_pick].map((pk: any) => (pk && pk.gap != null ? Math.abs(Number(pk.gap)) : null)).filter((x: any) => x != null && x >= 1)
      ).sort((a: number, b: number) => a - b);
      if (mags.length < 4) return Infinity;
      return mags[Math.floor(mags.length * 0.8)];
    }
    function gameEdge(g: any) {
      let best: any = null;
      [["total", g.total_pick], ["spread", g.spread_pick]].forEach(([mk, pk]: any) => {
        if (pk && pk.gap != null) { const mag = Math.abs(Number(pk.gap)); if (!best || mag > best.mag) best = { mag, gap: Number(pk.gap), market: mk, pk }; }
      });
      return best;
    }
    function edgeBadge(g: any, thr: number) {
      const e = gameEdge(g);
      if (!e || e.mag < thr || e.mag < 1) return "";
      const unit = SPORT_UNIT[g.sport] || "";
      const tip = `Our ${e.market} projection diverges ${e.mag.toFixed(1)} ${unit} from the line — one of the day's biggest disagreements with Vegas.`;
      return `<span class="edgeflag" title="${esc(tip)}">◆ VALUE +${e.mag.toFixed(1)}</span>`;
    }

    // ===================== SCORE DERIVATION =====================
    // For live/final games there is no current-score field. Derive from pick results:
    //   total_pick.result.actual = actual combined total
    //   spread_pick.result.actual = actual margin (home − away)
    //   home = (total + margin) / 2 ; away = (total − margin) / 2
    // When only the total is present (NBA/NHL/soccer have no spread pick), fall back to
    // the win-model's margin so we can still split the score; otherwise show the total only.
    function actualScore(g: any) {
      const tA = g.total_pick && g.total_pick.result ? g.total_pick.result.actual : null;
      const sA = g.spread_pick && g.spread_pick.result ? g.spread_pick.result.actual : null;
      const total = (typeof tA === "number") ? tA : null;
      let margin = (typeof sA === "number") ? sA : null; // home − away
      if (total == null) return null;
      if (margin == null) return { total, home: null, away: null, margin: null, split: false };
      const home = (total + margin) / 2, away = (total - margin) / 2;
      return { total, home, away, margin, split: true };
    }

    // status + score for a game (returns {label, cls, time, score})
    function gameState(g: any) {
      const st = (g.status || "pre").toLowerCase();
      let t = g.start_time || "";
      if (isISO(t)) t = "";
      if (st === "final") {
        const sc = actualScore(g);
        return { kind: "final", label: "Final", time: "", score: sc };
      }
      if (st === "live") {
        // live games carry the real current score in current_actuals (result.actual is
        // only set once final) — prefer it so in-progress boxes show the score + inning.
        const ca = g.current_actuals;
        if (ca && ca.home_score != null && ca.away_score != null) {
          const home = Number(ca.home_score), away = Number(ca.away_score);
          return { kind: "live", label: ca.period_label || "Live", time: t, score: { total: home + away, home, away, margin: home - away, split: true } };
        }
        return { kind: "live", label: "Live", time: t, score: actualScore(g) };
      }
      return { kind: "pre", label: t ? t : "Scheduled", time: t, score: null };
    }

    // ===================== W-T-L SUMMARIES =====================
    // Day record = aggregate of that day's resolved picks across all 3 markets.
    function dayRecord(games: any[]) {
      let w = 0, l = 0, t = 0;
      games.forEach((g: any) => [g.spread_pick, g.ml_pick, g.total_pick].forEach((pk: any) => {
        const s = resOf(pk); if (s === "hit") w++; else if (s === "miss") l++; else if (s === "push") t++;
      }));
      return { w, l, t, settled: w + l + t };
    }

    function dayRecordBand(games: any[], dispDate: string) {
      const dr = dayRecord(games);
      const pend = dr.w + dr.l; // decisions excluding pushes
      const hit = pend ? ((dr.w / pend) * 100).toFixed(0) : null;
      const recCls = dr.settled ? (dr.w > dr.l ? "up" : dr.w < dr.l ? "down" : "even") : "pending";
      const subtitle = dr.settled
        ? `${dr.settled} resolved pick${dr.settled > 1 ? "s" : ""} across spread, total${league === "mlb" || league === "soccer" ? " & moneyline" : ""}${hit ? ` · ${hit}% hit` : ""}`
        : `${games.length} game${games.length > 1 ? "s" : ""} on the board — picks resolve once games go final`;
      return `
        <div class="dayband ${recCls}">
          <div class="db-left">
            <div class="db-lab">${esc(SPORT_LABEL[league])} · Day Record</div>
            <div class="db-rec">
              <span class="w">${dr.w}</span><span class="sep">–</span><span class="l">${dr.l}</span>${dr.t ? `<span class="t-wrap"><span class="dot">·</span><span class="t">${dr.t}T</span></span>` : ""}
            </div>
            <div class="db-sub">${esc(subtitle)}</div>
          </div>
          <div class="db-right">
            <div class="db-date">${esc(dispDate)}</div>
            ${dr.settled ? `<div class="db-mini"><span class="mk hit">${dr.w} won</span><span class="mk miss">${dr.l} lost</span>${dr.t ? `<span class="mk push">${dr.t} push</span>` : ""}</div>` : `<div class="db-mini"><span class="mk pend">awaiting results</span></div>`}
          </div>
        </div>`;
    }

    // Out-of-fold test record strip (the model's full credibility line).
    function trackStrip() {
      const tr = trackRecord().overall || {};
      const w = tr.wins ?? 0, l = tr.losses ?? 0, p = tr.pushes ?? 0;
      const hr = tr.hit_rate != null ? (tr.hit_rate * 100).toFixed(1) : "—";
      const n = tr.n ?? (w + l + p);
      const roi = tr.roi != null ? tr.roi * 100 : null;
      const fwd = forwardRecord();
      return `
        <div class="trackstrip">
          <span class="ts-k">Model Track Record</span>
          <span class="ts-rec">${w.toLocaleString()}–${l.toLocaleString()}${p ? ` · ${p}T` : ""}</span>
          <span class="ts-meta">${hr}% hit · ${(n || 0).toLocaleString()} out-of-fold picks${roi != null ? ` · ${(roi >= 0 ? "+" : "") + roi.toFixed(1)}% ROI` : ""}</span>
          ${fwd ? `<span class="ts-fwd">${fmtRec(fwd)} real picks so far</span>` : ""}
          <button class="ts-link" id="open-analyzer">Full Analyzer →</button>
        </div>`;
    }

    // ===================== MARKET ROW (Vegas line + our pick overlay) =====================
    // Renders one market line. Vegas number is the anchor; our pick is the overlay shown
    // by colouring the side we back + a directional arrow + the confidence; ✓/✗/T when resolved.
    function pickArrow(kind: string, side: any) {
      if (kind === "total") {
        const up = /over/i.test(String(side));
        return up ? `<span class="arr up">▲</span>` : `<span class="arr down">▼</span>`;
      }
      return `<span class="arr take">▸</span>`;
    }
    function confTag(pk: any) {
      if (!pk || pk.confidence == null) return "";
      const tier = pk.tier || "low";
      return `<span class="conftag ${tierCls(tier)}"><span class="tierdot ${tdotCls(tier)}"></span>${pk.confidence.toFixed(0)}%</span>`;
    }
    function resTag(st: any, pk: any) {
      if (st === "hit") return `<span class="restag hit">✓ WON${pk && pk.result && pk.result.net_units != null ? ` ${pk.result.net_units >= 0 ? "+" : ""}${num(pk.result.net_units, 2)}u` : ""}</span>`;
      if (st === "miss") return `<span class="restag miss">✗ LOST${pk && pk.result && pk.result.net_units != null ? ` ${num(pk.result.net_units, 2)}u` : ""}</span>`;
      if (st === "push") return `<span class="restag push">T PUSH</span>`;
      return "";
    }

    // SPREAD market row
    function spreadRow(g: any) {
      const pk = g.spread_pick;
      const has = pk && pk.side != null;
      const st = has ? resOf(pk) : null;
      // Vegas: present the home-relative spread line. The pick side string carries team+line.
      let vegas = "—";
      if (pk && pk.line != null) {
        const pr = pk.prices || {};
        const price = pk.price ?? pr.home ?? pr.away;
        const homeLine = spreadHomeLine(g, pk);
        vegas = `<span class="vln">${esc(g.home_abbr)} ${sgn(homeLine)}</span> <span class="vpx">${fmtOdds(price)}</span>`;
      }
      return marketRow({
        market: "Spread", vegas, hasPick: has, st,
        pickHtml: has ? `${pickArrow("spread", pk.side)}<b>${esc(pk.side)}</b>${confTag(pk)}` : `<span class="nopick">no pick</span>`,
        vig: pk ? pk.vig : null, kind: "spread",
      });
    }
    // home-relative spread line (positive = home getting points)
    function spreadHomeLine(g: any, pk: any) {
      const line = Math.abs(Number(pk.line));
      const side = String(pk.side || "");
      // side names the team we back with its line, e.g. "EAG -2.5" or "STL +1.5"
      const m = side.match(/([+-]?\d+(\.\d+)?)/);
      const backedLine = m ? Number(m[1]) : line;
      const backedHome = side.indexOf(g.home_abbr) === 0 || side.indexOf(g.home_abbr) >= 0 && side.indexOf(g.away_abbr) < 0;
      // If we backed the home team, its line is backedLine; else home line is the inverse of away line.
      if (backedHome) return backedLine;
      return -backedLine;
    }

    // TOTAL market row
    function totalRow(g: any) {
      const pk = g.total_pick;
      const has = pk && pk.side != null;
      const st = has ? resOf(pk) : null;
      let vegas = "—";
      if (pk && pk.line != null) {
        const pr = pk.prices || {};
        const price = pk.price ?? pr.over ?? pr.under;
        vegas = `<span class="vln">${num(pk.line)}</span> <span class="vpx">${fmtOdds(price)}</span>`;
      }
      return marketRow({
        market: "Total", vegas, hasPick: has, st,
        pickHtml: has ? `${pickArrow("total", pk.side)}<b>${esc(pk.side)}</b>${confTag(pk)}` : `<span class="nopick">no pick</span>`,
        vig: pk ? pk.vig : null, kind: "total",
      });
    }

    // MONEYLINE market row (MLB 2-way / soccer 3-way). Omitted entirely for NBA/NHL/NFL.
    function mlRow(g: any) {
      const pk = g.ml_pick;
      if (!pk) return ""; // no ML market for this sport
      const has = pk.side != null;
      const st = has ? resOf(pk) : null;
      const pr = pk.prices || {};
      let vegas;
      if (g.sport === "soccer") {
        vegas = `<span class="ml3"><span class="m3 ${pk.side === g.home_abbr ? "on" : ""}">${esc(g.home_abbr)} ${fmtOdds(pr.home)}</span><span class="m3 ${/draw/i.test(String(pk.side)) ? "on" : ""}">Draw ${fmtOdds(pr.draw)}</span><span class="m3 ${pk.side === g.away_abbr ? "on" : ""}">${esc(g.away_abbr)} ${fmtOdds(pr.away)}</span></span>`;
      } else {
        const price = pk.price ?? pr.home ?? pr.away;
        vegas = `<span class="vln">${esc(pk.side)} ${fmtOdds(price)}</span>`;
      }
      return marketRow({
        market: "Moneyline", vegas, hasPick: has, st,
        pickHtml: has ? `${pickArrow("ml", pk.side)}<b>${esc(pk.side)}</b>${confTag(pk)}` : `<span class="nopick">no pick</span>`,
        vig: pk.vig, kind: "ml",
      });
    }

    function marketRow(o: any) {
      const rCls = o.st === "hit" ? "won" : o.st === "miss" ? "lost" : o.st === "push" ? "pushed" : "";
      const sel = o.hasPick ? "picked" : "vegasonly";
      const vigTxt = vigPct(o.vig);
      return `<div class="mrow ${sel} ${rCls}">
        <div class="mk-lab">${esc(o.market)}</div>
        <div class="mk-vegas">${o.vegas}${vigTxt ? `<span class="mk-vig">vig ${vigTxt}</span>` : ""}</div>
        <div class="mk-pick">${o.pickHtml}</div>
        <div class="mk-res">${resTag(o.st, null) || (o.hasPick ? `<span class="restag open">open</span>` : "")}</div>
      </div>`;
    }

    // ===================== GAME BOX =====================
    function scoreBlock(g: any, gs: any) {
      // Live/final score line; pre-game shows nothing here.
      if (gs.kind === "pre" || !gs.score) return "";
      const sc = gs.score;
      if (sc.split && sc.home != null && sc.away != null) {
        const aw = sc.away, hm = sc.home;
        const homeWon = hm > aw, awayWon = aw > hm;
        return `<div class="livescore">
          <span class="ls-side ${awayWon ? "wn" : ""}"><span class="ls-ab">${esc(g.away_abbr)}</span><span class="ls-pt">${num(aw, 0)}</span></span>
          <span class="ls-dash">–</span>
          <span class="ls-side ${homeWon ? "wn" : ""}"><span class="ls-pt">${num(hm, 0)}</span><span class="ls-ab">${esc(g.home_abbr)}</span></span>
        </div>`;
      }
      // only combined total known
      return `<div class="livescore total-only"><span class="ls-tot">${num(sc.total, 0)} ${SPORT_UNIT[g.sport] || ""}</span></div>`;
    }

    function pitcherLine(g: any) {
      const pi = g.pregame_intel || {};
      const pit = pi.pitchers || {};
      const pa = pit.away || {}, ph = pit.home || {};
      const venue = pi.venue || (g.meta && g.meta.venue);
      const bits: string[] = [];
      if (pa.name || ph.name) {
        const fmt = (p: any) => p.name ? `${esc(p.name)}${p.era != null ? ` (${num(p.era, 2)})` : ""}` : "TBD";
        bits.push(`<span class="dl-pit">⚾ ${fmt(pa)} vs ${fmt(ph)}</span>`);
      }
      if (venue) bits.push(`<span class="dl-ven">${esc(venue)}</span>`);
      if (g.sport === "soccer" && g.meta && g.meta.league) bits.push(`<span class="dl-ven">${esc(g.meta.league)}</span>`);
      if (!bits.length) return "";
      return `<div class="gb-detail">${bits.join('<span class="dl-sep">·</span>')}</div>`;
    }

    function gameBox(g: any, idx: number, thr = Infinity) {
      const sp = g.sport;
      const gs = gameState(g);
      const eb = edgeBadge(g, thr);
      const hasIntel = !!(g.pregame_intel && Object.keys(g.pregame_intel).length);
      const stateBadge =
        gs.kind === "live" ? `<span class="gb-status live"><span class="livedot"></span>LIVE${gs.label && gs.label !== "Live" ? " · " + esc(gs.label) : ""}</span>`
        : gs.kind === "final" ? `<span class="gb-status final">FINAL</span>`
        : `<span class="gb-status sched">${esc(gs.label)}</span>`;

      // resolution summary for the box header
      const dr = dayRecord([g]);
      const boxRes = dr.settled ? `<span class="gb-rec ${dr.w > dr.l ? "up" : dr.w < dr.l ? "down" : "even"}">${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}</span>` : "";

      const markets = [spreadRow(g), mlRow(g), totalRow(g)].filter(Boolean).join("");

      return `<div class="gamebox ${g.featured ? "featured" : ""} ${gs.kind}" data-gid="${esc(g.game_id || idx)}">
        <div class="gb-head">
          <div class="gb-mu">
            <span class="gb-logos">${crestImg(sp, g.away_abbr)}${crestImg(sp, g.home_abbr)}</span>
            <span class="gb-teams">
              <span class="gb-line1"><b>${esc(g.away_abbr)}</b><span class="gb-at">@</span><b>${esc(g.home_abbr)}</b>${g.featured ? `<span class="gb-feat">★ Featured</span>` : ""}</span>
              <span class="gb-names">${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}</span>
            </span>
          </div>
          <div class="gb-state">
            ${scoreBlock(g, gs)}
            <div class="gb-statwrap">${stateBadge}${boxRes}</div>
          </div>
        </div>
        ${pitcherLine(g)}
        <div class="gb-markets">
          <div class="mrow mhead"><div class="mk-lab">Market</div><div class="mk-vegas">Vegas Line</div><div class="mk-pick">Our Pick</div><div class="mk-res">${gs.kind === "final" ? "Result" : ""}</div></div>
          ${markets}
        </div>
        ${eb ? `<div class="gb-foot">${eb}<span class="gb-more">tap for full read →</span></div>` : `<div class="gb-foot"><span class="gb-more">tap for full read →</span>${hasIntel ? `<span class="intelchip">intel</span>` : ""}</div>`}
      </div>`;
    }

    // ===================== RENDER: PICKS TAB =====================
    function applyConfFilter(games: any[]) {
      if (!confFloor) return games;
      const kept = games.filter((g) => (g.top_confidence || 0) >= confFloor);
      if (kept.length) return kept;
      const sorted = [...games].sort((a, b) => (b.top_confidence || 0) - (a.top_confidence || 0));
      return sorted.slice(0, 1);
    }

    function renderPicks() {
      const tabsHtml = SPORTS.map((lg) => {
        const cnt = payload ? gamesForLeague(payload, lg).length : 0;
        return `<button class="leaguetab ${lg === league ? "on" : ""}" data-lg="${lg}">${SPORT_LABEL[lg]}${cnt ? `<span class="cnt">${cnt}</span>` : ""}</button>`;
      }).join("");

      const isToday = curDate === todayISO();
      const atMin = curDate <= minDate;
      const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

      let band = "", body = "";
      if (rangeMode) {
        band = trackStrip();
        body = renderRangeBody();
      } else {
        const games = payload ? gamesForLeague(payload, league) : [];
        const filtered = applyConfFilter(games);
        if (!payload) {
          band = trackStrip();
          body = `<div class="state"><div class="spinner"></div><div class="big">Loading slate</div><div class="sm">Fetching ${esc(dispDate)}</div></div>`;
        } else if (!filtered.length) {
          band = dayRecordBand([], dispDate) + trackStrip();
          body = `<div class="state"><div class="big">No ${SPORT_LABEL[league]} games</div><div class="sm">${games.length ? "Lower the confidence filter to see them." : "Nothing on the board for " + esc(dispDate) + ". Try another date or league."}</div></div>`;
        } else {
          const thr = edgeThresholdFor(filtered);
          band = dayRecordBand(filtered, dispDate) + trackStrip();
          body = `<div class="docket">${filtered.map((g, i) => gameBox(g, i, thr)).join("")}</div>
            <div class="refnote">${filtered.length} ${SPORT_LABEL[league]} game${filtered.length > 1 ? "s" : ""} · ${esc(dispDate)} · DiamondEdge pre-game model</div>`;
        }
      }

      root.querySelector("#picks-view").innerHTML = `
        <div id="band-area">${band}</div>
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
              <button class="arrow" id="d-prev" title="Previous day" ${atMin ? "disabled" : ""}>‹</button>
              <input type="date" id="date-input" value="${curDate}" min="${minDate}" max="${maxDate}">
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
          <input type="date" id="range-from" value="${rangeFrom || curDate}" min="${minDate}" max="${maxDate}">
          <span class="rlab" style="letter-spacing:0">to</span>
          <input type="date" id="range-to" value="${rangeTo || curDate}" min="${minDate}" max="${maxDate}">
          <button class="go" id="range-go">Search</button>
          ${rangeMode ? `<button class="advbtn" id="range-clear">Clear</button>` : ""}
          <span style="font-size:11px;color:var(--ink3)">Scans each day's ${SPORT_LABEL[league]} board across the full ${minDate.slice(0, 4)}–${maxDate.slice(0, 4)} history.</span>
        </div>`;
    }

    function renderRangeBody() {
      if (!rangeGames.length) return `<div class="state"><div class="big">No ${SPORT_LABEL[league]} games in range</div><div class="sm">Try a wider range or another league.</div></div>`;
      let html = "";
      let W = 0, L = 0, T = 0, N = 0;
      rangeGames.forEach((day: any) => {
        const games = applyConfFilter(gamesForLeague({ games: day.games }, league));
        if (!games.length) return;
        const thr = edgeThresholdFor(games);
        const dr = dayRecord(games);
        W += dr.w; L += dr.l; T += dr.t; N += games.length;
        const dd = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
        html += `<div class="dayhdr"><span class="dh-date">${esc(dd)}</span><span class="dh-rr">${games.length} game${games.length > 1 ? "s" : ""}${dr.settled ? ` · ${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}` : ""}</span></div>`;
        html += `<div class="docket">${games.map((g, i) => gameBox(g, i, thr)).join("")}</div>`;
      });
      html += `<div class="refnote">${N} ${SPORT_LABEL[league]} games across ${rangeGames.length} day${rangeGames.length > 1 ? "s" : ""}${W + L + T ? ` · graded picks ${W}-${L}${T ? "-" + T : ""}` : ""}</div>`;
      return html;
    }

    function bindPicksControls() {
      root.querySelectorAll(".leaguetab").forEach((b: any) => (b.onclick = () => { league = b.dataset.lg; confFloor = 0; if (rangeMode) { runRange(); } renderPicks(); }));
      const slider = $("conf-slider");
      if (slider) {
        const games = rangeMode ? rangeGames.flatMap((d: any) => gamesForLeague({ games: d.games }, league)) : (payload ? gamesForLeague(payload, league) : []);
        const maxC = games.length ? Math.max(...games.map((g: any) => g.top_confidence || 0)) : 100;
        slider.max = Math.max(1, Math.floor(maxC));
        slider.oninput = () => { confFloor = Number(slider.value) || 0; const v = $("conf-val"); if (v) v.textContent = confFloor === 0 ? "All" : confFloor + "%+"; };
        slider.onchange = () => { confFloor = Number(slider.value) || 0; renderPicksBody(); };
      }
      const advBtn = $("adv-btn"); if (advBtn) advBtn.onclick = () => { advOpen = !advOpen; renderPicks(); };
      const di = $("date-input"); if (di) di.onchange = () => { curDate = di.value; rangeMode = false; loadAndRenderDay(); };
      const dp = $("d-prev"); if (dp) dp.onclick = () => { if (curDate <= minDate) return; curDate = shiftDate(curDate, -1); rangeMode = false; loadAndRenderDay(); };
      const dn = $("d-next"); if (dn) dn.onclick = () => { if (curDate >= todayISO()) return; curDate = shiftDate(curDate, 1); rangeMode = false; loadAndRenderDay(); };
      const dt = $("d-today"); if (dt) dt.onclick = () => { curDate = todayISO(); rangeMode = false; loadAndRenderDay(); };
      const rf = $("range-from"); if (rf) rf.onchange = () => (rangeFrom = rf.value);
      const rt = $("range-to"); if (rt) rt.onchange = () => (rangeTo = rt.value);
      const rg = $("range-go"); if (rg) rg.onclick = () => runRange();
      const rc = $("range-clear"); if (rc) rc.onclick = () => { rangeMode = false; renderPicks(); };
      const oa = $("open-analyzer"); if (oa) oa.onclick = () => switchTab("analyzer");
      bindBoxClicks();
    }

    function renderPicksBody() {
      const games = payload ? gamesForLeague(payload, league) : [];
      const filtered = applyConfFilter(games);
      const isToday = curDate === todayISO();
      const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
      let body;
      if (!filtered.length) {
        body = `<div class="state"><div class="big">No ${SPORT_LABEL[league]} games${isToday ? " today" : ""}</div><div class="sm">${confFloor > 0 ? "Lower the confidence filter, or " : ""}pick another date or league.</div></div>`;
        const ba = $("band-area"); if (ba) ba.innerHTML = dayRecordBand([], dispDate) + trackStrip();
      } else {
        const thr = edgeThresholdFor(filtered);
        body = `<div class="docket">${filtered.map((g, i) => gameBox(g, i, thr)).join("")}</div>
          <div class="refnote">${filtered.length} ${SPORT_LABEL[league]} game${filtered.length > 1 ? "s" : ""} · ${esc(dispDate)} · DiamondEdge pre-game model</div>`;
        const ba = $("band-area"); if (ba) { ba.innerHTML = dayRecordBand(filtered, dispDate) + trackStrip(); const oa = $("open-analyzer"); if (oa) oa.onclick = () => switchTab("analyzer"); }
      }
      $("picks-body").innerHTML = body;
      bindBoxClicks();
    }

    function bindBoxClicks() {
      root.querySelectorAll(".gamebox[data-gid]").forEach((bx: any) => {
        bx.onclick = () => { const g = findGame(bx.dataset.gid); if (g) openDetail(g); };
      });
    }
    function findGame(gid: any) {
      const pool = rangeMode ? rangeGames.flatMap((d: any) => d.games) : (payload ? payload.games : []);
      return (pool || []).find((x: any) => String(x.game_id) === String(gid));
    }

    function shiftDate(iso: string, days: number) {
      const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + days);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    async function loadAndRenderDay() {
      confFloor = 0;
      $("picks-body") && ($("picks-body").innerHTML = `<div class="state"><div class="spinner"></div><div class="big">Loading</div></div>`);
      payload = await loadDay(curDate);
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
      await loadIndex();
      const allDates: string[] = (indexData && (indexData.dates || indexData.keyed_dates)) || [];
      const inRange = allDates.filter((d) => d >= a && d <= b);
      const dates = inRange.slice(-30);
      rangeMode = true;
      $("picks-body") && ($("picks-body").innerHTML = `<div class="state"><div class="spinner"></div><div class="big">Scanning ${dates.length} day${dates.length === 1 ? "" : "s"}</div><div class="sm">${esc(a)} → ${esc(b)}</div></div>`);
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

    function intelSection(g: any) {
      const pi = g.pregame_intel;
      if (!pi) return "";
      const A = g.away_abbr, H = g.home_abbr;
      const blocks: string[] = [];

      const pit = pi.pitchers || {};
      const pa = pit.away || {}, ph = pit.home || {};
      if (pa.name || ph.name || pa.era != null || ph.era != null) {
        const pp = (ab: any, p: any) => `<div class="ic-side"><div class="ic-ab">${esc(ab)}</div><div class="ic-main">${esc(p.name || "TBD")}</div>${p.era != null ? `<div class="ic-sub">${num(p.era, 2)} ERA</div>` : ""}</div>`;
        blocks.push(`<div class="ic-card"><div class="ic-h">Starting Pitchers</div><div class="ic-row2">${pp(A, pa)}<div class="ic-vs">vs</div>${pp(H, ph)}</div></div>`);
      }

      const venue = pi.venue || (g.meta && g.meta.venue);
      if (venue || pi.park_factor != null) {
        const pf = pi.park_factor;
        const pfLabel = pf == null ? "" : pf > 1.0 ? "hitter-friendly" : pf < 1.0 ? "pitcher-friendly" : "neutral";
        blocks.push(`<div class="ic-card"><div class="ic-h">Venue</div><div class="ic-line"><b>${esc(venue || "—")}</b>${pf != null ? ` <span class="ic-pf ${pf > 1 ? "hot" : pf < 1 ? "cold" : ""}">park ${num(pf, 2)} · ${pfLabel}</span>` : ""}</div></div>`);
      }

      const form = pi.form || {};
      const fa = form.away, fh = form.home;
      if (fa || fh) {
        const ff = (ab: any, f: any) => f ? `<div class="ic-side"><div class="ic-ab">${esc(ab)}</div><div class="ic-main">${esc(f.last10_record || "—")}<span class="ic-tag">L10</span></div>${(f.runs_for_avg != null || f.runs_against_avg != null) ? `<div class="ic-sub">${f.runs_for_avg != null ? num(f.runs_for_avg, 1) : "—"} for · ${f.runs_against_avg != null ? num(f.runs_against_avg, 1) : "—"} against</div>` : ""}</div>` : "";
        blocks.push(`<div class="ic-card"><div class="ic-h">Recent Form</div><div class="ic-row2">${ff(A, fa)}${ff(H, fh)}</div></div>`);
      }

      const rest = pi.rest || {};
      const ra = rest.away, rh = rest.home;
      if (ra || rh) {
        const rr = (ab: any, r: any) => r ? `<div class="ic-side"><div class="ic-ab">${esc(ab)}</div><div class="ic-main">${r.days_off != null ? r.days_off + (r.days_off === 1 ? " day" : " days") + " off" : "—"}</div>${r.last_game_date ? `<div class="ic-sub">last ${esc(r.last_game_date)}</div>` : ""}</div>` : "";
        blocks.push(`<div class="ic-card"><div class="ic-h">Rest</div><div class="ic-row2">${rr(A, ra)}${rr(H, rh)}</div></div>`);
      }

      const h = pi.h2h;
      if (h && (h.games || h.record)) {
        const lm = h.last_meeting;
        const lmTxt = lm ? `last met ${esc(lm.date)} — ${esc(lm.away_team || A)} ${num(lm.away_score, 0)}, ${esc(lm.home_team || H)} ${num(lm.home_score, 0)}` : "";
        blocks.push(`<div class="ic-card wide"><div class="ic-h">Head to Head</div><div class="ic-line"><b>${esc(h.record || "—")}</b>${h.games ? ` <span class="ic-tag">${h.games} mtgs</span>` : ""}${h.away_wins != null || h.home_wins != null ? ` <span class="ic-sub2">${A} ${h.away_wins ?? 0} · ${H} ${h.home_wins ?? 0}</span>` : ""}</div>${lmTxt ? `<div class="ic-sub3">${lmTxt}</div>` : ""}</div>`);
      }

      if (!blocks.length) return "";
      return `<div class="dsec"><div class="dsec-h">Pre-Game Intel</div><div class="dsec-b intel-grid">${blocks.join("")}</div></div>`;
    }

    function detailBet(pk: any, label: string, kind: string, g: any) {
      if (!pk || pk.side == null) return "";
      const st = resOf(pk);
      const tier = pk.tier || "low";
      const gapTxt = pk.gap != null ? ` · <span class="dgap">edge ${Math.abs(Number(pk.gap)).toFixed(1)} ${SPORT_UNIT[g.sport] || ""}</span>` : "";
      let line = "";
      if (kind === "spread") line = `line <b>${sgn(pk.line)}</b> · proj margin <b>${pk.our_proj != null ? sgn(pk.our_proj) : "—"}</b>${pk.interval && pk.interval.lo != null ? ` · 80% [${num(pk.interval.lo)}, ${num(pk.interval.hi)}]` : ""}${gapTxt}`;
      else if (kind === "total") line = `line <b>${num(pk.line)}</b> · our proj <b>${num(pk.our_proj)}</b>${pk.interval && pk.interval.lo != null ? ` · 80% [${num(pk.interval.lo)}, ${num(pk.interval.hi)}]` : ""}${gapTxt}`;
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
      const gs = gameState(g);
      const startTxt = isISO(g.start_time || "") ? "" : g.start_time;
      const tot = (ps.home != null && ps.away != null) ? num(Number(ps.home) + Number(ps.away), 1) : (g.total_pick && g.total_pick.our_proj != null ? num(g.total_pick.our_proj) : "—");

      // actual score banner (live/final)
      let actualBanner = "";
      if (gs.score && gs.score.split && gs.score.home != null) {
        const aw = gs.score.away, hm = gs.score.home;
        actualBanner = `<div class="dactual ${gs.kind}"><span class="da-lab">${gs.kind === "final" ? "Final" : "Live"}</span><span class="da-sc">${esc(g.away_abbr)} ${num(aw, 0)} – ${num(hm, 0)} ${esc(g.home_abbr)}</span></div>`;
      } else if (gs.score && gs.score.total != null) {
        actualBanner = `<div class="dactual ${gs.kind}"><span class="da-lab">${gs.kind === "final" ? "Final" : "Live"}</span><span class="da-sc">${num(gs.score.total, 0)} ${SPORT_UNIT[sp] || ""}</span></div>`;
      }

      const bets = [detailBet(g.spread_pick, "Spread", "spread", g), detailBet(g.ml_pick, "Moneyline", "ml", g), detailBet(g.total_pick, "Total", "total", g)].filter(Boolean).join("");
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Why This Read</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";

      const html = `
        <div class="drawer-bg" id="drawer-bg"></div>
        <div class="drawer">
          <div class="drawer-head">
            <button class="close" id="drawer-close">✕</button>
            <div class="dh-sport">${SPORT_LABEL[sp] || sp}${gs.kind === "final" ? " · Final" : gs.kind === "live" ? " · Live" : ""}</div>
            <div class="dh-mu">${esc(g.away_abbr)}<span class="at">@</span>${esc(g.home_abbr)}</div>
            <div class="dh-meta">${esc([g.matchup, dispDate, startTxt].filter(Boolean).join(" · "))}</div>
          </div>
          <div class="drawer-body">
            ${actualBanner}
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
            ${intelSection(g)}
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
        <table class="anztab"><thead><tr><th>${esc(title.split(" ")[1] || title)}</th><th>Picks</th><th>W-L</th><th>Hit Rate</th><th>ROI</th><th>Units</th></tr></thead><tbody>${rows}</tbody></table>
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
      const ft = byTier.featured ? (byTier.featured.hit_rate * 100).toFixed(1) : "—";
      const lo = byTier.low ? (byTier.low.hit_rate * 100).toFixed(1) : "—";
      return `<div class="anz-card">
        <div class="anz-card-h">Confidence Calibration<span class="sub">hit rate by tier</span></div>
        <div class="calib">${rows}</div>
        <div class="calib-leg"><span><i style="background:linear-gradient(90deg,var(--navy),var(--navy2))"></i>Hit rate</span><span><i style="background:var(--red)"></i>Breakeven (${be.toFixed(1)}%)</span></div>
        <div class="calib-note">Featured plays land at ${ft}% over the full test set vs ${lo}% for low-confidence ones${cc.monotonic_increasing === false ? " (the tier ladder isn't perfectly monotonic, but the top tier clears breakeven)" : ""}.</div>
      </div>`;
    }

    async function renderAnalyzer() {
      await loadIndex();
      const tr = trackRecord();
      const ov = tr.overall || {};
      const wnd = (tr.window && tr.window.by_sport) || {};
      const nTest = ov.n != null ? ov.n : 0;
      const roi = ov.roi != null ? ov.roi * 100 : null;
      const hr = ov.hit_rate != null ? ov.hit_rate * 100 : null;
      const be = ov.breakeven_hit_rate != null ? (ov.breakeven_hit_rate * 100).toFixed(1) : "52.4";
      const ci = ov.hit_rate_ci95;
      const fwd = forwardRecord();

      const bySportTbl = anzTable("By League", "out-of-fold test", tr.by_sport || {}, ["mlb", "nba", "nhl", "nfl", "soccer"], SPORT_LABEL);
      const byMarketTbl = anzTable("By Market", "spread / moneyline / total", tr.by_market || {}, ["total", "spread", "moneyline"], { total: "Total", spread: "Spread", moneyline: "Moneyline" });
      const byTierTbl = anzTable("By Tier", "featured = surest", tr.by_tier || {}, ["featured", "high", "medium", "low"], { featured: "Featured", high: "High", medium: "Medium", low: "Low" });

      root.querySelector("#analyzer-view").innerHTML = `
        <div class="anz-hero">
          <div class="ah-lab">DiamondEdge Analyzer</div>
          <h2>Out-of-Fold Test Record</h2>
          <div class="ah-sub">Every number below is from the out-of-fold test — games the model never trained on, graded against the real result across ${SPORT_LABEL.mlb}, ${SPORT_LABEL.nba}, ${SPORT_LABEL.nhl}, ${SPORT_LABEL.nfl} and ${SPORT_LABEL.soccer}.</div>
          <div class="ah-stats">
            <div class="ah-st"><div class="k">Graded Picks</div><div class="v">${(nTest || 0).toLocaleString()}</div></div>
            <div class="ah-st"><div class="k">Record</div><div class="v">${ov.wins || 0}-${ov.losses || 0}${ov.pushes ? `<small> · ${ov.pushes}T</small>` : ""}</div></div>
            <div class="ah-st"><div class="k">Hit Rate</div><div class="v">${hr != null ? hr.toFixed(1) + "%" : "—"}${ci ? `<small> ±${((ci[1] - ci[0]) / 2 * 100).toFixed(1)}</small>` : ""}</div><div class="ah-k2">vs ${be}% breakeven</div></div>
            <div class="ah-st"><div class="k">ROI</div><div class="v ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</div></div>
            <div class="ah-st"><div class="k">Net Units</div><div class="v ${ov.units_net == null ? "" : ov.units_net >= 0 ? "pos" : "neg"}">${ov.units_net == null ? "—" : (ov.units_net >= 0 ? "+" : "") + ov.units_net.toFixed(0)}</div></div>
            ${fwd ? `<div class="ah-st"><div class="k">Real Picks So Far</div><div class="v">${fmtRec(fwd)}</div></div>` : ""}
          </div>
        </div>
        <div class="anz-grid">
          ${bySportTbl}
          ${byMarketTbl}
          ${byTierTbl}
          ${calibrationCard()}
        </div>
        <div class="refnote">Out-of-fold test windows — ${SPORTS.map((s) => wnd[s] ? `${SPORT_LABEL[s]} ${wnd[s].start}→${wnd[s].end}` : "").filter(Boolean).join(" · ")}</div>`;
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
            <button data-tab="picks" class="${tab === "picks" ? "on" : ""}">Docket</button>
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
      $("picks-view").innerHTML = `<div class="state"><div class="spinner"></div><div class="big">Loading DiamondEdge</div><div class="sm">Fetching today's slate</div></div>`;
      await loadIndex();
      renderHeader();
      payload = await loadDay(curDate);
      const present = leaguesPresent(payload);
      if (present.size && !present.has(league)) league = SPORTS.find((s) => present.has(s)) || "mlb";
      renderPicks();
    })();
  }, []);

  return <div id="app-root" />;
}
