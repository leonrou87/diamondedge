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
    const soccerFlag = (ab: any) => `https://a.espncdn.com/i/teamlogos/countries/500/${String(ab || "").toLowerCase()}.png`;
    const logoFor = (sp: string, ab: any) =>
      sp === "soccer" ? soccerFlag(ab)
      : sp === "nba" ? nbaLogo(ab)
      : sp === "nhl" ? nhlLogo(ab)
      : sp === "nfl" ? nflLogo(ab)
      : mlbLogo(ab);

    // ===================== HELPERS =====================
    const $ = (id: string) => document.getElementById(id) as any;
    const esc = (s: any) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]));
    const num = (v: any, d = 1) => (v == null || isNaN(Number(v)) ? "—" : Number(v).toFixed(d));
    const sgn = (v: any, d = 1) => { if (v == null || isNaN(Number(v))) return "—"; const n = Number(v); return (n > 0 ? "+" : "") + n.toFixed(d); };
    const fmtOdds = (o: any) => { if (o == null || o === "") return "—"; const n = Number(o); if (isNaN(n)) return "—"; if (n >= 100 || n <= -100) return n > 0 ? "+" + Math.round(n) : "" + Math.round(n); const am = n >= 2 ? Math.round((n - 1) * 100) : Math.round(-100 / (n - 1)); return am > 0 ? "+" + am : "" + am; };
    const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
    const SPORTS = ["mlb", "nba", "nhl", "nfl", "soccer"];
    const SPORT_LABEL: any = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };
    const SPORT_ICON: any = { mlb: "⚾", nba: "🏀", nhl: "🏒", nfl: "🏈", soccer: "⚽" };
    const SPORT_UNIT: any = { mlb: "runs", nba: "points", nhl: "goals", nfl: "points", soccer: "goals" };
    const isISO = (t: any) => /^\d{4}-\d{2}-\d{2}/.test(String(t || ""));
    const isTS = (t: any) => /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(String(t || ""));
    const REDUCE = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const TZ_ABBR = (() => {
      try {
        const p = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" }).formatToParts(new Date());
        const z = p.find((x) => x.type === "timeZoneName");
        return z ? z.value : "";
      } catch { return ""; }
    })();
    // Localize a start time for display. Prefer `start_ts` (real ISO-8601 UTC) → viewer's TZ.
    function startInfo(g: any) {
      const ts = g.start_ts;
      const raw = g.start_time || "";
      if (isTS(ts)) {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
          const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          return { time: `${time}${TZ_ABBR ? " " + TZ_ABBR : ""}`, date, iso: true, hasTime: true };
        }
      }
      if (isTS(raw)) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
          const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
          return { time: `${time}${TZ_ABBR ? " " + TZ_ABBR : ""}`, date, iso: true, hasTime: true };
        }
      }
      if (raw && !isISO(raw)) return { time: raw, date: "", iso: false, hasTime: true };
      if (isISO(raw)) {
        const d = new Date(raw + "T12:00:00");
        const date = isNaN(d.getTime()) ? String(raw) : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        return { time: "", date, iso: false, hasTime: false };
      }
      return { time: "", date: "", iso: false, hasTime: false };
    }
    // The calendar day a game belongs to, in the VIEWER's timezone (today-view housekeeping only).
    function gameLocalDay(g: any) {
      const tsSrc = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
      if (tsSrc) {
        const d = new Date(tsSrc);
        if (!isNaN(d.getTime())) return d.toLocaleDateString("en-CA");
      }
      const raw = String(g.date || "").slice(0, 10);
      return isISO(raw) ? raw : null;
    }

    async function snap(k: string) {
      const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(k)}&select=payload`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
      const rows = await r.json();
      return rows && rows[0] ? rows[0].payload : null;
    }

    // crest markup: served logo URL (soccer home_logo/away_logo) → sport CDN / country
    // flag → text crest. Soccer images degrade to the text crest on load error.
    function crestImg(sp: string, ab: any, cls = "", exUrl?: any) {
      const url = (typeof exUrl === "string" && /^https?:\/\//.test(exUrl) ? exUrl : null) || logoFor(sp, ab);
      if (!url) return `<span class="crest ${cls}">${esc((ab || "").slice(0, 3))}</span>`;
      if (sp === "soccer") {
        const fb = `<span class=&quot;crest ${cls}&quot;>${esc((ab || "").slice(0, 3))}</span>`;
        return `<img class="${cls}" src="${url}" onerror="this.onerror=null;this.outerHTML='${fb}'" alt="" loading="lazy">`;
      }
      return `<img class="${cls}" src="${url}" onerror="this.style.visibility='hidden'" alt="" loading="lazy">`;
    }
    const gCrest = (g: any, which: "home" | "away", cls = "") =>
      crestImg(g.sport, which === "home" ? g.home_abbr : g.away_abbr, cls, which === "home" ? g.home_logo : g.away_logo);

    const resOf = (pk: any) => (pk && pk.result && pk.result.status ? pk.result.status : null); // hit|miss|push|null
    const tierCls = (t: any) => "tier-" + (t || "low");

    // ===================== SUGGESTED ACTIONS (fallback source for plays) =====================
    // A game carries `suggested_action` only on the live MLB slate. status SUGGEST → surfaced;
    // status ABSTAIN → silent. HOUSE RULE: the hit-rate NEVER renders without the price/ROI.
    const saOf = (g: any) => {
      const sa = g && g.suggested_action;
      return sa && sa.status === "SUGGEST" ? sa : null;
    };
    const saPct = (p: any, d = 0) => (p == null || isNaN(Number(p)) ? "—" : (Number(p) * 100).toFixed(d) + "%");
    const saAm = (p: any) => (p == null || isNaN(Number(p)) ? "—" : (Number(p) > 0 ? "+" + Number(p) : "" + Number(p)));
    function saTrack() {
      const t = (payload && payload.suggested_actions_track_record) || {};
      return {
        v24: t.val_2024 || { n: 590, hit: 0.641, roi: -0.013 },
        t25: t.test_2025 || { n: 605, hit: 0.617, roi: -0.047 },
        g26: t.gate_2026 || { n: 299, hit: 0.602, hit_ci95: [0.545, 0.656], roi: -0.069 },
        fwd: t.forward || null,
        base: t.baseline_blind_dog15_2026 || { hit: 0.582, roi: -0.043 },
      };
    }
    const saRecStr = (sa: any) => (sa && sa.record_3yr) || "64.1% / 61.7% / 60.2% (2024/2025/2026)";
    function saBreakeven(sa: any) {
      const h = sa && sa.honesty;
      if (h && h.breakeven_at_price != null) return Number(h.breakeven_at_price);
      const am = sa && sa.price != null ? Number(sa.price) : null;
      if (am == null || isNaN(am) || Math.abs(am) < 100) return 0.648;
      const net = am > 0 ? am / 100 : 100 / Math.abs(am);
      return 1 / (1 + net);
    }

    // ===================== PLAYS (normalized per game, per market) =====================
    const MARKETS = ["spread", "total", "moneyline"];
    const MK_FULL: any = { spread: "Spread", total: "Total", moneyline: "Moneyline" };

    function normPlayResult(r: any) {
      if (!r) return null;
      let st = r.status || null;
      if (!st) st = r.push === true ? "push" : r.won === true ? "hit" : r.won === false ? "miss" : null;
      if (st === "won") st = "hit"; if (st === "lost") st = "miss";
      if (st !== "hit" && st !== "miss" && st !== "push") return null;
      const pnl = r.pnl != null ? Number(r.pnl) : (r.net_units != null ? Number(r.net_units) : null);
      return { status: st, pnl };
    }
    // Plain-number bullets for a fallback suggested_action play (power-user detail only).
    function saWhy(sa: any) {
      const w: string[] = [];
      if (sa.model_p_cover != null && sa.market_p_cover != null)
        w.push(`Model has ${sa.side} covering ${saPct(sa.model_p_cover, 1)} of the time vs the market's implied ${saPct(sa.market_p_cover, 1)}.`);
      const p = sa.p_correct != null ? sa.p_correct : sa.meta_p;
      if (p != null) w.push(`The model puts this play at ${saPct(p, 1)} to cash.`);
      if (sa.price != null) w.push(`${saAm(sa.price)} needs ${saPct(saBreakeven(sa), 1)} to break even; 3-yr hit ${saRecStr(sa)} at ~−184 avg.`);
      if (sa.n_books) w.push(`Priced across ${sa.n_books} sportsbook${sa.n_books > 1 ? "s" : ""}.`);
      return w;
    }
    function normPlay(raw: any, mk: string) {
      if (!raw || typeof raw !== "object") return null;
      const action = String(raw.action || "").toUpperCase() === "TAKE" ? "TAKE" : "PASS";
      const vt = raw.tier === "value-a" || raw.tier === "value-b" ? raw.tier : null;
      return {
        market: mk, action,
        side: raw.side != null ? String(raw.side) : null,
        line: raw.line != null ? Number(raw.line) : null,
        price: raw.price != null ? raw.price : null,
        p: raw.p_correct != null ? Number(raw.p_correct) : (raw.meta_p != null ? Number(raw.meta_p) : null),
        tier: raw.confidence_tier || null,
        value_tier: vt,
        paper: raw.paper === true,
        claimed_ev: raw.claimed_ev != null ? Number(raw.claimed_ev) : null,
        edge: raw.edge != null ? Number(raw.edge) : null,
        nlines: raw.mm_tot_nlines != null ? Number(raw.mm_tot_nlines) : null,
        p_model_over: raw.p_model_over != null ? Number(raw.p_model_over) : null,
        p_mkt_over: raw.p_mkt_over != null ? Number(raw.p_mkt_over) : null,
        shop: raw.shop || null,
        latest_read: raw.latest_read && typeof raw.latest_read === "object" ? raw.latest_read : null,
        why: Array.isArray(raw.why) ? raw.why : [],
        result: normPlayResult(raw.result),
        src: "de",
      };
    }
    function gamePlays(g: any) {
      const out: any = {};
      const de = g && g.de_plays;
      if (de && typeof de === "object") {
        MARKETS.forEach((mk) => { out[mk] = normPlay(de[mk], mk) || { market: mk, action: "PASS", side: null, line: null, price: null, p: null, tier: null, why: [], result: null, src: "de" }; });
        return out;
      }
      MARKETS.forEach((mk) => { out[mk] = { market: mk, action: "PASS", side: null, line: null, price: null, p: null, tier: null, why: [], result: null, src: "fb" }; });
      const sa = saOf(g);
      if (sa) {
        out.spread = {
          market: "spread", action: "TAKE",
          side: sa.side != null ? String(sa.side) : null,
          line: sa.line != null ? Number(sa.line) : null,
          price: sa.price != null ? sa.price : null,
          p: sa.p_correct != null ? Number(sa.p_correct) : (sa.meta_p != null ? Number(sa.meta_p) : null),
          tier: sa.confidence_tier || null,
          why: saWhy(sa),
          result: normPlayResult(sa.result),
          src: "sa", sa,
        };
      }
      return out;
    }
    // Live clarity for a TAKE: an OVER that's already passed the line is clinched; an UNDER
    // that's been passed is gone. Everything else in a live game is simply "in play".
    function playLiveState(g: any, pl: any) {
      if ((g.status || "").toLowerCase() !== "live" || pl.action !== "TAKE") return null;
      if (pl.market === "total" && g.current_actuals && g.current_actuals.total_so_far != null) {
        const line = pl.line != null ? pl.line : (() => { const m = String(pl.side || "").match(/(\d+(\.\d+)?)/); return m ? Number(m[1]) : null; })();
        if (line != null) {
          const t = Number(g.current_actuals.total_so_far);
          const over = /over/i.test(String(pl.side));
          if (t > line) return over ? "clinch-won" : "clinch-lost";
        }
      }
      return "inplay";
    }
    // Final score for grading: graded pick actuals first, live-score overlay second.
    function finalScore(g: any) {
      const sc = actualScore(g);
      if (sc) return sc;
      const ca = g.current_actuals;
      if (ca && ca.home_score != null && ca.away_score != null) {
        const h = Number(ca.home_score), a = Number(ca.away_score);
        return { total: h + a, home: h, away: a, margin: h - a, split: true };
      }
      if (ca && ca.total_so_far != null) return { total: Number(ca.total_so_far), home: null, away: null, margin: null, split: false };
      return null;
    }
    // A finished game whose pick isn't graded yet (the big payload lags the live
    // scores) still resolves visually — grade it provisionally off the final score.
    function provisionalResult(g: any, pl: any) {
      if ((g.status || "").toLowerCase() !== "final" || pl.action !== "TAKE") return null;
      const sc = finalScore(g);
      if (!sc) return null;
      const sideLine = () => { const m = String(pl.side || "").match(/([+-]?\d+(\.\d+)?)/); return m ? Number(m[1]) : null; };
      if (pl.market === "total" && sc.total != null) {
        const line = pl.line != null ? Number(pl.line) : sideLine();
        if (line == null) return null;
        const over = /over/i.test(String(pl.side));
        if (sc.total === line) return { status: "push", pnl: null };
        return { status: (sc.total > line) === over ? "hit" : "miss", pnl: null };
      }
      const side = String(pl.side || "");
      const backedHome = side.indexOf(g.home_abbr) >= 0 && side.indexOf(g.away_abbr) < 0;
      const backedAway = side.indexOf(g.away_abbr) >= 0 && side.indexOf(g.home_abbr) < 0;
      if (sc.margin == null || (!backedHome && !backedAway)) return null;
      if (pl.market === "spread") {
        const line = sideLine() != null ? sideLine() : (pl.line != null ? Number(pl.line) : null);
        if (line == null) return null;
        const adj = (backedHome ? sc.margin : -sc.margin) + line!;
        return adj === 0 ? { status: "push", pnl: null } : { status: adj > 0 ? "hit" : "miss", pnl: null };
      }
      if (pl.market === "moneyline") {
        if (sc.margin === 0) return { status: "push", pnl: null };
        return { status: (backedHome ? sc.margin > 0 : sc.margin < 0) ? "hit" : "miss", pnl: null };
      }
      return null;
    }
    // A play's display state: won|lost|pushed|clinched|cooked|inplay|open
    function playState(g: any, pl: any) {
      const r = pl.result || provisionalResult(g, pl);
      if (r) return r.status === "hit" ? "won" : r.status === "miss" ? "lost" : "pushed";
      const live = playLiveState(g, pl);
      return live === "clinch-won" ? "clinched" : live === "clinch-lost" ? "cooked" : live === "inplay" ? "inplay" : "open";
    }

    // ===================== ONE QUALITY VOCABULARY: Strong / Good / Lean =====================
    // Every bet the app recommends gets exactly one plain word (and 1-3 filled diamonds):
    //   Strong = the winning-recipe tier A, or the model's surest (featured) tier
    //   Good   = recipe tier B, or a high-confidence pick
    //   Lean   = everything else the model likes enough to flag
    // Percentages and tier jargon stay off the primary surfaces.
    function qualityOf(pl: any) {
      if (!pl || pl.action !== "TAKE") return null;
      if (pl.q === "strong" || pl.q === "good" || pl.q === "lean") return pl.q; // served quality wins
      if (pl.value_tier === "value-a" || pl.tier === "featured") return "strong";
      if (pl.value_tier === "value-b" || pl.tier === "high") return "good";
      return "lean";
    }
    const Q_LABEL: any = { strong: "Strong", good: "Good", lean: "Lean" };
    const Q_RANK: any = { strong: 0, good: 1, lean: 2 };
    const qDiamonds = (q: any) => {
      const n = q === "strong" ? 3 : q === "good" ? 2 : 1;
      let h = "";
      for (let i = 0; i < 3; i++) h += `<i class="${i < n ? "f" : ""}">◆</i>`;
      return `<span class="qdia q-${q}" aria-hidden="true">${h}</span>`;
    };
    // Gold = the headline plays: any winning-recipe (VALUE) play + the surest accuracy tier.
    const isGold = (pl: any) => !!pl && pl.action === "TAKE" && (pl.value_tier || pl.tier === "featured");
    // The ONE bet we surface for a game: gold first, then quality, then confidence.
    function orderedTakes(g: any, P?: any) {
      const plays = P || gamePlays(g);
      const prio: any = { total: 0, spread: 1, moneyline: 2 };
      return MARKETS.map((mk) => plays[mk])
        .filter((p: any) => p.action === "TAKE")
        .sort((a: any, b: any) =>
          ((isGold(b) ? 1 : 0) - (isGold(a) ? 1 : 0)) ||
          ((a.value_tier === "value-a" ? 0 : 1) - (b.value_tier === "value-a" ? 0 : 1)) ||
          (Q_RANK[qualityOf(a)] - Q_RANK[qualityOf(b)]) ||
          ((b.p || 0) - (a.p || 0)) ||
          (prio[a.market] - prio[b.market]));
    }
    const bestPlay = (g: any) => orderedTakes(g)[0] || null;

    const condCheck = `<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path class="chk" d="M2.5 8.5l3.4 3.4L13.5 4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    // The two trigger conditions of a recipe (VALUE) play, with live values off the payload.
    function valueConds(pl: any) {
      const gapPts = pl.edge != null ? Math.abs(Number(pl.edge)) * 100 : null;
      const need = pl.value_tier === "value-b" ? 2 : 3;
      const over = /over/i.test(String(pl.side || ""));
      const pm = pl.p_model_over != null ? (over ? pl.p_model_over : 1 - pl.p_model_over) : null;
      const pk = pl.p_mkt_over != null ? (over ? pl.p_mkt_over : 1 - pl.p_mkt_over) : null;
      return {
        gap: gapPts != null ? `Model edge +${gapPts.toFixed(1)} pts` : "Model vs market gap",
        gapSub: pm != null && pk != null ? `model ${(pm * 100).toFixed(1)}% vs market ${(pk * 100).toFixed(1)}%` : "",
        need,
        split: pl.nlines != null ? `Books split across ${pl.nlines} lines` : "Books split on the line",
      };
    }

    // Live "latest read" pill — power-user detail inside the sheet only.
    function latestReadPill(g: any, pl: any) {
      const lr = pl && pl.latest_read;
      if (!lr || typeof lr !== "object" || (g.status || "pre").toLowerCase() !== "pre") return "";
      const st = String(lr.status || "").toLowerCase();
      const cls = st === "strengthening" ? "up" : st === "fading" ? "down" : "hold";
      const arrow = st === "strengthening" ? "↑" : st === "fading" ? "↓" : "→";
      const word = st === "strengthening" || st === "fading" ? st : "holding";
      const mins = lr.minutes_to_start != null && !isNaN(Number(lr.minutes_to_start)) ? Math.max(0, Math.round(Number(lr.minutes_to_start))) : null;
      const toGo = mins != null ? ` · ${mins >= 100 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`} to ${g.sport === "mlb" ? "first pitch" : "start"}` : "";
      return `<span class="lread ${cls}" title="Latest model read — the graded morning play is unchanged."><i>latest read</i><b class="lr-x">${arrow} ${esc(word)}${esc(toGo)}</b></span>`;
    }

    // ===================== PREMIUM / FREEMIUM (design-complete; payments stubbed) =====================
    // Entitlement is one localStorage flag `de_premium` — DEFAULT true (premium-assumed).
    // STRIPE WIRE-IN POINT: a real flow replaces setPremium(true) in the Upgrade page's
    // Subscribe handler with: POST /api/checkout → Stripe Checkout Session → redirect →
    // webhook confirms the subscription → entitlement served with the payload/session.
    const isPremium = () => { try { return localStorage.getItem("de_premium") !== "0"; } catch { return true; } };
    const setPremium = (v: boolean) => { try { localStorage.setItem("de_premium", v ? "1" : "0"); } catch {} };
    // Free mode locks the SIDE/LINE of pending Strong/Good picks only. Graded picks and
    // the whole record stay visible (the record IS the ad); Leans and PASSes stay free.
    function pickLocked(pl: any, st: string) {
      if (!pl || isPremium()) return false;
      const q = qualityOf(pl);
      if (q !== "strong" && q !== "good") return false;
      return !(st === "won" || st === "lost" || st === "pushed");
    }
    const lockSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;

    // ===================== STATE =====================
    let tab = "today";              // "today" | "games" | "results" | "settings" | "upgrade"
    const TABS = ["today", "games", "results", "settings", "upgrade"];
    let league = "mlb";             // selected league
    let curDate = todayISO();       // selected date (ISO)
    let histOpen = false;           // history range panel open
    let rangeFrom = "", rangeTo = "";
    let rangeMode = false;          // showing range results
    let rangeGames: any[] = [];     // {date,games}
    let payload: any = null;        // current day's payload
    let livePayload: any = null;    // the live board (today's key) — cached for past-day merges
    let indexData: any = null;      // pregame_picks_index
    let detail: any = null;         // open detail game
    let liveScores: any = null;     // latest live_scores snapshot (fresh score overlay)
    let analyticsDeep: any = null;  // analytics_deep block (deep results cuts) when served
    let adTried = false;            // analytics_deep lookup attempted this session

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
      if (isToday) {
        livePayload = p;
      } else {
        // Recent past days: the daily snapshot freezes mid-day (stale "live" statuses,
        // ungraded plays). The live board's finals tail carries the SAME games fully
        // graded — swap those in by game_id when the dates match.
        if (!livePayload) { try { livePayload = await snap("pregame_picks"); } catch {} }
        const tail: any = {};
        (((livePayload && livePayload.games) || []) as any[]).forEach((g: any) => { if (g && g.game_id != null) tail[String(g.game_id)] = g; });
        if (p && Array.isArray(p.games)) {
          p = { ...p, games: p.games.map((g: any) => {
            const t = tail[String(g.game_id)];
            return t && String(t.date || "").slice(0, 10) === String(g.date || "").slice(0, 10) ? t : g;
          }) };
        }
      }
      return p;
    }

    // ===================== LIVE-SCORE OVERLAY (live_scores key) =====================
    // A tiny `live_scores` snapshot refreshes every ~60-75s during game windows — far
    // fresher than the ~30-min pregame payload. When present (and not older than the
    // payload), its score/status/period overlays the tiles + sheet and flips tile
    // states pre→live→final without waiting for the big payload. Degrades silently
    // when the key doesn't exist.
    function applyLiveScores() {
      if (!liveScores || !liveScores.games || !payload) return false;
      const pu = Date.parse(payload.generated_at || "") || 0;
      const lu = Date.parse(liveScores.updated_at || "") || 0;
      if (pu && lu && lu < pu) return false; // the big payload is newer — trust it
      let changed = false;
      ((payload.games || []) as any[]).forEach((g: any) => {
        const ls = liveScores.games[String(g.game_id)] || (g.game_pk != null ? liveScores.games[String(g.game_pk)] : null);
        if (!ls) return;
        const st = String(ls.status || "").toLowerCase();
        if ((st === "pre" || st === "live" || st === "final") && st !== String(g.status || "pre").toLowerCase()) { g.status = st; changed = true; }
        if (ls.home_score != null && ls.away_score != null) {
          const ca = g.current_actuals || (g.current_actuals = {});
          if (ca.home_score !== ls.home_score || ca.away_score !== ls.away_score || (ls.period_label != null && ca.period_label !== ls.period_label)) changed = true;
          ca.home_score = ls.home_score; ca.away_score = ls.away_score;
          if (ls.period_label != null) ca.period_label = ls.period_label;
          ca.total_so_far = ls.total_so_far != null ? ls.total_so_far : Number(ls.home_score) + Number(ls.away_score);
        }
      });
      return changed;
    }
    // Poll only while it matters: games tab, today's board, and something live (or
    // starting within 15 min). Paused while the tab is hidden.
    function liveWindowActive() {
      if (tab !== "games" || rangeMode || !payload || curDate !== todayISO()) return false;
      const now = Date.now();
      return ((payload.games || []) as any[]).some((g: any) => {
        const st = String(g.status || "pre").toLowerCase();
        if (st === "live") return true;
        if (st !== "pre") return false;
        const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
        if (!ts) return false;
        const dt = new Date(ts).getTime() - now;
        return dt <= 15 * 60 * 1000 && dt > -12 * 3600 * 1000;
      });
    }
    async function pollLiveScores() {
      if (document.hidden || !liveWindowActive()) return;
      let ls: any = null;
      try { ls = await snap("live_scores"); } catch {}
      if (!ls || !ls.games) return;
      const fresh = !liveScores || ls.updated_at !== liveScores.updated_at;
      liveScores = ls;
      if (!fresh) return;
      if (!applyLiveScores()) return;
      if (tab === "games" && !rangeMode) renderSlate(true);
      if (detail && detail.game_id != null) refreshSheetScore(detail);
    }
    // Update an open sheet's score banner in place (no re-render, keeps scroll).
    function refreshSheetScore(g: any) {
      const sheet = $("sheet"); if (!sheet) return;
      const gs = gameState(g);
      const el = sheet.querySelector(".sh-score");
      if (el && gs.score && gs.score.split && gs.score.home != null) {
        el.className = `sh-score ${gs.kind}`;
        el.innerHTML = `<span class="shs-side"><span class="shs-ab">${esc(g.away_abbr)}</span><b>${num(gs.score.away, 0)}</b></span>
          <span class="shs-mid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label)}`}</span>
          <span class="shs-side"><b>${num(gs.score.home, 0)}</b><span class="shs-ab">${esc(g.home_abbr)}</span></span>`;
      }
    }

    function gamesForLeague(p: any, lg: string, dateISO?: string) {
      const forDate = dateISO || curDate;
      const all = (p && p.games) || [];
      let inLg = all.filter((g: any) => (g.sport || "").toLowerCase() === lg);
      // PAST/KEYED dates: the daily snapshots are captures of the whole live board, which
      // carries a long finals tail from OTHER days (even other years). A selected date must
      // show EXACTLY that date's games — trust the payload's own `date` field (the backend
      // writes it in the slate's home timezone), never re-derive via the viewer's timezone.
      if (rangeMode || forDate !== todayISO()) {
        const payloadDate = String((p && p.date) || "").slice(0, 10);
        inLg = inLg.filter((g: any) => {
          const gd = String(g.date || "").slice(0, 10);
          if (isISO(gd)) return gd === forDate;
          return payloadDate === forDate; // no per-game date: trust the day key's own date
        });
      }
      // Today view: a real day slate. Pre games from today onward (the WC board includes
      // tomorrow's fixtures), live games only if plausibly still live (no timestamp, or started
      // within the last 12h — the payload carries stale "live" zombies from prior days), and
      // finals only when they finaled today (local day == viewer's today).
      if (!rangeMode && curDate === todayISO()) {
        const t = todayISO();
        inLg = inLg.filter((g: any) => {
          const st = (g.status || "pre").toLowerCase();
          if (st === "pre") { const d = gameLocalDay(g); return !d || d >= t; }
          if (st === "live") {
            const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
            if (ts) {
              const age = Date.now() - new Date(ts).getTime();
              return isNaN(age) || age < 12 * 3600 * 1000;
            }
            const d = gameLocalDay(g);
            return !d || d >= shiftDate(t, -1); // no timestamp: trust the date, allow overnight
          }
          return gameLocalDay(g) === t;
        });
      }
      // Sports-app order: LIVE first, then upcoming by start time, then finals.
      const ord: any = { live: 0, pre: 1, final: 2 };
      inLg.sort((a: any, b: any) => {
        const d = (ord[(a.status || "pre").toLowerCase()] ?? 1) - (ord[(b.status || "pre").toLowerCase()] ?? 1);
        if (d) return d;
        const ta = String(a.start_ts || a.start_time || ""), tb = String(b.start_ts || b.start_time || "");
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      });
      return inLg;
    }

    // Pick the first league that actually has games on the current date.
    function bestLeague() {
      if (!payload) return league;
      if (gamesForLeague(payload, league).length) return league;
      return SPORTS.find((s) => gamesForLeague(payload, s).length) || league;
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
    // The validated recipe history (58.1% over 886 graded bets, 2022-2026) off the payload.
    function recipeHistory() {
      const vh = payload && payload.value_record && payload.value_record.validated_history;
      const mp = (vh && vh.median_price) || {};
      return {
        hit: mp.hit != null ? Number(mp.hit) : 0.581,
        roi: mp.roi != null ? Number(mp.roi) : 0.108,
        n: vh && vh.bets_graded ? Number(vh.bets_graded) : 886,
      };
    }

    // ===================== SCORE DERIVATION =====================
    function actualScore(g: any) {
      const tA = g.total_pick && g.total_pick.result ? g.total_pick.result.actual : null;
      const sA = g.spread_pick && g.spread_pick.result ? g.spread_pick.result.actual : null;
      const total = (typeof tA === "number") ? tA : null;
      const margin = (typeof sA === "number") ? sA : null; // home − away
      if (total == null) return null;
      if (margin == null) return { total, home: null, away: null, margin: null, split: false };
      const home = (total + margin) / 2, away = (total - margin) / 2;
      return { total, home, away, margin, split: true };
    }
    function gameState(g: any) {
      const st = (g.status || "pre").toLowerCase();
      const si = startInfo(g);
      const t = si.time || si.date || "";
      if (st === "final") {
        let sc = actualScore(g);
        // Overlay-flipped finals may not have graded pick results yet — use the live score.
        if (!sc) {
          const ca = g.current_actuals;
          if (ca && ca.home_score != null && ca.away_score != null) {
            const h = Number(ca.home_score), a = Number(ca.away_score);
            sc = { total: h + a, home: h, away: a, margin: h - a, split: true };
          }
        }
        return { kind: "final", label: "Final", time: "", score: sc, si };
      }
      if (st === "live") {
        const ca = g.current_actuals;
        if (ca && ca.home_score != null && ca.away_score != null) {
          const home = Number(ca.home_score), away = Number(ca.away_score);
          return { kind: "live", label: ca.period_label || "Live", time: t, score: { total: home + away, home, away, margin: home - away, split: true }, si };
        }
        return { kind: "live", label: "Live", time: t, score: actualScore(g), si };
      }
      return { kind: "pre", label: t || "Scheduled", time: t, score: null, si };
    }

    // ===================== MICRO-INTERACTIONS =====================
    function animateCounters(scope: any) {
      const els = scope.querySelectorAll("[data-count]");
      els.forEach((el: any) => {
        const target = parseFloat(el.dataset.count);
        if (isNaN(target)) return;
        const dec = Number(el.dataset.dec || 0);
        const suf = el.dataset.suf || "";
        const loc = el.dataset.loc === "1";
        const fmt = (v: number) => (loc ? Math.round(v).toLocaleString() : v.toFixed(dec)) + suf;
        if (REDUCE) { el.textContent = fmt(target); return; }
        const dur = 750, t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(target * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
    // Pull-to-refresh (touch): pull down from the top of the games feed to reload the day.
    let ptrBound = false;
    function bindPull() {
      if (ptrBound) return; ptrBound = true;
      let y0: any = null, pull = 0, on = false;
      document.addEventListener("touchstart", (e: any) => {
        if (window.scrollY <= 0 && tab === "games" && !detail) { y0 = e.touches[0].clientY; on = true; pull = 0; }
      }, { passive: true });
      document.addEventListener("touchmove", (e: any) => {
        if (!on || y0 == null) return;
        const el = $("ptr"); if (!el) return;
        const d = e.touches[0].clientY - y0;
        pull = Math.max(0, Math.min(88, d * 0.42));
        el.style.height = pull + "px";
        el.classList.toggle("ready", pull > 58);
      }, { passive: true });
      document.addEventListener("touchend", async () => {
        if (!on) return; on = false;
        const el = $("ptr");
        if (pull > 58 && el) {
          el.classList.add("go");
          payload = await loadDay(curDate);
          renderSlate();
        }
        if (el) { el.style.height = "0px"; el.classList.remove("ready", "go"); }
        y0 = null; pull = 0;
      });
    }

    // ===================== POWER-USER VISUALS (sheet "More detail" only) =====================
    function confRing(pk: any) {
      if (!pk || pk.confidence == null) return "";
      const tier = pk.tier || "low";
      const c = Math.max(0, Math.min(100, Number(pk.confidence)));
      const R = 13, C = 2 * Math.PI * R;
      const dash = (c / 100) * C;
      return `<span class="cring ${tierCls(tier)}" title="${esc(tier)} confidence · ${c.toFixed(0)}%">
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle class="cr-bg" cx="16" cy="16" r="${R}"></circle>
          <circle class="cr-fg" cx="16" cy="16" r="${R}" stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 16 16)"></circle>
        </svg>
        <span class="cr-num">${c.toFixed(0)}</span>
      </span>`;
    }
    function lineMove(pk: any) {
      const lm = pk && pk.line_move;
      if (!lm || lm.open_line == null || lm.current_line == null) return "";
      const open = Number(lm.open_line), cur = Number(lm.current_line);
      const dir = lm.direction || (cur > open ? "up" : cur < open ? "down" : "flat");
      const mag = lm.magnitude != null ? Number(lm.magnitude) : Math.abs(cur - open);
      const isAmerican = lm.unit === "american_ml";
      const fmtL = (v: number) => (isAmerican ? (v > 0 ? "+" + Math.round(v) : "" + Math.round(v)) : num(v, 1));
      const n = lm.n_snapshots != null ? lm.n_snapshots : null;
      if (mag === 0 || dir === "flat") {
        return `<span class="lmove flat" title="Line held from open through pregame across ${n || 0} snapshots.">
          <span class="lm-arrow">→</span><span class="lm-val">${fmtL(cur)}</span><span class="lm-tag">held${n ? ` · ${n}` : ""}</span>
        </span>`;
      }
      const toward = lm.moved_toward_pick;
      const stateCls = toward === true ? "toward" : toward === false ? "against" : "neutral";
      const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "→";
      const badge = toward === true
        ? `<span class="lm-sharp toward" title="The market moved toward our side across ${n || 0} snapshots.">◆ your way</span>`
        : toward === false
        ? `<span class="lm-sharp against" title="The market moved against our side across ${n || 0} snapshots.">drifting off</span>`
        : "";
      return `<span class="lmove ${stateCls}" title="Line moved ${fmtL(open)} → ${fmtL(cur)} over ${n || 0} snapshots.">
        <span class="lm-open">${fmtL(open)}</span><span class="lm-arrow">${arrow}</span><span class="lm-cur">${fmtL(cur)}</span>${n ? `<span class="lm-n">·${n}</span>` : ""}${badge}
      </span>`;
    }
    function leanMeter(pk: any, kind: string) {
      if (!pk) return "";
      const line = pk.line != null ? Number(pk.line) : null;
      const proj = pk.our_proj != null ? Number(pk.our_proj) : null;
      const iv = pk.interval || {};
      const lo = iv.lo != null ? Number(iv.lo) : null;
      const hi = iv.hi != null ? Number(iv.hi) : null;
      if (line == null || proj == null || isNaN(line) || isNaN(proj)) return "";
      const spanCand = [Math.abs(proj - line)];
      if (lo != null && !isNaN(lo)) spanCand.push(Math.abs(lo - line));
      if (hi != null && !isNaN(hi)) spanCand.push(Math.abs(hi - line));
      const span = Math.max(0.6, ...spanCand) * 1.25;
      const pos = (v: number) => Math.max(2, Math.min(98, ((v - line) / (2 * span)) * 100 + 50));
      const projPct = pos(proj);
      const bandL = lo != null && !isNaN(lo) ? pos(lo) : null;
      const bandR = hi != null && !isNaN(hi) ? pos(hi) : null;
      const overish = kind === "total" ? /over/i.test(String(pk.side)) : proj > line;
      const leanCls = overish ? "over" : "under";
      const band = (bandL != null && bandR != null)
        ? `<span class="ln-band" style="left:${Math.min(bandL, bandR).toFixed(1)}%;width:${Math.abs(bandR - bandL).toFixed(1)}%"></span>`
        : "";
      return `<span class="lean ${leanCls}" title="Our projection ${num(proj, 1)} vs line ${num(line, 1)}${lo != null && hi != null ? ` · 80% interval [${num(lo, 1)}, ${num(hi, 1)}]` : ""}">
        ${band}
        <span class="ln-track"></span>
        <span class="ln-tick" style="left:50%"></span>
        <span class="ln-proj" style="left:${projPct.toFixed(1)}%"></span>
      </span>`;
    }
    function wpLean(pk: any) {
      const our = pk.our_winprob != null ? Number(pk.our_winprob) : null;
      let mkt = pk.market_winprob != null ? Number(pk.market_winprob) : null;
      if (mkt == null && pk.price != null) { const d = Number(pk.price); if (d > 1 && d < 100) mkt = 1 / d; }
      if (our == null || mkt == null) return "";
      const span = Math.max(0.06, Math.abs(our - mkt)) * 1.4;
      const pos = (v: number) => Math.max(2, Math.min(98, ((v - mkt!) / (2 * span)) * 100 + 50));
      const leanCls = our >= mkt ? "over" : "under";
      return `<span class="lean ${leanCls}" title="Our win prob ${(our * 100).toFixed(1)}% vs market ${(mkt * 100).toFixed(1)}%">
        <span class="ln-track"></span><span class="ln-tick" style="left:50%"></span><span class="ln-proj" style="left:${pos(our).toFixed(1)}%"></span>
      </span>`;
    }

    // home-relative spread line (positive = home getting points)
    function spreadHomeLine(g: any, pk: any) {
      const line = Math.abs(Number(pk.line));
      const side = String(pk.side || "");
      const m = side.match(/([+-]?\d+(\.\d+)?)/);
      const backedLine = m ? Number(m[1]) : line;
      const backedHome = side.indexOf(g.home_abbr) === 0 || (side.indexOf(g.home_abbr) >= 0 && side.indexOf(g.away_abbr) < 0);
      if (backedHome) return backedLine;
      return -backedLine;
    }
    // Compact sportsbook odds row (sheet "More detail").
    function oddsRow(g: any) {
      const cells: string[] = [];
      const sp = g.spread_pick;
      if (sp && sp.line != null) {
        const pr = sp.prices || {};
        const hl = spreadHomeLine(g, sp);
        const px = pr.home ?? sp.price;
        cells.push(`<div class="oc"><span class="oc-k">Spread</span><span class="oc-v">${esc(g.home_abbr)} ${sgn(hl)}</span><span class="oc-p">${fmtOdds(px)}</span></div>`);
      } else cells.push(`<div class="oc dim"><span class="oc-k">Spread</span><span class="oc-v">—</span></div>`);
      const tp = g.total_pick;
      if (tp && tp.line != null) {
        const pr = tp.prices || {};
        const both = pr.over != null || pr.under != null;
        cells.push(`<div class="oc"><span class="oc-k">Total</span><span class="oc-v">O/U ${num(tp.line)}</span><span class="oc-p">${both ? `o${fmtOdds(pr.over)} · u${fmtOdds(pr.under)}` : fmtOdds(tp.price)}</span></div>`);
      } else cells.push(`<div class="oc dim"><span class="oc-k">Total</span><span class="oc-v">—</span></div>`);
      const mp = g.ml_pick;
      if (mp && (mp.price != null || (mp.prices && (mp.prices.home != null || mp.prices.away != null)))) {
        const pr = mp.prices || {};
        if (g.sport === "soccer" && (pr.home != null || pr.draw != null || pr.away != null)) {
          cells.push(`<div class="oc"><span class="oc-k">1 · X · 2</span><span class="oc-v">${fmtOdds(pr.home)} · ${fmtOdds(pr.draw)} · ${fmtOdds(pr.away)}</span></div>`);
        } else {
          cells.push(`<div class="oc"><span class="oc-k">ML</span><span class="oc-v">${esc(mp.side || "")}</span><span class="oc-p">${fmtOdds(mp.price ?? pr.home ?? pr.away)}</span></div>`);
        }
      } else cells.push(`<div class="oc dim"><span class="oc-k">ML</span><span class="oc-v">—</span></div>`);
      return `<div class="gc-odds">${cells.join("")}</div>`;
    }

    // ===================== GAME TILE (the whole slate story) =====================
    const resMark = (st: string) =>
      st === "won" || st === "clinched"
        ? `<span class="tb-res won">${condCheck}</span>`
        : st === "lost" || st === "cooked" ? `<span class="tb-res lost">✗</span>`
        : st === "pushed" ? `<span class="tb-res pushed">P</span>`
        : st === "inplay" ? `<span class="tb-res inplay"><span class="ip-dot"></span></span>` : "";

    // The FROZEN pick a game box shows: prefer the served display_pick (frozen ~1h
    // before start), fall back to the morning de_plays best TAKE. Never re-derived
    // once the game starts — the box is the honest record of what we said pre-game.
    const lineStr = (v: any) => (Number(v) % 1 ? num(v, 1) : num(v, 0));
    function displayPick(g: any) {
      const dp = g && g.display_pick;
      if (dp && typeof dp === "object" && String(dp.action || "").toUpperCase() === "TAKE" && dp.side != null) {
        const mk = MARKETS.indexOf(String(dp.market || "").toLowerCase()) >= 0 ? String(dp.market).toLowerCase() : "total";
        // the same market's de_plays TAKE carries the richer fields (why, nlines, …) —
        // reuse it only when it IS the same pick (same side and line)
        const rich = gamePlays(g)[mk];
        if (rich && rich.action === "TAKE" && String(rich.side || "").indexOf(String(dp.side)) === 0 &&
            (dp.line == null || rich.line == null || Number(rich.line) === Number(dp.line))) return rich;
        const pl: any = normPlay({ ...dp, action: "TAKE" }, mk);
        if (pl) {
          // serve "OVER" + line 8 as "OVER 8"
          if (pl.side && pl.line != null && !/\d/.test(pl.side)) pl.side = `${pl.side} ${lineStr(pl.line)}`;
          if (dp.quality === "strong" || dp.quality === "good" || dp.quality === "lean") pl.q = dp.quality;
        }
        return pl;
      }
      // display_pick absent or an explicit PASS in its (totals-only) lane:
      // fall back to the morning de_plays best TAKE — the validated graded record.
      return bestPlay(g);
    }

    const pickArrow = (pl: any) => {
      const s = String(pl.side || "").toLowerCase();
      return /(^|\s)over/.test(s) ? "▲" : /(^|\s)under/.test(s) ? "▼" : "►";
    };
    // A readable mini odds row (Spread · Total · ML); the picked market's cell IS the
    // take chip — "▲ OVER 8 / −115" — and the ✓/✗ resolves on it post-game.
    function oddsCells(g: any, pick: any, st: string, locked = false) {
      const q = pick ? qualityOf(pick) : null;
      const mk = pick ? pick.market : null;
      const mark = pick ? resMark(st) : "";
      const cell = (m: string, k: string, v: string, p: string, dim = false) => {
        if (pick && mk === m) {
          // FREE MODE: the pick exists and its quality shows, but the side/line is locked.
          if (locked) return `<div class="oc2 take q-${q} locked"><span class="oc2-k">Bet</span><span class="oc2-v">▲ ●●●● ●</span><span class="oc2-p">●●●</span><span class="lk">${lockSvg}Unlock</span></div>`;
          return `<div class="oc2 take q-${q} ${st}"><span class="oc2-k">Bet</span><span class="oc2-v">${pickArrow(pick)} ${esc(pick.side || v)}</span><span class="oc2-p">${pick.price != null ? fmtOdds(pick.price) : p}${mark}</span></div>`;
        }
        return `<div class="oc2 ${dim ? "dim" : ""}"><span class="oc2-k">${k}</span><span class="oc2-v">${v}</span><span class="oc2-p">${p}</span></div>`;
      };
      const cells: string[] = [];
      const sp = g.spread_pick;
      if (sp && sp.line != null) cells.push(cell("spread", "Spread", `${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, sp))}`, fmtOdds((sp.prices || {}).home ?? sp.price)));
      else cells.push(cell("spread", "Spread", "—", "", true));
      const tp = g.total_pick;
      if (tp && tp.line != null) { const pr = tp.prices || {}; cells.push(cell("total", "Total", `O/U ${num(tp.line)}`, pr.over != null ? `o${fmtOdds(pr.over)}` : fmtOdds(tp.price))); }
      else cells.push(cell("total", "Total", "—", "", true));
      const mp = g.ml_pick; const mpr = (mp && mp.prices) || {};
      if (g.sport === "soccer" && mpr.home != null && mpr.draw != null) cells.push(cell("moneyline", "1·X·2", `${fmtOdds(mpr.home)}·${fmtOdds(mpr.draw)}·${fmtOdds(mpr.away)}`, ""));
      else if (mp && (mp.price ?? mpr.home ?? mpr.away) != null) cells.push(cell("moneyline", "ML", esc(mp.side || "—"), fmtOdds(mp.price ?? mpr.home ?? mpr.away)));
      else cells.push(cell("moneyline", "ML", "—", "", true));
      return `<div class="t-odds">${cells.join("")}</div>`;
    }
    // Live progress for a frozen total pick: the current total filling toward the line.
    function pickProgress(g: any, pl: any, st: string) {
      if (!pl || pl.market !== "total") return "";
      if (st !== "inplay" && st !== "clinched" && st !== "cooked") return "";
      const ca = g.current_actuals || {};
      if (ca.total_so_far == null) return "";
      const line = pl.line != null ? pl.line : (() => { const m = String(pl.side || "").match(/(\d+(\.\d+)?)/); return m ? Number(m[1]) : null; })();
      if (line == null || !(line > 0)) return "";
      const cur = Number(ca.total_so_far);
      const pct = Math.max(0, Math.min(100, (cur / line) * 100));
      const over = /over/i.test(String(pl.side));
      const cls = st === "clinched" ? "won" : st === "cooked" ? "lost" : over ? "chasing" : "holding";
      return `<div class="t-prog ${cls}" title="${num(cur, 0)} of ${num(line, 1)} ${SPORT_UNIT[g.sport] || ""} so far">
        <span class="pg-track"><span class="pg-fill" style="width:${pct.toFixed(0)}%"></span></span>
        <span class="pg-txt">${num(cur, 0)} of ${lineStr(line)}</span>
      </div>`;
    }

    // Tile status strip: "Mid 8th" / "FINAL" / "7:10 PM"; confidence diamonds right.
    function tileStatus(g: any, gs: any, q?: any) {
      let left = "";
      if (gs.kind === "live") left = `<span class="ts-live"><span class="livedot"></span>${esc(gs.label !== "Live" && gs.label ? gs.label : "LIVE")}</span>`;
      else if (gs.kind === "final") left = `<span class="ts-final">FINAL</span>`;
      else {
        const t = gs.si.hasTime && gs.si.time ? gs.si.time.replace(TZ_ABBR ? " " + TZ_ABBR : " ", "") : (gs.si.date || "TBD");
        left = `<span class="ts-time">${esc(t)}</span>`;
      }
      const dayTag = gs.kind === "pre" && gameLocalDay(g) && gameLocalDay(g) !== curDate ? `<span class="ts-day">${esc(gs.si.date)}</span>` : "";
      const comp = g.meta && g.meta.competition ? `<span class="ts-comp">${esc(g.meta.competition)}</span>` : "";
      const right = q ? qDiamonds(q) : (dayTag || comp);
      return `<div class="t-status">${left}${right}</div>`;
    }
    function tileRow(g: any, which: "away" | "home", gs: any) {
      const ab = which === "away" ? g.away_abbr : g.home_abbr;
      const sc = gs.score;
      let scoreHtml = "", winner = false, loser = false;
      if (gs.kind !== "pre" && sc && sc.split && sc.home != null) {
        const mine = which === "home" ? sc.home : sc.away;
        const other = which === "home" ? sc.away : sc.home;
        winner = gs.kind === "final" && mine > other;
        loser = gs.kind === "final" && mine < other;
        scoreHtml = `<span class="t-score${gs.kind === "live" ? " live" : ""}">${num(mine, 0)}</span>`;
      }
      return `<div class="t-row ${winner ? "winner" : ""} ${loser ? "loser" : ""}">
        <span class="t-crest">${gCrest(g, which)}</span>
        <span class="t-ab">${esc(ab)}</span>
        ${scoreHtml}
      </div>`;
    }

    function gameCard(g: any, idx: number) {
      const gs = gameState(g);
      const pick = displayPick(g);
      const q = pick ? qualityOf(pick) : null;
      const st = pick ? playState(g, pick) : "open";
      const locked = pick ? pickLocked(pick, st) : false;
      // The box itself carries the verdict: quality border pre-game, result border after.
      const resCls = st === "won" || st === "clinched" ? "res-won" : st === "lost" || st === "cooked" ? "res-lost" : st === "pushed" ? "res-push" : "";
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-note">${num(gs.score.total, 0)} ${SPORT_UNIT[g.sport] || ""} total</div>` : "";
      return `<article class="tile ${gs.kind}${q ? ` q-${q}` : ""}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)}${pick ? (locked ? " — pick locked" : ` — bet ${esc(pick.side || "")}`) : ""} — open details">
        ${tileStatus(g, gs, q)}
        <div class="t-teams">${tileRow(g, "away", gs)}${tileRow(g, "home", gs)}</div>
        ${totOnly}
        ${oddsCells(g, pick, st, locked)}
        ${gs.kind === "live" && pick && !locked ? pickProgress(g, pick, st) : ""}
      </article>`;
    }

    // Tiny record chip: this month's graded picks off the payload's finals tail.
    function monthRecord() {
      const src = livePayload || payload;
      if (!src) return null;
      const m = todayISO().slice(0, 7);
      let w = 0, l = 0;
      ((src.games || []) as any[]).forEach((g: any) => {
        if (String(g.date || "").slice(0, 7) !== m) return;
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (pl.action === "TAKE" && pl.result) {
            if (pl.result.status === "hit") w++;
            else if (pl.result.status === "miss") l++;
          }
        });
      });
      return w + l ? { w, l } : null;
    }
    function metaRow() {
      const mr = monthRecord();
      const chip = mr
        ? `<button class="recchip" id="recchip">Picks <b>${mr.w}–${mr.l}</b> this month</button>`
        : `<button class="recchip" id="recchip">Our record →</button>`;
      return `<div class="metarow">${chip}<span class="mr-sp"></span><button class="howlink" id="howlink">ⓘ How picks work</button></div>`;
    }

    // ===================== GAMES TAB =====================
    function skeletonSlate(n = 8) {
      let cards = "";
      for (let i = 0; i < n; i++) {
        cards += `<div class="skcard" style="--i:${i}">
          <div class="sk-row"><span class="sk sk-line w24"></span></div>
          <div class="sk-row"><span class="sk sk-crest"></span><span class="sk sk-line w48"></span><span class="sk sk-line w14 r"></span></div>
          <div class="sk-row"><span class="sk sk-crest"></span><span class="sk sk-line w48"></span><span class="sk sk-line w14 r"></span></div>
          <div class="sk-row mt"><span class="sk sk-line w60"></span></div>
        </div>`;
      }
      return `<div class="slate">${cards}</div>`;
    }

    function dateStripHtml() {
      const chips: string[] = [];
      const today = todayISO();
      let d = shiftDate(today, -13);
      if (d < minDate) d = minDate;
      let cur = d;
      while (cur <= today) {
        const dt = new Date(cur + "T12:00:00");
        const isToday = cur === today;
        const on = cur === curDate && !rangeMode;
        chips.push(`<button class="dchip ${on ? "on" : ""} ${isToday ? "today" : ""}" data-date="${cur}">
          <span class="dc-wd">${isToday ? "Today" : dt.toLocaleDateString("en-US", { weekday: "short" })}</span>
          <span class="dc-d">${dt.getDate()}</span>
        </button>`);
        cur = shiftDate(cur, 1);
      }
      return chips.join("");
    }

    function renderScoresChrome() {
      const tabsHtml = SPORTS.map((lg) => {
        const cnt = payload ? gamesForLeague(payload, lg).length : 0;
        return `<button class="sporttab ${lg === league ? "on" : ""}" data-lg="${lg}" data-ic="${SPORT_ICON[lg] || ""}">${SPORT_LABEL[lg]}<span class="cnt" id="cnt-${lg}">${cnt || ""}</span></button>`;
      }).join("");
      root.querySelector("#games-view").innerHTML = `
        <div id="ptr"><div class="ptr-inner"><span class="ptr-sp"></span><span class="ptr-txt">release to refresh</span></div></div>
        <div class="subhead">
          <div class="sporttabs" id="sporttabs">${tabsHtml}<span class="tab-ink" id="tab-ink"></span></div>
          <div id="meta-area">${metaRow()}</div>
        </div>
        <div class="datebar">
          <div class="datestrip" id="datestrip">${dateStripHtml()}</div>
          <div class="datetools">
            <button class="dtool" id="cal-btn" title="Pick a date">📅</button>
            <input type="date" id="date-input" value="${curDate}" min="${minDate}" max="${maxDate}">
            <button class="dtool hist ${histOpen || rangeMode ? "on" : ""}" id="hist-btn" title="Scan a date range">History</button>
          </div>
        </div>
        <div id="hist-area">${histOpen ? histPanel() : ""}</div>
        <div id="slate-body">${skeletonSlate()}</div>`;
      bindScoresChrome();
      requestAnimationFrame(positionInk);
    }

    function histPanel() {
      return `
        <div class="histpanel">
          <span class="rlab">History</span>
          <input type="date" id="range-from" value="${rangeFrom || curDate}" min="${minDate}" max="${maxDate}">
          <span class="rlab lite">to</span>
          <input type="date" id="range-to" value="${rangeTo || curDate}" min="${minDate}" max="${maxDate}">
          <button class="go" id="range-go">Scan</button>
          ${rangeMode ? `<button class="clr" id="range-clear">Clear</button>` : ""}
          <span class="rnote">Shows each day's ${SPORT_LABEL[league]} games and bets across ${minDate.slice(0, 4)}–${maxDate.slice(0, 4)}.</span>
        </div>`;
    }

    function positionInk() {
      const tabs = $("sporttabs"), ink = $("tab-ink");
      if (!tabs || !ink) return;
      const on = tabs.querySelector(".sporttab.on");
      if (!on) { ink.style.opacity = "0"; return; }
      ink.style.opacity = "1";
      ink.style.width = on.offsetWidth + "px";
      ink.style.transform = `translateX(${on.offsetLeft}px)`;
    }

    function renderSlate(quiet = false) {
      const body = $("slate-body"), meta = $("meta-area");
      if (!body) return;
      body.classList.toggle("still", quiet); // live-score refresh: no re-entrance animation
      if (rangeMode) {
        body.innerHTML = renderRangeBody();
      } else if (!payload) {
        body.innerHTML = skeletonSlate();
        return;
      } else {
        if (meta) meta.innerHTML = metaRow();
        const games = gamesForLeague(payload, league);
        const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        if (!games.length) {
          body.innerHTML = `<div class="state"><div class="st-ico">${SPORT_LABEL[league]}</div><div class="big">No ${SPORT_LABEL[league]} games</div><div class="sm">Nothing on the board for ${esc(dispDate)}. Try another league or date.</div></div>`;
        } else {
          body.innerHTML = `<div class="slate">${games.map((g: any, i: number) => gameCard(g, i)).join("")}</div>
            <div class="refnote">${games.length} ${SPORT_LABEL[league]} game${games.length > 1 ? "s" : ""} · ${esc(dispDate)}</div>`;
        }
      }
      SPORTS.forEach((lg) => { const el = $("cnt-" + lg); if (el) { const c = payload ? gamesForLeague(payload, lg).length : 0; el.textContent = c || ""; } });
      bindMeta();
      bindCards();
      animateCounters(body);
    }

    function renderRangeBody() {
      if (!rangeGames.length) return `<div class="state"><div class="big">No ${SPORT_LABEL[league]} games in range</div><div class="sm">Try a wider range or another league.</div></div>`;
      let html = "";
      let N = 0, W = 0, L = 0;
      rangeGames.forEach((day: any) => {
        const games = gamesForLeague({ games: day.games, date: day.date }, league, day.date);
        if (!games.length) return;
        let w = 0, l = 0;
        games.forEach((g: any) => {
          const P = gamePlays(g);
          MARKETS.forEach((mk) => { const pl = P[mk]; if (pl.action === "TAKE" && pl.result) { if (pl.result.status === "hit") w++; else if (pl.result.status === "miss") l++; } });
        });
        N += games.length; W += w; L += l;
        const dd = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
        html += `<div class="dayhdr"><span class="dh-date">${esc(dd)}</span><span class="dh-rr">${games.length} game${games.length > 1 ? "s" : ""}${w + l ? ` · picks ${w}-${l}` : ""}</span></div>`;
        html += `<div class="slate">${games.map((g: any, i: number) => gameCard(g, i)).join("")}</div>`;
      });
      html += `<div class="refnote">${N} ${SPORT_LABEL[league]} games across ${rangeGames.length} day${rangeGames.length > 1 ? "s" : ""}${W + L ? ` · picks ${W}-${L}` : ""}</div>`;
      return html;
    }

    function bindMeta() {
      const rc = $("recchip"); if (rc) rc.onclick = () => switchTab("results");
      const hl = $("howlink"); if (hl) hl.onclick = () => openRecipeSheet();
    }

    function bindScoresChrome() {
      root.querySelectorAll(".sporttab").forEach((b: any) => (b.onclick = () => {
        if (league === b.dataset.lg) return;
        league = b.dataset.lg;
        root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
        positionInk();
        renderSlate();
      }));
      bindStrip();
      const di = $("date-input");
      if (di) di.onchange = () => { curDate = di.value; rangeMode = false; selectDate(); };
      const cal = $("cal-btn");
      if (cal && di) cal.onclick = () => { try { di.showPicker(); } catch { di.focus(); di.click(); } };
      const hb = $("hist-btn");
      if (hb) hb.onclick = () => { histOpen = !histOpen; const ha = $("hist-area"); if (ha) { ha.innerHTML = histOpen ? histPanel() : ""; bindHist(); } hb.classList.toggle("on", histOpen || rangeMode); };
      bindHist();
      bindMeta();
      window.addEventListener("resize", () => { positionInk(); recenterStrip(false); });
    }
    function bindHist() {
      const rf = $("range-from"); if (rf) rf.onchange = () => (rangeFrom = rf.value);
      const rt = $("range-to"); if (rt) rt.onchange = () => (rangeTo = rt.value);
      const rg = $("range-go"); if (rg) rg.onclick = () => runRange();
      const rc = $("range-clear"); if (rc) rc.onclick = () => { rangeMode = false; refreshStrip(); renderSlate(); };
    }
    function recenterStrip(smooth = true) {
      const strip = $("datestrip");
      const on = strip && strip.querySelector(".dchip.on");
      if (!strip || !on || !strip.clientWidth) return;
      const target = on.offsetLeft - (strip.clientWidth - on.offsetWidth) / 2;
      strip.scrollTo({ left: Math.max(0, target), behavior: REDUCE || !smooth ? "auto" : "smooth" });
    }
    function bindStrip() {
      const strip = $("datestrip");
      if (!strip) return;
      strip.querySelectorAll(".dchip").forEach((c: any) => (c.onclick = () => { curDate = c.dataset.date; rangeMode = false; selectDate(); }));
      requestAnimationFrame(() => recenterStrip());
    }
    function refreshStrip() {
      const strip = $("datestrip");
      if (strip) { strip.innerHTML = dateStripHtml(); bindStrip(); }
      const di = $("date-input"); if (di) di.value = curDate;
      const hb = $("hist-btn"); if (hb) hb.classList.toggle("on", histOpen || rangeMode);
    }
    async function selectDate() {
      refreshStrip();
      const body = $("slate-body"); if (body) body.innerHTML = skeletonSlate();
      payload = await loadDay(curDate);
      const lg = bestLeague();
      if (lg !== league) {
        league = lg;
        root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
        positionInk();
      }
      renderSlate();
    }

    function bindCards() {
      root.querySelectorAll(".tile[data-gid]").forEach((bx: any) => {
        bx.onclick = () => { const g = findGame(bx.dataset.gid); if (g) openDetail(g); };
        bx.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const g = findGame(bx.dataset.gid); if (g) openDetail(g); } };
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
      const body = $("slate-body");
      if (body) body.innerHTML = `<div class="state"><div class="spinner"></div><div class="big">Scanning ${dates.length} day${dates.length === 1 ? "" : "s"}</div><div class="sm">${esc(a)} → ${esc(b)}</div></div>`;
      const results = await Promise.all(dates.map(async (d) => ({ date: d, games: ((await snap("pregame_picks:" + d)) || {}).games || [] })));
      rangeGames = results.filter((r) => r.games.length).sort((x, y) => (x.date < y.date ? 1 : -1));
      refreshStrip();
      renderSlate();
    }

    // ===================== DETAIL SHEET: THE CALL → WHY → MORE DETAIL =====================
    // Plain-English WHY: 2-4 short sentences a first-time reader can follow, built from the
    // play's served numbers. Real numbers, no jargon; hit-rates always ride with the price.
    function whySentences(g: any, pl: any) {
      const s: string[] = [];
      const unit = SPORT_UNIT[g.sport] || "points";
      const ps = g.predicted_score || {};
      if (pl.market === "total") {
        const pk = g.total_pick || {};
        const line = pl.line != null ? pl.line : (pk.line != null ? Number(pk.line) : null);
        const proj = pk.our_proj != null ? Number(pk.our_proj)
          : (ps.home != null && ps.away != null ? Number(ps.home) + Number(ps.away) : null);
        const over = /over/i.test(String(pl.side || ""));
        if (proj != null && line != null)
          s.push(`Our model expects about ${num(proj, 1)} ${unit} in this game — ${over ? "more" : "fewer"} than the ${num(line, 1)} the books are offering.`);
      } else if (pl.market === "spread") {
        if (ps.away != null && ps.home != null)
          s.push(`Our model's expected final is ${esc(g.away_abbr)} ${num(ps.away, 1)}–${num(ps.home, 1)} ${esc(g.home_abbr)}, which lands on the ${esc(pl.side || "")} side of the line.`);
      } else if (pl.market === "moneyline") {
        const mp = g.ml_pick || {};
        if (mp.our_winprob != null)
          s.push(`Our model gives ${esc(pl.side || mp.side || "this side")} about a ${(Number(mp.our_winprob) * 100).toFixed(0)}% chance to win — more than the price implies.`);
      }
      if (pl.nlines != null && pl.nlines >= 2)
        s.push(`The sportsbooks themselves don't agree on this line today — they're posting ${pl.nlines} different numbers — and split lines like that have historically been beatable.`);
      if (pl.value_tier) {
        const rh = recipeHistory();
        s.push(`Bets made exactly this way have won about ${(rh.hit * 100).toFixed(0)}% of the time across ${rh.n.toLocaleString()} graded bets from 2022 to 2026 — roughly ${sgn(rh.roi * 100, 0)}% on every dollar bet.`);
      } else {
        if (pl.p != null && pl.price != null)
          s.push(`The model gives this bet about a ${(Number(pl.p) * 100).toFixed(0)}% chance to win at ${fmtOdds(pl.price)}.`);
        s.push(`One honest caution: picks like this are right often, but at these prices the long-run profit is close to break-even — treat it as a lean, not a lock.`);
      }
      return s.slice(0, 4);
    }
    const passWhy = () =>
      `We checked the spread, the total and the moneyline for this game, and none of them offered a real advantage over the books' numbers. Passing is part of the strategy — most games don't have a bet worth taking.`;

    // ---- power-user blocks kept under "More detail" ----
    function modelsVsMarket(g: any) {
      const models = (g.why && g.why.models) || [];
      if (!models.length) return "";
      const rows = models.map((m: any) => `<tr><td class="mname">${esc(m.name)}<div class="mnote">${esc(m.note || "")}</div></td><td class="num">${m.proj != null ? num(m.proj, 2) : "—"}</td></tr>`).join("");
      return `<div class="dsec"><div class="dsec-h">Model vs. Market</div><div class="dsec-b"><table class="mtab"><thead><tr><th>Source</th><th style="text-align:right">Projection</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
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

    // One market's play inside "More detail": action, bullets, model-vs-market, line move.
    function sheetPlay(g: any, pl: any) {
      const mk = pl.market;
      const pk = mk === "spread" ? g.spread_pick : mk === "total" ? g.total_pick : g.ml_pick;
      const live = playLiveState(g, pl);
      const r = pl.result;
      const rCls = r ? (r.status === "hit" ? "won" : r.status === "miss" ? "lost" : "pushed") : (live === "clinch-won" ? "clinched" : live === "clinch-lost" ? "cooked" : "");
      let head;
      if (pl.action === "TAKE") {
        const resTxt = r
          ? (r.status === "hit" ? `✓ WON${r.pnl != null ? ` ${r.pnl >= 0 ? "+" : ""}${Number(r.pnl).toFixed(2)}u` : ""}` : r.status === "miss" ? `✗ LOST${r.pnl != null ? ` ${Number(r.pnl).toFixed(2)}u` : ""}` : "PUSH")
          : live === "clinch-won" ? "✓ CLINCHED" : live === "clinch-lost" ? "✗ LINE PASSED" : live === "inplay" ? "IN PLAY" : "";
        head = `<div class="shp-head take ${rCls}">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          <span class="shp-act">BET</span>
          <span class="shp-side">${esc(pl.side || "—")}</span>
          ${pl.price != null ? `<span class="shp-px">${fmtOdds(pl.price)}</span>` : ""}
          <span class="shp-q">${Q_LABEL[qualityOf(pl)]}</span>
          ${resTxt ? `<span class="shp-res ${rCls || "inplay"}">${resTxt}</span>` : ""}
        </div>`;
      } else {
        head = `<div class="shp-head pass">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          <span class="shp-act pass">PASS</span>
          <span class="shp-passnote">no edge in this market</span>
        </div>`;
      }
      let recipeBlk = "";
      if (pl.action === "TAKE" && pl.value_tier) {
        const c = valueConds(pl);
        recipeBlk = `<div class="shp-recipe">
          <div class="sr-h"><span class="pl-vdia">◆</span> Recipe conditions met</div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.gap)}</b>${c.gapSub ? ` <span class="sr-sub">${esc(c.gapSub)}</span>` : ""} <span class="sr-need">needs ≥ ${c.need}</span></div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.split)}</b> <span class="sr-sub">the market is split — someone's line is soft</span></div>
          <div class="sr-chips">
            ${pl.claimed_ev != null ? `<span class="mvm-chip ${pl.claimed_ev >= 0 ? "pos" : "neg"}">claimed value ${(pl.claimed_ev >= 0 ? "+" : "") + (pl.claimed_ev * 100).toFixed(1)}%</span>` : ""}
            ${pl.price != null ? `<span class="mvm-chip">morning line ${fmtOdds(pl.price)}</span>` : ""}
            ${pl.shop && pl.shop.price_american != null ? `<span class="mvm-chip be">best price ${esc(String(pl.shop.book || ""))} ${pl.shop.price_american > 0 ? "+" : ""}${pl.shop.price_american}${pl.shop.line != null ? ` @ ${num(pl.shop.line, 1)}` : ""}</span>` : ""}
          </div>
        </div>`;
      }
      const why = pl.why && pl.why.length
        ? `<ul class="shp-why">${pl.why.map((w: any) => `<li>${esc(w)}</li>`).join("")}</ul>` : "";
      let mvm = "";
      if (pl.action === "TAKE" && pl.src === "sa" && pl.sa) {
        const sa = pl.sa;
        mvm = `<div class="shp-mvm">
          ${sa.model_p_cover != null ? `<span class="mvm-chip">model ${saPct(sa.model_p_cover, 1)}</span>` : ""}
          ${sa.market_p_cover != null ? `<span class="mvm-chip">market ${saPct(sa.market_p_cover, 1)}</span>` : ""}
          <span class="mvm-chip be">needs ${saPct(saBreakeven(sa), 1)} at ${saAm(sa.price)}</span>
        </div>`;
      } else if (pk && pk.our_proj != null && pk.line != null) {
        mvm = `<div class="shp-mvm">
          <span class="mvm-chip">model ${num(pk.our_proj, 1)}</span>
          <span class="mvm-chip">line ${num(pk.line, 1)}</span>
          <span class="mvm-chip ${Number(pk.gap) >= 0 ? "pos" : "neg"}">gap ${sgn(pk.gap, 1)} ${SPORT_UNIT[g.sport] || ""}</span>
        </div>`;
      } else if (pk && pk.our_winprob != null) {
        mvm = `<div class="shp-mvm"><span class="mvm-chip">model win prob ${saPct(pk.our_winprob, 1)}</span>${pk.market_winprob != null ? `<span class="mvm-chip">market ${saPct(pk.market_winprob, 1)}</span>` : ""}</div>`;
      }
      const move = pk ? lineMove(pk) : "";
      const lean = pk ? (mk === "moneyline" ? wpLean(pk) : leanMeter(pk, mk)) : "";
      const viz = (move || lean) ? `<div class="shp-viz">${lean ? `<span class="shp-lean">${lean}</span>` : ""}${move}</div>` : "";
      const lread = pl.action === "TAKE" ? latestReadPill(g, pl) : "";
      const lreadBlk = lread ? `<div class="shp-lread">${lread}<span class="lr-note">the model's latest look — the graded morning play above is unchanged</span></div>` : "";
      return `<div class="shp ${pl.action === "TAKE" ? "is-take" : "is-pass"}">
        ${head}${lreadBlk}${recipeBlk}${why}${mvm}${viz}
      </div>`;
    }

    // Recipe (VALUE) record table — power-user detail.
    function valueRecordBlock() {
      const vr = payload && payload.value_record;
      if (!vr) return "";
      const fwd = vr.forward || {};
      const fRow = (lab: string, o: any) => {
        if (!o || !o.n_settled) return `<tr><td>${esc(lab)}</td><td class="num">0</td><td class="num">—</td><td class="num">—</td></tr>`;
        const hit = o.hit != null ? saPct(o.hit, 1) : "—";
        const roi = o.roi != null ? `<span class="${o.roi >= 0 ? "pos" : "neg"}">${(o.roi >= 0 ? "+" : "") + (o.roi * 100).toFixed(1)}%</span>` : "—";
        return `<tr><td>${esc(lab)} <span class="vr-rec">${esc(o.record || "")}</span></td><td class="num">${o.n_settled}</td><td class="num">${hit}</td><td class="num">${roi}</td></tr>`;
      };
      return `<div class="shp-vrec">
        <div class="vr-h"><span class="pl-vdia">◆</span> Recipe record <span class="vr-papertag">tracked, not staked</span></div>
        <div class="vr-line">${esc(vr.val_record || "")}</div>
        <div class="vr-line">${esc(vr.gate || "")}</div>
        <table class="dsa-tab vr-tab">
          <thead><tr><th>Since going live</th><th>n</th><th>Win rate</th><th>Return</th></tr></thead>
          <tbody>${fRow("Strong (tier A)", fwd.tier_a)}${fRow("Strong + Good", fwd.tier_ab)}</tbody>
        </table>
      </div>`;
    }

    function playsTrackTable() {
      const T = saTrack();
      const row = (lab: string, o: any) => o ? `<tr><td>${esc(lab)}</td><td class="num">${(o.n || 0).toLocaleString()}</td><td class="num">${o.hit != null ? saPct(o.hit, 1) : "—"}</td><td class="num ${o.roi != null && o.roi >= 0 ? "pos" : "neg"}">${o.roi != null ? (o.roi >= 0 ? "+" : "") + (o.roi * 100).toFixed(1) + "%" : "—"}</td></tr>` : "";
      const fwdRow = T.fwd && T.fwd.n_settled ? row("Live (forward)", { n: T.fwd.n_settled, hit: T.fwd.hit, roi: T.fwd.roi }) : "";
      return `<div class="shp-track">
        <div class="shp-track-h">Pick track record</div>
        <table class="dsa-tab">
          <thead><tr><th>Window</th><th>n</th><th>Win rate</th><th>Return</th></tr></thead>
          <tbody>${row("2024", T.v24)}${row("2025", T.t25)}${row("2026", T.g26)}${fwdRow}</tbody>
        </table>
      </div>`;
    }

    function detailBet(pk: any, label: string, kind: string, g: any) {
      if (!pk || pk.side == null) return "";
      const st = resOf(pk);
      const tier = pk.tier || "low";
      let line = "";
      if (kind === "spread") line = `line <b>${sgn(pk.line)}</b> · model margin <b>${pk.our_proj != null ? sgn(pk.our_proj) : "—"}</b>${pk.interval && pk.interval.lo != null ? ` · likely range ${num(pk.interval.lo)} to ${num(pk.interval.hi)}` : ""}`;
      else if (kind === "total") line = `line <b>${num(pk.line)}</b> · model <b>${num(pk.our_proj)}</b>${pk.interval && pk.interval.lo != null ? ` · likely range ${num(pk.interval.lo)} to ${num(pk.interval.hi)}` : ""}`;
      else line = `price <b>${fmtOdds(pk.price)}</b>${pk.our_winprob != null ? ` · model win chance <b>${(pk.our_winprob * 100).toFixed(1)}%</b>` : ""}${pk.market_winprob != null ? ` · market <b>${(pk.market_winprob * 100).toFixed(1)}%</b>` : ""}`;
      const resTxt = st === "hit" ? `WON` : st === "miss" ? `LOST` : st === "push" ? "PUSH" : "";
      return `<div class="dbet">
        <div class="dbet-top">
          <div class="dmk">${esc(label)}</div>
          <div class="dmid"><div class="dside">${esc(pk.side)}</div><div class="dline">${line}</div></div>
          <div class="dright">${confRing(pk)}${resTxt ? `<div class="dres ${st}">${resTxt}</div>` : ""}</div>
        </div>
      </div>`;
    }

    function openDetail(g: any, focusMk?: string) {
      detail = g;
      const sp = g.sport;
      const ps = g.predicted_score || {};
      const homeWin = ps.winner_abbr === g.home_abbr;
      const dispDate = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      const gs = gameState(g);
      const startTxt = gs.si.hasTime ? gs.si.time : gs.si.date;
      const tot = (ps.home != null && ps.away != null) ? num(Number(ps.home) + Number(ps.away), 1) : (g.total_pick && g.total_pick.our_proj != null ? num(g.total_pick.our_proj) : "—");
      const P = gamePlays(g);
      const takes = orderedTakes(g, P);
      // The sheet's call is the SAME frozen pick the box shows.
      const lead = (focusMk && P[focusMk] && P[focusMk].action === "TAKE") ? P[focusMk] : displayPick(g) || takes[0] || null;

      // score banner (live/final)
      let scoreBanner = "";
      if (gs.score && gs.score.split && gs.score.home != null) {
        scoreBanner = `<div class="sh-score ${gs.kind}">
          <span class="shs-side"><span class="shs-ab">${esc(g.away_abbr)}</span><b>${num(gs.score.away, 0)}</b></span>
          <span class="shs-mid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label)}`}</span>
          <span class="shs-side"><b>${num(gs.score.home, 0)}</b><span class="shs-ab">${esc(g.home_abbr)}</span></span>
        </div>`;
      } else if (gs.score && gs.score.total != null) {
        scoreBanner = `<div class="sh-score ${gs.kind}"><span class="shs-mid">${gs.kind === "final" ? "Final" : "Live"}</span><span class="shs-tot">${num(gs.score.total, 0)} ${SPORT_UNIT[sp] || ""}</span></div>`;
      }

      // (1) THE CALL — big and unmissable, with the result state front and center.
      const leadLocked = lead ? pickLocked(lead, playState(g, lead)) : false;
      let callBlock;
      if (lead && leadLocked) {
        // FREE MODE: the call exists — quality shows, side/line stays behind the lock.
        const q = qualityOf(lead);
        callBlock = `<div class="callcard locked ${isGold(lead) ? "gold" : ""}">
          <div class="cc-k">Our call — locked</div>
          <div class="cc-main">
            <span class="cc-side" aria-hidden="true">●●●● ●</span>
            <span class="cc-qual">${qDiamonds(q)}<u>${Q_LABEL[q]}</u></span>
          </div>
          <button class="lockchip" id="cc-unlock" style="margin-top:12px"><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>
        </div>`;
      } else if (lead) {
        const q = qualityOf(lead);
        const gold = isGold(lead);
        const st = playState(g, lead);
        const res = st === "won" ? `<span class="cc-res won">${condCheck} WON</span>`
          : st === "lost" ? `<span class="cc-res lost">✗ LOST</span>`
          : st === "pushed" ? `<span class="cc-res pushed">PUSH</span>`
          : st === "clinched" ? `<span class="cc-res won">${condCheck} CLINCHED</span>`
          : st === "cooked" ? `<span class="cc-res lost">✗ LINE PASSED</span>`
          : st === "inplay" ? `<span class="cc-res inplay"><span class="ip-dot"></span>IN PLAY</span>` : "";
        const others = takes.filter((p: any) => p.market !== lead.market).map((p: any) =>
          `<div class="cc-also">Also: <b>${esc(p.side || "—")}</b>${p.price != null ? ` · ${fmtOdds(p.price)}` : ""} · ${Q_LABEL[qualityOf(p)]}</div>`).join("");
        callBlock = `<div class="callcard ${gold ? "gold" : ""} ${st}">
          <div class="cc-k">${gold ? "★ " : ""}Our call</div>
          <div class="cc-main">
            <span class="cc-side">${esc(lead.side || "—")}</span>
            ${lead.price != null ? `<span class="cc-px">${fmtOdds(lead.price)}</span>` : ""}
            <span class="cc-qual">${qDiamonds(q)}<u>${Q_LABEL[q]}</u></span>
            ${res}
          </div>
          ${others}
        </div>`;
      } else {
        callBlock = `<div class="callcard pass">
          <div class="cc-k">Our call</div>
          <div class="cc-main"><span class="cc-side">PASS</span><span class="cc-passnote">no bet in this game</span></div>
        </div>`;
      }

      // (2) WHY — plain English, short. Locked picks get an honest teaser instead.
      const why = lead ? whySentences(g, lead) : [passWhy()];
      const whyBlock = leadLocked
        ? `<div class="whycard">
            <div class="wc-k">Why</div>
            <p>The plain-English read behind this pick — the model number, the line it beats, and the history of bets made exactly this way — is part of DiamondEdge Premium. The quality rating above is real; nothing here is invented to sell you.</p>
          </div>`
        : `<div class="whycard">
            <div class="wc-k">Why</div>
            ${why.map((w) => `<p>${w}</p>`).join("")}
          </div>`;

      // (3) More detail — everything the old sheet had, folded away for power users.
      const bets = [detailBet(g.spread_pick, "Spread", "spread", g), detailBet(g.ml_pick, "Moneyline", "ml", g), detailBet(g.total_pick, "Total", "total", g)].filter(Boolean).join("");
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Model Notes</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";
      const anyValue = takes.some((p: any) => p.value_tier);
      const more = `<details class="more"><summary>More detail<span class="more-sub">markets, model numbers, matchup intel</span></summary>
        <div class="more-body">
          <div class="dsec"><div class="dsec-h">Sportsbook Lines</div>${oddsRow(g)}</div>
          <div class="dsec"><div class="dsec-h">All Three Markets</div><div class="dsec-b shp-wrap">
            ${MARKETS.map((mk) => sheetPlay(g, P[mk])).join("")}
            ${anyValue ? valueRecordBlock() : ""}
            ${takes.length ? playsTrackTable() : ""}
          </div></div>
          <div class="dsec">
            <div class="dsec-h">Predicted Final Score</div>
            <div class="dsec-b">
              <div class="dscore">
                <div class="tm ${!homeWin ? "win" : ""}">${gCrest(g, "away")}<div class="pts">${num(ps.away, 1)}</div><div class="ab">${esc(g.away_abbr)}</div></div>
                <div class="dx">–</div>
                <div class="tm ${homeWin ? "win" : ""}">${gCrest(g, "home")}<div class="pts">${num(ps.home, 1)}</div><div class="ab">${esc(g.home_abbr)}</div></div>
              </div>
              <div class="dscore-foot">Pick: <b>${esc(ps.winner_abbr || "—")}</b> by <b>${ps.margin != null ? Math.abs(Number(ps.margin)).toFixed(1) : "—"}</b> · expected total <b>${tot} ${SPORT_UNIT[sp] || ""}</b></div>
            </div>
          </div>
          ${bets ? `<div class="dsec"><div class="dsec-h">Model Reads (all markets)</div><div class="dsec-b" style="padding-top:4px;padding-bottom:4px">${bets}</div></div>` : ""}
          ${intelSection(g)}
          ${modelsVsMarket(g)}
          ${reasoning}
        </div>
      </details>`;

      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">${SPORT_LABEL[sp] || sp}${g.meta && g.meta.competition ? ` · ${esc(g.meta.competition)}` : ""}</div>
            <div class="sh-mu">
              <span class="sh-tm">${gCrest(g, "away")}<b>${esc(g.away_abbr)}</b></span>
              <span class="sh-at">@</span>
              <span class="sh-tm">${gCrest(g, "home")}<b>${esc(g.home_abbr)}</b></span>
            </div>
            <div class="sh-meta">${esc([g.matchup, dispDate, startTxt].filter(Boolean).join(" · "))}</div>
          </div>
          <div class="sh-body">
            ${scoreBanner}
            ${callBlock}
            ${whyBlock}
            ${leadLocked ? "" : more}
          </div>
        </div>`;

      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = closeDetail;
      $("sheet-bg").onclick = closeDetail;
      const unl = $("cc-unlock");
      if (unl) unl.onclick = () => { closeDetail(); switchTab("upgrade"); };
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    function closeDetail() {
      detail = null;
      const l = $("sheet-layer");
      if (!l || !l.innerHTML) return;
      const sh = $("sheet"), bg = $("sheet-bg");
      document.body.classList.remove("sheet-open");
      if (REDUCE || !sh) { l.innerHTML = ""; return; }
      sh.classList.add("closing"); if (bg) bg.classList.add("closing");
      setTimeout(() => { l.innerHTML = ""; }, 300);
    }
    function bindSheetDrag(sheet: any, grab: any) {
      if (!sheet || !grab) return;
      let y0: any = null, dy = 0;
      const start = (e: any) => { y0 = (e.touches ? e.touches[0] : e).clientY; dy = 0; sheet.style.transition = "none"; };
      const move = (e: any) => { if (y0 == null) return; dy = Math.max(0, ((e.touches ? e.touches[0] : e).clientY) - y0); sheet.style.transform = `translateY(${dy}px)`; };
      const end = () => {
        if (y0 == null) return;
        sheet.style.transition = "";
        if (dy > 110) { sheet.style.transform = ""; closeDetail(); }
        else sheet.style.transform = "";
        y0 = null;
      };
      grab.addEventListener("touchstart", start, { passive: true });
      grab.addEventListener("touchmove", move, { passive: true });
      grab.addEventListener("touchend", end);
      grab.addEventListener("mousedown", (e: any) => {
        start(e);
        const mm = (ev: any) => move(ev);
        const mu = () => { end(); window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
        window.addEventListener("mousemove", mm); window.addEventListener("mouseup", mu);
      });
    }

    // ===================== "HOW PICKS WORK" SHEET (the ⓘ link) =====================
    function openRecipeSheet() {
      detail = { _recipe: true };
      const rh = recipeHistory();
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head gold">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">DiamondEdge</div>
            <div class="rcp-title"><span class="pl-vdia">◆</span>How picks work</div>
            <div class="sh-meta">what the words mean, and why we pass so often</div>
          </div>
          <div class="sh-body">
            <div class="dsec">
              <div class="dsec-h">Strong / Good / Lean</div>
              <div class="dsec-b rcp">
                <p><b>◆◆◆ Strong</b> — our best kind of bet. Either the winning recipe below fired at full strength, or the model is at its surest.</p>
                <p><b>◆◆ Good</b> — the same idea, slightly weaker signal.</p>
                <p><b>◆ Lean</b> — the model likes it, but the edge is thin. Fine to skip.</p>
                <p>Everything else is a <b>PASS</b>. Most games are a pass — that's the strategy working, not missing.</p>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">The winning recipe</div>
              <div class="dsec-b rcp-steps">
                <div class="rcp-step"><span class="rh-n">1</span><div><b>Our model disagrees with the books' number</b> for the game total by a meaningful amount that morning.</div></div>
                <div class="rcp-step"><span class="rh-n">2</span><div><b>The books disagree with each other too</b> — they're posting different totals for the same game, so someone's number is off.</div></div>
                <div class="rcp-step"><span class="rh-n">3</span><div><b>Only then do we bet the total</b>, at the morning line, at fair prices only. Roughly one game a day qualifies.</div></div>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">Why it works</div>
              <div class="dsec-b rcp">
                <p><b>Out-predicting the bookmakers doesn't pay.</b> Even when our picks win 60%+ of the time, the prices usually eat the profit. Being right a lot isn't an edge if the market charges you for it.</p>
                <p><b>So instead of competing with the books, we audit them.</b> We only bet when there's evidence the books' own number is wrong — our model disagrees AND the books can't agree among themselves.</p>
                <p><b>The receipts:</b> bets made exactly this way have won <b>${(rh.hit * 100).toFixed(1)}%</b> of the time across <b>${rh.n.toLocaleString()}</b> graded bets from 2022 to 2026, returning about <b>${sgn(rh.roi * 100, 0)}%</b> per dollar bet. Every bet was graded by a model that never saw the game in advance.</p>
                <p><b>Honesty note:</b> going forward we expect less than that — the model's own claim is a small single-digit edge — and these picks are tracked publicly before any real money is staked.</p>
              </div>
            </div>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = closeDetail;
      $("sheet-bg").onclick = closeDetail;
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    document.addEventListener("keydown", (e: any) => { if (e.key === "Escape" && detail) closeDetail(); });

    // ===================== RESULTS TAB =====================
    const recCell = (o: any) => (o ? `${o.wins}-${o.losses}${o.pushes ? "-" + o.pushes : ""}` : "—");
    const pctCell = (v: any) => (v == null ? "—" : (v * 100).toFixed(1) + "%");
    const roiCell = (v: any) => (v == null ? "—" : `<span class="roi ${v >= 0 ? "pos" : "neg"}">${(v >= 0 ? "+" : "") + (v * 100).toFixed(1)}%</span>`);

    function mergeRecs(list: any[]) {
      const out: any = { n: 0, wins: 0, losses: 0, pushes: 0, units_net: 0, _staked: 0, _roiN: 0, _roiSum: 0 };
      list.forEach((o: any) => {
        if (!o) return;
        out.n += o.n || 0; out.wins += o.wins || 0; out.losses += o.losses || 0; out.pushes += o.pushes || 0;
        if (o.units_net != null) out.units_net += o.units_net;
        if (o.units_staked != null) out._staked += o.units_staked;
        if (o.roi != null && o.n) { out._roiSum += o.roi * o.n; out._roiN += o.n; }
      });
      if (!out.n) return null;
      out.hit_rate = out.wins + out.losses ? out.wins / (out.wins + out.losses) : null;
      out.roi = out._staked ? out.units_net / out._staked : (out._roiN ? out._roiSum / out._roiN : null);
      return out;
    }

    function resultsTable(title: string, rows: { label: string; o: any }[]) {
      const body = rows.filter((r) => r.o && r.o.n).map((r) => `<tr>
        <td>${r.label}</td>
        <td class="num">${(r.o.n || 0).toLocaleString()}</td>
        <td class="rec">${recCell(r.o)}</td>
        <td class="hr">${pctCell(r.o.hit_rate)}</td>
        <td>${roiCell(r.o.roi)}</td>
      </tr>`).join("");
      if (!body) return "";
      return `<div class="anz-card">
        <div class="anz-card-h">${esc(title)}</div>
        <table class="anztab"><thead><tr><th></th><th>Picks</th><th>Record</th><th>Win rate</th><th>Return</th></tr></thead><tbody>${body}</tbody></table>
      </div>`;
    }

    // ---- DEEP ANALYTICS (analytics_deep block; graceful fallback to the classic page) ----
    async function loadAnalyticsDeep() {
      if (analyticsDeep || adTried) return analyticsDeep;
      adTried = true;
      analyticsDeep = (livePayload && livePayload.analytics_deep) || (payload && payload.analytics_deep) || (indexData && indexData.analytics_deep) || null;
      if (!analyticsDeep) { try { analyticsDeep = await snap("analytics_deep"); } catch {} }
      if (analyticsDeep && !analyticsDeep.cuts) analyticsDeep = null; // malformed → fallback
      return analyticsDeep;
    }
    // Jargon-free section labels for each cut.
    const CUT_META: any = {
      by_quality: "By pick quality",
      by_sport: "By league",
      by_market: "By pick type",
      by_price_band: "By price range",
      by_side: "Overs vs. unders",
      by_theme: "By theme",
      by_month: "By month",
      by_day_of_week: "By day of week",
      by_line_level: "By total line",
    };
    const CUT_ORDER = ["by_quality", "by_sport", "by_market", "by_price_band", "by_side", "by_theme", "by_month", "by_day_of_week", "by_line_level"];
    function prettyKey(k: any) {
      const s = String(k == null || k === "" ? "—" : k);
      const map: any = { over: "Overs", under: "Unders", OVER: "Overs", UNDER: "Unders", heat_day: "Heat-day picks", heat: "Heat-day picks", split_books: "Split-book picks", mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer", total: "Totals", spread: "Spreads", moneyline: "Moneylines", strong: "◆◆◆ Strong", good: "◆◆ Good", lean: "◆ Lean" };
      if (map[s] != null) return map[s];
      return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
    }
    // One cut → a compact module: hit% bar (breakeven tick at 52.4%) always paired with ROI + n.
    function adCutModule(cutKey: string, rows: any[]) {
      if (!Array.isArray(rows) || !rows.length) return "";
      const body = rows.map((r: any) => {
        const hit = r.hit != null && !isNaN(Number(r.hit)) ? Number(r.hit) : null;
        const roi = r.roi != null && !isNaN(Number(r.roi)) ? Number(r.roi) : null;
        const ci = Array.isArray(r.hit_ci95) ? r.hit_ci95 : Array.isArray(r.ci95) ? r.ci95 : Array.isArray(r.ci) ? r.ci : null;
        const w = hit != null ? Math.max(4, Math.min(100, hit * 100)) : 0;
        return `<div class="ad-row">
          <span class="ad-k">${prettyKey(r.key)}<span class="ad-n">n=${(r.n || 0).toLocaleString()}${ci ? ` · CI ${(Number(ci[0]) * 100).toFixed(0)}–${(Number(ci[1]) * 100).toFixed(0)}%` : ""}</span></span>
          <span class="ad-rec">${esc(r.record || "")}</span>
          <span class="ad-barwrap" title="win rate${hit != null ? ` ${(hit * 100).toFixed(1)}%` : ""} · breakeven ≈52.4% at typical prices">
            ${hit != null ? `<span class="ad-bar ${roi != null && roi < 0 ? "neg" : ""}" style="width:${w.toFixed(1)}%"></span>` : ""}
            <span class="ad-be" style="left:52.4%"></span>
            ${hit != null ? `<span class="ad-hit">${(hit * 100).toFixed(1)}%</span>` : ""}
          </span>
          <span class="ad-roi ${roi == null ? "dim" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + (roi * 100).toFixed(1) + "%"}</span>
        </div>`;
      }).join("");
      return `<div class="anz-card"><div class="anz-card-h">${CUT_META[cutKey] || prettyKey(cutKey)}</div><div class="ad-rows">${body}</div></div>`;
    }
    function adEdgesModule(list: any[]) {
      if (!Array.isArray(list) || !list.length) return "";
      const cards = list.map((e: any) => {
        const roi = e.roi != null && !isNaN(Number(e.roi)) ? Number(e.roi) : null;
        return `<div class="edge ${esc(String(e.status || "").toLowerCase())}">
          <div class="edge-h"><b>${esc(e.name || "")}</b>${e.status ? `<span class="edge-st">${esc(e.status)}</span>` : ""}
            <span class="edge-nums">n=${(e.n || 0).toLocaleString()} · ${e.hit != null ? (Number(e.hit) * 100).toFixed(1) + "%" : "—"} · <span class="${roi != null && roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + (roi * 100).toFixed(1) + "%"}</span></span></div>
          ${e.description ? `<p>${esc(e.description)}</p>` : ""}
        </div>`;
      }).join("");
      return `<div class="anz-card" style="margin-bottom:14px"><div class="anz-card-h">★ Where the edges live</div><div class="edge-list">${cards}</div></div>`;
    }

    async function renderResults() {
      await loadIndex();
      await loadAnalyticsDeep();
      const tr = trackRecord();
      const ov = tr.overall || {};
      const hr = ov.hit_rate != null ? ov.hit_rate * 100 : null;
      const roi = ov.roi != null ? ov.roi * 100 : null;
      const be = ov.breakeven_hit_rate != null ? (ov.breakeven_hit_rate * 100).toFixed(1) : "52.4";
      const byTier = tr.by_tier || {};
      const qualityRows = [
        { label: `<span class="ql strong">◆◆◆ Strong</span>`, o: byTier.featured },
        { label: `<span class="ql good">◆◆ Good</span>`, o: byTier.high },
        { label: `<span class="ql lean">◆ Lean</span>`, o: mergeRecs([byTier.medium, byTier.low]) },
      ];
      const bySport = tr.by_sport || {};
      const leagueRows = SPORTS.map((s) => ({ label: SPORT_LABEL[s], o: bySport[s] }));
      const rh = recipeHistory();
      const mr = monthRecord();
      const fwd = forwardRecord();

      const view = root.querySelector("#results-view");
      view.innerHTML = `
        <div class="anz-hero">
          <div class="ah-lab">DiamondEdge Results</div>
          <h2>Every pick, graded</h2>
          <div class="ah-sub">Every number below comes from picks graded against real final scores — games the model never saw in advance. Win rate needs to beat about ${be}% to make money at typical prices.</div>
          <div class="ah-stats">
            <div class="ah-st"><div class="k">Graded picks</div><div class="v" data-count="${ov.n || 0}" data-loc="1">${(ov.n || 0).toLocaleString()}</div></div>
            <div class="ah-st"><div class="k">Record</div><div class="v">${ov.wins || 0}-${ov.losses || 0}</div></div>
            <div class="ah-st"><div class="k">Win rate</div><div class="v">${hr != null ? hr.toFixed(1) + "%" : "—"}</div></div>
            <div class="ah-st"><div class="k">Return</div><div class="v ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</div></div>
            ${mr ? `<div class="ah-st"><div class="k">This month</div><div class="v">${mr.w}-${mr.l}</div></div>` : ""}
            ${fwd ? `<div class="ah-st"><div class="k">Real picks so far</div><div class="v">${fwd.wins || 0}-${fwd.losses || 0}</div></div>` : ""}
          </div>
        </div>
        <div class="anz-card star">
          <div class="anz-card-h">★ The winning recipe (our Strong totals bets)</div>
          <div class="star-b">Won <b>${(rh.hit * 100).toFixed(1)}%</b> of ${rh.n.toLocaleString()} graded bets from 2022 to 2026 — about <b>${sgn(rh.roi * 100, 0)}%</b> back on every dollar bet. This is the record behind the gold ★ bets on the Games tab.</div>
        </div>
        ${analyticsDeep
          ? `${adEdgesModule(analyticsDeep.edges_summary)}
             <div class="ad-grid">
               ${CUT_ORDER.filter((k) => analyticsDeep.cuts[k]).map((k) => adCutModule(k, analyticsDeep.cuts[k])).join("")}
               ${Object.keys(analyticsDeep.cuts).filter((k) => CUT_ORDER.indexOf(k) < 0).map((k) => adCutModule(k, analyticsDeep.cuts[k])).join("")}
             </div>
             <div class="refnote">Every cut is the same graded record, sliced a different way — win rate always shown with return and sample size.${analyticsDeep.generated_at ? ` Updated ${esc(String(analyticsDeep.generated_at).slice(0, 10))}.` : ""}</div>`
          : `<div class="anz-grid">
               ${resultsTable("By pick quality", qualityRows)}
               ${resultsTable("By league", leagueRows)}
             </div>
             <div class="refnote">Older picks across all leagues are graded the same way — pick first, score after.</div>`}`;
      animateCounters(view);
    }

    // ===================== TODAY (daily brief homepage) =====================
    const briefSource = () => (livePayload && livePayload.daily_brief) || (payload && payload.daily_brief) || null;
    const findGameLive = (gid: any) => {
      const src = livePayload || payload;
      return ((src && src.games) || []).find((g: any) => String(g.game_id) === String(gid)) || null;
    };
    // Degrade path: no served daily_brief → compose a minimal brief from display_pick games.
    function fallbackBrief() {
      const src = livePayload || payload;
      if (!src) return null;
      const t = todayISO();
      const picks: any[] = [];
      ((src.games || []) as any[]).forEach((g: any) => {
        const st0 = String(g.status || "pre").toLowerCase();
        const d = gameLocalDay(g);
        if (st0 !== "live" && d && d !== t) return; // today's slate only
        const pl = displayPick(g);
        if (!pl || pl.action !== "TAKE") return;
        const st = playState(g, pl);
        picks.push({
          sport: g.sport, game_id: String(g.game_id),
          matchup: g.matchup || `${g.away_abbr} @ ${g.home_abbr}`,
          bet: `${pl.side || ""}${pl.price != null ? " · " + fmtOdds(pl.price) : ""}`,
          quality: qualityOf(pl),
          blurb: whySentences(g, pl).slice(0, 2).join(" "),
          result: st === "won" ? "hit" : st === "lost" ? "miss" : st === "pushed" ? "push" : null,
          _fb: true, // composed client-side — first sentence names the side, so lock the whole blurb
        });
      });
      picks.sort((a, b) => Q_RANK[a.quality] - Q_RANK[b.quality]);
      const counts: any = { strong: 0, good: 0, lean: 0 };
      picks.forEach((p) => counts[p.quality]++);
      const mix = ["strong", "good", "lean"].filter((q) => counts[q]).map((q) => `${counts[q]} ${Q_LABEL[q]}`).join(", ");
      const rh = recipeHistory();
      return {
        date: t,
        headline: picks.length
          ? `${picks.length} pick${picks.length > 1 ? "s" : ""} on today's board — ${mix}.`
          : "No picks today — the lines look right to us. Passing is the strategy working, not missing.",
        themes: [], top_picks: picks,
        record_line: `Validated history: ${(rh.hit * 100).toFixed(1)}% winners across ${rh.n.toLocaleString()} graded paper picks (2022–2026), about ${sgn(rh.roi * 100, 0)}% per dollar bet — paper-tracked, not real stakes.`,
        _fallback: true,
      };
    }
    // One hero pick card: crests anchor it, the bet + quality + blurb tell the story.
    function heroCard(p: any, i: number) {
      const g = findGameLive(p.game_id);
      const locked = !isPremium() && (p.quality === "strong" || p.quality === "good") && !p.result;
      const res = p.result === "hit" ? `<span class="hero-res hit">${condCheck} Won</span>`
        : p.result === "miss" ? `<span class="hero-res miss">✗ Lost</span>`
        : p.result === "push" ? `<span class="hero-res push">Push</span>`
        : `<span class="hero-res pend">pending</span>`;
      const mu = g
        ? `<div class="hero-mu"><div class="hero-tm">${gCrest(g, "away")}<i>${esc(g.away_abbr)}</i></div><span class="hero-at">@</span><div class="hero-tm">${gCrest(g, "home")}<i>${esc(g.home_abbr)}</i></div></div>`
        : "";
      const bet = locked
        ? `<button class="lockchip" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
        : `<div class="hero-bet">${esc(p.bet || "")}</div>`;
      const blurbTxt = String(p.blurb || "");
      // Locked blurbs: served briefs open with a safe game preview → show the first
      // sentence; client-composed fallbacks name the side → show none of it.
      const teaser = p._fb ? "There's a validated pick on this game." : blurbTxt.split(". ")[0].slice(0, 120);
      const blurb = blurbTxt
        ? (locked
          ? `<p class="hero-blurb">${esc(teaser)}… <button class="lk-more" data-up="1">unlock the full read</button></p>`
          : `<p class="hero-blurb">${esc(blurbTxt)}</p>`)
        : "";
      return `<article class="hero q-${p.quality}${p.result === "hit" ? " hit" : p.result === "miss" ? " miss" : ""}" data-gid="${esc(p.game_id)}"${locked ? ' data-locked="1"' : ""} style="--i:${i}" role="button" tabindex="0" aria-label="${esc(p.matchup)} — ${locked ? "pick locked" : esc(p.bet || "")}">
        <div class="hero-top"><span class="hero-sport">${esc(SPORT_LABEL[p.sport] || p.sport || "")}</span><span class="hero-q">${qDiamonds(p.quality)}${Q_LABEL[p.quality] || ""}</span>${res}</div>
        ${mu}
        <div class="hero-match">${esc(p.matchup || "")}</div>
        ${bet}${blurb}
      </article>`;
    }
    function renderToday() {
      const view = $("today-view");
      if (!view) return;
      const db = briefSource() || fallbackBrief();
      if (!db) { view.innerHTML = skeletonSlate(4); return; }
      const dd = new Date(String(db.date || todayISO()) + "T12:00:00");
      const dateTxt = isNaN(dd.getTime()) ? String(db.date || "") : dd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      // Headline, themes, top picks, record line — served copy rendered AS-IS (contract rule 1).
      const themes = ((db.themes || []) as any[]).map((t: any, i: number) => `<button class="thc" style="--i:${i}" data-th="${i}">
          <div class="thc-name">${esc(t.name)}</div>
          <div class="thc-text">${esc(t.text)}</div>
          ${t.affected_games && t.affected_games.length ? `<div class="thc-games">${t.affected_games.length} game${t.affected_games.length > 1 ? "s" : ""} on the board →</div>` : ""}
        </button>`).join("");
      const picks = ((db.top_picks || []) as any[]).map((p: any, i: number) => heroCard(p, i)).join("");
      view.innerHTML = `
        <div class="tdy">
          <div class="tdy-top"><span class="tdy-date">${esc(dateTxt)}</span><span class="tdy-src">${db._fallback ? "board summary" : "daily brief"}</span></div>
          <h2 class="tdy-head">${esc(db.headline || "")}</h2>
          ${themes ? `<div class="tdy-lab">Today's story</div><div class="tdy-themes">${themes}</div>` : ""}
          ${picks
            ? `<div class="tdy-lab">Top picks — every sport</div><div class="tdy-picks">${picks}</div>`
            : `<div class="tdy-lab">Top picks</div><div class="tdy-pass">No bets today. We only bet when the books' own numbers look wrong — most days that's a handful of games, some days none. The story above is what we're watching.</div>`}
          ${db.record_line ? `<div class="tdy-record">${esc(db.record_line)}</div>` : ""}
        </div>`;
      // themes → jump to the affected game cards; heroes → detail sheet (or the lock → upgrade)
      view.querySelectorAll(".thc").forEach((b: any) => (b.onclick = () => {
        const t = (db.themes || [])[Number(b.dataset.th)];
        if (t && t.affected_games && t.affected_games.length) jumpToGames(t.affected_games);
      }));
      view.querySelectorAll(".hero").forEach((h: any) => {
        const open = (e: any) => {
          if (e.target && e.target.closest && e.target.closest("[data-up]")) { switchTab("upgrade"); return; }
          if (h.dataset.locked) { switchTab("upgrade"); return; }
          const g = findGameLive(h.dataset.gid);
          if (g) openDetail(g); else jumpToGames([h.dataset.gid]);
        };
        h.onclick = open;
        h.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
      });
      animateCounters(view);
    }
    // Theme tap: switch to the Games tab, select the right league/date, highlight the games.
    async function jumpToGames(gids: any[]) {
      const src = livePayload || payload;
      const g0 = (gids || []).map((id) => ((src && src.games) || []).find((g: any) => String(g.game_id) === String(id))).find(Boolean);
      if (g0 && String(g0.sport || "").toLowerCase() !== league) league = String(g0.sport || "mlb").toLowerCase();
      const needLoad = curDate !== todayISO() || rangeMode;
      curDate = todayISO(); rangeMode = false;
      switchTab("games");
      if (needLoad) await selectDate();
      else {
        root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
        positionInk();
        renderSlate();
      }
      setTimeout(() => {
        let first: any = null;
        (gids || []).forEach((id) => {
          const el = root.querySelector(`.tile[data-gid="${CSS.escape(String(id))}"]`);
          if (el) { el.classList.add("hl"); if (!first) first = el; }
        });
        if (first) first.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "center" });
      }, 160);
    }

    // ===================== SETTINGS =====================
    function renderSettings() {
      const view = $("settings-view");
      if (!view) return;
      const prem = isPremium();
      view.innerHTML = `
        <div class="set-h">Settings</div>
        <div class="set-card">
          <div class="set-k">Membership</div>
          <div class="set-row">
            <div class="sr-txt"><b>DiamondEdge Premium <span class="set-badge ${prem ? "prem" : "free"}">${prem ? "Active" : "Free"}</span></b>
            <span>${prem ? "Every pick unlocked — sides, lines, and the plain-English why." : "Strong and Good picks are locked. Leans, results and the full record stay free."}</span></div>
            <button class="switch ${prem ? "on" : ""}" id="prem-switch" role="switch" aria-checked="${prem}" aria-label="Premium preview"></button>
          </div>
          <div class="set-note">Flip this off to preview the free experience. Payments aren't wired up yet — this is a design preview, and "Subscribe" on the upgrade page simply switches it back on.</div>
        </div>
        <div class="set-card">
          <div class="set-k">Appearance</div>
          <div class="set-about"><b>Dark glass</b> is the DiamondEdge identity — deep charcoal, frosted cards, neon green and red for results, gold reserved for Strong picks. No light theme; the board reads best dark.</div>
        </div>
        <div class="set-card">
          <div class="set-k">About</div>
          <button class="set-link" id="set-how">ⓘ How picks work<em>→</em></button>
          <button class="set-link" id="set-results">Our full record<em>→</em></button>
          <button class="set-link" id="set-upgrade">DiamondEdge Premium<em>→</em></button>
          <div class="set-about" style="margin-top:10px">Every pick is graded in the open against real final scores — games the model never saw in advance. Hit-rates always travel with prices and returns, and the live record is paper-tracked, not real stakes.</div>
        </div>`;
      $("prem-switch").onclick = () => {
        setPremium(!isPremium());
        renderSettings();
        renderToday();
        if ($("slate-body")) renderSlate();
      };
      $("set-how").onclick = () => openRecipeSheet();
      $("set-results").onclick = () => switchTab("results");
      $("set-upgrade").onclick = () => switchTab("upgrade");
    }

    // ===================== UPGRADE (stub checkout — no real payments) =====================
    function renderUpgrade() {
      const view = $("upgrade-view");
      if (!view) return;
      const rh = recipeHistory();
      const fwd = forwardRecord();
      const perk = (t: string, s: string) => `<div class="up-perk"><span class="pk-ic"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></span><div><b>${t}</b><span>${s}</span></div></div>`;
      view.innerHTML = `
        <div class="up-hero">
          <div class="up-dia" aria-hidden="true"></div>
          <h2>Every pick. Every why. Nothing hidden.</h2>
          <div class="up-sub">One honest model, graded in public since 2022. Premium unlocks the side and line on every Strong and Good pick — plus the plain-English read behind each one.</div>
          <div class="up-stats">
            <div class="up-st"><div class="v">${(rh.hit * 100).toFixed(1)}%</div><div class="k">win rate</div></div>
            <div class="up-st"><div class="v">${rh.n.toLocaleString()}</div><div class="k">graded bets</div></div>
            <div class="up-st"><div class="v">${sgn(rh.roi * 100, 0)}%</div><div class="k">per dollar bet</div></div>
            <div class="up-st"><div class="v">'22–'26</div><div class="k">out of sample</div></div>
          </div>
        </div>
        <div class="up-perks">
          ${perk("Every Strong ◆◆◆ and Good ◆◆ pick, unlocked", "The exact side, line and price we froze before the game — never re-written after the fact.")}
          ${perk("The why, in plain English", "Two or three sentences a first-time reader can follow: the model's number, the line it beats, and the history of bets made exactly this way.")}
          ${perk("Live reads and score overlay", "Fresh scores every minute during games, with each pick's progress toward its line.")}
          ${perk("The full record, cut every way", "Deep results by league, price, pick type and theme — wins and losses alike. It's the same record we show free users; you just get the picks that build it.")}
        </div>
        <div class="up-price"><span class="amt">$9.99</span><span class="per">/ month</span></div>
        <div class="up-price-note">placeholder price — payments aren't live yet</div>
        <button class="up-cta" id="up-sub">Unlock DiamondEdge</button>
        <button class="up-back" id="up-back">Not now — keep the free picks</button>
        <div class="up-honest">Honesty first: the numbers above are the real validated history — ${rh.n.toLocaleString()} paper picks graded against final scores across games the model never trained on${fwd ? `, and the live paper record so far is ${fwd.wins || 0}-${fwd.losses || 0}` : ""}. Going forward we expect a smaller edge than the backtest, and we say so on every pick. Nothing is charged here — Subscribe simply unlocks the preview.</div>`;
      $("up-sub").onclick = () => {
        // STRIPE WIRE-IN POINT: real checkout replaces this — create a Checkout Session
        // server-side, redirect, and set the entitlement from the confirmed webhook.
        setPremium(true);
        const d = document.createElement("div");
        d.className = "up-done";
        d.setAttribute("role", "status");
        d.innerHTML = `<div class="ud-inner"><div class="ud-dia"></div><h3>You're in.</h3><p>Every pick is unlocked — welcome to the board.</p></div>`;
        document.body.appendChild(d);
        setTimeout(() => {
          d.remove();
          if ($("slate-body")) renderSlate();
          switchTab("today");
        }, REDUCE ? 250 : 1500);
      };
      $("up-back").onclick = () => switchTab("today");
    }

    // ===================== HEADER / SHELL =====================
    const NAV_ICONS: any = {
      today: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 5.6L20 10.8l-5.8 2.2L12 19l-2.2-6L4 10.8l5.8-2.2z"/></svg>`,
      games: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>`,
      results: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20v-7M12 20V5M19 20v-10"/></svg>`,
      settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8"/></svg>`,
    };
    const NAV_LABEL: any = { today: "Today", games: "Games", results: "Results", settings: "Settings" };
    function renderShell() {
      const navTabs = ["today", "games", "results", "settings"];
      root.innerHTML = `
        <header><div class="hbar">
          <div class="brand" id="brand">
            <div class="diamond"></div>
            <div><h1>Diamond<b>Edge</b></h1><div class="tag">Today · Games · Results</div></div>
          </div>
          <div class="hspacer"></div>
          <div class="toptabs">
            ${navTabs.map((t) => `<button data-tab="${t}" class="${tab === t ? "on" : ""}">${NAV_LABEL[t]}</button>`).join("")}
          </div>
        </div></header>
        <main>
          <div id="today-view" style="display:${tab === "today" ? "block" : "none"}"></div>
          <div id="games-view" style="display:${tab === "games" ? "block" : "none"}"></div>
          <div id="results-view" style="display:none"></div>
          <div id="settings-view" style="display:none"></div>
          <div id="upgrade-view" style="display:none"></div>
        </main>
        <nav class="bnav" id="bnav" aria-label="Primary">
          ${navTabs.map((t) => `<button data-tab="${t}" class="${tab === t ? "on" : ""}">${NAV_ICONS[t]}<span>${NAV_LABEL[t]}</span></button>`).join("")}
        </nav>`;
      root.querySelectorAll(".toptabs [data-tab], .bnav [data-tab]").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
      $("brand").onclick = () => switchTab("today");
    }

    function switchTab(t: string) {
      if (t === tab) return;
      tab = t;
      TABS.forEach((k) => { const v = $(k + "-view"); if (v) v.style.display = k === t ? "block" : "none"; });
      root.querySelectorAll(".toptabs [data-tab], .bnav [data-tab]").forEach((b: any) => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "today") renderToday();
      if (t === "results" && !$("results-view").innerHTML.trim()) renderResults();
      if (t === "settings") renderSettings();
      if (t === "upgrade") renderUpgrade();
      if (t === "games") requestAnimationFrame(() => { positionInk(); recenterStrip(false); });
      window.scrollTo(0, 0);
    }

    // ===================== INIT =====================
    (async function init() {
      // Native-shell detection: the Capacitor WebView appends DiamondEdgeNative/1.0 to the
      // UA and injects window.Capacitor; ?native=1 forces it for testing. Suppresses
      // web-only chrome via body.native (CSS).
      const NATIVE = /DiamondEdgeNative/i.test(navigator.userAgent) || !!(window as any).Capacitor || /[?&]native=1/.test(location.search);
      if (NATIVE) document.body.classList.add("native");
      renderShell();
      renderScoresChrome();
      bindPull();
      renderToday(); // skeleton until the payload lands
      await loadIndex();
      payload = await loadDay(curDate);
      league = bestLeague();
      root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
      positionInk();
      renderSlate();
      renderToday();
      requestAnimationFrame(() => { positionInk(); recenterStrip(false); });
      // live-score freshness: poll the tiny live_scores key while games are on
      setInterval(pollLiveScores, 50 * 1000);
      document.addEventListener("visibilitychange", () => { if (!document.hidden) pollLiveScores(); });
      pollLiveScores();
      // debug hook: inject a live_scores snapshot without waiting for the poller
      root._injectLiveScores = (ls: any) => { liveScores = ls; const ch = applyLiveScores(); if (ch && tab === "games" && !rangeMode) renderSlate(true); if (detail) refreshSheetScore(detail); return ch; };
    })();
  }, []);

  return <div id="app-root" />;
}
