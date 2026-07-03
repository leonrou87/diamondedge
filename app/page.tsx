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

    // ===================== EDITORIAL ICON SET (inline SVG, stroke = currentColor) =====================
    const IC: any = {
      fire: `<svg viewBox="0 0 24 24"><path d="M12 21c-3.9 0-6.5-2.4-6.5-6 0-2.6 1.7-4.6 3-6.1.4 1 .9 1.8 1.9 2.4-.3-2.5.6-5.6 3.4-7.3-.3 2 .3 3.4 1.5 4.8 1.3 1.5 3.2 3.2 3.2 6.2 0 3.6-2.6 6-6.5 6z"/></svg>`,
      streak: `<svg viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L9.5 22 19.5 9.5H12.5z"/></svg>`,
      trend: `<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>`,
      weather: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/></svg>`,
      travel: `<svg viewBox="0 0 24 24"><path d="M10.5 13.5L3 11l1.5-1.5 6.5 1L16.5 5c.8-.8 2-.8 2.6-.1.7.6.7 1.8-.1 2.6L13.5 13l1 6.5L13 21l-2.5-7.5z"/></svg>`,
      rest: `<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>`,
      books: `<svg viewBox="0 0 24 24"><path d="M12 6.5C10.5 5 8.4 4.5 5.5 4.5c-.8 0-1.5.1-2.5.3v13.4c1-.2 1.7-.3 2.5-.3 2.9 0 5 .6 6.5 2 1.5-1.4 3.6-2 6.5-2 .8 0 1.5.1 2.5.3V4.8c-1-.2-1.7-.3-2.5-.3-2.9 0-5 .5-6.5 2z"/><path d="M12 6.5V20"/></svg>`,
      record: `<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.2"/><path d="M8.8 13.4L7 21l5-2.6L17 21l-1.8-7.6"/></svg>`,
      pitcher: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M7.5 4.5c1.6 2 2.5 4.6 2.5 7.5s-.9 5.5-2.5 7.5M16.5 4.5c-1.6 2-2.5 4.6-2.5 7.5s.9 5.5 2.5 7.5"/></svg>`,
      venue: `<svg viewBox="0 0 24 24"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
      h2h: `<svg viewBox="0 0 24 24"><path d="M7 4v16M17 4v16M7 8h10M7 16h10"/></svg>`,
      form: `<svg viewBox="0 0 24 24"><path d="M4 19V9M9.5 19V5M15 19v-8M20.5 19V8"/></svg>`,
    };
    const icon = (name: string, cls = "") => `<span class="eic ${cls}" aria-hidden="true">${IC[name] || IC.trend}</span>`;
    // Match a storyline/fact to its icon by keywords.
    function iconForText(s: any) {
      const t = String(s || "").toLowerCase();
      if (/heat|hot|temperature|°f|warm|weather|wind|forecast/.test(t)) return "fire";
      if (/streak|straight|row|run of/.test(t)) return "streak";
      if (/book|line|number|price|market|moved|split|disagree/.test(t)) return "books";
      if (/travel|getaway|road trip|flight/.test(t)) return "travel";
      if (/rest|days off|fatigue|back-to-back/.test(t)) return "rest";
      if (/world cup|cup|record|graded|history|winners/.test(t)) return "record";
      return "trend";
    }

    // ===================== EDITORIAL COPY GUARD =====================
    // House tone: confident sports journalism. The graded record is the honesty —
    // hedging phrases and internal tags never reach the page.
    function cleanCopy(s: any) {
      let t = String(s == null ? "" : s);
      t = t.replace(/\s*[—–-]?\s*paper-?tracked[^.;]*(\.|;|$)/gi, ".")
        .replace(/\bpaper[- ](picks?|record|ledger|bets?)\b/gi, "$1")
        .replace(/\bpaper[- ]only\b/gi, "")
        .replace(/,?\s*not real stakes\b[.,]?/gi, "")
        .replace(/\bexperimental\b/gi, "emerging")
        .replace(/,?\s*\bnot a bet\b[.,]?/gi, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s+([.,;])/g, "$1")
        .replace(/\.\s*\./g, ".")
        .trim();
      return t;
    }
    // Strip whole sentences that are pure hedging.
    function cleanBlurb(s: any) {
      const parts = String(s || "").split(/(?<=[.!?])\s+/);
      const keep = parts.filter((x) => !/paper|experimental|caveat|not (?:a|real)\b/i.test(x));
      return cleanCopy((keep.length ? keep : parts).join(" "));
    }
    const DE_PICK = `<span class="de-k">◆ DiamondEdge Pick</span>`;

    // ===================== GAME ARTICLES (served game.article / game.streaks, tolerant reader) =====================
    // Contract (picks_engine/ARTICLES_CONTRACT.md) is landing server-side — read defensively,
    // degrade to a client-composed preview from the same real fields when absent.
    function gameArticle(g: any) {
      const a = g && g.article;
      if (!a || typeof a !== "object") return null;
      const paras: string[] = Array.isArray(a.body) ? a.body.map((x: any) => String(x))
        : typeof a.body === "string" ? a.body.split(/\n{2,}|\n/)
        : Array.isArray(a.paragraphs) ? a.paragraphs.map((x: any) => String(x))
        : a.text ? String(a.text).split(/\n{2,}|\n/) : [];
      const facts = Array.isArray(a.facts) ? a.facts : Array.isArray(a.fact_rows) ? a.fact_rows : [];
      const out = {
        headline: a.headline || a.title || null,
        dek: a.dek || a.subhead || a.lede || null,
        paras: paras.map(cleanBlurb).filter(Boolean),
        facts: facts.map((f: any) => (typeof f === "string" ? { text: f } : f)).filter((f: any) => f && (f.text || f.label)),
        served: true,
      };
      return (out.headline || out.paras.length) ? out : null;
    }
    function gameStreaks(g: any) {
      const raw = g && g.streaks;
      let list: any[] = Array.isArray(raw) ? raw : raw && Array.isArray(raw.items) ? raw.items : [];
      list = list.map((s: any) => (typeof s === "string" ? { text: s } : s)).filter((s: any) => s && s.text);
      if (list.length) return list.slice(0, 4);
      // fallback: derive form streaks from pregame_intel
      const f = g && g.pregame_intel && g.pregame_intel.form;
      const out: any[] = [];
      if (f) {
        const add = (ab: any, x: any) => { if (x && x.last10_record) out.push({ text: `${ab} ${x.last10_record} last 10`, icon: "form" }); };
        add(g.away_abbr, f.away); add(g.home_abbr, f.home);
      }
      return out;
    }
    // **bold** markdown → <b> (article bodies carry bold key points)
    const mdBold = (s: string) => esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    // Compose a preview when no served article exists: lede from the pick's why,
    // icon fact rows from pregame_intel, matchup framing from predicted_score.
    function composedPreview(g: any) {
      const pl = displayPick(g);
      const ps = g.predicted_score || {};
      const paras: string[] = [];
      if (pl && pl.action === "TAKE") {
        paras.push(...whySentences(g, pl).slice(0, 2));
      } else if (ps.home != null && ps.away != null) {
        paras.push(`Our model's expected final is ${g.away_abbr} ${num(ps.away, 1)}–${num(ps.home, 1)} ${g.home_abbr}. The books' numbers land close to ours across every market, so there's no DiamondEdge Pick here — that discipline is why the record holds up.`);
      }
      return { headline: null, dek: null, paras: paras.map(cleanBlurb).filter(Boolean), facts: [], served: false };
    }
    // Icon fact rows for a game (served article facts win; else pregame_intel).
    function factRows(g: any, art: any) {
      const rows: string[] = [];
      const fr = (ic: string, label: string, text: string) =>
        `<div class="frow">${icon(ic)}<span class="fr-k">${esc(label)}</span><span class="fr-t">${text}</span></div>`;
      if (art && art.facts && art.facts.length) {
        art.facts.slice(0, 5).forEach((f: any) => rows.push(fr(f.icon && IC[f.icon] ? f.icon : iconForText((f.label || "") + " " + (f.text || "")), f.label || "", mdBold(cleanBlurb(f.text || "")))));
        return rows;
      }
      const pi = g.pregame_intel;
      if (!pi) return rows;
      const pit = pi.pitchers || {};
      if ((pit.away && pit.away.name) || (pit.home && pit.home.name)) {
        const pp = (ab: any, p: any) => p && p.name ? `${ab} ${esc(p.name)}${p.era != null ? ` (${num(p.era, 2)} ERA)` : ""}` : null;
        const t = [pp(g.away_abbr, pit.away), pp(g.home_abbr, pit.home)].filter(Boolean).join(" vs ");
        if (t) rows.push(fr("pitcher", "Mound", t));
      }
      if (pi.venue) rows.push(fr("venue", "Venue", `${esc(pi.venue)}${pi.park_factor != null ? ` · park ${num(pi.park_factor, 2)}` : ""}`));
      const f = pi.form || {};
      if (f.away && f.away.last10_record && f.home && f.home.last10_record) {
        const rf = (x: any) => x.runs_for_avg != null ? `, ${num(x.runs_for_avg, 1)} rpg` : "";
        rows.push(fr("form", "Form", `${g.away_abbr} ${esc(f.away.last10_record)}${rf(f.away)} · ${g.home_abbr} ${esc(f.home.last10_record)}${rf(f.home)} last 10`));
      }
      const r = pi.rest || {};
      if ((r.away && r.away.days_off != null && r.away.days_off >= 2) || (r.home && r.home.days_off != null && r.home.days_off >= 2)) {
        const rr = (ab: any, x: any) => x && x.days_off != null ? `${ab} ${x.days_off} day${x.days_off === 1 ? "" : "s"} off` : null;
        rows.push(fr("rest", "Rest", [rr(g.away_abbr, r.away), rr(g.home_abbr, r.home)].filter(Boolean).join(" · ")));
      }
      const h = pi.h2h;
      if (h && h.record && h.games) rows.push(fr("h2h", "Season series", `${esc(String(h.record))} across ${h.games} meetings`));
      return rows.slice(0, 4);
    }

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
    // ONE compact typographic market strip — "CLE −1.5 · O/U 8 · CLE −130". No stacked
    // rows, no boxes: the taken market's segment is the tinted take chip ("▲ OVER 8 −115 ◆◆◆")
    // and the ✓/✗ resolves on it post-game. Missing markets simply don't render.
    function marketStrip(g: any, pick: any, st: string, locked = false, excludePick = false) {
      const q = pick ? qualityOf(pick) : null;
      const mk = pick ? pick.market : null;
      const mark = pick ? resMark(st) : "";
      const seg = (m: string, v: string) => {
        if (pick && mk === m) {
          if (excludePick) return ""; // the banner carries the pick — the strip shows the rest of the board
          // FREE MODE: the pick exists and its quality shows, but the side/line is locked.
          if (locked) return `<span class="ms take q-${q} locked"><span class="ms-lk">${lockSvg}</span><span class="ms-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}</span>`;
          return `<span class="ms take q-${q} ${st}">${pickArrow(pick)} ${esc(pick.side || v)}${pick.price != null ? ` <i>${fmtOdds(pick.price)}</i>` : ""}${qDiamonds(q)}${mark}</span>`;
        }
        return v ? `<span class="ms">${v}</span>` : "";
      };
      const sp = g.spread_pick;
      const tp = g.total_pick;
      const mp = g.ml_pick; const mpr = (mp && mp.prices) || {};
      let mlTxt = "";
      if (g.sport === "soccer" && mpr.home != null && mpr.draw != null) mlTxt = `${fmtOdds(mpr.home)}·${fmtOdds(mpr.draw)}·${fmtOdds(mpr.away)}`;
      else if (mp && (mp.price ?? mpr.home ?? mpr.away) != null) mlTxt = `${esc(mp.side || "ML")} ${fmtOdds(mp.price ?? mpr.home ?? mpr.away)}`;
      const parts = [
        seg("spread", sp && sp.line != null ? `${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, sp))}` : ""),
        seg("total", tp && tp.line != null ? `O/U ${num(tp.line)}` : ""),
        seg("moneyline", mlTxt),
      ].filter(Boolean);
      if (!parts.length) return "";
      return `<div class="mline">${parts.join(`<span class="msep">·</span>`)}</div>`;
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

    // The pick's state, phrased for the banner: "✓ WON" / "✗ LOST" / "6 of 8 · Bot 5th".
    function pickStateTxt(g: any, pl: any, st: string) {
      if (st === "won") return { txt: `${condCheck} WON`, cls: "won" };
      if (st === "lost") return { txt: "✗ LOST", cls: "lost" };
      if (st === "pushed") return { txt: "PUSH", cls: "pushed" };
      if (st === "clinched") return { txt: `${condCheck} CLINCHED`, cls: "won" };
      if (st === "cooked") return { txt: "✗ LINE PASSED", cls: "lost" };
      if (st === "inplay") {
        const ca = g.current_actuals || {};
        const per = ca.period_label ? esc(ca.period_label) : "";
        if (pl.market === "total" && ca.total_so_far != null) {
          const line = pl.line != null ? pl.line : (() => { const m = String(pl.side || "").match(/(\d+(\.\d+)?)/); return m ? Number(m[1]) : null; })();
          if (line != null) return { txt: `${num(Number(ca.total_so_far), 0)} of ${lineStr(line)}${per ? ` · ${per}` : ""}`, cls: "inplay" };
        }
        return { txt: `IN PLAY${per ? ` · ${per}` : ""}`, cls: "inplay" };
      }
      return null;
    }
    // ===================== DIAMONDEDGE PICK BANNER =====================
    // The branded, frozen pick — pinned to every tile that has one, in every game state.
    // Once a game starts, this stays the loudest element on the tile: the side never
    // moves, the outcome lands directly on it.
    function pickBanner(g: any, pl: any, st: string, locked: boolean) {
      const q = qualityOf(pl);
      if (locked) {
        return `<div class="pickban locked" data-up="1" role="button" aria-label="DiamondEdge Pick — locked">
          <div class="pb-top"><span class="pb-brand">◆ DiamondEdge Pick</span><span class="pb-lk">${lockSvg}</span></div>
          <div class="pb-main"><span class="pb-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}<span class="pb-unlock">Unlock</span></div>
        </div>`;
      }
      const state = pickStateTxt(g, pl, st);
      return `<div class="pickban q-${q} ${st}">
        <div class="pb-top"><span class="pb-brand">◆ DiamondEdge Pick</span>${qDiamonds(q)}</div>
        <div class="pb-main"><span class="pb-side">${pickArrow(pl)} ${esc(pl.side || "—")}</span>${pl.price != null ? `<i class="pb-px">${fmtOdds(pl.price)}</i>` : ""}${state ? `<span class="pb-res ${state.cls}">${state.txt}</span>` : ""}</div>
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
      // The card carries the verdict through LIGHT, not borders: quality glow pre-game,
      // result glow after. Inside: typography + one inline market strip.
      const resCls = st === "won" || st === "clinched" ? "res-won" : st === "lost" || st === "cooked" ? "res-lost" : st === "pushed" ? "res-push" : "";
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-note">${num(gs.score.total, 0)} ${SPORT_UNIT[g.sport] || ""} total</div>` : "";
      // The DiamondEdge Pick is a pinned banner in EVERY state — on live and final tiles
      // it stays the loudest element, the score never demotes it.
      return `<article class="tile ${gs.kind}${q ? ` q-${q}` : ""}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)}${pick ? (locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pick.side || "")}`) : ""} — open details">
        ${tileStatus(g, gs, q)}
        <div class="t-teams">${tileRow(g, "away", gs)}${tileRow(g, "home", gs)}</div>
        ${totOnly}
        ${pick ? pickBanner(g, pick, st, locked) : ""}
        ${gs.kind === "live" && pick && !locked ? pickProgress(g, pick, st) : ""}
        ${marketStrip(g, pick, st, locked, !!pick)}
      </article>`;
    }

    // ===================== FEATURED GAME (highest exact conviction) =====================
    // Conviction = the quality ladder (Strong > Good > Lean, per the house vocabulary)
    // ranked at FULL precision behind the scenes by the exact p_correct decimal within
    // each tier — raw p is never comparable across markets (a −188 spread lean carries a
    // high p with no value) and never displayed. The winner gets the big hero treatment.
    function convictionSort(aP: any, aQ: number, bP: any, bQ: number) {
      if (aQ !== bQ) return aQ - bQ;
      const ap = aP != null ? Number(aP) : -1, bp = bP != null ? Number(bP) : -1;
      return bp - ap;
    }
    function featuredPick(games: any[]) {
      let best: any = null;
      games.forEach((g: any) => {
        const pl = displayPick(g);
        if (!pl || pl.action !== "TAKE") return;
        const cand = { g, pl, p: pl.p != null ? Number(pl.p) : null, qr: Q_RANK[qualityOf(pl)] };
        if (!best || convictionSort(cand.p, cand.qr, best.p, best.qr) < 0) best = cand;
      });
      return best;
    }
    function featuredCard(g: any, pl: any) {
      const gs = gameState(g);
      const q = qualityOf(pl);
      const st = playState(g, pl);
      const locked = pickLocked(pl, st);
      const resCls = st === "won" || st === "clinched" ? "res-won" : st === "lost" || st === "cooked" ? "res-lost" : st === "pushed" ? "res-push" : "";
      const res = st === "won" ? `<span class="ft-res won">${condCheck} WON</span>`
        : st === "lost" ? `<span class="ft-res lost">✗ LOST</span>`
        : st === "pushed" ? `<span class="ft-res pushed">PUSH</span>`
        : st === "clinched" ? `<span class="ft-res won">${condCheck} CLINCHED</span>`
        : st === "cooked" ? `<span class="ft-res lost">✗ LINE PASSED</span>`
        : st === "inplay" ? `<span class="ft-res inplay"><span class="ip-dot"></span>IN PLAY</span>` : "";
      const sc = gs.score;
      const side = (which: "away" | "home") => {
        const ab = which === "away" ? g.away_abbr : g.home_abbr;
        const mine = sc && sc.split && sc.home != null ? (which === "home" ? sc.home : sc.away) : null;
        const other = sc && sc.split && sc.home != null ? (which === "home" ? sc.away : sc.home) : null;
        const win = gs.kind === "final" && mine != null && mine > other;
        return `<div class="ft-tm ${win ? "win" : ""}">${gCrest(g, which)}<i>${esc(ab)}</i>${mine != null ? `<b>${num(mine, 0)}</b>` : ""}</div>`;
      };
      const mid = gs.kind === "live"
        ? `<div class="ft-mid live"><span class="livedot"></span>${esc(gs.label !== "Live" && gs.label ? gs.label : "LIVE")}</div>`
        : gs.kind === "final" ? `<div class="ft-mid">FINAL</div>`
        : `<div class="ft-mid">${esc(gs.si.hasTime && gs.si.time ? gs.si.time : gs.si.date || "@")}</div>`;
      const take = locked
        ? `<button class="lockchip ft-lock" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
        : `<div class="ft-take q-${q} ${st}"><span class="ft-de">◆ DiamondEdge Pick</span>${pickArrow(pl)} <b>${esc(pl.side || "—")}</b>${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}<span class="ft-q">${qDiamonds(q)}${Q_LABEL[q]}</span>${res}</div>`;
      return `<article class="feat q-${q} ${gs.kind}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id)}" role="button" tabindex="0"
        aria-label="Featured — ${esc(g.away_abbr)} at ${esc(g.home_abbr)}${locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pl.side || "")}`} — open details">
        <div class="ft-top"><span class="ft-lab">◆ Featured</span><span class="ft-sport">${esc(SPORT_LABEL[g.sport] || g.sport || "")}</span></div>
        <div class="ft-mu">${side("away")}${mid}${side("home")}</div>
        ${take}
        ${gs.kind === "live" && !locked ? pickProgress(g, pl, st) : ""}
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

    // ONE continuous frosted capsule; days are quiet typographic cells inside it and a
    // fluid lens slides under the active day. No per-pill borders.
    function dateStripHtml() {
      const cells: string[] = [`<span class="dlens" id="dlens" aria-hidden="true"></span>`];
      const today = todayISO();
      let d = shiftDate(today, -13);
      if (d < minDate) d = minDate;
      let cur = d;
      while (cur <= today) {
        const dt = new Date(cur + "T12:00:00");
        const isToday = cur === today;
        const on = cur === curDate && !rangeMode;
        cells.push(`<button class="dcell ${on ? "on" : ""} ${isToday ? "today" : ""}" data-date="${cur}" aria-label="${dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}">
          <span class="dc-wd">${isToday ? "Today" : dt.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}</span>
          <span class="dc-d">${dt.getDate()}</span>
        </button>`);
        cur = shiftDate(cur, 1);
      }
      return cells.join("");
    }
    // Slide the lens under the active day (it lives IN the scroll content, so it scrolls with the cells).
    function positionLens() {
      const strip = $("datestrip"), lens = $("dlens");
      if (!strip || !lens) return;
      const on = strip.querySelector(".dcell.on");
      if (!on) { lens.style.opacity = "0"; return; }
      lens.style.opacity = "1";
      lens.style.width = on.offsetWidth + "px";
      lens.style.transform = `translateX(${on.offsetLeft}px)`;
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
            <span class="calwrap"><button class="dtool cal" id="cal-btn" title="Pick a date" aria-label="Pick a date"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M3.5 9.6h17M8 3v3.4M16 3v3.4"/><circle cx="12" cy="14.8" r="1.4" fill="currentColor" stroke="none"/></svg></button><input type="date" id="date-input" aria-label="Pick a date" value="${curDate}" min="${minDate}" max="${maxDate}"></span>
            <button class="dtool hist ${histOpen || rangeMode ? "on" : ""}" id="hist-btn" title="Scan a date range">History</button>
          </div>
        </div>
        <div id="hist-area">${histOpen ? histPanel() : ""}</div>
        <div id="slate-body">${skeletonSlate()}</div>`;
      bindScoresChrome();
      requestAnimationFrame(() => { positionInk(); positionLens(); });
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
          // Featured hero: the single highest-conviction pick game leads the slate.
          const ft = featuredPick(games);
          const rest = ft ? games.filter((g: any) => g !== ft.g) : games;
          body.innerHTML = `${ft ? featuredCard(ft.g, ft.pl) : ""}<div class="slate">${rest.map((g: any, i: number) => gameCard(g, i)).join("")}</div>
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
      if (di) di.onchange = () => { if (!di.value) return; curDate = di.value; rangeMode = false; selectDate(); };
      // The real <input type=date> sits ON TOP of the calendar button (opacity 0), so a tap
      // opens the native picker everywhere; showPicker() is the enhancement, not the only path.
      const cal = $("cal-btn");
      if (cal && di) {
        di.onclick = (e: any) => { e.stopPropagation(); try { di.showPicker(); } catch {} };
        cal.onclick = () => { try { di.showPicker(); } catch { try { di.focus(); di.click(); } catch {} } };
      }
      const hb = $("hist-btn");
      if (hb) hb.onclick = () => { histOpen = !histOpen; const ha = $("hist-area"); if (ha) { ha.innerHTML = histOpen ? histPanel() : ""; bindHist(); } hb.classList.toggle("on", histOpen || rangeMode); };
      bindHist();
      bindMeta();
      window.addEventListener("resize", () => { positionInk(); positionLens(); recenterStrip(false); });
    }
    function bindHist() {
      const rf = $("range-from"); if (rf) rf.onchange = () => (rangeFrom = rf.value);
      const rt = $("range-to"); if (rt) rt.onchange = () => (rangeTo = rt.value);
      const rg = $("range-go"); if (rg) rg.onclick = () => runRange();
      const rc = $("range-clear"); if (rc) rc.onclick = () => { rangeMode = false; refreshStrip(); renderSlate(); };
    }
    function recenterStrip(smooth = true) {
      const strip = $("datestrip");
      const on = strip && strip.querySelector(".dcell.on");
      if (!strip || !on || !strip.clientWidth) return;
      const target = on.offsetLeft - (strip.clientWidth - on.offsetWidth) / 2;
      strip.scrollTo({ left: Math.max(0, target), behavior: REDUCE || !smooth ? "auto" : "smooth" });
    }
    function bindStrip() {
      const strip = $("datestrip");
      if (!strip) return;
      strip.querySelectorAll(".dcell").forEach((c: any) => (c.onclick = () => { curDate = c.dataset.date; rangeMode = false; selectDate(); }));
      requestAnimationFrame(() => { positionLens(); recenterStrip(); });
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
      root.querySelectorAll(".tile[data-gid], .feat[data-gid]").forEach((bx: any) => {
        const open = (e: any) => {
          if (e && e.target && e.target.closest && e.target.closest("[data-up]")) { switchTab("upgrade"); return; }
          const g = findGame(bx.dataset.gid); if (g) openDetail(g);
        };
        bx.onclick = open;
        bx.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
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
        s.push(`Like every DiamondEdge Pick, this one is graded against the final score — the full running record is on the Results tab.`);
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
          <div class="sr-h"><span class="pl-vdia">◆</span> Why this game qualified</div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.gap)}</b>${c.gapSub ? ` <span class="sr-sub">${esc(c.gapSub)}</span>` : ""}</div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.split)}</b> <span class="sr-sub">the market can't agree — someone's number is soft</span></div>
          <div class="sr-chips">
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
      const rh = recipeHistory();
      return `<div class="shp-vrec">
        <div class="vr-h"><span class="pl-vdia">◆</span> Signature-play record</div>
        <div class="vr-line">Calls made exactly this way: ${(rh.hit * 100).toFixed(1)}% winners across ${rh.n.toLocaleString()} graded picks, 2022–2026, about ${sgn(rh.roi * 100, 0)}% per dollar at typical prices.</div>
        <table class="dsa-tab vr-tab">
          <thead><tr><th>Since going live</th><th>n</th><th>Win rate</th><th>Return</th></tr></thead>
          <tbody>${fRow("Strong", fwd.tier_a)}${fRow("Strong + Good", fwd.tier_ab)}</tbody>
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

      // (1) THE DIAMONDEDGE PICK — big and unmissable, with the result state front and center.
      const leadLocked = lead ? pickLocked(lead, playState(g, lead)) : false;
      let callBlock;
      if (lead && leadLocked) {
        // FREE MODE: the call exists — quality shows, side/line stays behind the lock.
        const q = qualityOf(lead);
        callBlock = `<div class="callcard locked ${isGold(lead) ? "gold" : ""}">
          <div class="cc-k">◆ DiamondEdge Pick — locked</div>
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
          <div class="cc-k">${gold ? "★ " : ""}◆ DiamondEdge Pick</div>
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
          <div class="cc-k">◆ DiamondEdge Pick</div>
          <div class="cc-main"><span class="cc-side">No pick</span><span class="cc-passnote">here's why ↓</span></div>
          <p class="cc-passwhy">${passWhy()}</p>
        </div>`;
      }

      // (2) GAME PREVIEW — the article: served game.article first, composed from the same
      // real fields otherwise. Bold key points, icon fact rows, streak chips.
      const art = gameArticle(g);
      const bodyParas = leadLocked ? [] : (art && art.paras.length ? art.paras : (lead ? whySentences(g, lead) : composedPreview(g).paras));
      const facts = leadLocked ? [] : factRows(g, art);
      const stks = leadLocked ? "" : gameStreaks(g).slice(0, 4).map((s: any) =>
        `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      const whyBlock = leadLocked
        ? `<div class="whycard">
            <div class="wc-k">Game preview</div>
            <p>The full read behind this pick — the model number, the line it beats, and the history of calls made exactly this way — is part of DiamondEdge Premium. The quality rating above is the real one.</p>
          </div>`
        : `<div class="whycard">
            <div class="wc-k">Game preview</div>
            ${art && art.headline ? `<h3 class="art-h">${esc(cleanBlurb(art.headline))}</h3>` : ""}
            ${art && art.dek ? `<p class="art-dek">${mdBold(cleanBlurb(art.dek))}</p>` : ""}
            ${bodyParas.map((w) => `<p>${art && art.served ? mdBold(w) : w}</p>`).join("")}
            ${stks ? `<div class="pv-stks">${stks}</div>` : ""}
            ${facts.length ? `<div class="ls-facts">${facts.join("")}</div>` : ""}
          </div>`;

      // (3) THE LINES — one narrative sentence plus the board.
      const linesBlock = leadLocked ? "" : (() => {
        const bits: string[] = [];
        const sp2 = g.spread_pick;
        if (sp2 && sp2.line != null) {
          const hl = spreadHomeLine(g, sp2);
          bits.push(hl < 0 ? `${esc(g.home_abbr)} favored by ${num(Math.abs(hl), 1)}` : hl > 0 ? `${esc(g.home_abbr)} getting ${num(Math.abs(hl), 1)}` : `a pick'em`);
        }
        const tp2 = g.total_pick;
        if (tp2 && tp2.line != null) bits.push(`the total at ${num(tp2.line)}`);
        const mp2 = g.ml_pick; const mpr2 = (mp2 && mp2.prices) || {};
        if (mp2 && (mp2.price ?? mpr2.home ?? mpr2.away) != null && g.sport !== "soccer") bits.push(`${esc(mp2.side || g.home_abbr)} ${fmtOdds(mp2.price ?? mpr2.home ?? mpr2.away)} on the moneyline`);
        let move = "";
        const pk0 = lead ? (lead.market === "spread" ? g.spread_pick : lead.market === "total" ? g.total_pick : g.ml_pick) : null;
        const lm = pk0 && pk0.line_move;
        if (lm && lm.open_line != null && lm.current_line != null && Number(lm.open_line) !== Number(lm.current_line)) {
          const isAm = lm.unit === "american_ml";
          const fmtL = (v: any) => (isAm ? fmtOdds(v) : num(v, 1));
          move = ` The ${lead.market === "moneyline" ? "price" : lead.market} opened at ${fmtL(lm.open_line)} and sits at ${fmtL(lm.current_line)}${lm.moved_toward_pick === true ? " — the market has been coming to our side" : lm.moved_toward_pick === false ? " — the market has drifted the other way, and we still like our number" : ""}.`;
        }
        if (!bits.length) return "";
        return `<div class="whycard lines">
          <div class="wc-k">The lines</div>
          <p>The books have ${bits.join(", ")}.${move}</p>
          ${oddsRow(g)}
        </div>`;
      })();

      // (3) More detail — everything the old sheet had, folded away for power users.
      const bets = [detailBet(g.spread_pick, "Spread", "spread", g), detailBet(g.ml_pick, "Moneyline", "ml", g), detailBet(g.total_pick, "Total", "total", g)].filter(Boolean).join("");
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Model Notes</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";
      const anyValue = takes.some((p: any) => p.value_tier);
      const more = `<details class="more"><summary>More detail<span class="more-sub">markets, model numbers, matchup intel</span></summary>
        <div class="more-body">
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
            ${linesBlock}
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
                <p><b>◆◆◆ Strong</b> — our best kind of call. Every signal we track fired at full strength.</p>
                <p><b>◆◆ Good</b> — the same idea, slightly weaker signal.</p>
                <p><b>◆ Lean</b> — the model likes it, but the edge is thin. Fine to skip.</p>
                <p>Everything else is a <b>PASS</b>. Most games are a pass — that's the discipline that keeps the record honest.</p>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">Where the edge comes from</div>
              <div class="dsec-b rcp-steps">
                <div class="rcp-step"><span class="rh-n">1</span><div><b>We model every game ourselves</b> — weather, form, travel, rest, matchups — and land on our own number before the books' numbers matter to us.</div></div>
                <div class="rcp-step"><span class="rh-n">2</span><div><b>We audit the market, not just the matchup.</b> When the market's own behavior tells us a number is soft, that's when we get interested. The exact triggers are the house blend — that's the part you're subscribing to.</div></div>
                <div class="rcp-step"><span class="rh-n">3</span><div><b>Only when everything lines up do we publish a DiamondEdge Pick</b> — usually a handful of games a day, some days none.</div></div>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">The receipts</div>
              <div class="dsec-b rcp">
                <p><b>Every pick is graded in public.</b> The side and line freeze before the game, the final score does the judging, and the whole record — wins, losses, everything — lives on the Results tab.</p>
                <p><b>Calls made exactly this way have won <b>${(rh.hit * 100).toFixed(1)}%</b></b> across <b>${rh.n.toLocaleString()}</b> graded picks from 2022 to 2026, returning about <b>${sgn(rh.roi * 100, 0)}%</b> per dollar at typical prices — graded by a model that never saw the games in advance.</p>
                <p><b>Win rate always travels with the price.</b> A high hit rate at a terrible price is a losing bet — so every number we show you carries its return next to it.</p>
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
    // Plain product labels — internal signal names, thresholds and book-count mechanics
    // never reach the page (house rule: the story sells, the kitchen stays closed).
    function prettyKey(k: any) {
      let s = String(k == null || k === "" ? "—" : k);
      s = s.replace(/\s*\([^)]*\)\s*/g, " ").trim(); // strip "(5%+ gap)"-style mechanics
      const map: any = { over: "Overs", under: "Unders", OVER: "Overs", UNDER: "Unders", heat_day: "Heat-day picks", heat: "Heat-day picks", split_books: "Split-book picks", mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer", total: "Totals", spread: "Spreads", moneyline: "Moneylines", strong: "◆◆◆ Strong", good: "◆◆ Good", lean: "◆ Lean", "Strong signal": "◆◆◆ Strong", "Solid signal": "◆◆ Good", "Baseline signal": "◆ Lean" };
      if (map[s] != null) return map[s];
      s = s.replace(/books? split across \d\+? (different )?lines?/i, (m0) => /3\+|three/i.test(m0) ? "Books strongly split on the line" : "Books split on the line")
        .replace(/game total\s*[—–-]\s*live.*$/i, "Game totals — since going live");
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
    // Edge descriptions are rewritten client-side: the proof (record, sample, return)
    // shows in full — the trigger mechanics stay the house blend.
    const EDGE_COPY: any = [
      [/core recipe|signature/i, "The signature DiamondEdge play — our model and the market's own behavior both have to agree a number is soft before we publish. This record is the product's evidence base: strictly-future games, graded on final scores, 2022–2026."],
      [/shopping the price/i, "The exact same picks, taken at the best available price instead of the typical one. Costs nothing and has historically added profit on every dollar."],
      [/hot[- ]day/i, "Over calls on days far hotter than that ballpark's norm — the single best profile in the graded history."],
      [/getaway|travel/i, "Games where a team travels immediately after — a scheduling profile the record says the market underprices."],
    ];
    function edgeCopy(e: any) {
      const name = String(e.name || "");
      const hit = EDGE_COPY.find(([re]: any) => re.test(name));
      if (hit) return hit[1];
      const d = String(e.description || "");
      // fall back to the served description with trigger numbers redacted
      return cleanCopy(d.replace(/\d+(\.\d+)?%\+?/g, "a meaningful amount").replace(/\bAND\b/g, "and"));
    }
    function adEdgesModule(list: any[]) {
      if (!Array.isArray(list) || !list.length) return "";
      const stLabel: any = { validated: "Proven", live: "Live", experimental: "Emerging" };
      const cards = list.map((e: any) => {
        const roi = e.roi != null && !isNaN(Number(e.roi)) ? Number(e.roi) : null;
        const st = String(e.status || "").toLowerCase();
        const desc = edgeCopy(e);
        return `<div class="edge ${esc(st)}">
          <div class="edge-h"><b>${esc(e.name || "")}</b>${st ? `<span class="edge-st">${esc(stLabel[st] || prettyKey(st))}</span>` : ""}
            <span class="edge-nums">${(e.n || 0).toLocaleString()} picks · ${e.hit != null ? (Number(e.hit) * 100).toFixed(1) + "%" : "—"} · <span class="${roi != null && roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + (roi * 100).toFixed(1) + "%"}</span></span></div>
          ${desc ? `<p>${esc(desc)}</p>` : ""}
        </div>`;
      }).join("");
      return `<div class="anz-card" style="margin-bottom:14px"><div class="anz-card-h">★ Where the edges live</div><div class="edge-list">${cards}</div></div>`;
    }

    // One expandable results row: record + win rate + return on the summary line,
    // a plain-English one-liner behind the tap.
    function resRow(label: string, o: any, liner: string) {
      if (!o || !o.n) return "";
      const hr = o.hit_rate != null ? (o.hit_rate * 100).toFixed(1) + "%" : "—";
      const ci = Array.isArray(o.hit_rate_ci95) ? ` · typical range ${(o.hit_rate_ci95[0] * 100).toFixed(0)}–${(o.hit_rate_ci95[1] * 100).toFixed(0)}%` : "";
      return `<details class="rrow">
        <summary><span class="rr-l">${label}</span><span class="rr-rec">${recCell(o)}</span><span class="rr-hr">${hr}</span><span class="rr-roi">${roiCell(o.roi)}</span><span class="rr-car" aria-hidden="true">▾</span></summary>
        <div class="rr-b"><p>${liner}</p><span class="rr-n">${(o.n || 0).toLocaleString()} graded picks${ci}</span></div>
      </details>`;
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
      const byMk = tr.by_market || {};
      const rh = recipeHistory();
      const mr = monthRecord();
      const fwd = forwardRecord();
      const confRows = [
        resRow(`<span class="ql strong">${qDiamonds("strong")} Strong</span>`, byTier.featured, `Our surest calls — every signal we track fired at full strength. Rare by design.`),
        resRow(`<span class="ql good">${qDiamonds("good")} Good</span>`, byTier.high, `The same idea with a slightly weaker signal — still a published, graded call.`),
        resRow(`<span class="ql lean">${qDiamonds("lean")} Lean</span>`, mergeRecs([byTier.medium, byTier.low]), `Thin edges we flag for completeness. Fine to skip — we grade them anyway.`),
      ].join("");
      const mkRows = [
        resRow("Totals", byMk.total, `Over/unders — the market where the DiamondEdge signature record lives.`),
        resRow("Moneylines", byMk.moneyline, `Picking the winner straight up, priced against the market.`),
        resRow("Spreads", byMk.spread, `The margin market — the hardest number to beat, so we call it least often.`),
      ].join("");
      const themeRows = (analyticsDeep && analyticsDeep.cuts && Array.isArray(analyticsDeep.cuts.by_theme)) ? analyticsDeep.cuts.by_theme : [];
      const themeChips = themeRows.filter((r: any) => r.hit != null && r.n).map((r: any) => {
        const roi2 = r.roi != null ? Number(r.roi) : null;
        return `<span class="proof big ${roi2 != null && roi2 < 0 ? "neg" : ""}">${icon(iconForText(r.key))}<b>${prettyKey(r.key)}</b><span class="pf-n">${(Number(r.hit) * 100).toFixed(0)}% · ${(r.n || 0).toLocaleString()} games${roi2 != null ? ` · ${(roi2 >= 0 ? "+" : "") + (roi2 * 100).toFixed(0)}%` : ""}</span></span>`;
      }).join("");
      const deepKeys = CUT_ORDER.filter((k) => k !== "by_quality" && k !== "by_market" && k !== "by_theme");
      const view = root.querySelector("#results-view");
      view.innerHTML = `
        <div class="anz-hero">
          <div class="ah-lab">DiamondEdge Results</div>
          <h2>Every pick, graded in the open</h2>
          <div class="ah-sub">Every DiamondEdge Pick is graded against the final score — here's how each kind has done. A win rate needs to beat about ${be}% to make money at typical prices, which is why every number below travels with its return.</div>
          <div class="ah-stats">
            <div class="ah-st"><div class="k">Graded picks</div><div class="v" data-count="${ov.n || 0}" data-loc="1">${(ov.n || 0).toLocaleString()}</div></div>
            <div class="ah-st"><div class="k">Record</div><div class="v">${ov.wins || 0}-${ov.losses || 0}</div></div>
            <div class="ah-st"><div class="k">Win rate</div><div class="v">${hr != null ? hr.toFixed(1) + "%" : "—"}</div></div>
            <div class="ah-st"><div class="k">Return</div><div class="v ${roi == null ? "" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + roi.toFixed(1) + "%"}</div></div>
            ${mr ? `<div class="ah-st"><div class="k">This month</div><div class="v">${mr.w}-${mr.l}</div></div>` : ""}
            ${fwd ? `<div class="ah-st"><div class="k">Since going live</div><div class="v">${fwd.wins || 0}-${fwd.losses || 0}</div></div>` : ""}
          </div>
        </div>
        <div class="anz-card star">
          <div class="anz-card-h">★ The DiamondEdge signature play</div>
          <div class="star-b">Our best pattern has won <b>${(rh.hit * 100).toFixed(1)}%</b> of ${rh.n.toLocaleString()} graded picks from 2022 to 2026 — about <b>${sgn(rh.roi * 100, 0)}%</b> back on every dollar at typical prices. It's the record behind the gold ★ picks on the board.</div>
        </div>
        ${confRows ? `<div class="anz-card rsec"><div class="anz-card-h">By confidence</div><div class="anz-sub">Every pick carries one plain word — Strong, Good or Lean. Here's what each has actually done.</div><div class="rrows">${confRows}</div></div>` : ""}
        ${mkRows ? `<div class="anz-card rsec"><div class="anz-card-h">By bet type</div><div class="anz-sub">Totals, moneylines and spreads are graded separately — a pick is only as good as its market.</div><div class="rrows">${mkRows}</div></div>` : ""}
        ${themeChips ? `<div class="anz-card rsec"><div class="anz-card-h">By theme</div><div class="anz-sub">The situations that show up in our picks, each with its graded proof.</div><div class="proofgrid">${themeChips}</div></div>` : ""}
        ${analyticsDeep ? adEdgesModule(analyticsDeep.edges_summary) : ""}
        ${analyticsDeep
          ? `<details class="more results-more"><summary>Every other cut<span class="more-sub">month, weekday, price range, line level and more</span></summary>
             <div class="more-body"><div class="ad-grid">
               ${deepKeys.filter((k) => analyticsDeep.cuts[k]).map((k) => adCutModule(k, analyticsDeep.cuts[k])).join("")}
               ${Object.keys(analyticsDeep.cuts).filter((k) => CUT_ORDER.indexOf(k) < 0).map((k) => adCutModule(k, analyticsDeep.cuts[k])).join("")}
             </div></div></details>`
          : ""}
        <div class="refnote">Every cut is the same graded record, sliced a different way — win rate always shown with return and sample size.${analyticsDeep && analyticsDeep.generated_at ? ` Updated ${esc(String(analyticsDeep.generated_at).slice(0, 10))}.` : ""}</div>`;
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
    // The frozen pick's live/graded state for a brief entry (falls back to result field).
    function briefPickState(p: any) {
      const g = findGameLive(p.game_id);
      const pl = g ? displayPick(g) : null;
      if (g && pl && pl.action === "TAKE") {
        const st = playState(g, pl);
        return pickStateTxt(g, pl, st);
      }
      if (p.result === "hit") return { txt: `${condCheck} WON`, cls: "won" };
      if (p.result === "miss") return { txt: "✗ LOST", cls: "lost" };
      if (p.result === "push") return { txt: "PUSH", cls: "pushed" };
      return null;
    }
    // One carousel card: fixed skeleton (top row → crests → matchup → branded pick → blurb)
    // so every card lands at the same height; the pick chip carries its state.
    function heroCard(p: any, i: number) {
      const g = findGameLive(p.game_id);
      const locked = !isPremium() && (p.quality === "strong" || p.quality === "good") && !p.result;
      const state = briefPickState(p);
      const mu = g
        ? `<div class="hero-mu"><div class="hero-tm">${gCrest(g, "away")}<i>${esc(g.away_abbr)}</i></div><span class="hero-at">@</span><div class="hero-tm">${gCrest(g, "home")}<i>${esc(g.home_abbr)}</i></div></div>`
        : `<div class="hero-mu none"></div>`;
      const bet = locked
        ? `<button class="lockchip" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
        : `<div class="hero-bet ${state ? state.cls : ""}"><span class="hb-brand">◆ DiamondEdge Pick</span><span class="hb-side">${esc(p.bet || "")}</span>${state ? `<span class="pb-res ${state.cls}">${state.txt}</span>` : ""}</div>`;
      const blurbTxt = cleanBlurb(p.blurb || "");
      const teaser = p._fb ? "There's a validated DiamondEdge Pick on this game." : blurbTxt.split(". ")[0].slice(0, 120);
      const blurb = blurbTxt
        ? (locked
          ? `<p class="hero-blurb">${esc(teaser)}… <button class="lk-more" data-up="1">unlock the full read</button></p>`
          : `<p class="hero-blurb clamp3">${esc(blurbTxt)}</p>`)
        : "";
      return `<article class="hero q-${p.quality}${p.result === "hit" ? " hit" : p.result === "miss" ? " miss" : ""}" data-gid="${esc(p.game_id)}"${locked ? ' data-locked="1"' : ""} style="--i:${i}" role="button" tabindex="0" aria-label="${esc(p.matchup)} — ${locked ? "pick locked" : "DiamondEdge Pick " + esc(p.bet || "")}">
        <div class="hero-top"><span class="hero-sport">${esc(SPORT_LABEL[p.sport] || p.sport || "")}</span><span class="hero-q">${qDiamonds(p.quality)}${Q_LABEL[p.quality] || ""}</span></div>
        ${mu}
        <div class="hero-match">${esc(p.matchup || "")}</div>
        ${bet}${blurb}
        <span class="hero-cta">Full story →</span>
      </article>`;
    }
    // Carousel order: exact p_correct behind the scenes (full precision, never shown),
    // quality rank as the stand-in — the featured game rides first.
    function orderTopPicks(list: any[]) {
      const withKey = list.map((p: any, i: number) => {
        const g = findGameLive(p.game_id);
        const pl = g ? displayPick(g) : null;
        return { p, i, exp: pl && pl.action === "TAKE" && pl.p != null ? Number(pl.p) : null, qr: Q_RANK[p.quality] != null ? Q_RANK[p.quality] : 3 };
      });
      withKey.sort((a: any, b: any) => convictionSort(a.exp, a.qr, b.exp, b.qr) || (a.i - b.i));
      return withKey.map((w: any) => w.p);
    }
    // ---- proof chips: match a storyline to the graded record's theme cuts ----
    function themeProof(name: any) {
      const src = (livePayload && livePayload.analytics_deep) || (payload && payload.analytics_deep) || analyticsDeep;
      const rows = src && src.cuts && Array.isArray(src.cuts.by_theme) ? src.cuts.by_theme : [];
      const n = String(name || "").toLowerCase();
      let hitRow: any = null;
      if (/heat|hot|°f|temperature/.test(n)) hitRow = rows.find((r: any) => /hot day/i.test(r.key));
      else if (/book|split|agree/.test(n)) hitRow = rows.filter((r: any) => /split/i.test(r.key)).sort((a: any, b: any) => (b.n || 0) - (a.n || 0))[0];
      else if (/getaway|travel/.test(n)) hitRow = rows.find((r: any) => /getaway|travel/i.test(r.key));
      if (!hitRow || hitRow.hit == null || !hitRow.n) return "";
      const word = /over/i.test(String(hitRow.key)) ? "overs" : "winners";
      return `<span class="proof">${icon("record")}${(Number(hitRow.hit) * 100).toFixed(0)}% ${word} · ${(hitRow.n || 0).toLocaleString()} games</span>`;
    }
    // ---- storyline article card (theme) — icon, dek, proof chip, expand on tap ----
    function storyCard(t: any, i: number) {
      const ic = iconForText(t.name + " " + (t.text || ""));
      const gids = (t.affected_games || []) as any[];
      return `<article class="story" data-th="${i}" style="--i:${i}" role="button" tabindex="0" aria-expanded="false" aria-label="${esc(t.name)} — expand">
        <span class="st-ic">${icon(ic)}</span>
        <div class="st-b">
          <h4 class="st-h">${esc(t.name)}</h4>
          <p class="st-t clamp2">${esc(cleanBlurb(t.text || ""))}</p>
          <div class="st-foot">${themeProof(t.name)}${gids.length ? `<button class="st-games" data-th-g="${i}">${gids.length} game${gids.length > 1 ? "s" : ""} →</button>` : ""}</div>
        </div>
      </article>`;
    }
    // ---- game-preview article card (served game.article first, composed fallback) ----
    function previewCard(g: any, i: number) {
      const gs = gameState(g);
      const art = gameArticle(g) || composedPreview(g);
      const pl = displayPick(g);
      const st = pl ? playState(g, pl) : "open";
      const locked = pl ? pickLocked(pl, st) : false;
      const state = pl ? pickStateTxt(g, pl, st) : null;
      const q = pl ? qualityOf(pl) : null;
      const status = gs.kind === "live" ? `<span class="pv-live"><span class="livedot"></span>${esc(gs.label !== "Live" && gs.label ? gs.label : "LIVE")}</span>`
        : gs.kind === "final" ? `<span class="pv-final">FINAL</span>`
        : `<span class="pv-time">${esc(gs.si.hasTime && gs.si.time ? gs.si.time : gs.si.date || "")}</span>`;
      const sc = gs.score && gs.score.split && gs.score.home != null ? gs.score : null;
      const head = art.headline ? esc(cleanBlurb(art.headline))
        : pl && pl.action === "TAKE" ? `${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}: the case for ${esc(pl.side || "")}`
        : `${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}`;
      const dek = art.dek || art.paras[0] || "";
      const pickChip = !pl ? `<span class="pv-nopick">No pick — the number's fair</span>`
        : locked ? `<button class="pv-pick locked" data-up="1"><span class="de-k">◆ DiamondEdge Pick</span><span class="pb-dots">●●●●</span>${lockSvg}</button>`
        : `<span class="pv-pick q-${q} ${state ? state.cls : ""}"><span class="de-k">◆ DiamondEdge Pick</span><b>${pickArrow(pl)} ${esc(pl.side || "")}</b>${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}${state ? `<span class="pb-res ${state.cls}">${state.txt}</span>` : ""}</span>`;
      const streaks = gameStreaks(g).slice(0, 2).map((s: any) =>
        `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      return `<article class="prev" data-gid="${esc(g.game_id)}" style="--i:${Math.min(i, 8)}" role="button" tabindex="0" aria-label="${esc(g.matchup || "game preview")} — open">
        <div class="pv-top"><span class="pv-sport">${esc(SPORT_LABEL[g.sport] || g.sport || "")}${g.meta && g.meta.competition ? ` · ${esc(g.meta.competition)}` : ""}</span>${status}</div>
        <div class="pv-mu">
          <span class="pv-tm">${gCrest(g, "away")}<i>${esc(g.away_abbr)}</i>${sc ? `<b>${num(sc.away, 0)}</b>` : ""}</span>
          <span class="pv-at">@</span>
          <span class="pv-tm">${gCrest(g, "home")}<i>${esc(g.home_abbr)}</i>${sc ? `<b>${num(sc.home, 0)}</b>` : ""}</span>
        </div>
        <h4 class="pv-head">${head}</h4>
        ${dek ? `<p class="pv-dek clamp2">${mdBold(String(dek))}</p>` : ""}
        ${pickChip}
        ${streaks ? `<div class="pv-stks">${streaks}</div>` : ""}
      </article>`;
    }
    // Today's preview pool: pick games first (by quality), then served articles, then intel-rich games.
    function previewGames() {
      const src = livePayload || payload;
      if (!src) return [];
      const t = todayISO();
      const pool = ((src.games || []) as any[]).filter((g: any) => {
        const st0 = String(g.status || "pre").toLowerCase();
        const d = gameLocalDay(g);
        if (st0 === "live") return true;
        return d === t || (st0 === "pre" && !d);
      });
      const scored = pool.map((g: any) => {
        const pl = displayPick(g);
        const hasPick = pl && pl.action === "TAKE";
        const qr = hasPick ? Q_RANK[qualityOf(pl)] : 9;
        const rank = hasPick ? qr : gameArticle(g) ? 4 : g.pregame_intel ? 5 : 9;
        return { g, rank, p: hasPick && pl.p != null ? Number(pl.p) : -1 };
      }).filter((x: any) => x.rank < 9);
      scored.sort((a: any, b: any) => a.rank - b.rank || b.p - a.p);
      return scored.map((x: any) => x.g);
    }
    // Branded record line for the masthead + footer — hit rate always rides with the return.
    function recordStrip() {
      const rh = recipeHistory();
      return `Graded in the open since 2022 — ${(rh.hit * 100).toFixed(1)}% winners across ${rh.n.toLocaleString()} DiamondEdge Picks, ${sgn(rh.roi * 100, 0)}% back per dollar at typical prices. Every pick freezes before first pitch and grades against the final score.`;
    }
    function renderToday() {
      const view = $("today-view");
      if (!view) return;
      const db = briefSource() || fallbackBrief();
      if (!db) { view.innerHTML = skeletonSlate(4); return; }
      const dd = new Date(String(db.date || todayISO()) + "T12:00:00");
      const dateTxt = isNaN(dd.getTime()) ? String(db.date || "") : dd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const mr = monthRecord();
      const picksAll = orderTopPicks((db.top_picks || []) as any[]);
      const leadPick = picksAll[0] || null;
      const railPicks = picksAll.length > 1 ? picksAll.slice(1) : [];
      // LEAD STORY — the day's biggest call gets the front-page treatment.
      let leadStory = "";
      if (leadPick) {
        const g = findGameLive(leadPick.game_id);
        const state = briefPickState(leadPick);
        const locked = !isPremium() && (leadPick.quality === "strong" || leadPick.quality === "good") && !leadPick.result;
        const blurbTxt = cleanBlurb(leadPick.blurb || "");
        const facts = g ? factRows(g, gameArticle(g)) : [];
        const stks = g ? gameStreaks(g).slice(0, 3).map((s: any) => `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("") : "";
        const bet = locked
          ? `<button class="lockchip" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
          : `<div class="ls-pick q-${leadPick.quality} ${state ? state.cls : ""}"><span class="de-k">◆ DiamondEdge Pick</span><b class="ls-side">${esc(leadPick.bet || "")}</b><span class="ls-q">${qDiamonds(leadPick.quality)}${Q_LABEL[leadPick.quality] || ""}</span>${state ? `<span class="pb-res big ${state.cls}">${state.txt}</span>` : ""}</div>`;
        leadStory = `<article class="leadstory q-${leadPick.quality}" data-gid="${esc(leadPick.game_id)}"${locked ? ' data-locked="1"' : ""} role="button" tabindex="0" aria-label="Lead story — ${esc(leadPick.matchup)}">
          <div class="ls-kick"><span class="ls-lab">Lead story</span><span class="ls-sport">${esc(SPORT_LABEL[leadPick.sport] || leadPick.sport || "")}</span></div>
          ${g ? `<div class="ls-mu"><span class="ls-tm">${gCrest(g, "away")}<i>${esc(g.away_abbr)}</i></span><span class="ls-at">@</span><span class="ls-tm">${gCrest(g, "home")}<i>${esc(g.home_abbr)}</i></span></div>` : ""}
          <h3 class="ls-match">${esc(leadPick.matchup || "")}</h3>
          ${bet}
          ${blurbTxt && !locked ? `<p class="ls-lede">${esc(blurbTxt)}</p>` : locked ? `<p class="ls-lede dim">The full read on today's lead pick — the model number, the line it beats, and the history behind it — is one tap away.</p>` : ""}
          ${!locked && stks ? `<div class="pv-stks">${stks}</div>` : ""}
          ${!locked && facts.length ? `<div class="ls-facts">${facts.slice(0, 3).join("")}</div>` : ""}
          <span class="hero-cta">Full story →</span>
        </article>`;
      } else {
        leadStory = `<article class="leadstory pass">
          <div class="ls-kick"><span class="ls-lab">Lead story</span></div>
          <h3 class="ls-match">No DiamondEdge Pick today — and that's the discipline that keeps the record honest.</h3>
          <p class="ls-lede">We publish a pick only when the numbers clear our bar. Today none did. The storylines below are what we're watching, and every past call stays graded in the open on the Results tab.</p>
          <span class="hero-cta" data-nav="results">See the record →</span>
        </article>`;
      }
      const carousel = railPicks.length ? `
        <section class="ng-carousel">
          <div class="sec-h"><span>More DiamondEdge Picks</span></div>
          <div class="tdy-picks" id="tdy-picks" aria-label="Featured picks carousel">${railPicks.map((p: any, i: number) => heroCard(p, i)).join("")}</div>
          ${railPicks.length > 1 ? `<div class="tp-dots" id="tp-dots" role="tablist" aria-label="Carousel position">${railPicks.map((_: any, i: number) => `<button class="tp-dot${i === 0 ? " on" : ""}" data-dot="${i}" aria-label="Go to pick ${i + 1}"></button>`).join("")}</div>` : ""}
        </section>` : "";
      const themes = ((db.themes || []) as any[]);
      const storylines = themes.length ? `
        <div class="sec-h"><span>Today's storylines</span></div>
        <div class="stories">${themes.map((t: any, i: number) => storyCard(t, i)).join("")}</div>` : "";
      const pvGames = previewGames().slice(0, 6);
      const previews = pvGames.length ? `
        <section class="ng-previews">
          <div class="sec-h"><span>Game previews</span><button class="sec-more" data-nav="games">Full board →</button></div>
          <div class="prevgrid">${pvGames.map((g: any, i: number) => previewCard(g, i)).join("")}</div>
        </section>` : "";
      view.innerHTML = `
        <div class="news">
          <div class="news-mast">
            <span class="nm-brand">DiamondEdge <b>Daily</b></span>
            <span class="nm-date">${esc(dateTxt)}</span>
            <button class="nm-rec" id="nm-rec">${mr ? `Picks <b>${mr.w}–${mr.l}</b> this month` : `The record`} →</button>
          </div>
          <h2 class="lead-head">${esc(cleanBlurb(db.headline || ""))}</h2>
          <div class="news-grid">
            <section class="ng-lead">${leadStory}</section>
            <aside class="ng-rail">${storylines}</aside>
            ${carousel}
            ${previews}
          </div>
          <div class="news-foot">${esc(recordStrip())}</div>
        </div>`;
      // ---- bindings ----
      const nav = (el: any) => { const d = el.dataset.nav; if (d) switchTab(d); };
      view.querySelectorAll("[data-nav]").forEach((b: any) => (b.onclick = (e: any) => { e.stopPropagation(); nav(b); }));
      const rec = $("nm-rec"); if (rec) rec.onclick = () => switchTab("results");
      // storyline expand + jump
      view.querySelectorAll(".story").forEach((s: any) => {
        const toggle = (e: any) => {
          const gbtn = e.target && e.target.closest && e.target.closest("[data-th-g]");
          if (gbtn) { const t = themes[Number(gbtn.dataset.thG)]; if (t) jumpToGames(t.affected_games || []); return; }
          const p = s.querySelector(".st-t");
          const open = p && p.classList.toggle("open");
          if (p) p.classList.toggle("clamp2", !open);
          s.setAttribute("aria-expanded", open ? "true" : "false");
        };
        s.onclick = toggle;
        s.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(e); } };
      });
      // lead story + carousel + previews → detail sheet
      view.querySelectorAll(".leadstory[data-gid], .hero[data-gid], .prev[data-gid]").forEach((h: any) => {
        const open = (e: any) => {
          if (e.target && e.target.closest && e.target.closest("[data-up]")) { switchTab("upgrade"); return; }
          if (e.target && e.target.closest && e.target.closest("[data-nav]")) return;
          if (h.dataset.locked) { switchTab("upgrade"); return; }
          const g = findGameLive(h.dataset.gid);
          if (g) openDetail(g); else jumpToGames([h.dataset.gid]);
        };
        h.onclick = open;
        h.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
      });
      // carousel dots: track the snapped card, click to go
      const rail = $("tdy-picks"), dots = $("tp-dots");
      if (rail && dots) {
        const cards = Array.from(rail.querySelectorAll(".hero")) as any[];
        const setDot = (i: number) => dots.querySelectorAll(".tp-dot").forEach((d: any, k: number) => d.classList.toggle("on", k === i));
        let raf = 0;
        rail.addEventListener("scroll", () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const mid = rail.scrollLeft + rail.clientWidth / 2;
            let best = 0, bd = Infinity;
            cards.forEach((c: any, k: number) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
            setDot(best);
          });
        }, { passive: true });
        dots.querySelectorAll(".tp-dot").forEach((d: any) => (d.onclick = (e: any) => {
          e.stopPropagation();
          const i = Number(d.dataset.dot);
          const c = cards[i];
          if (c) rail.scrollTo({ left: c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2, behavior: REDUCE ? "auto" : "smooth" });
        }));
      }
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
          <div class="set-note">Flip this off any time to see what free members see — the record stays open to everyone.</div>
        </div>
        <div class="set-card">
          <div class="set-k">Appearance</div>
          <div class="set-about"><b>Light liquid glass</b> is the DiamondEdge identity — airy daylight surfaces, frosted white cards, emerald and red for results, gold reserved for Strong picks. Depth comes from light and shadow, not boxes.</div>
        </div>
        <div class="set-card">
          <div class="set-k">About</div>
          <button class="set-link" id="set-how">ⓘ How picks work<em>→</em></button>
          <button class="set-link" id="set-results">Our full record<em>→</em></button>
          <button class="set-link" id="set-upgrade">DiamondEdge Premium<em>→</em></button>
          <div class="set-about" style="margin-top:10px">Every DiamondEdge Pick is graded in the open against real final scores — games the model never saw in advance. Win rates always travel with prices and returns. That transparency is the whole product.</div>
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
            <div class="up-st"><div class="v">'22–'26</div><div class="k">graded seasons</div></div>
          </div>
        </div>
        <div class="up-perks">
          ${perk("Every Strong ◆◆◆ and Good ◆◆ pick, unlocked", "The exact side, line and price we froze before the game — never re-written after the fact.")}
          ${perk("The why, in plain English", "Two or three sentences a first-time reader can follow: the model's number, the line it beats, and the history of bets made exactly this way.")}
          ${perk("Live reads and score overlay", "Fresh scores every minute during games, with each pick's progress toward its line.")}
          ${perk("The full record, cut every way", "Deep results by league, price, pick type and theme — wins and losses alike. It's the same record we show free users; you just get the picks that build it.")}
        </div>
        <div class="up-price"><span class="amt">$9.99</span><span class="per">/ month</span></div>
        <button class="up-cta" id="up-sub">Unlock DiamondEdge</button>
        <button class="up-back" id="up-back">Not now — keep the free picks</button>
        <div class="up-honest">The numbers above are the real graded history — ${rh.n.toLocaleString()} picks graded against final scores across games the model never trained on${fwd ? `, and the record since going live is ${fwd.wins || 0}-${fwd.losses || 0}` : ""}. Every future pick is graded the same way, in the open, win or lose.</div>`;
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
      if (t === "games") requestAnimationFrame(() => { positionInk(); positionLens(); recenterStrip(false); });
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
      requestAnimationFrame(() => { positionInk(); positionLens(); recenterStrip(false); });
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
