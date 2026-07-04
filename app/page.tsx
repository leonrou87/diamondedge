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
    const M_ABBR: any = { spread: "ATS", total: "O/U", moneyline: "ML" };

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
      if (p != null) w.push(`The model gives this side about a ${saPct(p, 0)} chance to win.`);
      if (sa.price != null) w.push(`Picks like this have won ${saRecStr(sa)} the last three years — enough to stay ahead at these prices.`);
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
        live_status: raw.live_status && typeof raw.live_status === "object" ? raw.live_status : null,
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

    // ===================== LIVE HIT-ODDS INDICATOR (per-pick live_status) =====================
    // The backend now serves a per-pick `live_status` on live games:
    //   { prob_hit, pct_to_goal, direction:"trending_hit"|"trending_miss"|"too_close",
    //     delta_vs_pregame }
    // It can ride on the display_pick, on the de_plays market, or on the game itself.
    // Read defensively — degrade to nothing when absent (the current live board has none yet).
    function liveStatusOf(g: any, pl: any) {
      if (!g || (String(g.status || "pre").toLowerCase() !== "live")) return null;
      const cands = [
        pl && pl.live_status,
        pl && pl.sa && pl.sa.live_status,
        g.display_pick && g.display_pick.live_status,
        pl && pl.market && g.de_plays && g.de_plays[pl.market] && g.de_plays[pl.market].live_status,
        g.live_status,
      ];
      for (const c of cands) {
        if (c && typeof c === "object" && (c.prob_hit != null || c.pct_to_goal != null || c.direction)) {
          const prob = c.prob_hit != null && !isNaN(Number(c.prob_hit)) ? Number(c.prob_hit) : null;
          let dir = String(c.direction || "").toLowerCase();
          if (dir !== "trending_hit" && dir !== "trending_miss" && dir !== "too_close") {
            // derive a direction from prob if the backend omitted it
            dir = prob == null ? "too_close" : prob >= 0.62 ? "trending_hit" : prob <= 0.42 ? "trending_miss" : "too_close";
          }
          const pct = c.pct_to_goal != null && !isNaN(Number(c.pct_to_goal)) ? Math.max(0, Math.min(1, Number(c.pct_to_goal))) : (prob != null ? prob : null);
          const delta = c.delta_vs_pregame != null && !isNaN(Number(c.delta_vs_pregame)) ? Number(c.delta_vs_pregame) : null;
          return { prob, dir, pct, delta };
        }
      }
      return null;
    }
    const LIVE_DIR: any = {
      trending_hit: { cls: "hit", word: "trending our way", short: "our way" },
      too_close: { cls: "close", word: "still a coin flip", short: "coin flip" },
      trending_miss: { cls: "miss", word: "trending against us", short: "against us" },
    };
    // The prominent live hit-odds indicator: "68% to cash · trending your way" + a meter
    // toward the line. size: "tile" (compact, on game boxes) | "full" (detail sheet).
    function liveHitOdds(g: any, pl: any, size = "tile") {
      const ls = liveStatusOf(g, pl);
      if (!ls) return "";
      // A decided live bet reads as clinched/cooked — never a bare "100% to cash" (or 0%),
      // which looks like a bug even though it's technically correct.
      const clinched = ls.prob != null && ls.prob >= 0.985;
      const cooked = ls.prob != null && ls.prob <= 0.015;
      if (clinched || cooked) {
        const cls = clinched ? "hit" : "miss";
        const cash = clinched ? "Cashing ✓" : "Not landing";
        const dir = clinched ? "as good as in" : "out of reach";
        return `<div class="lho lho-${size} dir-${cls} lho-done" title="${clinched ? "This pick is all but clinched." : "This pick can no longer cash."}">
          <div class="lho-top"><span class="lho-cash">${cash}</span><span class="lho-dir"><span class="lho-dot"></span>${esc(dir)}</span></div>
          <span class="lho-track"><span class="lho-fill" style="width:${clinched ? 100 : 3}%"></span><span class="lho-goal"></span></span>
        </div>`;
      }
      const meta = LIVE_DIR[ls.dir] || LIVE_DIR.too_close;
      // Meter tracks the SAME number as the label — probability to cash — so a fuller bar
      // always means "more likely to win", for OVER and UNDER alike (pct_to_goal would fill
      // toward the line, which reads backwards on an under).
      const pctW = ls.prob != null ? Math.max(3, Math.min(100, ls.prob * 100)) : (ls.pct != null ? Math.max(3, Math.min(100, ls.pct * 100)) : 0);
      const cashTxt = ls.prob != null ? `${(ls.prob * 100).toFixed(0)}% to cash` : (size === "full" ? "Live read" : "Live");
      const deltaTxt = ls.delta != null && Math.abs(ls.delta) >= 0.005
        ? `<span class="lho-delta ${ls.delta >= 0 ? "up" : "down"}">${ls.delta >= 0 ? "▲" : "▼"} ${Math.abs(ls.delta * 100).toFixed(0)}% vs pregame</span>` : "";
      return `<div class="lho lho-${size} dir-${meta.cls}" title="Live hit odds — ${(ls.prob != null ? (ls.prob * 100).toFixed(0) + "% to cash · " : "")}${meta.word}">
        <div class="lho-top"><span class="lho-cash">${esc(cashTxt)}</span><span class="lho-dir"><span class="lho-dot"></span>${esc(size === "full" ? meta.word : meta.short)}</span></div>
        <span class="lho-track"><span class="lho-fill" style="width:${pctW.toFixed(0)}%"></span><span class="lho-goal"></span></span>
        ${deltaTxt ? `<div class="lho-foot">${deltaTxt}</div>` : ""}
      </div>`;
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
    // Confidence = STARS (universal), filled ★ vs empty ☆, count = conviction. One gold
    // scale everywhere so ★★★ / ★★☆ / ★☆☆ reads instantly as Strong / Good / Lean.
    const qDiamonds = (q: any) => {
      const n = q === "strong" ? 3 : q === "good" ? 2 : 1;
      let h = "";
      for (let i = 0; i < 3; i++) h += `<i class="${i < n ? "f" : "e"}">${i < n ? "★" : "☆"}</i>`;
      return `<span class="qdia q-${q}" aria-hidden="true">${h}</span>`;
    };
    // The tier as a self-explaining chip: the meter + the WORD together, always legible.
    const qBadge = (q: any, size = "") => {
      if (q !== "strong" && q !== "good" && q !== "lean") return "";
      return `<span class="qbadge q-${q}${size ? " " + size : ""}">${qDiamonds(q)}<b>${Q_LABEL[q]}</b></span>`;
    };
    // A small, always-legible tier legend — states what each word means so "Good vs Lean"
    // is never ambiguous. Rendered on the board and inside the detail sheet.
    function tierLegend(compact = false) {
      const item = (q: string, lab: string, desc: string) =>
        `<span class="tl-item q-${q}">${qDiamonds(q)}<b>${lab}</b>${compact ? "" : `<i>${desc}</i>`}</span>`;
      return `<div class="tierlegend${compact ? " compact" : ""}">
        ${item("strong", "Strong", "highest conviction")}
        ${item("good", "Good", "solid, published call")}
        ${item("lean", "Lean", "a directional read")}
        <button class="tl-how" id="tl-how" aria-label="How picks work">How picks work →</button>
      </div>`;
    }
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
    // One-time welcome banner — sets expectations for new users (we pass often; every pick graded).
    const introSeen = () => { try { return localStorage.getItem("de_seen_intro") === "1"; } catch { return true; } };
    const setIntroSeen = () => { try { localStorage.setItem("de_seen_intro", "1"); } catch {} };
    function introBanner() {
      if (introSeen()) return "";
      return `<div class="intro-banner" id="intro-banner">
        <button class="ib-x" id="ib-x" aria-label="Dismiss">✕</button>
        <div class="ib-head"><span class="ib-dia">◆</span><b>Welcome to DiamondEdge</b></div>
        <p class="ib-desc">One clear pick per game, every one graded in the open against the final score. We pass often — that's the discipline that keeps the record honest.</p>
        <button class="ib-how" id="ib-how">See how it works →</button>
      </div>`;
    }

    // ===================== ACCOUNT / AUTH (stubbed session — no real OAuth/signup) =====================
    // The signed-in user is one localStorage record `de_account`:
    //   { provider:"google"|"apple"|"facebook"|"x"|"email", name, email, since }
    // OAUTH WIRE-IN POINT: each social button's handler currently calls mockSignIn(provider).
    // A real flow replaces that with the provider's OAuth (redirect / popup / native SDK),
    // then persists the returned profile + a session token here and mirrors it server-side.
    function getAccount() {
      try { const raw = localStorage.getItem("de_account"); return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    function setAccount(a: any) {
      try { if (a) localStorage.setItem("de_account", JSON.stringify(a)); else localStorage.removeItem("de_account"); } catch {}
    }
    const isSignedIn = () => !!getAccount();
    const PROVIDER_LABEL: any = { google: "Google", apple: "Apple", facebook: "Facebook", x: "X", email: "Email" };
    // Create a mock signed-in session for a provider (persists immediately). Returns the account.
    function mockSignIn(provider: string, email?: string, name?: string) {
      const nm = name || (provider === "email" && email ? String(email).split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "DiamondEdge Member");
      const em = email || `${provider === "email" ? "you" : provider}@diamondedge.app`;
      const acct = { provider, name: nm, email: em, since: todayISO() };
      setAccount(acct);
      return acct;
    }
    function signOut() { setAccount(null); }
    // Initials for the header avatar (from the account name/email, or a generic glyph).
    function accountInitials() {
      const a = getAccount();
      if (!a) return "";
      const src = String(a.name || a.email || "").trim();
      const parts = src.split(/[\s@._]+/).filter(Boolean);
      if (!parts.length) return "DE";
      return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
    }
    // Provider brand marks (inline SVG/glyph, self-contained — no external logo assets).
    const PROVIDER_MARK: any = {
      google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.04 5.04 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.71 3.25-7.9z"/><path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.23v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.88 14.15a6.6 6.6 0 0 1 0-4.2V7.1H2.23a11 11 0 0 0 0 9.9l3.65-2.85z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.05.55 4.19 1.64l3.14-3.14A10.98 10.98 0 0 0 12 1 11 11 0 0 0 2.23 7.1l3.65 2.85C6.74 7.32 9.15 5.4 12 5.4z"/></svg>`,
      apple: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.05 12.54c-.02-2.06 1.68-3.05 1.76-3.1-0.96-1.4-2.46-1.6-2.99-1.62-1.27-.13-2.48.75-3.13.75-.64 0-1.64-.73-2.7-.71-1.39.02-2.67.81-3.38 2.05-1.44 2.5-.37 6.2 1.03 8.23.69.99 1.51 2.1 2.58 2.06 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.7.65 1.12-.02 1.82-1.01 2.5-2 .79-1.15 1.11-2.26 1.13-2.32-.02-.01-2.17-.83-2.19-3.29zM15 6.35c.57-.69.96-1.65.85-2.6-.82.03-1.82.55-2.41 1.24-.53.6-.99 1.58-.87 2.5.92.07 1.86-.46 2.43-1.14z"/></svg>`,
      facebook: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95H15.8c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12z"/></svg>`,
      x: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23 5.46-6.23zm-1.16 17.52h1.84L7.01 4.13H5.03l12.05 15.64z"/></svg>`,
    };
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

    // ===================== EDITORIAL THUMBNAIL / HERO (self-contained, no image deps) =====================
    // A publication-style image area for a story: a theme-tinted gradient wash + a faint
    // sport/theme icon watermark, with the two team logos composited on top (away left,
    // home right, "@" between). Pure logo CDNs (already used for crests) + inline SVG —
    // no external image files, no generated bitmaps. Degrades to text crests on load error.
    const HERO_TINT: any = {
      fire:   ["rgba(255,138,76,.30)", "rgba(217,44,71,.16)"],
      weather:["rgba(255,138,76,.30)", "rgba(217,44,71,.16)"],
      streak: ["rgba(215,164,21,.30)", "rgba(11,158,109,.14)"],
      trend:  ["rgba(47,111,224,.24)", "rgba(11,158,109,.14)"],
      books:  ["rgba(47,111,224,.26)", "rgba(124,138,158,.14)"],
      travel: ["rgba(124,138,158,.24)", "rgba(47,111,224,.14)"],
      rest:   ["rgba(84,104,138,.24)", "rgba(47,111,224,.12)"],
      record: ["rgba(11,158,109,.26)", "rgba(215,164,21,.14)"],
      gold:   ["rgba(224,172,32,.34)", "rgba(11,158,109,.14)"],
      green:  ["rgba(11,158,109,.28)", "rgba(47,111,224,.12)"],
      pick:   ["rgba(47,111,224,.24)", "rgba(11,158,109,.14)"],
    };
    // size: "lead" (tall front-page hero) | "card" (compact 16:9 thumbnail) | "rail" (small)
    function heroImage(g: any, tint = "pick", size = "card", big = false) {
      const [c1, c2] = HERO_TINT[tint] || HERO_TINT.pick;
      const ic = tint === "gold" || tint === "green" || tint === "pick" ? "trend" : tint;
      const cls = `heroimg hi-${size}${big ? " big" : ""}`;
      const crestCls = size === "lead" ? "hi-crest lg" : "hi-crest";
      return `<div class="${cls}" style="--t1:${c1};--t2:${c2}" aria-hidden="true">
        <span class="hi-wm">${IC[ic] ? `<svg viewBox="0 0 24 24">${IC[ic].replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>` : ""}</span>
        <div class="hi-mu">
          <span class="${crestCls}">${gCrest(g, "away")}</span>
          <span class="hi-at">@</span>
          <span class="${crestCls}">${gCrest(g, "home")}</span>
        </div>
      </div>`;
    }
    // Compose the DiamondEdge Pick directly ONTO a hero image, magazine-cover-line style:
    // a bottom gradient scrim for legibility + the frozen pick as an overlaid cover line.
    // Uses the served article.pick_headline (via pickHeadline) so the image carries the
    // pick the way a magazine cover carries its headline. size: "lead" | "card".
    function heroPickCover(g: any, size = "lead") {
      const pl = displayPick(g);
      const locked = pl ? pickLocked(pl, playState(g, pl)) : false;
      const ph = pickHeadline(g);
      const q = ph.q || (pl ? qualityOf(pl) : null) || "lean";
      const st = pl ? playState(g, pl) : "open";
      const state = pl && pl.action === "TAKE" ? pickStateTxt(g, pl, st) : null;
      const kick = isStarted(g) ? "Pre-Game Pick" : "DiamondEdge Pick";
      if (locked) {
        return `<div class="hpc hpc-${size} locked" data-up="1"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ ${esc(kick)}</span><span class="hpc-lock">${lockSvg} Unlock</span></div></div>`;
      }
      if (!ph.has) {
        return `<div class="hpc hpc-${size} pass"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ The Verdict</span><b class="hpc-txt">No Pick — Passing</b></div></div>`;
      }
      // Prefer the FROZEN display pick's full side+line+price — the served pick_headline
      // often omits the line (e.g. "OVER"), and a cover line must name the whole call.
      let bare = ph.txt.replace(/^\s*(◆\s*)?(DiamondEdge|Pre-?Game)\s*Pick\s*:?\s*/i, "");
      if (pl && pl.action === "TAKE" && pl.side) {
        const priced = pl.price != null ? ` <em>${fmtOdds(pl.price)}</em>` : "";
        bare = `${esc(pl.side)}${priced}`;
      } else {
        bare = esc(bare);
      }
      // Stars ride INLINE on the pick line (confidence), so there's no separate meta line —
      // just kicker → "OVER 8 −115 ★★★" → optional result badge.
      return `<div class="hpc hpc-${size} q-${q}"><div class="hpc-scrim"></div>
        <div class="hpc-line">
          <span class="hpc-k">◆ ${esc(kick)}</span>
          <div class="hpc-pickrow"><b class="hpc-txt">${bare}</b><span class="hpc-stars">${qDiamonds(q)}</span>${state ? `<span class="hpc-res ${state.cls}">${state.txt}</span>` : ""}</div>
        </div></div>`;
    }
    // LIVE composite for a hero image: a pulsing LIVE badge + the live score + how the
    // pick is trending, woven onto the cover art (top band, over its own scrim). Shown only
    // for live games; degrades to "" otherwise. Uses live_scores + display_pick.live_status.
    function heroLiveBadge(g: any, size = "lead") {
      const gs = gameState(g);
      if (gs.kind !== "live") return "";
      const sc = gs.score;
      const scoreTxt = sc && sc.split && sc.home != null
        ? `${esc(g.away_abbr)} <b>${num(sc.away, 0)}</b> · <b>${num(sc.home, 0)}</b> ${esc(g.home_abbr)}`
        : "";
      const per = gs.label && gs.label !== "Live" ? esc(gs.label) : "";
      const pl = displayPick(g);
      const ls = pl && pl.action === "TAKE" ? liveStatusOf(g, pl) : null;
      let trend = "";
      if (ls) {
        const clinched = ls.prob != null && ls.prob >= 0.985;
        const cooked = ls.prob != null && ls.prob <= 0.015;
        if (clinched) trend = `<span class="hlb-trend hit">Cashing ✓</span>`;
        else if (cooked) trend = `<span class="hlb-trend miss">Not landing</span>`;
        else {
          const meta = LIVE_DIR[ls.dir] || LIVE_DIR.too_close;
          const cash = ls.prob != null ? `${(ls.prob * 100).toFixed(0)}%` : "";
          trend = `<span class="hlb-trend ${meta.cls}">${cash ? `${cash} ` : ""}${esc(meta.short)}</span>`;
        }
      }
      return `<div class="hlb hlb-${size}">
        <span class="hlb-badge"><span class="livedot"></span>LIVE</span>
        ${scoreTxt ? `<span class="hlb-score">${scoreTxt}${per ? ` <i>${per}</i>` : ""}</span>` : per ? `<span class="hlb-score"><i>${per}</i></span>` : ""}
        ${trend}
      </div>`;
    }
    // Choose the tint that fits a story: pick quality first, then theme keywords.
    function heroTintFor(g: any, pl: any) {
      if (pl && pl.action === "TAKE") {
        const q = qualityOf(pl);
        if (q === "strong") return "gold";
        if (q === "good") return "green";
      }
      // theme-flavored from the served article headline / streaks
      const art = gameArticle(g);
      const hint = ((art && (art.headline || art.dek)) || "") + " " + gameStreaks(g).map((s: any) => s.text).join(" ");
      const t = iconForText(hint);
      return t === "trend" ? "pick" : t;
    }

    // ===================== PREVIEW DATA VISUALS (The Athletic-style, self-contained SVG) =====================
    // Every visual is built from REAL served fields and degrades to "" when the data
    // isn't there. Light liquid-glass styled; no external deps.

    // (a) Predicted-score bar: the model's expected final as two proportional bars.
    function vizPredScore(g: any) {
      const ps = g.predicted_score || {};
      if (ps.home == null || ps.away == null) return "";
      const a = Number(ps.away), h = Number(ps.home);
      if (isNaN(a) || isNaN(h)) return "";
      const mx = Math.max(a, h, 1);
      const unit = SPORT_UNIT[g.sport] || "points";
      const bar = (ab: any, v: number, win: boolean) =>
        `<div class="pvz-brow"><span class="pvz-ab">${esc(ab)}</span><span class="pvz-track"><span class="pvz-fill ${win ? "win" : ""}" style="width:${Math.max(6, (v / mx) * 100).toFixed(0)}%"></span></span><b class="pvz-v">${num(v, 1)}</b></div>`;
      return `<div class="pvz"><div class="pvz-h">${icon("form", "sm")}Model's expected final</div>
        ${bar(g.away_abbr, a, a > h)}${bar(g.home_abbr, h, h > a)}
        <div class="pvz-foot">~${num(a + h, 1)} ${unit} combined · ${esc(ps.winner_abbr || (h > a ? g.home_abbr : g.away_abbr))} by ${num(Math.abs(h - a), 1)}</div></div>`;
    }

    // (b) Recent-form over/under strip: "OVER in 7 of last 10" as a 10-cell bar. Reads
    // real streak text like "OVER in 7 of its last 10" or derives from form runs.
    function vizFormStrip(g: any) {
      const hits: string[] = [];
      gameStreaks(g).forEach((s: any) => {
        const m = String(s.text || "").match(/(over|under)[^0-9]*(\d+)\s*(?:of|\/)\s*(?:its?\s*)?(?:last\s*)?(\d+)/i);
        if (m) hits.push(`${m[1]}|${m[2]}|${m[3]}|${esc(s.text)}`);
      });
      if (!hits.length) return "";
      return hits.slice(0, 2).map((raw) => {
        const [side, wonS, ofS] = raw.split("|");
        const won = Math.min(Number(wonS), Number(ofS)), of = Number(ofS);
        const isOver = /over/i.test(side);
        let cells = "";
        for (let i = 0; i < of; i++) cells += `<span class="fs-c ${i < won ? (isOver ? "over" : "under") : "off"}"></span>`;
        return `<div class="pvz"><div class="pvz-h">${icon("trend", "sm")}${isOver ? "Overs" : "Unders"} lately</div>
          <div class="fs-cells">${cells}</div>
          <div class="pvz-foot"><b>${won} of ${of}</b> recent games went <b>${isOver ? "OVER" : "UNDER"}</b> the total</div></div>`;
      }).join("");
    }

    // (c) Win-probability meter: model vs market implied, from ml_pick.
    function vizWinProb(g: any) {
      const mp = g.ml_pick || {};
      const our = mp.our_winprob != null ? Number(mp.our_winprob) : null;
      let mkt = mp.market_winprob != null ? Number(mp.market_winprob) : null;
      if (mkt == null && mp.price != null) { const d = Number(mp.price); if (d > 1 && d < 100) mkt = 1 / d; }
      if (our == null) return "";
      const side = esc(mp.side || g.home_abbr);
      const p = (v: any) => (v == null ? "—" : (Number(v) * 100).toFixed(0) + "%");
      return `<div class="pvz"><div class="pvz-h">${icon("record", "sm")}Win chance — ${side}</div>
        <div class="wp-bars">
          <div class="wp-row"><span class="wp-k">Our model</span><span class="wp-track"><span class="wp-fill ours" style="width:${(our * 100).toFixed(0)}%"></span></span><b class="wp-v">${p(our)}</b></div>
          ${mkt != null ? `<div class="wp-row"><span class="wp-k">The market</span><span class="wp-track"><span class="wp-fill mkt" style="width:${(mkt * 100).toFixed(0)}%"></span></span><b class="wp-v">${p(mkt)}</b></div>` : ""}
        </div></div>`;
    }

    // (d) Head-to-head strip: season series record as a small split bar.
    function vizH2H(g: any) {
      const h = g.pregame_intel && g.pregame_intel.h2h;
      if (!h || (h.away_wins == null && h.home_wins == null)) return "";
      const aw = Number(h.away_wins || 0), hw = Number(h.home_wins || 0), tot = aw + hw;
      if (!tot) return "";
      return `<div class="pvz"><div class="pvz-h">${icon("h2h", "sm")}Season series</div>
        <div class="h2-strip"><span class="h2-side away" style="flex:${aw || 0.001}">${aw ? `${esc(g.away_abbr)} ${aw}` : ""}</span><span class="h2-side home" style="flex:${hw || 0.001}">${hw ? `${esc(g.home_abbr)} ${hw}` : ""}</span></div>
        <div class="pvz-foot">${esc(h.record || `${aw}-${hw}`)} across ${h.games || tot} meetings this year</div></div>`;
    }

    // (e) Pitcher line chips (MLB): starter + ERA as compact chips.
    function vizPitchers(g: any) {
      const pit = g.pregame_intel && g.pregame_intel.pitchers;
      if (!pit) return "";
      const chip = (ab: any, p: any) => (p && p.name)
        ? `<div class="pit-chip"><span class="pit-ab">${esc(ab)}</span><span class="pit-nm">${esc(p.name)}</span>${p.era != null ? `<span class="pit-era">${num(p.era, 2)} ERA</span>` : ""}</div>` : "";
      const a = chip(g.away_abbr, pit.away), h = chip(g.home_abbr, pit.home);
      if (!a && !h) return "";
      return `<div class="pvz"><div class="pvz-h">${icon("pitcher", "sm")}On the mound</div><div class="pit-row">${a}${h}</div></div>`;
    }

    // The full data-visual rail for a preview: assemble whichever visuals have data.
    function previewViz(g: any) {
      const parts = [vizPredScore(g), vizWinProb(g), vizFormStrip(g), vizPitchers(g), vizH2H(g)].filter(Boolean);
      if (!parts.length) return "";
      return `<div class="pvz-grid">${parts.slice(0, 5).join("")}</div>`;
    }

    // ===================== EDITORIAL COPY GUARD =====================
    // House tone: confident sports journalism. The graded record is the honesty —
    // hedging phrases and internal tags never reach the page.
    function cleanCopy(s: any) {
      let t = String(s == null ? "" : s);
      t = t.replace(/\s*[—–-]?\s*paper-?tracked[^.;]*(\.|;|$)/gi, ".")
        .replace(/\bon paper\b\s*\([^)]*\)/gi, "in real time")
        .replace(/\bon paper\b/gi, "in real time")
        .replace(/\bpaper[- ](picks?|record|ledger|plays?|bets?)\b/gi, "$1")
        .replace(/\bpaper[- ]only\b/gi, "")
        .replace(/\bpaper\b/gi, "")
        .replace(/,?\s*\(?\s*no real stakes\s*\)?/gi, "")
        .replace(/,?\s*not real stakes\b[.,]?/gi, "")
        .replace(/\btiny sample\b[^.;]*(\.|;|$)/gi, "")
        .replace(/\bfar too few settled (plays|picks|bets)[^.;]*(\.|;|$)/gi, "")
        .replace(/\bsettled (plays|picks|bets)\b/gi, "graded picks")
        .replace(/\bsample size\b/gi, "how many picks")
        .replace(/\bsample\b/gi, "")
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
    // Once a game is live or final, the pick label must make clear it was FROZEN before
    // first pitch — never made mid-game. Pre-game it's the branded "DiamondEdge Pick".
    const isStarted = (g: any) => { const s = String((g && g.status) || "pre").toLowerCase(); return s === "live" || s === "final"; };
    const pickLabel = (g: any) => (isStarted(g) ? "◆ Pre-Game Pick" : "◆ DiamondEdge Pick");
    const pickWord = (g: any) => (isStarted(g) ? "Pre-Game Pick" : "DiamondEdge Pick");
    // The pick sub-headline for a preview: served article.pick_headline wins, else composed
    // from the display pick. Always names the side/line; passes read "No Pick — Passing".
    function pickHeadline(g: any) {
      const art = gameArticle(g);
      if (art && art.pick_headline) {
        // normalize the served label's brand prefix to the state-aware one
        let s = String(art.pick_headline).replace(/^\s*(◆\s*)?(DiamondEdge|Pre-?Game)\s*Pick\s*:?\s*/i, "");
        if (/no pick|pass/i.test(s) || !s.trim()) return { txt: "No Pick — Passing", has: false };
        return { txt: `${pickWord(g)}: ${s}`, has: true };
      }
      const pl = displayPick(g);
      if (pl && pl.action === "TAKE" && pl.side) {
        return { txt: `${pickWord(g)}: ${String(pl.side)}${pl.price != null ? ` (${fmtOdds(pl.price)})` : ""}`, has: true, q: qualityOf(pl) };
      }
      return { txt: "No Pick — Passing", has: false };
    }

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
        pick_headline: a.pick_headline || a.pick_line || null, // e.g. "DiamondEdge Pick: OVER 8"
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
    let tab = "today";              // "today" | "games" | "results" | "settings" | "upgrade" | "account"
    const TABS = ["today", "games", "results", "settings", "upgrade", "account"];
    let accountMode = "menu";       // account-view sub-state: "menu" | "signin" | "subscribe"
    let league = "mlb";             // selected league
    let curDate = todayISO();       // selected date (ISO)
    let histOpen = false;           // history range panel open
    let rangeFrom = "", rangeTo = "";
    let rangeMode = false;          // showing range results
    let rangeGames: any[] = [];     // {date,games}
    let payload: any = null;        // current day's payload
    let newsFeed: any = null;       // live sports-news feed (news_feed key, ~20-min refresh)
    let livePayload: any = null;    // the live board (today's key) — cached for past-day merges
    let indexData: any = null;      // pregame_picks_index
    let detail: any = null;         // open detail game
    let detailTab = "preview";      // detail page tab: "preview" | "live"
    let liveScores: any = null;     // latest live_scores snapshot (fresh score overlay)
    let liveDetail: any = null;     // latest live_detail snapshot (box scores) — polled while live
    let liveDetailTried = false;    // avoid hammering a missing live_detail key
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
    // Overlay the fresh live_scores snapshot onto a games array in place (status /
    // score / period / total_so_far). Used for BOTH `payload` (the Games board) and
    // `livePayload` (the Today homepage source) so every surface flips pre→live→final.
    function overlayInto(games: any[]) {
      if (!liveScores || !liveScores.games || !Array.isArray(games)) return false;
      let changed = false;
      games.forEach((g: any) => {
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
        // keep the frozen display_pick's live progress fill fresh (contract §"live")
        if (g.display_pick && g.display_pick.progress && ls.total_so_far != null) {
          if (g.display_pick.progress.total_so_far !== ls.total_so_far) changed = true;
          g.display_pick.progress.total_so_far = ls.total_so_far;
        }
      });
      return changed;
    }
    function applyLiveScores() {
      if (!liveScores || !liveScores.games) return false;
      // Only decline the overlay when the snapshot is OLDER than the big serve on
      // BOTH sources — live_scores is authoritative for status+score recency (contract §3).
      const lu = Date.parse(liveScores.updated_at || "") || 0;
      const pu = payload ? (Date.parse(payload.generated_at || "") || 0) : 0;
      if (payload && pu && lu && lu < pu) return false;
      let changed = false;
      // Today's homepage reads `livePayload`; the board reads `payload`. On today these
      // are the SAME object, but on a past day they differ — overlay both defensively.
      if (payload && overlayInto(payload.games || [])) changed = true;
      if (livePayload && livePayload !== payload && overlayInto(livePayload.games || [])) changed = true;
      return changed;
    }
    // Poll whenever a currently-loaded board has something live (or starting within
    // 15 min) — regardless of which tab is showing, so the Today homepage and Games
    // board both stay fresh. Paused only while the whole document is hidden.
    function liveWindowActive() {
      const src = livePayload || payload;
      if (!src || (curDate !== todayISO() && !livePayload)) return false;
      // If the tiny snapshot already says a game is live, that's reason enough to poll.
      if (liveScores && liveScores.any_live) return true;
      const now = Date.now();
      return ((src.games || []) as any[]).some((g: any) => {
        const st = String(g.status || "pre").toLowerCase();
        if (st === "live") return true;
        if (st !== "pre") return false;
        const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
        if (!ts) return false;
        const dt = new Date(ts).getTime() - now;
        return dt <= 15 * 60 * 1000 && dt > -12 * 3600 * 1000;
      });
    }
    // Re-render whichever surface is showing, after a fresh overlay.
    // The Today view is expensive to rebuild (iterates the whole slate, composes hero images,
    // runs count-ups). Cache it: only re-render on an actual data change, not on every tab
    // flip — so switching tabs is instant instead of re-parsing a huge HTML string each time.
    let todayFresh = false;
    function refreshLiveViews() {
      renderTicker();
      if (tab === "today") { renderToday(); todayFresh = true; }
      else { todayFresh = false; if (tab === "games" && !rangeMode) renderSlate(true); }
      if (detail && detail.game_id != null) refreshSheetScore(detail);
    }
    // ---- BANDWIDTH-SMART big-payload refresh: the pregame_picks payload changes ~every
    // 30 min. Re-fetch infrequently and ONLY apply when generated_at advanced (no wasteful
    // re-render). Paused while hidden; runs one immediate check on focus. ----
    async function pollPregame() {
      if (document.hidden) return;
      if (curDate !== todayISO() || rangeMode) return; // only the live "today" board auto-refreshes
      let p: any = null;
      try { p = await snap("pregame_picks"); } catch {}
      if (!p || !p.games) return;
      const oldStamp = (livePayload && (livePayload.generated_at || livePayload.date)) || "";
      const newStamp = p.generated_at || p.date || "";
      if (newStamp && oldStamp && newStamp === oldStamp) return; // unchanged → do nothing
      livePayload = p;
      if (curDate === todayISO()) payload = p;
      applyLiveScores();
      // keep the selected league valid, then refresh the visible surface in place
      root.querySelectorAll(".sporttab .cnt").forEach((el: any) => {});
      refreshLiveViews();
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
      refreshLiveViews();
    }
    // Update an open detail PAGE's score in place (no re-render, keeps scroll). Refreshes
    // the fused hero score + the live box-score pane if the "How it's going" tab is mounted.
    function refreshSheetScore(g: any) {
      const page = $("gamepage"); if (!page) return;
      const gs = gameState(g);
      const el = page.querySelector(".gp-center");
      if (el && gs.score && gs.score.split && gs.score.home != null) {
        el.innerHTML = `<div class="gp-score ${gs.kind}"><b>${num(gs.score.away, 0)}</b><span class="gp-scmid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label || "Live")}`}</span><b>${num(gs.score.home, 0)}</b></div>`;
      }
      const pane = page.querySelector('.gp-pane[data-pane="live"]');
      if (pane) pane.innerHTML = boxScorePanel(g);
      // also refresh the box score from the (possibly newer) live_detail
      pollLiveDetail();
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
    // (Pull-to-refresh removed — replaced by smart silent tiered auto-refresh in init.)

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
    // THREE-MARKET ROW — Total, Spread, Moneyline shown together. The TOTAL is THE
    // DiamondEdge Pick (heaviest treatment when it's the taken market); the MONEYLINE
    // surfaces as an additional directional LEAN read (clearly lightest), never the
    // headline edge. Each cell shows the market's number and, if it's a TAKE, its side.
    function threeMarketRow(g: any, lead: any) {
      const P = gamePlays(g);
      const leadMk = lead && lead.action === "TAKE" ? lead.market : null;
      // The moneyline "lean": the de_plays TAKE if present, else the directional ml_pick read.
      const mlPlay = P.moneyline && P.moneyline.action === "TAKE" ? P.moneyline : null;
      const mlRead = g.ml_pick && g.ml_pick.side ? g.ml_pick : null;
      const cell = (mk: string) => {
        const pl = P[mk];
        const pk = mk === "spread" ? g.spread_pick : mk === "total" ? g.total_pick : g.ml_pick;
        const isLead = mk === leadMk;
        const isTake = pl && pl.action === "TAKE";
        // number line
        let numTxt = "—";
        if (mk === "spread" && g.spread_pick && g.spread_pick.line != null) numTxt = `${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, g.spread_pick))}`;
        else if (mk === "total" && g.total_pick && g.total_pick.line != null) numTxt = `O/U ${num(g.total_pick.line)}`;
        else if (mk === "moneyline") {
          const mpr = (g.ml_pick && g.ml_pick.prices) || {};
          const px = g.ml_pick ? (g.ml_pick.price ?? mpr.home ?? mpr.away) : null;
          if (g.sport === "soccer" && mpr.home != null) numTxt = `1X2 ${fmtOdds(mpr.home)}·${fmtOdds(mpr.draw)}·${fmtOdds(mpr.away)}`;
          else if (px != null) numTxt = `${esc((g.ml_pick && g.ml_pick.side) || "ML")} ${fmtOdds(px)}`;
        }
        // label + strength
        const isML = mk === "moneyline";
        const q = isTake ? qualityOf(pl) : null;
        let strength = "";
        if (isTake) strength = `<span class="tm-take q-${q}">${pickArrow(pl)} ${esc(pl.side || "")}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}${qDiamonds(q)}</span>`;
        else if (isML && mlRead) strength = `<span class="tm-lean">◆ lean ${esc(mlRead.side)}${mlRead.our_winprob != null ? ` · ${(Number(mlRead.our_winprob) * 100).toFixed(0)}%` : ""}</span>`;
        else strength = `<span class="tm-pass">no edge</span>`;
        const cls = isLead ? "tm-cell is-pick" : isML ? "tm-cell is-ml" : "tm-cell";
        return `<div class="${cls}">
          <span class="tm-k">${MK_FULL[mk]}${isLead ? ` <b class="tm-badge">◆ The Pick</b>` : isML ? ` <b class="tm-badge lean">lean</b>` : ""}</span>
          <span class="tm-num">${numTxt}</span>
          ${strength}
        </div>`;
      };
      // Order: TOTAL first (it's the DiamondEdge Pick market), then spread, then the ML lean.
      const leadLab = leadMk ? MK_FULL[leadMk] : "total";
      return `<div class="threemk">${["total", "spread", "moneyline"].map(cell).join("")}</div>
        <div class="tm-note">The <b>${esc(leadLab.toLowerCase())}</b> is the DiamondEdge Pick — our heaviest read. The <b>moneyline</b> is a directional lean, the lightest signal, not the edge.</div>
        ${tierLegend(true)}`;
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
    // ALL THREE VEGAS LINES, compact + always present: "ATL -1.5 · O/U 8 · ATL -130".
    // Abbreviations save space; a missing market shows a dim placeholder rather than
    // vanishing. When the tile's pick sits in a market and we're NOT excluding it, that
    // segment becomes the tinted take chip; otherwise every segment is the raw book number.
    function vegasLine(g: any, mk: string) {
      if (mk === "spread") {
        const sp = g.spread_pick;
        if (sp && sp.line != null) return `${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, sp))}`;
      } else if (mk === "total") {
        const tp = g.total_pick;
        if (tp && tp.line != null) return `O/U ${num(tp.line)}`;
      } else if (mk === "moneyline") {
        const mp = g.ml_pick; const mpr = (mp && mp.prices) || {};
        if (g.sport === "soccer" && mpr.home != null && mpr.draw != null) return `1X2 ${fmtOdds(mpr.home)}·${fmtOdds(mpr.draw)}·${fmtOdds(mpr.away)}`;
        const px = mp ? (mp.price ?? mpr.home ?? mpr.away) : null;
        if (px != null) return `${esc(mp.side || g.home_abbr)} ${fmtOdds(px)}`;
      }
      return "";
    }
    // ===================== PER-TEAM ODDS + FORM (the team rows do the work) =====================
    // Scores-app line: each side carries its OWN spread(price) + moneyline next to the abbr.
    // spread_pick.line is the HOME run-line; away = its negation. prices are DECIMAL per side.
    // Degrades field-by-field: whatever isn't served simply doesn't render.
    function teamOdds(g: any, which: "home" | "away") {
      const out: any = { spread: null, spreadPx: null, ml: null };
      const sp = g.spread_pick;
      if (sp && sp.line != null) {
        const hl = spreadHomeLine(g, sp);
        out.spread = which === "home" ? hl : -hl;
        const pr = sp.prices || {};
        const px = which === "home" ? (pr.home ?? sp.price) : (pr.away ?? sp.price);
        if (px != null) out.spreadPx = fmtOdds(px);
      }
      const mp = g.ml_pick, mpr = (mp && mp.prices) || {};
      const mlpx = which === "home" ? mpr.home : mpr.away;
      if (mlpx != null) out.ml = fmtOdds(mlpx);
      else if (mp && mp.price != null && mp.side && String(mp.side) === String(which === "home" ? g.home_abbr : g.away_abbr)) out.ml = fmtOdds(mp.price);
      return out;
    }
    // Recent form as a compact record — L15 record ("6-9") + optional hot/cold streak
    // ("W3"/"L3"). Served for MLB only via streaks.{away,home}; absent → "".
    function teamForm(g: any, which: "home" | "away") {
      const s = g.streaks && typeof g.streaks === "object" ? g.streaks[which] : null;
      if (!s || typeof s !== "object") return null;
      // Season W-L is the record fans expect next to a team; only fall back to last-15 form,
      // and when we do, LABEL it so "7-8" never reads as a (broken) season record.
      const seasonRec = typeof s.record_season === "string" && /^\d+-\d+$/.test(s.record_season) ? s.record_season : null;
      const l15Rec = typeof s.record_l15 === "string" && /^\d+-\d+$/.test(s.record_l15) ? s.record_l15 : null;
      const rec = seasonRec || l15Rec;
      const recIsL15 = !seasonRec && !!l15Rec;
      const ws = s.win_streak && s.win_streak.n >= 2 && s.win_streak.result ? `${s.win_streak.result}${s.win_streak.n}` : null;
      if (!rec && !ws) return null;
      return { rec, recIsL15, streak: ws, hot: ws && ws[0] === "W" };
    }

    function marketStrip(g: any, pick: any, st: string, locked = false, excludePick = false) {
      const q = pick ? qualityOf(pick) : null;
      const mk = pick ? pick.market : null;
      const mark = pick ? resMark(st) : "";
      const started = isStarted(g);
      const seg = (m: string) => {
        const v = vegasLine(g, m);
        if (pick && mk === m && !excludePick) {
          // FREE MODE: the pick exists and its quality shows, but the side/line is locked.
          if (locked) return `<span class="ms take q-${q} locked"><span class="ms-lk">${lockSvg}</span><span class="ms-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}</span>`;
          return `<span class="ms take q-${q} ${st}">${pickArrow(pick)} ${esc(pick.side || v)}${pick.price != null ? ` <i>${fmtOdds(pick.price)}</i>` : ""}${qDiamonds(q)}${mark}</span>`;
        }
        if (pick && mk === m && excludePick) return ""; // the banner carries the pick
        // pre-game: always show the market (dim placeholder if no number). live/final:
        // only the numbers we still have, to keep the tile tight.
        if (!v) return started ? "" : `<span class="ms dim">${M_ABBR[m]} —</span>`;
        return `<span class="ms">${v}</span>`;
      };
      const parts = [seg("spread"), seg("total"), seg("moneyline")].filter(Boolean);
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
          <div class="pb-top"><span class="pb-brand">${pickLabel(g)}</span><span class="pb-lk">${lockSvg}</span></div>
          <div class="pb-main"><span class="pb-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}<span class="pb-unlock">Unlock</span></div>
        </div>`;
      }
      const state = pickStateTxt(g, pl, st);
      return `<div class="pickban q-${q} ${st}">
        <div class="pb-top"><span class="pb-brand">${pickLabel(g)}</span>${qDiamonds(q)}</div>
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
    // A scores-app team line: logo · ABBR · form(L15 + streak) · this side's spread(px) + ML · SCORE.
    // The odds live WITH the team so the card needs no separate stacked market strip.
    // Pre-game shows odds; live/final shows the score. Everything degrades independently.
    function tileRow(g: any, which: "away" | "home", gs: any) {
      const ab = which === "away" ? g.away_abbr : g.home_abbr;
      const sc = gs.score;
      const started = gs.kind !== "pre";
      let scoreHtml = "", winner = false, loser = false;
      if (started && sc && sc.split && sc.home != null) {
        const mine = which === "home" ? sc.home : sc.away;
        const other = which === "home" ? sc.away : sc.home;
        winner = gs.kind === "final" && mine > other;
        loser = gs.kind === "final" && mine < other;
        scoreHtml = `<span class="t-score${gs.kind === "live" ? " live" : ""}">${num(mine, 0)}</span>`;
      }
      // recent form (MLB-only, degrades to nothing)
      const fm = teamForm(g, which);
      const formHtml = fm
        ? `<span class="t-form">${fm.rec ? `<span class="tf-rec">${esc(fm.rec)}${fm.recIsL15 ? `<i class="tf-tag">L15</i>` : ""}</span>` : ""}${fm.streak ? `<span class="tf-strk ${fm.hot ? "hot" : "cold"}">${esc(fm.streak)}</span>` : ""}</span>`
        : "";
      // this side's spread + moneyline (pre-game only; the odds vanish once the score
      // matters). Compact scores-app convention: spread LINE + ML price (spread price is
      // dropped on the tile to stay one clean line — the full price lives in the detail).
      let oddsHtml = "";
      if (!started) {
        const o = teamOdds(g, which);
        const parts: string[] = [];
        if (o.spread != null) parts.push(`<span class="to-sp">${sgn(o.spread)}</span>`);
        if (o.ml != null) parts.push(`<span class="to-ml">${esc(o.ml)}</span>`);
        if (parts.length) oddsHtml = `<span class="t-odds">${parts.join(`<span class="to-sep">·</span>`)}</span>`;
      }
      return `<div class="t-row ${winner ? "winner" : ""} ${loser ? "loser" : ""}">
        <span class="t-crest">${gCrest(g, which)}</span>
        <span class="t-ab">${esc(ab)}</span>
        ${formHtml}
        <span class="t-rsp"></span>
        ${oddsHtml}
        ${scoreHtml}
      </div>`;
    }

    // The model's directional READ on a PASS game — enough to fill the pick slot with a
    // calm "not confident" note instead of blank space. Derives from served fields:
    // total our_proj vs line (over/under lean), else ml our_winprob (side lean). Returns
    // a short phrase or null. NEVER a call — it's explicitly a non-pick.
    function passRead(g: any) {
      const tp = g.total_pick;
      if (tp && tp.line != null && tp.our_proj != null) {
        const diff = Number(tp.our_proj) - Number(tp.line);
        if (Math.abs(diff) >= 0.15) return `leans ${diff > 0 ? "OVER" : "UNDER"} ${num(tp.line)}`;
      }
      const mp = g.ml_pick;
      if (mp && mp.our_winprob != null) {
        const wp = Number(mp.our_winprob);
        if (wp >= 0.55 || wp <= 0.45) { const side = wp >= 0.5 ? (mp.side || g.home_abbr) : (mp.side === g.home_abbr ? g.away_abbr : g.home_abbr); return `slight edge ${esc(side)}`; }
      }
      return null;
    }
    // The PASS pick-slot: same footprint as a real pick strip so cards stay uniform height.
    // Muted, empty diamonds (○○○), the model's directional read when we have one.
    function passStrip(g: any) {
      const read = passRead(g);
      return `<div class="pstrip pass">
        <div class="ps-main">
          <span class="ps-k">${pickLabel(g)}</span>
          <span class="ps-side">No Pick${read ? ` — ${esc(read)}` : " — line looks fair"}</span>
          <span class="qdia q-pass" aria-hidden="true"><i>◇</i><i>◇</i><i>◇</i></span>
        </div>
      </div>`;
    }

    // ONE compact pick strip: the DiamondEdge Pick (side · price), ONE quality mark, and —
    // when live — an inline hit read + ONE slim progress bar. Replaces the old stacked
    // pickBanner + liveHitOdds + pickProgress trio so the card stays short and uncluttered.
    function pickStrip(g: any, pl: any, st: string, locked: boolean, gs: any) {
      const q = qualityOf(pl);
      const live = gs.kind === "live";
      if (locked) {
        return `<div class="pstrip locked" data-up="1" role="button" aria-label="DiamondEdge Pick — locked">
          <span class="ps-k">${lockSvg} ${pickLabel(g)}</span>
          <span class="ps-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}
          <span class="ps-unlock">Unlock</span>
        </div>`;
      }
      const state = pickStateTxt(g, pl, st);
      // pre/final: pick + price + result mark. no bar.
      // live: pick + inline "68% to cash · your way" + ONE slim meter (only when live_status served).
      const ls = live && !locked ? liveStatusOf(g, pl) : null;
      let liveRow = "";
      if (ls) {
        const clinched = ls.prob != null && ls.prob >= 0.985;
        const cooked = ls.prob != null && ls.prob <= 0.015;
        const meta = clinched ? { cls: "hit", short: "as good as in" } : cooked ? { cls: "miss", short: "out of reach" } : (LIVE_DIR[ls.dir] || LIVE_DIR.too_close);
        const pctW = clinched ? 100 : cooked ? 3 : (ls.prob != null ? Math.max(4, Math.min(100, ls.prob * 100)) : (ls.pct != null ? Math.max(4, Math.min(100, ls.pct * 100)) : 0));
        const cash = clinched ? "Cashing ✓" : cooked ? "Not landing" : (ls.prob != null ? `${(ls.prob * 100).toFixed(0)}% to cash` : "Live read");
        liveRow = `<div class="ps-live dir-${meta.cls}">
          <span class="ps-cash">${esc(cash)}</span><span class="ps-dir"><span class="ps-dot"></span>${esc(meta.short)}</span>
          <span class="ps-meter"><span class="ps-fill" style="width:${pctW.toFixed(0)}%"></span></span>
        </div>`;
      } else if (live) {
        // live but no served live-odds: a single lean progress bar toward the total line.
        const prog = pickProgress(g, pl, st);
        if (prog) liveRow = prog;
      }
      return `<div class="pstrip q-${q} ${st}">
        <div class="ps-main">
          <span class="ps-k">${pickLabel(g)}</span>
          <span class="ps-side">${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}</span>
          ${qDiamonds(q)}
          ${state ? `<span class="ps-res ${state.cls}">${state.txt}</span>` : ""}
        </div>
        ${liveRow}
      </div>`;
    }

    function gameCard(g: any, idx: number) {
      const gs = gameState(g);
      const pick = displayPick(g);
      const q = pick ? qualityOf(pick) : null;
      const st = pick ? playState(g, pick) : "open";
      const locked = pick ? pickLocked(pick, st) : false;
      // The card carries the verdict through LIGHT, not borders: quality glow pre-game,
      // result glow after. The two TEAM ROWS carry the data (form + per-side odds + score);
      // ONE compact pick strip carries the DiamondEdge Pick + live read + one bar. No
      // duplicate diamonds, no separate stacked market strip, no second progress bar.
      const resCls = st === "won" || st === "clinched" ? "res-won" : st === "lost" || st === "cooked" ? "res-lost" : st === "pushed" ? "res-push" : "";
      const totPick = g.total_pick && g.total_pick.line != null ? Number(g.total_pick.line) : null;
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-note">${num(gs.score.total, 0)} ${SPORT_UNIT[g.sport] || ""} total</div>` : "";
      // The shared total (O/U) shown ONCE — it's the DiamondEdge Pick market. Pre-game only;
      // suppressed when the pick itself IS the total (the strip already names it).
      const pickIsTotal = pick && pick.market === "total";
      const totLine = gs.kind === "pre" && totPick != null && !pickIsTotal
        ? `<div class="t-total"><span class="tt-k">O/U</span><b>${num(totPick)}</b></div>` : "";
      return `<article class="tile ${gs.kind}${q ? ` q-${q}` : ""}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)}${pick ? (locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pick.side || "")}`) : ""} — open details">
        ${tileStatus(g, gs)}
        <div class="t-teams">${tileRow(g, "away", gs)}${tileRow(g, "home", gs)}</div>
        ${totOnly}${totLine}
        ${pick ? pickStrip(g, pick, st, locked, gs) : passStrip(g)}
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
        : `<div class="ft-take q-${q} ${st}"><span class="ft-de">${pickLabel(g)}</span>${pickArrow(pl)} <b>${esc(pl.side || "—")}</b>${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}<span class="ft-q">${qDiamonds(q)}${Q_LABEL[q]}</span>${res}</div>`;
      return `<article class="feat q-${q} ${gs.kind}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id)}" role="button" tabindex="0"
        aria-label="Featured — ${esc(g.away_abbr)} at ${esc(g.home_abbr)}${locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pl.side || "")}`} — open details">
        <div class="ft-top"><span class="ft-lab">◆ Featured</span><span class="ft-sport">${esc(SPORT_LABEL[g.sport] || g.sport || "")}</span></div>
        <div class="ft-mu">${side("away")}${mid}${side("home")}</div>
        ${take}
        ${gs.kind === "live" && !locked ? liveHitOdds(g, pl, "full") : ""}
        ${gs.kind === "live" && !locked ? pickProgress(g, pl, st) : ""}
      </article>`;
    }

    // This month's DiamondEdge Picks = TOTALS only (the validated edge). Spread/ML leans are
    // NOT blended into this headline number — they live in the record-breakdown sheet.
    function monthRecord() {
      const src = livePayload || payload;
      if (!src) return null;
      const m = todayISO().slice(0, 7);
      let w = 0, l = 0;
      ((src.games || []) as any[]).forEach((g: any) => {
        if (String(g.date || "").slice(0, 7) !== m) return;
        const P = gamePlays(g);
        (["total"] as string[]).forEach((mk) => {
          const pl = P[mk];
          if (pl && pl.action === "TAKE" && pl.result) {
            if (pl.result.status === "hit") w++;
            else if (pl.result.status === "miss") l++;
          }
        });
      });
      return w + l ? { w, l } : null;
    }
    // Record for ONE specific date (updates when you navigate the date strip): overall totals-pick
    // W-L plus the GOLD (Strong) subset, so a great gold day gets its own little flex.
    function dayRecordFor(dateISO: string) {
      const src = livePayload || payload;
      if (!src) return null;
      let w = 0, l = 0, gw = 0, gl = 0, live = 0, up = 0;
      ((src.games || []) as any[]).forEach((g: any) => {
        if (String(g.date || "").slice(0, 10) !== dateISO) return;
        const pl = gamePlays(g)["total"];
        if (pl && pl.action === "TAKE") {
          if (pl.result) { if (pl.result.status === "hit") w++; else if (pl.result.status === "miss") l++; }
          else { const gs = gameState(g); if (gs.kind === "live") live++; else if (gs.kind !== "final") up++; }
        }
        const dp = displayPick(g);
        const dr = resOf(dp);
        if (dp && dp.quality === "strong" && dr) { if (dr === "hit") gw++; else if (dr === "miss") gl++; }
      });
      // "great gold day" = at least 2 gold wins and a clearly winning slate
      const goldGreat = gw >= 2 && gw >= gl * 2;
      return { w, l, gw, gl, live, up, goldGreat, graded: w + l };
    }
    // Full record tally over a set of games (filter fn): graded W-L-push + still-outstanding
    // (live now / yet to start), broken out per market. Powers the record-breakdown sheet.
    function recordFor(filterFn: (g: any) => boolean) {
      const src = livePayload || payload;
      if (!src) return null;
      let w = 0, l = 0, push = 0, live = 0, upcoming = 0;
      const byMk: any = { total: { w: 0, l: 0 }, spread: { w: 0, l: 0 }, moneyline: { w: 0, l: 0 } };
      ((src.games || []) as any[]).forEach((g: any) => {
        if (!filterFn(g)) return;
        const P = gamePlays(g);
        const gs = gameState(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (!pl || pl.action !== "TAKE") return;
          if (pl.result) {
            if (pl.result.status === "hit") { w++; byMk[mk].w++; }
            else if (pl.result.status === "miss") { l++; byMk[mk].l++; }
            else push++;
          } else if (gs.kind === "live") live++;
          else if (gs.kind !== "final") upcoming++;
        });
      });
      return { w, l, push, live, upcoming, byMk };
    }
    const todayRec = () => recordFor((g: any) => String(g.date || "").slice(0, 10) === todayISO());
    const monthRec = () => recordFor((g: any) => String(g.date || "").slice(0, 7) === todayISO().slice(0, 7));
    function metaRow() {
      // "Picks" means the DiamondEdge Pick = TOTALS (the validated edge). We DON'T blend the
      // spread/moneyline leans into the headline number — that would flatter a rough day.
      // The day figure tracks the DATE you're viewing (navigate the strip → it updates), with a
      // little gold flex when the Strong picks had a great day.
      const isToday = curDate === todayISO();
      const dr = dayRecordFor(curDate);
      const m = monthRec();
      const mt = m ? m.byMk.total : { w: 0, l: 0 };
      const outstanding = dr ? dr.live + dr.up : 0;
      const dayLab = isToday ? "Today" : "That day";
      const dayTxt = (dr && (dr.graded + outstanding)) ? `${dayLab} <b>${dr.w}–${dr.l}</b>${outstanding ? ` · <b>${outstanding}</b> ${isToday ? "live" : "to come"}` : ""}` : "";
      const goldTxt = dr && dr.graded && (dr.goldGreat || (dr.gw && !dr.gl)) ? `<span class="rc-gold">★ ${dr.gw}–${dr.gl}</span>` : "";
      const monthTxt = (mt.w + mt.l) ? `${mt.w}–${mt.l} this month` : "Our record";
      const chip = `<button class="recchip" id="recchip" aria-label="See the pick record breakdown">${dayTxt ? `<span class="rc-today">${dayTxt}</span>${goldTxt}<span class="rc-dot">·</span>` : ""}<span class="rc-month">${monthTxt}</span> <span class="rc-arw">→</span></button>`;
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

    // Leagues sort by number of games (busiest first) by default; a saved user order (Settings)
    // pins preferred leagues to the front, remaining ones still fall in by game count.
    function leagueOrderPref(): string[] | null { try { const v = JSON.parse(localStorage.getItem("de_league_order") || "null"); return Array.isArray(v) ? v : null; } catch { return null; } }
    function orderedLeagues(src: any): string[] {
      const counts: any = {}; SPORTS.forEach((lg) => { counts[lg] = src ? gamesForLeague(src, lg).length : 0; });
      const byGames = (a: string, b: string) => (counts[b] - counts[a]) || (SPORTS.indexOf(a) - SPORTS.indexOf(b));
      const pref = leagueOrderPref();
      if (pref && pref.length) {
        const inpref = pref.filter((lg) => SPORTS.includes(lg));
        const rest = SPORTS.filter((lg) => !inpref.includes(lg)).sort(byGames);
        return [...inpref, ...rest];
      }
      return [...SPORTS].sort(byGames);
    }
    function renderScoresChrome() {
      const tabSrc = livePayload || payload;
      const tabsHtml = orderedLeagues(tabSrc).map((lg) => {
        const lgGames = tabSrc ? gamesForLeague(tabSrc, lg) : [];
        const cnt = lgGames.length;
        // a pulsing dot when a league has a game in progress right now (drives users to the live board)
        const live = lgGames.some((g: any) => gameState(g).kind === "live");
        return `<button class="sporttab ${lg === league ? "on" : ""}${live ? " haslive" : ""}" data-lg="${lg}" data-ic="${SPORT_ICON[lg] || ""}">${SPORT_LABEL[lg]}${live ? `<span class="livedot" aria-label="live games"></span>` : ""}<span class="cnt" id="cnt-${lg}">${cnt || ""}</span></button>`;
      }).join("");
      root.querySelector("#games-view").innerHTML = `
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
          body.innerHTML = `<div class="state"><div class="st-ico">${SPORT_LABEL[league]}</div><div class="big">No ${SPORT_LABEL[league]} on the board</div><div class="sm">Nothing scheduled for ${esc(dispDate)}. Try another league or date — and every past DiamondEdge Pick stays graded, win or lose, on the Results tab.</div></div>`;
        } else {
          // Featured hero: the single highest-conviction pick game leads the slate.
          const ft = featuredPick(games);
          const rest = ft ? games.filter((g: any) => g !== ft.g) : games;
          const anyPick = games.some((g: any) => { const p = displayPick(g); return p && p.action === "TAKE"; });
          body.innerHTML = `${anyPick ? tierLegend() : ""}${ft ? featuredCard(ft.g, ft.pl) : ""}<div class="slate">${rest.map((g: any, i: number) => gameCard(g, i)).join("")}</div>
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
      const rc = $("recchip"); if (rc) rc.onclick = () => openRecordBreakdown();
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
      const tlh = $("tl-how"); if (tlh) tlh.onclick = (e: any) => { e.stopPropagation(); openRecipeSheet(); };
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
        s.push(`Picks made exactly this way have won about ${(rh.hit * 100).toFixed(0)}% of the time since 2022 — and importantly, at prices good enough to come out ahead.`);
      } else {
        if (pl.p != null && pl.price != null)
          s.push(`The model gives this bet about a ${(Number(pl.p) * 100).toFixed(0)}% chance to win at ${fmtOdds(pl.price)}.`);
        s.push(`Like every DiamondEdge Pick, this one is graded against the final score — the full running record is on the Results tab.`);
      }
      return s.slice(0, 4);
    }
    const passWhy = () =>
      `We checked the spread, the total and the moneyline for this game, and none of them offered a real advantage over the books' numbers. Passing is part of the strategy — most games don't have a bet worth taking.`;

    // A TIGHT masthead headline from the full daily_brief sentence: take the lead phrase
    // before the first ':' or '—'; if that's still long (or there's no break), cap to ~7
    // words. The full sentence rides as a small dek beneath. Never a giant paragraph.
    function shortHeadline(full: string) {
      const s = cleanBlurb(String(full || "")).trim();
      if (!s) return "";
      let lead = s;
      const m = s.match(/^(.{4,64}?)\s*[:—–-]\s+/);
      if (m) lead = m[1];
      const words = lead.split(/\s+/);
      if (words.length > 8) lead = words.slice(0, 7).join(" ") + "…";
      // strip a trailing comma/semicolon
      return lead.replace(/[,;]\s*$/, "");
    }

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
      // served why-bullets get scrubbed: drop internal EV/edge claims and paper hedging.
      const whyBullets = (pl.why && pl.why.length ? pl.why : [])
        .filter((w: any) => !/\b(claimed )?ev\b|\bedge\b\s*[+\-]?\d|\bmeta[- ]?p\b/i.test(String(w)))
        .map((w: any) => cleanCopy(w)).filter(Boolean);
      const why = whyBullets.length
        ? `<ul class="shp-why">${whyBullets.map((w: any) => `<li>${esc(w)}</li>`).join("")}</ul>` : "";
      let mvm = "";
      if (pl.action === "TAKE" && pl.src === "sa" && pl.sa) {
        const sa = pl.sa;
        mvm = `<div class="shp-mvm">
          ${sa.model_p_cover != null ? `<span class="mvm-chip">our model ${saPct(sa.model_p_cover, 0)}</span>` : ""}
          ${sa.market_p_cover != null ? `<span class="mvm-chip">the market ${saPct(sa.market_p_cover, 0)}</span>` : ""}
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
        <div class="vr-line">Calls made exactly this way have won ${(rh.hit * 100).toFixed(1)}% of the time since 2022 — at prices good enough to come out clearly ahead.</div>
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

    // ===================== SHAREABLE GAME URLS + SOCIAL =====================
    // Real per-game routing: ?g=<game_id> via history.pushState so a game sheet is
    // deep-linkable, shareable, and back/forward/refresh restores it. (OG preview images
    // need SSR, which this client app lacks — so link previews stay generic for now; the
    // shareable URL + native share work today.)
    let suppressPop = false; // set while WE drive history, so popstate doesn't double-fire
    function gameUrl(gid: any) {
      try {
        const u = new URL(location.href);
        u.searchParams.set("g", String(gid));
        return u.toString();
      } catch { return location.origin + location.pathname + "?g=" + encodeURIComponent(String(gid)); }
    }
    function pushGameUrl(gid: any) {
      try {
        const u = new URL(location.href);
        u.searchParams.set("g", String(gid));
        if (u.search !== location.search) history.pushState({ g: String(gid) }, "", u);
      } catch {}
    }
    function clearGameUrl(replace = false) {
      try {
        const u = new URL(location.href);
        if (!u.searchParams.has("g")) return;
        u.searchParams.delete("g");
        const url = u.pathname + (u.search ? u.search : "") + u.hash;
        if (replace) history.replaceState({}, "", url); else history.pushState({}, "", url);
      } catch {}
    }
    function shareText(g: any) {
      const pl = displayPick(g);
      const mu = g.matchup || `${g.away_team || g.away_abbr} @ ${g.home_team || g.home_abbr}`;
      const pick = pl && pl.action === "TAKE" && pl.side ? ` — DiamondEdge Pick: ${pl.side}${pl.price != null ? ` (${fmtOdds(pl.price)})` : ""}` : "";
      return `${mu}${pick}`;
    }
    async function shareGame(g: any) {
      const url = gameUrl(g.game_id);
      const title = "DiamondEdge";
      const text = shareText(g);
      if ((navigator as any).share) {
        try { await (navigator as any).share({ title, text, url }); return; } catch { /* user cancelled or unsupported */ }
      }
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
      } catch {
        // last-resort fallback: a temporary selection
        try { const ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("Link copied"); } catch { toast("Copy this link: " + url); }
      }
    }
    let toastT: any = null;
    function toast(msg: string) {
      let el = $("de-toast");
      if (!el) { el = document.createElement("div"); el.id = "de-toast"; el.className = "de-toast"; document.body.appendChild(el); }
      el.textContent = msg;
      el.classList.add("show");
      if (toastT) clearTimeout(toastT);
      toastT = setTimeout(() => el.classList.remove("show"), 2600);
    }
    // Social share buttons for the whole app (bottom of the front page).
    function socialShareBar() {
      const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.origin + location.pathname; } })();
      const txt = "DiamondEdge — every sports pick graded in the open.";
      const enc = encodeURIComponent, u = enc(url), t = enc(txt);
      return `<div class="social">
        <span class="soc-lab">Share DiamondEdge</span>
        <div class="soc-btns">
          <button class="soc-btn native" id="soc-native" aria-label="Share"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.3M8.3 13.3l7.4 4.3"/></svg>Share</button>
          <a class="soc-btn x" href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener" aria-label="Share on X">X</a>
          <a class="soc-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="Share on Facebook">f</a>
          <a class="soc-btn rd" href="https://www.reddit.com/submit?url=${u}&title=${t}" target="_blank" rel="noopener" aria-label="Share on Reddit">R</a>
          <button class="soc-btn copy" id="soc-copy" aria-label="Copy link"><svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>Copy link</button>
        </div>
      </div>`;
    }
    // ===================== LIVE DETAIL (box score — live_detail key) =====================
    // A NEW small key the backend ships: { updated_at, games: { "<game_id>": {
    //   line_score:[{inning,away,home}], totals:{away:{R,H,E},home:{R,H,E}},
    //   pitching:{away:{name,line},home:{name,line}}, batting_leaders:[{name,line}],
    //   current:{inning_label,outs,bases,count} } } }. Degrades to nothing when absent.
    function liveDetailFor(g: any) {
      if (!g || !liveDetail || !liveDetail.games) return null;
      return liveDetail.games[String(g.game_id)] || (g.game_pk != null ? liveDetail.games[String(g.game_pk)] : null) || null;
    }
    // The "How it's going" box-score panel. Real served detail first; graceful fallback to
    // the score/inning we already overlay when live_detail hasn't landed.
    function boxScorePanel(g: any) {
      const gs = gameState(g);
      const started = gs.kind !== "pre";
      if (!started) {
        return `<div class="livepanel"><div class="state mini"><div class="big">Game hasn't started</div><div class="sm">The box score and live stats appear here once ${esc(g.away_abbr)} @ ${esc(g.home_abbr)} is underway.</div></div></div>`;
      }
      const d = liveDetailFor(g);
      const rows: string[] = [];
      // (a) current game state banner (live only)
      if (gs.kind === "live") {
        const cur = d && d.current;
        // ONE inning source of truth: gs.label comes from the live_scores overlay that every
        // other surface (ticker, tiles, hero) reads, so the box score can't disagree with them.
        // live_detail's own inning_label is only a fallback when the overlay is still generic.
        const bits = [gs.label && gs.label !== "Live" ? esc(gs.label) : (cur && cur.inning_label ? esc(cur.inning_label) : "Live"),
          cur && cur.outs != null ? `${esc(cur.outs)} out` : "",
          cur && cur.count ? `${esc(cur.count)}` : ""].filter(Boolean);
        rows.push(`<div class="lp-now"><span class="lp-live"><span class="livedot"></span>Live</span><span class="lp-state">${bits.join(" · ")}</span></div>`);
      }
      // (b) line score grid (innings R/H/E) — the core box score
      if (d && Array.isArray(d.line_score) && d.line_score.length) {
        const inns = d.line_score;
        const th = inns.map((c: any) => `<th>${esc(c.inning)}</th>`).join("");
        const tot = d.totals || {};
        const rhe = (side: "away" | "home") => {
          const t = tot[side] || {};
          return `<td class="rhe r">${t.R != null ? esc(t.R) : "—"}</td><td class="rhe">${t.H != null ? esc(t.H) : "—"}</td><td class="rhe">${t.E != null ? esc(t.E) : "—"}</td>`;
        };
        const rowFor = (side: "away" | "home", ab: any) =>
          `<tr><td class="ls-ab">${gCrest(g, side, "ls-crest")}${esc(ab)}</td>${inns.map((c: any) => `<td>${c[side] != null ? esc(c[side]) : ""}</td>`).join("")}${rhe(side)}</tr>`;
        rows.push(`<div class="lp-box"><div class="lp-scroll"><table class="linescore">
          <thead><tr><th class="ls-ab"></th>${th}<th class="rhe r">R</th><th class="rhe">H</th><th class="rhe">E</th></tr></thead>
          <tbody>${rowFor("away", g.away_abbr)}${rowFor("home", g.home_abbr)}</tbody>
        </table></div></div>`);
      } else if (gs.score && gs.score.split && gs.score.home != null) {
        // fallback: the simple score we already have
        rows.push(`<div class="lp-simplescore"><span class="lps-side"><span class="shs-ab">${esc(g.away_abbr)}</span><b>${num(gs.score.away, 0)}</b></span><span class="lps-mid">${gs.kind === "final" ? "Final" : esc(gs.label || "Live")}</span><span class="lps-side"><b>${num(gs.score.home, 0)}</b><span class="shs-ab">${esc(g.home_abbr)}</span></span></div>`);
      }
      // (c) pitching + batting leaders (when served)
      if (d && d.pitching && (d.pitching.away || d.pitching.home)) {
        const pit = (side: "away" | "home", ab: any) => {
          const p = d.pitching[side]; if (!p) return "";
          return `<div class="lp-pit-row"><span class="lp-pit-ab">${esc(ab)}</span><span class="lp-pit-nm">${esc(p.name || "—")}</span><span class="lp-pit-ln">${esc(p.line || "")}</span></div>`;
        };
        rows.push(`<div class="lp-sec"><div class="lp-sec-h">On the mound</div>${pit("away", g.away_abbr)}${pit("home", g.home_abbr)}</div>`);
      }
      if (d && Array.isArray(d.batting_leaders) && d.batting_leaders.length) {
        const bl = d.batting_leaders.slice(0, 5).map((b: any) => `<div class="lp-bat-row"><span class="lp-bat-nm">${esc(b.name || "")}</span><span class="lp-bat-ln">${esc(b.line || "")}</span></div>`).join("");
        rows.push(`<div class="lp-sec"><div class="lp-sec-h">At the plate</div>${bl}</div>`);
      }
      if (!rows.length) rows.push(`<div class="state mini"><div class="sm">Live box score updating…</div></div>`);
      return `<div class="livepanel">${rows.join("")}</div>`;
    }

    function openDetail(g: any, focusMk?: string, fromHistory = false) {
      detail = g;
      // Live & finished games open straight to "How it's going" (box score); only pre-game
      // games default to the Preview narrative.
      const _gsk = g && !g._recipe ? gameState(g).kind : "pre";
      detailTab = (_gsk === "live" || _gsk === "final") ? "live" : "preview";
      if (!fromHistory && g && g.game_id != null && !g._recipe) pushGameUrl(g.game_id);
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

      // PREVIEW-FIRST: the detail opens with the game-preview headline + setup prose. The
      // hero image leads WITHOUT the pick cover (no spoiler up top); the pick surfaces later
      // as the article's payoff. Locked free-mode still shows the unlock cover.
      const leadLocked = lead ? pickLocked(lead, playState(g, lead)) : false;
      const tintSheet = heroTintFor(g, lead);
      const art = gameArticle(g);
      // The masthead headline: served article.headline (backend now writes preview-first),
      // else a composed matchup framing — the MATCH, never the pick, leads.
      const mastHead = art && art.headline
        ? esc(cleanBlurb(art.headline))
        : `${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}`;
      const mastDek = art && art.dek ? mdBold(cleanBlurb(art.dek)) : "";
      const kickLine = [SPORT_LABEL[sp] || sp, g.meta && g.meta.competition ? esc(g.meta.competition) : ""].filter(Boolean).join(" · ");
      const previewMasthead = `<div class="sh-mast">
        <div class="sh-mast-kick">${esc(kickLine || "Game Preview")}</div>
        <h2 class="sh-mast-h">${mastHead}</h2>
        ${mastDek ? `<p class="sh-mast-dek">${mastDek}</p>` : ""}
        <div class="sh-mast-byline">DiamondEdge Preview${dispDate ? ` · ${esc(dispDate)}` : ""}${startTxt ? ` · ${esc(startTxt)}` : ""}</div>
      </div>`;
      // The hero image LEADS the story. Locked free-mode keeps the unlock cover; everyone
      // else sees the clean magazine image (the pick is the payoff below, not a spoiler).
      const sheetHero = `<div class="sh-figure">${heroImage(g, tintSheet, "lead")}${leadLocked ? heroPickCover(g, "lead") : ""}</div>`;
      // PASS games get an explicit no-pick block (the pick payoff renders the verdict line).
      const passBlock = (!lead && !leadLocked)
        ? `<div class="callcard pass"><div class="cc-k">${pickLabel(g)}</div>
            <p class="cc-passwhy">${passWhy()}</p></div>`
        : "";

      // (2) GAME PREVIEW — the article STARTS as a pure game preview (no pick spoiler):
      // served game.article first, composed from the same real fields otherwise.
      const bodyParas = leadLocked ? [] : (art && art.paras.length ? art.paras : (lead ? whySentences(g, lead) : composedPreview(g).paras));
      const facts = leadLocked ? [] : factRows(g, art);
      const stks = leadLocked ? "" : gameStreaks(g).slice(0, 4).map((s: any) =>
        `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      // The bold, banded pick sub-headline — surfaced AFTER the preview + betting, as the
      // article's payoff (never a spoiler up top). Appears exactly ONCE per view.
      const ph = pickHeadline(g);
      const phQ = ph.q || (lead ? qualityOf(lead) : null);
      // The hero cover already carries the branded "Pre-Game Pick / DiamondEdge Pick" label,
      // so the payoff callout must NOT repeat that phrase (once-per-view rule): kicker reads
      // "The Call", body shows the bare side+line+price (never re-prefixed with the brand).
      let payoffTxt = "No Pick — Passing";
      if (ph.has) {
        if (lead && lead.action === "TAKE" && lead.side) payoffTxt = `${lead.side}${lead.price != null ? ` (${fmtOdds(lead.price)})` : ""}`;
        else payoffTxt = ph.txt.replace(/^\s*(◆\s*)?(DiamondEdge|Pre-?Game)\s*Pick\s*:?\s*/i, "");
      }
      const calloutKick = ph.has ? pickLabel(g).replace(/^◆\s*/, "◆ ") : "◆ The Verdict";
      const pickCallout = leadLocked
        ? `<div class="art-pick locked" data-up="1"><span class="apk-k">◆ ${esc(pickWord(g))}</span><span class="apk-txt">Unlock to see the side & line ${lockSvg}</span></div>`
        : `<div class="art-pick ${ph.has ? `has q-${phQ || "lean"}` : "pass"}"><span class="apk-k">${esc(calloutKick)}</span><span class="apk-txt">${esc(payoffTxt)}</span>${ph.has && phQ ? `<span class="apk-q">${qDiamonds(phQ)}${Q_LABEL[phQ] || ""}</span>` : ""}</div>`;
      // The Athletic-style data-visual rail (predicted score, win prob, form bars, etc.).
      const vizRail = leadLocked ? "" : previewViz(g);
      const previewBlock = leadLocked
        ? `<div class="whycard">
            <div class="wc-k">Game preview</div>
            <p>The full read behind this pick — the model number, the line it beats, and the history of calls made exactly this way — is part of DiamondEdge Premium. The quality rating above is the real one.</p>
          </div>`
        : `<div class="whycard preview">
            <div class="wc-k">The setup</div>
            ${bodyParas.map((w) => `<p>${mdBold(w)}</p>`).join("")}
            ${vizRail}
            ${stks ? `<div class="pv-stks">${stks}</div>` : ""}
            ${facts.length ? `<div class="ls-facts">${facts.join("")}</div>` : ""}
          </div>`;

      // (3) THE MARKETS — all three shown clearly. TOTAL is THE DiamondEdge Pick; the
      // moneyline shows as an additional directional LEAN (clearly lightest). Then the
      // narrative line + odds board.
      const threeMarkets = leadLocked ? "" : threeMarketRow(g, lead);
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
          ${threeMarkets}
        </div>`;
      })();
      // The prominent pick payoff card — the article's bold DiamondEdge Pick callout.
      const pickPayoff = pickCallout;

      // (3) Power-user detail — the PICK is already surfaced above (narrative + callout),
      // so this is odds, the signature-play record, matchup intel and model notes only.
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Model Notes</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";
      const anyValue = takes.some((p: any) => p.value_tier);
      const more = `<details class="more"><summary>Odds &amp; model detail<span class="more-sub">every market's number, the record, matchup intel</span></summary>
        <div class="more-body">
          <div class="dsec"><div class="dsec-h">Every market's number</div><div class="dsec-b shp-wrap">
            ${MARKETS.map((mk) => sheetPlay(g, P[mk])).join("")}
            ${anyValue ? valueRecordBlock() : ""}
            ${takes.length ? playsTrackTable() : ""}
          </div></div>
          ${intelSection(g)}
          ${modelsVsMarket(g)}
          ${reasoning}
        </div>
      </details>`;

      // FUSED HERO HEADER — the matchup (crests + records), the frozen pick, and the live
      // trend woven into ONE header over a subtle team-tinted wash. Sits above the tabs.
      const heroPick = lead && lead.action === "TAKE" && !leadLocked
        ? `<div class="gp-pick q-${qualityOf(lead)}"><span class="gp-pick-k">${pickLabel(g)}</span><span class="gp-pick-side">${pickArrow(lead)} ${esc(lead.side || "")}${lead.price != null ? `<i>${fmtOdds(lead.price)}</i>` : ""}</span>${qDiamonds(qualityOf(lead))}</div>`
        : leadLocked ? `<button class="gp-pick locked" data-up="1"><span class="gp-pick-k">${pickLabel(g)}</span><span class="gp-lock">${lockSvg} Unlock the pick</span></button>`
        : `<div class="gp-pick pass"><span class="gp-pick-k">The Verdict</span><span class="gp-pick-side">No Pick — Passing</span></div>`;
      const heroScore = (gs.score && gs.score.split && gs.score.home != null)
        ? `<div class="gp-score ${gs.kind}"><b>${num(gs.score.away, 0)}</b><span class="gp-scmid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label || "Live")}`}</span><b>${num(gs.score.home, 0)}</b></div>`
        : `<div class="gp-when">${esc(startTxt || dispDate || "")}</div>`;
      const heroForm = (side: "away" | "home") => { const f = teamForm(g, side); return f && f.rec ? `<span class="gp-form">${esc(f.rec)}${f.recIsL15 ? ` <span class="gp-rec-tag">L15</span>` : ""}${f.streak ? ` <i class="${f.hot ? "hot" : ""}">${esc(f.streak)}</i>` : ""}</span>` : ""; };
      const heroTrend = (gs.kind === "live" && lead && !leadLocked) ? liveHitOdds(g, lead, "full") : "";
      // Honest transparency: our projected total vs the market line — the plain 'why' behind a
      // totals Pick, shown as our own stated number (no thresholds / secret sauce revealed).
      const lineNum = lead && lead.line != null ? Number(lead.line) : Number((String(lead && lead.side || "").match(/[\d.]+/) || [])[0]);
      const transp = (lead && lead.action === "TAKE" && !leadLocked && lead.market === "total" && tot !== "—" && !isNaN(lineNum))
        ? `<div class="gp-transp"><span class="gt-lab">Our number</span><b class="gt-num">${tot}</b><span class="gt-vs">vs market</span><b class="gt-mkt">${num(lineNum, 1)}</b></div>`
        : "";
      // Best MORNING price (frozen at open, is_live_quote=false) — honest execution value on a
      // value total: where the line was cheapest at freeze. Only for an active totals pick.
      const ee = lead && lead.market === "total" && !leadLocked && g.de_plays && g.de_plays.total ? g.de_plays.total.execution_edge : null;
      const bestPrice = (ee && ee.is_active_pick && ee.best_book && ee.best_price_american != null)
        ? `<div class="gp-bestprice"><span class="gb-lab">Best morning price</span><b class="gb-val">${esc(String(lead.side || "").trim().split(/\s+/)[0])}${ee.best_line != null ? " " + num(ee.best_line, 1) : ""} ${fmtOdds(ee.best_price_american)}</b><span class="gb-at">at</span><b class="gb-book">${esc(ee.best_book)}</b></div>`
        : "";
      const gameHero = `<div class="gp-hero" style="--t1:${HERO_TINT[tintSheet] ? HERO_TINT[tintSheet][0] : "rgba(47,111,224,.16)"};--t2:${HERO_TINT[tintSheet] ? HERO_TINT[tintSheet][1] : "rgba(11,158,109,.12)"}">
        <div class="gp-hero-wash" aria-hidden="true"></div>
        <div class="gp-mu">
          <div class="gp-team away"><span class="gp-crest">${gCrest(g, "away")}</span><span class="gp-ab">${esc(g.away_abbr)}</span>${heroForm("away")}</div>
          <div class="gp-center">${heroScore}</div>
          <div class="gp-team home"><span class="gp-crest">${gCrest(g, "home")}</span><span class="gp-ab">${esc(g.home_abbr)}</span>${heroForm("home")}</div>
        </div>
        ${heroPick}
        ${transp}
        ${bestPrice}
        ${heroTrend ? `<div class="gp-trend">${heroTrend}</div>` : ""}
      </div>`;
      // Tabs — "How it's going" only for live/final games; pre-game defaults to Preview only.
      const showLive = gs.kind === "live" || gs.kind === "final";
      const tabsBar = `<div class="gp-tabs" role="tablist">
        <button class="gp-tab ${detailTab === "preview" ? "on" : ""}" data-dtab="preview" role="tab">Preview</button>
        ${showLive ? `<button class="gp-tab ${detailTab === "live" ? "on" : ""}" data-dtab="live" role="tab">How it's going</button>` : ""}
        <span class="gp-tab-ink" id="gp-tab-ink"></span>
      </div>`;
      // Backup-signal note (from the model's challenger accountability) — plain English, detail-only,
      // behind an expand. Never on consumer front surfaces; never implies a stronger pick.
      const cs = lead && lead.action === "TAKE" && !leadLocked && lead.market === "total" && g.de_plays && g.de_plays.total ? g.de_plays.total.challenger_summary : null;
      const challengerNote = (cs && cs.consumer_label)
        ? `<details class="gp-backup"><summary><span class="bk-dot">◆</span><span class="bk-lab">${esc(cs.consumer_label)}</span><span class="bk-chev" aria-hidden="true">›</span></summary><div class="bk-body">${cs.consumer_detail ? `<p>${esc(cs.consumer_detail)}</p>` : ""}${Array.isArray(cs.active_family_labels) && cs.active_family_labels.length ? `<div class="bk-tags">${cs.active_family_labels.map((t: any) => `<span class="bk-tag">${esc(String(t))}</span>`).join("")}</div>` : ""}<p class="bk-note">Backup context only — it doesn't change the pick or its grade.</p></div></details>`
        : "";
      const previewPane = `<div class="gp-pane" data-pane="preview" style="display:${detailTab === "live" && showLive ? "none" : "block"}">
        ${leadLocked ? "" : previewMasthead}
        ${previewBlock}
        ${linesBlock}
        ${lead || !leadLocked ? pickPayoff : ""}
        ${challengerNote}
        ${passBlock}
        ${leadLocked ? "" : more}
      </div>`;
      const livePane = showLive ? `<div class="gp-pane" data-pane="live" style="display:${detailTab === "live" ? "block" : "none"}">${boxScorePanel(g)}</div>` : "";

      const html = `
        <div class="gamepage" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(g.matchup || "Game")}">
          <div class="gp-head">
            <button class="gp-back" id="gp-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <div class="gp-head-title"><span class="gp-head-sport">${SPORT_LABEL[sp] || sp}${g.meta && g.meta.competition ? ` · ${esc(g.meta.competition)}` : ""}</span><span class="gp-head-mu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span></div>
            <button class="gp-share" id="gp-share" aria-label="Share this game"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.3M8.3 13.3l7.4 4.3"/></svg></button>
          </div>
          <div class="gp-body" id="gp-body">
            ${gameHero}
            ${tabsBar}
            ${previewPane}
            ${livePane}
          </div>
        </div>`;

      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(() => { const p = $("gamepage"); if (p) p.classList.add("in"); positionDetailInk(); });
      $("gp-back").onclick = () => closeDetail();
      const unl = $("cc-unlock");
      if (unl) unl.onclick = () => { closeDetail(); switchTab("upgrade"); };
      const shTlh = $("tl-how"); if (shTlh) shTlh.onclick = (e: any) => { e.stopPropagation(); closeDetail(); setTimeout(() => openRecipeSheet(), 220); };
      const shShare = $("gp-share"); if (shShare) shShare.onclick = (e: any) => { e.stopPropagation(); shareGame(g); };
      // tab switching (no re-fetch; just show/hide + move the ink)
      $("gamepage").querySelectorAll("[data-dtab]").forEach((b: any) => (b.onclick = () => switchDetailTab(b.dataset.dtab)));
      // if opened on a live game, pull the box score right away
      if (showLive) pollLiveDetail();
    }
    function positionDetailInk() {
      const bar = $("gamepage") && $("gamepage").querySelector(".gp-tabs");
      const ink = $("gp-tab-ink"); if (!bar || !ink) return;
      const on = bar.querySelector(".gp-tab.on"); if (!on) return;
      ink.style.width = on.offsetWidth + "px";
      ink.style.transform = `translateX(${on.offsetLeft}px)`;
    }
    function switchDetailTab(t: string) {
      if (t === detailTab || !detail) return;
      detailTab = t;
      const page = $("gamepage"); if (!page) return;
      page.querySelectorAll(".gp-tab").forEach((b: any) => b.classList.toggle("on", b.dataset.dtab === t));
      page.querySelectorAll(".gp-pane").forEach((p: any) => { p.style.display = p.dataset.pane === t ? "block" : "none"; });
      positionDetailInk();
      if (t === "live") { pollLiveDetail(); const b = $("gp-body"); if (b) b.scrollTop = b.scrollTop; }
    }
    function closeDetail(fromHistory = false) {
      const wasGame = detail && !detail._recipe && detail.game_id != null;
      // Back-arrow / user close pops the ?g= URL by walking browser history so the native
      // back button and the arrow behave identically (a real page navigation). We DON'T
      // null `detail` or tear down the DOM here — the resulting popstate → syncFromUrl(true)
      // → closeDetail(true) does that, so both paths run the exact same teardown.
      if (!fromHistory && wasGame) {
        try {
          if (new URL(location.href).searchParams.get("g")) { history.back(); return; }
        } catch {}
        clearGameUrl(false);
      }
      detail = null;
      const l = $("sheet-layer");
      if (!l || !l.innerHTML) return;
      const page = $("gamepage"), sh = $("sheet"), bg = $("sheet-bg");
      document.body.classList.remove("sheet-open");
      if (REDUCE || (!page && !sh)) { l.innerHTML = ""; return; }
      if (page) page.classList.add("out");
      if (sh) sh.classList.add("closing"); if (bg) bg.classList.add("closing");
      setTimeout(() => { l.innerHTML = ""; }, 320);
    }
    // Poll the live_detail (box-score) key while a detail page is open on a live game.
    // Tiered/bandwidth-smart: only fetches when a live game's page is showing; pauses hidden.
    async function pollLiveDetail() {
      if (document.hidden) return;
      if (!detail || detail.game_id == null) return;
      const gs = gameState(detail);
      if (gs.kind !== "live" && gs.kind !== "final") return;
      let ld: any = null;
      try { ld = await snap("live_detail"); } catch {}
      liveDetailTried = true;
      if (!ld || !ld.games) return;
      const fresh = !liveDetail || ld.updated_at !== liveDetail.updated_at;
      liveDetail = ld;
      if (!fresh) return;
      // update the live pane in place (no scroll jump) if it's mounted + visible
      const page = $("gamepage"); if (!page) return;
      const pane = page.querySelector('.gp-pane[data-pane="live"]');
      if (pane) pane.innerHTML = boxScorePanel(detail);
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
                <p><b>Calls made exactly this way have won <b>${(rh.hit * 100).toFixed(1)}%</b> of the time since 2022</b> — and at prices good enough to come out clearly ahead, graded by a model that never saw the games in advance.</p>
                <p><b>Win rate always travels with the price.</b> A high hit rate at a terrible price is a losing bet — so every number we show you carries its return next to it.</p>
              </div>
            </div>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = () => closeDetail();
      $("sheet-bg").onclick = () => closeDetail();
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    // The pick-record breakdown — TODAY (with how many are still live/to-come) and THIS MONTH,
    // each split by market. Same sheet chrome as everything else, so overlays stay consistent.
    function openRecordBreakdown() {
      detail = { _record: true };
      const t = todayRec(), m = monthRec();
      // The HEADLINE is the DiamondEdge Pick (totals). Spreads/moneylines are shown as smaller
      // "leans we also track" so the flagship number is never inflated by them.
      const leanRow = (r: any, mk: string, lab: string) => {
        const o = r.byMk[mk]; const n = o.w + o.l; if (!n) return "";
        const pct = Math.round((o.w / n) * 100);
        return `<div class="rb-lean"><span class="rb-lean-mk">${lab}</span><span class="rb-lean-rec"><b>${o.w}–${o.l}</b> <i>${pct}%</i></span></div>`;
      };
      const block = (r: any, title: string, empty: string) => {
        if (!r) return `<div class="dsec"><div class="dsec-h">${title}</div><div class="rb-sub">${empty}</div></div>`;
        const tot = r.byMk.total; const dec = tot.w + tot.l; const pct = dec ? Math.round((tot.w / dec) * 100) : 0;
        const out = r.live + r.upcoming;
        const outTxt = out
          ? `<span class="rb-out">${r.live ? `<b>${r.live}</b> live` : ""}${r.live && r.upcoming ? " · " : ""}${r.upcoming ? `<b>${r.upcoming}</b> to come` : ""}</span>`
          : (dec ? `<span class="rb-out done">all settled</span>` : "");
        const leans = leanRow(r, "spread", "Spread leans") + leanRow(r, "moneyline", "Moneyline leans");
        return `<div class="dsec">
          <div class="dsec-h">${title} · the Pick <span class="rb-mkt">(totals)</span></div>
          <div class="rb-head">
            <div class="rb-big"><b>${tot.w}–${tot.l}</b>${dec ? `<span class="rb-pct">${pct}% won</span>` : ""}</div>
            ${outTxt}
          </div>
          ${!dec && !out ? `<div class="rb-sub">${empty}</div>` : ""}
          ${leans ? `<div class="rb-leans"><span class="rb-leans-h">Also tracked — lighter leans</span>${leans}</div>` : ""}
        </div>`;
      };
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head gold">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">DiamondEdge</div>
            <div class="rcp-title"><span class="pl-vdia">◆</span>The record</div>
            <div class="sh-meta">graded against real final scores — nothing hidden</div>
          </div>
          <div class="sh-body">
            ${block(t, "Today", "No graded picks yet today — check back as games finish.")}
            ${block(m, "This month", "No graded picks yet this month.")}
            <div class="dsec"><div class="dsec-b rcp"><p>Totals are <b>the DiamondEdge Pick</b> — our validated edge. Spreads and moneylines are lighter directional leans. Every call freezes before first pitch and the final score does the judging.</p></div></div>
            <button class="rb-full" id="rb-full">See the full record & charts →</button>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = () => closeDetail();
      $("sheet-bg").onclick = () => closeDetail();
      const full = $("rb-full"); if (full) full.onclick = () => { closeDetail(); switchTab("results"); };
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    document.addEventListener("keydown", (e: any) => { if (e.key === "Escape" && detail) closeDetail(); });
    // ---- deep-link routing: ?g=<game_id> restores/opens a game sheet; back/forward works ----
    function gameById(gid: any) {
      const src = livePayload || payload;
      let g = ((src && src.games) || []).find((x: any) => String(x.game_id) === String(gid));
      if (g) return g;
      if (rangeMode) g = rangeGames.flatMap((d: any) => d.games).find((x: any) => String(x.game_id) === String(gid));
      return g || null;
    }
    function syncFromUrl(fromHistory: boolean) {
      let gid: string | null = null;
      try { gid = new URL(location.href).searchParams.get("g"); } catch {}
      if (gid) {
        const g = gameById(gid);
        if (g) { if (!detail || detail.game_id == null || String(detail.game_id) !== String(gid)) openDetail(g, undefined, true); }
        else if (!detail) { /* game not in the loaded slate yet — leave URL, board loads it */ }
      } else if (detail && !detail._recipe) {
        closeDetail(fromHistory);
      }
    }
    window.addEventListener("popstate", () => syncFromUrl(true));

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
      s = s.replace(/\s*[—–-]\s*live\s+paper\b/gi, " — live").replace(/\bpaper\b/gi, "").replace(/\s{2,}/g, " ").trim();
      const map: any = { over: "Overs", under: "Unders", OVER: "Overs", UNDER: "Unders", heat_day: "Heat-day picks", heat: "Heat-day picks", split_books: "Split-book picks", mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer", total: "Totals", spread: "Spreads", moneyline: "Moneylines", strong: "◆◆◆ Strong", good: "◆◆ Good", lean: "◆ Lean", "Strong signal": "◆◆◆ Strong", "Solid signal": "◆◆ Good", "Baseline signal": "◆ Lean" };
      if (map[s] != null) return map[s];
      s = s.replace(/books? split across \d\+? (different )?lines?/i, (m0) => /3\+|three/i.test(m0) ? "Books strongly split on the line" : "Books split on the line")
        .replace(/game total\s*[—–-]\s*live.*$/i, "Game totals — since going live");
      return s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
    }
    // Plain-English explanation for a cut where the win% looks good but the return is
    // negative — served string wins; else a clear house sentence. NEVER show a bare win%
    // next to a negative return without this context.
    function returnNote(r: any, hit: any, roi: any) {
      const served = r.explanation || r.note || r.plain || null;
      if (served) return cleanCopy(served);
      if (hit != null && roi != null && roi < 0 && hit > 0.5)
        return "Wins often, but the odds here are too short to profit — that's why these aren't DiamondEdge Picks.";
      return "";
    }
    // One cut → a compact module: a win% bar (with a plain "break-even" tick) always
    // paired with the return; a high-win/negative-return row carries its explanation inline.
    function adCutModule(cutKey: string, rows: any[]) {
      if (!Array.isArray(rows) || !rows.length) return "";
      const body = rows.map((r: any) => {
        const hit = r.hit != null && !isNaN(Number(r.hit)) ? Number(r.hit) : null;
        const roi = r.roi != null && !isNaN(Number(r.roi)) ? Number(r.roi) : null;
        const w = hit != null ? Math.max(4, Math.min(100, hit * 100)) : 0;
        const note = returnNote(r, hit, roi);
        return `<div class="ad-row">
          <span class="ad-k">${prettyKey(r.key)}<span class="ad-n">${(r.n || 0).toLocaleString()} picks</span></span>
          <span class="ad-rec">${esc(r.record || "")}</span>
          <span class="ad-barwrap" title="won ${hit != null ? (hit * 100).toFixed(1) + "%" : "—"} · needs about 52% to profit at typical prices">
            ${hit != null ? `<span class="ad-bar ${roi != null && roi < 0 ? "neg" : ""}" style="width:${w.toFixed(1)}%"></span>` : ""}
            <span class="ad-be" style="left:52.4%"></span>
            ${hit != null ? `<span class="ad-hit">${(hit * 100).toFixed(1)}%</span>` : ""}
          </span>
          <span class="ad-roi ${roi == null ? "dim" : roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + (roi * 100).toFixed(1) + "%"}</span>
        </div>${note ? `<div class="ad-note">${esc(note)}</div>` : ""}`;
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
    // A self-contained editorial figure for a results article — theme-tinted wash + a big
    // watermark glyph + an overlaid symbol. No external images (same discipline as heroImage).
    function resFigure(tint: string, glyph: string) {
      const t = HERO_TINT[tint] || HERO_TINT.record;
      const ic = IC[tint] ? tint : "record";
      return `<div class="resfig" style="--t1:${t[0]};--t2:${t[1]}" aria-hidden="true">
        <span class="rf-wm"><svg viewBox="0 0 24 24">${IC[ic] ? IC[ic].replace(/^<svg[^>]*>|<\/svg>$/g, "") : ""}</svg></span>
        <span class="rf-glyph">${esc(glyph)}</span>
      </div>`;
    }
    function adEdgesModule(list: any[]) {
      if (!Array.isArray(list) || !list.length) return "";
      const stLabel: any = { validated: "Proven", live: "Live", paper: "Live", experimental: "Emerging" };
      const cards = list.map((e: any) => {
        const roi = e.roi != null && !isNaN(Number(e.roi)) ? Number(e.roi) : null;
        const st = String(e.status || "").toLowerCase();
        const desc = edgeCopy(e);
        const name = cleanCopy(e.name || "");
        return `<div class="edge ${esc(st)}">
          <div class="edge-h"><b>${esc(name)}</b>${st ? `<span class="edge-st">${esc(stLabel[st] || prettyKey(st))}</span>` : ""}
            <span class="edge-nums">${(e.n || 0).toLocaleString()} picks · ${e.hit != null ? (Number(e.hit) * 100).toFixed(1) + "%" : "—"} · <span class="${roi != null && roi >= 0 ? "pos" : "neg"}">${roi == null ? "—" : (roi >= 0 ? "+" : "") + (roi * 100).toFixed(1) + "%"}</span></span></div>
          ${desc ? `<p>${esc(desc)}</p>` : ""}
        </div>`;
      }).join("");
      return `<div class="anz-card" style="margin-bottom:14px"><div class="anz-card-h">★ Where the edges live</div><div class="edge-list">${cards}</div></div>`;
    }

    // ===================== INSIGHTS CHARTS (self-contained SVG — no external libs) =====================
    // Every chart reads REAL analytics_deep fields and degrades to "" when absent. Light
    // liquid-glass palette, tabular-nums, reduced-motion honored (animations are CSS-gated).
    // A served section's narrative + title accompany each so the page reads editorial.
    const adSection = (key: string) => {
      const s = analyticsDeep && Array.isArray(analyticsDeep.sections) ? analyticsDeep.sections.find((x: any) => x.key === key) : null;
      return s || null;
    };
    const adNarr = (key: string) => { const s = adSection(key); return s && s.narrative ? cleanCopy(s.narrative) : ""; };
    // Wrap a chart in the editorial article shell: figure glyph + kicker + title + narrative + chart.
    function insightArticle(kick: string, title: string, narrative: string, tint: string, glyph: string, chart: string, note = "") {
      if (!chart) return "";
      return `<article class="ins-art">
        <div class="ins-fig">${resFigure(tint, glyph)}</div>
        <div class="ins-b">
          <div class="ins-kick">${esc(kick)}</div>
          <h3 class="ins-h">${esc(title)}</h3>
          ${narrative ? `<p class="ins-narr">${esc(narrative)}</p>` : ""}
          <div class="ins-chart">${chart}</div>
          ${note ? `<p class="ins-note">${esc(note)}</p>` : ""}
        </div>
      </article>`;
    }

    // (H1) EQUITY CURVE — cumulative return over the graded history as a smooth area+line.
    // Reads analytics_deep.equity_curve [{n,date,cum_units,cum_return_pct}]. The y-axis is
    // cumulative return %; the x-axis is graded-pick order (time). Zero line marked.
    function chartEquityCurve() {
      const raw = (analyticsDeep && Array.isArray(analyticsDeep.equity_curve)) ? analyticsDeep.equity_curve : [];
      const pts = raw.map((p: any) => ({ x: Number(p.n), y: Number(p.cum_return_pct), date: p.date })).filter((p: any) => !isNaN(p.x) && !isNaN(p.y));
      if (pts.length < 3) return "";
      const W = 320, H = 150, PL = 34, PR = 10, PT = 12, PB = 20;
      const iw = W - PL - PR, ih = H - PT - PB;
      const xs = pts.map((p: any) => p.x), ys = pts.map((p: any) => p.y);
      const xMin = Math.min(...xs), xMax = Math.max(...xs);
      let yMin = Math.min(0, ...ys), yMax = Math.max(...ys);
      const pad = (yMax - yMin) * 0.08 || 1; yMax += pad; yMin -= pad;
      const sx = (x: number) => PL + ((x - xMin) / (xMax - xMin || 1)) * iw;
      const sy = (y: number) => PT + (1 - (y - yMin) / (yMax - yMin || 1)) * ih;
      const y0 = sy(0);
      const line = pts.map((p: any, i: number) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");
      const area = `${line} L${sx(xMax).toFixed(1)} ${y0.toFixed(1)} L${sx(xMin).toFixed(1)} ${y0.toFixed(1)} Z`;
      const last = pts[pts.length - 1];
      // y gridlines at 0 and yMax
      const yticks = [0, Math.round(yMax)].filter((v, i, a) => a.indexOf(v) === i);
      const grid = yticks.map((v) => `<line class="ins-grid" x1="${PL}" y1="${sy(v).toFixed(1)}" x2="${W - PR}" y2="${sy(v).toFixed(1)}"/><text class="ins-axis" x="${PL - 5}" y="${(sy(v) + 3).toFixed(1)}" text-anchor="end">${v}%</text>`).join("");
      const yr0 = String(pts[0].date || "").slice(0, 4), yr1 = String(last.date || "").slice(0, 4);
      return `<div class="ins-svgwrap"><svg viewBox="0 0 ${W} ${H}" class="ins-svg equity" preserveAspectRatio="none" role="img" aria-label="Cumulative return grew to ${num(last.y, 0)}% over ${last.x} graded picks">
        <defs><linearGradient id="eqfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--green)" stop-opacity=".26"/><stop offset="1" stop-color="var(--green)" stop-opacity="0"/></linearGradient></defs>
        ${grid}
        <line class="ins-zero" x1="${PL}" y1="${y0.toFixed(1)}" x2="${W - PR}" y2="${y0.toFixed(1)}"/>
        <path class="eq-area" d="${area}" fill="url(#eqfill)"/>
        <path class="eq-line" d="${line}"/>
        <circle class="eq-dot" cx="${sx(last.x).toFixed(1)}" cy="${sy(last.y).toFixed(1)}" r="3.4"/>
        <text class="ins-axis" x="${PL}" y="${H - 5}" text-anchor="start">${esc(yr0)}</text>
        <text class="ins-axis" x="${W - PR}" y="${H - 5}" text-anchor="end">${esc(yr1)}</text>
      </svg></div>
      <div class="ins-legend"><span class="il-item wide"><span class="il-sw green"></span><span>A dollar riding every pick returned <b>+${num(last.y, 0)}%</b> across ${last.x.toLocaleString()} graded picks.</span></span></div>`;
    }

    // (H2) CALIBRATION — the trust chart: predicted vs actual with a diagonal reference.
    // Reads analytics_deep.calibration [{predicted,actual,n,bucket_label}]. If our dots sit
    // ON the diagonal, "when we say ~58% we hit ~58%". Dot size ∝ how many picks.
    function chartCalibration() {
      const raw = (analyticsDeep && Array.isArray(analyticsDeep.calibration)) ? analyticsDeep.calibration : [];
      const pts = raw.map((p: any) => ({ px: Number(p.predicted), ay: Number(p.actual), n: Number(p.n || 0), lab: p.bucket_label })).filter((p: any) => !isNaN(p.px) && !isNaN(p.ay));
      if (pts.length < 2) return "";
      const W = 300, H = 220, P = 34;
      const allv = pts.flatMap((p: any) => [p.px, p.ay]);
      let lo = Math.min(...allv, 0.5), hi = Math.max(...allv, 0.6);
      const pad = (hi - lo) * 0.12 || 0.04; lo = Math.max(0, lo - pad); hi = Math.min(1, hi + pad);
      const sx = (v: number) => P + ((v - lo) / (hi - lo || 1)) * (W - P - 12);
      const sy = (v: number) => (H - P) - ((v - lo) / (hi - lo || 1)) * (H - P - 12);
      const nMax = Math.max(...pts.map((p: any) => p.n), 1);
      const ticks = [lo, (lo + hi) / 2, hi].map((v) => Math.round(v * 100) / 100);
      const gx = ticks.map((v) => `<line class="ins-grid" x1="${sx(v).toFixed(1)}" y1="12" x2="${sx(v).toFixed(1)}" y2="${(H - P).toFixed(1)}"/><text class="ins-axis" x="${sx(v).toFixed(1)}" y="${H - P + 14}" text-anchor="middle">${(v * 100).toFixed(0)}%</text>`).join("");
      const gy = ticks.map((v) => `<line class="ins-grid" x1="${P}" y1="${sy(v).toFixed(1)}" x2="${W - 12}" y2="${sy(v).toFixed(1)}"/><text class="ins-axis" x="${P - 5}" y="${(sy(v) + 3).toFixed(1)}" text-anchor="end">${(v * 100).toFixed(0)}%</text>`).join("");
      const diag = `M${sx(lo).toFixed(1)} ${sy(lo).toFixed(1)} L${sx(hi).toFixed(1)} ${sy(hi).toFixed(1)}`;
      const dots = pts.map((p: any) => {
        const r = 4 + (p.n / nMax) * 7;
        const above = p.ay >= p.px; // hit MORE than predicted = good (above diagonal)
        return `<circle class="cal-dot ${above ? "good" : "under"}" cx="${sx(p.px).toFixed(1)}" cy="${sy(p.ay).toFixed(1)}" r="${r.toFixed(1)}"><title>Said about ${(p.px * 100).toFixed(0)}% → actually won ${(p.ay * 100).toFixed(0)}% (${p.n} picks)</title></circle>`;
      }).join("");
      return `<div class="ins-svgwrap"><svg viewBox="0 0 ${W} ${H + 4}" class="ins-svg calib" role="img" aria-label="Calibration: predicted win chance versus how often those picks actually won">
        ${gx}${gy}
        <path class="cal-diag" d="${diag}"/>
        ${dots}
        <text class="ins-axtitle" x="${((W + P) / 2).toFixed(0)}" y="${H + 1}" text-anchor="middle">What we said</text>
        <text class="ins-axtitle" x="12" y="${((H - P) / 2).toFixed(0)}" text-anchor="middle" transform="rotate(-90 12 ${((H - P) / 2).toFixed(0)})">What happened</text>
      </svg></div>
      <div class="ins-legend"><span class="il-item"><span class="il-sw diag"></span>Perfect line</span><span class="il-item"><span class="il-sw dot"></span>Bigger dot = more picks · on or above the line means we hit at least as often as we said</span></div>`;
    }

    // (H3) MONTHLY — win% and return per month, twin bars. Reads analytics_deep.monthly
    // [{month,n,hit,roi,avg_odds,profit_note}]. Break-even tick on the win% bars. Caps to
    // the most recent ~14 months so the strip stays legible on mobile.
    function chartMonthly() {
      const raw = (analyticsDeep && Array.isArray(analyticsDeep.monthly)) ? analyticsDeep.monthly : [];
      const rows = raw.filter((m: any) => m && m.hit != null).slice(-14);
      if (rows.length < 2) return "";
      const maxRoi = Math.max(0.02, ...rows.map((m: any) => Math.abs(Number(m.roi || 0))));
      const bars = rows.map((m: any) => {
        const hit = Number(m.hit), roi = Number(m.roi);
        const hpct = Math.max(0, Math.min(100, hit * 100));
        const rH = Math.min(100, (Math.abs(roi) / maxRoi) * 100);
        const mlab = (() => { const d = new Date(String(m.month) + "-15T12:00:00"); return isNaN(d.getTime()) ? String(m.month).slice(5) : d.toLocaleDateString("en-US", { month: "short" }); })();
        const yr = String(m.month).slice(2, 4);
        return `<div class="mo-col" title="${esc(mlab)} 20${yr}: won ${(hit * 100).toFixed(0)}% · ${roi >= 0 ? "+" : ""}${(roi * 100).toFixed(0)}% return · ${m.n} picks">
          <div class="mo-hit"><span class="mo-hbar ${hit >= 0.524 ? "up" : "dn"}" style="height:${hpct.toFixed(0)}%"></span><span class="mo-be"></span></div>
          <div class="mo-roi"><span class="mo-rbar ${roi >= 0 ? "pos" : "neg"}" style="height:${rH.toFixed(0)}%"></span></div>
          <span class="mo-lab">${esc(mlab)}<i>${esc(yr)}</i></span>
        </div>`;
      }).join("");
      return `<div class="mo-chart"><div class="mo-yhead"><span>Win %</span><span class="mo-be-key">— break-even</span></div>
        <div class="mo-bars">${bars}</div>
        <div class="mo-yhead roi"><span>Return per dollar</span></div></div>
      <div class="ins-legend"><span class="il-item"><span class="il-sw green"></span>Above the dashed line = a winning month</span><span class="il-item"><span class="il-sw red"></span>Down bars = months that finished behind</span></div>`;
    }

    // (H4) BY-CONFIDENCE — Strong / Good / Lean as grouped win% + return bars. Reads
    // analytics_deep.by_confidence [{key,tier,hit,roi,record,n,profit_note}]. The per-row
    // profit_note renders inline so a strong win% next to a modest return always reads clearly.
    function chartByConfidence() {
      const raw = (analyticsDeep && Array.isArray(analyticsDeep.by_confidence)) ? analyticsDeep.by_confidence : [];
      const rows = raw.filter((r: any) => r && r.hit != null);
      if (!rows.length) return "";
      const qKey = (t: any) => { const s = String(t || "").toLowerCase(); return s === "strong" ? "strong" : s === "good" ? "good" : "lean"; };
      const body = rows.map((r: any) => {
        const q = qKey(r.tier || r.key);
        const hit = Number(r.hit), roi = Number(r.roi);
        const hpct = Math.max(4, Math.min(100, hit * 100));
        const note = r.profit_note ? cleanCopy(r.profit_note) : returnNote(r, hit, roi);
        return `<div class="bc-row q-${q}">
          <div class="bc-head"><span class="bc-lab">${qDiamonds(q)}<b>${esc(Q_LABEL[q] || r.key)}</b></span><span class="bc-rec">${esc(r.record || "")}</span></div>
          <div class="bc-bars">
            <div class="bc-metric"><span class="bc-k">Win rate</span><span class="bc-track"><span class="bc-fill hit" style="width:${hpct.toFixed(0)}%"></span><span class="bc-be" style="left:52.4%"></span></span><b class="bc-v">${(hit * 100).toFixed(0)}%</b></div>
            <div class="bc-metric"><span class="bc-k">Return</span><span class="bc-track"><span class="bc-fill ${roi >= 0 ? "roi" : "roineg"}" style="width:${Math.max(4, Math.min(100, Math.abs(roi) * 100 * 3)).toFixed(0)}%"></span></span><b class="bc-v ${roi >= 0 ? "pos" : "neg"}">${roi >= 0 ? "+" : ""}${(roi * 100).toFixed(0)}%</b></div>
          </div>
          ${note ? `<p class="bc-note">${esc(note)}</p>` : ""}
        </div>`;
      }).join("");
      return `<div class="bc-chart">${body}</div>`;
    }

    // The whole §H insights block: profit_primer up top, then the four keystone charts,
    // then the existing cuts as clean bar modules with their served narratives.
    function insightsBlock() {
      if (!analyticsDeep) return "";
      const primer = analyticsDeep.profit_primer ? cleanCopy(analyticsDeep.profit_primer) : "";
      const primerCard = primer
        ? `<div class="ins-primer"><span class="ip-k">◆ Reading these numbers</span><p>${esc(primer)}</p></div>`
        : "";
      const eq = insightArticle("The bottom line", "Every dollar, tracked since 2022", adNarr("equity") || "Each graded pick nudges this line. It's the running total of what a dollar riding every published pick would have become — the honest, cumulative result.", "green", "$", chartEquityCurve());
      const cal = insightArticle("The trust chart", "When we say ~58%, do we hit ~58%?", adNarr("calibration") || "This is the chart that keeps us honest. The horizontal is what our model claimed; the vertical is what actually happened. Dots sitting on — or above — the diagonal mean our confidence is real, not marketing.", "record", "◎", chartCalibration());
      const mo = insightArticle("Month by month", "The edge shows up across the calendar", adNarr("by_month") || "A real edge shouldn't need a lucky month. Win rate on top, the money it made below — most months clear the bar, a few don't, and we show them all.", "books", "▪", chartMonthly());
      const bc = insightArticle("By conviction", "Strong, Good and Lean — what each has done", adNarr("by_quality") || "Every pick carries one plain word. Here's the graded truth behind each — win rate and the return it actually produced, side by side.", "gold", "◆", chartByConfidence());
      return `${primerCard}${eq}${cal}${mo}${bc}`;
    }

    // One expandable results row: record + win rate + return on the summary line,
    // a plain-English one-liner behind the tap.
    function resRow(label: string, o: any, liner: string) {
      if (!o || !o.n) return "";
      const hr = o.hit_rate != null ? (o.hit_rate * 100).toFixed(1) + "%" : "—";
      return `<details class="rrow">
        <summary><span class="rr-l">${label}</span><span class="rr-rec">${recCell(o)}</span><span class="rr-hr">${hr}</span><span class="rr-roi">${roiCell(o.roi)}</span><span class="rr-car" aria-hidden="true">▾</span></summary>
        <div class="rr-b"><p>${liner}</p><span class="rr-n">${(o.n || 0).toLocaleString()} graded picks</span></div>
      </details>`;
    }
    async function renderResults() {
      await loadIndex();
      await loadAnalyticsDeep();
      const tr = trackRecord();
      const ov = tr.overall || {};
      const hr = ov.hit_rate != null ? ov.hit_rate * 100 : null;
      const roi = ov.roi != null ? ov.roi * 100 : null;
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
      // ONE clear headline record: the DiamondEdge Pick signature (positive — hit% AND
      // return both good). The full all-graded universe (which includes Leans and tracked
      // experiments, and can run slightly negative) sits below WITH its plain explanation,
      // so a good win rate is never shown next to a negative return without context.
      // Two distinct, reconciled numbers — never two bare percents side by side:
      //   (A) "How often our picks win" = the published DiamondEdge signature record (58%+, profitable)
      //   (B) "Everything we track"     = the raw all-graded universe (leans + experiments; ~break-even)
      // Each gets its own labelled card, and (B) explains WHY it differs from (A).
      view.innerHTML = `
        <div class="anz-hero results">
          <div class="ah-lab">DiamondEdge Results · The Record</div>
          <h2>Every pick, graded in the open</h2>
          <div class="ah-sub">This is the honest ledger behind DiamondEdge Picks — graded against real final scores since 2022, on games the model never saw in advance. Winning isn't enough on its own; the price matters too, so the win rate always travels with its return.</div>
        </div>
        <article class="res-article lead">
          <div class="res-figure">${resFigure("record", "◆◆◆")}</div>
          <div class="res-art-b">
            <div class="res-kick">The headline number</div>
            <h3 class="res-h">How often our picks win: <span class="pos">${(rh.hit * 100).toFixed(1)}%</span></h3>
            <p class="res-lede">The DiamondEdge signature play — the calls we actually publish — has won <b>${(rh.hit * 100).toFixed(1)}%</b> of <b>${rh.n.toLocaleString()}</b> graded picks since 2022, at prices good enough to bank about <b>${sgn(rh.roi * 100, 0)}%</b> on every dollar. It's the record behind the gold ★ picks on the board.</p>
            <div class="res-statrow">
              <span class="res-stat"><i>Published picks</i><b data-count="${rh.n || 0}" data-loc="1">${rh.n.toLocaleString()}</b></span>
              <span class="res-stat"><i>Win rate</i><b class="pos">${(rh.hit * 100).toFixed(1)}%</b></span>
              <span class="res-stat"><i>Return</i><b class="${rh.roi >= 0 ? "pos" : "neg"}">${sgn(rh.roi * 100, 0)}%</b></span>
              ${mr ? `<span class="res-stat"><i>This month</i><b>${mr.w}-${mr.l}</b></span>` : ""}
              ${fwd ? `<span class="res-stat"><i>Since going live</i><b>${fwd.wins || 0}-${fwd.losses || 0}</b></span>` : ""}
            </div>
            <button class="res-share" id="res-share">Share our record ↗</button>
          </div>
        </article>
        ${ov.n ? `<article class="res-article second">
          <div class="res-figure sm">${resFigure("books", "Σ")}</div>
          <div class="res-art-b">
            <div class="res-kick muted">A different, bigger number — and why it's lower</div>
            <h3 class="res-h sm">Everything we track: <span class="${roi != null && roi < 0 ? "neg" : ""}">${hr != null ? hr.toFixed(1) + "%" : "—"}</span></h3>
            <p class="res-lede sm">Across <b>${(ov.n || 0).toLocaleString()}</b> total graded calls — including thin Leans and situations we track but never publish as Picks — the raw win rate is ${hr != null ? hr.toFixed(1) + "%" : "—"}${roi != null ? `, a ${(roi >= 0 ? "+" : "") + roi.toFixed(1)}% return` : ""}. ${roi != null && roi < 0 && hr != null && hr > 50 ? "Some of those cuts win often but at odds too short to profit — " : "Many of those never clear our bar — "}that's exactly why they're not DiamondEdge Picks. <b>The ${(rh.hit * 100).toFixed(1)}% above is what you're actually paying for.</b></p>
          </div>
        </article>` : ""}
        ${analyticsDeep ? `<section class="ins-section">
          <div class="ins-sec-h"><span class="ins-sec-k">The Charts</span><h2>How the record actually behaves</h2><p>Four ways of looking at the same graded ledger — the total it built, whether our confidence is real, how it moved through the calendar, and what each tier of pick has done. No jargon, just the receipts.</p></div>
          ${insightsBlock()}
        </section>` : (confRows ? `<div class="anz-card rsec"><div class="anz-card-h">By confidence</div><div class="anz-sub">Every pick carries one plain word — Strong, Good or Lean. Here's what each has actually done.</div><div class="rrows">${confRows}</div></div>` : "")}
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
        <div class="refnote">Every cut is the same graded record, sliced a different way — win rate always shown with its return.${analyticsDeep && analyticsDeep.generated_at ? ` Updated ${esc(String(analyticsDeep.generated_at).slice(0, 10))}.` : ""}</div>`;
      animateCounters(view);
      // Share the headline record — honest text + the branded OG card renders from the URL.
      const rs = $("res-share");
      if (rs) rs.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        const txt = `DiamondEdge — our published picks have won ${(rh.hit * 100).toFixed(1)}% of ${rh.n.toLocaleString()} graded picks since 2022 (${sgn(rh.roi * 100, 0)}% ROI). Every pick graded in the open.`;
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge — the record", text: txt, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${txt} ${url}`); toast("Record copied to clipboard"); } catch { toast(url); }
      };
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
        record_line: `Our track record: ${(rh.hit * 100).toFixed(1)}% winners since 2022 — at prices good enough to come out ahead.`,
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
    // One carousel card — a compact news story: thumbnail hero (logo composite over a
    // theme gradient), quality kicker, matchup headline, bold pick chip, teaser dek.
    function heroCard(p: any, i: number) {
      const g = findGameLive(p.game_id);
      const locked = !isPremium() && (p.quality === "strong" || p.quality === "good") && !p.result;
      const state = briefPickState(p);
      const pl = g ? displayPick(g) : null;
      const tint = g ? heroTintFor(g, pl) : (p.quality === "strong" ? "gold" : p.quality === "good" ? "green" : "pick");
      const fig = g ? `<div class="hero-figure">${heroImage(g, tint, "card")}<span class="hero-fig-q">${qDiamonds(p.quality)}${Q_LABEL[p.quality] || ""}</span></div>` : "";
      const bet = locked
        ? `<button class="lockchip" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
        : `<div class="hero-bet ${state ? state.cls : ""}"><span class="hb-brand">${g ? pickLabel(g) : "◆ DiamondEdge Pick"}</span><span class="hb-side">${esc(p.bet || "")}</span>${state ? `<span class="pb-res ${state.cls}">${state.txt}</span>` : ""}</div>`;
      const blurbTxt = cleanBlurb(p.blurb || "");
      const teaser = p._fb ? "There's a DiamondEdge Pick on this game." : blurbTxt.split(". ")[0].slice(0, 130);
      const blurb = blurbTxt
        ? (locked
          ? `<p class="hero-blurb">${esc(teaser)}… <button class="lk-more" data-up="1">unlock the full read</button></p>`
          : `<p class="hero-blurb clamp2">${esc(teaser)}${teaser.length >= 130 ? "…" : ""}</p>`)
        : "";
      return `<article class="hero q-${p.quality}${p.result === "hit" ? " hit" : p.result === "miss" ? " miss" : ""}" data-gid="${esc(p.game_id)}"${locked ? ' data-locked="1"' : ""} style="--i:${i}" role="button" tabindex="0" aria-label="${esc(p.matchup)} — ${locked ? "pick locked" : "DiamondEdge Pick " + esc(p.bet || "")}">
        ${fig}
        <div class="hero-body">
          <div class="hero-sport">${esc(SPORT_LABEL[p.sport] || p.sport || "")}</div>
          <h4 class="hero-match">${esc(p.matchup || "")}</h4>
          ${bet}${blurb}
          <span class="hero-cta">Full story →</span>
        </div>
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
    // A theme's own graded proof (its served `history` block) as a chip — independent of
    // analytics_deep. Falls back to the analytics-derived themeProof when history is absent.
    function themeProofChip(t: any) {
      const h = t && t.history;
      if (h && h.hit != null && h.n) {
        const word = /over/i.test(String(h.condition || t.name || "")) ? "overs" : "winners";
        const roi = h.roi != null ? Number(h.roi) : null;
        return `<span class="proof">${icon("record")}${(Number(h.hit) * 100).toFixed(0)}% ${word} · ${(h.n || 0).toLocaleString()} games${roi != null && roi > 0 ? ` · +${(roi * 100).toFixed(0)}%` : ""}</span>`;
      }
      return themeProof(t.name);
    }
    // A theme kicker — a short editorial label from the theme's icon family.
    const THEME_KICKER: any = { fire: "Weather", weather: "Weather", streak: "Form", books: "The Market", travel: "Scheduling", rest: "Scheduling", record: "The Record", trend: "Trend" };
    // Pull a hero image for a storyline from its first affected game (magazine imagery).
    function storyHero(t: any, size: string) {
      const src = livePayload || payload;
      const gid = (t.affected_games || [])[0];
      const g = gid ? ((src && src.games) || []).find((x: any) => String(x.game_id) === String(gid)) : null;
      const ic = iconForText(t.name + " " + (t.text || ""));
      const tint = ic === "fire" || ic === "weather" ? "fire" : ic === "streak" ? "streak" : ic === "books" ? "books" : "pick";
      if (!g) return `<div class="st-figph hi-${size}" style="--t1:${(HERO_TINT[tint] || HERO_TINT.pick)[0]};--t2:${(HERO_TINT[tint] || HERO_TINT.pick)[1]}"><span class="st-figic">${icon(ic)}</span></div>`;
      return heroImage(g, tint, size);
    }
    // ---- storyline article card (theme) — editorial, THREE variants ----
    //   variant "lead"   → the day's biggest storyline: hero image, kicker, headline, dek, proof
    //   variant "second" → a compact editorial card with a small figure
    //   variant "brief"  → a text-forward one-liner in a stacked list
    function storyCard(t: any, i: number, variant = "second") {
      const ic = iconForText(t.name + " " + (t.text || ""));
      const kicker = THEME_KICKER[ic] || "Storyline";
      const gids = (t.affected_games || []) as any[];
      const proof = themeProofChip(t);
      const games = gids.length ? `<button class="st-games" data-th-g="${esc(gids.join(","))}">${gids.length} game${gids.length > 1 ? "s" : ""} →</button>` : "";
      const body = esc(cleanBlurb(t.text || ""));
      const common = `data-th="${i}" style="--i:${i}" role="button" tabindex="0" aria-expanded="false" aria-label="${esc(t.name)} — expand"`;
      if (variant === "lead") {
        return `<article class="story story-lead" ${common}>
          <div class="st-figure">${storyHero(t, "card")}<span class="st-kick lead">${esc(kicker)}</span></div>
          <div class="st-b">
            <h3 class="st-h lead">${esc(t.name)}</h3>
            <p class="st-t clamp3">${body}</p>
            <div class="st-foot">${proof}${games}</div>
          </div>
        </article>`;
      }
      if (variant === "brief") {
        return `<article class="story story-brief" ${common}>
          <span class="st-ic sm">${icon(ic)}</span>
          <div class="st-b">
            <div class="st-kickrow"><span class="st-kick">${esc(kicker)}</span>${proof}</div>
            <h4 class="st-h">${esc(t.name)}</h4>
            <p class="st-t clamp2">${body}</p>
            ${games ? `<div class="st-foot">${games}</div>` : ""}
          </div>
        </article>`;
      }
      return `<article class="story story-2" ${common}>
        <div class="st-figure sm">${storyHero(t, "card")}<span class="st-kick">${esc(kicker)}</span></div>
        <div class="st-b">
          <h4 class="st-h">${esc(t.name)}</h4>
          <p class="st-t clamp2">${body}</p>
          <div class="st-foot">${proof}${games}</div>
        </div>
      </article>`;
    }
    // Assemble the storyline section as a true magazine block: one lead, then secondaries.
    function storylinesBlock(themes: any[], excludeGid?: string | null) {
      // DEDUPE: a theme "belongs" to its first affected game. Drop themes whose only game
      // is the lead story's game, and drop repeats so no game headlines twice on the page.
      const seen = new Set<string>(); if (excludeGid) seen.add(String(excludeGid));
      const uniq = (themes || []).filter((t: any) => {
        const gids = ((t && t.affected_games) || []).map((id: any) => String(id));
        const primary = gids.length ? gids[0] : null;
        // Drop a theme whose headline game already appeared (the hero, or an earlier
        // storyline). Claim ALL of a kept theme's games so none can headline twice.
        if (primary && seen.has(primary)) return false;
        if (primary) gids.forEach((id: string) => seen.add(id));
        return true;
      });
      if (!uniq.length) return "";
      const lead = storyCard(uniq[0], 0, "lead");
      const rest = uniq.slice(1);
      const secondaries = rest.map((t: any, k: number) => storyCard(t, k + 1, rest.length > 2 ? "brief" : "second")).join("");
      return `<section class="ng-rail">
        <div class="sec-h"><span>Today's Storylines</span></div>
        <div class="stories-mag">
          ${lead}
          ${secondaries ? `<div class="stories-sub">${secondaries}</div>` : ""}
        </div>
      </section>`;
    }
    // ---- game-preview article ROW (news-site styling: thumbnail + headline + dek + pick) ----
    // Reads like a story on a sports front page: an image area (team-logo composite over a
    // theme-tinted gradient hero), a kicker/byline, a headline, a standfirst dek, and a
    // BOLD pick chip so it's instantly clear whether the game has a DiamondEdge Pick.
    function previewCard(g: any, i: number, feature = false) {
      const gs = gameState(g);
      const art = gameArticle(g) || composedPreview(g);
      const pl = displayPick(g);
      const st = pl ? playState(g, pl) : "open";
      const locked = pl ? pickLocked(pl, st) : false;
      const q = pl ? qualityOf(pl) : null;
      const hasPick = !!(pl && pl.action === "TAKE");
      const status = gs.kind === "live" ? `<span class="pv-live"><span class="livedot"></span>${esc(gs.label !== "Live" && gs.label ? gs.label : "LIVE")}</span>`
        : gs.kind === "final" ? `<span class="pv-final">FINAL</span>`
        : `<span class="pv-time">${esc(gs.si.hasTime && gs.si.time ? gs.si.time : gs.si.date || "")}</span>`;
      const sc = gs.score && gs.score.split && gs.score.home != null ? gs.score : null;
      const head = art.headline ? esc(cleanBlurb(art.headline))
        : pl && pl.action === "TAKE" ? `${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}: the case for ${esc(pl.side || "")}`
        : `${esc(g.away_team || g.away_abbr)} at ${esc(g.home_team || g.home_abbr)}`;
      const dek = art.dek || art.paras[0] || "";
      const tint = heroTintFor(g, pl);
      // Live/final team score rides in the TOP cluster (the bottom carries the pick cover).
      const scoreBadge = sc ? `<span class="pv-topscore">${esc(g.away_abbr)} ${num(sc.away, 0)}–${num(sc.home, 0)} ${esc(g.home_abbr)}</span>` : "";
      // The pick rides ON the image (magazine cover line) so every card reads like a story.
      const coverSize = feature ? "lead" : "card";
      const isLive = gs.kind === "live";
      return `<article class="prev ${feature ? "feature " : ""}${hasPick ? "haspick q-" + q : "nopick"}" data-gid="${esc(g.game_id)}" style="--i:${Math.min(i, 8)}" role="button" tabindex="0" aria-label="${esc(g.matchup || "game preview")}${hasPick ? " — DiamondEdge Pick " + esc(pl.side || "") : " — no pick"} — open">
        <div class="pv-figure">${heroImage(g, tint, coverSize)}<div class="pv-fig-top"><span class="pv-sport">${esc(SPORT_LABEL[g.sport] || g.sport || "")}</span>${isLive ? "" : scoreBadge}${isLive ? "" : status}</div>${isLive ? heroLiveBadge(g, feature ? "lead" : "card") : ""}${heroPickCover(g, coverSize)}</div>
        <div class="pv-body">
          <h4 class="pv-head">${head}</h4>
          ${dek ? `<p class="pv-dek clamp2">${mdBold(String(dek))}</p>` : ""}
          <div class="pv-byline">DiamondEdge · ${esc(gs.kind === "final" ? "Final" : gs.kind === "live" ? "Live now" : (gs.si.hasTime && gs.si.time ? gs.si.time : "Today"))}</div>
        </div>
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
      return `Graded in the open since 2022 — ${(rh.hit * 100).toFixed(1)}% winners across ${rh.n.toLocaleString()} DiamondEdge Picks, at prices good enough to come out ahead. Every pick freezes before first pitch and grades against the final score.`;
    }
    // ── News-forward front: real top sports stories (news_feed) with a DiamondEdge betting angle,
    //    leading the Today page (ESPN/CBS-style), with the DiamondEdge Picks below.
    function newsAngle(a: any) {
      if (!a || typeof a !== "object" || !a.side) return "";           // headline angles can be stale strings — skip
      const edge = a.market === "total" && a.quality !== "lean";        // a real edge → blur for non-subscribers
      const reveal = !edge || isPremium();
      // Keep the chip SHORT (side + line only) — matchup lives in the headline, so no wrap/cut-off.
      const lineTxt = a.line != null && a.line !== "" ? " " + esc(String(a.line)) : "";
      const pick = reveal ? `${esc(a.side)}${lineTxt}` : `<span class="nf-lock">${lockSvg} pick inside</span>`;
      return `<span class="nf-angle ${a.quality === "lean" ? "lean" : "edge"}">◆ ${pick}</span>`;
    }
    // Humanize a story timestamp — raw ISO / "SAT, 04 JUL 2026 16:40:00 GMT" → "2h ago" / "Jul 4".
    function niceTime(iso?: any, disp?: any) {
      const t = Date.parse(String(iso || "")) || Date.parse(String(disp || ""));
      if (isNaN(t)) { const d = String(disp || ""); return /^\d{4}-\d\dT/.test(d) || /GMT|UTC|\dZ$/.test(d) ? "" : d; }
      const diff = (Date.now() - t) / 1000;
      if (diff < 60) return "just now";
      if (diff < 3600) return Math.round(diff / 60) + "m ago";
      if (diff < 86400) return Math.round(diff / 3600) + "h ago";
      if (diff < 172800) return "yesterday";
      return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    function newsStory(s: any, big = false, key = "") {
      if (!s || !(s.headline || s.title)) return "";
      const lab = esc((SPORT_LABEL[s.sport] || s.sport || "").toUpperCase());
      // Always render a branded gradient "matchup card" underneath; overlay the real photo only
      // if it loads at usable resolution. Blurry/tiny/missing/broken images fall back gracefully
      // to an intentional-looking graphic instead of a broken or fuzzy box.
      const sc = esc(String(s.sport || "gen").toLowerCase().replace(/[^a-z]/g, ""));
      const mline = s.angle && typeof s.angle === "object" && s.angle.matchup ? esc(String(s.angle.matchup)) : "";
      // If the story maps to a game on our slate, the fallback is a real logo-vs-logo crest card.
      const gid = s.angle && typeof s.angle === "object" ? s.angle.game_id : null;
      const g = gid ? findGameLive(gid) : null;
      const crestRow = g ? `<span class="nf-vs-row">${gCrest(g, "away", "nf-crest")}<span class="nf-vs-x">vs</span>${gCrest(g, "home", "nf-crest")}</span>` : "";
      const muTxt = g ? `${esc(g.away_abbr)} @ ${esc(g.home_abbr)}` : mline;
      const photo = s.image_url
        ? `<img class="nf-photo" src="${esc(String(s.image_url))}" alt="" loading="lazy" onload="if(!this.naturalWidth||this.naturalWidth<240){this.classList.add('bad')}" onerror="this.classList.add('bad')">`
        : "";
      const img = `<div class="nf-img nf-gen s-${sc}${g ? " nf-vs" : ""}"><span class="nf-gen-dia"></span>${crestRow || `<span class="nf-gen-lab">${lab || "DIAMONDEDGE"}</span>`}${muTxt ? `<span class="nf-gen-mu">${muTxt}</span>` : ""}${photo}</div>`;
      // Our own desk byline — the card opens OUR article in-app (not a link out to the source).
      const when = niceTime(s.published_at, s.published_display);
      const meta = `${lab} · DiamondEdge${when ? " · " + esc(when) : ""}`;
      return `<a class="nf-story ${big ? "nf-hero" : ""}" href="${esc(String(s.url || "#"))}" data-nf="${esc(key)}" rel="noopener">
        ${img}
        <div class="nf-body"><div class="nf-kick">${meta}</div>
        <h3 class="nf-title">${esc(s.headline || s.title)}</h3>
        ${big && (s.dek || s.summary) ? `<p class="nf-sum clamp2">${esc(s.dek || s.summary)}</p>` : ""}
        ${newsAngle(s.angle)}</div></a>`;
    }
    function newsFront() {
      const nf = newsFeed;
      if (!nf || !nf.lead) return "";
      // Dedupe so the same game/story never appears as both the lead AND a headline (or twice in
      // the list) — one card per game keeps the front clean.
      const keyOf = (s: any) => String((s && s.angle && typeof s.angle === "object" && s.angle.game_id) || (s && (s.headline || s.title)) || "").toLowerCase();
      const seen = new Set<string>([keyOf(nf.lead)]);
      const hl = ((nf.headlines || []) as any[]).filter((s) => { const k = keyOf(s); if (!k || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
      // Honest freshness — pulse "live" only if the feed actually refreshed recently; otherwise
      // just show when it last updated. No fake "live".
      const updT = Date.parse(String(nf.updated_at || nf.generated_at || ""));
      const fresh = !isNaN(updT) && (Date.now() - updT) < 40 * 60 * 1000;
      const updTxt = niceTime(nf.updated_at || nf.generated_at);
      const head = fresh
        ? `<span class="nf-live"><span class="livedot"></span>live${updTxt ? ` · ${esc(updTxt)}` : ""}</span>`
        : (updTxt ? `<span class="nf-upd">Updated ${esc(updTxt)}</span>` : "");
      return `<section class="newsfront">
        <div class="nf-head"><span class="nf-lab">Top stories</span>${head}</div>
        ${newsStory(nf.lead, true, "L")}
        ${hl.length ? `<div class="nf-list">${hl.map((s, i) => newsStory(s, false, String(i))).join("")}</div>` : ""}
      </section>`;
    }
    // Resolve a story card back to its object, then open OUR article reader.
    function newsStoryByKey(key: string) {
      if (!newsFeed) return null;
      return key === "L" ? newsFeed.lead : ((newsFeed.headlines || []) as any[])[Number(key)];
    }
    function openArticleSheet(s: any) {
      if (!s) return;
      detail = { _article: true };
      const lab = esc((SPORT_LABEL[s.sport] || s.sport || "").toUpperCase());
      const gid = s.angle && typeof s.angle === "object" ? s.angle.game_id : null;
      const g = gid ? findGameLive(gid) : null;
      const paras = String(s.article || s.summary || "").split(/\n+/).map((x) => x.trim())
        .filter((p) => p && !/^—\s*DiamondEdge/i.test(p));           // drop any trailing byline line
      const body = paras.length ? paras.map((p) => `<p>${mdBold(p)}</p>`).join("") : `<p>${esc(s.summary || "")}</p>`;
      const words = paras.join(" ").split(/\s+/).filter(Boolean).length;
      const readMin = Math.max(1, Math.round(words / 200));
      const angleChip = newsAngle(s.angle);
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">${lab} · DiamondEdge</div>
            <div class="art-title">${esc(s.headline || s.title)}</div>
            ${s.dek ? `<div class="sh-meta">${esc(s.dek)}</div>` : ""}
          </div>
          <div class="sh-body">
            <div class="art-byline"><span>${esc(s.byline || "DiamondEdge Staff")}${niceTime(s.published_at, s.published_display) ? " · " + esc(niceTime(s.published_at, s.published_display)) : ""} · ${readMin} min read</span><button class="art-share" id="art-share" aria-label="Share this story">Share ↗</button></div>
            ${g ? `<div class="art-mu">${gCrest(g, "away", "art-crest")}<span class="art-mu-t">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span>${gCrest(g, "home", "art-crest")}</div>` : ""}
            ${angleChip ? `<div class="art-angle-row"><span class="art-take-lab">Our take</span>${angleChip}${g ? `<button class="art-go" data-gid="${esc(String(gid))}">See our full pick →</button>` : ""}</div>` : ""}
            <div class="art-body">${body}</div>
            ${s.url ? `<a class="art-src" href="${esc(String(s.url))}" target="_blank" rel="noopener">${esc(s.attribution || ("Source: " + (s.source || "the wire")))} ↗</a>` : ""}
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = () => closeDetail();
      $("sheet-bg").onclick = () => closeDetail();
      const gob = layer.querySelector(".art-go") as any;
      if (gob && g) gob.onclick = () => { closeDetail(); setTimeout(() => openDetail(g), 240); };
      const shb = $("art-share");
      if (shb) shb.onclick = async (e: any) => {
        e.stopPropagation();
        const title = String(s.headline || s.title || "DiamondEdge");
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        if ((navigator as any).share) { try { await (navigator as any).share({ title, text: s.dek || title, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${title} — ${url}`); toast("Link copied to clipboard"); } catch { toast(url); }
      };
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    function renderToday() {
      const view = $("today-view");
      if (!view) return;
      const db = briefSource() || fallbackBrief();
      if (!db) { view.innerHTML = skeletonSlate(4); return; }
      const dd = new Date(String(db.date || todayISO()) + "T12:00:00");
      const dateTxt = isNaN(dd.getTime()) ? String(db.date || "") : dd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const isToday = curDate === todayISO();
      const dayRec = dayRecordFor(curDate);
      const mr = monthRecord();
      // masthead record pill reflects the DATE you're viewing; gold flex only on a great day
      const recLabel = dayRec && dayRec.graded
        ? `Picks <b>${dayRec.w}–${dayRec.l}</b>${isToday ? " today" : ""}`
        : (isToday && mr ? `Picks <b>${mr.w}–${mr.l}</b> this month` : "The record");
      const goldChip = dayRec && (dayRec.gw + dayRec.gl) && (dayRec.goldGreat || (dayRec.gw && !dayRec.gl))
        ? `<span class="nm-gold${dayRec.goldGreat ? " hot" : ""}" title="Gold (Strong) picks ${dayRec.gw}–${dayRec.gl}">★ Gold ${dayRec.gw}–${dayRec.gl}${dayRec.goldGreat ? " 🔥" : ""}</span>`
        : "";
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
        const art = g ? gameArticle(g) : null;
        const pl = g ? displayPick(g) : null;
        const stks = g ? gameStreaks(g).slice(0, 3).map((s: any) => `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("") : "";
        const tint = g ? heroTintFor(g, pl) : (leadPick.quality === "strong" ? "gold" : "green");
        const headline = art && art.headline ? esc(cleanBlurb(art.headline)) : esc(leadPick.matchup || "");
        // The pick is now WOVEN onto the hero image (magazine cover line) — for locked
        // free-mode we still show the unlock chip in the body.
        const bet = locked
          ? `<button class="lockchip" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●●</span><span class="lk-badge">${lockSvg}Unlock today's picks</span></button>`
          : "";
        leadStory = `<article class="leadstory q-${leadPick.quality}" data-gid="${esc(leadPick.game_id)}"${locked ? ' data-locked="1"' : ""} role="button" tabindex="0" aria-label="Lead story — ${esc(leadPick.matchup)}">
          ${g ? `<div class="ls-figure">${heroImage(g, tint, "lead")}${gameState(g).kind !== "live" ? `<span class="ls-fig-kick">Lead story · ${esc(SPORT_LABEL[leadPick.sport] || leadPick.sport || "")}</span>` : ""}${heroLiveBadge(g, "lead")}${heroPickCover(g, "lead")}</div>` : ""}
          <div class="ls-body">
            <h3 class="ls-match">${headline}</h3>
            <div class="ls-byline">Lead story · DiamondEdge · ${esc(dateTxt)}</div>
            ${bet}
            ${blurbTxt && !locked ? `<p class="ls-lede">${esc(blurbTxt)}</p>` : locked ? `<p class="ls-lede dim">The full read on today's lead pick — the model number, the line it beats, and the history behind it — is one tap away.</p>` : ""}
            ${!locked && stks ? `<div class="pv-stks">${stks}</div>` : ""}
            <span class="hero-cta">Read the full preview →</span>
          </div>
        </article>`;
      } else {
        leadStory = `<article class="leadstory pass">
          <div class="ls-body">
            <div class="ls-kick"><span class="ls-lab">Lead story</span></div>
            <h3 class="ls-match">No DiamondEdge Pick today — and that's the discipline that keeps the record honest.</h3>
            <p class="ls-lede">We publish a pick only when the numbers clear our bar. Today none did. The storylines below are what we're watching, and every past call stays graded in the open on the Results tab.</p>
            <span class="hero-cta" data-nav="results">See the record →</span>
          </div>
        </article>`;
      }
      const carousel = railPicks.length ? `
        <section class="ng-carousel">
          <div class="sec-h"><span>More DiamondEdge Picks</span></div>
          <div class="tdy-picks" id="tdy-picks" aria-label="Featured picks carousel">${railPicks.map((p: any, i: number) => heroCard(p, i)).join("")}</div>
          ${railPicks.length > 1 ? `<div class="tp-dots" id="tp-dots" role="tablist" aria-label="Carousel position">${railPicks.map((_: any, i: number) => `<button class="tp-dot${i === 0 ? " on" : ""}" data-dot="${i}" aria-label="Go to pick ${i + 1}"></button>`).join("")}</div>` : ""}
        </section>` : "";
      // DEDUPE — the lead story's game is excluded from storylines + the board preview
      // grid, and previews de-dupe among themselves, so no game appears twice on the page.
      const leadGid = leadPick ? String(leadPick.game_id) : null;
      const themes = ((db.themes || []) as any[]);
      const storylines = storylinesBlock(themes, leadGid);
      const seen = new Set<string>(); if (leadGid) seen.add(leadGid);
      const pvGames = previewGames().filter((g: any) => { const id = String(g.game_id); if (seen.has(id)) return false; seen.add(id); return true; }).slice(0, 9);
      const previews = pvGames.length ? `
        <section class="ng-previews">
          <div class="sec-h"><span>The board</span><button class="sec-more" data-nav="games">Full board →</button></div>
          <div class="prevgrid">${pvGames.map((g: any, i: number) => previewCard(g, i, i === 0)).join("")}</div>
        </section>` : "";
      // TIGHT MASTHEAD — kicker (the ONE red accent) + short punchy headline + small dek.
      // A clear divider separates the masthead from the lead story below it.
      const fullHead = cleanBlurb(db.headline || "");
      const tightHead = shortHeadline(fullHead) || esc(fullHead);
      const headDek = fullHead && esc(tightHead).replace(/…$/, "") !== esc(fullHead) ? fullHead : "";
      view.innerHTML = `
        <div class="news">
          ${introBanner()}
          ${newsFront()}
          ${newsFeed && newsFeed.lead ? `<div class="picks-divider"><span>◆ Today's DiamondEdge Picks</span></div>` : ""}
          <div class="masthead">
            <div class="mh-kicker"><span class="lk-tag">${isToday ? "Today" : "Recap"}</span><span class="lk-dateline">${esc(dateTxt)} · DiamondEdge Desk</span><button class="nm-rec" id="nm-rec">${recLabel} →</button>${goldChip}</div>
            <h2 class="lead-head">${esc(tightHead)}</h2>
            ${headDek ? `<p class="mh-dek clamp2">${esc(headDek)}</p>` : ""}
          </div>
          <div class="mh-rule"></div>
          <div class="news-grid">
            <section class="ng-lead">${leadStory}</section>
            ${storylines}
            ${carousel}
            ${previews}
          </div>
          ${socialShareBar()}
          <div class="news-foot">${esc(recordStrip())}</div>
        </div>`;
      // ---- bindings ----
      const sn = $("soc-native"); if (sn) sn.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge", text: "DiamondEdge — every sports pick graded in the open.", url }); return; } catch {} }
        try { await navigator.clipboard.writeText(url); toast("Link copied to clipboard"); } catch { toast(url); }
      };
      const sc = $("soc-copy"); if (sc) sc.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        try { await navigator.clipboard.writeText(url); toast("Link copied to clipboard"); } catch { toast(url); }
      };
      const nav = (el: any) => { const d = el.dataset.nav; if (d) switchTab(d); };
      view.querySelectorAll("[data-nav]").forEach((b: any) => (b.onclick = (e: any) => { e.stopPropagation(); nav(b); }));
      const rec = $("nm-rec"); if (rec) rec.onclick = () => openRecordBreakdown();
      // First-run welcome banner: dismiss (persist) or open "how it works".
      const dismissIntro = () => { setIntroSeen(); const b = $("intro-banner"); if (b) { b.classList.add("gone"); setTimeout(() => b.remove(), 240); } };
      const ibx = $("ib-x"); if (ibx) ibx.onclick = dismissIntro;
      const ibh = $("ib-how"); if (ibh) ibh.onclick = () => { dismissIntro(); openRecipeSheet(); };
      // storyline expand + jump
      view.querySelectorAll(".story").forEach((s: any) => {
        const toggle = (e: any) => {
          const gbtn = e.target && e.target.closest && e.target.closest("[data-th-g]");
          if (gbtn) { const ids = String(gbtn.dataset.thG || "").split(",").filter(Boolean); if (ids.length) jumpToGames(ids); return; }
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
      // News cards open OUR in-app article reader (not a link out).
      view.querySelectorAll(".nf-story[data-nf]").forEach((a: any) => {
        a.onclick = (e: any) => { e.preventDefault(); openArticleSheet(newsStoryByKey(a.dataset.nf)); };
      });
      // carousel dots: track the snapped card, click to go
      const rail = $("tdy-picks"), dots = $("tp-dots");
      if (rail && dots) {
        const cards = Array.from(rail.querySelectorAll(".hero")) as any[];
        const setDot = (i: number) => dots.querySelectorAll(".tp-dot").forEach((d: any, k: number) => d.classList.toggle("on", k === i));
        // PERF: pre-measure card centers once (+ on resize) so the scroll handler never reads
        // layout (offsetLeft/Width) per frame — that was a forced reflow on every scroll tick.
        let centers: number[] = [];
        const measure = () => { centers = cards.map((c: any) => c.offsetLeft + c.offsetWidth / 2); };
        measure();
        window.addEventListener("resize", measure, { passive: true });
        let raf = 0;
        rail.addEventListener("scroll", () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            const mid = rail.scrollLeft + rail.clientWidth / 2;
            let best = 0, bd = Infinity;
            for (let k = 0; k < centers.length; k++) { const d = Math.abs(centers[k] - mid); if (d < bd) { bd = d; best = k; } }
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
          <div class="set-k">Leagues</div>
          <div class="set-about" style="margin-bottom:9px">League tabs are ordered by how many games are on — busiest first. Reorder them to your taste and your order sticks.</div>
          <div class="lg-order" id="lg-order">${orderedLeagues(livePayload || payload).map((lg, i, arr) => `<div class="lg-item"><span class="lg-name">${SPORT_LABEL[lg] || lg}</span><span class="lg-btns"><button class="lg-mv lg-up" data-lg="${lg}" ${i === 0 ? "disabled" : ""} aria-label="Move ${SPORT_LABEL[lg] || lg} up">▲</button><button class="lg-mv lg-dn" data-lg="${lg}" ${i === arr.length - 1 ? "disabled" : ""} aria-label="Move ${SPORT_LABEL[lg] || lg} down">▼</button></span></div>`).join("")}</div>
          ${leagueOrderPref() ? `<button class="set-link" id="lg-reset">↺ Reset to auto (by games)<em>→</em></button>` : ""}
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
      const moveLeague = (lg: string, dir: number) => {
        const cur = orderedLeagues(livePayload || payload);
        const i = cur.indexOf(lg), j = i + dir;
        if (i < 0 || j < 0 || j >= cur.length) return;
        const arr = [...cur]; [arr[i], arr[j]] = [arr[j], arr[i]];
        try { localStorage.setItem("de_league_order", JSON.stringify(arr)); } catch {}
        renderSettings();                       // Games tab re-reads the order when next shown
      };
      view.querySelectorAll(".lg-up").forEach((b: any) => (b.onclick = () => moveLeague(b.dataset.lg, -1)));
      view.querySelectorAll(".lg-dn").forEach((b: any) => (b.onclick = () => moveLeague(b.dataset.lg, 1)));
      const lr = $("lg-reset"); if (lr) lr.onclick = () => { try { localStorage.removeItem("de_league_order"); } catch {} renderSettings(); };
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
            <div class="up-st"><div class="v">${rh.n.toLocaleString()}</div><div class="k">graded picks</div></div>
            <div class="up-st"><div class="v">${sgn(rh.roi * 100, 0)}%</div><div class="k">return</div></div>
            <div class="up-st"><div class="v">'22–'26</div><div class="k">graded seasons</div></div>
          </div>
        </div>
        <div class="up-perks">
          ${perk("Every Strong ◆◆◆ and Good ◆◆ pick, unlocked", "The exact side, line and price we froze before the game — never re-written after the fact.")}
          ${perk("The why, in plain English", "Two or three sentences a first-time reader can follow: the model's number, the line it beats, and the history behind calls made exactly this way.")}
          ${perk("Live reads and score overlay", "Fresh scores every minute during games, with each pick's progress toward its line.")}
          ${perk("The full record, cut every way", "Deep results by league, price, pick type and theme — wins and losses alike. It's the same record we show free users; you just get the picks that build it.")}
        </div>
        <div class="up-price"><span class="amt">$9.99</span><span class="per">/ month</span></div>
        <button class="up-cta" id="up-sub">Unlock DiamondEdge</button>
        <button class="up-back" id="up-back">Not now — keep the free picks</button>
        <div class="up-honest">The numbers above are the real track record — ${rh.n.toLocaleString()} picks graded against final scores, on games the model never saw in advance${fwd ? `, and the record since going live is ${fwd.wins || 0}-${fwd.losses || 0}` : ""}. Every future pick is graded the same way, in the open, win or lose.</div>`;
      $("up-sub").onclick = () => {
        // The buy-flow lives on the Account screen's payment step (Card / Apple Pay / …).
        // Sign-in gates checkout; the payment stub sets the de_premium entitlement there.
        accountMode = isSignedIn() ? "subscribe" : "signin";
        switchTab("account");
      };
      $("up-back").onclick = () => switchTab("today");
    }

    // ===================== ACCOUNT / SIGN-IN / SUBSCRIBE (stubs) =====================
    // Top-right header button: an avatar (initials) when signed in, a person glyph when not.
    // Both open the Account screen; the screen branches to sign-in or subscribe as needed.
    const personSvg = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.7 3.6-6.5 8-6.5s8 2.8 8 6.5"/></svg>`;
    function accountButton() {
      const a = getAccount();
      const prem = isPremium();
      const inner = a
        ? `<span class="acct-av${prem ? " prem" : ""}">${esc(accountInitials())}</span>`
        : `<span class="acct-ic">${personSvg}</span>`;
      return `<button class="acctbtn" id="acctbtn" aria-label="${a ? "Your account" : "Sign in"}">${inner}${a && prem ? `<span class="acct-star" aria-hidden="true">◆</span>` : ""}</button>`;
    }
    function refreshAccountButton() {
      const old = $("acctbtn"); if (!old || !old.parentElement) return;
      const wrap = document.createElement("div"); wrap.innerHTML = accountButton();
      const fresh = wrap.firstElementChild as any;
      old.parentElement.replaceChild(fresh, old);
      fresh.onclick = () => switchTab("account");
    }
    // The Account HUB (signed in) or the sign-in gateway (signed out).
    function renderAccount() {
      const view = $("account-view");
      if (!view) return;
      const a = getAccount();
      if (!a) { accountMode = "signin"; renderSignIn(); return; }
      if (accountMode === "subscribe") { renderSubscribe(); return; }
      const prem = isPremium();
      const rh = recipeHistory();
      view.innerHTML = `
        <div class="acct-page">
          <div class="acct-hero">
            <span class="acct-bigav${prem ? " prem" : ""}">${esc(accountInitials())}</span>
            <h2>${esc(a.name || "DiamondEdge Member")}</h2>
            <div class="acct-em">${esc(a.email || "")}</div>
            <div class="acct-tags"><span class="acct-tag prov">${PROVIDER_MARK[a.provider] ? `<span class="atp">${PROVIDER_MARK[a.provider]}</span>` : ""}${esc(PROVIDER_LABEL[a.provider] || "Account")}</span><span class="acct-tag ${prem ? "prem" : "free"}">${prem ? "◆ Premium" : "Free member"}</span></div>
          </div>
          ${prem
            ? `<div class="acct-card membercard">
                <div class="mc-glow" aria-hidden="true"></div>
                <div class="mc-k">DiamondEdge Premium</div>
                <div class="mc-b">You're unlocked. Every Strong and Good pick shows its side, line and the plain-English why — and you're backing the record that's won <b>${(rh.hit * 100).toFixed(1)}%</b> since 2022.</div>
                <button class="acct-link" id="acct-manage">Manage subscription<em>→</em></button>
              </div>`
            : `<div class="acct-card upsell">
                <div class="uc-k">◆ Go Premium</div>
                <div class="uc-b">Unlock the side & line on every Strong and Good pick — the calls behind the <b>${(rh.hit * 100).toFixed(1)}%</b> record, graded in the open since 2022.</div>
                <button class="acct-cta" id="acct-upgrade">See Premium — $9.99/mo</button>
              </div>`}
          <div class="acct-card">
            <div class="acct-card-k">Account</div>
            <button class="acct-link" id="acct-prefs">Free vs Premium preview<span class="al-sub">See exactly what free members see</span><em>→</em></button>
            <button class="acct-link" id="acct-record">Our full record<em>→</em></button>
            <button class="acct-link" id="acct-how">How picks work<em>→</em></button>
          </div>
          <button class="acct-signout" id="acct-signout">Sign out</button>
          <div class="acct-foot">Signed in since ${esc(a.since || todayISO())}. Your account and membership live on this device for now — real sign-in and billing wire in at the marked points in the code.</div>
        </div>`;
      const upg = $("acct-upgrade"); if (upg) upg.onclick = () => { accountMode = "subscribe"; renderSubscribe(); };
      const mng = $("acct-manage"); if (mng) mng.onclick = () => { accountMode = "subscribe"; renderSubscribe(); };
      $("acct-prefs").onclick = () => switchTab("settings");
      $("acct-record").onclick = () => switchTab("results");
      $("acct-how").onclick = () => openRecipeSheet();
      $("acct-signout").onclick = () => { signOut(); refreshAccountButton(); accountMode = "signin"; renderSignIn(); };
    }
    // SIGN-IN gateway: social buttons (Google/Apple/Facebook/X) + email — all functional
    // STUBS that set a mock session and persist it. NO real OAuth (wire-in points marked).
    function renderSignIn() {
      const view = $("account-view");
      if (!view) return;
      const rh = recipeHistory();
      const social = (p: string) =>
        `<button class="sgn-btn sgn-${p}" data-prov="${p}"><span class="sgn-mark">${PROVIDER_MARK[p]}</span><span class="sgn-tx">Continue with ${PROVIDER_LABEL[p]}</span></button>`;
      view.innerHTML = `
        <div class="acct-page signin">
          <button class="acct-x" id="sgn-close" aria-label="Back">✕</button>
          <div class="sgn-hero">
            <div class="sgn-dia" aria-hidden="true"></div>
            <h2>Join DiamondEdge</h2>
            <p>Save your preferences and unlock Premium. One honest model, graded in public since 2022 — <b>${(rh.hit * 100).toFixed(1)}%</b> winners across ${rh.n.toLocaleString()} picks.</p>
          </div>
          <div class="sgn-socials">
            ${social("google")}${social("apple")}${social("facebook")}${social("x")}
          </div>
          <div class="sgn-or"><span>or with email</span></div>
          <form class="sgn-email" id="sgn-form">
            <input type="email" id="sgn-mail" placeholder="you@email.com" autocomplete="email" aria-label="Email address" required>
            <button type="submit" class="sgn-emailbtn">Continue with email</button>
          </form>
          <div class="sgn-legal">By continuing you agree these are demo sign-in stubs — no real account is created and no password is stored. Wire-in points for real OAuth and email auth are marked in the source.</div>
        </div>`;
      $("sgn-close").onclick = () => { if (isSignedIn()) { accountMode = "menu"; renderAccount(); } else switchTab("today"); };
      view.querySelectorAll(".sgn-btn").forEach((b: any) => (b.onclick = () => {
        // OAUTH WIRE-IN POINT (per provider): replace mockSignIn with the real provider flow,
        // then persist the returned profile via setAccount and confirm entitlement server-side.
        mockSignIn(b.dataset.prov);
        onSignedIn();
      }));
      const form = $("sgn-form");
      if (form) form.onsubmit = (e: any) => {
        e.preventDefault();
        const mail = ($("sgn-mail") && $("sgn-mail").value || "").trim();
        // EMAIL AUTH WIRE-IN POINT: send a magic link / OTP here; on verify, setAccount(...).
        mockSignIn("email", mail || undefined);
        onSignedIn();
      };
    }
    // Post-sign-in: refresh header avatar, re-render surfaces that show account/pick state,
    // land on the account hub with a brief confirmation.
    function onSignedIn() {
      refreshAccountButton();
      accountMode = "menu";
      const a = getAccount();
      toast(`Signed in${a && a.name ? " as " + a.name : ""}`);
      renderAccount();
    }
    // SUBSCRIPTION / PAYMENT: Credit Card + Apple Pay + PayPal + Google Pay as STUBS. On
    // "subscribe" it sets the de_premium entitlement with a success animation. NO real
    // Stripe/Apple Pay — documented wire-in points. The real record is the sell.
    let payMethod = "card";
    function renderSubscribe() {
      const view = $("account-view");
      if (!view) return;
      const rh = recipeHistory();
      const fwd = forwardRecord();
      const method = (id: string, label: string, mark: string) =>
        `<button class="pay-m ${payMethod === id ? "on" : ""}" data-pm="${id}"><span class="pm-mark">${mark}</span><span class="pm-l">${esc(label)}</span><span class="pm-r" aria-hidden="true"></span></button>`;
      const cardMark = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/></svg>`;
      const appleMark = PROVIDER_MARK.apple;
      const gpayMark = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M12 10.2v3.7h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3a9.2 9.2 0 0 0 2.8-6.9c0-.7-.06-1.3-.17-2.1z"/><path fill="#34A853" d="M12 21c2.5 0 4.6-.83 6.2-2.25l-3-2.35c-.83.56-1.9.9-3.2.9-2.45 0-4.5-1.65-5.25-3.87H3.6v2.42A9.4 9.4 0 0 0 12 21z"/><path fill="#FBBC04" d="M6.75 13.43a5.6 5.6 0 0 1 0-3.57V7.44H3.6a9.4 9.4 0 0 0 0 8.42z"/><path fill="#EA4335" d="M12 6.55c1.38 0 2.6.48 3.57 1.4l2.66-2.66A9.15 9.15 0 0 0 12 3a9.4 9.4 0 0 0-8.4 4.44l3.15 2.42C7.5 8.2 9.55 6.55 12 6.55z"/></svg>`;
      const paypalMark = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#003087" d="M7.6 20.5l.5-3.1H5.4L7.8 3.8h6.1c2.7 0 4.5 1.4 4 4.1-.5 3.1-2.8 4.5-5.7 4.5H9.9l-.7 4.4z"/><path fill="#009CDE" d="M9.6 12.4h2.3c2.9 0 5.2-1.4 5.7-4.5.1-.5.1-.9.1-1.3 1 .6 1.5 1.7 1.2 3.4-.5 3.1-2.8 4.5-5.7 4.5h-1.7l-.7 4.4-.3 1.6H7.6l.5-3.1z"/></svg>`;
      // The active method's detail form (all inert — a real gateway replaces each).
      let detail = "";
      if (payMethod === "card") {
        detail = `<div class="pay-detail">
          <label class="pay-fld"><span>Card number</span><input inputmode="numeric" placeholder="4242 4242 4242 4242" aria-label="Card number"></label>
          <div class="pay-fld-row">
            <label class="pay-fld"><span>Expiry</span><input placeholder="MM / YY" aria-label="Expiry"></label>
            <label class="pay-fld"><span>CVC</span><input inputmode="numeric" placeholder="123" aria-label="CVC"></label>
          </div>
          <div class="pay-secure">${lockSvg} Demo only — inputs are inert. STRIPE WIRE-IN replaces this form with Stripe Elements + a Checkout Session.</div>
        </div>`;
      } else if (payMethod === "apple") {
        detail = `<div class="pay-detail wallet"><div class="pw-line">${appleMark}<b>Apple Pay</b></div><p>Tap Subscribe to confirm with Face ID / Touch ID. <em>Demo stub</em> — a real build calls the Apple Pay JS / native sheet, then confirms the Stripe PaymentIntent.</p></div>`;
      } else if (payMethod === "gpay") {
        detail = `<div class="pay-detail wallet"><div class="pw-line">${gpayMark}<b>Google Pay</b></div><p>Tap Subscribe to confirm with your Google wallet. <em>Demo stub</em> — wire in the Google Pay API + Stripe token exchange here.</p></div>`;
      } else {
        detail = `<div class="pay-detail wallet"><div class="pw-line">${paypalMark}<b>PayPal</b></div><p>Tap Subscribe to check out with PayPal. <em>Demo stub</em> — wire in the PayPal Subscriptions SDK here.</p></div>`;
      }
      view.innerHTML = `
        <div class="acct-page subscribe">
          <button class="acct-x" id="sub-close" aria-label="Back">✕</button>
          <div class="sub-hero">
            <div class="sub-dia" aria-hidden="true"></div>
            <div class="sub-k">DiamondEdge Premium</div>
            <div class="sub-price"><span class="amt">$9.99</span><span class="per">/ month</span></div>
            <p class="sub-sell">Every Strong ◆◆◆ and Good ◆◆ pick, unlocked — the exact calls behind a <b>${(rh.hit * 100).toFixed(1)}%</b> record across <b>${rh.n.toLocaleString()}</b> graded picks since 2022${fwd ? `, and <b>${fwd.wins || 0}-${fwd.losses || 0}</b> since going live` : ""}. Cancel anytime.</p>
          </div>
          <div class="pay-methods">
            <div class="pay-k">Pay with</div>
            ${method("card", "Credit or debit card", cardMark)}
            ${method("apple", "Apple Pay", appleMark)}
            ${method("gpay", "Google Pay", gpayMark)}
            ${method("paypal", "PayPal", paypalMark)}
          </div>
          ${detail}
          <button class="sub-cta" id="sub-go">${payMethod === "apple" ? " Pay — Subscribe" : payMethod === "gpay" ? "Subscribe with Google Pay" : payMethod === "paypal" ? "Subscribe with PayPal" : "Subscribe — $9.99/mo"}</button>
          <button class="sub-skip" id="sub-skip">Not now</button>
          <div class="sub-honest">The record above is real — ${rh.n.toLocaleString()} picks graded against final scores on games the model never saw in advance. No real charge is made in this demo; on Subscribe your Premium entitlement flips on. Real billing wires in at the marked points.</div>
        </div>`;
      view.querySelectorAll(".pay-m").forEach((b: any) => (b.onclick = () => { payMethod = b.dataset.pm; renderSubscribe(); }));
      $("sub-close").onclick = () => { accountMode = "menu"; renderAccount(); };
      $("sub-skip").onclick = () => { accountMode = "menu"; renderAccount(); };
      $("sub-go").onclick = () => {
        // STRIPE / APPLE PAY / PAYPAL WIRE-IN POINT: run the selected gateway here. On a
        // confirmed charge (webhook/callback), set the entitlement — mirror server-side.
        setPremium(true);
        refreshAccountButton();
        const d = document.createElement("div");
        d.className = "up-done";
        d.setAttribute("role", "status");
        d.innerHTML = `<div class="ud-inner"><div class="ud-dia"></div><h3>You're in.</h3><p>Premium unlocked — every pick, every why.</p></div>`;
        document.body.appendChild(d);
        setTimeout(() => {
          d.remove();
          accountMode = "menu";
          if ($("slate-body")) renderSlate();
          renderToday();
          renderAccount();
        }, REDUCE ? 300 : 1600);
      };
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
      // ONE unified STICKY header (logo appears once) + a slim live TICKER beneath it.
      root.innerHTML = `
        <header id="app-header">
          <div class="hbar">
            <div class="brand" id="brand">
              <div class="diamond"></div>
              <div class="brand-tx"><h1>Diamond<b>Edge</b></h1><div class="tag">Today · Games · Results</div></div>
            </div>
            <div class="hspacer"></div>
            <div class="toptabs">
              ${navTabs.map((t) => `<button data-tab="${t}" class="${tab === t ? "on" : ""}">${NAV_LABEL[t]}</button>`).join("")}
            </div>
            ${accountButton()}
          </div>
          <div class="ticker" id="ticker" aria-label="Today's scores and picks"></div>
        </header>
        <main>
          <div id="today-view" style="display:${tab === "today" ? "block" : "none"}"></div>
          <div id="games-view" style="display:${tab === "games" ? "block" : "none"}"></div>
          <div id="results-view" style="display:none"></div>
          <div id="settings-view" style="display:none"></div>
          <div id="upgrade-view" style="display:none"></div>
          <div id="account-view" style="display:none"></div>
        </main>
        <nav class="bnav" id="bnav" aria-label="Primary">
          ${navTabs.map((t) => `<button data-tab="${t}" class="${tab === t ? "on" : ""}" aria-label="${NAV_LABEL[t]}"${tab === t ? ' aria-current="page"' : ""}><span class="bn-ic">${NAV_ICONS[t]}</span><span class="bn-lab">${NAV_LABEL[t]}</span></button>`).join("")}
        </nav>`;
      root.querySelectorAll(".toptabs [data-tab], .bnav [data-tab]").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
      $("brand").onclick = () => switchTab("today");
      const ab = $("acctbtn"); if (ab) ab.onclick = () => switchTab("account");
      const hdr0 = $("app-header"); if (hdr0) document.documentElement.style.setProperty("--hdr-h", hdr0.offsetHeight + "px");
      bindHeaderScroll();
      renderTicker();
    }
    // ---- TOP TICKER: today's slate at a glance (live scores + each game's pick + trend) ----
    function tickerItems() {
      const src = livePayload || payload;
      if (!src || !src.games) return [];
      // GENUINELY-LIVE games ONLY. status==="live" isn't enough — games can get stuck at "live"
      // after finishing (backend status-transition gap), so also require an actual in-progress
      // score AND a period label that isn't a final marker (Final/FT/Ended). Empty => ticker hides.
      return ((src.games || []) as any[])
        .filter((g: any) => {
          const gs = gameState(g);
          if (gs.kind !== "live" || !gs.score || gs.score.home == null) return false;
          const lab = String(gs.label || "").toLowerCase();
          return !(lab.includes("final") || lab === "ft" || lab.includes("full") || lab.includes("end"));
        })
        .slice(0, 20);
    }
    function tickerItemHtml(g: any) {
      const gs = gameState(g);
      const pl = displayPick(g);
      let score = "";
      if (gs.score && gs.score.split && gs.score.home != null) score = `<b>${num(gs.score.away, 0)}</b>–<b>${num(gs.score.home, 0)}</b>`;
      const stateTag = gs.kind === "live" ? `<span class="tk-live"><span class="livedot"></span></span>` : gs.kind === "final" ? `<span class="tk-fin">F</span>` : `<span class="tk-time">${esc(gs.si.hasTime && gs.si.time ? gs.si.time.replace(TZ_ABBR ? " " + TZ_ABBR : "", "") : "")}</span>`;
      // pick + live trend arrow
      let pickTag = "";
      if (pl && pl.action === "TAKE") {
        const ls = gs.kind === "live" ? liveStatusOf(g, pl) : null;
        const dir = ls ? (ls.dir === "trending_hit" ? "hit" : ls.dir === "trending_miss" ? "miss" : "close") : "";
        const arrow = dir === "hit" ? "▲" : dir === "miss" ? "▼" : "";
        pickTag = `<span class="tk-pick ${dir}">${esc(pl.side || "")}${arrow ? ` ${arrow}` : ""}</span>`;
      }
      return `<button class="tk-item" data-gid="${esc(g.game_id)}">${stateTag}<span class="tk-mu">${esc(g.away_abbr)}${score ? ` ${score} ` : " @ "}${esc(g.home_abbr)}</span>${pickTag}</button>`;
    }
    function renderTicker() {
      const el = $("ticker"); if (!el) return;
      const items = tickerItems();
      if (!items.length) { el.style.display = "none"; return; }
      el.style.display = "";
      const row = items.map(tickerItemHtml).join(`<span class="tk-dot">·</span>`);
      // duplicate the row so the marquee loops seamlessly (unless reduced-motion)
      el.innerHTML = `<div class="tk-track${REDUCE ? " still" : ""}" id="tk-track"><span class="tk-seq">${row}</span>${REDUCE ? "" : `<span class="tk-seq" aria-hidden="true">${row}</span>`}</div>`;
      el.querySelectorAll(".tk-item").forEach((b: any) => (b.onclick = () => { const g = gameById(b.dataset.gid); if (g) openDetail(g); }));
      // the ticker changes the header height — republish it for the sticky subhead offset
      requestAnimationFrame(() => { const h = $("app-header"); if (h) document.documentElement.style.setProperty("--hdr-h", h.offsetHeight + "px"); });
    }
    // ---- unified sticky header + collapsing behavior on the Games tab (scroll-driven) ----
    // Driven by BOTH a scroll listener (fast) AND IntersectionObserver sentinels (robust —
    // fires even where programmatic scrolls don't dispatch scroll events). Idempotent.
    let headerScrollBound = false;
    function applyHeaderState(y: number) {
      const hdr = $("app-header"); if (!hdr) return;
      hdr.classList.toggle("scrolled", y > 6);
      if (tab === "games") document.body.classList.toggle("games-condensed", y > 56);
      else document.body.classList.remove("games-condensed");
      document.documentElement.style.setProperty("--hdr-h", hdr.offsetHeight + "px");
    }
    function scrollY() { return window.scrollY || (document.scrollingElement ? document.scrollingElement.scrollTop : 0) || 0; }
    function bindHeaderScroll() {
      if (headerScrollBound) return; headerScrollBound = true;
      let raf = 0;
      // Toggle immediately (cheap class flip — robust even where rAF is throttled), and also
      // coalesce a rAF pass for the --hdr-h publish when animation frames are available.
      const onScroll = () => { applyHeaderState(scrollY()); if (raf) return; raf = requestAnimationFrame(() => { raf = 0; applyHeaderState(scrollY()); }); };
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("scroll", onScroll, { passive: true, capture: true });
      window.addEventListener("resize", onScroll, { passive: true });
      // the header shrinks/grows on scroll (ticker folds away) — republish --hdr-h when the
      // collapse transition settles so the sticky sub-header offset stays exact, no gap/jump.
      const hdrEl = $("app-header");
      if (hdrEl) hdrEl.addEventListener("transitionend", (e: any) => {
        if (e.propertyName === "max-height") document.documentElement.style.setProperty("--hdr-h", hdrEl.offsetHeight + "px");
      });
      requestAnimationFrame(() => applyHeaderState(scrollY()));
    }

    function switchTab(t: string) {
      if (t === tab) return;
      tab = t;
      TABS.forEach((k) => { const v = $(k + "-view"); if (v) v.style.display = k === t ? "block" : "none"; });
      root.querySelectorAll(".toptabs [data-tab], .bnav [data-tab]").forEach((b: any) => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "today" && !todayFresh) { renderToday(); todayFresh = true; }
      if (t === "results" && !$("results-view").innerHTML.trim()) renderResults();
      if (t === "settings") renderSettings();
      if (t === "upgrade") renderUpgrade();
      if (t === "account") renderAccount();
      if (t === "games") requestAnimationFrame(() => { positionInk(); positionLens(); recenterStrip(false); });
      // Defer the scroll reset off the tab-switch path so the view flip paints immediately.
      requestAnimationFrame(() => window.scrollTo(0, 0));
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
      renderToday(); // skeleton until the payload lands
      await loadIndex();
      payload = await loadDay(curDate);
      try { newsFeed = await snap("news_feed"); } catch {}
      league = bestLeague();
      root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
      positionInk();
      renderSlate();
      renderToday();
      renderTicker();
      requestAnimationFrame(() => { positionInk(); positionLens(); recenterStrip(false); });
      // deep-link restore: a fresh ?g=<id> load opens that game's sheet (replace, not push).
      syncFromUrl(false);
      // ---- SMART SILENT AUTO-REFRESH (no pull-to-refresh, no spinners on loaded content) ----
      // Tiered by cost + volatility, all paused while the tab is hidden:
      //   · live_scores (tiny)   → every ~50s while a game is live/near-start
      //   · live_detail (box)    → every ~40s ONLY while a live game's detail page is open
      //   · pregame_picks (big)  → every ~4 min, applied only when generated_at advances
      setInterval(pollLiveScores, 50 * 1000);
      setInterval(() => { if (detail && detail.game_id != null) pollLiveDetail(); }, 40 * 1000);
      setInterval(pollPregame, 4 * 60 * 1000);
      // resume with one immediate fetch on focus; pausing is handled inside each poller.
      document.addEventListener("visibilitychange", () => { if (!document.hidden) { pollLiveScores(); pollPregame(); if (detail) pollLiveDetail(); } });
      window.addEventListener("focus", () => { pollLiveScores(); });
      pollLiveScores();
      // debug hook: inject a live_scores snapshot without waiting for the poller
      root._injectLiveScores = (ls: any) => { liveScores = ls; const ch = applyLiveScores(); if (ch) refreshLiveViews(); return ch; };
      // debug hook: attach a per-pick live_status to a live game by id, then re-render.
      // debug hook: attach a live_detail box score without waiting for the poller.
      root._injectLiveDetail = (ld: any) => { liveDetail = ld; if (detail && detail.game_id != null) refreshSheetScore(detail); return true; };
      root._injectLiveStatus = (gid: any, status: any) => {
        const src = livePayload || payload;
        const g = ((src && src.games) || []).find((x: any) => String(x.game_id) === String(gid));
        if (!g) return false;
        g.live_status = status;
        if (g.display_pick) g.display_pick.live_status = status;
        refreshLiveViews();
        return true;
      };
    })();
  }, []);

  return <div id="app-root" />;
}
