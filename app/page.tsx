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
    // Full MLB team name → abbr, so synthesized future tiles (which carry only the full
    // team name from the pick feed) resolve to a real crest instead of the text fallback.
    // Keyed on the LAST word (nickname) since that's what teamShort() extracts.
    const MLB_NICK: any = { "Diamondbacks": "ARI", "Braves": "ATL", "Orioles": "BAL", "Sox": "BOS", "Cubs": "CHC", "Guardians": "CLE", "Rockies": "COL", "Tigers": "DET", "Astros": "HOU", "Royals": "KC", "Angels": "LAA", "Dodgers": "LAD", "Marlins": "MIA", "Brewers": "MIL", "Twins": "MIN", "Mets": "NYM", "Yankees": "NYY", "Athletics": "ATH", "Phillies": "PHI", "Pirates": "PIT", "Padres": "SD", "Giants": "SF", "Mariners": "SEA", "Cardinals": "STL", "Rays": "TB", "Rangers": "TEX", "Blue Jays": "TOR", "Jays": "TOR", "Nationals": "WSH", "Reds": "CIN" };
    // Full team name ("Atlanta Braves", "Chicago White Sox") → abbr. Disambiguate the two
    // "Sox" clubs by city, everything else by nickname; fall back to teamShort's last word.
    const mlbAbbr = (name: any) => {
      const s = String(name || "").trim();
      if (!s) return "";
      if (/white sox/i.test(s)) return "CWS";
      if (/red sox/i.test(s)) return "BOS";
      const w = s.split(/\s+/);
      const last = w[w.length - 1];
      const last2 = w.length >= 2 ? w.slice(-2).join(" ") : last;
      return MLB_NICK[last2] || MLB_NICK[last] || (TEAM_ID[last] ? last : last);
    };
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
    // Base document title — restored when a game sheet closes; a game sheet sets a per-matchup title
    // so shared/opened ?g= links, bookmarks, browser history and tabs read as the actual game.
    const DEF_TITLE = (typeof document !== "undefined" && document.title) || "DiamondEdge — Today's Picks, Games & Results";
    const SPORT_LABEL: any = { all: "All", mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };
    const SPORT_ICON: any = { all: "◆", mlb: "⚾", nba: "🏀", nhl: "🏒", nfl: "🏈", soccer: "⚽" };
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
      const abbr = esc((ab || "").slice(0, 3));
      if (!url) return `<span class="crest ${cls}">${abbr}</span>`;
      // EVERY sport falls back to the readable text crest (team abbr) if the logo fails or is
      // slow — never an empty box. Eager load (crests are tiny SVGs) so nothing flashes blank
      // while scrolling. (Was: MLB used visibility:hidden → empty white plate on any miss.)
      const fb = `<span class=&quot;crest ${cls}&quot;>${abbr}</span>`;
      return `<img class="${cls}" src="${url}" onerror="this.onerror=null;this.outerHTML='${fb}'" alt="">`;
    }
    const gCrest = (g: any, which: "home" | "away", cls = "") =>
      crestImg(g.sport, which === "home" ? g.home_abbr : g.away_abbr, cls, which === "home" ? g.home_logo : g.away_logo);

    // Graded result for a game's surfaced pick — handles result as an object {status} (de_plays)
    // OR a bare string (raw display_pick, which normPlay can drop). Returns hit|miss|push|null.
    const pickResult = (g: any, pl: any) => {
      const raw: any = pl && pl.result;
      let r = typeof raw === "string" ? raw : (raw && raw.status) || null;
      if (!r && g && g.display_pick && typeof g.display_pick.result === "string") r = g.display_pick.result;
      return r;
    };

    // ===================== SUGGESTED ACTIONS (fallback source for plays) =====================
    // A game carries `suggested_action` only on the live MLB slate. status SUGGEST → surfaced;
    // status ABSTAIN → silent. HOUSE RULE: the hit-rate NEVER renders without the price/ROI.
    const saOf = (g: any) => {
      const sa = g && g.suggested_action;
      return sa && sa.status === "SUGGEST" ? sa : null;
    };
    const saPct = (p: any, d = 0) => (p == null || isNaN(Number(p)) ? "—" : (Number(p) * 100).toFixed(d) + "%");
    const saRecStr = (sa: any) => (sa && sa.record_3yr) || "64.1% / 61.7% / 60.2% (2024/2025/2026)";

    // ===================== V3 RECONCILED SURFACES (shadow, additive) =====================
    // The backend serves a per-game `g.v3` block (MLB only today; absent elsewhere). It carries
    //   - a RECONCILED display total / per-team score that AGREES with the served pick side
    //     (fixes "OVER 8.5" next to a predicted 7.9),
    //   - win_prob (p_home_win / p_away_win),
    //   - correct push accounting (p_over / p_under / p_push — push is NOT credited to UNDER),
    //   - a unified confidence,
    //   - totals_pick that is BYTE-IDENTICAL to the served de_plays pick (side/tier/price) — so the
    //     PICK itself is NEVER re-sourced from v3; this only makes the SCORE/WP/PUSH presentation
    //     cohere with that pick.
    // Every accessor reads DEFENSIVELY and returns null when v3 (or the needed field) is missing, so
    // callers can fall back to the legacy fields (predicted_score / total_pick.our_proj / ml_pick)
    // exactly as before. v3 may be partial/degraded — never crash, never blank a field.
    const _fin = (x: any) => (x == null || x === "" || isNaN(Number(x)) ? null : Number(x));
    const v3Of = (g: any) => {
      const v = g && g.v3;
      return v && typeof v === "object" ? v : null;
    };
    // Did the DISPLAY RECONCILER actually run for this game? The reconciler is what tilts the shown
    // score to AGREE with the pick side. When it's SKIPPED (missing line / NaN mu / no sim), v3's
    // predicted_total_display is just the raw sim mean, which can DISAGREE with the pick exactly like
    // the legacy number — so in that case we must NOT prefer it over the (identical-or-better) legacy
    // field. We treat it as reconciled when the note doesn't say "skipped", OR a non-zero reconcile
    // delta was applied, OR the sim distribution is present. This is the guard that keeps us from
    // introducing incoherence: we only override the legacy display with a GENUINELY reconciled value.
    function v3Reconciled(g: any): boolean {
      const v = v3Of(g);
      if (!v) return false;
      const disp = (v.display && typeof v.display === "object") ? v.display : {};
      const note = String(disp.note || "").toLowerCase();
      if (note.includes("skip")) {
        // Even if flagged skipped, honor an explicitly non-zero applied delta or a real sim.
        const dlt = _fin(disp.reconcile_delta);
        const dist = (v.distribution && typeof v.distribution === "object") ? v.distribution : {};
        return (dlt != null && Math.abs(dlt) > 1e-9) || _fin(dist.p_over_nopush) != null || _fin(dist.q50) != null;
      }
      return true;
    }
    // Reconciled predicted TOTAL ("our number") — ONLY when the reconciler ran (else null → legacy).
    function v3PredTotal(g: any): number | null {
      if (!v3Reconciled(g)) return null;
      const v = v3Of(g)!;
      const disp = (v.display && typeof v.display === "object") ? v.display : {};
      const ps = (v.predicted_score && typeof v.predicted_score === "object") ? v.predicted_score : {};
      const t = _fin(disp.predicted_total_display);
      if (t != null) return t;
      const t2 = _fin(ps.predicted_total);
      if (t2 != null) return t2;
      const a = _fin(disp.mu_away_display != null ? disp.mu_away_display : ps.mu_away);
      const h = _fin(disp.mu_home_display != null ? disp.mu_home_display : ps.mu_home);
      return a != null && h != null ? a + h : null;
    }
    // Reconciled per-team expected score {away,home} — ONLY when the reconciler ran (else null → legacy).
    function v3Score(g: any): { away: number; home: number } | null {
      if (!v3Reconciled(g)) return null;
      const v = v3Of(g)!;
      const disp = (v.display && typeof v.display === "object") ? v.display : {};
      const ps = (v.predicted_score && typeof v.predicted_score === "object") ? v.predicted_score : {};
      const a = _fin(disp.mu_away_display != null ? disp.mu_away_display : ps.mu_away);
      const h = _fin(disp.mu_home_display != null ? disp.mu_home_display : ps.mu_home);
      return a != null && h != null ? { away: a, home: h } : null;
    }
    // Reconciled win probability for a given side (home/away). Falls back defensively; null if absent.
    // GATED on the reconciler: in the current shadow payload v3.win_prob can DISAGREE with v3's own
    // predicted_score (e.g. score favors the away team but p_home_win>0.5), so we only prefer it once
    // the block is genuinely reconciled — otherwise legacy ml_pick.our_winprob stands (zero change).
    function v3WinProb(g: any, which: "home" | "away"): number | null {
      if (!v3Reconciled(g)) return null;
      const v = v3Of(g);
      if (!v || !v.win_prob || typeof v.win_prob !== "object") return null;
      const wp = v.win_prob;
      const ph = _fin(wp.p_home_win), pa = _fin(wp.p_away_win);
      if (which === "home") return ph != null ? ph : (pa != null ? 1 - pa : null);
      return pa != null ? pa : (ph != null ? 1 - ph : null);
    }
    // Correct over/under/push accounting for a totals pick. Returns {p_over, p_under, p_push} where
    // available so integer-line push mass is shown as PUSH, never mis-credited to UNDER. Prefers the
    // distribution block, then reconstructs from totals_pick.p_over + p_push. Null if nothing usable.
    function v3Push(g: any): { p_over: number | null; p_under: number | null; p_push: number | null } | null {
      const v = v3Of(g);
      if (!v) return null;
      const dist = (v.distribution && typeof v.distribution === "object") ? v.distribution : {};
      const tp = (v.totals_pick && typeof v.totals_pick === "object") ? v.totals_pick : {};
      let po = _fin(dist.p_over), pu = _fin(dist.p_under), pp = _fin(dist.p_push);
      if (po == null) po = _fin(tp.p_over);
      // If we have over + push but not under, the remainder is under (push kept separate).
      if (pu == null && po != null) pu = pp != null ? Math.max(0, 1 - po - pp) : null;
      if (po == null && pu == null && pp == null) return null;
      return { p_over: po, p_under: pu, p_push: pp };
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
        signals: Array.isArray(raw.signals) ? raw.signals : null,
        result: normPlayResult(raw.result),
        live_status: raw.live_status && typeof raw.live_status === "object" ? raw.live_status : null,
        src: "de",
      };
    }
    function gamePlays(g: any) {
      // V4 FIRST: when the new model covers this game, its cells ARE the plays —
      // takes and priced-out passes alike. Legacy de_plays only when uncovered.
      const vg = v4GameFor(g);
      if (vg) {
        const out4: any = {};
        MARKETS.forEach((mk) => {
          const c = v4CellFor(vg, mk);
          out4[mk] = c ? v4ToPlay(g, c)
            : { market: mk, action: "PASS", side: null, line: null, price: null, p: null, tier: null, why: [], result: null, src: "v4" };
        });
        return out4;
      }
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

    // ===================== LIVE TRACKING READ (honest, from real live fields ONLY) =====================
    // "Is our pick on course to cash?" — computed from live score/inning fields the payload
    // already carries (current_actuals.total_so_far, home_score+away_score, gameState). NEVER
    // invents a score or projects a finish. For a TOTAL (the validated edge) it gives a plain
    // "N runs through M · needs K more to cash OVER 8.5" read; for a spread/ML lean, a lighter
    // "who's ahead" status. It is CONTEXT, not a new pick — the graded morning play is unchanged.
    // A short phrase for how far the clock/inning is along, in the sport's own words.
    function liveWhenPhrase(g: any, gs: any) {
      const lab = String((gs && gs.label) || "").trim();
      if (g.sport === "mlb") {
        // period_label is "Top/Bot/Mid/End 6th" — turn into "through 5" (completed innings).
        const m = lab.match(/(\d+)(?:st|nd|rd|th)/);
        if (m) {
          const inn = Number(m[1]);
          const half = /^(bot|end)/i.test(lab) ? "bot" : /^mid/i.test(lab) ? "mid" : "top";
          // Runs "through" the last COMPLETED inning; mid-inning we say "in the Nth".
          if (half === "top") return inn > 1 ? `through ${inn - 1}` : "early";
          if (half === "mid" || half === "bot" || half === "end") return `through ${inn}${half === "bot" ? " (home batting)" : ""}`;
          return `in the ${inn}${["th","st","nd","rd"][inn % 10 > 3 || (inn >= 11 && inn <= 13) ? 0 : inn % 10]}`;
        }
      }
      return lab && lab.toLowerCase() !== "live" ? `— ${lab}` : "in progress";
    }
    // The tracking read for the SURFACED pick. Returns { kind, cls, head, sub } or null.
    //   cls: hit|close|miss|done-hit|done-miss  · kind: total|lean
    function liveTrackingRead(g: any, pl: any) {
      if (!g || !pl || pl.action !== "TAKE") return null;
      const gs = gameState(g);
      const live = gs.kind === "live", fin = gs.kind === "final";
      if (!live && !fin) return null;
      const unit = SPORT_UNIT[g.sport] || "runs";
      // ---- TOTAL: the validated edge — the richest live read. ----
      if (pl.market === "total") {
        const line = pl.line != null ? Number(pl.line) : Number((String(pl.side || "").match(/[\d.]+/) || [])[0]);
        if (line == null || isNaN(line)) return null;
        const over = /over/i.test(String(pl.side || ""));
        // Live combined total from real fields; final falls back to the graded final total.
        const ca = g.current_actuals || {};
        let runs: number | null = ca.total_so_far != null && !isNaN(Number(ca.total_so_far)) ? Number(ca.total_so_far)
          : (ca.home_score != null && ca.away_score != null ? Number(ca.home_score) + Number(ca.away_score) : null);
        if (fin) { const fsc = finalScore(g); if (fsc && fsc.total != null) runs = Number(fsc.total); }
        if (runs == null || isNaN(runs)) return null;
        const side = `${over ? "OVER" : "UNDER"} ${lineStr(line)}`;
        const cushion = line - runs;                 // >0: still under the line
        const overShot = runs > line;                // the line has been passed
        const when = live ? liveWhenPhrase(g, gs) : "";
        const runTxt = `${runs} ${runs === 1 ? unit.replace(/s$/, "") : unit}`;
        if (fin) {
          if (runs === line) return { kind: "total", cls: "close", head: `${runTxt} · pushed on ${side}`, sub: "" };
          const won = overShot === over;
          return { kind: "total", cls: won ? "done-hit" : "done-miss",
            head: `${runTxt} · ${side} ${won ? "cashed" : "did not cash"}`, sub: "" };
        }
        // LIVE
        if (over) {
          if (overShot) return { kind: "total", cls: "done-hit", head: `${runTxt} ${when} · OVER ${lineStr(line)} already cashed`, sub: "The number is in — the rest of the game can't take it back." };
          const need = Math.floor(line) + 1 - runs;   // integer runs still needed to clear the line
          return { kind: "total", cls: need <= 2 ? "hit" : "close",
            head: `${runTxt} ${when} · needs ${need} more to cash OVER ${lineStr(line)}`,
            sub: need <= 2 ? "Right on the doorstep." : "" };
        } else {
          // UNDER
          if (overShot) return { kind: "total", cls: "done-miss", head: `${runTxt} ${when} · OVER the ${lineStr(line)} — UNDER can't cash`, sub: "The total has already cleared the line." };
          const room = Math.floor(cushion) + (cushion % 1 ? 1 : 0);   // runs of cushion before the line falls
          const cls = cushion >= 3 ? "hit" : cushion >= 1 ? "close" : "close";
          return { kind: "total", cls,
            head: `${runTxt} ${when} · ${cushion >= 3 ? "tracking well" : "holding"} on UNDER ${lineStr(line)}`,
            sub: `${room} ${room === 1 ? "run" : (unit === "runs" ? "runs" : unit)} of room before the line falls.` };
        }
      }
      // ---- SPREAD / MONEYLINE lean: a LIGHTER live status from the real margin only. ----
      const sc = fin ? finalScore(g) : (() => {
        const ca = g.current_actuals || {};
        if (ca.home_score != null && ca.away_score != null) return { home: Number(ca.home_score), away: Number(ca.away_score), margin: Number(ca.home_score) - Number(ca.away_score) };
        return null;
      })();
      if (!sc || sc.margin == null) return null;
      const side = String(pl.side || "");
      const backedHome = side.indexOf(g.home_abbr) >= 0 && side.indexOf(g.away_abbr) < 0;
      const backedAway = side.indexOf(g.away_abbr) >= 0 && side.indexOf(g.home_abbr) < 0;
      if (!backedHome && !backedAway) return null;
      const ab = backedHome ? g.home_abbr : g.away_abbr;
      const ourMargin = backedHome ? sc.margin : -sc.margin;   // + = our side ahead on the scoreboard
      const when = live ? liveWhenPhrase(g, gs) : "";
      if (fin) {
        // Grade the lean off the real final where we can (spread w/ line, ML off the winner).
        const r = provisionalResult(g, pl) || (pl.result || null);
        const st = r && (r.status || r);
        if (st === "hit" || st === "miss" || st === "push")
          return { kind: "lean", cls: st === "hit" ? "done-hit" : st === "miss" ? "done-miss" : "close",
            head: `Final · our ${esc(side)} lean ${st === "hit" ? "landed" : st === "miss" ? "came up short" : "pushed"}`, sub: "" };
        return null;
      }
      // LIVE lean — plain scoreboard status, no probabilities, no projection.
      const state = ourMargin > 0 ? `${ab} up ${ourMargin}` : ourMargin < 0 ? `${ab} down ${Math.abs(ourMargin)}` : "all square";
      const cls = ourMargin > 0 ? "hit" : ourMargin < 0 ? "miss" : "close";
      return { kind: "lean", cls, head: `${state} ${when} · our ${esc(side)} lean`, sub: "" };
    }
    // Render the tracking read as a glass card (mirrors the live-hit-odds treatment). The
    // honesty line is baked in: this is CONTEXT on the graded morning play, not a new pick.
    function liveTrackCard(g: any, pl: any, variant = "full") {
      const tr = liveTrackingRead(g, pl);
      if (!tr) return "";
      const live = gameState(g).kind === "live";
      const hero = variant === "hero";
      const done = tr.cls === "done-hit" || tr.cls === "done-miss";
      const dirCls = tr.cls === "hit" || tr.cls === "done-hit" ? "dir-hit" : tr.cls === "miss" || tr.cls === "done-miss" ? "dir-miss" : "dir-close";
      const kick = tr.kind === "total" ? (live ? "Tracking our pick — live" : "Our pick — graded") : (live ? "Live scoreboard read" : "Our lean — result");
      // Hero = compact at-a-glance (the honesty note + sub-line live on the full pane card below).
      return `<div class="ltrack ${dirCls}${done ? " is-done" : ""}${hero ? " ltrack-hero" : ""}" role="status">
        <div class="ltr-k">${live ? `<span class="livedot"></span>` : ""}${esc(kick)}</div>
        <div class="ltr-head">${esc(tr.head)}</div>
        ${!hero && tr.sub ? `<div class="ltr-sub">${esc(tr.sub)}</div>` : ""}
        ${!hero && live ? `<div class="ltr-note">Context on how it's going — the graded morning play is unchanged.</div>` : ""}
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
    // A small, always-legible tier legend — states what each word means so "Good vs Lean"
    // is never ambiguous. Rendered on the board and inside the detail sheet.
    function tierLegend(compact = false) {
      // The NEW five-star scale (the v4 model). Every star requires beating the real price.
      const item = (q: string, n: number, lab: string, desc: string) =>
        `<span class="tl-item q-${q}">${bStars(n)}<b>${lab}</b>${compact ? "" : `<i>${desc}</i>`}</span>`;
      return `<div class="tierlegend${compact ? " compact" : ""}">
        ${item("strong", 5, "Proven", "")}
        ${item("strong", 4, "Strong", "")}
        ${item("good", 3, "Solid", "")}
        ${item("lean", 2, "Lean", "")}
        <button class="tl-how" id="tl-how" aria-label="How picks work">How picks work →</button>
      </div>`;
    }
    // Gold = the headline plays: any winning-recipe (VALUE) play + the surest accuracy tier.
    const isGold = (pl: any) => !!pl && pl.action === "TAKE" && (pl.value_tier || pl.tier === "featured");
    // The ONE bet we surface for a game: gold first, then quality, then confidence.
    function orderedTakes(g: any, P?: any) {
      const plays = P || gamePlays(g);
      const prio: any = { total: 0, spread: 1, moneyline: 2 };
      // ALL-IN TOTALS (2026-07-07): the pick product is pregame totals only — spread/ML
      // never surface as OUR call (they remain visible as market info elsewhere).
      return MARKETS.map((mk) => plays[mk])
        .filter((p: any) => p.action === "TAKE" && p.market === "total")
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
    // SIGNED-OUT (Leon, 2026-07-25): entitlement now requires a session — the lock
    // treatment becomes the marketing pitch ("Sign in to unlock all picks"). isPremium()
    // still defaults true, so any signed-in member stays fully unlocked as before.
    const entitled = () => isSignedIn() && isPremium();
    const unlockCtaTxt = () => (isSignedIn() ? "Unlock" : "Sign in to unlock");
    const unlockPitchTxt = () => (isSignedIn() ? "Unlock today's picks" : "Sign in to unlock all picks");
    // Every locked surface routes here: signed-out → the sign-in gateway; free member → Premium.
    function openUnlock() {
      if (!isSignedIn()) { accountMode = "signin"; switchTab("account"); return; }
      switchTab("upgrade");
    }
    function pickLocked(pl: any, st: string) {
      if (!pl || entitled()) return false;
      const q = qualityOf(pl);
      if (q !== "strong" && q !== "good") return false;
      // LOCK ONLY WHAT IS STILL ACTIONABLE (Leon, 2026-07-26). A DECIDED pick has nothing
      // left to sell, so it reads in the open for everyone: graded (won/lost/pushed) AND
      // live-decided — `clinched` (already cashed) and `cooked` (the number is gone, the
      // pick can no longer land). Showing "✗ NOT LANDING" *underneath* a "SIGN IN TO
      // UNLOCK" cover was paywalling a verdict we'd already published. Only picks whose
      // outcome is genuinely open (pre-game, or in play and undecided) stay locked.
      // Passes and leans never reach here — qualityOf() is null on a PASS and "lean" on a
      // 1–2★ call, so both bail out above and read as passes to signed-out visitors.
      return !(st === "won" || st === "lost" || st === "pushed" || st === "clinched" || st === "cooked");
    }
    // ===================== VIG / +EV GATE =====================
    // A bet is only worth taking when our win probability clears the PRICE's break-even (the
    // vig-inclusive hurdle). "Right side of the line" at a bad price (e.g. 64% at -196, which
    // needs 66.2%) is a LOSING bet — we never present it as a pick.
    // Normalize a price to DECIMAL odds. The payload stores american when |n|>=100, else decimal
    // (matches fmtOdds): -196 or +120 → american; 1.62 or 2.5 → decimal.
    function priceToDecimal(price: any) {
      const n = Number(price);
      if (!isFinite(n) || n === 0) return null;
      if (n >= 100 || n <= -100) return n > 0 ? 1 + n / 100 : 1 + 100 / Math.abs(n);
      return n > 1 ? n : null;
    }
    function breakevenProb(price: any) {
      const dec = priceToDecimal(price);
      return dec ? 1 / dec : null;
    }
    // { be, p, ev, ok } for a pick, or null if we can't judge (missing price/prob → don't block).
    function pickEdge(pl: any) {
      if (!pl || pl.price == null || pl.p == null) return null;
      const dec = priceToDecimal(pl.price);
      const p = Number(pl.p);
      if (!dec || !isFinite(p)) return null;
      const be = 1 / dec;
      return { be, p, ev: p * dec - 1, ok: p > be };
    }
    // True unless we can prove the pick is below break-even (then it's not a bet — it's a pass).
    // TOTALS are the validated, value-selected edge (priced ~-110) — their `p` field is
    // a tier proxy, not a calibrated win prob, so we DON'T re-gate them here. The vig gate targets
    // the SPREAD/MONEYLINE "leans", which are the ones surfaced at heavy juice (e.g. -196 run-lines).
    function pickPlusEV(pl: any) {
      if (!pl || pl.action !== "TAKE") return true;
      if (pl.src === "v4") return true; // v4 takes already cleared the model's own +EV gate
      if (pl.market === "total") return true;
      const e = pickEdge(pl);
      return e ? e.ok : true;
    }
    // A TAKE we'd actually recommend = a real pick AND +EV at its price.
    const isBet = (pl: any) => !!(pl && pl.action === "TAKE" && pl.side && pickPlusEV(pl));
    // A real pick of ANY strength (shown on every game — even the slightest lean).
    const isPick = (pl: any) => !!(pl && pl.action === "TAKE" && pl.side);
    // ===================== THE DIAMONDEDGE PICK — ONE PER GAME =====================
    // The unified feed carries exactly ONE pick per game (pregame totals, star-rated, +EV-gated).
    // Live feed covers today/tomorrow; history covers all prior days. There is no other source.
    function v4GameFor(g: any) {
      const gid = String((g && g.game_id) || "");
      if (!gid) return null;
      // Day-payload game ids may be the bare pk OR a composite ending in "-<pk>". Match either.
      const m = gid.match(/(\d+)$/);
      const pk = m ? m[1] : gid;
      const find = (d: any) => d && (d.games || []).find((x: any) =>
        String(x.game_pk) === gid || String(x.game_pk) === pk || String(x.game_id) === gid);
      return find(betaLiveData) || find(betaData) || null;
    }
    // The single pick lives on the game as `pick`. Only the totals lane carries it; spread/ML
    // are retired, so every other market resolves to null (→ an honest PASS downstream).
    function v4CellFor(vg: any, mk: string) {
      if (mk !== "total") return null;
      return vg && vg.pick ? vg.pick : null;
    }
    // Break-even win prob implied by an American price (for a pass's plain-English reason).
    function beFromAmerican(px: any) {
      if (px == null || isNaN(Number(px))) return null;
      const a = Number(px);
      const dec = a > 0 ? 1 + a / 100 : 1 + 100 / -a;
      return dec > 0 ? 1 / dec : null;
    }
    // Map the unified pick object into the app's play shape so every existing surface renders it.
    function v4ToPlay(g: any, pk: any) {
      if (!pk) return null;
      const mk = "total";
      const ln = pk.line != null ? pk.line : pk.vegas_line;
      const take = String(pk.status || "").toUpperCase() === "PICK";
      const side = take ? `${/over/i.test(String(pk.side)) ? "OVER" : "UNDER"} ${ln != null ? lineStr(ln) : ""}`.trim() : null;
      const res = pk.result === "win" ? { status: "hit" } : pk.result === "loss" ? { status: "miss" } : pk.result === "push" ? { status: "push" } : null;
      const stars = pk.stars != null ? Number(pk.stars) : 0;
      const q = stars >= 4 ? "strong" : stars === 3 ? "good" : "lean";
      const be = pk.price != null ? beFromAmerican(pk.price) : null;
      const why: string[] = [];
      if (take && pk.our_prob != null && be != null && pk.price != null)
        why.push(`Our number gives this side about a ${(pk.our_prob * 100).toFixed(0)}% chance, and at ${fmtOdds(pk.price)} it only needs ${(be * 100).toFixed(0)}% to profit — a real edge after the price.`);
      if (take && pk.ev != null)
        why.push(`That works out to roughly ${(pk.ev >= 0 ? "+" : "")}${(pk.ev * 100).toFixed(1)}% expected value per dollar at the quoted price.`);
      // DECIMAL GRADE behind the stars = the model's own continuous 0–5 `score`, rendered to 2dp
      // on every pick; passes carry their sub-2.00 score too.
      const grade = pk.score != null ? Number(pk.score) : (take ? stars : 0);
      // A pass shim carrying the fields plainPassReason() reads (it was built for grid cells).
      const passShim = take ? null : {
        bet_type: "total", market_line: pk.vegas_line != null ? pk.vegas_line : ln, pick_line: ln,
        our_prob: pk.our_prob != null ? pk.our_prob : null, p_breakeven: be,
        per_side_price: pk.price != null ? pk.price : null, pass_reason: pk.pass_reason || "",
      };
      return {
        market: mk, action: take ? "TAKE" : "PASS",
        side: take ? side : null,
        line: ln, price: pk.price != null ? pk.price : null,
        p: pk.our_prob != null ? pk.our_prob : null,
        q, stars, star_tier: pk.star_tier, ev: pk.ev, grade,
        why, result: res, src: "v4",
        // "WHAT'S LIGHTING UP" context chips (served pick.signals) — carried through
        // defensively; may not be in the payload yet, every renderer degrades to nothing.
        signals: Array.isArray(pk.signals) ? pk.signals : null,
        v4pass: passShim,
        // provenance for the "vs Vegas + when" strip: the exact Vegas line judged + when
        vegas_line: pk.vegas_line != null ? pk.vegas_line : ln,
        lead_time: pk.lead_time || null,
        fp_utc: g.first_pitch_utc || null,
        locked: !!pk.locked, locked_at_utc: pk.locked_at_utc || null,
        suggested_units: pk.suggested_units != null ? pk.suggested_units : null,
      };
    }
    // ═══════════ SPREAD STREAM — run lines RETURN (Leon, 2026-07-26; live 2026-07-27) ═══════════
    // The unified feed now carries games[].spread — a NEW, separately-graded run-line stream.
    // HONESTY CONTRACT (mirrors the payload): the stream starts 0-0-0 at its activation date and
    // is graded in public from day one; in lean_only mode every call is an HONEST LEAN — clearly
    // labeled, never a bet, never above 1★ (sim mode, if it ever certifies in, caps at 2★). The
    // TOTALS headline pick is UNCHANGED — this renders as a subordinate labeled row, never a
    // second headline. Read defensively: absent/malformed ⇒ nothing renders anywhere.
    function spreadBlockFor(g: any) {
      const direct = g && g.spread && typeof g.spread === "object" ? g.spread : null;
      if (direct) return direct;
      const vg = v4GameFor(g);
      return vg && vg.spread && typeof vg.spread === "object" ? vg.spread : null;
    }
    // "PIT -1.5" — the chosen side's own point, named by team abbr (never bare home/away).
    function spreadCallTxt(g: any, sp: any) {
      if (!sp || !sp.side) return "";
      const ab = sp.side === "home"
        ? (g && g.home_abbr) || mlbAbbr(sp.side_team)
        : sp.side === "away" ? (g && g.away_abbr) || mlbAbbr(sp.side_team) : "";
      const ln = sp.line != null && isFinite(Number(sp.line)) ? sgn(Number(sp.line)) : "";
      return [ab || String(sp.side).toUpperCase(), ln].filter(Boolean).join(" ");
    }
    // ONE quiet subordinate row on the game tile. LEAN = stated read, explicitly not a bet;
    // PICK (sim mode only, capped stars) shows its stars; PASS/no block renders nothing.
    function spreadRowTile(g: any) {
      const sp = spreadBlockFor(g);
      if (!sp || !sp.side || (sp.status !== "LEAN" && sp.status !== "PICK")) return "";
      const call = spreadCallTxt(g, sp);
      if (!call) return "";
      const isBet = sp.status === "PICK" && sp.is_bet === true;
      const res = sp.result === "win" ? `<span class="spr-res won">${isBet ? "WON" : "lean ✓"}</span>`
        : sp.result === "loss" ? `<span class="spr-res lost">${isBet ? "LOST" : "lean ✗"}</span>`
        : sp.result === "push" ? `<span class="spr-res pushed">PUSH</span>` : "";
      // The record itself carries the honesty (Leon, 2026-07-30): the timid "not a bet /
      // tracking" chrome is gone — the stream's own graded W–L rides the row instead.
      const spRec = (() => { const r = strategyRecordFor("spread_stream"); const lv = r && r.live; return lv ? `${lv.win}–${lv.loss}${lv.push ? `–${lv.push}` : ""}` : ""; })();
      return `<div class="sprow ${isBet ? "is-pick" : "is-lean"}" title="${esc("Run-line read — graded in public from day one")}">
        <span class="spr-k">Run line</span>
        <span class="spr-call"><b>${esc(call)}</b>${sp.price != null ? `<i class="spr-px">${fmtOdds(sp.price)}</i>` : ""}</span>
        ${isBet ? `<span class="spr-q">${bStars(sp.stars)}</span>` : `<span class="spr-leanlab">Lean${spRec ? ` · ${spRec}` : ""}</span>`}
        ${sp.locked ? `<span class="spr-lk" title="Locked at first pitch — graded at exactly this line">${lockSvg}</span>` : ""}
        ${res}
      </div>`;
    }
    // "vs Vegas O/U 8.5 · picked 9:14 AM (T-3h)" — the Vegas number we judged, clearly
    // stated, plus a small timestamp of when the pick was FIRST made (that wall's clock).
    const LEAD_MS: any = { "T-24h": 864e5, "T-12h": 432e5, "T-6h": 216e5, "T-3h": 108e5, "T-1h": 36e5 };
    // ELEGANCE PASS (Leon, 2026-07-26): same four facts, one quiet typographic line.
    // Was: "vs Vegas O/U 8.5 · picked 9:14 AM (T-3h) · 🔒 locked — judged at this line" —
    // a sentence competing with the pick above it. Now the frozen state leads as a real
    // lock GLYPH (no emoji) and the provenance follows as tabular micro-copy. Nothing is
    // dropped: the Vegas number we judged, the clock, the wall, and the freeze all stay.
    function pickMadeMeta(pl: any) {
      if (!pl || pl.src !== "v4") return "";
      const bits: string[] = [];
      if (pl.vegas_line != null) bits.push(`Vegas ${lineStr(pl.vegas_line)}`);
      if (pl.lead_time && pl.fp_utc && LEAD_MS[pl.lead_time]) {
        const t = new Date(new Date(pl.fp_utc).getTime() - LEAD_MS[pl.lead_time]);
        if (!isNaN(t.getTime())) bits.push(`picked ${t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`);
        bits.push(pl.lead_time);
      } else if (pl.lead_time) bits.push(`picked at ${pl.lead_time}`);
      // once first pitch passes, the pick and its judged line are FROZEN — say so.
      const frozen = !!(pl.fp_utc && Date.now() >= new Date(pl.fp_utc).getTime());
      if (!bits.length && !frozen) return "";
      return `<div class="pk-made${frozen ? " frozen" : ""}"${frozen ? ` title="Locked before first pitch — graded at exactly this line"` : ""}>${frozen ? `${lockSvg}<span class="pkm-lk">locked at this line</span>` : ""}${bits.length ? `<span class="pkm-b">${esc(bits.join(" · "))}</span>` : ""}</div>`;
    }
    // ===================== "WHAT'S LIGHTING UP" — context signals on a pick =====================
    // The payload carries pick.signals = [{text, dir}] — 1-3 short plain-English context
    // chips ("Both starters getting hit hard"). PURELY contextual, never causal. Read
    // DEFENSIVELY: the field may not be served yet — absent/malformed ⇒ nothing renders.
    function pickSignalList(pl: any): { text: string; dir: string }[] {
      const raw = pl && Array.isArray(pl.signals) ? pl.signals : [];
      const out: { text: string; dir: string }[] = [];
      raw.forEach((s: any) => {
        if (out.length >= 3 || s == null) return;
        const text = String(typeof s === "string" ? s : (s.text != null ? s.text : "")).trim();
        if (!text) return;
        const d = String((s && s.dir) || "").toLowerCase();
        const dir = /over|up|hot|pos/.test(d) ? "up" : /under|down|cold|neg/.test(d) ? "down" : "flat";
        out.push({ text, dir });
      });
      return out;
    }
    // Tile row: ONE compact muted line under the pick, · separated, dir-tinted subtly.
    function signalRow(pl: any) {
      const sigs = pickSignalList(pl);
      if (!sigs.length) return "";
      return `<div class="ps-signals">${sigs.map((s) => `<span class="sg ${s.dir}">${esc(s.text)}</span>`).join(`<i class="sg-sep" aria-hidden="true">·</i>`)}</div>`;
    }
    // Detail Preview: the slightly fuller list + the honest microcopy.
    function signalBlock(pl: any) {
      const sigs = pickSignalList(pl);
      if (!sigs.length) return "";
      return `<div class="sigcard">
        <div class="sig-k">What's lighting up</div>
        ${sigs.map((s) => `<div class="sig-row ${s.dir}"><span class="sig-dot" aria-hidden="true"></span><span class="sig-t">${esc(s.text)}</span></div>`).join("")}
        <div class="sig-note">Context signals, not causal attribution.</div>
      </div>`;
    }
    // ═══════════ STRATEGY STREAMS — every rule-set's take, and its own record ═══════════
    // Reads the payload's `strategies_spec`, per-game `games[].strategies[]`, and
    // `record.by_strategy`. All THREE are optional: absent/malformed ⇒ readers return []
    // and every renderer returns "", so nothing about the app changes without them.
    //
    // THE ONE RULE THAT MATTERS HERE — LIVE ≠ BACKTEST.
    // Each by_strategy entry's TOP-LEVEL n/W-L-P/roi is its LIVE-SERVED record from its own
    // activation date. Reconstructed / walk-forward / would-have measurements live in
    // `backtest[]`, and `combined_view` restates the union ONLY because the older published
    // blocks (record.overall) report it — the payload itself labels it "NOT a live record".
    // So: the live number is the number. Backtests render secondary, labelled, and are never
    // summed into it. combined_view is a reconciliation footnote, never a headline.
    //
    // Status vocabulary is PICK | PASS | NO_VIEW. There is NO "LEAN" status: a lean is a PASS
    // that still carries a side/line, and it renders as exactly that — the model's read, with
    // the existing "Model lean — not an official pick" wording.
    // A PASS can carry a graded `result`, but we deliberately do NOT badge it W/L: we did not
    // bet it, and a green WON on a pass is precisely the hindsight-shopping bait this panel
    // exists to prevent.
    const STRAT_STATUS = (s: any) => {
      const t = String(s == null ? "" : s).toUpperCase();
      return t === "PICK" ? "PICK" : t === "NO_VIEW" || t === "NOVIEW" ? "NO_VIEW" : "PASS";
    };
    // Machine codes ("ev_gate", "junk_cell") never reach a reader; real phrases ("Strong",
    // "Priced out — no value at the real price") pass through untouched.
    function humanNote(raw: any) {
      const t = String(raw == null ? "" : raw).trim();
      if (!t) return "";
      if (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(t)) return "";
      return t;
    }
    // The spec block, from whichever loaded feed carries it.
    function strategiesSpec() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        const sp = d && (d as any).strategies_spec;
        if (sp && typeof sp === "object") return sp;
      }
      return null;
    }
    function normStrategy(s: any) {
      if (!s || typeof s !== "object") return null;
      const key = String(s.key != null ? s.key : (s.id != null ? s.id : "")).trim();
      if (!key) return null;
      const sideRaw = String(s.side == null ? "" : s.side).trim();
      const status = STRAT_STATUS(s.status);
      return {
        key,
        label: String(s.label || key).trim() || key,
        status,
        side: sideRaw,
        // spread stream: the one non-totals entry — carries its market + the
        // named team so a run-line side never renders as a bare "HOME"
        market: String(s.market == null ? "" : s.market).trim(),
        side_team: String(s.side_team == null ? "" : s.side_team).trim(),
        // simulator: the physics-model voice carries its own P(over) + the
        // market's, so the row can show the two numbers side by side
        sim_p_over: _fin(s.sim_p_over),
        sim_p_over_market: _fin(s.sim_p_over_market),
        sim_median: _fin(s.sim_median),
        dir: /under/i.test(sideRaw) ? "under" : /over/i.test(sideRaw) ? "over" : "",
        line: _fin(s.line),
        vegas_line: _fin(s.vegas_line),
        price: _fin(s.price),
        stars: s.stars == null || !isFinite(Number(s.stars)) ? null : Math.max(0, Math.min(5, Math.round(Number(s.stars)))),
        score: _fin(s.score),
        // only a PICK carries a result onto the surface (see the note above)
        result: status === "PICK" && /^(win|loss|push)$/i.test(String(s.result || "")) ? String(s.result).toLowerCase() : null,
        // A PICK's `reason` is often just its tier word ("Strong"), which the stars already
        // say — drop it there so the row doesn't carry a redundant one-word paragraph. On a
        // PASS or a NO_VIEW the reason IS the point, so it always stays.
        reason: (() => {
          const t = humanNote(s.reason);
          if (status === "PICK" && !/\s/.test(t)) return "";   // "Strong" / "Elite" — the stars already say it
          return t;
        })(),
        lead: String(s.lead_time == null ? "" : s.lead_time).trim(),
        headline: s.is_headline === true,
        servedSrc: s.is_served_source === true,
        // a PASS that still carries a side IS the model's lean on the game
        lean: status === "PASS" && !!sideRaw,
      };
    }
    // Every stream's take on ONE game. Accepts a board game (looks up the unified game) or a
    // unified/beta game object directly. Order comes from strategies_spec.order (the payload's
    // own display order), with the headline pinned first — never re-ranked by who looks best.
    function gameStrategies(g: any) {
      if (!g) return [];
      const src = Array.isArray(g.strategies) ? g : (v4GameFor(g) || g);
      const raw = Array.isArray(src.strategies) ? src.strategies : null;
      if (!Array.isArray(raw) || !raw.length) return [];
      const out: any[] = [];
      const seen: any = {};
      raw.forEach((s: any) => { const n = normStrategy(s); if (n && !seen[n.key]) { seen[n.key] = 1; out.push(n); } });
      const spec = strategiesSpec();
      const order: string[] = Array.isArray(spec && spec.order) ? spec.order : [];
      const idx = (k: string) => { const i = order.indexOf(k); return i < 0 ? 999 : i; };
      out.sort((a, b) => (b.headline ? 1 : 0) - (a.headline ? 1 : 0) || idx(a.key) - idx(b.key));
      return out;
    }
    // "OVER 8.5" from whatever shape the side/line arrived in.
    function stratCall(s: any) {
      if (!s) return "—";
      const raw = String(s.side || "").trim();
      if (!raw && s.line == null) return "—";
      if (/\d/.test(raw)) return raw.toUpperCase();
      // run-line entry: name the team + its own signed point ("PIT -1.5"),
      // never a bare "HOME 1.5"
      if (s.market === "spread" || /^(home|away)$/i.test(raw)) {
        const ab = mlbAbbr(s.side_team) || raw.toUpperCase();
        const ln = s.line != null && isFinite(Number(s.line)) ? sgn(Number(s.line)) : "";
        return [ab, ln].filter(Boolean).join(" ") || "—";
      }
      const d = s.dir ? s.dir.toUpperCase() : raw.toUpperCase();
      const ln = s.line != null ? lineStr(s.line) : "";
      return [d, ln].filter(Boolean).join(" ") || "—";
    }
    const stratArrow = (s: any) => (s.dir === "over" ? "▲" : s.dir === "under" ? "▼" : "•");
    // ---- record.by_strategy ----
    // One block → { n, win, loss, push, hit, roi, units } (or null when there is nothing).
    function stratBlock(r: any) {
      if (!r || typeof r !== "object") return null;
      const n = Math.max(0, Math.round(Number(r.n || 0)) || 0);
      const win = Math.max(0, Math.round(Number(r.win || 0)) || 0);
      const loss = Math.max(0, Math.round(Number(r.loss || 0)) || 0);
      const push = Math.max(0, Math.round(Number(r.push || 0)) || 0);
      if (!n && !win && !loss && !push) return null;
      return {
        n: n || win + loss + push, win, loss, push,
        hit: _fin(r.hit_rate), roi: _fin(r.roi),
        units: _fin(r.units_flat != null ? r.units_flat : r.units),
        first: String(r.first_graded_date || "").slice(0, 10),
        last: String(r.last_graded_date || "").slice(0, 10),
      };
    }
    function strategyRecords(d: any) {
      const bs = d && d.record && d.record.by_strategy;
      if (!bs || typeof bs !== "object" || Array.isArray(bs)) return [];
      const spec = strategiesSpec();
      const order: string[] = Array.isArray(spec && spec.order) ? spec.order : [];
      const rows: any[] = [];
      Object.keys(bs).forEach((k) => {
        const r = bs[k];
        if (!r || typeof r !== "object") return;
        // TOP-LEVEL = the LIVE-SERVED record. This is the primary number, always.
        const live = stratBlock(r);
        // evidence_split = how that live number was actually observed (served on the board,
        // logged forward in the paper ledger, as-of-wall reconstruction of a live day…).
        const modes: any[] = [];
        const es = r.evidence_split;
        if (es && typeof es === "object") Object.keys(es).forEach((m) => {
          const b = stratBlock(es[m]);
          if (b) modes.push({ ...b, mode: m, kind: String((es[m] || {}).kind || "live").toLowerCase(), what: humanNote((es[m] || {}).what) });
        });
        modes.sort((a, b) => b.n - a.n);
        // backtest[] = explicitly NOT live. Each block carries its own label from the payload.
        const backtests: any[] = [];
        (Array.isArray(r.backtest) ? r.backtest : []).forEach((b: any) => {
          const bl = stratBlock(b);
          if (bl) backtests.push({ ...bl, kind: String(b.kind || "backtest"), label: humanNote(b.label) });
        });
        // combined_view = the union the OLDER published blocks report. Footnote only.
        const cv = stratBlock(r.combined_view);
        const combined = cv ? { ...cv, label: humanNote((r.combined_view || {}).label) } : null;
        rows.push({
          key: k,
          label: String(r.label || k).trim() || k,
          headline: r.is_headline === true || (spec && spec.headline_key === k),
          live, modes, backtests, combined,
          what: humanNote(r.what), basis: humanNote(r.basis), note: humanNote(r.note),
          activation: String(r.activation_date == null ? "" : r.activation_date).slice(0, 10),
          // spread stream honesty stamps (absent on every totals stream):
          // a NEW badge + the graded-lean-ledger framing when it isn't bets
          market: String(r.market == null ? "" : r.market).trim(),
          isNew: r.is_new_stream === true,
          // strip the timid "tracking, not bets" phrasing from served tags (Leon, 2026-07-30):
          // the graded record next to it carries the honesty
          newTag: (humanNote(r.new_tag) || "NEW — graded from day one").replace(/\s*[—–-]*\s*tracking, not bets\.?/i, "").trim(),
          leanLedger: r.is_new_stream === true && r.is_betting_record === false,
        });
      });
      // NEUTRAL, STABLE ORDER: the payload's own spec order, then anything unknown by sample
      // size and alphabetically. Explicitly NOT by ROI — a leaderboard buries the losers.
      const idx = (k: string) => { const i = order.indexOf(k); return i < 0 ? 999 : i; };
      rows.sort((a, b) => idx(a.key) - idx(b.key)
        || ((b.live ? b.live.n : 0) - (a.live ? a.live.n : 0))
        || String(a.label).localeCompare(String(b.label)));
      return rows;
    }
    // The LIVE record for ONE stream, from whichever feed has landed.
    function strategyRecordFor(key: any) {
      const k = String(key || "");
      if (!k) return null;
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        const bs = d && d.record && d.record.by_strategy;
        if (bs && typeof bs === "object" && bs[k]) {
          const hit = strategyRecords(d).find((r: any) => r.key === k);
          if (hit) return hit;
        }
      }
      return null;
    }
    // The headline stream's record — what the Insights hero must lead with.
    function headlineStrategyRecord(d: any) {
      const rows = strategyRecords(d);
      if (!rows.length) return null;
      const spec = strategiesSpec();
      const hk = spec && spec.headline_key ? String(spec.headline_key) : "";
      return rows.find((r: any) => r.key === hk) || rows.find((r: any) => r.headline) || null;
    }
    const stratDateTxt = (s: any) => {
      const t = String(s || "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return "";
      const dd = new Date(t + "T12:00:00");
      return isNaN(dd.getTime()) ? "" : dd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };
    const stratWL = (b: any) => (b ? `${b.win}–${b.loss}${b.push ? `–${b.push}` : ""}` : "—");
    const stratPct = (v: any) => (v == null ? "—" : `${(v * 100).toFixed(1)}%`);
    const stratRoi = (v: any) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`);
    const stratUnits = (v: any) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}u`);
    // ═══════════════════ THE ANALYST DESK — four named models on every game ═══════════════════
    // The home screen is THE ANALYST DESK: four named analysts (VEGA · ATLAS · NOVA · SCOUT)
    // each file an independent call on every game, the CONSENSUS is the headline, and
    // DiamondEdge — the desk chief — issues the verdict: PLAY / LEAN / AVOID. Passing on a
    // split desk is the product's discipline, styled proudly. Every reader below is FULLY
    // DEFENSIVE: the payload fields (games[].analysts / games[].consensus /
    // games[].diamondedge / record.analysts / record.consensus_history) may not be served
    // yet — absent/malformed ⇒ readers return []/null and every surface degrades to the
    // existing layout, byte for byte.
    const DESK_ORDER = ["vega", "atlas", "nova", "scout"];
    const DESK_CAST: any = {
      vega: { name: "Vega", title: "The Market Reader", short: "Reads the sharpest books", method: "Reads the sharpest books on the planet and prices every number against where the smart money already sits." },
      atlas: { name: "Atlas", title: "The Physicist", short: "Simulates every game 20,000 times", method: "Rebuilds the game from first principles — then simulates it 20,000 times and reads the distribution." },
      nova: { name: "Nova", title: "The Quant", short: "Patterns across thousands of games", method: "Hunts repeatable patterns across thousands of graded games and only speaks when history rhymes." },
      scout: { name: "Scout", title: "The Traditionalist", short: "Matchups, form and parks", method: "Works the slate the old way — starters, recent form, ballparks and weather, one matchup at a time." },
    };
    function deskGlyph(key: string, sz = 14) {
      const common = `viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;
      const body = key === "vega"
        ? `<path d="M3 16l4.5-6 3.4 3.4L16 6.6 21 12"/><path d="M21 6.6v5.4h-5.4"/>`
        : key === "atlas"
        ? `<circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9" ry="3.8"/><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(64 12 12)"/>`
        : key === "nova"
        ? `<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3.2 3.2M14.8 14.8L18 18M18 6l-3.2 3.2M9.2 14.8L6 18"/>`
        : `<circle cx="12" cy="12" r="8.6"/><path d="M15.4 8.6l-2.1 4.7-4.7 2.1 2.1-4.7z"/>`;
      return `<svg ${common}>${body}</svg>`;
    }
    // one analyst row, whatever shape it arrived in → a stable object (or null)
    function normAnalystRow(a: any) {
      if (!a || typeof a !== "object") return null;
      const key = String(a.key == null ? "" : a.key).toLowerCase().trim();
      if (!key) return null;
      const cast = DESK_CAST[key] || null;
      const sideRaw = String(a.side == null ? "" : a.side).trim();
      const dir = /under/i.test(sideRaw) ? "under" : /over/i.test(sideRaw) ? "over" : "";
      const pOver = _fin(a.p_over);
      let conv = _fin(a.conviction);
      if (conv != null && conv > 1) conv = conv / 100; // tolerate 0-100 scales
      if (conv == null && pOver != null && dir) conv = dir === "under" ? 1 - pOver : pOver;
      // served name may be "VEGA · The Market Reader" — split it into name + title
      const nmRaw = String(a.name || (cast && cast.name) || key).trim();
      const nmParts = nmRaw.split(/\s*[·|]\s*/);
      return {
        key, cast,
        name: (nmParts[0] || nmRaw).trim(),
        title: (nmParts.length > 1 ? nmParts.slice(1).join(" · ").trim() : "") || (cast && cast.title) || "",
        persona: humanNote(a.persona_line),
        // the analyst's PERSONA-VOICE take on THIS game (backend `take`) — the line the
        // desk actually says about the matchup. Absent ⇒ "" and every surface degrades.
        take: humanNote(a.take != null ? a.take : a.take_line),
        side: sideRaw, dir,
        p_over: pOver, conv,
        locked: a.locked === true,
        wall: String(a.wall == null ? "" : a.wall).trim(),
        line: _fin(a.line),
        result: /^(win|loss|push)$/i.test(String(a.result || "")) ? String(a.result).toLowerCase() : null,
      };
    }
    // Every analyst's call on ONE game (board game or unified game), in cast order. [] when unserved.
    function deskAnalysts(g: any): any[] {
      if (!g) return [];
      const src = Array.isArray(g.analysts) ? g : (v4GameFor(g) || g);
      const raw = Array.isArray(src.analysts) ? src.analysts : null;
      if (!raw || !raw.length) return [];
      const out: any[] = []; const seen: any = {};
      raw.forEach((a: any) => { const n = normAnalystRow(a); if (n && !seen[n.key]) { seen[n.key] = 1; out.push(n); } });
      const idx = (k: string) => { const i = DESK_ORDER.indexOf(k); return i < 0 ? 99 : i; };
      out.sort((a, b) => idx(a.key) - idx(b.key));
      return out;
    }
    const CONS_STATES = ["UNANIMOUS", "MAJORITY", "SPLIT", "PENDING"];
    function normConsensusBlock(c: any) {
      if (!c || typeof c !== "object") return null;
      const state = String(c.state || "").toUpperCase().trim();
      if (CONS_STATES.indexOf(state) < 0) return null;
      // totals blocks count n_over/n_under; the run-line dimension counts n_home/n_away
      const nA = Math.max(0, Math.round(Number(c.n_over != null ? c.n_over : c.n_home) || 0));
      const nB = Math.max(0, Math.round(Number(c.n_under != null ? c.n_under : c.n_away) || 0));
      return {
        state,
        side: String(c.majority_side == null ? "" : c.majority_side).trim(),
        nOver: nA,
        nUnder: nB,
      };
    }
    // The consensus on a game: served games[].consensus first; derived from the analyst
    // rows when the block is missing but the calls are there. Null when there is no desk.
    function deskConsensus(g: any) {
      if (!g) return null;
      const src = (g.consensus && typeof g.consensus === "object") ? g : (v4GameFor(g) || g);
      const served = normConsensusBlock(src && src.consensus);
      const spread = normConsensusBlock(src && src.consensus && (src.consensus as any).spread);
      if (served) return { ...served, spread };
      const ans = deskAnalysts(g);
      if (!ans.length) return null;
      const nO = ans.filter((a) => a.dir === "over").length;
      const nU = ans.filter((a) => a.dir === "under").length;
      if (!nO && !nU) return { state: "PENDING", side: "", nOver: 0, nUnder: 0, spread };
      const state = (!nO || !nU) ? "UNANIMOUS" : nO === nU ? "SPLIT" : "MAJORITY";
      return { state, side: nO >= nU ? "over" : "under", nOver: nO, nUnder: nU, spread };
    }
    // The desk chief's block: action PLAY|LEAN|AVOID + rationale, the run-line second read,
    // and ATLAS's predicted final score. Null when unserved.
    function deskChief(g: any) {
      if (!g) return null;
      const src = (g.diamondedge && typeof g.diamondedge === "object") ? g.diamondedge
        : (() => { const vg = v4GameFor(g); return vg && vg.diamondedge && typeof vg.diamondedge === "object" ? vg.diamondedge : null; })();
      if (!src) return null;
      const act = String(src.action || "").toUpperCase().trim();
      const action = act === "PLAY" || act === "LEAN" || act === "AVOID" ? act : null;
      // spread_call may carry an explicit NO-CALL (side null + a rationale) — that's a real
      // read ("the margin voices disagree"), rendered honestly, not dropped.
      const scRaw = src.spread_call && typeof src.spread_call === "object" ? src.spread_call : null;
      const sc = scRaw && (scRaw.side || humanNote(scRaw.rationale_line))
        ? { side: scRaw.side ? String(scRaw.side).trim() : "", side_team: String(scRaw.side_team || "").trim(), line: _fin(scRaw.line), rationale: humanNote(scRaw.rationale_line) }
        : null;
      const psRaw = src.predicted_score && typeof src.predicted_score === "object" ? src.predicted_score : null;
      const pred = psRaw && _fin(psRaw.away) != null && _fin(psRaw.home) != null
        ? { away: Number(psRaw.away), home: Number(psRaw.home), source: String(psRaw.source || "ATLAS").toUpperCase() }
        : null;
      if (!action && !sc && !pred) return null;
      return { action, rationale: humanNote(src.rationale_line), spread: sc, pred, raw: src };
    }
    // "4–0 OVER · UNANIMOUS" — the consensus headline. Locked mode keeps the count + state
    // but redacts the side (the side is the product).
    function consensusBanner(g: any, locked = false, size = "tile") {
      const c = deskConsensus(g);
      if (!c) return "";
      const cls = c.state === "UNANIMOUS" ? "unan" : c.state === "MAJORITY" ? "maj" : c.state === "SPLIT" ? "split" : "pend";
      const hi = Math.max(c.nOver, c.nUnder), lo = Math.min(c.nOver, c.nUnder);
      const sideWord = locked ? "" : String(c.side || "").toUpperCase();
      let txt = "";
      if (c.state === "PENDING") txt = "DESK CONVENES AT THE WALL";
      else if (c.state === "SPLIT") txt = `SPLIT ${c.nOver}–${c.nUnder}`;
      else txt = `${hi}–${lo}${sideWord ? ` ${sideWord}` : ""} · ${c.state}`;
      const sub = c.spread && !locked && c.spread.state !== "PENDING"
        ? `<i class="cons-sub">RL ${c.spread.state === "SPLIT" ? `split ${c.spread.nOver}–${c.spread.nUnder}` : `${Math.max(c.spread.nOver, c.spread.nUnder)}–${Math.min(c.spread.nOver, c.spread.nUnder)} ${esc(String(c.spread.side || "").toUpperCase())}`}</i>`
        : "";
      const sizeCls = size === "mini" ? " cons-mini" : size === "wide" ? " cons-wide" : "";
      return `<span class="cons ${cls}${sizeCls}"><i class="cons-dot" aria-hidden="true"></i>${esc(txt)}${sub}</span>`;
    }
    // "SIM SAYS 5–3" — ATLAS's most likely final, a concrete scoreline chip.
    function simSaysChip(g: any, size = "tile") {
      const chief = deskChief(g);
      const p = chief && chief.pred;
      if (!p) return "";
      return `<span class="simsays${size === "big" ? " ss-big" : ""}" title="${esc(p.source)} — most likely final score from 20,000 simulations"><span class="ss-g an-atlas">${deskGlyph("atlas", 11)}</span>SIM SAYS ${num(p.away, 0)}–${num(p.home, 0)}</span>`;
    }
    // The chief's run-line second read (replaces the generic spread row when served).
    function chiefSpreadLine(g: any, chief: any) {
      const sp = chief && chief.spread;
      if (!sp) return "";
      // explicit no-call: the desk's margin voices disagree — say so, don't go quiet
      if (!sp.side) {
        return sp.rationale ? `<div class="ch-spread"><span class="chs-k">Run line</span><b class="nocall">No call</b><span class="chs-why">${esc(sp.rationale)}</span></div>` : "";
      }
      const ab = sp.side === "home" ? (g && g.home_abbr) || mlbAbbr(sp.side_team) || "HOME"
        : sp.side === "away" ? (g && g.away_abbr) || mlbAbbr(sp.side_team) || "AWAY" : String(sp.side).toUpperCase();
      const ln = sp.line != null && isFinite(Number(sp.line)) ? sgn(Number(sp.line)) : "";
      const call = [ab, ln].filter(Boolean).join(" ");
      if (!call) return "";
      return `<div class="ch-spread"><span class="chs-k">Run line</span><b>${esc(call)}</b>${sp.rationale ? `<span class="chs-why">${esc(sp.rationale)}</span>` : ""}</div>`;
    }
    // The verdict strip: ◆ PLAY (bold) / ◆ LEAN / ◆ WE PASS (the pass styled proudly —
    // passing on a split desk IS the discipline being sold).
    function chiefStrip(g: any, chief: any) {
      if (!chief || !chief.action) return "";
      const cls = chief.action === "PLAY" ? "ch-play" : chief.action === "LEAN" ? "ch-lean" : "ch-avoid";
      const word = chief.action === "AVOID" ? "WE PASS" : chief.action;
      const rat = chief.rationale || (chief.action === "AVOID" ? "The desk is split — we pass." : "");
      return `<div class="chief ${cls}"><span class="ch-act"><i class="ch-dia" aria-hidden="true">◆</i>${word}</span>${rat ? `<span class="ch-rat">${esc(rat)}</span>` : ""}</div>`;
    }
    // The four calls as one compact row (glyph · name · side · conviction). Tap a cell →
    // that analyst's card. Locked picks redact the sides (crisp dots), never the cast.
    function deskChipRow(g: any, locked = false, interactive = true) {
      const ans = deskAnalysts(g);
      if (!ans.length) return "";
      const cells = ans.map((a) => {
        const hide = locked; // a.locked = frozen at its wall (provenance), never a redaction
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        const arrow = a.dir === "over" ? "▲" : a.dir === "under" ? "▼" : "•";
        const sideTxt = a.dir ? a.dir.toUpperCase() : (a.side ? esc(a.side.toUpperCase()) : "—");
        const call = hide
          ? `<span class="dsk-dots" aria-hidden="true">●●</span>`
          : a.side
            ? `<span class="dsk-side ${dirCls}">${arrow} ${sideTxt}</span>`
            : `<span class="dsk-side none">—</span>`;
        const conv = !hide && a.conv != null ? `<span class="dsk-conv">${Math.round(a.conv * 100)}%</span>` : "";
        // conviction as LIGHT: a hairline meter in the analyst's own accent under the call
        const meter = !hide && a.conv != null
          ? `<span class="dsk-meter" aria-hidden="true"><i style="width:${Math.max(6, Math.min(100, a.conv * 100)).toFixed(0)}%"></i></span>` : "";
        const tag = interactive ? "button" : "span";
        return `<${tag} class="dsk-cell an-${esc(a.key)}"${interactive ? ` data-an="${esc(a.key)}" aria-label="${esc(a.name)} — ${esc(a.title || "analyst")}${hide ? "" : a.side ? `, ${sideTxt}` : ", no call yet"}"` : ""}>
          <span class="dsk-id">${deskGlyph(a.key, 12)}<b>${esc(a.name)}</b></span><span class="dsk-callrow">${call}${conv}</span>${meter}</${tag}>`;
      }).join("");
      return `<div class="dsk-row">${cells}</div>`;
    }
    // The four VOICES on a matchup panel, folded behind one tap: the chief's rationale is
    // the primary read on the tile; expanding gives each analyst's persona-voice take on
    // THIS game. Renders only when at least one served take exists (and never on a locked
    // pick — the takes argue a side).
    function deskVoicesFold(g: any, locked = false) {
      if (locked) return "";
      const voiced = deskAnalysts(g).filter((a: any) => a.take);
      if (!voiced.length) return "";
      const rows = voiced.map((a: any) => `<div class="dskv an-${esc(a.key)}" data-an="${esc(a.key)}" role="button" tabindex="0">
          <span class="dskv-id">${deskGlyph(a.key, 12)}<b>${esc(a.name)}</b>${a.dir ? `<i class="dskv-dir ${a.dir === "over" ? "ou-over" : "ou-under"}">${a.dir === "over" ? "▲" : "▼"}</i>` : ""}</span>
          <p class="dskv-say">“${esc(a.take)}”</p>
        </div>`).join("");
      return `<details class="dsk-voices">
        <summary><span class="dskv-k">◆ Hear the desk</span><span class="dskv-sum">${voiced.length} voice${voiced.length === 1 ? "" : "s"} on this game</span><span class="sgc-caret" aria-hidden="true">›</span></summary>
        <div class="dskv-rows">${rows}</div>
      </details>`;
    }
    // THE STAR TAKE — the desk's loudest voice on this game, promoted to a HEADLINE quote
    // (featured / lead cards). The highest-conviction analyst with a served take speaks in
    // display type; the other three ride as glyph chips. Locked picks render nothing (a
    // quote argues the side). "" when no takes are served — every surface degrades.
    function deskStarTake(g: any, locked = false) {
      if (locked) return "";
      const voiced = deskAnalysts(g).filter((a: any) => a.take);
      if (!voiced.length) return "";
      const star = voiced.slice().sort((x: any, y: any) => ((y.conv != null ? y.conv : 0) - (x.conv != null ? x.conv : 0)))[0];
      const dirCls = star.dir === "over" ? "ou-over" : star.dir === "under" ? "ou-under" : "";
      return `<blockquote class="startake an-${esc(star.key)}" data-an="${esc(star.key)}" role="button" tabindex="0" aria-label="${esc(star.name)} — hear the desk">
        <p class="stk-quote">“${esc(star.take)}”</p>
        <footer class="stk-by">
          <span class="stk-id">${deskGlyph(star.key, 14)}<b>${esc(star.name)}</b><i>${esc(star.title || "")}</i></span>
          ${star.dir ? `<span class="stk-dir ${dirCls}">${star.dir === "over" ? "▲ OVER" : "▼ UNDER"}${star.conv != null ? ` · ${Math.round(star.conv * 100)}%` : ""}</span>` : ""}
        </footer>
      </blockquote>`;
    }
    // The whole desk block for a game tile: consensus headline · sim score · the four calls ·
    // the chief's verdict (+ run-line read) · the four voices behind one tap. "" when the
    // desk isn't served for this game.
    function deskBlockTile(g: any, locked = false) {
      const ans = deskAnalysts(g);
      if (!ans.length) return "";
      const chief = deskChief(g);
      return `<div class="deskblk">
        <div class="dsk-toprow">${consensusBanner(g, locked)}${simSaysChip(g)}</div>
        ${deskChipRow(g, locked)}
        ${chiefStrip(g, chief)}
        ${chiefSpreadLine(g, chief)}
        ${deskVoicesFold(g, locked)}
      </div>`;
    }
    // ---- record.analysts → the standings ----
    function deskRecordRows() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        let ra = d && (d as any).record && (d as any).record.analysts;
        if (!ra || typeof ra !== "object" || Array.isArray(ra)) continue;
        // served shape is { order:[...], records:{key:{...}}, note } — a flat {key:{...}}
        // map is accepted too
        if (ra.records && typeof ra.records === "object") ra = ra.records;
        const rows: any[] = [];
        Object.keys(ra).forEach((k) => {
          const r = ra[k];
          if (!r || typeof r !== "object") return;
          const key = String(k).toLowerCase();
          if (key === "order" || key === "note") return;
          const cast = DESK_CAST[key] || null;
          const win = Math.max(0, Math.round(Number(r.win != null ? r.win : r.wins) || 0));
          const loss = Math.max(0, Math.round(Number(r.loss != null ? r.loss : r.losses) || 0));
          const push = Math.max(0, Math.round(Number(r.push != null ? r.push : r.pushes) || 0));
          // last10 arrives as "W-W-L-P-…" (string) or an array of marks/objects
          const l10src = r.last10 != null ? r.last10 : (r.last_10 != null ? r.last_10 : r.form);
          const l10raw = Array.isArray(l10src) ? l10src : typeof l10src === "string" ? l10src.split(/[^WLPwlp]+/) : [];
          const last10 = l10raw.map((x: any) => {
            const s = String(typeof x === "string" ? x : (x && (x.result || x.r)) || "").toUpperCase();
            return s.startsWith("W") ? "W" : s.startsWith("L") ? "L" : s.startsWith("P") ? "P" : "";
          }).filter(Boolean).slice(-10);
          const nmRaw = String(r.name || (cast && cast.name) || key).trim();
          const nmParts = nmRaw.split(/\s*[·|]\s*/);
          rows.push({
            key, cast,
            name: (nmParts[0] || nmRaw).trim(),
            title: (nmParts.length > 1 ? nmParts.slice(1).join(" · ").trim() : "") || (cast && cast.title) || "",
            persona: humanNote(r.persona_line),
            n: Math.max(0, Math.round(Number(r.n) || 0)) || win + loss + push,
            win, loss, push,
            hit: _fin(r.hit_rate != null ? r.hit_rate : r.hit),
            roi: _fin(r.roi),
            last10,
          });
        });
        if (rows.length) return rows;
      }
      return [];
    }
    // any live game already carries analyst calls (the cast exists even before records do)
    function deskAnyAnalysts() {
      for (const d of [betaLiveData, betaData]) {
        if (d && Array.isArray((d as any).games) && (d as any).games.some((g: any) => Array.isArray(g.analysts) && g.analysts.length)) return true;
      }
      return false;
    }
    const deskL10Dots = (arr: any[]) => (arr && arr.length
      ? `<span class="dsk-l10" aria-label="last ${arr.length} calls">${arr.map((r) => `<i class="d-${r === "W" ? "w" : r === "L" ? "l" : "p"}"></i>`).join("")}</span>`
      : "");
    // ---- DESK STANDINGS (top of home): the four analysts ranked by record ----
    function deskStandingsStrip() {
      let rows = deskRecordRows();
      const haveRec = rows.length > 0;
      if (!haveRec && !deskAnyAnalysts()) return "";
      if (!haveRec) rows = DESK_ORDER.map((k) => ({ key: k, cast: DESK_CAST[k], name: DESK_CAST[k].name, title: DESK_CAST[k].title, n: 0, win: 0, loss: 0, push: 0, hit: null, roi: null, last10: [] }));
      rows = rows.slice().sort((a: any, b: any) =>
        ((b.roi == null ? -9 : b.roi) - (a.roi == null ? -9 : a.roi)) ||
        ((b.hit || 0) - (a.hit || 0)) || ((b.win || 0) - (a.win || 0)) ||
        (DESK_ORDER.indexOf(a.key) - DESK_ORDER.indexOf(b.key)));
      const wk = weeklyStandingsData();
      const cards = rows.map((r: any, i: number) => {
        const graded = r.win + r.loss + r.push > 0;
        const rec = graded ? `${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}` : "0–0";
        const roiTxt = r.roi != null ? `<i class="dskst-roi ${r.roi >= 0 ? "pos" : "neg"}">${bRoi(r.roi)}</i>` : `<i class="dskst-roi dim">${graded ? "" : "first calls today"}</i>`;
        // THIS-WEEK FORM: the weekly race rides the strip — each card carries its week
        // ("wk 3–1"), the analyst of the week wears the crown. Absent feed ⇒ nothing.
        const wrow = wk ? wk.rows.find((x: any) => x.key === r.key) : null;
        const crowned = wk && wk.aotw === r.key;
        const wkChip = wrow
          ? `<span class="dskst-wk${crowned ? " crowned" : ""}">${crowned ? crownSvg(9) : ""}wk <b>${wrow.w}–${wrow.l}${wrow.p ? `–${wrow.p}` : ""}</b></span>`
          : (crowned ? `<span class="dskst-wk crowned">${crownSvg(9)}this week</span>` : "");
        return `<button class="dskst-card an-${esc(r.key)}${i === 0 && graded ? " lead" : ""}${crowned ? " aotw" : ""}" data-an="${esc(r.key)}" aria-label="${esc(r.name)} — ${esc(r.title)}, record ${rec}${wrow ? `, this week ${wrow.w} and ${wrow.l}` : ""}">
          <span class="dskst-rank">${i === 0 && graded ? "◆ 1st" : `${i + 1}${["st", "nd", "rd", "th"][Math.min(i, 3)]}`}${wkChip}</span>
          <span class="dskst-id">${deskGlyph(r.key, 17)}<span class="dskst-nm"><b>${esc(r.name)}</b><i>${esc(r.title)}</i></span></span>
          <span class="dskst-rec"><b>${rec}</b>${roiTxt}</span>
          ${deskL10Dots(r.last10)}
        </button>`;
      }).join("");
      return `<section class="dskst" aria-label="Desk standings">
        <div class="dskst-h"><span class="dskst-k">◆ Desk standings</span><span class="dskst-sub">Four analysts call every game — ranked by their graded record</span></div>
        <div class="dskst-rail">${cards}</div>
      </section>`;
    }
    // ---- the analyst PAGE: a full-screen character destination — the persona as the star.
    // Hero (glyph medallion · name · title · method) → the record arc → their week → today's
    // takes → best call → rivalries → the patterns they star in → every recent call.
    // "the record arc": last-N calls as a cumulative W−L sparkline in the analyst's accent.
    function anlArcSvg(last10: string[], key: string) {
      if (!last10 || last10.length < 3) return "";
      let cum = 0;
      const pts = [0, ...last10.map((r) => (cum += r === "W" ? 1 : r === "L" ? -1 : 0))];
      const w = 300, h = 64, pad = 6;
      const lo = Math.min(0, ...pts), hi = Math.max(0, ...pts);
      const span = Math.max(1, hi - lo);
      const X = (i: number) => pad + (i / (pts.length - 1)) * (w - pad * 2);
      const Y = (v: number) => pad + (1 - (v - lo) / span) * (h - pad * 2);
      const line = pts.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
      const up = pts[pts.length - 1] >= 0;
      return `<svg class="anlp-arc" viewBox="0 0 ${w} ${h}" role="img" aria-label="Last ${last10.length} calls — running win-loss arc, currently ${pts[pts.length - 1] >= 0 ? "up" : "down"} ${Math.abs(pts[pts.length - 1])}">
        <line x1="${pad}" y1="${Y(0).toFixed(1)}" x2="${w - pad}" y2="${Y(0).toFixed(1)}" stroke="rgba(224,235,255,.14)" stroke-dasharray="3 4" stroke-width="1"/>
        <polyline points="${line}" fill="none" stroke="var(--anc,#eec258)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${X(pts.length - 1).toFixed(1)}" cy="${Y(pts[pts.length - 1]).toFixed(1)}" r="3.4" fill="var(--anc,#eec258)"/>
        <text x="${(X(pts.length - 1) - 7).toFixed(1)}" y="${Math.max(11, Math.min(h - 5, Y(pts[pts.length - 1]) - 7)).toFixed(1)}" text-anchor="end" class="anlp-arc-lab ${up ? "pos" : "neg"}">${pts[pts.length - 1] >= 0 ? "+" : ""}${pts[pts.length - 1]}</text>
      </svg>`;
    }
    function openAnalystSheet(key: any) {
      const k = String(key || "").toLowerCase();
      const cast = DESK_CAST[k] || { name: k, title: "Analyst", method: "" };
      const rec = deskRecordRows().find((r: any) => r.key === k) || null;
      // recent calls: newest first across the live + history feeds, deduped by game
      const seen: any = {}; const calls: any[] = [];
      [betaLiveData, betaData].forEach((d: any) => ((d && d.games) || []).forEach((g: any) => {
        const gid = String(g.game_id || "");
        if (!gid || seen[gid]) return; seen[gid] = 1;
        const a = (Array.isArray(g.analysts) ? g.analysts : []).map(normAnalystRow).filter(Boolean).find((x: any) => x.key === k);
        if (a && a.side) calls.push({ g, a });
      }));
      calls.sort((x: any, y: any) => String(y.g.date || "").localeCompare(String(x.g.date || "")));
      const rows = calls.slice(0, 10).map(({ g, a }: any) => {
        const dd = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
        const aAb = g.away_abbr || mlbAbbr(g.away) || "—", hAb = g.home_abbr || mlbAbbr(g.home) || "—";
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        const res = a.result === "win" ? `<span class="ppres won">W</span>` : a.result === "loss" ? `<span class="ppres lost">L</span>` : a.result === "push" ? `<span class="ppres pushed">P</span>` : `<span class="ppres open">—</span>`;
        return `<div class="anl-row"><span class="anl-d">${esc(dd)}</span><span class="anl-mu">${esc(aAb)} @ ${esc(hAb)}</span><span class="anl-call ${dirCls}">${a.dir === "over" ? "▲" : a.dir === "under" ? "▼" : ""} ${esc((a.dir || a.side).toUpperCase())}${a.line != null ? ` ${lineStr(a.line)}` : ""}</span>${a.conv != null ? `<span class="anl-conv">${Math.round(a.conv * 100)}%</span>` : ""}${res}</div>`;
      }).join("");
      const graded = rec && rec.win + rec.loss + rec.push > 0;
      // THEIR WEEK — the weekly-race row (+ the crown when they're analyst of the week).
      const wkAll = weeklyStandingsData();
      const wrow = wkAll ? wkAll.rows.find((x: any) => x.key === k) : null;
      const crowned = !!(wkAll && wkAll.aotw === k);
      const wkCell = wrow
        ? `<div class="anl-big wk${crowned ? " crowned" : ""}"><b>${crowned ? crownSvg(12) : ""}${wrow.w}–${wrow.l}${wrow.p ? `–${wrow.p}` : ""}</b><i>this week${crowned ? " · crowned" : ""}</i></div>`
        : "";
      const recHero = rec
        ? `<div class="anl-hero">
            <div class="anl-big"><b>${rec.win}–${rec.loss}${rec.push ? `–${rec.push}` : ""}</b><i>record</i></div>
            ${rec.hit != null ? `<div class="anl-big"><b>${(rec.hit * 100).toFixed(0)}%</b><i>hit</i></div>` : ""}
            ${rec.roi != null ? `<div class="anl-big ${rec.roi >= 0 ? "pos" : "neg"}"><b>${bRoi(rec.roi)}</b><i>ROI</i></div>` : ""}
            ${wkCell}
            ${rec.last10.length ? `<div class="anl-big form"><b>${deskL10Dots(rec.last10)}</b><i>last ${rec.last10.length}</i></div>` : ""}
          </div>`
        : `<div class="anl-hero"><div class="anl-big"><b>0–0</b><i>first calls pending</i></div>${wkCell}</div>`;
      // TODAY AT THE DESK — their persona-voice takes on today's slate, quoted.
      const takesToday: any[] = [];
      const seenTk: any = {};
      [betaLiveData, betaData].forEach((d: any) => ((d && d.games) || []).forEach((g: any) => {
        const gid = String(g.game_id || "");
        if (!gid || seenTk[gid]) return; seenTk[gid] = 1;
        if (String(g.date || "").slice(0, 10) !== todayISO()) return;
        const a = (Array.isArray(g.analysts) ? g.analysts : []).map(normAnalystRow).filter(Boolean).find((x: any) => x.key === k);
        if (a && a.take) takesToday.push({ g, a });
      }));
      const takesHtml = takesToday.slice(0, 3).map(({ g, a }: any) => {
        const aAb = g.away_abbr || mlbAbbr(g.away) || "—", hAb = g.home_abbr || mlbAbbr(g.home) || "—";
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        return `<div class="anl-take">
          <div class="anl-take-top"><span class="anl-mu">${esc(aAb)} @ ${esc(hAb)}</span>${a.side ? `<span class="anl-call ${dirCls}">${a.dir === "over" ? "▲" : a.dir === "under" ? "▼" : ""} ${esc((a.dir || a.side).toUpperCase())}${a.line != null ? ` ${lineStr(a.line)}` : ""}</span>` : ""}</div>
          <p class="anl-take-say">“${esc(a.take)}”</p>
        </div>`;
      }).join("");
      // THEIR RIVALRIES — head-to-head disagreement records involving this analyst.
      const rivHtml = h2hFor(k).slice(0, 3).map((r: any) => {
        const opp = r.a === k ? r.b : r.a;
        const mine = r.a === k ? r.aw : r.bw, theirs = r.a === k ? r.bw : r.aw;
        const cls = mine > theirs ? "pos" : mine < theirs ? "neg" : "";
        return `<button class="anl-riv an-${esc(opp)}" data-an="${esc(opp)}" aria-label="Rivalry with ${esc((DESK_CAST[opp] || {}).name || opp)}">
          <span class="anl-riv-id">${deskGlyph(opp, 12)}<b>vs ${esc((DESK_CAST[opp] || {}).name || opp)}</b></span>
          <b class="anl-riv-rec ${cls}">${mine}–${theirs}</b>
          <i>when they disagree</i>
        </button>`;
      }).join("");
      // BEST RECENT CALL — the most recent night this analyst owned the desk's best call;
      // falls back to their strongest graded win from the recent-calls list.
      let bestCallHtml = "";
      const rcBest = deskRecapsAll().find((rc: any) => rc.best && rc.best.key === k);
      if (rcBest) {
        const b = rcBest.best;
        bestCallHtml = `<div class="anl-best">
          <span class="anl-best-k">◆ Best recent call${rcBest.date ? ` · ${esc(recapDateTxt(rcBest.date))}` : ""}</span>
          <div class="anl-best-b">${b.mu ? `<span class="anl-mu">${esc(b.mu)}</span>` : ""}${b.call ? `<b class="anl-call ${/under/i.test(b.call) ? "ou-under" : /over/i.test(b.call) ? "ou-over" : ""}">${esc(b.call)}</b>` : ""}<span class="ppres won">W</span></div>
          ${b.txt ? `<p class="anl-take-say">“${esc(b.txt)}”</p>` : ""}
        </div>`;
      } else {
        const bw = calls.filter(({ a }: any) => a.result === "win")
          .sort((x: any, y: any) => ((y.a.conv != null ? y.a.conv : 0) - (x.a.conv != null ? x.a.conv : 0)))[0];
        if (bw) {
          const aAb = bw.g.away_abbr || mlbAbbr(bw.g.away) || "—", hAb = bw.g.home_abbr || mlbAbbr(bw.g.home) || "—";
          bestCallHtml = `<div class="anl-best">
            <span class="anl-best-k">◆ Best recent call${bw.g.date ? ` · ${esc(recapDateTxt(bw.g.date))}` : ""}</span>
            <div class="anl-best-b"><span class="anl-mu">${esc(aAb)} @ ${esc(hAb)}</span><b class="anl-call ${bw.a.dir === "under" ? "ou-under" : "ou-over"}">${esc((bw.a.dir || bw.a.side).toUpperCase())}${bw.a.line != null ? ` ${lineStr(bw.a.line)}` : ""}</b>${bw.a.conv != null ? `<span class="anl-conv">${Math.round(bw.a.conv * 100)}% sure</span>` : ""}<span class="ppres won">W</span></div>
          </div>`;
        }
      }
      detail = { _record: true };
      // THE PATTERNS THEY STAR IN — pattern highlights naming this analyst.
      const myPats = patternHighlights().filter((it: any) => it.keys.indexOf(k) >= 0).slice(0, 3);
      const patsHtml = myPats.length
        ? `<div class="anlp-sec"><div class="anlp-sec-h">Their patterns</div><div class="pat-grid one">${myPats.map((it: any) => patternCard(it)).join("")}</div></div>`
        : "";
      const arc = rec ? anlArcSvg(rec.last10, k) : "";
      const html = `
        <div class="gamepage anlpage an-${esc(k)}" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(cast.name || k)} — analyst">
          <div class="gp-head">
            <button class="gp-back" id="gp-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <button class="gp-brand" id="gp-brand" aria-label="DiamondEdge — home"><span class="diamond" aria-hidden="true"></span><span class="gp-brand-tx">Diamond<b>Edge</b></span></button>
            <div class="hspacer"></div>
          </div>
          <div class="gp-body anlp-body" id="gp-body">
            <header class="anlp-hero">
              <div class="anlp-aura" aria-hidden="true"></div>
              <div class="anlp-glyph">${deskGlyph(k, 38)}</div>
              <h2 class="anlp-name">${esc(String(cast.name || k).toUpperCase())}</h2>
              <div class="anlp-title">${esc(cast.title || "Analyst")}${crowned ? `<span class="anlp-crown">${crownSvg(13)} Analyst of the week</span>` : ""}</div>
              ${cast.method ? `<p class="anlp-method">${esc(cast.method)}</p>` : ""}
            </header>
            <section class="anlp-recwrap">
              ${recHero}
              ${arc ? `<div class="anlp-arcwrap">${arc}<span class="anlp-arc-k">last ${rec.last10.length} calls — the running arc</span></div>` : ""}
              ${graded ? "" : `<div class="anl-note">Every call ${esc(cast.name || "this analyst")} files is graded against the real final — the record builds here in public.</div>`}
            </section>
            ${takesHtml ? `<div class="anlp-sec"><div class="anlp-sec-h">Today at the desk</div><div class="anl-takes">${takesHtml}</div></div>` : ""}
            ${bestCallHtml}
            ${rivHtml ? `<div class="anlp-sec"><div class="anlp-sec-h">Rivalries</div><div class="anl-rivs">${rivHtml}</div></div>` : ""}
            ${patsHtml}
            ${rows ? `<div class="anlp-sec"><div class="anlp-sec-h">Recent calls</div><div class="anl-rows">${rows}</div></div>` : ""}
            <div class="anlp-sec"><div class="dsec-b rcp"><p><b>One desk, one bet.</b> ${esc(cast.name || "Each analyst")} argues a side on every game; the desk chief weighs all four and only the DiamondEdge call is ever played. Each analyst's own calls are graded separately — that scoreboard is the competition.</p></div></div>
            <button class="rb-full" id="anl-insights">See the full desk record →</button>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(() => { const p2 = $("gamepage"); if (p2) p2.classList.add("in"); });
      $("gp-back").onclick = () => closeDetail();
      const gpb = $("gp-brand"); if (gpb) gpb.onclick = () => { closeDetail(); switchTab("today"); };
      const ins = $("anl-insights"); if (ins) ins.onclick = () => { closeDetail(); switchTab("results"); };
    }
    // ONE capture-phase delegate wires every [data-an] tap on every surface to the analyst
    // card — tiles, the standings strip, the debate panel — without touching each binder.
    let deskTapBound = false;
    function bindDeskTaps() {
      if (deskTapBound) return; deskTapBound = true;
      document.addEventListener("click", (e: any) => {
        // "Hear the desk" fold inside a clickable tile: let the <details> toggle, but never
        // bubble up into the tile's open-game handler.
        const sum = e.target && e.target.closest && e.target.closest(".dsk-voices summary");
        if (sum) { e.stopPropagation(); return; }
        const b = e.target && e.target.closest && e.target.closest("[data-an]");
        if (!b) return;
        e.preventDefault(); e.stopPropagation();
        openAnalystSheet(b.dataset.an);
      }, true);
    }
    // ---- the detail drill-down: the four analysts DEBATING the game ----
    function deskRecChip(key: string) {
      const r = deskRecordRows().find((x: any) => x.key === key);
      if (!r || r.win + r.loss + r.push === 0) return "";
      return `<span class="dbt-rec">${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}</span>`;
    }
    function deskDebatePanel(g: any, locked = false) {
      const ans = deskAnalysts(g);
      if (!ans.length) return "";
      const chief = deskChief(g);
      const rows = ans.map((a: any) => {
        const hide = locked; // a.locked = frozen at its wall (provenance), never a redaction
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        const call = hide
          ? `<span class="dsk-dots" aria-hidden="true">●●●</span>`
          : a.side
            ? `<b class="dbt-side ${dirCls}">${a.dir === "over" ? "▲" : a.dir === "under" ? "▼" : ""} ${esc((a.dir || a.side).toUpperCase())}${a.line != null ? ` ${lineStr(a.line)}` : ""}</b>`
            : `<b class="dbt-side none">No call yet</b>`;
        const conv = !hide && a.conv != null ? `<span class="dbt-conv">${Math.round(a.conv * 100)}% sure</span>` : "";
        const res = a.result === "win" ? `<span class="sgr-res won">RIGHT</span>` : a.result === "loss" ? `<span class="sgr-res lost">WRONG</span>` : a.result === "push" ? `<span class="sgr-res pushed">PUSH</span>` : "";
        // THE VOICE: the analyst's per-game take is the speech bubble — their persona line
        // only stands in while the backend take hasn't landed yet.
        const say = !hide ? (a.take || a.persona) : "";
        return `<div class="dbt an-${esc(a.key)}" data-an="${esc(a.key)}" role="button" tabindex="0">
          <div class="dbt-id">${deskGlyph(a.key, 15)}<span class="dbt-nm"><b>${esc(a.name)}</b><i>${esc(a.title)}</i></span>${deskRecChip(a.key)}</div>
          <div class="dbt-call">${call}${conv}${a.wall ? `<span class="dbt-wall">${esc(a.wall)}</span>` : ""}${res}</div>
          ${say ? `<p class="dbt-say${a.take ? " is-take" : ""}">“${esc(say)}”</p>` : ""}
        </div>`;
      }).join("");
      const chiefRow = chief && chief.action ? `<div class="dbt chiefrow ${chief.action === "PLAY" ? "ch-play" : chief.action === "LEAN" ? "ch-lean" : "ch-avoid"}">
          <div class="dbt-id"><span class="dbt-dia" aria-hidden="true">◆</span><span class="dbt-nm"><b>DIAMONDEDGE</b><i>Desk chief</i></span></div>
          <div class="dbt-call"><b class="dbt-verdict">${chief.action === "AVOID" ? "WE PASS" : chief.action}</b></div>
          ${chief.rationale ? `<p class="dbt-say chief">${esc(chief.rationale)}</p>` : ""}
          ${chiefSpreadLine(g, chief)}
        </div>` : "";
      return `<div class="stgy dskdb" id="stgy-panel">
        <div class="stgy-h"><span class="stgy-k">◆ The desk on this game</span>${consensusBanner(g, locked, "wide")}</div>
        <p class="stgy-lede">Four analysts file <b>independent</b> calls on every game — then the desk chief weighs them. Agreement is a green light; a split desk is a pass.</p>
        <div class="dskdb-rows">${rows}${chiefRow}</div>
        <div class="stgy-note">One desk, one bet: only the DiamondEdge call is ever played, and only it grades into the headline record. Every analyst's own calls are graded separately — that scoreboard lives on Insights.</div>
      </div>`;
    }
    // compact desk line for the flagship/lead story card (consensus chip + the four glyphs)
    function deskMiniRow(g: any, locked = false) {
      const ans = deskAnalysts(g);
      if (!ans.length) return "";
      const chips = ans.map((a: any) => {
        const hide = locked; // a.locked = frozen at its wall (provenance), never a redaction
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        return `<span class="dskm an-${esc(a.key)}" title="${esc(a.name)} — ${esc(a.title)}">${deskGlyph(a.key, 11)}${!hide && a.dir ? `<i class="${dirCls}">${a.dir === "over" ? "▲" : "▼"}</i>` : ""}</span>`;
      }).join("");
      return `<div class="ls-desk">${consensusBanner(g, locked, "mini")}<span class="dskm-row">${chips}</span></div>`;
    }
    // ---- record.consensus_history → "when the desk agrees" (Insights) ----
    function consensusHistoryRows() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        let ch = d && (d as any).record && (d as any).record.consensus_history;
        if (!ch) continue;
        // served shape nests the states under by_state
        if (ch.by_state && typeof ch.by_state === "object") ch = ch.by_state;
        const items: any[] = [];
        const push = (state: string, r: any) => {
          const b = stratBlock(r);
          if (b) items.push({ state: state.toUpperCase(), ...b });
        };
        if (Array.isArray(ch)) ch.forEach((r: any) => r && r.state && push(String(r.state), r));
        else if (typeof ch === "object") Object.keys(ch).forEach((k) => push(k, ch[k]));
        const order = ["UNANIMOUS", "MAJORITY", "SPLIT"];
        items.sort((a, b) => order.indexOf(a.state) - order.indexOf(b.state));
        if (items.length) return items;
      }
      return [];
    }
    // ═══════════ THE DESK COMES ALIVE — live ATLAS · nightly recaps · rivalries · weekly race ═══════════
    // Every reader below is FULLY DEFENSIVE: the backend fields (atlas live block,
    // record.desk_recap / desk_recaps, record.head_to_head, record.weekly_standings) may not
    // be served yet — absent/malformed ⇒ null/[] and every surface degrades to today's
    // layout, byte for byte.

    // ---- ATLAS LIVE: the physicist re-prices the total mid-game ----
    // Tolerated shapes: live fields riding the atlas analysts row (flat or nested under
    // .live), a game-level atlas / atlas_live block, or the simulator block itself.
    function atlasLiveOf(g: any) {
      if (!g || gameState(g).kind !== "live") return null;
      const src = Array.isArray(g.analysts) ? g : (v4GameFor(g) || g);
      const cands: any[] = [];
      const push = (o: any) => { if (o && typeof o === "object") { cands.push(o); if (o.live && typeof o.live === "object") cands.push(o.live); } };
      (Array.isArray(src && src.analysts) ? src.analysts : []).forEach((a: any) => { if (a && String(a.key || "").toLowerCase() === "atlas") push(a); });
      push(src && src.atlas); push(g.atlas); push(src && src.atlas_live); push(g.atlas_live);
      push((src && src.simulator) || g.simulator);
      for (const c of cands) {
        const p = _fin(c.live_p_over);
        const note = humanNote(c.live_state_note);
        if (p == null && !note) continue;
        return { p: p != null ? Math.max(0, Math.min(1, p)) : null, note, asOf: String(c.as_of == null ? "" : c.as_of).trim() };
      }
      return null;
    }
    const atlasAsOfTxt = (iso: any) => {
      const t = new Date(String(iso || "")).getTime();
      return isFinite(t) ? new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
    };
    // The pulsing live chip: "ATLAS LIVE · 61% over · Top 5th" — the sim's live read on the
    // total, updating with each refresh. With only a state note it's the honest "watching"
    // state. It is an observation, never a bet prompt — no side is ever recommended here.
    function atlasLiveChip(g: any, size = "tile") {
      const al = atlasLiveOf(g);
      if (!al) return "";
      const gs = gameState(g);
      const per = gs.kind === "live" && gs.label && gs.label !== "Live" ? gs.label : "";
      const upd = atlasAsOfTxt(al.asOf);
      const glyph = `<span class="atl-g" aria-hidden="true">${deskGlyph("atlas", size === "full" ? 13 : 11)}</span>`;
      if (al.p == null) {
        return `<div class="atlive watch atl-${size}" title="ATLAS re-runs the simulation as the game unfolds${upd ? ` · updated ${upd}` : ""}">
          ${glyph}<b class="atl-k">ATLAS<i class="atl-livew"><em class="atl-dot" aria-hidden="true"></em>LIVE</i></b>
          <span class="atl-tx">${esc(al.note || "watching the game")}</span>${per ? `<span class="atl-per">${esc(per)}</span>` : ""}
        </div>`;
      }
      const over = al.p >= 0.5;
      const pct = Math.round((over ? al.p : 1 - al.p) * 100);
      return `<div class="atlive atl-${size} ${over ? "ou-o" : "ou-u"}" title="ATLAS's in-game simulation${upd ? ` · updated ${upd}` : ""} — its live probability, not a pick">
        ${glyph}<b class="atl-k">ATLAS<i class="atl-livew"><em class="atl-dot" aria-hidden="true"></em>LIVE</i></b>
        <span class="atl-p"><b>${pct}%</b> ${over ? "over" : "under"}</span>
        <span class="atl-meter" aria-hidden="true"><i style="width:${Math.max(4, Math.min(100, al.p * 100)).toFixed(0)}%"></i></span>
        ${per ? `<span class="atl-per">${esc(per)}</span>` : ""}
        ${al.note ? `<span class="atl-tx note">${esc(al.note)}</span>` : ""}
      </div>`;
    }

    // ---- NIGHTLY DESK RECAP (record.desk_recap + record.desk_recaps[]) ----
    const wlParse = (r: any) => {
      // {win,loss,push} or a "2-1" / "2–1–0" record string
      if (r && typeof r === "object") {
        const w = Math.max(0, Math.round(Number(r.win != null ? r.win : r.wins) || 0));
        const l = Math.max(0, Math.round(Number(r.loss != null ? r.loss : r.losses) || 0));
        const p = Math.max(0, Math.round(Number(r.push != null ? r.push : r.pushes) || 0));
        return w + l + p ? { w, l, p } : null;
      }
      const m = String(r || "").match(/(\d+)\s*[–-]\s*(\d+)(?:\s*[–-]\s*(\d+))?/);
      return m ? { w: Number(m[1]), l: Number(m[2]), p: Number(m[3] || 0) } : null;
    };
    const anKeyOf = (x: any) => {
      const k = String(x == null ? "" : (typeof x === "object" ? (x.key || x.analyst || x.name || "") : x)).toLowerCase();
      const m = k.match(/vega|atlas|nova|scout/);
      return m ? m[0] : "";
    };
    // best_call / worst_call → { key, mu, call, result, txt } (string payloads become txt-only).
    // The served nightly block writes the whole sentence into `line` ("ATLAS said 60% over at
    // 7.5 — it landed 14") — a non-numeric `line` is the quote, a numeric one is the market line.
    function normRecapCall(c: any) {
      if (!c) return null;
      if (typeof c === "string") { const t = humanNote(c); return t ? { key: "", mu: "", call: "", result: null, txt: t } : null; }
      if (typeof c !== "object") return null;
      const key = anKeyOf(c.analyst != null ? c.analyst : c.key);
      const mu = String(c.matchup || (c.away_abbr && c.home_abbr ? `${c.away_abbr} @ ${c.home_abbr}` : (c.game || ""))).trim();
      const sideRaw = String(c.side || c.call || "").trim();
      const ln = _fin(c.line);
      const call = sideRaw ? `${sideRaw.toUpperCase()}${ln != null && !/\d/.test(sideRaw) ? ` ${lineStr(ln)}` : ""}` : "";
      const result = /^(win|loss|push)$/i.test(String(c.result || "")) ? String(c.result).toLowerCase() : null;
      let txt = humanNote(c.note != null ? c.note : (c.text != null ? c.text : (c.quote != null ? c.quote : c.take)));
      if (!txt && typeof c.line === "string" && ln == null) txt = humanNote(c.line);
      if (!key && !mu && !call && !txt) return null;
      return { key, mu, call, result, txt, conv: _fin(c.conviction) };
    }
    // one nightly recap block → a stable object (or null)
    function normDeskRecap(r: any) {
      if (!r || typeof r !== "object") return null;
      const date = String(r.date || r.for_date || r.night || "").slice(0, 10);
      const winner = anKeyOf(r.winner != null ? r.winner : r.winner_key);
      // per-analyst lines: array or {key:{…}} map under analysts / lines / by_analyst
      const linesRaw = r.analysts != null ? r.analysts : (r.lines != null ? r.lines : r.by_analyst);
      const lines: any[] = [];
      const pushLine = (x: any, hint = "") => {
        if (!x) return;
        const key = anKeyOf(x) || anKeyOf(hint);
        if (!DESK_CAST[key]) return;
        const wl = wlParse(typeof x === "object" ? (x.record != null ? x.record : x) : x);
        // served per-analyst `line` is often just the W-L string ("1-4") — that's the record,
        // not a persona sentence; only a real sentence renders as the italic line
        const txtRaw = typeof x === "object" ? humanNote(x.line != null ? x.line : (x.note != null ? x.note : x.text)) : "";
        const txt = /^\d+\s*[–-]\s*\d+(\s*[–-]\s*\d+)?$/.test(txtRaw) ? "" : txtRaw;
        if (!wl && !txt) return;
        // an analyst who filed nothing that night (0-0, no line) stays off the recap
        if (wl && wl.w + wl.l + wl.p === 0 && !txt) return;
        lines.push({ key, wl, txt, roi: typeof x === "object" ? _fin(x.roi) : null });
      };
      if (Array.isArray(linesRaw)) linesRaw.forEach((x: any) => pushLine(x));
      else if (linesRaw && typeof linesRaw === "object") Object.keys(linesRaw).forEach((k) => pushLine(linesRaw[k], k));
      const idx = (k: string) => { const i = DESK_ORDER.indexOf(k); return i < 0 ? 99 : i; };
      lines.sort((a, b) => idx(a.key) - idx(b.key));
      const best = normRecapCall(r.best_call);
      const worst = normRecapCall(r.worst_call);
      const note = humanNote(r.consensus_note != null ? r.consensus_note : r.note);
      if (!winner && !lines.length && !best && !worst && !note) return null;
      return { date, winner, lines, best, worst, note, headline: humanNote(r.headline != null ? r.headline : r.desk_verdict_line) };
    }
    // every served nightly recap, newest first, deduped by date. Tolerated containers:
    // record.desk_recap (single), record.desk_recaps as an array, a {date: recap} map, or
    // the served { latest, history, note, n_written } wrapper.
    function deskRecapsAll() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        const rec = d && (d as any).record;
        if (!rec || typeof rec !== "object") continue;
        const out: any[] = []; const seen: any = {};
        const add = (raw: any) => { const n = normDeskRecap(raw); if (n && !seen[n.date || "?"]) { seen[n.date || "?"] = 1; out.push(n); } };
        add(rec.desk_recap);
        const dr = rec.desk_recaps;
        let list: any[] = [];
        if (Array.isArray(dr)) list = dr;
        else if (dr && typeof dr === "object") {
          if (dr.latest) list.push(dr.latest);
          const hist = dr.history;
          if (Array.isArray(hist)) list = list.concat(hist);
          else if (hist && typeof hist === "object") list = list.concat(Object.values(hist));
          else if (!dr.latest) list = Object.values(dr);
        }
        list.forEach(add);
        if (out.length) { out.sort((a, b) => String(b.date).localeCompare(String(a.date))); return out; }
      }
      return [];
    }
    const latestDeskRecap = () => deskRecapsAll()[0] || null;
    const recapDateTxt = (iso: any, long = false) => {
      const t = String(iso || "").slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return "";
      const dd = new Date(t + "T12:00:00");
      return isNaN(dd.getTime()) ? "" : dd.toLocaleDateString("en-US", long ? { weekday: "long", month: "long", day: "numeric" } : { weekday: "short", month: "short", day: "numeric" });
    };
    const crownSvg = (sz = 12) => `<svg class="crown" viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="currentColor" stroke="none" aria-hidden="true"><path d="M3.2 17.2L4.6 7.6l4.9 4.1L12 5l2.5 6.7 4.9-4.1 1.4 9.6z"/><rect x="4" y="18.6" width="16" height="2.2" rx="1.1"/></svg>`;

    // ---- HEAD-TO-HEAD RIVALRIES (record.head_to_head) ----
    // Pairwise disagreement scoreboards: on games where two analysts took OPPOSITE sides,
    // who was right? Shapes tolerated: an array of pair rows, or a map keyed "vega_vs_nova".
    function headToHeadRows() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        let hh = d && (d as any).record && (d as any).record.head_to_head;
        if (!hh) continue;
        if (hh.pairs && (Array.isArray(hh.pairs) || typeof hh.pairs === "object")) hh = hh.pairs;
        const rows: any[] = []; const seen: any = {};
        const add = (o: any, kGuess = "") => {
          if (!o || typeof o !== "object") return;
          let a = anKeyOf(o.a != null ? o.a : (o.analyst_a != null ? o.analyst_a : o.left));
          let b = anKeyOf(o.b != null ? o.b : (o.analyst_b != null ? o.analyst_b : o.right));
          // served shape: pair: ["vega","nova"] + wins: {vega: 1, nova: 1}
          if ((!a || !b) && Array.isArray(o.pair) && o.pair.length >= 2) { a = anKeyOf(o.pair[0]); b = anKeyOf(o.pair[1]); }
          if (!a || !b) {
            const m = String(kGuess).toLowerCase().match(/vega|atlas|nova|scout/g);
            if (m && m.length >= 2) { a = a || m[0]; b = b || m[1]; }
          }
          if (!DESK_CAST[a] || !DESK_CAST[b] || a === b) return;
          let aw = Math.max(0, Math.round(Number(o.a_wins != null ? o.a_wins : o.a_win) || 0));
          let bw = Math.max(0, Math.round(Number(o.b_wins != null ? o.b_wins : o.b_win) || 0));
          if (o.wins && typeof o.wins === "object") {
            aw = Math.max(0, Math.round(Number(o.wins[a]) || 0));
            bw = Math.max(0, Math.round(Number(o.wins[b]) || 0));
          }
          const pu = Math.max(0, Math.round(Number(o.push != null ? o.push : o.pushes) || 0));
          const n = Math.max(0, Math.round(Number(o.n_disagreements != null ? o.n_disagreements : o.n) || 0)) || aw + bw + pu;
          if (!n) return;
          const id = [a, b].sort().join("|");
          if (seen[id]) return; seen[id] = 1;
          rows.push({ a, b, aw, bw, push: pu, n, note: humanNote(o.note) });
        };
        if (Array.isArray(hh)) hh.forEach((o: any) => add(o));
        else if (typeof hh === "object") Object.keys(hh).forEach((k) => { if (k !== "note") add(hh[k], k); });
        if (rows.length) { rows.sort((x, y) => y.n - x.n); return rows; }
      }
      return [];
    }
    const h2hFor = (key: string) => headToHeadRows().filter((r: any) => r.a === key || r.b === key);
    // one versus-card: two glyphs face off, the disagreement record between them
    function h2hCardHtml(r: any) {
      const lead = r.aw === r.bw ? null : (r.aw > r.bw ? r.a : r.b);
      const nmA = (DESK_CAST[r.a] || {}).name || r.a, nmB = (DESK_CAST[r.b] || {}).name || r.b;
      const side = (k: string, w: number) => `<button class="vs-side an-${esc(k)}${lead === k ? " lead" : ""}" data-an="${esc(k)}" aria-label="${esc((DESK_CAST[k] || {}).name || k)} — analyst card">
          ${deskGlyph(k, 17)}<b>${esc((DESK_CAST[k] || {}).name || k)}</b><span class="vs-w">${w}</span>
        </button>`;
      const verdict = lead
        ? `${esc((DESK_CAST[lead] || {}).name || lead)} leads the feud ${Math.max(r.aw, r.bw)}–${Math.min(r.aw, r.bw)}`
        : `Dead even at ${r.aw}–${r.bw}`;
      return `<div class="vscard">
        <div class="vs-k">When ${esc(nmA)} and ${esc(nmB)} disagree</div>
        <div class="vs-face">${side(r.a, r.aw)}<span class="vs-mid"><b>${r.aw}–${r.bw}</b><i>VS</i></span>${side(r.b, r.bw)}</div>
        <div class="vs-foot">${esc(verdict)}${r.push ? ` · ${r.push} push${r.push === 1 ? "" : "es"}` : ""} · ${r.n} head-to-head game${r.n === 1 ? "" : "s"}</div>
        ${r.note ? `<div class="vs-note">${esc(r.note)}</div>` : ""}
      </div>`;
    }

    // ---- THE WEEKLY RACE (record.weekly_standings + analyst_of_the_week) ----
    function weeklyStandingsData() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        const w = d && (d as any).record && (d as any).record.weekly_standings;
        if (!w || typeof w !== "object") continue;
        // served shape: rows live under this_week (a {key: {win,loss,push,…}} map, with a
        // stray week_start string the DESK_CAST guard skips); older spellings tolerated
        const rowsRaw = w.this_week != null ? w.this_week
          : (w.rows != null ? w.rows : (w.records != null ? w.records : (w.analysts != null ? w.analysts : w)));
        const rows: any[] = []; const seen: any = {};
        const add = (x: any, hint = "") => {
          if (!x || typeof x !== "object") return;
          const key = anKeyOf(x) || anKeyOf(hint);
          if (!DESK_CAST[key] || seen[key]) return;
          const wl = wlParse(x.record != null ? x.record : x);
          if (!wl) return;
          seen[key] = 1;
          rows.push({ key, ...wl, roi: _fin(x.roi), n: Math.max(0, Math.round(Number(x.n) || 0)) || wl.w + wl.l + wl.p });
        };
        if (Array.isArray(rowsRaw)) rowsRaw.forEach((x: any) => add(x));
        else if (rowsRaw && typeof rowsRaw === "object") Object.keys(rowsRaw).forEach((k) => add(rowsRaw[k], k));
        const aotw = anKeyOf(w.analyst_of_the_week != null ? w.analyst_of_the_week : (w.aotw != null ? w.aotw : w.crown));
        const label = humanNote(w.label != null ? w.label : w.week_label)
          || (String(w.week_start || "").slice(0, 10).match(/^\d{4}-\d{2}-\d{2}$/) ? `Week of ${recapDateTxt(w.week_start)}` : "This week");
        if (rows.length || aotw) {
          // the race ranks on net wins (W−L) first — the same "best wins-losses" basis the
          // served analyst_of_the_week uses — then volume, then ROI when present
          rows.sort((a, b) => ((b.w - b.l) - (a.w - a.l)) || (b.w - a.w)
            || ((b.roi == null ? -9 : b.roi) - (a.roi == null ? -9 : a.roi))
            || (DESK_ORDER.indexOf(a.key) - DESK_ORDER.indexOf(b.key)));
          return { rows, aotw, label, note: humanNote(w.note) };
        }
      }
      return null;
    }
    const weeklyRowFor = (key: string) => {
      const w = weeklyStandingsData();
      return w ? (w.rows.find((r: any) => r.key === key) || null) : null;
    };
    // Insights: the seven-day sprint — weekly records as a race, the crown on this week's leader.
    function weeklyRaceSection() {
      const w = weeklyStandingsData();
      if (!w || !w.rows.length) return "";
      const maxW = Math.max(1, ...w.rows.map((r: any) => r.w));
      const rows = w.rows.map((r: any, i: number) => {
        const crowned = w.aotw === r.key;
        const rec = `${r.w}–${r.l}${r.p ? `–${r.p}` : ""}`;
        return `<button class="wkr an-${esc(r.key)}${crowned ? " crowned" : ""}" data-an="${esc(r.key)}" aria-label="${esc((DESK_CAST[r.key] || {}).name || r.key)} — this week ${rec}">
          <span class="wkr-rank">${i + 1}${["st", "nd", "rd", "th"][Math.min(i, 3)]}</span>
          <span class="wkr-id">${deskGlyph(r.key, 14)}<b>${esc((DESK_CAST[r.key] || {}).name || r.key)}</b>${crowned ? `<span class="wkr-crown">${crownSvg(12)}</span>` : ""}</span>
          <span class="wkr-bar" aria-hidden="true"><i style="width:${Math.max(6, (r.w / maxW) * 100).toFixed(0)}%"></i></span>
          <span class="wkr-rec"><b>${rec}</b>${r.roi != null ? `<i class="${r.roi >= 0 ? "pos" : "neg"}">${bRoi(r.roi)}</i>` : ""}</span>
        </button>`;
      }).join("");
      const champ = w.aotw && DESK_CAST[w.aotw]
        ? `<div class="wkr-champ an-${esc(w.aotw)}"><span class="wkr-crown big">${crownSvg(15)}</span>${deskGlyph(w.aotw, 16)}<b>${esc(DESK_CAST[w.aotw].name)}</b><span>is the Analyst of the Week</span></div>`
        : "";
      return `<div class="ixc wkrace" id="weekly-race">
        <div class="ixc-h">The weekly race</div>
        <div class="ixc-sub">${esc(w.label || "This week")} — the same four analysts, sprint-scored week by week. The crown resets every Monday.</div>
        ${champ}
        <div class="wkr-rows">${rows}</div>
        ${w.note ? `<div class="chh-note">${esc(w.note)}</div>` : ""}
      </div>`;
    }
    // Insights: the rivalry board — every pairwise disagreement scoreboard as a versus-card.
    function rivalriesSection() {
      const rows = headToHeadRows();
      if (!rows.length) return "";
      return `<div class="ixc rivalries" id="rivalries">
        <div class="ixc-h">Desk rivalries</div>
        <div class="ixc-sub">Same game, opposite calls — when two analysts take different sides, exactly one of them is right. These are those games only, scored head-to-head.</div>
        <div class="vsgrid">${rows.slice(0, 6).map(h2hCardHtml).join("")}</div>
      </div>`;
    }

    // ---- "LAST NIGHT AT THE DESK" — the nightly recap rendered three ways ----
    // (a) the marquee story slide, (b) the morning card on the home board, (c) the
    // browsable Insights archive. All from the same normalized recap objects.
    function recapWinnerLineTxt(rc: any) {
      const w = rc.winner && DESK_CAST[rc.winner] ? DESK_CAST[rc.winner].name : "";
      const wl = rc.lines.find((l: any) => l.key === rc.winner);
      const rec = wl && wl.wl ? `${wl.wl.w}–${wl.wl.l}${wl.wl.p ? `–${wl.wl.p}` : ""}` : "";
      return w ? `${w} takes the night${rec ? ` at ${rec}` : ""}` : "";
    }
    function recapCallRow(c: any, kind: "best" | "worst") {
      if (!c) return "";
      const cast = c.key && DESK_CAST[c.key] ? DESK_CAST[c.key] : null;
      const who = cast ? cast.name : "The desk";
      const lab = kind === "best" ? "Best call" : "Worst call";
      const resTxt = c.result === "win" ? "cashed" : c.result === "loss" ? "missed" : c.result === "push" ? "pushed" : "";
      return `<div class="rcap-call ${kind}${c.key ? ` an-${esc(c.key)}` : ""}"${c.key ? ` data-an="${esc(c.key)}" role="button" tabindex="0"` : ""}>
        <span class="rcap-call-k">${kind === "best" ? "◆" : "✕"} ${lab}</span>
        <div class="rcap-call-b">
          <span class="rcap-who">${c.key ? deskGlyph(c.key, 12) : ""}<b>${esc(who)}</b>${c.mu ? `<i>${esc(c.mu)}</i>` : ""}</span>
          ${c.call ? `<b class="rcap-side ${/under/i.test(c.call) ? "ou-under" : /over/i.test(c.call) ? "ou-over" : ""}">${esc(c.call)}</b>` : ""}
          ${resTxt ? `<span class="rcap-res ${c.result}">${resTxt}</span>` : ""}
        </div>
        ${c.txt ? `<p class="rcap-quote">“${esc(c.txt)}”</p>` : ""}
      </div>`;
    }
    const recapLineRows = (rc: any, max = 4) => rc.lines.slice(0, max).map((l: any) => {
      const rec = l.wl ? `${l.wl.w}–${l.wl.l}${l.wl.p ? `–${l.wl.p}` : ""}` : "";
      const win = rc.winner === l.key;
      return `<button class="rcap-line an-${esc(l.key)}${win ? " won" : ""}" data-an="${esc(l.key)}">
        ${deskGlyph(l.key, 13)}<span class="rcap-nm"><b>${esc((DESK_CAST[l.key] || {}).name || l.key)}</b>${win ? `<span class="rcap-crown">${crownSvg(10)}</span>` : ""}</span>
        ${l.txt ? `<i class="rcap-linetx">${esc(l.txt)}</i>` : ""}
        ${rec ? `<b class="rcap-rec">${rec}</b>` : ""}
      </button>`;
    }).join("");
    // (b) the morning recap card on the home board — fresh content every day.
    function deskRecapCard() {
      const rc = latestDeskRecap();
      if (!rc) return "";
      const winnerCast = rc.winner && DESK_CAST[rc.winner] ? DESK_CAST[rc.winner] : null;
      const head = rc.headline || recapWinnerLineTxt(rc) || "The desk, graded overnight";
      return `<section class="rcapcard${rc.winner ? ` an-${esc(rc.winner)}` : ""}" aria-label="Last night at the desk">
        <div class="rcap-h">
          <span class="rcap-k">◆ Last night at the desk</span>
          ${rc.date ? `<span class="rcap-date">${esc(recapDateTxt(rc.date))}</span>` : ""}
        </div>
        <div class="rcap-hero">
          ${winnerCast ? `<span class="rcap-glyph an-${esc(rc.winner)}" data-an="${esc(rc.winner)}" role="button" tabindex="0"><span class="rcap-glyph-crown">${crownSvg(13)}</span>${deskGlyph(rc.winner, 22)}</span>` : ""}
          <div class="rcap-head"><b>${esc(head)}</b>${rc.note ? `<i>${esc(rc.note)}</i>` : ""}</div>
        </div>
        ${rc.lines.length ? `<div class="rcap-lines">${recapLineRows(rc)}</div>` : ""}
        ${recapCallRow(rc.best, "best")}
        ${recapCallRow(rc.worst, "worst")}
      </section>`;
    }
    // (c) Insights: the last 14 nights, browsable.
    function deskRecapSection() {
      const all = deskRecapsAll().slice(0, 14);
      if (!all.length) return "";
      const night = (rc: any, open: boolean) => {
        const winnerNm = rc.winner && DESK_CAST[rc.winner] ? DESK_CAST[rc.winner].name : "";
        return `<details class="rcap-day"${open ? " open" : ""}>
          <summary>
            <span class="pp-date">${esc(recapDateTxt(rc.date) || "Night desk")}</span>
            ${winnerNm ? `<span class="rcap-day-win an-${esc(rc.winner)}">${crownSvg(10)}${deskGlyph(rc.winner, 11)}<b>${esc(winnerNm)}</b></span>` : `<span class="pp-wl dim">no winner called</span>`}
            <span class="pp-caret" aria-hidden="true">›</span>
          </summary>
          <div class="rcap-day-b">
            ${rc.headline ? `<div class="rcap-day-head">${esc(rc.headline)}</div>` : ""}
            ${rc.lines.length ? `<div class="rcap-lines">${recapLineRows(rc)}</div>` : ""}
            ${recapCallRow(rc.best, "best")}
            ${recapCallRow(rc.worst, "worst")}
            ${rc.note ? `<div class="chh-note">${esc(rc.note)}</div>` : ""}
          </div>
        </details>`;
      };
      return `<div class="ixc rcapsec" id="desk-recaps">
        <div class="ixc-h">Last night at the desk</div>
        <div class="ixc-sub">Every night the desk grades itself — a winner, the best call, and the worst call owned out loud. The last ${all.length === 1 ? "night" : `${all.length} nights`}, browsable.</div>
        ${all.map((rc: any, i: number) => night(rc, i === 0)).join("")}
      </div>`;
    }
    // Insights: the desk, ranked — per-analyst records + the consensus-state record.
    function analystRecordSection() {
      const rows = deskRecordRows();
      if (!rows.length) return "";
      const ranked = rows.slice().sort((a: any, b: any) =>
        ((b.roi == null ? -9 : b.roi) - (a.roi == null ? -9 : a.roi)) || ((b.hit || 0) - (a.hit || 0)));
      const cards = ranked.map((r: any, i: number) => `
        <button class="dskrec-card an-${esc(r.key)}" data-an="${esc(r.key)}">
          <span class="dskst-rank">${i + 1}${["st", "nd", "rd", "th"][Math.min(i, 3)]}</span>
          <span class="dskst-id">${deskGlyph(r.key, 16)}<span class="dskst-nm"><b>${esc(r.name)}</b><i>${esc(r.title)}</i></span></span>
          <span class="dskrec-stats"><b>${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}</b>${r.hit != null ? `<i>${(r.hit * 100).toFixed(1)}% hit</i>` : ""}${r.roi != null ? `<i class="${r.roi >= 0 ? "pos" : "neg"}">${bRoi(r.roi)} ROI</i>` : ""}${r.n ? `<i class="dim">${r.n} calls</i>` : ""}</span>
          ${deskL10Dots(r.last10)}
        </button>`).join("");
      const ch = consensusHistoryRows();
      const chRows = ch.map((r: any) => {
        const lab = r.state === "UNANIMOUS" ? "All four agree" : r.state === "MAJORITY" ? "3–1 majority" : "Desk split";
        return `<div class="chh-row ${r.state.toLowerCase()}"><span class="chh-lab">${lab}</span><b>${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}</b>${r.hit != null ? `<i>${(r.hit * 100).toFixed(0)}%</i>` : ""}${r.roi != null ? `<i class="${r.roi >= 0 ? "pos" : "neg"}">${bRoi(r.roi)}</i>` : ""}<span class="chh-n">${r.n} games</span></div>`;
      }).join("");
      return `<div class="ixc dskrec" id="analyst-record">
        <div class="ixc-h">The desk, ranked</div>
        <div class="ixc-sub">Four analysts call every game independently. Each one's calls are graded against the real final — this is the competition scoreboard.</div>
        <div class="dskrec-list">${cards}</div>
        ${chRows ? `<div class="chh"><div class="chh-h">When the desk agrees</div>${chRows}<div class="chh-note">The same games seen four ways — the states overlap with nothing else and are graded on the desk's own calls.</div></div>` : ""}
      </div>`;
    }
    // ═══════════ THE PATTERNS — record.patterns → what the desk's history actually says ═══════════
    // The backend serves record.patterns { live_era, reconstructed_era, highlights[] } —
    // plain-English pattern lines ("When all four agree, the game has gone the other way
    // 54% of the time"), each with its sample size and which era measured it. This is the
    // site's intellectual centerpiece: rendered like revelations, captioned like science.
    // Every reader is FULLY DEFENSIVE — absent/malformed ⇒ []/null and no surface renders.
    function patternsRaw() {
      for (const d of [betaLiveData, betaData, livePayload, payload]) {
        const p = d && (d as any).record && (d as any).record.patterns;
        if (p && typeof p === "object") return p;
      }
      return null;
    }
    // one era block → { key, label, n, since, note } (or null)
    function normPatternEra(key: string, e: any) {
      if (!e || typeof e !== "object") return null;
      return {
        key,
        label: humanNote(e.label) || (key === "live" ? "Live era" : "Reconstructed era"),
        n: Math.max(0, Math.round(Number(e.n != null ? e.n : e.n_games) || 0)),
        since: String(e.since || e.start || e.start_date || "").slice(0, 10),
        note: humanNote(e.note != null ? e.note : e.what),
      };
    }
    function patternEras() {
      const p = patternsRaw();
      if (!p) return { live: null, recon: null };
      return {
        live: normPatternEra("live", p.live_era != null ? p.live_era : p.live),
        recon: normPatternEra("reconstructed", p.reconstructed_era != null ? p.reconstructed_era : p.reconstructed),
      };
    }
    // one highlight, whatever shape it arrived in → a stable object (or null).
    // Tolerated: a bare string; { line|text|headline, n, era, kind, analysts|pair|keys,
    // record {win,loss}|"12-8", pct|rate, note }.
    function normPatternItem(x: any) {
      if (x == null) return null;
      if (typeof x === "string") { const t = humanNote(x); return t ? { text: t, n: 0, era: "", kind: "", keys: [], wl: null, note: "" } : null; }
      if (typeof x !== "object") return null;
      const text = humanNote(x.line != null ? x.line : (x.text != null ? x.text : (x.headline != null ? x.headline : x.pattern)));
      if (!text) return null;
      // which analysts the pattern is about (pair patterns carry two)
      const rawKeys = Array.isArray(x.analysts) ? x.analysts : Array.isArray(x.pair) ? x.pair : Array.isArray(x.keys) ? x.keys : [];
      const keys: string[] = [];
      rawKeys.forEach((k: any) => { const a = anKeyOf(k); if (a && DESK_CAST[a] && keys.indexOf(a) < 0) keys.push(a); });
      // also mine the sentence itself so pair cards get their glyphs even without a keys field
      if (!keys.length) {
        const m = text.toLowerCase().match(/vega|atlas|nova|scout/g);
        if (m) m.forEach((k: string) => { if (keys.indexOf(k) < 0) keys.push(k); });
      }
      const wl = wlParse(x.record != null ? x.record : (x.wl != null ? x.wl : null));
      const era = (() => {
        const e = String(x.era || x.basis || "").toLowerCase();
        if (/live/.test(e)) return "live";
        if (/recon|backtest|replay/.test(e)) return "reconstructed";
        return "";
      })();
      const kind = (() => {
        const k = String(x.kind || x.type || "").toLowerCase();
        if (k) return k;
        const t = text.toLowerCase();
        if (/other way|opposite|fade|contrar/.test(t)) return "contrarian";
        if (/all four|unanimous|whole desk/.test(t)) return "unanimous";
        if (keys.length === 2) return "pair";
        if (/split|disagree/.test(t)) return "split";
        return "";
      })();
      return {
        text,
        n: Math.max(0, Math.round(Number(x.n != null ? x.n : (x.n_games != null ? x.n_games : (wl ? wl.w + wl.l + wl.p : 0))) || 0)),
        era, kind, keys, wl,
        note: humanNote(x.note != null ? x.note : x.caption),
      };
    }
    function patternHighlights() {
      const p = patternsRaw();
      if (!p) return [];
      const out: any[] = []; const seen: any = {};
      const add = (x: any, eraHint = "") => {
        const n = normPatternItem(x);
        if (!n) return;
        if (!n.era && eraHint) n.era = eraHint;
        const id = n.text.slice(0, 80).toLowerCase();
        if (seen[id]) return; seen[id] = 1;
        out.push(n);
      };
      const hl = p.highlights != null ? p.highlights : p.items;
      if (Array.isArray(hl)) hl.forEach((x: any) => add(x));
      else if (hl && typeof hl === "object") Object.values(hl).forEach((x: any) => add(x));
      // eras can carry their own highlight lists too
      [["live", p.live_era], ["reconstructed", p.reconstructed_era]].forEach(([k, e]: any) => {
        if (e && typeof e === "object" && Array.isArray(e.highlights)) e.highlights.forEach((x: any) => add(x, k));
      });
      return out;
    }
    // Typeset a pattern sentence: escape, then set the FIGURES (percentages, W–L records,
    // counts) in the emphasis ink so the revelation reads at a glance. Also lifts an
    // opening "When …," clause into the display-caps lead the cards are built around.
    function patternProse(text: string) {
      let t = esc(text);
      t = t.replace(/(\d+(?:\.\d+)?%)/g, `<b class="pat-num">$1</b>`);
      t = t.replace(/(\d+[–-]\d+(?:[–-]\d+)?)/g, `<b class="pat-num">$1</b>`);
      return t;
    }
    function patternLead(it: any) {
      // an explicit "When …" opening clause becomes the shouted lead
      const m = it.text.match(/^(when [^,—.]{3,48})[,—.]/i);
      if (m) return m[1].toUpperCase();
      if (it.kind === "unanimous") return "WHEN THEY ALL AGREE";
      if (it.kind === "contrarian") return "THE CONTRARIAN READ";
      if (it.kind === "split") return "WHEN THE DESK SPLITS";
      if (it.kind === "pair" && it.keys.length === 2)
        return `${String((DESK_CAST[it.keys[0]] || {}).name || it.keys[0]).toUpperCase()} + ${String((DESK_CAST[it.keys[1]] || {}).name || it.keys[1]).toUpperCase()} TOGETHER`;
      return "THE PATTERN";
    }
    // the body = the sentence minus a lifted lead clause (keeps the reveal from repeating)
    function patternBody(it: any) {
      const m = it.text.match(/^(when [^,—.]{3,48})([,—.]\s*)(.+)$/i);
      const body = m ? m[3] : it.text;
      return patternProse(body.charAt(0).toUpperCase() + body.slice(1));
    }
    const PATTERN_MIN_N = 25;
    function patternCard(it: any, big = false) {
      const glyphs = it.keys.length && it.keys.length <= 2
        ? `<span class="pat-glyphs">${it.keys.map((k: string) => `<i class="pat-g an-${esc(k)}">${deskGlyph(k, big ? 15 : 13)}</i>`).join("")}</span>`
        : `<span class="pat-glyphs all">${DESK_ORDER.map((k) => `<i class="pat-g an-${esc(k)}">${deskGlyph(k, big ? 12 : 10)}</i>`).join("")}</span>`;
      const eraChip = it.era === "live"
        ? `<span class="pat-era live">live era</span>`
        : it.era === "reconstructed" ? `<span class="pat-era recon">replayed era</span>` : "";
      const nChip = it.n ? `<span class="pat-n">n = ${it.n} game${it.n === 1 ? "" : "s"}</span>` : "";
      const smalln = it.n > 0 && it.n < PATTERN_MIN_N ? `<span class="pat-smalln">small sample — a lean, not a law</span>` : "";
      const wlChip = it.wl ? `<span class="pat-wl">${it.wl.w}–${it.wl.l}${it.wl.p ? `–${it.wl.p}` : ""}</span>` : "";
      return `<article class="patcard${big ? " big" : ""}${it.kind ? ` kind-${esc(it.kind)}` : ""}">
        <div class="pat-kick">${glyphs}<span class="pat-lead">${esc(patternLead(it))}</span></div>
        <p class="pat-line">${patternBody(it)}</p>
        <div class="pat-meta">${nChip}${wlChip}${eraChip}${smalln}</div>
        ${it.note ? `<div class="pat-note">${esc(it.note)}</div>` : ""}
      </article>`;
    }
    // HOME: the patterns rail — the boldest reads, swipable, with the deep-dive link.
    function patternsStrip() {
      const items = patternHighlights();
      if (!items.length) return "";
      const cards = items.slice(0, 5).map((it) => patternCard(it)).join("");
      return `<section class="patstrip" aria-label="The patterns">
        <div class="pat-h">
          <span class="pat-k">◆ The Patterns</span>
          <span class="pat-sub">What actually happens when the desk lines up — measured nightly, not vibes</span>
          <button class="pat-all" data-nav="results" aria-label="Every pattern, on Insights">All patterns →</button>
        </div>
        <div class="pat-rail">${cards}</div>
      </section>`;
    }
    // INSIGHTS: the deep dive — every highlight, with the era ledger framing up top.
    function patternsSection() {
      const items = patternHighlights();
      if (!items.length) return "";
      const eras = patternEras();
      const eraRow = (e: any, cls: string) => e
        ? `<div class="pat-erarow ${cls}"><span class="pat-era ${cls}">${esc(e.label)}</span><span class="pat-eratx">${e.n ? `${e.n} games` : ""}${e.since ? `${e.n ? " · " : ""}since ${esc(stratDateTxt(e.since) || e.since)}` : ""}${e.note ? ` — ${esc(e.note)}` : ""}</span></div>`
        : "";
      return `<div class="ixc patsec" id="patterns">
        <div class="ixc-h">The patterns</div>
        <div class="ixc-sub">The desk's history, mined for tendencies — including the uncomfortable ones. When agreement helps, when it hurts, and which pairs are worth listening to. Updated as every night grades.</div>
        ${eraRow(eras.live, "live")}${eraRow(eras.recon, "recon")}
        <div class="pat-grid">${items.map((it) => patternCard(it)).join("")}</div>
        <div class="pat-honest">These are observed tendencies, not laws — most samples are small, the eras are labelled, and a pattern that stops working gets reported here the same night it breaks.</div>
      </div>`;
    }
    // STORIES: the boldest pattern as a full-viewport revelation slide.
    function storyPatternsSlide() {
      const items = patternHighlights();
      if (!items.length) return "";
      const pick0 = items.find((x) => x.kind === "contrarian") || items[0];
      const more = items.length > 1 ? `<div class="sts-substat">${items.length - 1} more pattern${items.length === 2 ? "" : "s"} on Insights</div>` : "";
      return `<div class="sts sts-patterns">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ The Patterns</span></div>
        <div class="sts-patlead">${esc(patternLead(pick0))}</div>
        <h3 class="sts-head pat">${patternBody(pick0)}</h3>
        <div class="pat-meta center">${pick0.n ? `<span class="pat-n">n = ${pick0.n} games</span>` : ""}${pick0.era === "live" ? `<span class="pat-era live">live era</span>` : pick0.era === "reconstructed" ? `<span class="pat-era recon">replayed era</span>` : ""}${pick0.n > 0 && pick0.n < PATTERN_MIN_N ? `<span class="pat-smalln">small sample</span>` : ""}</div>
        ${more}
        <button class="st-cta" data-go="results">Every pattern, graded →</button>
      </div>`;
    }

    // ---- DEV-ONLY DESK MOCK (?deskmock=1 on localhost): synthesizes the analyst fields so
    // the Analyst Desk UI can be exercised before the backend payload lands. NEVER active in
    // production — gated on hostname. Real served fields always win (mock skips games that
    // already carry analysts).
    const DESK_MOCK = typeof location !== "undefined" && /[?&]deskmock=1/.test(location.search) && /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname);
    function applyDeskMock(d: any) {
      if (!DESK_MOCK || !d || !Array.isArray(d.games)) return d;
      try {
        const h = (s: string) => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; };
        // Games that ALREADY carry served analysts: only fill the NEW fields the backend
        // hasn't landed yet (per-game takes + atlas live) — served values always win.
        d.games.forEach((g: any) => {
          if (!g || !Array.isArray(g.analysts)) return;
          const seed2 = h(String(g.game_id || ""));
          g.analysts.forEach((a: any, i: number) => {
            if (!a || a.take != null) return;
            const k = String(a.key || "").toLowerCase();
            const side = /under/i.test(String(a.side || "")) ? "under" : /over/i.test(String(a.side || "")) ? "over" : "";
            if (!side) return;
            const T: any = {
              vega: side === "over" ? "Three sharp books ticked this number up before breakfast — the money already voted over." : "The steam is all on the under side of this number — I go where the sharp money went.",
              atlas: side === "over" ? "My twenty thousand sims keep clearing this total — the runs are in the distribution." : "The sims keep landing short of this line — the run environment just isn't there.",
              nova: side === "over" ? "Games with this exact profile have cleared the number for three straight seasons." : "This profile has died under the total for years — I trust the pattern.",
              scout: side === "over" ? "Two tired arms, a short porch and wind blowing out — that's a runs day." : "Two live arms and a big yard — this has 'pitchers duel' written on it.",
            };
            if (T[k]) a.take = T[k];
          });
          // unified rows carry no status — treat "started in the last ~5h, no final yet" as live
          const fp0 = Date.parse(String(g.first_pitch_utc || ""));
          const liveish = String(g.status || "").toLowerCase() === "live"
            || (isFinite(fp0) && Date.now() - fp0 > 0 && Date.now() - fp0 < 5 * 3600 * 1000 && !(g.final && g.final.home_runs != null));
          if (liveish) {
            const at = g.analysts.find((a: any) => String(a.key || "").toLowerCase() === "atlas");
            if (at && at.live_p_over == null && !at.live_state_note) {
              if ((seed2 % 5) === 0) at.live_state_note = "Rain delay — re-pricing when play resumes";
              else at.live_p_over = Math.max(0.08, Math.min(0.92, 0.5 + (((seed2 >> 4) % 21) - 10) / 40));
              at.as_of = new Date().toISOString();
            }
          }
        });
        d.games.forEach((g: any) => {
          if (!g || Array.isArray(g.analysts)) return;
          const pk = g.pick || {};
          // coherent mock: the desk mostly agrees with the model's side, with real dissent
          const pBase = pk.side ? (/under/i.test(String(pk.side)) ? 0.455 : 0.545) : 0.5;
          const seed = h(String(g.game_id || ""));
          const offs: any = { vega: ((seed % 13) - 6) / 100, atlas: (((seed >> 3) % 15) - 7) / 100, nova: (((seed >> 6) % 11) - 5) / 100, scout: (((seed >> 9) % 17) - 8) / 100 };
          const simP = g.simulator && _fin(g.simulator.p_over);
          g.analysts = DESK_ORDER.map((k) => {
            const p = Math.max(0.35, Math.min(0.68, k === "atlas" && simP != null ? simP : pBase + offs[k]));
            const side = p >= 0.5 ? "over" : "under";
            const takes: any = {
              vega: side === "over" ? "Three sharp books ticked this number up before breakfast — the money already voted over." : "The steam is all on the under side of this number — I go where the sharp money went.",
              atlas: side === "over" ? "My twenty thousand sims keep clearing this total — the runs are in the distribution." : "The sims keep landing short of this line — the run environment just isn't there.",
              nova: side === "over" ? "Games with this exact profile have cleared the number for three straight seasons." : "This profile has died under the total for years — I trust the pattern.",
              scout: side === "over" ? "Two tired arms, a short porch and wind blowing out — that's a runs day." : "Two live arms and a big yard — this has 'pitchers duel' written on it.",
            };
            return { key: k, name: DESK_CAST[k].name, persona_line: { vega: "The sharp books moved first — I follow the money.", atlas: "Twenty thousand sims say the runs are there.", nova: "This profile has cashed for years.", scout: "Two tired arms and a short porch — I like runs." }[k], take: takes[k], side, p_over: p, conviction: p >= 0.5 ? p : 1 - p, locked: !!pk.locked, wall: pk.lead_time || "T-3h" };
          });
          // ATLAS LIVE mock: live games get the in-game sim read on the atlas row
          if (String(g.status || "").toLowerCase() === "live") {
            const lp = Math.max(0.08, Math.min(0.92, (simP != null ? simP : 0.5) + (((seed >> 4) % 21) - 10) / 40));
            const at = g.analysts.find((a: any) => a.key === "atlas");
            if (at) {
              if ((seed % 5) === 0) { at.live_state_note = "Rain delay — re-pricing when play resumes"; }
              else { at.live_p_over = lp; }
              at.as_of = new Date().toISOString();
            }
          }
          const nO = g.analysts.filter((a: any) => a.side === "over").length;
          const nU = 4 - nO;
          const state = nO === 4 || nU === 4 ? "UNANIMOUS" : nO === nU ? "SPLIT" : "MAJORITY";
          g.consensus = { state, majority_side: nO >= nU ? "over" : "under", n_over: nO, n_under: nU };
          const mu = g.simulator && _fin(g.simulator.sim_mu) != null ? Number(g.simulator.sim_mu) : 8.6;
          const hm = Math.round(mu * 0.54), aw = Math.max(0, Math.round(mu) - hm);
          g.diamondedge = {
            action: state === "UNANIMOUS" ? "PLAY" : state === "MAJORITY" ? "LEAN" : "AVOID",
            rationale_line: state === "UNANIMOUS" ? "All four reached the same side independently — that agreement is the play." : state === "MAJORITY" ? "Three of four line up — a lean, not a full play." : "The desk is split — we pass.",
            spread_call: g.spread && g.spread.side ? { side: g.spread.side, line: g.spread.line, rationale_line: "The run line follows the same read." } : null,
            predicted_score: { away: aw, home: hm, source: "ATLAS" },
          };
        });
        d.record = d.record || {};
        if (!d.record.analysts) {
          const mk = (w: number, l: number, roi: number) => ({ n: w + l, win: w, loss: l, push: 0, hit_rate: w / (w + l), roi, last10: Array.from({ length: 10 }, (_, i) => ((h(String(i * 7 + w)) % 10) < 5 ? "W" : "L")) });
          d.record.analysts = { vega: mk(31, 24, 0.062), atlas: mk(29, 26, 0.018), nova: mk(27, 27, -0.021), scout: mk(25, 30, -0.055) };
        }
        if (!d.record.consensus_history) d.record.consensus_history = { unanimous: { n: 18, win: 12, loss: 6, push: 0, hit_rate: 0.667, roi: 0.21 }, majority: { n: 41, win: 22, loss: 19, push: 0, hit_rate: 0.537, roi: 0.012 }, split: { n: 24, win: 11, loss: 13, push: 0, hit_rate: 0.458, roi: -0.09 } };
        // ---- the-desk-comes-alive mocks (nightly recap / rivalries / weekly race) ----
        if (!d.record.desk_recaps && !d.record.desk_recap) {
          const mkNight = (dt: string, w: string, seedN: number) => ({
            date: dt, winner: w,
            headline: `${DESK_CAST[w].name} takes the night.`,
            analysts: DESK_ORDER.map((k, i) => ({ key: k, win: 2 + ((seedN + i) % 3), loss: (seedN + i * 2) % 3, line: k === w ? "Read the slate like a book." : ["Half a run short all night.", "The pattern held — the prices didn't.", "Two bullpens betrayed the read."][i % 3] })),
            best_call: { analyst: w, matchup: "NYY @ BOS", side: "over", line: 9.5, result: "win", note: "Called the runs before the books moved — final 12." },
            worst_call: { analyst: DESK_ORDER[(DESK_ORDER.indexOf(w) + 2) % 4], matchup: "LAD @ SD", side: "under", line: 8, result: "loss", note: "Owned it: the wind report was wrong and so was I." },
            consensus_note: "The desk went 3-for-4 when at least three voices agreed.",
          });
          d.record.desk_recaps = [0, 1, 2, 3, 4].map((i) => mkNight(shiftDate(todayISO(), -(i + 1)), DESK_ORDER[(h(String(i * 13)) >>> 2) % 4], (h(String(i)) >>> 3) % 7));
          d.record.desk_recap = d.record.desk_recaps[0];
        }
        if (!d.record.head_to_head) d.record.head_to_head = [
          { a: "atlas", b: "nova", a_wins: 7, b_wins: 4, push: 1, n: 12 },
          { a: "vega", b: "scout", a_wins: 5, b_wins: 5, n: 10 },
          { a: "vega", b: "atlas", a_wins: 3, b_wins: 6, n: 9 },
          { a: "nova", b: "scout", a_wins: 4, b_wins: 2, n: 6 },
        ];
        if (!d.record.weekly_standings) d.record.weekly_standings = {
          week_start: shiftDate(todayISO(), -3), analyst_of_the_week: "scout",
          rows: [
            { key: "scout", win: 5, loss: 1, roi: 0.31 },
            { key: "vega", win: 4, loss: 2, roi: 0.12 },
            { key: "atlas", win: 3, loss: 3, roi: -0.02 },
            { key: "nova", win: 2, loss: 4, roi: -0.14 },
          ],
        };
        if (!d.record.patterns) d.record.patterns = {
          live_era: { label: "Live era", n: 58, since: shiftDate(todayISO(), -24), note: "calls served on the board" },
          reconstructed_era: { label: "Reconstructed era", n: 329, since: "2026-04-01", note: "the same rules replayed at the walls" },
          highlights: [
            { kind: "contrarian", line: "When all four agree, the game has gone the other way 54% of the time.", n: 61, era: "reconstructed", record: { win: 28, loss: 33 } },
            { kind: "pair", pair: ["atlas", "vega"], line: "Atlas and Vega together have cashed 61% when they land on the same side.", n: 38, era: "reconstructed" },
            { kind: "split", line: "A 2–2 split desk has been a coin flip — 50.8% — exactly as a split should be.", n: 65, era: "reconstructed" },
            { kind: "pair", pair: ["nova", "scout"], line: "When Nova fades Scout, Nova has taken the disagreement 7–3.", n: 10, era: "live" },
            { line: "The desk's unders have outperformed its overs by 6 points of hit rate.", n: 112, era: "reconstructed" },
          ],
        };
      } catch {}
      return d;
    }
    // Universal star renderer: unified picks use the 5-star scale; any legacy pick keeps 3.
    function pickStars(pl: any) {
      if (pl && pl.stars != null) return bStars(pl.stars);
      return qDiamonds(qualityOf(pl));
    }
    // The decimal CONFIDENCE SCORE chip ("3.72") shown beside the stars everywhere a pick
    // renders — the model's continuous 0–5 grade (payload `score`), formatted to 2 decimals.
    // Ranks every pick against every other, across and within star tiers.
    function pickGrade(pl: any) {
      if (!pl || pl.grade == null || !(pl.grade > 0)) return "";
      return `<i class="pgrade">${Number(pl.grade).toFixed(2)}</i>`;
    }
    // A pass's sub-2.00 score, muted — passes carry a score too (the model rates every row).
    function passGrade(scoreVal: any) {
      if (scoreVal == null || isNaN(Number(scoreVal)) || !(Number(scoreVal) > 0)) return "";
      return `<i class="pgrade muted">${Number(scoreVal).toFixed(2)}</i>`;
    }
    // The score for a game whether or not it's a playable pick — the model rates every game, so
    // passes can show their muted score on tiles too.
    function gameScore(g: any) {
      const vg = v4GameFor(g);
      if (!vg || !vg.pick) return null;
      return vg.pick.score != null ? Number(vg.pick.score) : null;
    }
    // LOW CONFIDENCE = a Lean-tier pick, OR a spread/ML lean whose price doesn't clear break-even.
    // We still SHOW these (Leon: include the slightest picks) but flag them clearly.
    function isLowConf(pl: any) {
      if (!isPick(pl)) return false;
      if (qualityOf(pl) === "lean") return true;
      return pl.market !== "total" && !pickPlusEV(pl);
    }
    // The confidence word shown next to the stars: Strong / Good / Low confidence.
    function confWord(pl: any) {
      if (isLowConf(pl)) return "Low confidence";
      return Q_LABEL[qualityOf(pl)] || "";
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
      // Weave the score BETWEEN the logos for live/final; a quiet "@" pre-game.
      const gs = gameState(g);
      const sc = gs.score;
      const hasScore = (gs.kind === "live" || gs.kind === "final") && sc && sc.split && sc.home != null;
      const aw = gs.kind === "final" && sc && sc.away > sc.home, hm = gs.kind === "final" && sc && sc.home > sc.away;
      const mid = hasScore
        ? `<span class="hi-score${gs.kind === "final" ? " final" : ""}"><b class="${aw ? "win" : ""}">${num(sc.away, 0)}</b><span class="hi-dash">–</span><b class="${hm ? "win" : ""}">${num(sc.home, 0)}</b></span>`
        : `<span class="hi-at">@</span>`;
      return `<div class="${cls}${hasScore ? " scored" : ""}" style="--t1:${c1};--t2:${c2}" aria-hidden="true">
        <span class="hi-wm">${IC[ic] ? `<svg viewBox="0 0 24 24">${IC[ic].replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>` : ""}</span>
        <div class="hi-mu">
          <span class="${crestCls}">${gCrest(g, "away")}</span>
          ${mid}
          <span class="${crestCls}">${gCrest(g, "home")}</span>
        </div>
      </div>`;
    }
    // Compose the DiamondEdge Pick directly ONTO a hero image, magazine-cover-line style:
    // a bottom gradient scrim for legibility + the frozen pick as an overlaid cover line.
    // Uses the served article.pick_headline (via pickHeadline) so the image carries the
    // pick the way a magazine cover carries its headline. size: "lead" | "card".
    // teaseOnly (used by the News hero): highlight that we HAVE a confident pick — show the
    // confidence (stars, or blurred dots when unpaid) — but NOT the side/line. The call itself
    // lives on the game page. Keeps the hero about the MATCHUP, not the bet.
    function heroPickCover(g: any, size = "lead", teaseOnly = false) {
      const pl = displayPick(g);
      const locked = pl ? pickLocked(pl, playState(g, pl)) : false;
      const ph = pickHeadline(g);
      // The DISPLAY PICK (v4-first) is the truth; ph is only the served-headline fallback.
      const q = (pl ? qualityOf(pl) : null) || ph.q || "lean";
      const st = pl ? playState(g, pl) : "open";
      const state = pl && pl.action === "TAKE" ? pickStateTxt(g, pl, st) : null;
      const kick = isStarted(g) ? "Pre-Game Pick" : "DiamondEdge Pick";
      if (locked) {
        // Unpaid: confidence is BLURRED and the pick is hidden — the whole draw is unlocking it.
        return `<div class="hpc hpc-${size} locked" data-up="1"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ ${esc(kick)}</span><span class="hpc-conf blur" aria-hidden="true">●●●●●</span><span class="hpc-lock">${lockSvg} ${esc(unlockCtaTxt())}</span></div></div>`;
      }
      // No pick: when v4 covers the game its verdict is final (never fall back to a stale
      // stale served headline); otherwise the served headline may still carry the call.
      if (!isPick(pl) && (v4GameFor(g) || !ph.has)) {
        const pln = passLineTxt(g);
        return `<div class="hpc hpc-${size} pass"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ The Verdict</span><b class="hpc-txt">Pass${pln ? ` — ${pln} held no edge` : ""}</b></div></div>`;
      }
      if (teaseOnly) {
        // News-feed cover: STARS + GRADE + THE SELECTION — no "Lean"/"Low confidence" words,
        // the star count IS the confidence.
        const selTxt = pl && pl.side ? `${esc(String(pl.side))}${pl.price != null ? ` <em>${fmtOdds(pl.price)}</em>` : ""}` : "";
        return `<div class="hpc hpc-${size} q-${q} tease"><div class="hpc-scrim"></div>
          <div class="hpc-line">
            <span class="hpc-k">◆ ${esc(kick)}</span>
            <div class="hpc-pickrow"><span class="hpc-stars">${pickStars(pl)}${pickGrade(pl)}</span>${selTxt ? `<b class="hpc-txt">${selTxt}</b>` : ""}${state ? `<span class="hpc-res ${state.cls}">${state.txt}</span>` : ""}</div>
          </div></div>`;
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
          <div class="hpc-pickrow"><b class="hpc-txt">${bare}</b><span class="hpc-stars">${pickStars(pl)}</span>${state ? `<span class="hpc-res ${state.cls}">${state.txt}</span>` : ""}</div>
        </div></div>`;
    }
    // A hero/matchup headline that HYPES the game WITHOUT revealing the pick. Prefers the
    // served article headline but strips any leading pick-lean clause ("Give us the OVER —
    // Angels chase a skid" → "Angels chase a skid"); falls back to a plain matchup framing.
    const PICK_WORDS = /\b(over|under|moneyline|money line|run ?line|spread|first ?5|f5|cover|take the|give us|back the|ride the|lay the|the pick)\b|[+-]\d{2,3}\b|\b\d+\.5\b/i;
    // Deterministic per-game phrasing pick (varies the slate, stable per game).
    function hVar(g: any, opts: string[]) {
      if (!opts.length) return "";
      let h = 0; const gid = String((g && g.game_id) || "");
      for (let i = 0; i < gid.length; i++) h = (h * 31 + gid.charCodeAt(i)) & 0x7fffffff;
      return opts[h % opts.length];
    }
    // A COMPELLING composed headline from real data — never a bare "PHI @ KC". Angles, in
    // priority order: live score story → final result → hot/cold streak → pitching duel →
    // an honest matchup line with texture.
    function composedMatchupHeadline(g: any) {
      const away = g.away_team || g.away_abbr, home = g.home_team || g.home_abbr;
      const A = teamShort(away), H = teamShort(home);
      const gs = gameState(g); const sc = gs.score;
      if (gs.kind === "final" && sc && sc.split && sc.home != null) {
        const homeWon = sc.home > sc.away;
        const W = homeWon ? H : A, L = homeWon ? A : H;
        const hi = Math.max(sc.home, sc.away), lo = Math.min(sc.home, sc.away);
        if (hi === lo) return `${A} and ${H} finish level at ${hi}`;
        return hVar(g, [`${W} put away ${L}, ${hi}–${lo}`, `${W} handle ${L} ${hi}–${lo}`, `${W} get it done ${hi}–${lo} over ${L}`, hi - lo >= 5 ? `${W} run away from ${L}, ${hi}–${lo}` : `${W} edge ${L} in a ${hi}–${lo} fight`]);
      }
      if (gs.kind === "live" && sc && sc.split && sc.home != null) {
        if (sc.home === sc.away) return `${A} and ${H} all square at ${num(sc.home, 0)}`;
        const ldr = sc.home > sc.away ? H : A, tr = sc.home > sc.away ? A : H;
        const per = gs.label && gs.label !== "Live" ? ` — ${gs.label}` : "";
        return hVar(g, [`${ldr} out in front of ${tr}, ${Math.max(sc.home, sc.away)}–${Math.min(sc.home, sc.away)}${per}`, `${ldr} lead ${tr} ${Math.max(sc.home, sc.away)}–${Math.min(sc.home, sc.away)}${per}`]);
      }
      // pre-game angles from streaks + pitchers
      const st = g.streaks || {}; const hs = (st.home || {}) as any, as0 = (st.away || {}) as any;
      const wsH = hs.win_streak, wsA = as0.win_streak;
      const hotSide = wsH && wsH.result === "W" && wsH.n >= 3 ? "home" : wsA && wsA.result === "W" && wsA.n >= 3 ? "away" : null;
      const coldSide = wsH && wsH.result === "L" && wsH.n >= 3 ? "home" : wsA && wsA.result === "L" && wsA.n >= 3 ? "away" : null;
      const opts: string[] = [];
      if (hotSide && coldSide && hotSide !== coldSide) {
        const hot = hotSide === "home" ? H : A, cold = coldSide === "home" ? H : A;
        const hn = (hotSide === "home" ? wsH : wsA).n, cn = (coldSide === "home" ? wsH : wsA).n;
        opts.push(`Red-hot ${hot} meet a ${cold} side that's dropped ${cn} straight`, `${hot} bring ${hn} wins in a row into a date with slumping ${cold}`);
      } else if (hotSide) {
        const hot = hotSide === "home" ? H : A, other = hotSide === "home" ? A : H, hn = (hotSide === "home" ? wsH : wsA).n;
        opts.push(hotSide === "home" ? `${hot} ride a ${hn}-game heater into a home date with ${other}` : `${hot} carry a ${hn}-game win streak into ${other} territory`);
      } else if (coldSide) {
        const cold = coldSide === "home" ? H : A, other = coldSide === "home" ? A : H, cn = (coldSide === "home" ? wsH : wsA).n;
        opts.push(`${cold} look to stop the bleeding — ${cn} straight losses — against ${other}`, `${cold} chase a reset against ${other} after ${cn} losses running`);
      }
      const pit = (g.pregame_intel || {}).pitchers || {};
      const ap = (pit.away || {}).name, hp = (pit.home || {}).name;
      const last = (n: any) => String(n || "").trim().split(/\s+/).pop();
      if (ap && hp) opts.push(`${last(ap)} takes on ${last(hp)} as ${A} visit ${H}`, `It's ${last(ap)} against ${last(hp)} when ${A} roll into ${H}`);
      const recA = as0.record_l15, recH = hs.record_l15;
      if (recA && recH) opts.push(`${A} (${recA} last 15) and ${H} (${recH}) collide`);
      opts.push(`${A} and ${H} square up with the season series on the line`.replace(" with the season series on the line", ""), `${A} come calling on ${H}`);
      return hVar(g, opts);
    }
    function matchupHeadline(g: any, p: any) {
      let h = cleanBlurb((g ? (gameArticle(g)?.headline || "") : "") || "");
      if (h) {
        const parts = h.split(/\s*[—–:]\s*/);
        if (parts.length > 1 && PICK_WORDS.test(parts[0])) h = parts.slice(1).join(" — ").trim();
        // a served headline that is JUST the matchup ("PHI @ KC") is not a headline — compose one
        const bare = /^[A-Z]{2,4}\s*[@v]s?\.?\s*[A-Z]{2,4}$/i.test(h.trim());
        if (h && !bare && !PICK_WORDS.test(h)) return esc(h);
      }
      if (g) { const c = composedMatchupHeadline(g); if (c) return esc(cleanBlurb(c)); }
      const mu = (p && p.matchup) ? String(p.matchup) : (g ? `${g.away_abbr} @ ${g.home_abbr}` : "");
      return esc(cleanBlurb(mu));
    }
    const leaksPick = (s: string) => PICK_WORDS.test(s) || /\d+(\.\d+)?\s?%/.test(s);
    // A short, GAME-focused hero lede (pitching matchup / storyline) — never the pick or the
    // model's number. Prefers a clean served dek, then the article's first non-pick sentence,
    // then a streak. Returns "" if we can only find pick-flavored copy.
    function gameLede(g: any) {
      if (!g) return "";
      const art = gameArticle(g);
      const dek = cleanBlurb((art && art.dek) || "");
      if (dek && !leaksPick(dek)) return dek;
      const paras = (art && art.paras) || [];
      for (const para of paras) {
        const first = String(para).split(/(?<=[.!?])\s+/)[0] || "";
        if (first && !leaksPick(first)) return cleanBlurb(first);
      }
      const stk = gameStreaks(g)[0];
      if (stk && stk.text && !leaksPick(String(stk.text))) return cleanBlurb(String(stk.text));
      return "";
    }
    // LIVE composite for a hero image: a pulsing LIVE badge + the live score + how the
    // pick is trending, woven onto the cover art (top band, over its own scrim). Shown only
    // for live games; degrades to "" otherwise. Uses live_scores + display_pick.live_status.
    function heroLiveBadge(g: any, size = "lead") {
      const gs = gameState(g);
      if (gs.kind !== "live") return "";
      // The score is woven between the crests now; this top band carries just LIVE + inning + trend.
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
        ${per ? `<span class="hlb-score"><i>${per}</i></span>` : ""}
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
      // Prefer v3's RECONCILED per-team expected final so the bars agree with the pick; else legacy.
      const _v3s = v3Score(g);
      const a = _v3s ? _v3s.away : (ps.away == null ? NaN : Number(ps.away));
      const h = _v3s ? _v3s.home : (ps.home == null ? NaN : Number(ps.home));
      if (isNaN(a) || isNaN(h)) return "";
      const mx = Math.max(a, h, 1);
      const unit = SPORT_UNIT[g.sport] || "points";
      const bar = (ab: any, v: number, win: boolean) =>
        `<div class="pvz-brow"><span class="pvz-ab">${esc(ab)}</span><span class="pvz-track"><span class="pvz-fill ${win ? "win" : ""}" style="width:${Math.max(6, (v / mx) * 100).toFixed(0)}%"></span></span><b class="pvz-v">${num(v, 1)}</b></div>`;
      return `<div class="pvz"><div class="pvz-h">${icon("form", "sm")}Model's expected final</div>
        ${bar(g.away_abbr, a, a > h)}${bar(g.home_abbr, h, h > a)}
        <div class="pvz-foot">~${num(a + h, 1)} ${unit} combined · ${esc(_v3s ? (h > a ? g.home_abbr : g.away_abbr) : (ps.winner_abbr || (h > a ? g.home_abbr : g.away_abbr)))} by ${num(Math.abs(h - a), 1)}</div></div>`;
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

    // (b2) Team records + streaks card: each side's season record + streak from teams_v4
    // (or the served form). "NYY 52-38 · W3". Degrades to nothing if neither side has data.
    function vizTeamRecords(g: any) {
      if (g.sport !== "mlb") return "";
      const fa = teamRecordFor(g, "away"), fh = teamRecordFor(g, "home");
      if ((!fa || (!fa.rec && !fa.streak)) && (!fh || (!fh.rec && !fh.streak))) return "";
      const row = (ab: any, f: any) => {
        if (!f || (!f.rec && !f.streak)) return `<div class="tr-row"><span class="tr-ab">${esc(ab)}</span><span class="tr-rec dim">—</span></div>`;
        return `<div class="tr-row"><span class="tr-ab">${esc(ab)}</span><span class="tr-rec">${f.rec ? esc(f.rec) : ""}${f.rec && f.recIsL15 ? ` <i class="tr-tag">L15</i>` : ""}</span>${f.streak ? `<span class="tr-strk ${f.hot ? "hot" : "cold"}">${esc(f.streak)}</span>` : ""}</div>`;
      };
      return `<div class="pvz"><div class="pvz-h">${icon("trend", "sm")}Records &amp; form</div>
        <div class="tr-rows">${row(g.away_abbr, fa)}${row(g.home_abbr, fh)}</div></div>`;
    }
    // (c) Win-probability meter: model vs market implied, from ml_pick.
    function vizWinProb(g: any) {
      const mp = g.ml_pick || {};
      // Which team the meter is about (ml_pick side, else home). Prefer v3's reconciled win prob for
      // THAT side so the WP coheres with the reconciled score; fall back to ml_pick.our_winprob.
      const sideAbbr = mp.side || g.home_abbr;
      const which: "home" | "away" = sideAbbr === g.away_abbr ? "away" : "home";
      const v3wp = v3WinProb(g, which);
      const our = v3wp != null ? v3wp : (mp.our_winprob != null ? Number(mp.our_winprob) : null);
      let mkt = mp.market_winprob != null ? Number(mp.market_winprob) : null;
      if (mkt == null && mp.price != null) { const d = Number(mp.price); if (d > 1 && d < 100) mkt = 1 / d; }
      if (our == null) return "";
      const side = esc(sideAbbr);
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

    // ── PITCHERS FEED: season ERA + last-starts game log for both probables ──
    // Generated by the model box (public/pitchers_v4.json, Supabase 'pitchers_v4' fresher).
    let pitchersData: any = null, pitchersAt = 0;
    async function loadPitchers() {
      if (pitchersData && Date.now() - pitchersAt < 10 * 60 * 1000) return pitchersData;
      let d: any = null;
      // Supabase is freshest but can be slow at boot — race it against a 1.5s timeout,
      // fall back to the bundled file, and let the next call upgrade to the fresh copy.
      try { d = await Promise.race([snap("pitchers_v4"), new Promise((r) => setTimeout(() => r(null), 1500))]); } catch {}
      if (!d || !d.by_game) { try { const r = await fetch("/pitchers_v4.json", { cache: "no-store" }); if (r.ok) d = await r.json(); } catch {} }
      if (d && d.by_game) { pitchersData = d; pitchersAt = Date.now(); try { renderSlate(true); } catch {} }
      return pitchersData;
    }
    const pitcherFeedFor = (g: any, side: "away" | "home") =>
      (pitchersData && pitchersData.by_game && pitchersData.by_game[String(g.game_id)] || {})[side] || null;

    // ---- TEAM RECORDS feed (teams_v4) — season record + streak per team abbr ----
    // Schema: { by_team: { ABBR: { record:"52-38", pct, last10:"6-4", streak:"W3", ... } } }.
    // Loaded at boot like pitchers (Supabase race → static fallback → re-render on arrival).
    // The file may not exist yet on disk — every read degrades to null, so tiles simply fall
    // back to the served g.streaks form. No error when absent.
    let teamsData: any = null, teamsAt = 0;
    async function loadTeams() {
      if (teamsData && Date.now() - teamsAt < 10 * 60 * 1000) return teamsData;
      let d: any = null;
      try { d = await Promise.race([snap("teams_v4"), new Promise((r) => setTimeout(() => r(null), 1500))]); } catch {}
      if (!d || !d.by_team) { try { const r = await fetch("/teams_v4.json", { cache: "no-store" }); if (r.ok) d = await r.json(); } catch {} }
      if (d && d.by_team) { teamsData = d; teamsAt = Date.now(); try { renderSlate(true); } catch {} }
      return teamsData;
    }
    // Season record + streak for a team, from teams_v4 when present, else the served streaks
    // form. Returns { rec, recIsL15, streak, hot } | null (same shape teamForm returns) so the
    // tile renderer can consume either source uniformly.
    function teamRecordFor(g: any, which: "home" | "away") {
      const ab = which === "away" ? g.away_abbr : g.home_abbr;
      const t = teamsData && teamsData.by_team ? (teamsData.by_team[ab] || teamsData.by_team[String(ab || "").toUpperCase()]) : null;
      if (t && typeof t === "object") {
        const rec = typeof t.record === "string" && /^\d+-\d+$/.test(t.record) ? t.record : null;
        const streak = typeof t.streak === "string" && /^[WL]\d+$/.test(t.streak) ? t.streak : null;
        if (rec || streak) return { rec, recIsL15: false, streak, hot: !!(streak && streak[0] === "W") };
      }
      return teamForm(g, which);
    }
    // The pitcher sheet: header (name/team/hand + season line) + the recent-starts table.
    function openPitcherSheet(P: any) {
      if (!P) return;
      const starts = (P.starts || []).slice(0, 8);
      const rows = starts.map((s: any) => `<tr>
        <td>${esc((s.date || "").slice(5))}</td><td>${s.at === "H" ? "vs" : "@"} ${esc(s.opp || "")}</td>
        <td class="num">${s.ip != null ? esc(String(s.ip)) : "—"}</td><td class="num">${s.h ?? "—"}</td><td class="num">${s.er ?? "—"}</td><td class="num">${s.bb ?? "—"}</td><td class="num">${s.k ?? "—"}</td>
        <td class="res ${s.res === "W" ? "won" : s.res === "L" ? "lost" : ""}">${esc(s.res || "ND")}</td></tr>`).join("");
      const html = `
        <div class="gamepage pitcherpage" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(P.name)} — recent starts">
          <div class="gp-bar"><button id="gp-back" class="gp-back" aria-label="Back">←</button><span class="gp-t">${esc(P.name)}</span></div>
          <div class="gp-scroll">
            <div class="bgame-hero">
              <div class="bgh-mu"><b>${esc(P.name)}</b>${P.throws ? ` <span class="pit-hand">${esc(P.throws)}HP</span>` : ""}</div>
              <div class="bgh-fin">${esc(P.team || "")}${P.era != null ? ` · <b>${num(P.era, 2)} ERA</b>` : ""}${P.wl ? ` · ${esc(P.wl)}` : ""}${P.whip != null ? ` · ${num(P.whip, 2)} WHIP` : ""}${P.k9 != null ? ` · ${num(P.k9, 1)} K/9` : ""}</div>
              <div class="bgh-date">Last ${starts.length} starts</div>
            </div>
            <div class="bgrid-card">
              <div class="bgrid-h">Recent starts</div>
              <div class="bgrid-scroll"><table class="bgrid pitlog"><thead><tr><th>Date</th><th>Opp</th><th>IP</th><th>H</th><th>ER</th><th>BB</th><th>K</th><th>Res</th></tr></thead><tbody>${rows || `<tr><td colspan="8">No starts logged yet this season.</td></tr>`}</tbody></table></div>
            </div>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(() => { const p = $("gamepage"); if (p) p.classList.add("in"); });
      $("gp-back").onclick = () => closeDetail();
    }
    // one delegated click for every pitcher chip/line anywhere in the app
    document.addEventListener("click", async (e: any) => {
      const el = e.target && e.target.closest && e.target.closest("[data-pitcher]");
      if (!el) return;
      e.stopPropagation(); e.preventDefault();
      const [gid, side] = String(el.dataset.pitcher).split("|");
      await loadPitchers();
      const P = (pitchersData && pitchersData.by_game && pitchersData.by_game[gid] || {})[side];
      if (P) openPitcherSheet(P);
    }, true);

    // (e) Pitcher line chips (MLB): starter + ERA as compact chips — tap for the game log.
    function vizPitchers(g: any) {
      const pit = (g.pregame_intel && g.pregame_intel.pitchers) || {};
      // Source each side from the served intel OR the pitchers_v4 feed — either alone is enough.
      const chip = (ab: any, side: "away" | "home") => {
        const p = pit[side] || {};
        const fd = pitcherFeedFor(g, side);
        const name = p.name || (fd && fd.name);
        if (!name) return "";
        const era = p.era != null ? p.era : (fd && fd.era != null ? fd.era : null);
        const line = fd && (fd.wl || fd.whip != null) ? `${fd.wl ? esc(fd.wl) : ""}${fd.whip != null ? ` · ${num(fd.whip, 2)} WHIP` : ""}` : "";
        return `<div class="pit-chip tap" data-pitcher="${esc(String(g.game_id))}|${side}" role="button" tabindex="0"><span class="pit-ab">${esc(ab)}</span><span class="pit-nm">${esc(name)}</span>${era != null ? `<span class="pit-era">${num(era, 2)} ERA</span>` : ""}${line ? `<span class="pit-sub">${line}</span>` : ""}<span class="pit-more">›</span></div>`;
      };
      const a = chip(g.away_abbr, "away"), h = chip(g.home_abbr, "home");
      if (!a && !h) return "";
      return `<div class="pvz"><div class="pvz-h">${icon("pitcher", "sm")}On the mound — tap for recent starts</div><div class="pit-row">${a}${h}</div></div>`;
    }

    // The full data-visual rail for a preview: assemble whichever visuals have data.
    function previewViz(g: any) {
      const parts = [vizPredScore(g), vizTeamRecords(g), vizWinProb(g), vizFormStrip(g), vizPitchers(g), vizH2H(g)].filter(Boolean);
      if (!parts.length) return "";
      return `<div class="pvz-grid">${parts.slice(0, 6).join("")}</div>`;
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
        // AI-tell meta-filler (per ARTICLE_SPEC "Remove meta/AI-tell filler"). Kill the whole
        // known scaffolding sentence first ("The … storyline, translated into what it means for
        // the number."), then any residual fragments of the same tells.
        .replace(/\bthe\b[^.?!]*\bstoryline,\s*translated into what it means for (?:the )?(?:number|line|bet)s?\b[^.?!]*[.?!]/gi, "")
        .replace(/,?\s*translated into what it means for (?:the )?(?:number|line|bet)s?\b[.,]?/gi, "")
        .replace(/,?\s*(?:brought|comes?|coming|distilled|translated)\s+to the board\b[.,]?/gi, "")
        .replace(/\btranslated into\b/gi, "")
        .replace(/\bto the board\b/gi, "")
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
    // Once a game is live or final, the pick label must make clear it was FROZEN before
    // first pitch — never made mid-game. Pre-game it's the branded "DiamondEdge Pick".
    const isStarted = (g: any) => { const s = String((g && g.status) || "pre").toLowerCase(); return s === "live" || s === "final"; };
    const pickLabel = (g: any) => (isStarted(g) ? "◆ Pre-Game Pick" : "◆ DiamondEdge Pick");
    // Short tile kicker — the board is already branded (section headers + featured card), so
    // per-tile strips carry a compact orienting label instead of the full brand line.
    const pickLabelShort = (g: any) => (isStarted(g) ? "◆ Pre-Game Pick" : "◆ The Pick");
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
      const _v3s = v3Score(g);
      if (pl && pl.action === "TAKE") {
        paras.push(...whySentences(g, pl).slice(0, 2));
      } else if (_v3s || (ps.home != null && ps.away != null)) {
        const aw = _v3s ? _v3s.away : Number(ps.away), hm = _v3s ? _v3s.home : Number(ps.home);
        paras.push(`Our model's expected final is ${g.away_abbr} ${num(aw, 1)}–${num(hm, 1)} ${g.home_abbr}. The books' numbers land close to ours across every market, so there's no DiamondEdge Pick here.`);
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
    // DEFAULT = GAMES (Leon, 2026-07-25): the app opens on the Games board — the product IS
    // the picks. The brand logo (and the dock's News tab) still goes to the News front.
    let tab = "games";              // "today" | "games" | "results" | "research" | "beta" | "settings" | "upgrade" | "account"
    const TABS = ["today", "games", "results", "research", "beta", "settings", "upgrade", "account"];
    let accountMode = "menu";       // account-view sub-state: "menu" | "signin" | "subscribe"
    let league = "mlb";             // selected league
    let curDate = todayISO();       // selected date (ISO)
    let histOpen = false;           // history range panel open
    let rangeFrom = "", rangeTo = "";
    let rangeMode = false;          // showing range results
    let rangeGames: any[] = [];     // {date,games}
    // The games the slate ACTUALLY rendered this pass — including synthesized future tiles that
    // exist only in the v4 live feed (not in `payload`). findGame() falls back to this so a tap on
    // a synthesized tomorrow tile can open its detail (previously findGame only searched payload,
    // so those tiles were dead — no detail ever opened).
    let slateGames: any[] = [];
    let payload: any = null;        // current day's payload
    // LOADING SHIM (Leon): the board must NEVER flash "No games" while a schedule/pick
    // feed is still in flight — dark shimmer skeletons hold the space until the day's
    // load actually resolves (empty OR full). True until the first loadDay settles.
    let dayLoading = true;
    let newsMode: "stories" | "grid" = (() => { try { return localStorage.getItem("de_newsmode") === "grid" ? "grid" : "stories"; } catch { return "stories"; } })();
    let newsFeed: any = null;       // live sports-news feed (news_feed key, ~20-min refresh)
    let livePayload: any = null;    // the live board (today's key) — cached for past-day merges
    let indexData: any = null;      // pregame_picks_index
    let detail: any = null;         // open detail game
    let detailTab = "preview";      // detail page tab: "preview" | "live"
    let liveScores: any = null;     // latest live_scores snapshot (fresh score overlay)
    let liveDetail: any = null;     // latest live_detail snapshot (box scores) — polled while live
    let liveDetailTried = false;    // avoid hammering a missing live_detail key

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
      // Let users look AHEAD up to 5 days — picks may not be published yet (a banner says so).
      const futureCap = shiftDate(todayISO(), 5);
      if (maxDate < futureCap) maxDate = futureCap;
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
      // Keep the hero's live tracking read in step with the fresh score (else it goes stale
      // vs the score right above it). Only the served-meter-absent fallback lives here.
      const trendEl = page.querySelector(".gp-trend");
      if (trendEl && gs.kind === "live") {
        const lead = displayPick(g) || bestPlay(g);
        const leadLocked0 = lead ? pickLocked(lead, playState(g, lead)) : false;
        const trend = lead && !leadLocked0 ? (liveHitOdds(g, lead, "full") || liveTrackCard(g, lead, "hero")) : "";
        // keep ATLAS LIVE in step with each refresh (same lock gate as the first paint)
        const atl = !leadLocked0 ? atlasLiveChip(g, "full") : "";
        if (trend || atl) trendEl.innerHTML = `${trend}${atl}`;
      }
      // also refresh the box score from the (possibly newer) live_detail
      pollLiveDetail();
    }

    // ── GAME-TIME ORDER (Leon, 2026-07-25): within every section (live/upcoming/final),
    // games sort by REAL first-pitch time ascending. Epoch when parseable (handles mixed
    // ISO/absent formats that broke plain string compares — finals especially), string
    // compare only as the last resort for same/unknown timestamps.
    const startMsOf = (g: any) => { const t = firstPitchTs(g); return t != null ? t : Number.MAX_SAFE_INTEGER; };
    function byStartTime(a: any, b: any) {
      const d = startMsOf(a) - startMsOf(b);
      if (d) return d;
      const ta = String(a.start_ts || a.start_time || ""), tb = String(b.start_ts || b.start_time || "");
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    }
    function gamesForLeague(p: any, lg: string, dateISO?: string) {
      const forDate = dateISO || curDate;
      const all = (p && p.games) || [];
      // "All" — the merged board across every league, live-first. Reuse the per-league
      // path (date filtering + live-first sort already applied per league), then re-merge
      // and re-sort so LIVE games from any sport rise to the top of one combined list.
      if (lg === "all") {
        const merged = SPORTS.flatMap((s) => gamesForLeague(p, s, dateISO));
        const ord: any = { live: 0, pre: 1, final: 2 };
        merged.sort((a: any, b: any) =>
          ((ord[(a.status || "pre").toLowerCase()] ?? 1) - (ord[(b.status || "pre").toLowerCase()] ?? 1)) || byStartTime(a, b));
        return merged;
      }
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
          // TODAY means today — not "today onward". Tomorrow's fixtures (the WC board carries
          // them, sometimes tagged to other sports) are reachable via the date picker, not here.
          if (st === "pre") { const d = gameLocalDay(g); return !d || d === t; }
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
      // Sports-app order: LIVE first, then upcoming, then finals — every section in
      // first-pitch order ascending (finals included: earliest game of the day first).
      const ord: any = { live: 0, pre: 1, final: 2 };
      inLg.sort((a: any, b: any) =>
        ((ord[(a.status || "pre").toLowerCase()] ?? 1) - (ord[(b.status || "pre").toLowerCase()] ?? 1)) || byStartTime(a, b));
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
        const per = ca && ca.period_label ? String(ca.period_label) : "";
        // A game the backend still flags "live" is EFFECTIVELY FINAL when its period label says so
        // (Final/Ended/Game Over/FT), or when first pitch was long enough ago that it must be over
        // (MLB rarely runs past ~5h) — clean these up to "Final" instead of a stuck inning.
        const labelFinal = /\b(final|ended|game\s*over|full[-\s]?time|walk[-\s]?off)\b|^\s*f\s*\/?\s*t?\s*$/i.test(per);
        const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
        const ageH = ts ? (Date.now() - new Date(ts).getTime()) / 3600000 : null;
        const staleFinal = ageH != null && ageH > 5;
        if ((labelFinal || staleFinal) && ca && ca.home_score != null && ca.away_score != null) {
          const h = Number(ca.home_score), a = Number(ca.away_score);
          return { kind: "final", label: "Final", time: "", score: { total: h + a, home: h, away: a, margin: h - a, split: true }, si };
        }
        if (ca && ca.home_score != null && ca.away_score != null) {
          const home = Number(ca.home_score), away = Number(ca.away_score);
          return { kind: "live", label: per || "Live", time: t, score: { total: home + away, home, away, margin: home - away, split: true }, si };
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
    function leanMeter(pk: any, kind: string, g?: any) {
      if (!pk) return "";
      const line = pk.line != null ? Number(pk.line) : null;
      // For a total, prefer v3's reconciled number for the tick so it agrees with the pick side; the
      // lean DIRECTION is already sourced from the pick side below (never re-derived from the proj).
      const _v3tot = (kind === "total" && g) ? v3PredTotal(g) : null;
      const proj = _v3tot != null ? _v3tot : (pk.our_proj != null ? Number(pk.our_proj) : null);
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
    function wpLean(pk: any, g?: any) {
      const _v3wp = g ? v3WinProb(g, pk && pk.side === g.away_abbr ? "away" : "home") : null;
      const our = _v3wp != null ? _v3wp : (pk.our_winprob != null ? Number(pk.our_winprob) : null);
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

    // ===================== GAME TILE (the whole slate story) =====================
    // The FROZEN pick a game box shows: prefer the served display_pick (frozen ~1h
    // before start), fall back to the morning de_plays best TAKE. Never re-derived
    // once the game starts — the box is the honest record of what we said pre-game.
    const lineStr = (v: any) => (Number(v) % 1 ? num(v, 1) : num(v, 0));
    function displayPick(g: any) {
      // ONE pick per game: the unified feed's single pick IS the DiamondEdge Pick. If it covers
      // the game and the pick is a PASS, the game is an honest PASS.
      const vg = v4GameFor(g);
      if (vg) {
        const pl = gamePlays(g)["total"];
        return pl && pl.action === "TAKE" ? pl : null;
      }
      // MLB: the unified feed is the ONLY pick source. No legacy fallback — if the feed
      // hasn't loaded or doesn't cover the game, that's a PASS.
      // (The slate re-renders when the feed arrives, so real picks replace passes fast.)
      if (g && g.sport === "mlb") return null;
      const dp = g && g.display_pick;
      if (dp && typeof dp === "object" && String(dp.action || "").toUpperCase() === "TAKE" && dp.side != null
          && String(dp.market || "total").toLowerCase() === "total") {
        const mk = "total";
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
    // THE line for a market, from the same source as the pick itself. When the model covers
    // the game, its cell (take OR pass) carries the line/price it actually judged — that is
    // the number every surface shows, so a pick chip and an odds row can never disagree.
    function v4LineOf(g: any, mk: string) {
      const vg = v4GameFor(g);
      if (!vg) return null;
      const c = v4CellFor(vg, mk);
      if (!c) return null;
      const pl = v4ToPlay(g, c);
      const raw = pl && pl.line != null ? pl.line : (c.market_line != null ? c.market_line : c.pick_line);
      if (raw == null && c.per_side_price == null) return null;
      return { line: raw != null ? Number(raw) : null, price: c.per_side_price != null ? c.per_side_price : null, pl };
    }
    function vegasLine(g: any, mk: string) {
      const v4 = v4LineOf(g, mk);
      if (mk === "spread") {
        if (v4 && v4.line != null) return `${esc(String((v4.pl && v4.pl.side) || g.home_abbr).split(/\s+/)[0])} ${sgn(v4.line)}`;
        const sp = g.spread_pick;
        if (sp && sp.line != null) return `${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, sp))}`;
      } else if (mk === "total") {
        if (v4 && v4.line != null) return `O/U ${num(Math.abs(v4.line))}`;
        const tp = g.total_pick;
        if (tp && tp.line != null) return `O/U ${num(tp.line)}`;
      } else if (mk === "moneyline") {
        if (v4 && v4.pl && v4.pl.side && v4.price != null) return `${esc(String(v4.pl.side))} ${fmtOdds(v4.price)}`;
        const mp = g.ml_pick; const mpr = (mp && mp.prices) || {};
        if (g.sport === "soccer" && mpr.home != null && mpr.draw != null) return `1X2 ${fmtOdds(mpr.home)}·${fmtOdds(mpr.draw)}·${fmtOdds(mpr.away)}`;
        const px = mp ? (mp.price ?? mpr.home ?? mpr.away) : null;
        if (px != null) return `${esc(mp.side || g.home_abbr)} ${fmtOdds(px)}`;
      }
      return "";
    }
    // ===================== PER-TEAM ODDS + FORM (the team rows do the work) =====================
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
      // NOT "LINE PASSED" — that read as "we passed on this line" (the product's other,
      // opposite meaning of the word). This state means the number is gone and the pick
      // can no longer land; say exactly that, in the same words the live read uses.
      if (st === "cooked") return { txt: "✗ NOT LANDING", cls: "lost" };
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
          <div class="pb-main"><span class="pb-dots" aria-hidden="true">●●●● ●</span>${qDiamonds(q)}<span class="pb-unlock">${esc(unlockCtaTxt())}</span></div>
        </div>`;
      }
      const state = pickStateTxt(g, pl, st);
      return `<div class="pickban q-${q} ${st}">
        <div class="pb-top"><span class="pb-brand">${pickLabel(g)}</span>${qDiamonds(q)}</div>
        <div class="pb-main"><span class="pb-side">${pickArrow(pl)} ${esc(pl.side || "—")}</span>${pl.price != null ? `<i class="pb-px">${fmtOdds(pl.price)}</i>` : ""}${state ? `<span class="pb-res ${state.cls}">${state.txt}</span>` : ""}</div>
        ${pickMadeMeta(pl)}
      </div>`;
    }

    // ── PICK COUNTDOWN: when does this game's next pick check arrive? ──
    // Picks first appear when the book posts (~T-24h); they firm up at the five walls
    // (T-24h/12h/6h/3h/1h). This renders "next check T-6h · in 1h 22m" for upcoming games,
    // ticking live via the shared 60s clock below.
    const WALL_ORDER: [string, number][] = [["T-24h", 864e5], ["T-12h", 432e5], ["T-6h", 216e5], ["T-3h", 108e5], ["T-1h", 36e5]];
    function nextWallInfo(g: any) {
      const fp = firstPitchTs(g);
      if (fp == null) return null;
      const now = Date.now();
      if (now >= fp) return null; // live/final — no countdown
      for (const [lab, ms] of WALL_ORDER) {
        const t = fp - ms;
        if (t > now) {
          const dm = Math.max(1, Math.round((t - now) / 60000));
          const h = Math.floor(dm / 60), m = dm % 60;
          return { label: lab, inTxt: h ? `${h}h ${m}m` : `${m}m`, final: false };
        }
      }
      // inside the last hour: the pick is in its final form
      const dm = Math.max(1, Math.round((fp - now) / 60000));
      return { label: "final form", inTxt: `${dm}m to first pitch`, final: true };
    }
    // Self-contained chip: carries the first-pitch ts + has-pick flag as data attributes
    // so the 60s ticker recomputes without needing the game object.
    function countdownChip(g: any, gs: any) {
      if (!gs || gs.kind !== "pre") return "";
      const fp = firstPitchTs(g);
      const w = nextWallInfo(g);
      if (!w || fp == null) return "";
      const pl = displayPick(g);
      const has = isPick(pl);
      const lead = !has ? `first look` : w.final ? `pick locked in` : `next check ${w.label}`;
      return `<span class="pk-count" data-fp="${fp}" data-has="${has ? 1 : 0}">⏱ ${esc(lead)} · ${esc(w.inTxt)}</span>`;
    }
    const wallFromFp = (fp: number) => {
      const now = Date.now();
      if (now >= fp) return null;
      for (const [lab, ms] of WALL_ORDER) {
        const t = fp - ms;
        if (t > now) {
          const dm = Math.max(1, Math.round((t - now) / 60000));
          const h = Math.floor(dm / 60), m = dm % 60;
          return { label: lab, inTxt: h ? `${h}h ${m}m` : `${m}m`, final: false };
        }
      }
      return { label: "final form", inTxt: `${Math.max(1, Math.round((fp - now) / 60000))}m to first pitch`, final: true };
    };
    // shared 60s ticker: refresh every visible countdown chip without re-rendering views
    setInterval(() => {
      document.querySelectorAll(".pk-count[data-fp]").forEach((el: any) => {
        const fp = Number(el.dataset.fp);
        if (!fp) return;
        const w = wallFromFp(fp);
        if (!w) { el.remove(); return; }
        const has = el.dataset.has === "1";
        el.textContent = `⏱ ${!has ? "first look" : w.final ? "pick locked in" : "next check " + w.label} · ${w.inTxt}`;
      });
    }, 60000);

    // Reference card header: a small LEAGUE TAG (left) + a GAME-STATE CHIP pill (right):
    // live inning / start time / "Final". The chip carries the game phase at a glance.
    function leagueTag(g: any) {
      const lg = String(g.sport || "").toLowerCase();
      const comp = g.meta && g.meta.competition ? esc(g.meta.competition) : "";
      return `<span class="t-league"><span class="tl-ic" data-ic="${SPORT_ICON[lg] || "◆"}"></span>${esc(SPORT_LABEL[lg] || lg.toUpperCase())}${comp ? `<span class="tl-comp">${comp}</span>` : ""}</span>`;
    }
    function stateChip(g: any, gs: any) {
      if (gs.kind === "live") {
        const lab = gs.label && gs.label !== "Live" ? gs.label : "LIVE";
        return `<span class="statechip live"><span class="livedot"></span>${esc(lab)}</span>`;
      }
      if (gs.kind === "final") return `<span class="statechip final">Final</span>`;
      // pre: prefer the time; when browsing another day, show that day tag too
      const t = gs.si.hasTime && gs.si.time ? gs.si.time.replace(TZ_ABBR ? " " + TZ_ABBR : " ", "") : (gs.si.date || "TBD");
      const dayTag = gameLocalDay(g) && gameLocalDay(g) !== curDate && gs.si.date ? `${esc(gs.si.date)} · ` : "";
      return `<span class="statechip pre">${dayTag}${esc(t)}</span>`;
    }
    // A scores-app team line: logo · ABBR · form(L15 + streak) · this side's spread(px) + ML · SCORE.
    // The odds live WITH the team so the card needs no separate stacked market strip.
    // Pre-game shows odds; live/final shows the score. Everything degrades independently.
    function tileRow(g: any, which: "away" | "home", gs: any, hideScore = false) {
      const ab = which === "away" ? g.away_abbr : g.home_abbr;
      const sc = gs.score;
      const started = gs.kind !== "pre";
      let scoreHtml = "", winner = false, loser = false;
      if (started && sc && sc.split && sc.home != null) {
        const mine = which === "home" ? sc.home : sc.away;
        const other = which === "home" ? sc.away : sc.home;
        winner = gs.kind === "final" && mine > other;
        loser = gs.kind === "final" && mine < other;
        // score is suppressed here when the big score line above already shows it
        if (!hideScore) scoreHtml = `<span class="t-score${gs.kind === "live" ? " live" : ""}">${num(mine, 0)}</span>`;
      }
      // team record + streak — teams_v4 feed when present ("NYY 52-38 W3"), else served form
      const fm = teamRecordFor(g, which);
      const formHtml = fm
        ? `<span class="t-form">${fm.rec ? `<span class="tf-rec">${esc(fm.rec)}${fm.recIsL15 ? `<i class="tf-tag">L15</i>` : ""}</span>` : ""}${fm.streak ? `<span class="tf-strk ${fm.hot ? "hot" : "cold"}">${esc(fm.streak)}</span>` : ""}</span>`
        : "";
      // Odds (spread/ML/total) live in the 3-market line row below now, so the team row stays
      // clean: crest · abbr · recent form · score.
      return `<div class="t-row ${winner ? "winner" : ""} ${loser ? "loser" : ""}">
        <span class="t-crest">${gCrest(g, which)}</span>
        <span class="t-ab">${esc(ab)}</span>
        ${formHtml}
        <span class="t-rsp"></span>
        ${scoreHtml}
      </div>`;
    }

    // The model's directional READ on a PASS game — enough to fill the pick slot with a
    // calm "not confident" note instead of blank space. Derives from served fields:
    // total our_proj vs line (over/under lean), else ml our_winprob (side lean). Returns
    // a short phrase or null. NEVER a call — it's explicitly a non-pick.
    function passRead(g: any) {
      // model-covered games speak ONLY through the model — no legacy directional leans
      if (v4GameFor(g)) return null;
      const tp = g.total_pick;
      // Prefer v3's reconciled total for the directional read so it coheres with the shown score.
      const _v3tot = v3PredTotal(g);
      if (tp && tp.line != null && (_v3tot != null || tp.our_proj != null)) {
        const projV = _v3tot != null ? _v3tot : Number(tp.our_proj);
        const diff = projV - Number(tp.line);
        if (Math.abs(diff) >= 0.15) return `leans ${diff > 0 ? "OVER" : "UNDER"} ${num(tp.line)}`;
      }
      const mp = g.ml_pick;
      const _v3wp = mp ? v3WinProb(g, mp.side === g.away_abbr ? "away" : "home") : null;
      if (mp && (_v3wp != null || mp.our_winprob != null)) {
        const wp = _v3wp != null ? _v3wp : Number(mp.our_winprob);
        if (wp >= 0.55 || wp <= 0.45) { const side = wp >= 0.5 ? (mp.side || g.home_abbr) : (mp.side === g.home_abbr ? g.away_abbr : g.home_abbr); return `slight edge ${esc(side)}`; }
      }
      return null;
    }
    // The PASS pick-slot: same footprint as a real pick strip so cards stay uniform height.
    // Muted, empty diamonds (○○○), the model's directional read when we have one.
    function passStrip(g: any) {
      // EVERY game shows a prediction (Leon, 2026-07-24): even when the model wouldn't BET,
      // it always has a read — lead with the side + line, clearly labeled low-confidence.
      // Only 2★+ picks grade into the record; this is the model's lean, not an official pick.
      const vg = v4GameFor(g);
      const pk = vg && vg.pick;
      const side = pk && pk.side ? String(pk.side).toUpperCase() : null;
      const line = pk && pk.line != null ? lineStr(pk.line) : null;
      const sc = gameScore(g);
      // only surface human-readable reasons (skip machine codes like "ev_gate"/"junk_cell")
      const whyRaw = pk ? String(pk.pass_why || pk.pass_reason || "") : "";
      const why = /\s/.test(whyRaw) && whyRaw.length > 12 ? esc(whyRaw.slice(0, 60)) : "";
      if (side && line != null) {
        const dir = /over/i.test(side) ? "ou-over" : "ou-under";
        // NOTE: modifier class is "is-lean" — never bare "lean", which is the lean-METER
        // component class (74×16 inline-block) and collapses the whole strip if reused here.
        return `<div class="pstrip pass is-lean">
          <div class="ps-main">
            <span class="ps-side ${dir} dim">${/over/i.test(side) ? "▲" : "▼"} <b>${esc(side)} ${esc(line)}</b></span>
            <span class="ps-lowconf">Low confidence</span>
            <span class="ps-q">${bStars(pk.stars != null ? pk.stars : 1)}${passGrade(sc)}</span>
          </div>
          ${why ? `<div class="pk-made dim">${why}</div>` : ""}
        </div>`;
      }
      // no lean at all (market never posted): the old honest pass line
      const ln = passLineTxt(g);
      const read = ln ? "" : passRead(g);
      return `<div class="pstrip pass">
        <div class="ps-main">
          <span class="ps-k">${pickLabel(g)}</span>
          <span class="ps-side">Pass${ln ? ` — ${ln} held no edge` : read ? ` — ${esc(read)}` : " — line looked fair"}</span>
          <span class="ps-q">${passGrade(sc)}</span>
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
          <span class="ps-dots" aria-hidden="true">●●●● ●</span>${pickStars(pl)}
          <span class="ps-unlock">${esc(unlockCtaTxt())}</span>
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
      // GRADED VERDICT: once a pick finishes, keep the in-flight story going with a short
      // past-tense plain-English line ("OVER 8.5 cashed · final 11") so the card doesn't
      // collapse to a bare ✓/✗. Reuses liveTrackingRead's final-state phrasing (no new grading).
      let verdictRow = "";
      if ((st === "won" || st === "lost" || st === "pushed") && gs.kind === "final") {
        const tr = liveTrackingRead(g, pl);
        if (tr && tr.head) {
          const vcls = st === "won" ? "won" : st === "lost" ? "lost" : "pushed";
          verdictRow = `<div class="ps-verdict ${vcls}">${esc(tr.head)}</div>`;
        }
      }
      // BOLD pick presentation: the side + line reads big (▲ OVER 8.5), the price sits
      // beside it, stars + the 2-decimal confidence score sit to the right, and a small
      // "vs Vegas · picked 9:14 AM · T-3h" line grounds it. Over/under keeps its real side.
      const over = /(^|\s)over/i.test(String(pl.side || ""));
      const under = /(^|\s)under/i.test(String(pl.side || ""));
      const dirCls = over ? "ou-over" : under ? "ou-under" : "";
      return `<div class="pstrip bold q-${q} ${st}">
        <div class="ps-kickrow"><span class="ps-k">${pickLabelShort(g)}</span>${state ? `<span class="ps-res ${state.cls}">${state.txt}</span>` : ""}</div>
        <div class="ps-main">
          <span class="ps-side ${dirCls}">${pickArrow(pl)} <b>${esc(pl.side || "—")}</b>${pl.price != null ? `<i class="ps-px">${fmtOdds(pl.price)}</i>` : ""}</span>
          <span class="ps-q">${pickStars(pl)}${pickGrade(pl)}</span>
        </div>
        ${pickMadeMeta(pl)}
        ${verdictRow}
        ${liveRow}
        ${signalRow(pl)}
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
      // Live/final: a total-only note when the score isn't split into home/away.
      const totUnit = SPORT_UNIT[g.sport] || "";
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-note">${num(gs.score.total, 0)} ${gs.score.total === 1 ? totUnit.replace(/s$/, "") : totUnit} total</div>` : "";
      // The reference "Live & Upcoming" card: header (league tag + state chip) · body (team
      // rows on the left, the O/U + Spread columns on the right) · the DiamondEdge pick strip.
      // Pre-game shows the odds columns; once the score matters they quiet to the score itself.
      // Pre-game: the 3-market line row (all Vegas lines + our starred call) does the work.
      // Live/final: the score carries it, and the pick strip shows the live read / verdict.
      const pre = gs.kind === "pre";
      // COMPACT scores-app layout (reference: theScore/ESPN odds row). Teams left (crest ·
      // abbr · record), per-side ODDS GRID right (Spread | o/u Total | ML) with OUR pick's
      // cells highlighted + tiny stars. Pitchers underneath. Live/final: the odds column
      // quiets to the inline per-team score; the pick strip carries the live read.
      // ANALYST DESK: when the game carries the four analysts, the tile becomes a MATCHUP
      // PANEL — consensus headline, the four calls, the chief's verdict. A chief AVOID with
      // no pick replaces the pass strip (the pass IS the verdict); a served chief run-line
      // call replaces the generic spread row. No desk served ⇒ the tile is unchanged.
      const deskHtml = deskBlockTile(g, locked);
      const deskChf = deskHtml ? deskChief(g) : null;
      // CONSENSUS AS THE CARD'S LIGHT: the agreement state becomes the card's visual
      // language — all four aligned = one unified glow ring; a split desk = a visibly
      // divided pane; a majority = a softer single-accent lean. CSS reads these classes.
      const deskCons = deskHtml ? deskConsensus(g) : null;
      const consCls = deskCons && deskCons.state === "UNANIMOUS" ? " cons-unan"
        : deskCons && deskCons.state === "MAJORITY" ? " cons-maj"
        : deskCons && deskCons.state === "SPLIT" ? " cons-split" : "";
      return `<article class="tile ${gs.kind}${q ? ` q-${q}` : ""}${resCls ? " " + resCls : ""}${deskHtml ? " has-desk" : ""}${consCls}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)}${pick ? (locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pick.side || "")}`) : ""} — open details">
        <div class="t-head">${leagueTag(g)}${stateChip(g, gs)}</div>
        <div class="t-body">
          <div class="t-teams">${tileRow(g, "away", gs)}${pitcherSub(g, "away")}${tileRow(g, "home", gs)}${pitcherSub(g, "home")}</div>
        </div>
        ${pre ? "" : totOnly}
        ${atlasLiveChip(g)}
        ${deskHtml}
        ${isPick(pick) ? pickStrip(g, pick, st, locked, gs) : passStrip(g)}
        ${deskChf && deskChf.spread ? "" : spreadRowTile(g)}
      </article>`;
    }
    // ===================== POSTPONED (VISIBLE-VOID) CARD =====================
    // A rained-out/cancelled game NEVER vanishes from its day view (Leon's
    // standing rule: picks lock at first pitch and you can always look back at
    // them). The unified history feed serves the game as status="postponed"
    // with the locked pick frozen exactly as served and result="void" — this
    // renders it as a dimmed glass card: PPD where the final score would be,
    // the pick row with a neutral VOID chip (not a win, not a loss), excluded
    // from every record. Source: picks_unified games[] (betaData).
    function ppdCard(bg: any, idx: number) {
      const aAb = bg.away_abbr || mlbAbbr(bg.away), hAb = bg.home_abbr || mlbAbbr(bg.home);
      const g = { sport: "mlb", away_abbr: aAb, home_abbr: hAb };
      const p = bg.pick || {};
      const hasPick = !!p.side;
      const side = hasPick ? `${/over/i.test(String(p.side)) ? "OVER" : "UNDER"} ${p.line != null ? lineStr(p.line) : ""}`.trim() : "";
      const sp = bg.spread || null;
      const spBit = sp && sp.side
        ? `<div class="ppd-spread">Run-line lean ${esc(sp.side === "home" ? hAb : aAb)} ${sp.line != null ? `${Number(sp.line) > 0 ? "+" : ""}${lineStr(sp.line)}` : ""} <span class="void-chip sm">VOID</span></div>`
        : "";
      return `<article class="tile ppd" style="--i:${Math.min(idx, 14)}" aria-label="${esc(aAb)} at ${esc(hAb)} — postponed, pick void, no action">
        <div class="t-head">${leagueTag(g)}<span class="ppd-tag">POSTPONED</span></div>
        <div class="ppd-teams">
          <span class="ppd-team"><span class="t-crest">${gCrest(g, "away")}</span><b>${esc(aAb)}</b></span>
          <span class="ppd-mid">PPD</span>
          <span class="ppd-team"><b>${esc(hAb)}</b><span class="t-crest">${gCrest(g, "home")}</span></span>
        </div>
        ${hasPick ? `<div class="ppd-pickrow">${bStars(p.stars)}<span class="ppd-side">${esc(side)}${p.price != null ? ` ${fmtOdds(p.price)}` : ""}</span><span class="void-chip">VOID — no action</span></div>` : ""}
        <div class="ppd-note">${esc((bg.postponed && bg.postponed.note) || "Postponed — pick void, no action")}</div>
        ${spBit}
      </article>`;
    }
    // The day's postponed cards from the unified history feed — PAST dates
    // only (upcoming/live boards keep excluding PPD games; that part of the
    // postponement handling is right). Deduped against the slate's own tiles.
    function ppdGamesFor(dateISO: string, slateGames0: any[]) {
      if (!(league === "all" || league === "mlb")) return [];
      if (!betaData || !Array.isArray(betaData.games)) return [];
      if (!(dateISO < todayISO())) return [];
      const seen = new Set((slateGames0 || []).map((g: any) => String(g.game_id)));
      return betaData.games.filter((g: any) =>
        g && g.date === dateISO && String(g.status || "") === "postponed"
        && !seen.has(String(g.game_pk)) && !seen.has(String(g.game_id)));
    }
    // A human sentence for WHY the model passed a market — built from the numbers when we
    // have them, never the raw jargon string.
    function plainPassReason(c: any) {
      if (!c) return "";
      // the line we passed AT always rides with the pass — a pass is a judged number, not a shrug
      const rawLn = c.market_line != null ? c.market_line : c.pick_line;
      const lnTag = rawLn != null
        ? (c.bet_type === "total" ? `at O/U ${num(Math.abs(Number(rawLn)))}` : c.bet_type === "spread" ? `at ${sgn(Number(rawLn))}` : "")
        : "";
      if (c.our_prob != null && c.p_breakeven != null && c.per_side_price != null) {
        const our = (c.our_prob * 100).toFixed(0), need = (c.p_breakeven * 100).toFixed(0);
        const pre = lnTag ? lnTag.replace(/^at /, "At ") + ", " : "";
        // when our number clears break-even but the margin is under the bar, say THAT —
        // "needs 49%, we say 50%, no bet" reads like a contradiction otherwise
        if (c.our_prob > c.p_breakeven) {
          return `${pre}our ${our}% only just clears the ${need}% break-even at ${fmtOdds(c.per_side_price)} — too thin to bet.`;
        }
        return `${pre}${fmtOdds(c.per_side_price)} needs ${need}% to profit — our model says ${our}%. No bet.`;
      }
      const raw = String(c.pass_reason || "").replace(/\s*—\s*priced out.*$/i, "").trim();
      return raw ? `${raw}${lnTag ? ` (${lnTag})` : ""}` : `No edge ${lnTag || "at today's prices"}.`;
    }
    // The line a PASSED game was judged at — for pass verdicts on tiles/covers/detail
    // ("Pass — O/U 8.5 held no edge"), so a pass always states the number it priced.
    function passLineTxt(g: any) {
      for (const mk of ["total", "spread", "moneyline"]) {
        const v4 = v4LineOf(g, mk);
        if (v4 && (v4.line != null || v4.price != null)) {
          const t = vegasLine(g, mk);
          if (t) return t;
        }
      }
      return vegasLine(g, "total") || vegasLine(g, "spread") || "";
    }
    // PER-TEAM PITCHER LINE (Leon, 2026-07-25): each team's probable — last name + ERA,
    // small and quiet — rides DIRECTLY UNDER that team's row on every game tile where the
    // data exists (any game state, not just pre). Taps through to the pitcher game log.
    function pitcherSub(g: any, side: "away" | "home") {
      if (g.sport !== "mlb") return "";
      const p = ((g.pregame_intel || {}).pitchers || {})[side] || {};
      const fd = pitcherFeedFor(g, side);
      const name = p.name || (fd && fd.name);
      if (!name) return "";
      const era = p.era != null ? p.era : (fd && fd.era != null ? fd.era : null);
      const last = esc(String(name).trim().split(/\s+/).pop() || "");
      return `<div class="t-pitchsub" data-pitcher="${esc(String(g.game_id))}|${side}" role="button" tabindex="0" aria-label="${esc(String(name))} — recent starts">
        <span class="tps-nm">${last}</span>${era != null ? `<span class="tps-era">${num(era, 2)} ERA</span>` : ""}
      </div>`;
    }
    // "Sanchez vs Cameron" — the probable-pitcher line under a pre-game MLB tile.
    function pitchLine(g: any, gs: any) {
      if (g.sport !== "mlb" || gs.kind !== "pre") return "";
      const p = (g.pregame_intel || {}).pitchers || {};
      // Prefer the served pregame_intel name; fall back to the pitchers_v4 feed name so
      // synthesized future/tomorrow tiles (no pregame_intel) still show the probables + ERA.
      const fdA = pitcherFeedFor(g, "away"), fdH = pitcherFeedFor(g, "home");
      const a = (p.away || {}).name || (fdA && fdA.name), h = (p.home || {}).name || (fdH && fdH.name);
      if (!a && !h) return "";
      const last = (n: any) => esc(String(n || "").trim().split(/\s+/).pop() || "TBD");
      // ERA from the pitchers feed when loaded; each name taps through to the game log.
      const bit = (nm: any, side: "away" | "home") => {
        if (!nm) return "TBD";
        const fd = pitcherFeedFor(g, side);
        const era = fd && fd.era != null ? ` <i class="tp-era">${num(fd.era, 2)}</i>` : "";
        return `<span class="tp-p" data-pitcher="${esc(String(g.game_id))}|${side}">${last(nm)}${era}</span>`;
      };
      return `<div class="t-pitch">${bit(a, "away")} vs ${bit(h, "home")}</div>`;
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
    // DAY-LOCKED flagship: once chosen for a calendar day, the featured game STAYS (no
    // intraday shuffling as walls/feeds refresh). slot 1 = flagship, slot 2 = runner-up.
    function dayLockedPick(pool: any[], slot = 1, excludeGid?: string | null) {
      const k = `de_flag${slot}_${todayISO()}`;
      let gid: string | null = null;
      try { gid = localStorage.getItem(k); } catch {}
      if (gid && gid !== excludeGid) {
        const g = pool.find((x: any) => String(x.game_id) === gid);
        // Keep the day-lock ONLY while the featured game hasn't started — once it's live/final
        // we don't headline a pick you can no longer make. Re-pick if a pre-game pick exists.
        if (g && gameState(g).kind === "pre") { const pl = displayPick(g); if (isPick(pl)) return { g, pl }; }
      }
      const cand = featuredPick(excludeGid ? pool.filter((x: any) => String(x.game_id) !== excludeGid) : pool);
      if (cand && gameState(cand.g).kind === "pre") { try { localStorage.setItem(k, String(cand.g.game_id)); } catch {} }
      return cand;
    }
    // The day's featured game per the feed = `featured_game_id` (its highest-score pick). Resolve
    // it against the games we're rendering, keyed on game_pk (the trailing id).
    function feedFeaturedGame(games: any[]) {
      if (!games || !games.length) return null;
      const date = gameLocalDay(games[0]);
      const src = betaLiveData || betaData;
      let pk: string | null = null;
      const fmap = (src && src.featured) || (betaData && betaData.featured);
      if (fmap && date && fmap[date] && fmap[date].game_pk != null) pk = String(fmap[date].game_pk);
      if (!pk) { const fid = String((src && src.featured_game_id) || (betaData && betaData.featured_game_id) || ""); const m = fid.match(/(\d+)$/); if (m) pk = m[1]; }
      if (!pk) return null;
      return games.find((g: any) => { const gm = String(g.game_id || "").match(/(\d+)$/); return (gm ? gm[1] : String(g.game_id)) === pk; }) || null;
    }
    function featuredPick(games: any[]) {
      let best: any = null;
      // Prefer the feed's featured game when it's an actionable upcoming pick — otherwise fall
      // through to the score ranking below (so a started/finished featured game never strands).
      const fg = feedFeaturedGame(games);
      if (fg && gameState(fg).kind === "pre") { const fpl = displayPick(fg); if (isBet(fpl)) return { g: fg, pl: fpl }; }
      // Actionability rank: upcoming-today (3) > upcoming-future (2) > live (1) > final (0).
      // Within a rank, highest score/conviction wins (Leon: featured = highest score).
      const actRank = (g: any) => {
        const k = gameState(g).kind;
        if (k === "pre") return gameLocalDay(g) === todayISO() ? 3 : 2;
        if (k === "live") return 1;
        return 0;
      };
      games.forEach((g: any) => {
        const pl = displayPick(g);
        if (!isBet(pl)) return; // never feature a bet that doesn't clear its price's break-even
        const cand = { g, pl, act: actRank(g), p: pl.p != null ? Number(pl.p) : null, qr: Q_RANK[qualityOf(pl)], gr: pl.grade != null ? Number(pl.grade) : null };
        if (!best) { best = cand; return; }
        if (cand.act !== best.act) { if (cand.act > best.act) best = cand; return; } // more actionable first
        // decimal grade wins when both carry one (the flagship ranking); legacy conviction otherwise
        if (cand.gr != null && best.gr != null) { if (cand.gr > best.gr) best = cand; return; }
        if (convictionSort(cand.p, cand.qr, best.p, best.qr) < 0) best = cand;
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
        : st === "cooked" ? `<span class="ft-res lost">✗ NOT LANDING</span>`
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
      const ftOver = /(^|\s)over/i.test(String(pl.side || ""));
      const ftUnder = /(^|\s)under/i.test(String(pl.side || ""));
      const ftDir = ftOver ? "ou-over" : ftUnder ? "ou-under" : "";
      const take = locked
        ? `<button class="lockchip ft-lock" data-up="1" aria-label="Pick locked — unlock today's picks"><span class="lk-blur" aria-hidden="true">●●●● ●</span><span class="lk-badge">${lockSvg}${esc(unlockPitchTxt())}</span></button>`
        : `<div class="ft-take q-${q} ${st}"><span class="ft-de">${pickLabel(g)}</span><span class="ft-sel ${ftDir}">${pickArrow(pl)} <b>${esc(pl.side || "—")}</b>${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}</span><span class="ft-q">${pickStars(pl)}${pl.grade != null && pl.grade > 0 ? pickGrade(pl) : ""}</span>${res}</div>${pickMadeMeta(pl)}`;
      return `<article class="feat q-${q} ${gs.kind}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id)}" role="button" tabindex="0"
        aria-label="Featured — ${esc(g.away_abbr)} at ${esc(g.home_abbr)}${locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pl.side || "")}`} — open details">
        <div class="ft-top"><span class="ft-lab">◆ Featured</span><span class="ft-sport">${esc(SPORT_LABEL[g.sport] || g.sport || "")}</span></div>
        <div class="ft-mu">${side("away")}${mid}${side("home")}</div>
        ${take}
        ${gs.kind === "pre" ? countdownChip(g, gs) : ""}
        ${gs.kind === "live" && !locked ? liveHitOdds(g, pl, "full") : ""}
        ${gs.kind === "live" && !locked ? pickProgress(g, pl, st) : ""}
      </article>`;
    }

    // ===================== TOP PICKS TODAY (dark glass rail — replaces the featured hero) =====================
    // The slate's best 3-5 picks by the model's continuous score, in a deliberately DISTINCT
    // dark/compact style (echoes the dock) so it never reads as a duplicate of the light game
    // tiles below. Tap → the same game detail. Only +EV picks qualify; nothing ⇒ no rail.
    function topPicksRail(games: any[]) {
      // Desk agreement leads the ranking when the analysts are served: a unanimous desk is
      // the strongest possible feature, a majority next — then the model score as before.
      const consRank = (g: any) => { const c = deskConsensus(g); return c ? (c.state === "UNANIMOUS" ? 2 : c.state === "MAJORITY" ? 1 : 0) : 0; };
      const rows = games
        .map((g: any) => ({ g, pl: displayPick(g) }))
        .filter((r: any) => isBet(r.pl))
        .sort((a: any, b: any) =>
          (consRank(b.g) - consRank(a.g)) ||
          ((b.pl.grade != null ? Number(b.pl.grade) : 0) - (a.pl.grade != null ? Number(a.pl.grade) : 0)) ||
          ((b.pl.stars || 0) - (a.pl.stars || 0)) ||
          ((b.pl.p || 0) - (a.pl.p || 0)))
        .slice(0, 5);
      if (!rows.length) return "";
      const isToday = curDate === todayISO();
      // MIXED LAYOUT (Leon, 2026-07-25): #1 = a full-width cinematic hero card (crests +
      // big call), #2–#5 = a compact 2×2 grid. Same dark glass, same tap-through/countdowns.
      const card = (r: any, i: number, hero: boolean) => {
        const { g, pl } = r;
        const gs = gameState(g);
        const st = playState(g, pl);
        const locked = pickLocked(pl, st);
        const state = pickStateTxt(g, pl, st);
        const over = /(^|\s)over/i.test(String(pl.side || ""));
        const under = /(^|\s)under/i.test(String(pl.side || ""));
        const dir = over ? "ou-over" : under ? "ou-under" : "";
        const stars = pl.stars != null ? Math.max(0, Math.min(5, Math.round(Number(pl.stars)))) : 0;
        const when = gs.kind === "live"
          ? `<span class="tpk-live"><span class="livedot"></span>${esc(gs.label && gs.label !== "Live" ? gs.label : "LIVE")}</span>`
          : gs.kind === "final" ? `<span class="tpk-when">Final</span>`
          : `<span class="tpk-when">${esc(gs.si.hasTime && gs.si.time ? gs.si.time.replace(TZ_ABBR ? " " + TZ_ABBR : "", "") : (gs.si.date || ""))}</span>`;
        const foot = `<span class="tpk-foot">${pickStars(pl)}${locked ? "" : pickGrade(pl)}${state ? `<span class="tpk-res ${state.cls}">${state.txt}</span>` : `${gs.kind === "pre" ? countdownChip(g, gs) : ""}`}</span>`;
        // Signed-out / free: the side+line blurs into the unlock pitch — stars stay
        // visible (the confidence IS the marketing), leans + graded picks stay open.
        const sideEl = locked
          ? `<span class="tpk-side lockside" data-up="1"><span class="tpk-dots" aria-hidden="true">●●●●</span><span class="tpk-lockcta">${lockSvg} ${esc(hero ? unlockCtaTxt() : (isSignedIn() ? "Unlock" : "Sign in"))}</span></span>`
          : `<span class="tpk-side ${dir}">${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}</span>`;
        const aria = locked ? "pick locked" : esc(pl.side || "");
        if (hero) {
          return `<button class="tpk tpk-hero s${stars}" data-gid="${esc(g.game_id)}" style="--i:0"
            aria-label="Top pick 1 — ${esc(g.away_abbr)} at ${esc(g.home_abbr)} — ${aria} — open details">
            <span class="tpk-top"><span class="tpk-rank">#1</span><span class="tpk-mu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span>${when}</span>
            ${consensusBanner(g, locked, "mini") ? `<span class="tpk-cons">${consensusBanner(g, locked, "mini")}</span>` : ""}
            <span class="tpk-heromid">
              <span class="tpk-crest">${gCrest(g, "away")}</span>
              <span class="tpk-heropick">
                ${sideEl}
                ${foot}
              </span>
              <span class="tpk-crest">${gCrest(g, "home")}</span>
            </span>
            ${locked ? "" : signalRow(pl)}
          </button>`;
        }
        return `<button class="tpk s${stars}" data-gid="${esc(g.game_id)}" style="--i:${i}"
          aria-label="Top pick ${i + 1} — ${esc(g.away_abbr)} at ${esc(g.home_abbr)} — ${aria} — open details">
          <span class="tpk-top"><span class="tpk-rank">#${i + 1}</span><span class="tpk-mu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span>${when}</span>
          ${consensusBanner(g, locked, "mini") ? `<span class="tpk-cons">${consensusBanner(g, locked, "mini")}</span>` : ""}
          ${sideEl}
          ${foot}
        </button>`;
      };
      const heroCard = card(rows[0], 0, true);
      const rest = rows.slice(1).map((r: any, i: number) => card(r, i + 1, false)).join("");
      const deskOn = rows.some((r: any) => deskConsensus(r.g));
      return `<div class="toppicks">
        <div class="tp-head"><span class="tp-lab">◆ Top Picks${isToday ? " Today" : ""}</span><span class="tp-sub">${deskOn ? "the desk's strongest calls first" : "ranked by model score"}</span></div>
        ${heroCard}
        ${rest ? `<div class="tp-grid">${rest}</div>` : ""}
      </div>`;
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
    // Per STRENGTH-TIER tally over a set of games. Every TAKE across all markets is bucketed by
    // qualityOf() → strong / good / lean, using the SAME grading path as the rest of the record
    // (pickResult on each market's play). This is what makes a bare "0–3" self-explanatory:
    // spread/moneyline leans sit in the Lean tier; the totals edge sits in Strong/Good.
    function tierRecordFor(filterFn: (g: any) => boolean) {
      const src = livePayload || payload;
      if (!src) return null;
      const T: any = {
        strong: { w: 0, l: 0, push: 0, live: 0, up: 0 },
        good: { w: 0, l: 0, push: 0, live: 0, up: 0 },
        lean: { w: 0, l: 0, push: 0, live: 0, up: 0 },
      };
      ((src.games || []) as any[]).forEach((g: any) => {
        if (!filterFn(g)) return;
        const P = gamePlays(g);
        const gs = gameState(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (!pl || pl.action !== "TAKE") return;
          const q = qualityOf(pl);
          if (!q || !T[q]) return;
          const r = pickResult(g, pl);
          if (r === "hit") T[q].w++;
          else if (r === "miss") T[q].l++;
          else if (r === "push") T[q].push++;
          else if (gs.kind === "live") T[q].live++;
          else if (gs.kind !== "final") T[q].up++;
        });
      });
      const graded = (t: any) => t.w + t.l;
      return {
        strong: T.strong, good: T.good, lean: T.lean,
        gradedTotal: graded(T.strong) + graded(T.good) + graded(T.lean),
        w: T.strong.w + T.good.w + T.lean.w,
        l: T.strong.l + T.good.l + T.lean.l,
        live: T.strong.live + T.good.live + T.lean.live,
        up: T.strong.up + T.good.up + T.lean.up,
      };
    }
    // ===================== THE RECORD LADDER (one mental model everywhere) =====================
    // The whole app tells ONE story about how the picks are doing: long-run we're 58% (the nav
    // anchor / validated signature) → this window the EDGE (totals, the validated play) is X–Y
    // and the LEANS (spread/ML directional reads) are A–B → tap for the exact picks. The Edge
    // and the Leans are ALWAYS split so a lean loss and an edge loss never read identically, and
    // a bad edge stretch is always framed against the 886-pick record as normal variance.
    //
    // edgeLeanSplit() collapses tierRecordFor()'s three tiers into that two-part shape WITHOUT
    // recomputing anything: Edge = Strong + Good (both are totals); Leans = the Lean tier
    // (spread + moneyline). Same grading path (pickResult/qualityOf) — presentation only.
    function edgeLeanSplit(tr: any) {
      if (!tr) return null;
      const add = (a: any, b: any) => ({ w: a.w + b.w, l: a.l + b.l, push: (a.push || 0) + (b.push || 0), live: a.live + b.live, up: a.up + b.up });
      const edge = add(tr.strong, tr.good);
      const lean = { w: tr.lean.w, l: tr.lean.l, push: tr.lean.push || 0, live: tr.lean.live, up: tr.lean.up };
      return {
        edge, lean,
        edgeGraded: edge.w + edge.l, leanGraded: lean.w + lean.l,
        anyGraded: edge.w + edge.l + lean.w + lean.l,
        anyOut: edge.live + edge.up + lean.live + lean.up,
      };
    }
    // Overall pick record for the VIEWED date/league — across ALL markets (spread + total + ML),
    // plus a separate "top picks" (Strong ★★★) tally. Drives the small performance banner.
    function dayPicksTally() {
      // ANY day (incl. prior days): prefer the model payload's per-day record — it's the
      // backfilled + nightly-archived truth for every date, so looking back always shows
      // that day's pick record. The live tally is only a fallback for today.
      if ((league === "all" || league === "mlb") && betaData && betaData.by_date_record) {
        const r = betaData.by_date_record[curDate];
        if (r && r.n_picks != null) {
          // n_void (visible-void): postponed picks shown on the day but in NO record
          return { w: r.wins || 0, l: r.losses || 0, p: r.pushes || 0, sw: 0, sl: 0, n: r.n_picks || 0, roi: r.roi != null ? r.roi : null, hit: r.hit_rate != null ? r.hit_rate : null, nv: r.n_void || 0 };
        }
      }
      const games = payload ? gamesForLeague(payload, league) : [];
      let w = 0, l = 0, p = 0, sw = 0, sl = 0;
      games.forEach((g: any) => {
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (!isBet(pl) || !pl.result) return; // only count bets we'd actually make (+EV)
          const s = pl.result.status;
          const strong = qualityOf(pl) === "strong";
          if (s === "hit") { w++; if (strong) sw++; }
          else if (s === "miss") { l++; if (strong) sl++; }
          else if (s === "push") p++;
        });
      });
      return { w, l, p, sw, sl, n: w + l + p };
    }
    // Small performance banner — OVERALL across all picks for the day, with a separate Top-picks
    // (Strong) standing. Tapping opens the full record broken down by confidence level (scoped to
    // the viewed date/league). Replaces the old totals-only "Today's Edge" line.
    function metaRow() {
      const isToday = curDate === todayISO();
      const dayLab = isToday ? "Today" : "This day";
      const t = dayPicksTally();
      let inner: string;
      if (!t.n) {
        inner = `<span class="pf-k">${esc(dayLab)}'s picks</span><span class="pf-v pending">${isToday ? "graded as games finish" : "no picks this day"}</span>`;
      } else {
        // per-day record: W–L(–P) + hit% / ROI when we have it (historical days carry both)
        const roiTxt = (t as any).roi != null ? `<span class="pf-roi ${(t as any).roi >= 0 ? "pos" : "neg"}">${((t as any).roi >= 0 ? "+" : "") + ((t as any).roi * 100).toFixed(0)}%</span>` : "";
        const extra = (t.sw + t.sl) ? `<span class="pf-top">★ Top ${t.sw}–${t.sl}</span>` : roiTxt;
        // a postponed day says so: "· 1 void" — shown, never counted in the W–L
        const voidBit = (t as any).nv ? `<span class="pf-voidn">· ${(t as any).nv} void</span>` : "";
        inner = `<span class="pf-k">${esc(dayLab)}'s record</span><span class="pf-v">${t.w}–${t.l}${t.p ? `–${t.p}` : ""}</span>${voidBit}${extra}`;
      }
      const chip = `<button class="recchip perf" id="recchip" aria-label="See the full pick record, broken down by confidence level">${inner}<span class="rc-arw">→</span></button>`;
      // "All picks →" opens the model's deep-dive view (record + every pick, lead-by-lead).
      return `<div class="metarow">${chip}<button class="howlink strong" id="allpicks">All picks · record →</button><span class="mr-sp"></span><button class="howlink" id="howlink">ⓘ How picks work</button></div>`;
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
    // A network/Supabase failure at boot must not leave an eternal skeleton — show a graceful,
    // on-brand error with a retry (the auto-pollers keep trying and self-heal on recovery).
    function renderLoadError() {
      const html = `<div class="state loaderr"><div class="st-ico">◆</div><div class="big">Couldn't reach the board</div><div class="sm">Check your connection — DiamondEdge will keep trying in the background, or retry now. Every past pick stays graded once you're back.</div><button class="ld-retry" onclick="location.reload()">Retry</button></div>`;
      const t = $("today-view"); if (t) t.innerHTML = html;
      const b = $("slate-body"); if (b) b.innerHTML = html;
    }

    // ONE continuous frosted capsule; days are quiet typographic cells inside it and a
    // fluid lens slides under the active day. No per-pill borders.
    function dateStripHtml() {
      const cells: string[] = [`<span class="dlens" id="dlens" aria-hidden="true"></span>`];
      const today = todayISO();
      let d = shiftDate(today, -13);
      if (d < minDate) d = minDate;
      // Extend 5 days AHEAD so future slates are browsable (picks may not be out yet).
      const end = shiftDate(today, 5);
      let cur = d;
      while (cur <= end) {
        const dt = new Date(cur + "T12:00:00");
        const isToday = cur === today;
        const isFuture = cur > today;
        const on = cur === curDate && !rangeMode;
        cells.push(`<button class="dcell ${on ? "on" : ""} ${isToday ? "today" : ""} ${isFuture ? "future" : ""}" data-date="${cur}" aria-label="${dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}">
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
    // MLB + Soccer are the active leagues, so they LEAD the rail (after "All"): the chips
    // read All · MLB · Soccer · (rest). The remaining leagues follow, ordered by game count.
    const LEAD_LEAGUES = ["mlb", "soccer"];
    function orderedLeagues(src: any): string[] {
      const counts: any = {}; SPORTS.forEach((lg) => { counts[lg] = src ? gamesForLeague(src, lg).length : 0; });
      const byGames = (a: string, b: string) => (counts[b] - counts[a]) || (SPORTS.indexOf(a) - SPORTS.indexOf(b));
      const pref = leagueOrderPref();
      if (pref && pref.length) {
        const inpref = pref.filter((lg) => SPORTS.includes(lg));
        const rest = SPORTS.filter((lg) => !inpref.includes(lg)).sort(byGames);
        return [...inpref, ...rest];
      }
      const lead = LEAD_LEAGUES.filter((lg) => SPORTS.includes(lg));
      const rest = SPORTS.filter((lg) => !lead.includes(lg)).sort(byGames);
      return [...lead, ...rest];
    }
    function renderScoresChrome() {
      const tabSrc = livePayload || payload;
      // "All" leads the rail (merged, live-first), then each league by game count.
      const tabsHtml = ["all", ...orderedLeagues(tabSrc)].map((lg) => {
        const lgGames = tabSrc ? gamesForLeague(tabSrc, lg) : [];
        const cnt = lgGames.length;
        // a pulsing dot when a league has a game in progress right now (drives users to the live board)
        const live = lgGames.some((g: any) => gameState(g).kind === "live");
        return `<button class="sporttab ${lg === league ? "on" : ""}${live ? " haslive" : ""}" data-lg="${lg}" data-ic="${SPORT_ICON[lg] || ""}">${SPORT_LABEL[lg]}${live ? `<span class="livedot" aria-label="live games"></span>` : ""}<span class="cnt" id="cnt-${lg}">${cnt || ""}</span></button>`;
      }).join("");
      // STICKY GAMES CHROME: the date strip + league rail live in ONE sticky wrapper pinned
      // under the app header (glass backing, tiles scroll beneath). Snap-scroll + fade masks
      // on the strip are untouched; z-index sits below sheets (90+) and the dock (340).
      root.querySelector("#games-view").innerHTML = `
        <div class="games-chrome" id="games-chrome">
        <div class="datebar lead">
          <div class="datestrip" id="datestrip">${dateStripHtml()}</div>
          <div class="datetools">
            <span class="calwrap"><button class="dtool cal" id="cal-btn" title="Pick a date" aria-label="Pick a date"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M3.5 9.6h17M8 3v3.4M16 3v3.4"/><circle cx="12" cy="14.8" r="1.4" fill="currentColor" stroke="none"/></svg></button><input type="date" id="date-input" aria-label="Pick a date" value="${curDate}" min="${minDate}" max="${maxDate > shiftDate(todayISO(), 5) ? maxDate : shiftDate(todayISO(), 5)}"></span>
          </div>
        </div>
        <div class="subhead compact subtle">
          <div class="sporttabs" id="sporttabs">${tabsHtml}<span class="tab-ink" id="tab-ink"></span></div>
        </div>
        </div>
        <div id="meta-area" class="meta-area">${metaRow()}</div>
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

    // First-pitch epoch ms for a game (from start_ts/start_time), or null.
    function firstPitchTs(g: any) {
      const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
      if (!ts) return null;
      const t = new Date(ts).getTime();
      return isNaN(t) ? null : t;
    }
    function fmtCountdown(ms: number) {
      const s = Math.max(0, Math.floor(ms / 1000));
      const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
      if (d > 0) return `${d}d ${h}h`;
      if (h > 0) return `${h}h ${m}m`;
      return `${m || 1}m`;
    }
    // One shared, idempotent ticker keeps every rendered countdown live (minute granularity).
    function startCountdowns() {
      if ((window as any).__deCd) return;
      (window as any).__deCd = setInterval(() => {
        document.querySelectorAll(".fnc-val[data-drop]").forEach((el: any) => {
          const ms = Number(el.dataset.drop) - Date.now();
          el.textContent = ms > 0 ? fmtCountdown(ms) : "now";
        });
      }, 30000);
    }
    // Banner for a FUTURE date — picks aren't published yet. `full` = standalone (no schedule
    // to show); otherwise a compact strip above the known schedule, with a picks countdown.
    function futureNote(dispDate: string, full: boolean, games?: any[]) {
      // Picks publish as the ~24h decision point approaches; count down to that from first pitch.
      let countdown = "";
      const list = games || [];
      let earliest: number | null = null;
      list.forEach((g: any) => { const ts = firstPitchTs(g); if (ts != null && (earliest == null || ts < earliest)) earliest = ts; });
      if (earliest != null) {
        const dropAt = earliest - 24 * 3600 * 1000;
        const ms = dropAt - Date.now();
        countdown = ms > 6 * 60 * 1000
          ? `<div class="fn-countdown"><span class="fnc-k">Picks drop in</span><b class="fnc-val" data-drop="${dropAt}">${fmtCountdown(ms)}</b></div>`
          : `<div class="fn-countdown soon"><span class="fnc-k">Picks expected soon</span></div>`;
      }
      const body = `<div class="fn-body"><b>Picks aren't out yet for ${esc(dispDate)}</b><span>First look lands as books post — about <b>24 hours before each first pitch</b> — then every pick firms up through five checks (T-24h → T-1h) and locks about an hour out.${full ? "" : " Here's the schedule as it stands."}</span></div>`;
      return `<div class="future-note${full ? " full" : ""}"><span class="fn-ic">◆</span>${body}${countdown}</div>`;
    }
    function renderSlate(quiet = false) {
      const body = $("slate-body"), meta = $("meta-area");
      if (!body) return;
      body.classList.toggle("still", quiet); // live-score refresh: no re-entrance animation
      if (rangeMode) {
        body.innerHTML = renderRangeBody();
      } else {
        const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        const isFuture = curDate > todayISO();
        // Games for this date. Future dates often have no snapshot yet — fall back to the live
        // board (it carries upcoming fixtures) so the SCHEDULE still shows even without picks.
        let games = payload ? gamesForLeague(payload, league) : [];
        if (isFuture && !games.length && livePayload) games = gamesForLeague(livePayload, league, curDate);
        // Still nothing? The v4 pick feed carries tomorrow's slate as soon as books post
        // (~T-24h) — synthesize minimal tiles from it so picks show the moment they exist.
        if (isFuture && !games.length && betaLiveData && (league === "all" || league === "mlb")) {
          games = (betaLiveData.games || []).filter((vg: any) => vg.date === curDate).map((vg: any) => ({
            game_id: String(vg.game_pk), sport: "mlb",
            // Resolve the FULL team name → abbr so the crest renderer (keyed on abbr) shows a
            // real logo on future/tomorrow tiles, not just today's snapshot games.
            away_abbr: mlbAbbr(vg.away), home_abbr: mlbAbbr(vg.home),
            away_name: vg.away, home_name: vg.home,
            start_ts: vg.first_pitch_utc,
          }));
        }
        slateGames = games || [];   // remember what we rendered so findGame can open any of it
        // VISIBLE-VOID: the day's postponed games (rained out / cancelled) ride the
        // unified history feed and render as dimmed PPD cards — a locked pick can
        // never silently vanish from a day you look back at.
        if (curDate < todayISO() && !betaData) {
          // unified feed not in yet (deep-link straight to a past date) — pull it,
          // then repaint quietly so any postponed card lands. Cached after first load.
          loadBeta().then(() => { try { if (!rangeMode && tab === "games") renderSlate(true); } catch {} }).catch(() => {});
        }
        const ppdGames = ppdGamesFor(curDate, games);
        if (meta) meta.innerHTML = metaRow();
        // Feeds still in flight → hold the shimmer skeletons; the empty state only ever
        // renders once the loaders have RESOLVED empty (no more "No games" flash at boot).
        if (!games.length && dayLoading) { body.innerHTML = skeletonSlate(); return; }
        if (!games.length && ppdGames.length) {
          // a day whose ONLY games were postponed still shows them, voided
          body.innerHTML = `<div class="slate-sec ppdsec"><div class="sec-hd"><span class="sec-lab">Postponed</span><span class="sec-n">${ppdGames.length}</span></div><div class="slate">${ppdGames.map((g: any, i: number) => ppdCard(g, i)).join("")}</div></div>
            <div class="refnote">${ppdGames.length} game${ppdGames.length > 1 ? "s" : ""} · ${esc(dispDate)} · postponed, picks void</div>`;
          bindMeta();
          return;
        }
        if (!games.length) {
          // Early-return states still need their chrome bound (record chip / All picks /
          // How-picks-work went DEAD on future+empty dates before this).
          if (isFuture) { body.innerHTML = futureNote(dispDate, true, []); bindMeta(); return; }
          if (!payload) { body.innerHTML = `<div class="state"><div class="st-ico">◆</div><div class="big">No games to show</div><div class="sm">Nothing's loaded for ${esc(isNaN(new Date(curDate).getTime()) ? "that date" : dispDate)} — try another date or head back to today. Every past DiamondEdge Pick stays graded on the Insights tab.</div></div>`; bindMeta(); return; }
          const noun = league === "all" ? "games" : SPORT_LABEL[league] + " on the board";
          body.innerHTML = `<div class="state"><div class="st-ico">${league === "all" ? "◆" : SPORT_LABEL[league]}</div><div class="big">No ${esc(noun)}</div><div class="sm">Nothing scheduled for ${esc(dispDate)}. Try another league or date — and every past DiamondEdge Pick stays graded, win or lose, on the Insights tab.</div></div>`;
        } else {
          const anyPick = games.some((g: any) => { const p = displayPick(g); return p && p.action === "TAKE"; });
          // TOP PICKS rail (replaces the single featured hero): the day's best picks by score,
          // in a distinct dark style. No rail on a future (no-pick) slate — it's a schedule.
          const rail = anyPick ? topPicksRail(games) : "";
          // Reference "Live & Upcoming": group the cards by game phase so LIVE games
          // sit under a live subhead, upcoming below, finals last. gameState already gives phase.
          const grp: any = { live: [], pre: [], final: [] };
          games.forEach((g: any) => { const k = gameState(g).kind; (grp[k] || grp.pre).push(g); });
          let n = 0;
          const section = (label: string, arr: any[], cls = "") => arr.length
            ? `<div class="slate-sec ${cls}"><div class="sec-hd"><span class="sec-lab">${esc(label)}</span><span class="sec-n">${arr.length}</span></div><div class="slate">${arr.map((g: any) => gameCard(g, n++)).join("")}</div></div>`
            : "";
          // Postponed cards ride at the end of the day, after the finals —
          // visible, dimmed, VOID (never counted in the day's record).
          let pn = 0;
          const ppdSec = ppdGames.length
            ? `<div class="slate-sec ppdsec"><div class="sec-hd"><span class="sec-lab">Postponed</span><span class="sec-n">${ppdGames.length}</span></div><div class="slate">${ppdGames.map((g: any) => ppdCard(g, pn++)).join("")}</div></div>`
            : "";
          const grouped = `${section("Live", grp.live, "live")}${section(grp.live.length ? "Upcoming" : "Live & Upcoming", grp.pre)}${section("Final", grp.final, "final")}${ppdSec}`;
          const lgSuffix = league === "all" ? "" : ` ${SPORT_LABEL[league]}`;
          // Future slate: the schedule is known but picks aren't published yet — banner + countdown.
          const futureBanner = isFuture && !anyPick ? futureNote(dispDate, false, games) : "";
          const nAll = games.length + ppdGames.length;
          // Tier legend rides at the very BOTTOM of the slate (Leon) — reference, not headline.
          body.innerHTML = `${futureBanner}${rail}${grouped}
            ${anyPick ? tierLegend() : ""}
            <div class="refnote">${nAll}${esc(lgSuffix)} game${nAll > 1 ? "s" : ""} · ${esc(dispDate)}${ppdGames.length ? ` · ${ppdGames.length} postponed` : ""}</div>`;
        }
      }
      // League counts — from the loaded snapshot, or the live board when browsing a future date.
      const cntSrc = payload || (curDate > todayISO() ? livePayload : null);
      ["all", ...SPORTS].forEach((lg) => { const el = $("cnt-" + lg); if (el) { const c = cntSrc ? gamesForLeague(cntSrc, lg).length : 0; el.textContent = c || ""; } });
      bindMeta();
      bindCards();
      startCountdowns();
      animateCounters(body);
    }

    function renderRangeBody() {
      if (!rangeGames.length) return `<div class="state"><div class="st-ico">◆</div><div class="big">No ${SPORT_LABEL[league]} games in range</div><div class="sm">These dates aren't in the archive yet. Try a wider range, another league, or head back to the live board.</div><button class="ld-retry" id="rng-back">← Today's board</button></div>`;
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
      const ap = $("allpicks"); if (ap) ap.onclick = () => switchTab("beta");
      const hl = $("howlink"); if (hl) hl.onclick = () => switchTab("beta");
      // Empty range-scan state's "back to today" (lives in the slate body, so it's bound here where
      // renderSlate rebinds — not in bindHist, which only runs when the history panel opens).
      const rgb = $("rng-back"); if (rgb) rgb.onclick = () => { rangeMode = false; curDate = todayISO(); refreshStrip(); selectDate(); };
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
      dayLoading = true;
      try { payload = await loadDay(curDate); } catch { payload = null; }  // no eternal skeleton on a failed/empty load
      dayLoading = false;
      const lg = bestLeague();
      if (lg !== league) {
        league = lg;
        root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
        positionInk();
      }
      renderSlate();
    }

    function bindCards() {
      const tlh = $("tl-how"); if (tlh) tlh.onclick = (e: any) => { e.stopPropagation(); switchTab("beta"); };
      root.querySelectorAll(".tile[data-gid], .feat[data-gid], .tpk[data-gid]").forEach((bx: any) => {
        const open = (e: any) => {
          if (e && e.target && e.target.closest && e.target.closest("[data-up]")) { openUnlock(); return; }
          const g = findGame(bx.dataset.gid); if (g) openDetail(g);
        };
        bx.onclick = open;
        bx.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
      });
    }
    function findGame(gid: any) {
      const pool = rangeMode ? rangeGames.flatMap((d: any) => d.games) : (payload ? payload.games : []);
      const hit = (pool || []).find((x: any) => String(x.game_id) === String(gid));
      // Fall back to the slate we actually rendered — this is the ONLY place synthesized future
      // tiles (v4-feed-only, absent from payload) live, so without this a tomorrow tile can't open.
      return hit || (slateGames || []).find((x: any) => String(x.game_id) === String(gid));
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
      // v4 picks carry their own honest why (model % vs break-even, EV, star basis).
      if (pl && pl.src === "v4" && Array.isArray(pl.why) && pl.why.length) return pl.why.slice(0, 4);
      const s: string[] = [];
      const unit = SPORT_UNIT[g.sport] || "points";
      const ps = g.predicted_score || {};
      if (pl.market === "total") {
        const pk = g.total_pick || {};
        const line = pl.line != null ? pl.line : (pk.line != null ? Number(pk.line) : null);
        // Prefer v3's RECONCILED display total so the stated projection agrees with the pick side
        // (no more "OVER 8.5" next to a predicted 7.9). Fall back to the legacy proj when v3 is absent.
        const proj = v3PredTotal(g) != null ? v3PredTotal(g)
          : (pk.our_proj != null ? Number(pk.our_proj)
          : (ps.home != null && ps.away != null ? Number(ps.home) + Number(ps.away) : null));
        const over = /over/i.test(String(pl.side || ""));
        if (proj != null && line != null)
          s.push(`Our model expects about ${num(proj, 1)} ${unit} in this game — ${over ? "more" : "fewer"} than the ${num(line, 1)} the books are offering.`);
      } else if (pl.market === "spread") {
        const _v3s = v3Score(g);
        const aw = _v3s ? _v3s.away : (ps.away != null ? Number(ps.away) : null);
        const hm = _v3s ? _v3s.home : (ps.home != null ? Number(ps.home) : null);
        if (aw != null && hm != null)
          s.push(`Our model's expected final is ${esc(g.away_abbr)} ${num(aw, 1)}–${num(hm, 1)} ${esc(g.home_abbr)}, which lands on the ${esc(pl.side || "")} side of the line.`);
      } else if (pl.market === "moneyline") {
        const mp = g.ml_pick || {};
        const _side = pl.side || mp.side;
        const _v3wp = v3WinProb(g, _side === g.away_abbr ? "away" : "home");
        const ourWp = _v3wp != null ? _v3wp : (mp.our_winprob != null ? Number(mp.our_winprob) : null);
        if (ourWp != null) {
          const be = pl.price != null ? breakevenProb(pl.price) : null;
          if (be != null && ourWp <= be)
            s.push(`Our model gives ${esc(_side || "this side")} about a ${(ourWp * 100).toFixed(0)}% chance to win — but at ${fmtOdds(pl.price)} you'd need about ${(be * 100).toFixed(0)}% just to break even, so it's a low-confidence lean at this price, not a strong bet.`);
          else
            s.push(`Our model gives ${esc(_side || "this side")} about a ${(ourWp * 100).toFixed(0)}% chance to win${be != null ? ` — past the ${(be * 100).toFixed(0)}% the ${fmtOdds(pl.price)} price needs to profit` : " — more than the price implies"}.`);
        }
      }
      if (pl.nlines != null && pl.nlines >= 2)
        s.push(`The sportsbooks themselves don't agree on this line today — they're posting ${pl.nlines} different numbers — and split lines like that have historically been beatable.`);
      if (pl.value_tier) {
        s.push(`Calls flagged exactly this way have won at a profitable clip across four seasons of graded history — that track record is why this one clears our bar.`);
      } else {
        if (pl.p != null && pl.price != null) {
          const be = breakevenProb(pl.price);
          if (be != null && Number(pl.p) <= be)
            s.push(`The model gives this about a ${(Number(pl.p) * 100).toFixed(0)}% chance to win, but ${fmtOdds(pl.price)} needs roughly ${(be * 100).toFixed(0)}% just to break even — so it's a low-confidence lean at this price, not a strong bet.`);
          else
            s.push(`The model gives this about a ${(Number(pl.p) * 100).toFixed(0)}% chance to win at ${fmtOdds(pl.price)}${be != null ? `, clear of the ${(be * 100).toFixed(0)}% break-even` : ""}.`);
        }
        s.push(`Like every DiamondEdge Pick, this one is graded against the final score — the full running record is on the Insights tab.`);
      }
      return s.slice(0, 4);
    }
    const passWhy = () =>
      `We checked the spread, the total and the moneyline for this game, and none of them offered a real advantage over the books' numbers. Passing is part of the strategy — most games don't have a bet worth taking.`;


    // ---- power-user blocks kept under "More detail" ----

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
          : live === "clinch-won" ? "✓ CLINCHED" : live === "clinch-lost" ? "✗ NOT LANDING" : live === "inplay" ? "IN PLAY" : "";
        head = `<div class="shp-head take ${rCls}">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          <span class="shp-act">BET</span>
          <span class="shp-side">${esc(pl.side || "—")}</span>
          ${pl.price != null ? `<span class="shp-px">${fmtOdds(pl.price)}</span>` : ""}
          <span class="shp-q">${pl.stars != null ? pickStars(pl) : Q_LABEL[qualityOf(pl)]}</span>
          ${resTxt ? `<span class="shp-res ${rCls || "inplay"}">${resTxt}</span>` : ""}
        </div>`;
      } else {
        // a pass names the number it judged — the line + the plain-English why
        const passNote = pl.v4pass ? plainPassReason(pl.v4pass) : "no edge in this market";
        head = `<div class="shp-head pass">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          <span class="shp-act pass">PASS</span>
          <span class="shp-passnote">${esc(passNote)}</span>
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
      if (pl.src === "v4") {
        // model-covered: the chips come from THE PICK's own numbers (win prob vs the price's
        // break-even + the EV) — never a legacy projection that could disagree with it.
        if (pl.action === "TAKE" && pl.p != null && pl.price != null) {
          const be = breakevenProb(pl.price);
          mvm = `<div class="shp-mvm">
            <span class="mvm-chip">our win chance ${saPct(pl.p, 0)}</span>
            ${be != null ? `<span class="mvm-chip">needs ${saPct(be, 0)} at ${fmtOdds(pl.price)}</span>` : ""}
            ${pl.ev != null ? `<span class="mvm-chip ${pl.ev >= 0 ? "pos" : "neg"}">${pl.ev >= 0 ? "+" : ""}${(pl.ev * 100).toFixed(1)}% per dollar</span>` : ""}
          </div>`;
        }
      } else if (pl.action === "TAKE" && pl.src === "sa" && pl.sa) {
        const sa = pl.sa;
        mvm = `<div class="shp-mvm">
          ${sa.model_p_cover != null ? `<span class="mvm-chip">our model ${saPct(sa.model_p_cover, 0)}</span>` : ""}
          ${sa.market_p_cover != null ? `<span class="mvm-chip">the market ${saPct(sa.market_p_cover, 0)}</span>` : ""}
        </div>`;
      } else if (pk && (mk === "total" ? (v3PredTotal(g) != null || pk.our_proj != null) : pk.our_proj != null) && pk.line != null) {
        // For a TOTAL, prefer v3's reconciled number and recompute the gap so model/line/gap all
        // agree with the pick side. Spread keeps its legacy our_proj (v3 doesn't reconcile spread).
        const _v3tot = mk === "total" ? v3PredTotal(g) : null;
        const modelV = _v3tot != null ? _v3tot : Number(pk.our_proj);
        const gapV = _v3tot != null ? modelV - Number(pk.line) : Number(pk.gap);
        // Correct push accounting: when v3 gives a meaningful push chance (integer lines), show it
        // as its OWN chip so it's never silently folded into UNDER. Dormant until the backend serves
        // distribution/p_push (currently null everywhere) — additive and defensive.
        const _pu = mk === "total" ? v3Push(g) : null;
        const pushChip = (_pu && _pu.p_push != null && _pu.p_push >= 0.005)
          ? `<span class="mvm-chip">push ${saPct(_pu.p_push, 1)}</span>` : "";
        mvm = `<div class="shp-mvm">
          <span class="mvm-chip">model ${num(modelV, 1)}</span>
          <span class="mvm-chip">line ${num(pk.line, 1)}</span>
          <span class="mvm-chip ${gapV >= 0 ? "pos" : "neg"}">gap ${sgn(gapV, 1)} ${SPORT_UNIT[g.sport] || ""}</span>
          ${pushChip}
        </div>`;
      } else if (pk && (v3WinProb(g, pk.side === g.away_abbr ? "away" : "home") != null || pk.our_winprob != null)) {
        // Prefer v3's reconciled win prob for the picked side; else the pick's own our_winprob.
        const _wp = v3WinProb(g, pk.side === g.away_abbr ? "away" : "home");
        const ourWp = _wp != null ? _wp : Number(pk.our_winprob);
        mvm = `<div class="shp-mvm"><span class="mvm-chip">model win prob ${saPct(ourWp, 1)}</span>${pk.market_winprob != null ? `<span class="mvm-chip">market ${saPct(pk.market_winprob, 1)}</span>` : ""}</div>`;
      }
      // legacy lean meters / line-move only for games the model doesn't cover — their numbers
      // come from a different seam and must never sit beside a model pick.
      const move = pl.src !== "v4" && pk ? lineMove(pk) : "";
      const lean = pl.src !== "v4" && pk ? (mk === "moneyline" ? wpLean(pk, g) : leanMeter(pk, mk, g)) : "";
      const viz = (move || lean) ? `<div class="shp-viz">${lean ? `<span class="shp-lean">${lean}</span>` : ""}${move}</div>` : "";
      const lread = pl.action === "TAKE" ? latestReadPill(g, pl) : "";
      const lreadBlk = lread ? `<div class="shp-lread">${lread}<span class="lr-note">the model's latest look — the graded morning play above is unchanged</span></div>` : "";
      return `<div class="shp ${pl.action === "TAKE" ? "is-take" : "is-pass"}">
        ${head}${lreadBlk}${recipeBlk}${why}${mvm}${viz}
      </div>`;
    }


    // ===================== SHAREABLE GAME URLS + SOCIAL =====================
    // Real per-game routing: ?g=<game_id> via history.pushState so a game sheet is
    // deep-linkable, shareable, and back/forward/refresh restores it. (OG preview images
    // need SSR, which this client app lacks — so link previews stay generic for now; the
    // shareable URL + native share work today.)
    // SHARE url uses the /g/<id> route so a shared link unfurls to that game's OG card; the route
    // redirects humans into the app (?g=<id>). Internal navigation keeps the lightweight ?g= form.
    function shareGameUrl(gid: any) {
      try { return location.origin + "/g/" + encodeURIComponent(String(gid)); } catch { return location.origin + "/g/" + gid; }
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
      const url = shareGameUrl(g.game_id);
      const title = "DiamondEdge";
      const text = shareText(g);
      if ((navigator as any).share) {
        try { await (navigator as any).share({ title, text, url }); return; } catch { /* user cancelled or unsupported */ }
      }
      // Desktop (no Web Share) — copy the SAME compelling text the share sheet would show
      // (pick + matchup) with the link, not a bare URL. The link still unfurls to the OG card.
      const clip = `${text} ${url}`;
      try {
        await navigator.clipboard.writeText(clip);
        toast("Copied — paste it anywhere");
      } catch {
        // last-resort fallback: a temporary selection
        try { const ta = document.createElement("textarea"); ta.value = clip; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("Copied to clipboard"); } catch { toast("Copy this: " + clip); }
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
    // Share tagline — lead with the HONEST forward expectation (not the in-sample backtest %),
    // then the clean out-of-sample evidence. Social proof that doesn't overstate the edge.
    function shareTagline() {
      // Shared text is the easiest place to accidentally publish a backtest as a record —
      // so it quotes the LIVE-SERVED number, with its start date, or nothing at all.
      const hr = headlineStrategyRecord(betaData);
      if (hr && hr.live) {
        const since = stratDateTxt(hr.activation);
        return `DiamondEdge — every pick star-rated 1–5 and graded in the open. Live-served${since ? ` since ${since}` : ""}: ${stratWL(hr.live)}${hr.live.hit != null ? ` (${stratPct(hr.live.hit)})` : ""}${hr.live.roi != null ? ` at ${stratRoi(hr.live.roi)} return` : ""}.`;
      }
      return "DiamondEdge — every sports pick star-rated 1–5 and graded in the open.";
    }
    function socialShareBar() {
      const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.origin + location.pathname; } })();
      const txt = shareTagline();
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
      // (a0) FINAL games — lead with the graded outcome: did our pick hit? This is the whole
      // "graded in the open" promise, and it's the first thing a user wants on "How it went".
      if (gs.kind === "final") {
        const P = gamePlays(g);
        const pl = P.total && P.total.action === "TAKE" ? P.total : displayPick(g);   // prefer the totals Pick (the edge)
        const r = pickResult(g, pl);
        if (pl && pl.action === "TAKE" && r) {
          const finalTotal = (gs.score && gs.score.away != null && gs.score.home != null) ? Number(gs.score.away) + Number(gs.score.home) : null;
          const rlab = r === "hit" ? "Hit ✓" : r === "miss" ? "Missed" : "Push";
          const showTot = pl.market === "total" && finalTotal != null;
          rows.push(`<div class="lp-graded ${r}"><div class="lpg-top"><span class="lpg-lab">The DiamondEdge Pick — graded</span><span class="lpg-res ${r}">${rlab}</span></div><div class="lpg-detail"><b>${esc(pl.side || "")}</b>${showTot ? ` · final total <b>${finalTotal}</b>` : ""}</div></div>`);
        }
      }
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
        // (a1) TRACKING READ — is our surfaced pick on course to cash? Computed from the live
        // score/inning fields above (no projection). The totals edge gets the rich runs-vs-line
        // read; a spread/ML lean gets a lighter scoreboard status. Context, not a new pick.
        // MLB: the LOCKED unified pick is the only pick we track live — no legacy fallback.
        const plLive = g.sport === "mlb" ? displayPick(g)
          : (() => { const Plive = gamePlays(g); return (Plive.total && Plive.total.action === "TAKE") ? Plive.total : (displayPick(g) || bestPlay(g)); })();
        const trackCard = plLive ? liveTrackCard(g, plLive) : "";
        if (trackCard) rows.push(trackCard);
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
      // During the FIRST live_detail fetch we only have the bare score — tell the user the full
      // box score is on its way (self-limiting: once the fetch lands it renders, or clears if none).
      if (gs.kind === "live" && !d && !liveDetailTried && rows.length) rows.push(`<div class="lp-loading"><span class="lp-spin" aria-hidden="true"></span>Loading the full box score…</div>`);
      if (!rows.length) rows.push(`<div class="state mini"><div class="sm">Live box score updating…</div></div>`);
      return `<div class="livepanel">${rows.join("")}</div>`;
    }

    // A compact TABLE of the model's lean on every market — side + line + confidence (or Pass) —
    // shown at the top of the game detail; the narrative below explains WHY.
    function marketsTable(g: any) {
      const P = gamePlays(g);
      const row = (mk: string, label: string) => {
        const pl = P[mk];
        const line = vegasLine(g, mk);
        if (isPick(pl)) {
          const q = qualityOf(pl);
          const low = isLowConf(pl);
          const st = playState(g, pl);
          const locked = pickLocked(pl, st);
          const sideTxt = String(pl.side) + (pl.line != null && !/\d/.test(String(pl.side)) ? " " + lineStr(pl.line) : "");
          const call = locked
            ? `<span class="mt-lock" data-up="1">${lockSvg} ${esc(unlockCtaTxt())}</span>`
            : `<span class="mt-side">${pickArrow(pl)} ${esc(sideTxt)}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}</span>`;
          const conf = locked
            ? `<span class="mt-conf blur" aria-hidden="true">★★★</span>`
            : `<span class="mt-conf">${pickStars(pl)}${pl.grade != null && pl.grade > 0 ? pickGrade(pl) : `<i>${esc(confWord(pl))}</i>`}</span>`;
          return `<tr class="mt-take q-${q} ${st}${low ? " low" : ""}"><td class="mt-mk">${label}</td><td class="mt-line">${line || "—"}</td><td class="mt-call">${call}</td><td class="mt-c">${conf}</td></tr>`;
        }
        // A TRUE pass — explained like a human would say it.
        const pr = pl && pl.v4pass ? plainPassReason(pl.v4pass) : "";
        return `<tr class="mt-pass"><td class="mt-mk">${label}</td><td class="mt-line">${line || "—"}</td><td class="mt-call"><span class="mt-passlab">Pass</span>${pr ? `<span class="mt-passwhy">${esc(pr)}</span>` : ""}</td><td class="mt-c">—</td></tr>`;
      };
      // TOTALS-ONLY product: only the over/under is our call — no spread/ML rows.
      return `<div class="mkt-table"><div class="mt-h">The DiamondEdge call</div>
        <table class="mt-tbl"><thead><tr><th>Market</th><th>Line</th><th>Our call</th><th>Confidence</th></tr></thead>
        <tbody>${row("total", "Total (O/U)")}</tbody></table></div>`;
    }
    // The core thesis, made visible: OUR number vs the MARKET's, and the gap that makes the bet.
    function deDivergence(g: any, lead: any) {
      if (!lead || lead.action !== "TAKE") return "";
      // v4 picks: the gap IS win-prob vs the price's break-even — shown from the model's own
      // numbers (never the legacy projections, which can disagree with the new pick).
      if (lead.src === "v4" && lead.p != null && lead.price != null) {
        const be = breakevenProb(lead.price);
        if (be != null) {
          const up = lead.p > be;
          return `<div class="de-diverge ${up ? "over" : "under"}">
            <div class="dd-pair"><div class="dd-cell ours"><span class="dd-k">Our win chance</span><b>${(lead.p * 100).toFixed(0)}%</b></div><div class="dd-vs">vs</div><div class="dd-cell"><span class="dd-k">Break-even at ${fmtOdds(lead.price)}</span><b>${(be * 100).toFixed(0)}%</b></div></div>
            <div class="dd-gap">We clear the price by <b>${((lead.p - be) * 100).toFixed(1)} points</b> — that margin is the bet${lead.stars != null ? `, rated <b>${"★".repeat(Math.max(1, Math.min(5, lead.stars)))}</b>` : ""}.</div>
          </div>`;
        }
      }
      if (lead.src === "v4") return "";
      if (lead.market === "total") {
        const our = v3PredTotal(g) != null ? Number(v3PredTotal(g)) : (g.total_pick && g.total_pick.our_proj != null ? Number(g.total_pick.our_proj) : null);
        const line = lead.line != null ? Number(lead.line) : (g.total_pick && g.total_pick.line != null ? Number(g.total_pick.line) : null);
        if (our == null || line == null) return "";
        const diff = our - line, over = diff > 0;
        return `<div class="de-diverge ${over ? "over" : "under"}">
          <div class="dd-pair"><div class="dd-cell ours"><span class="dd-k">Our projection</span><b>${num(our, 1)}</b></div><div class="dd-vs">vs</div><div class="dd-cell"><span class="dd-k">Vegas total</span><b>${num(line, 1)}</b></div></div>
          <div class="dd-gap">We see <b>${num(Math.abs(diff), 1)}</b> ${over ? "more" : "fewer"} runs than the market — that gap is the <b>${over ? "OVER" : "UNDER"}</b>.</div>
        </div>`;
      }
      const mp = g.ml_pick;
      if ((lead.market === "moneyline" || lead.market === "spread") && mp) {
        const which: "home" | "away" = (mp.side || g.home_abbr) === g.away_abbr ? "away" : "home";
        const our = v3WinProb(g, which) != null ? Number(v3WinProb(g, which)) : (mp.our_winprob != null ? Number(mp.our_winprob) : null);
        let mkt = mp.market_winprob != null ? Number(mp.market_winprob) : (mp.price != null && Number(mp.price) > 1 && Number(mp.price) < 100 ? 1 / Number(mp.price) : null);
        if (our == null || mkt == null) return "";
        const edge = (our - mkt) * 100;
        return `<div class="de-diverge ${edge > 0 ? "over" : "under"}">
          <div class="dd-pair"><div class="dd-cell ours"><span class="dd-k">Our win chance · ${esc(mp.side || g.home_abbr)}</span><b>${(our * 100).toFixed(0)}%</b></div><div class="dd-vs">vs</div><div class="dd-cell"><span class="dd-k">Market implies</span><b>${(mkt * 100).toFixed(0)}%</b></div></div>
          <div class="dd-gap">We give <b>${esc(mp.side || g.home_abbr)}</b> a <b>${Math.abs(edge).toFixed(0)}-point</b> ${edge > 0 ? "better" : "worse"} chance than the price implies.</div>
        </div>`;
      }
      return "";
    }
    // ═══════════ EVERY STRATEGY ON THIS GAME (the per-game transparency panel) ═══════════
    // Tap any pick → what each stream said about THAT game: its side, line, price,
    // conviction, and for the ones that declined, the reason. The SERVED pick is pinned and
    // ringed; a NO_VIEW is stated out loud rather than silently omitted; a PASS that still
    // carries a side is shown as the model's lean with the existing honesty label.
    // Each row's lifetime line shows that stream's LIVE-SERVED record only — the backtest is
    // named but never folded in, and the panel says the streams overlap in plain language.
    function strategyRowHtml(s: any) {
      const served = s.headline;
      const isPickRow = s.status === "PICK";
      const noView = s.status === "NO_VIEW";
      const statusTxt = isPickRow ? "PICK" : noView ? "NO VIEW" : "PASS";
      const statusCls = isPickRow ? "is-pick" : noView ? "is-noview" : "is-pass";
      const dirCls = s.dir === "over" ? "ou-over" : s.dir === "under" ? "ou-under" : "";
      const call = noView
        ? `<span class="sgr-side is-noview"><b>No view on this game</b></span>`
        : isPickRow
          ? `<span class="sgr-side ${dirCls}">${stratArrow(s)} <b>${esc(stratCall(s))}</b></span>${s.price != null ? `<i class="sgr-px">${fmtOdds(s.price)}</i>` : ""}`
          : `<span class="sgr-side is-pass"><b>Pass</b></span>${s.lean ? `<i class="sgr-lean-side ${dirCls}">${stratArrow(s)} ${esc(stratCall(s))}${s.price != null ? ` ${fmtOdds(s.price)}` : ""}</i>` : (s.line != null ? `<i class="sgr-px">judged at ${esc(lineStr(s.line))}</i>` : "")}`;
      const conf = !noView && (s.stars != null || s.score != null)
        ? `<span class="sgr-q">${s.stars != null ? bStars(s.stars) : ""}${s.score != null ? `<i class="pgrade${isPickRow ? "" : " muted"}">${s.score.toFixed(2)}</i>` : ""}</span>`
        : "";
      // Only a PICK gets a W/L badge. A PASS may be graded in the payload, but we did not
      // bet it — a green WON on a pass is exactly the hindsight bait this panel prevents.
      const res = s.result === "win" ? `<span class="sgr-res won">WON</span>`
        : s.result === "loss" ? `<span class="sgr-res lost">LOST</span>`
        : s.result === "push" ? `<span class="sgr-res pushed">PUSH</span>` : "";
      const rec = strategyRecordFor(s.key);
      const lv = rec && rec.live;
      const btN = rec && rec.backtests.length ? rec.backtests.reduce((a: number, b: any) => a + b.n, 0) : 0;
      const recLine = rec
        ? `<div class="sgr-rec">${lv
            ? `<em class="sgr-lv">Live</em> ${esc(stratWL(lv))}${lv.hit != null ? ` · ${stratPct(lv.hit)}` : ""}${lv.roi != null ? ` · <b class="${lv.roi >= 0 ? "pos" : "neg"}">${stratRoi(lv.roi)} ROI</b>` : ""}${rec.activation ? ` · served since ${esc(stratDateTxt(rec.activation) || rec.activation)}` : ""}`
            : `<em class="sgr-lv none">Live</em> no live-served picks yet`}${btN ? `<span class="sgr-btnote">+ ${btN} backtested — reported separately, never added in</span>` : ""}</div>`
        : "";
      const why = s.reason ? `<div class="sgr-why${noView ? " dim" : ""}">${esc(s.reason)}</div>` : "";
      const srcNote = s.servedSrc && !served ? `<div class="sgr-src">This is the stream the served pick came from.</div>` : "";
      // SIMULATOR: the physics-model voice — its P(over) shown against the market's per
      // game. (The timid "tracking, not bets" chrome is gone — the record is the honesty.)
      const isSimulator = s.key === "simulator";
      const simProb = isSimulator && s.sim_p_over != null
        ? `<div class="sgr-why">Sim's price: <b>${(s.sim_p_over * 100).toFixed(1)}%</b> chance the total goes over${s.sim_p_over_market != null ? ` · the market says <b>${(s.sim_p_over_market * 100).toFixed(1)}%</b>` : ""}${s.sim_median != null ? ` · sim median ${num(s.sim_median, 0)} runs` : ""}</div>`
        : "";
      return `<div class="sgr ${statusCls}${served ? " served" : ""}">
        <div class="sgr-top">
          <span class="sgr-lab">${esc(s.label)}</span>
          ${served ? `<span class="sgr-served">◆ Served</span>` : ""}
          <span class="sgr-status ${statusCls}">${statusTxt}</span>
        </div>
        <div class="sgr-call">${call}${conf}${res}</div>
        ${simProb}
        ${why}
        ${srcNote}
        ${recLine}
      </div>`;
    }
    function strategiesPanel(g: any) {
      const list = gameStrategies(g);
      if (!list.length) return "";
      const nPick = list.filter((s: any) => s.status === "PICK").length;
      const nPass = list.filter((s: any) => s.status === "PASS").length;
      const nNo = list.filter((s: any) => s.status === "NO_VIEW").length;
      const counts = [`${nPick} would bet it`, nPass ? `${nPass} passed` : "", nNo ? `${nNo} had no view` : ""].filter(Boolean).join(" · ");
      return `<div class="stgy" id="stgy-panel">
        <div class="stgy-h"><span class="stgy-k">◆ Every strategy on this game</span><span class="stgy-count">${list.length} streams${counts ? ` · ${esc(counts)}` : ""}</span></div>
        <p class="stgy-lede">These are the separate rule-sets we run over the same game. <b>Exactly one is served as the DiamondEdge Pick</b> — it's marked below. The others are here so the calls we <i>didn't</i> make, and why, are on the record too.</p>
        <div class="stgy-rows">${list.map(strategyRowHtml).join("")}</div>
        <div class="stgy-note"><b>These overlap — never add them up.</b> The same game shows up in more than one stream, so these are the same bets seen from different angles, not four independent bets. Each lifetime line above is that stream's <b>live-served</b> record from its own start date; anything backtested is counted separately and never blended in. And reading down this list afterwards to find whichever one got it right isn't a strategy, it's hindsight — we serve one pick per game, before the game, and grade that one.</div>
      </div>`;
    }
    // A one-line entry point on the Preview pane — the counts, then straight to the panel.
    function strategiesTeaser(g: any) {
      const list = gameStrategies(g);
      if (!list.length) return "";
      const nPick = list.filter((s: any) => s.status === "PICK").length;
      return `<button class="stgy-teaser" data-gostrat="1" aria-label="See every strategy's take on this game">
        <span class="sgt-k">Every strategy on this game</span>
        <span class="sgt-sum">${list.length} streams · ${nPick} would bet it</span>
        <span class="sgt-go" aria-hidden="true">›</span>
      </button>`;
    }
    // The DiamondEdge reasoning tab: a plain-English narrative FIRST, then the divergence, the
    // data visuals (graphs), the model-vs-market read, and the driving factors. Easy to follow, deep.
    function diamondEdgeReasoning(g: any, lead: any, leadLocked: boolean) {
      if (leadLocked) {
        return `<div class="de-pane"><div class="de-lead"><div class="de-k">◆ The DiamondEdge Read</div><p>The full model reasoning — our projected number, where it diverges from the market, and the data behind it — is part of DiamondEdge Premium.</p><button class="de-unlock" data-up="1">${lockSvg} ${isSignedIn() ? "Unlock the reasoning" : "Sign in to unlock the reasoning"}</button></div></div>`;
      }
      const why = lead && lead.action === "TAKE" ? whySentences(g, lead) : composedPreview(g).paras;
      const narrative = why && why.length ? `<div class="de-sec"><div class="de-h">The read</div>${why.slice(0, 4).map((w: string) => `<p>${mdBold(w)}</p>`).join("")}</div>` : "";
      const div = deDivergence(g, lead);
      const viz = previewViz(g);
      const facts = factRows(g, gameArticle(g));
      const stks = gameStreaks(g).slice(0, 4).map((s: any) => `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      const lead2 = lead && lead.action === "TAKE";
      const intro = lead2
        ? `How the model sees ${esc(g.away_abbr)} at ${esc(g.home_abbr)} — and where it disagrees with Vegas.`
        : `We're passing this one. Here's the read that didn't clear our bar.`;
      // THE DESK DEBATE leads when the four analysts are served — the strategies panel
      // stays available underneath as the raw streams; without the desk it renders as before.
      const debate = deskDebatePanel(g, leadLocked);
      const stratHtml = strategiesPanel(g);
      return `<div class="de-pane">
        <div class="de-lead"><div class="de-k">◆ Why DiamondEdge ${lead2 ? "is on this" : "passed"}</div><p class="de-sub">${intro}</p></div>
        ${debate || stratHtml}
        ${debate && stratHtml ? `<details class="dskdb-raw"><summary><span>The raw model streams behind the desk</span><span class="sgc-caret" aria-hidden="true">›</span></summary>${stratHtml.replace(' id="stgy-panel"', "")}</details>` : ""}
        ${narrative}
        ${div ? `<div class="de-sec"><div class="de-h">Our number vs the market</div>${div}</div>` : ""}
        ${viz ? `<div class="de-sec"><div class="de-h">The numbers</div>${viz}</div>` : ""}
        ${(facts.length || stks) ? `<div class="de-sec"><div class="de-h">What's driving it</div>${stks ? `<div class="pv-stks">${stks}</div>` : ""}${facts.length ? `<div class="ls-facts">${facts.join("")}</div>` : ""}</div>` : ""}
      </div>`;
    }
    // POST-GAME RECAP (own tab, only when final): the result, how our pick did, and a served
    // recap story if the backend provides one (g.article.recap). The Preview stays the pregame read.
    function gameRecap(g: any) {
      const gs = gameState(g);
      const sc = gs.score;
      const away = g.away_abbr, home = g.home_abbr;
      const finalTxt = sc && sc.split && sc.home != null ? `Final — ${esc(away)} ${num(sc.away, 0)}, ${esc(home)} ${num(sc.home, 0)}` : "Final";
      const bits: string[] = [];
      if (sc && sc.split && sc.home != null) {
        if (sc.home === sc.away) bits.push(`${esc(g.away_team || away)} and ${esc(g.home_team || home)} finished level at ${num(sc.away, 0)}–${num(sc.home, 0)}.`);
        else {
          const wName = sc.home > sc.away ? esc(g.home_team || home) : esc(g.away_team || away);
          bits.push(`${wName} took it ${Math.max(sc.home, sc.away)}–${Math.min(sc.home, sc.away)}.`);
        }
      }
      const pl = displayPick(g);
      if (isPick(pl)) {
        const st = playState(g, pl);
        const sideTxt = String(pl.side) + (pl.line != null && !/\d/.test(String(pl.side)) ? " " + lineStr(pl.line) : "");
        const low = isLowConf(pl) ? "low-confidence " : "";
        if (st === "won") bits.push(`Our ${low}pick — <b>${esc(sideTxt)}</b> — cashed.`);
        else if (st === "lost") bits.push(`Our ${low}pick — <b>${esc(sideTxt)}</b> — came up short.`);
        else if (st === "pushed") bits.push(`Our pick — <b>${esc(sideTxt)}</b> — pushed.`);
      }
      const art = gameArticle(g);
      const recapRaw = art && (art as any).recap;
      const recapParas = Array.isArray(recapRaw) ? recapRaw : (recapRaw ? [String(recapRaw)] : []);
      return `<div class="de-pane">
        <div class="de-lead"><div class="de-k">◆ Recap</div><p class="de-sub">${finalTxt}</p></div>
        ${bits.length ? `<div class="de-sec"><div class="de-h">How it finished</div>${bits.map((b) => `<p>${b}</p>`).join("")}</div>` : ""}
        ${recapParas.length ? `<div class="de-sec"><div class="de-h">The story</div>${recapParas.map((p: any) => `<p>${mdBold(cleanBlurb(String(p)))}</p>`).join("")}</div>` : ""}
      </div>`;
    }
    function openDetail(g: any, focusMk?: string, fromHistory = false) {
      detail = g;
      // Live & finished games open straight to "How it's going" (box score); only pre-game
      // games default to the Preview narrative.
      const _gsk = g && !g._recipe ? gameState(g).kind : "pre";
      // final + live → Box score (recap folds into it); pre-game → Preview narrative.
      detailTab = _gsk === "final" || _gsk === "live" ? "live" : "preview";
      if (!fromHistory && g && g.game_id != null && !g._recipe) pushGameUrl(g.game_id);
      if (g && g.game_id != null && !g._recipe) { try { document.title = `${g.away_abbr} @ ${g.home_abbr} — DiamondEdge`; } catch {} }
      // Everything the detail body renders is derived FROM g (+ the live feeds by key), so it's
      // wrapped in one closure we can re-run in place: when pitchers_v4 / teams_v4 / the v4 board
      // land AFTER the first paint (async feeds), we rebuild #gp-body so the pitcher cards,
      // records+form, and the pick appear — the SAME reason a bare synthesized future tile fills
      // in once its feeds arrive. Reads detailTab live so the active tab is preserved on rebuild.
      function buildBody() {
      const sp = g.sport;
      const ps = g.predicted_score || {};
      const dispDate = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
      const gs = gameState(g);
      const startTxt = gs.si.hasTime ? gs.si.time : gs.si.date;
      // "Our number" prefers v3's RECONCILED display total (agrees with the pick side); falls back
      // to the legacy predicted-score sum / total_pick.our_proj exactly as before when v3 is absent.
      const _v3tot = v3PredTotal(g);
      const tot = _v3tot != null ? num(_v3tot, 1)
        : ((ps.home != null && ps.away != null) ? num(Number(ps.home) + Number(ps.away), 1)
        : (g.total_pick && g.total_pick.our_proj != null ? num(g.total_pick.our_proj) : "—"));
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
      const mastHead = matchupHeadline(g, lead);
      const mastDek = art && art.dek && !PICK_WORDS.test(cleanBlurb(art.dek)) ? mdBold(cleanBlurb(art.dek)) : "";
      const kickLine = [SPORT_LABEL[sp] || sp, g.meta && g.meta.competition ? esc(g.meta.competition) : ""].filter(Boolean).join(" · ");
      const previewMasthead = `<div class="sh-mast">
        <div class="sh-mast-kick">${esc(kickLine || "Game Preview")}</div>
        <h2 class="sh-mast-h">${mastHead}</h2>
        ${mastDek ? `<p class="sh-mast-dek">${mastDek}</p>` : ""}
        <div class="sh-mast-byline">DiamondEdge Preview${dispDate ? ` · ${esc(dispDate)}` : ""}${startTxt ? ` · ${esc(startTxt)}` : ""}</div>
        ${(consensusBanner(g, leadLocked) || simSaysChip(g, "big")) ? `<div class="sh-desk">${consensusBanner(g, leadLocked)}${simSaysChip(g, "big")}</div>` : ""}
      </div>`;
      // PASS games get an explicit no-bet block that NAMES the lines we judged — a pass is
      // a priced decision, and it reads like one.
      const passBlock = (!lead && !leadLocked)
        ? (() => {
            const judged = MARKETS.map((mk) => vegasLine(g, mk)).filter(Boolean);
            const why = judged.length
              ? `We priced every market — ${judged.join(", ")} — and none of them beat our number. The pass is the pick.`
              : passWhy();
            return `<div class="callcard pass"><div class="cc-k">${pickLabel(g)}</div>
            <p class="cc-passwhy">${why}</p></div>`;
          })()
        : "";

      // (2) GAME PREVIEW — the article STARTS as a pure game preview (no pick spoiler):
      // served game.article first, composed from the same real fields otherwise.
      const bodyParas = leadLocked ? [] : (art && art.paras.length ? art.paras : (lead ? whySentences(g, lead) : composedPreview(g).paras));
      const facts = leadLocked ? [] : factRows(g, art);
      const stks = leadLocked ? "" : gameStreaks(g).slice(0, 4).map((s: any) =>
        `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      // The bold, banded pick sub-headline — surfaced AFTER the preview + betting, as the
      // article's payoff (never a spoiler up top). Appears exactly ONCE per view.
      // The payoff callout speaks ONLY from the display pick (model-first): the side + real
      // price on a take, or the pass WITH the line it judged. Never a legacy headline.
      const hasTake = !!(lead && lead.action === "TAKE" && lead.side);
      const phQ = hasTake ? qualityOf(lead) : null;
      const passLn = hasTake ? "" : passLineTxt(g);
      const payoffTxt = hasTake
        ? `${lead.side}${lead.price != null ? ` (${fmtOdds(lead.price)})` : ""}`
        : `Pass${passLn ? ` — ${passLn} held no edge` : ""}`;
      const calloutKick = hasTake ? pickLabel(g).replace(/^◆\s*/, "◆ ") : "◆ The Verdict";
      const pickCallout = leadLocked
        ? `<div class="art-pick locked" data-up="1"><span class="apk-k">◆ ${esc(pickWord(g))}</span><span class="apk-txt">${isSignedIn() ? "Unlock" : "Sign in"} to see the side &amp; line ${lockSvg}</span></div>`
        : `<div class="art-pick ${hasTake ? `has q-${phQ || "lean"}` : "pass"}"><span class="apk-k">${esc(calloutKick)}</span><span class="apk-txt">${esc(payoffTxt)}</span>${hasTake ? `<span class="apk-q">${pickStars(lead)}${pickGrade(lead)}</span>` : ""}</div>`;
      // The Athletic-style data-visual rail (predicted score, win prob, form bars, etc.).
      // Context (pitchers w/ ERA, team records+form, matchup viz) is FREE — always shown,
      // even when the PICK itself is premium-locked. Only the narrative read is gated.
      const vizRail = previewViz(g);
      const previewBlock = leadLocked
        ? `${vizRail}<div class="whycard">
            <div class="wc-k">Game preview</div>
            <p>The full read behind this pick — the model number, the line it beats, and the history of calls made exactly this way — is part of DiamondEdge Premium. The quality rating above is the real one.</p>
          </div>`
        : `${vizRail}<div class="whycard preview">
            <div class="wc-k">The setup</div>
            ${bodyParas.map((w) => `<p>${mdBold(w)}</p>`).join("")}
            ${stks ? `<div class="pv-stks">${stks}</div>` : ""}
            ${facts.length ? `<div class="ls-facts">${facts.join("")}</div>` : ""}
          </div>`;

      // (3) THE LINES — one plain sentence on where the board sits (numbers sourced from the
      // SAME seam as the pick itself, so nothing here can disagree with the markets table above).
      const linesBlock = leadLocked ? "" : (() => {
        const bits: string[] = [];
        const spTxt = vegasLine(g, "spread");
        if (spTxt) {
          const m = spTxt.match(/^(\S+)\s+([+-][\d.]+)/);
          if (m) {
            const n = Number(m[2]);
            bits.push(n < 0 ? `${esc(m[1])} favored by ${num(Math.abs(n), 1)}` : n > 0 ? `${esc(m[1])} getting ${num(n, 1)}` : `a pick'em`);
          } else bits.push(spTxt);
        }
        const toTxt = vegasLine(g, "total");
        if (toTxt) bits.push(`the total at ${toTxt.replace(/^O\/U\s*/, "")}`);
        const mlTxt = vegasLine(g, "moneyline");
        if (mlTxt && g.sport !== "soccer") bits.push(`${mlTxt} on the moneyline`);
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
        </div>`;
      })();
      // The prominent pick payoff card — the article's bold DiamondEdge Pick callout.
      const pickPayoff = pickCallout;

      // (3) Power-user detail — the PICK is already surfaced above (narrative + callout),
      // so this is odds, the signature-play record, matchup intel and model notes only.
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Model Notes</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";
      const more = `<details class="more"><summary>Odds &amp; model detail<span class="more-sub">every market's number, the record, matchup intel</span></summary>
        <div class="more-body">
          <div class="dsec"><div class="dsec-h">Every market's number</div><div class="dsec-b shp-wrap">
            ${MARKETS.map((mk) => sheetPlay(g, P[mk])).join("")}
            
          </div></div>
          ${intelSection(g)}
        </div>
      </details>`;

      // FUSED HERO HEADER — the matchup (crests + records) and the live trend woven into
      // ONE header over a subtle team-tinted wash. Sits above the tabs.
      const heroScore = (gs.score && gs.score.split && gs.score.home != null)
        ? `<div class="gp-score ${gs.kind}"><b>${num(gs.score.away, 0)}</b><span class="gp-scmid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label || "Live")}`}</span><b>${num(gs.score.home, 0)}</b></div>`
        : `<div class="gp-when">${esc(startTxt || dispDate || "")}</div>`;
      const heroForm = (side: "away" | "home") => { const f = teamForm(g, side); return f && f.rec ? `<span class="gp-form">${esc(f.rec)}${f.recIsL15 ? ` <span class="gp-rec-tag">L15</span>` : ""}${f.streak ? ` <i class="${f.hot ? "hot" : ""}">${esc(f.streak)}</i>` : ""}</span>` : ""; };
      // Live trend: the served hit-odds meter when the backend ships one; otherwise our own
      // honest tracking read (runs-vs-line / scoreboard status), so a live game's hero is never
      // a bare score. The SAME read headlines the "How it's going" pane below in full.
      const heroTrend = (gs.kind === "live" && lead && !leadLocked)
        ? (liveHitOdds(g, lead, "full") || liveTrackCard(g, lead, "hero"))
        : "";
      // ATLAS LIVE rides the hero on a live game — the sim's in-game read, under the pick's
      // own cash meter. Locked (unpaid) views skip it: its number argues a side.
      const atlHero = !leadLocked ? atlasLiveChip(g, "full") : "";
      const gameHero = `<div class="gp-hero" style="--t1:${HERO_TINT[tintSheet] ? HERO_TINT[tintSheet][0] : "rgba(47,111,224,.16)"};--t2:${HERO_TINT[tintSheet] ? HERO_TINT[tintSheet][1] : "rgba(11,158,109,.12)"}">
        <div class="gp-hero-wash" aria-hidden="true"></div>
        <div class="gp-mu">
          <div class="gp-team away"><span class="gp-crest">${gCrest(g, "away")}</span><span class="gp-ab">${esc(g.away_abbr)}</span>${heroForm("away")}</div>
          <div class="gp-center">${heroScore}</div>
          <div class="gp-team home"><span class="gp-crest">${gCrest(g, "home")}</span><span class="gp-ab">${esc(g.home_abbr)}</span>${heroForm("home")}</div>
        </div>
        ${(heroTrend || atlHero) ? `<div class="gp-trend">${heroTrend}${atlHero}</div>` : ""}
      </div>`;
      // Tabs — "How it's going" only for live/final games; pre-game defaults to Preview only.
      const showLive = gs.kind === "live" || gs.kind === "final";
      const isFinal = gs.kind === "final";
      // Exactly THREE tabs: Preview (matchup, pitchers, records, our pick + why) ·
      // Odds (the pick + the wall-by-wall grid + prices) · Box score (line score + scoring).
      // STILL EXACTLY THREE TABS. The middle one keeps its job (our call + the numbers) and
      // simply says what it now leads with when the strategy streams are in the payload.
      const hasStrats = gameStrategies(g).length > 0 && !leadLocked;
      const tabsBar = `<div class="gp-tabs underline" role="tablist">
        <button class="gp-tab ${detailTab === "preview" ? "on" : ""}" data-dtab="preview" role="tab">Preview</button>
        <button class="gp-tab ${detailTab === "de" ? "on" : ""}" data-dtab="de" role="tab">${hasStrats ? "Strategies" : "Odds"}</button>
        ${showLive ? `<button class="gp-tab ${detailTab === "live" ? "on" : ""}" data-dtab="live" role="tab">Box score</button>` : ""}
        <span class="gp-tab-ink" id="gp-tab-ink"></span>
      </div>`;
      const previewPane = `<div class="gp-pane" data-pane="preview" style="display:${detailTab === "preview" ? "block" : "none"}">
        ${marketsTable(g)}
        ${leadLocked ? "" : previewMasthead}
        ${previewBlock}
        ${linesBlock}
        ${lead || !leadLocked ? pickPayoff : ""}
        ${leadLocked ? "" : strategiesTeaser(g)}
        ${lead && !leadLocked ? signalBlock(lead) : ""}
        ${passBlock}
        ${leadLocked ? "" : more}
      </div>`;
      // Box score pane also carries the recap for a final game (folded in — no separate tab).
      const livePane = showLive ? `<div class="gp-pane" data-pane="live" style="display:${detailTab === "live" ? "block" : "none"}">${isFinal ? gameRecap(g) : ""}${boxScorePanel(g)}</div>` : "";
      const dePane = `<div class="gp-pane" data-pane="de" style="display:${detailTab === "de" ? "block" : "none"}">${diamondEdgeReasoning(g, lead, leadLocked)}</div>`;
      return `${gameHero}${tabsBar}${previewPane}${dePane}${livePane}`;
      }

      // Wire the handlers that live INSIDE #gp-body (tabs). Called after every (re)build so a
      // rebuilt body keeps its tab switching. The header handlers are wired once, below.
      function wireBody() {
        const page = $("gamepage"); if (!page) return;
        page.querySelectorAll("[data-dtab]").forEach((b: any) => (b.onclick = () => switchDetailTab(b.dataset.dtab)));
        // Preview → the strategies panel (same sheet, middle tab), scrolled into view.
        page.querySelectorAll("[data-gostrat]").forEach((b: any) => (b.onclick = (e: any) => {
          e.stopPropagation();
          switchDetailTab("de");
          // The sheet body is its own scroller and KEEPS its offset across tabs, so a bare
          // scrollIntoView lands the panel above the fold. Scroll the container by the
          // measured delta instead.
          requestAnimationFrame(() => {
            const body = $("gp-body"), p = $("stgy-panel");
            if (!body || !p) return;
            const d = p.getBoundingClientRect().top - body.getBoundingClientRect().top - 8;
            body.scrollTo({ top: Math.max(0, body.scrollTop + d), behavior: "smooth" });
          });
        }));
        // every locked chip inside the detail body routes to the unlock flow
        page.querySelectorAll("[data-up]").forEach((b: any) => (b.onclick = (e: any) => { e.stopPropagation(); closeDetail(); setTimeout(() => openUnlock(), 60); }));
      }
      // Rebuild #gp-body in place when a feed lands after first paint. Guarded to the SAME game
      // still being open. Preserves the active tab (buildBody reads detailTab), re-wires tabs,
      // re-appends the model drill-in strip, and re-polls a live box score.
      function rerenderDetailBody() {
        if (!$("gamepage") || !detail || String(detail.game_id) !== String(g.game_id)) return;
        const body = $("gp-body"); if (!body) return;
        body.innerHTML = buildBody();
        wireBody();
        positionDetailInk();
        if (gameState(g).kind === "live" || gameState(g).kind === "final") pollLiveDetail();
      }

      const html = `
        <div class="gamepage" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(g.matchup || "Game")}">
          <div class="gp-head">
            <button class="gp-back" id="gp-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <button class="gp-brand" id="gp-brand" aria-label="DiamondEdge — home"><span class="diamond" aria-hidden="true"></span><span class="gp-brand-tx">Diamond<b>Edge</b></span></button>
            <div class="hspacer"></div>
            <button class="gp-share" id="gp-share" aria-label="Share this game"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.3M8.3 13.3l7.4 4.3"/></svg></button>
          </div>
          <div class="gp-body" id="gp-body">${buildBody()}</div>
        </div>`;

      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(() => { const p = $("gamepage"); if (p) p.classList.add("in"); positionDetailInk(); });
      $("gp-back").onclick = () => closeDetail();
      // The DiamondEdge logo goes HOME (News) from anywhere — the back button goes back a step.
      const gpb = $("gp-brand"); if (gpb) gpb.onclick = () => { closeDetail(); switchTab("today"); };
      const unl = $("cc-unlock");
      if (unl) unl.onclick = () => { closeDetail(); openUnlock(); };
      const shTlh = $("tl-how"); if (shTlh) shTlh.onclick = (e: any) => { e.stopPropagation(); closeDetail(); setTimeout(() => switchTab("beta"), 120); };
      const shShare = $("gp-share"); if (shShare) shShare.onclick = (e: any) => { e.stopPropagation(); shareGame(g); };
      // tab switching (no re-fetch; just show/hide + move the ink)
      wireBody();
      // if opened on a live game, pull the box score right away
      if (!g._recipe && (gameState(g).kind === "live" || gameState(g).kind === "final")) pollLiveDetail();
      // ASYNC FEEDS → RE-RENDER. The pitcher cards (pitchers_v4), records+form (teams_v4), and
      // the totals pick (the v4 board) all key off game_pk / abbr and load async — a game opened
      // before they land would paint a bare preview and never fill in. We load all four here, and
      // once ANY of them arrives we rebuild #gp-body in place (guarded to the same open game) so
      // pitchers/records/pick appear. This is exactly what makes a SYNTHESIZED future tile — which
      // ships with only ids/abbrs/start time and no pregame_intel — render a rich preview.
      if (g.game_id != null && !g._recipe) {
        Promise.all([
          loadBetaLive().catch(() => null),
          loadBeta().catch(() => null),
          loadPitchers().catch(() => null),
          loadTeams().catch(() => null),
        ]).then(() => {
          if (!$("gamepage") || !detail || String(detail.game_id) !== String(g.game_id)) return;
          // Rebuild the body so the freshly-arrived feeds surface, then (re)attach the drill strip.
          rerenderDetailBody();
        }).catch(() => {});
      }
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
      try { document.title = DEF_TITLE; } catch {}   // restore the base tab title on close
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
                <p><b>Every pick is graded in public.</b> The side, the line and the price freeze before the game, the final score does the judging, and the whole record — wins, losses, everything — lives on the Insights tab.</p>
                <p><b>Every star is earned against the real price.</b> A pick only makes the board when our number beats what the bet actually costs — and four seasons of graded history back the system's profitable record.</p>
                <p><b>Win rate always travels with the price.</b> That's why every number we show you carries its return right next to it.</p>
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
    // Every graded/pending TAKE for a game+tier, as compact "matchup · pick · Won/Lost" rows —
    // so a cold tier number is never a mystery. Uses the SAME pickResult grading path.
    function tierPicksList(filterFn: (g: any) => boolean, q: string) {
      const src = livePayload || payload;
      if (!src) return "";
      const rows: string[] = [];
      ((src.games || []) as any[]).forEach((g: any) => {
        if (!filterFn(g)) return;
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (!pl || pl.action !== "TAKE" || qualityOf(pl) !== q) return;
          const r = pickResult(g, pl);
          const gs = gameState(g);
          const st = r === "hit" ? { c: "won", t: "✓ Won" } : r === "miss" ? { c: "lost", t: "✗ Lost" }
            : r === "push" ? { c: "pushed", t: "Push" }
            : gs.kind === "live" ? { c: "live", t: "Live" } : { c: "up", t: "To come" };
          const side = `${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? ` ${fmtOdds(pl.price)}` : ""}`;
          rows.push(`<div class="rbp-row"><span class="rbp-mu">${esc(g.away_abbr || "")} @ ${esc(g.home_abbr || "")}</span><span class="rbp-pk">${side}</span><span class="rbp-res ${st.c}">${st.t}</span></div>`);
        });
      });
      return rows.length ? `<div class="rbp-list">${rows.join("")}</div>` : `<div class="rbp-empty">No picks in this tier for this window.</div>`;
    }
    function openRecordBreakdown() {
      detail = { _record: true };
      // Scope the breakdown to the DATE being viewed on the strip (curDate), not always today.
      // When curDate IS today, keep the familiar "Today" / "This month" labels; when it's a past
      // date, label the day with that date (e.g. "Fri, Jul 3") and the month with its month name.
      const scopeDate = curDate;
      const scopeIsToday = scopeDate === todayISO();
      const scopeDay = scopeDate.slice(0, 10);
      const scopeMonth = scopeDate.slice(0, 7);
      const scopeDayObj = new Date(scopeDate + "T12:00:00");
      const dayLab = scopeIsToday ? "Today"
        : (isNaN(scopeDayObj.getTime()) ? "That day" : scopeDayObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
      const monthLab = scopeIsToday ? "This month"
        : (isNaN(scopeDayObj.getTime()) ? "That month" : scopeDayObj.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
      const scopes = [
        { key: "today", lab: dayLab, filt: (g: any) => String(g.date || "").slice(0, 10) === scopeDay, empty: scopeIsToday ? "No graded picks yet today — check back as games finish." : "No graded picks on that date." },
        { key: "month", lab: monthLab, filt: (g: any) => String(g.date || "").slice(0, 7) === scopeMonth, empty: scopeIsToday ? "No graded picks yet this month." : "No graded picks that month." },
      ];
      // ONE row PER STRENGTH TIER (Leon's spec): ★★★ Strong / ★★ Good / ★ Lean, each W–L + hit%,
      // expandable to the actual picks. Leans (spread/ML) live in the Lean tier — visibly separated
      // from the totals edge (Strong/Good), so a bare "0–3" reads as "which tier, and normal variance".
      const TIER_META: any = {
        strong: { lab: "Strong", note: "4–5★ — our highest-conviction calls" },
        good: { lab: "Solid", note: "3★ — firmly on the board" },
        lean: { lab: "Lean", note: "1–2★ — the lightest calls, graded all the same" },
      };
      const tierRow = (rec: any, q: string, filt: (g: any) => boolean) => {
        const o = rec[q]; const dec = o.w + o.l; const pct = dec ? Math.round((o.w / dec) * 100) : null;
        const out = o.live + o.up;
        const outTxt = out ? `<span class="rbt-out">${o.live ? `${o.live} live` : ""}${o.live && o.up ? " · " : ""}${o.up ? `${o.up} to come` : ""}</span>` : "";
        const recTxt = dec
          ? `<b class="rbt-wl">${o.w} won · ${o.l} lost</b>${pct != null ? `<span class="rbt-pct">${pct}%</span>` : ""}`
          : (out ? `<span class="rbt-none">none graded yet</span>` : `<span class="rbt-none">—</span>`);
        const expandable = dec + out > 0;
        const head = `<div class="rbt-head"><span class="rbt-badge q-${q}">${qDiamonds(q)}<b>${TIER_META[q].lab}</b></span><span class="rbt-note">${TIER_META[q].note}</span><span class="rbt-rec">${recTxt}${outTxt}</span></div>`;
        if (!expandable) return `<div class="rbt-item q-${q} flat">${head}</div>`;
        return `<details class="rbt-item q-${q}"><summary>${head}<span class="rbt-caret">›</span></summary>${tierPicksList(filt, q)}</details>`;
      };
      // A small group W–L header ("The edge — totals" 1–2 · "Leans — spread & moneyline" 3–3)
      // so the EDGE vs LEANS split is the PRIMARY structure of the sheet, tiers nested under it.
      const groupHead = (title: string, sub: string, tiers: string[], rec: any) => {
        let w = 0, l = 0, live = 0, up = 0;
        tiers.forEach((q) => { const o = rec[q]; w += o.w; l += o.l; live += o.live; up += o.up; });
        const dec = w + l, out = live + up;
        const recTxt = dec
          ? `<b class="rbg-wl">${w}–${l}</b><span class="rbg-legend">W–L</span>`
          : (out ? `<span class="rbt-none">none graded yet</span>` : `<span class="rbt-none">—</span>`);
        return `<div class="rbg-head"><div class="rbg-t"><b>${title}</b><i>${sub}</i></div><span class="rbg-rec">${recTxt}${out ? `<span class="rbt-out">${live ? `${live} live` : ""}${live && up ? " · " : ""}${up ? `${up} to come` : ""}</span>` : ""}</span></div>`;
      };
      const block = (scope: any) => {
        const rec = tierRecordFor(scope.filt);
        const gradedAny = rec && rec.gradedTotal;
        const outAny = rec && (rec.live + rec.up);
        const overall = rec && (gradedAny || outAny)
          ? `<div class="rbt-overall"><span class="rbt-overall-lab">Overall</span><b>${rec.w} won · ${rec.l} lost</b>${outAny ? `<span class="rbt-out">${rec.live ? `${rec.live} live` : ""}${rec.live && rec.up ? " · " : ""}${rec.up ? `${rec.up} to come` : ""}</span>` : ""}</div>`
          : "";
        // Two groups by conviction: the headline calls (3★+) and the light calls (1–2★).
        const edgeGroup = rec
          ? `${groupHead("The calls — 3★ and up", "the picks we lead with", ["strong", "good"], rec)}${["strong", "good"].map((q) => tierRow(rec, q, scope.filt)).join("")}`
          : "";
        const leanGroup = rec
          ? `${groupHead("Light calls — 1–2★", "small edges, graded all the same", ["lean"], rec)}${tierRow(rec, "lean", scope.filt)}`
          : "";
        const body = rec && (gradedAny || outAny)
          ? `${overall}<div class="rbt-group">${edgeGroup}</div><div class="rbt-group">${leanGroup}</div>`
          : `<div class="rb-sub">${scope.empty}</div>`;
        return `<div class="dsec"><div class="dsec-h">${scope.lab} · the record ladder</div>${body}</div>`;
      };
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head gold">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">DiamondEdge</div>
            <div class="rcp-title"><span class="pl-vdia">◆</span>The record</div>
            <div class="sh-meta">wins–losses by pick strength · graded against real final scores</div>
          </div>
          <div class="sh-body">
            <div class="rbt-howread">More stars, more conviction — every pick lands in a tier and gets graded by the final score. Tap a tier to see the exact picks.</div>
            ${block(scopes[0])}
            ${block(scopes[1])}
            <div class="dsec"><div class="dsec-b rcp"><p><b>Every call freezes before first pitch</b> — the side, the line and the price — and the final score does the judging. The full running record, tier by tier, lives on the Insights tab.</p></div></div>
            <button class="rb-full" id="rb-full">See the full record &amp; charts →</button>
            <button class="rb-share" id="rb-share">Share our record ↗</button>
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = () => closeDetail();
      $("sheet-bg").onclick = () => closeDetail();
      const full = $("rb-full"); if (full) full.onclick = () => { closeDetail(); switchTab("results"); };
      const rbs = $("rb-share"); if (rbs) rbs.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        const txt = shareTagline();
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge — the record", text: txt, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${txt} ${url}`); toast("Record copied — paste it anywhere"); } catch { toast(url); }
      };
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
    // ═══════════ INSIGHTS CHARTS (inline SVG, theme-native, defensive) ═══════════
    // Each chart prefers the NEW record.* chart blocks the backend is landing
    // (equity_curve, by_star_perf, calibration_buckets, monthly, streaks) and falls
    // back to deriving the same shape from by_date_record / by_star_tier — so the
    // page renders today AND upgrades in place. Absent data ⇒ the card doesn't render.
    const CH_W = 340, CH_H = 132;
    function chartCard(title: string, sub: string, body: string, foot = "") {
      if (!body) return "";
      return `<div class="ixc"><div class="ixc-h">${esc(title)}</div>${sub ? `<div class="ixc-sub">${esc(sub)}</div>` : ""}${body}${foot ? `<div class="ixc-foot">${foot}</div>` : ""}</div>`;
    }
    // cumulative net units per day — served equity curve first, else derived
    function equitySeries(d: any): { x: string; v: number }[] {
      const rec = (d && d.record) || {};
      const ec = rec.equity_curve;
      if (Array.isArray(ec) && ec.length) {
        const out: any[] = [];
        ec.forEach((p: any) => {
          if (!p) return;
          const x = String(p.date || p.d || "");
          const v = _fin(p.units != null ? p.units : (p.cum_units != null ? p.cum_units : p.u));
          if (x && v != null) out.push({ x, v });
        });
        if (out.length >= 2) return out;
      }
      const bdr = (d && d.by_date_record) || {};
      const dates = Object.keys(bdr).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && bdr[k] && bdr[k].n_graded).sort();
      let cum = 0;
      return dates.map((k) => {
        const r = bdr[k];
        const day = r.units != null ? Number(r.units) : (r.roi != null && r.n_graded ? Number(r.roi) * Number(r.n_graded) : 0);
        cum += isFinite(day) ? day : 0;
        return { x: k, v: cum };
      });
    }
    function equityCurveSvg(d: any) {
      const pts = equitySeries(d);
      if (pts.length < 2) return "";
      const w = CH_W, h = CH_H, padL = 8, padR = 48, padY = 14;
      const vs = pts.map((p) => p.v);
      let lo = Math.min(0, ...vs), hi = Math.max(0, ...vs);
      if (hi - lo < 1e-6) hi = lo + 1;
      const X = (i: number) => padL + (i / (pts.length - 1)) * (w - padL - padR);
      const Y = (v: number) => padY + (1 - (v - lo) / (hi - lo)) * (h - padY * 2);
      const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(" ");
      const area = `${padL},${Y(0).toFixed(1)} ${line} ${X(pts.length - 1).toFixed(1)},${Y(0).toFixed(1)}`;
      const last = pts[pts.length - 1];
      const lastY = Y(last.v);
      return `<svg class="ixsvg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cumulative units over the season — currently ${last.v >= 0 ? "plus" : "minus"} ${Math.abs(last.v).toFixed(1)} units">
        <defs><linearGradient id="eqfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(224,172,32,.28)"/><stop offset="1" stop-color="rgba(224,172,32,0)"/></linearGradient></defs>
        <line x1="${padL}" y1="${Y(0).toFixed(1)}" x2="${(w - padR + 16).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="rgba(224,235,255,.15)" stroke-dasharray="3 4" stroke-width="1"/>
        <polygon points="${area}" fill="url(#eqfill)"/>
        <polyline points="${line}" fill="none" stroke="#eec258" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
        <circle cx="${X(pts.length - 1).toFixed(1)}" cy="${lastY.toFixed(1)}" r="3.2" fill="#eec258"/>
        <text x="${(X(pts.length - 1) + 7).toFixed(1)}" y="${Math.max(11, Math.min(h - 5, lastY + 3.5)).toFixed(1)}" class="ix-lab ${last.v >= 0 ? "pos" : "neg"}">${last.v >= 0 ? "+" : ""}${last.v.toFixed(1)}u</text>
      </svg>`;
    }
    // hit-rate by star tier — the "do more stars win more" validation bars
    function starPerfRows(d: any) {
      const rec = (d && d.record) || {};
      const raw = rec.by_star_perf || rec.by_star_tier || {};
      const rows: { s: number; n: number; hit: number | null; roi: number | null }[] = [];
      const push = (sVal: any, r: any) => {
        const s = Math.round(Number(sVal));
        if (!r || !isFinite(s) || s < 1 || s > 5) return;
        const n = Number(r.n || 0);
        if (!n) return;
        rows.push({ s, n, hit: _fin(r.hit_rate != null ? r.hit_rate : r.hit), roi: _fin(r.roi) });
      };
      if (Array.isArray(raw)) raw.forEach((r: any) => push(r && (r.stars != null ? r.stars : r.star), r));
      else Object.keys(raw).forEach((k) => { if (/^\d+$/.test(String(k))) push(k, raw[k]); });
      rows.sort((a, b) => a.s - b.s);
      return rows;
    }
    function starPerfSvg(d: any) {
      const rows = starPerfRows(d).filter((r) => r.hit != null);
      if (rows.length < 2) return "";
      const w = CH_W, h = CH_H, padL = 8, padR = 8, padT = 18, padB = 28;
      const step = (w - padL - padR) / rows.length;
      const bw = Math.min(46, step - 14);
      const maxHit = Math.max(0.72, ...rows.map((r) => r.hit as number)) * 1.06;
      const be = 0.524; // break-even at -110
      const Y = (v: number) => padT + (1 - v / maxHit) * (h - padT - padB);
      const bars = rows.map((r, i) => {
        const x = padL + step * i + (step - bw) / 2;
        const y = Y(r.hit as number);
        return `<g><title>${r.s} star — ${((r.hit as number) * 100).toFixed(1)}% hit over ${r.n} picks${r.roi != null ? ` · ${(r.roi >= 0 ? "+" : "")}${(r.roi * 100).toFixed(1)}% ROI` : ""}</title>
          <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(2, h - padB - y).toFixed(1)}" rx="4" fill="rgba(238,194,88,${(0.3 + r.s * 0.13).toFixed(2)})"/>
          <text x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" class="ix-lab">${((r.hit as number) * 100).toFixed(0)}%</text>
          <text x="${(x + bw / 2).toFixed(1)}" y="${h - 14}" text-anchor="middle" class="ix-ax">${r.s}★</text>
          <text x="${(x + bw / 2).toFixed(1)}" y="${h - 3}" text-anchor="middle" class="ix-axn">${r.n}</text></g>`;
      }).join("");
      return `<svg class="ixsvg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Hit rate by star tier">
        <line x1="${padL}" y1="${Y(be).toFixed(1)}" x2="${w - padR}" y2="${Y(be).toFixed(1)}" stroke="rgba(224,235,255,.22)" stroke-dasharray="3 4" stroke-width="1"/>
        ${bars}
      </svg>`;
    }
    // calibration — predicted vs realized win rate (renders only when served)
    function calibrationSvg(d: any) {
      const rec = (d && d.record) || {};
      const raw = rec.calibration_buckets;
      if (!Array.isArray(raw) || !raw.length) return "";
      const pts = raw.map((b: any) => ({
        p: _fin(b && (b.pred != null ? b.pred : b.p_mid != null ? b.p_mid : b.p)),
        a: _fin(b && (b.actual != null ? b.actual : b.realized != null ? b.realized : b.hit_rate)),
        n: Number((b && b.n) || 0),
      })).filter((b: any) => b.p != null && b.a != null);
      if (pts.length < 2) return "";
      const w = CH_W, h = CH_H, pad = 22;
      const lo = Math.max(0, Math.min(...pts.map((p: any) => Math.min(p.p, p.a))) - 0.04);
      const hi = Math.min(1, Math.max(...pts.map((p: any) => Math.max(p.p, p.a))) + 0.04);
      const X = (v: number) => pad + ((v - lo) / (hi - lo)) * (w - pad * 2);
      const Y = (v: number) => (h - pad) - ((v - lo) / (hi - lo)) * (h - pad * 2);
      const dots = pts.map((p: any) => `<g><title>predicted ${(p.p * 100).toFixed(0)}% → won ${(p.a * 100).toFixed(0)}%${p.n ? ` (${p.n} picks)` : ""}</title><circle cx="${X(p.p).toFixed(1)}" cy="${Y(p.a).toFixed(1)}" r="${Math.max(3.4, Math.min(7, Math.sqrt(p.n || 1) * 1.1)).toFixed(1)}" fill="rgba(238,194,88,.85)" stroke="rgba(11,17,30,.85)" stroke-width="1.5"/></g>`).join("");
      return `<svg class="ixsvg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Calibration — predicted vs realized win rate">
        <line x1="${X(lo).toFixed(1)}" y1="${Y(lo).toFixed(1)}" x2="${X(hi).toFixed(1)}" y2="${Y(hi).toFixed(1)}" stroke="rgba(224,235,255,.2)" stroke-dasharray="3 4"/>
        <text x="${X(hi).toFixed(1)}" y="${(Y(hi) + 12).toFixed(1)}" text-anchor="end" class="ix-ax">perfect calibration</text>
        ${dots}
        <text x="${w / 2}" y="${h - 2}" text-anchor="middle" class="ix-ax">predicted win chance →</text>
      </svg>`;
    }
    // net units by month — diverging bars off a zero baseline
    function monthlyRows(d: any) {
      const rec = (d && d.record) || {};
      const m = rec.monthly;
      const out: { m: string; u: number; n: number }[] = [];
      if (Array.isArray(m) && m.length) {
        m.forEach((r: any) => {
          const key = String((r && (r.month || r.m)) || "");
          if (!key) return;
          const u = _fin(r.units != null ? r.units : r.net_units);
          const roi = _fin(r.roi);
          const n = Number((r.n || r.n_graded) || 0);
          out.push({ m: key.slice(0, 7), u: u != null ? u : (roi != null && n ? roi * n : 0), n });
        });
        if (out.length) return out;
      }
      const bdr = (d && d.by_date_record) || {};
      const agg: any = {};
      Object.keys(bdr).forEach((k) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || !bdr[k] || !bdr[k].n_graded) return;
        const mo = k.slice(0, 7);
        const r = bdr[k];
        const day = r.units != null ? Number(r.units) : (r.roi != null ? Number(r.roi) * Number(r.n_graded) : 0);
        agg[mo] = agg[mo] || { m: mo, u: 0, n: 0 };
        agg[mo].u += isFinite(day) ? day : 0;
        agg[mo].n += Number(r.n_graded) || 0;
      });
      return (Object.values(agg) as any[]).sort((a: any, b: any) => (a.m < b.m ? -1 : 1));
    }
    function monthlySvg(d: any) {
      const rows = monthlyRows(d);
      if (!rows.length) return "";
      const w = CH_W, h = CH_H, padL = 8, padR = 8, padT = 18, padB = 20;
      const mx = Math.max(1, ...rows.map((r) => Math.abs(r.u)));
      const zero = padT + (h - padT - padB) / 2;
      const Y = (v: number) => zero - (v / mx) * ((h - padT - padB) / 2);
      const step = (w - padL - padR) / rows.length;
      const bw = Math.min(42, Math.max(8, step - 10));
      const bars = rows.map((r, i) => {
        const x = padL + step * i + (step - bw) / 2;
        const y0 = Y(Math.max(0, r.u)), y1 = Y(Math.min(0, r.u));
        const lab = new Date(r.m + "-15T12:00:00").toLocaleDateString("en-US", { month: "short" });
        return `<g><title>${lab} — ${r.u >= 0 ? "+" : ""}${r.u.toFixed(1)} units across ${r.n} picks</title>
          <rect x="${x.toFixed(1)}" y="${y0.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(2, y1 - y0).toFixed(1)}" rx="4" fill="${r.u >= 0 ? "rgba(43,214,149,.72)" : "rgba(255,92,119,.66)"}"/>
          <text x="${(x + bw / 2).toFixed(1)}" y="${(r.u >= 0 ? y0 - 4 : y1 + 11).toFixed(1)}" text-anchor="middle" class="ix-lab ${r.u >= 0 ? "pos" : "neg"}">${r.u >= 0 ? "+" : ""}${r.u.toFixed(1)}</text>
          <text x="${(x + bw / 2).toFixed(1)}" y="${h - 4}" text-anchor="middle" class="ix-ax">${esc(lab)}</text></g>`;
      }).join("");
      return `<svg class="ixsvg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Net units by month">
        <line x1="${padL}" y1="${zero.toFixed(1)}" x2="${w - padR}" y2="${zero.toFixed(1)}" stroke="rgba(224,235,255,.16)" stroke-width="1"/>
        ${bars}
      </svg>`;
    }
    // streak stat tiles — served record.streaks first, else derived chronologically
    function streaksBlock(d: any) {
      const rec = (d && d.record) || {};
      let st: any = rec.streaks;
      if (!st || typeof st !== "object") {
        const graded = (((d && d.games) || []) as any[])
          .filter((g: any) => g.pick && (g.pick.result === "win" || g.pick.result === "loss"))
          .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)));
        if (!graded.length) return "";
        let bw = 0, bl = 0, run = 0; let last = "";
        graded.forEach((g: any) => {
          const r = g.pick.result;
          if (r === last) run++; else { run = 1; last = r; }
          if (r === "win") bw = Math.max(bw, run); else bl = Math.max(bl, run);
        });
        st = { longest_win: bw, longest_loss: bl, current: run * (last === "win" ? 1 : -1) };
      }
      const lw = _fin(st.longest_win != null ? st.longest_win : st.best_win) || 0;
      const ll = _fin(st.longest_loss != null ? st.longest_loss : st.worst_loss) || 0;
      const curV = _fin(st.current);
      if (!lw && !ll && curV == null) return "";
      const curTxt = curV == null || curV === 0 ? "—" : curV > 0 ? `W${curV}` : `L${Math.abs(curV)}`;
      return `<div class="ix-streaks">
        <div class="ixs"><i class="pos">${lw ? `W${lw}` : "—"}</i><em>longest win streak</em></div>
        <div class="ixs"><i class="${curV != null && curV < 0 ? "neg" : "pos"}">${curTxt}</i><em>current run</em></div>
        <div class="ixs"><i class="neg">${ll ? `L${ll}` : "—"}</i><em>longest skid</em></div>
      </div>`;
    }
    // ═══════════ STRATEGY RECORDS (Insights) ═══════════
    // WHY IT LIVES ON INSIGHTS: Insights already IS the record page — headline record, equity
    // curve, star-tier validation, day-by-day archive. A strategy's record is the same claim
    // cut a different way; a fifth dock tab would put two versions of "how we're doing" in two
    // places and crowd the dock. So it sits here, directly under the tier validation.
    //
    // THE STRUCTURE IS THE HONESTY:
    //   1. LIVE-SERVED is the primary number on every card — big, first, with its start date.
    //      That is the only number that ever described a real bankroll.
    //   2. How the live number was OBSERVED is itemised (served on the board / logged forward
    //      in the paper ledger / as-of-wall reconstruction of a live day), because "live"
    //      itself has grades and hiding that would be its own dishonesty.
    //   3. Anything BACKTESTED is walled off below a rule, dimmed, carries the payload's own
    //      label, and is never added to the live number.
    //   4. combined_view appears only as a reconciliation footnote — it is what the older
    //      published blocks report, and the payload itself says it is not a live record.
    //   5. Losing streams render identically to winning ones. Order is the payload's spec
    //      order, never ROI.
    // Two small bars per card, in the same inline-SVG language as the charts above, and both
    // computed from the LIVE block only:
    //   · hit rate against the break-even mark (52.4% at −110) — fixed 35–70% scale
    //   · ROI around zero — fixed ±25% scale, so cards are comparable side by side
    // Fixed scales matter: per-card auto-scaling would make a terrible ROI look the same size
    // as a great one.
    function strategyBarsSvg(b: any, label: string) {
      if (!b || (b.hit == null && b.roi == null)) return "";
      const w = 300, h = 46, padL = 6, padR = 6;
      const inner = w - padL - padR;
      const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
      const HLO = 0.35, HHI = 0.70, BE = 0.524, RMAX = 0.25;
      const HX = (v: number) => padL + ((cl(v, HLO, HHI) - HLO) / (HHI - HLO)) * inner;
      const zero = padL + inner / 2;
      const RX = (v: number) => zero + (cl(v, -RMAX, RMAX) / RMAX) * (inner / 2);
      const hitBar = b.hit == null ? "" : (() => {
        const x = HX(b.hit), ok = b.hit >= BE;
        return `<rect x="${padL}" y="6" width="${inner}" height="9" rx="4.5" fill="rgba(224,235,255,.07)"/>
          <rect x="${padL}" y="6" width="${Math.max(2, x - padL).toFixed(1)}" height="9" rx="4.5" fill="${ok ? "rgba(43,214,149,.72)" : "rgba(255,92,119,.66)"}"/>
          <line x1="${HX(BE).toFixed(1)}" y1="2.5" x2="${HX(BE).toFixed(1)}" y2="18.5" stroke="rgba(224,235,255,.5)" stroke-dasharray="2 3" stroke-width="1.2"/>`;
      })();
      const roiBar = b.roi == null ? "" : (() => {
        const x = RX(b.roi), pos = b.roi >= 0;
        const x0 = Math.min(zero, x), wdt = Math.max(2, Math.abs(x - zero));
        return `<rect x="${padL}" y="28" width="${inner}" height="9" rx="4.5" fill="rgba(224,235,255,.05)"/>
          <rect x="${x0.toFixed(1)}" y="28" width="${wdt.toFixed(1)}" height="9" rx="3" fill="${pos ? "rgba(43,214,149,.72)" : "rgba(255,92,119,.66)"}"/>
          <line x1="${zero.toFixed(1)}" y1="24.5" x2="${zero.toFixed(1)}" y2="40.5" stroke="rgba(224,235,255,.34)" stroke-width="1.2"/>`;
      })();
      return `<svg class="ixsvg sgc-bars" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)} — ${b.hit != null ? `${(b.hit * 100).toFixed(1)}% hit rate against a 52.4% break-even` : "no hit rate"}${b.roi != null ? `, ${(b.roi >= 0 ? "plus " : "minus ")}${Math.abs(b.roi * 100).toFixed(1)}% return` : ""}, over ${b.n} graded pick${b.n === 1 ? "" : "s"}">${hitBar}${roiBar}</svg>`;
    }
    const stratNumsHtml = (b: any) => `<div class="sgc-nums">
      <span class="sgc-n"><b>${esc(stratWL(b))}</b><em>record</em></span>
      <span class="sgc-n"><b>${stratPct(b.hit)}</b><em>hit rate</em></span>
      <span class="sgc-n"><b class="${b.roi == null ? "" : b.roi >= 0 ? "pos" : "neg"}">${stratRoi(b.roi)}</b><em>ROI</em></span>
      <span class="sgc-n"><b class="${b.units == null ? "" : b.units >= 0 ? "pos" : "neg"}">${stratUnits(b.units)}</b><em>units (flat)</em></span>
    </div>`;
    function strategyCard(r: any) {
      const lv = r.live;
      const act = stratDateTxt(r.activation);
      const liveBlock = lv
        ? `<div class="sgc-live">
            <div class="sgc-livek"><span class="sgc-tag live">Live-served</span><span class="sgc-liven">${lv.n} graded pick${lv.n === 1 ? "" : "s"}${act ? ` · since ${esc(act)}` : ""}</span></div>
            ${stratNumsHtml(lv)}
            ${strategyBarsSvg(lv, r.label)}
            <div class="sgc-axis"><span>hit rate · dashed = break-even 52.4%</span><span>ROI · centre = 0, scale ±25%</span></div>
          </div>`
        : `<div class="sgc-live none"><div class="sgc-livek"><span class="sgc-tag live none">Live-served</span></div>
            <div class="sgc-empty">No live-served picks graded yet${act ? ` — activated ${esc(act)}` : ""}. The record starts at 0–0.</div></div>`;
      // How that live number was observed. "Live" has grades, and pretending otherwise
      // would be the same sin as passing a backtest off as live.
      const modes = r.modes.length
        ? `<details class="sgc-modes"><summary><span>How the live picks were observed</span><span class="sgc-caret" aria-hidden="true">›</span></summary>
            ${r.modes.map((m: any) => `<div class="sgc-mode"><div class="sgcm-top"><b>${esc(m.n)} pick${m.n === 1 ? "" : "s"}</b><span class="sgcm-rec">${esc(stratWL(m))}${m.roi != null ? ` · ${stratRoi(m.roi)}` : ""}</span></div>${m.what ? `<div class="sgcm-what">${esc(m.what)}</div>` : ""}</div>`).join("")}
          </details>`
        : "";
      // NOT LIVE — walled off, dimmed, labelled by the payload itself, never summed.
      const bts = r.backtests.length
        ? `<div class="sgc-bt">
            <div class="sgc-bthead"><span class="sgc-tag bt">Not live</span><span class="sgc-bthk">Backtested / reconstructed — never added to the number above</span></div>
            ${r.backtests.map((b: any) => `<div class="sgc-btrow">
              <div class="sgc-btnums"><b>${esc(stratWL(b))}</b><span>${stratPct(b.hit)} hit</span><span class="${b.roi == null ? "" : b.roi >= 0 ? "pos" : "neg"}">${stratRoi(b.roi)} ROI</span><span>${b.n} row${b.n === 1 ? "" : "s"}</span></div>
              ${b.label ? `<div class="sgc-btlab">${esc(b.label)}</div>` : ""}
            </div>`).join("")}
          </div>`
        : "";
      const comb = r.combined
        ? `<div class="sgc-comb"><b>Live + backtest together: ${esc(stratWL(r.combined))}${r.combined.roi != null ? ` · ${stratRoi(r.combined.roi)} ROI` : ""} over ${r.combined.n}.</b> ${r.combined.label ? esc(r.combined.label) : "Shown only because the older published blocks report it — this is not a live record."}</div>`
        : "";
      return `<div class="sgc${r.headline ? " headline" : ""}${r.isNew ? " is-new" : ""}">
        <div class="sgc-top">
          <span class="sgc-lab">${esc(r.label)}</span>
          ${r.isNew ? `<span class="sgc-new">${esc(r.newTag)}</span>` : ""}
          ${r.headline ? `<span class="sgc-hl">◆ The product</span>` : ""}
        </div>
        ${r.leanLedger ? `<div class="sgc-leanled">Graded <b>lean</b> ledger — these are stated reads locked and graded in public, <b>not bets</b>. No units are staked and no edge is claimed.</div>` : ""}
        ${r.what ? `<div class="sgc-what">${esc(r.what)}</div>` : ""}
        ${liveBlock}
        ${modes}
        ${bts}
        ${comb}
        ${r.note ? `<div class="sgc-note">${esc(r.note)}</div>` : ""}
        ${r.basis ? `<details class="sgc-basis"><summary><span>Exactly what this record counts</span><span class="sgc-caret" aria-hidden="true">›</span></summary><p>${esc(r.basis)}</p></details>` : ""}
      </div>`;
    }
    function strategyRecordSection(d: any) {
      const rows = strategyRecords(d);
      if (!rows.length) return "";
      const spec = strategiesSpec();
      const overlap = humanNote(spec && spec.overlap_note) || humanNote(d && d.record && d.record.by_strategy_note);
      return `<div class="ixc stgyrec" id="strategy-record">
        <div class="ixc-h">Strategy by strategy</div>
        <div class="ixc-sub">Every rule-set we run, each with its own record — the ones losing money as well as the ones making it.</div>
        <div class="stgyrec-warn">
          <p><b>Live-served picks only, at the top of every card.</b> That is the only kind of number that ever described a real bankroll. Anything reconstructed or backtested sits below a rule, is labelled, and is never added in.</p>
          <p><b>They overlap — never add them up.</b> The same game appears in more than one stream, so these are the same bets from different angles, not independent bets. And choosing whichever stream currently looks best is not a strategy: with four overlapping streams over a few dozen graded picks, one of them looks good by construction.</p>
          <p><b>The samples are small.</b> None of this is an edge claim.</p>
        </div>
        <div class="stgyrec-order">Listed in the model's own order, the served product first. Deliberately <b>not</b> ranked by returns — a leaderboard would bury the losers.</div>
        <div class="stgyrec-list">${rows.map(strategyCard).join("")}</div>
        ${overlap ? `<details class="stgyrec-full"><summary><span>The full methodology note, unedited</span><span class="sgc-caret" aria-hidden="true">›</span></summary><p>${esc(overlap)}</p></details>` : ""}
      </div>`;
    }
    // ── PAST PICKS (Leon, 2026-07-25): a browsable day-by-day archive on Insights —
    // most recent first, each day's picks with side/line/stars + W/L/P chips + the
    // day record. Reuses by_date_record + the history games; compact and scannable.
    let ppShown = 10;
    function pastPicksSection(d: any) {
      const games = ((d && d.games) || []) as any[];
      const bdr = (d && d.by_date_record) || {};
      // HONEST DAY NOTES (2026-07-27): the payload flags every empty or thin
      // day in the served range (days_incomplete) — All-Star break, light
      // slates, genuine outage-partial days. They render as labeled rows so a
      // missing day is never silent (silence was the recurring bug).
      const dayNotes = (d && d.days_incomplete) || {};
      const byDate: any = {};
      games.forEach((g: any) => {
        // PICKs and VOIDed (postponed) picks both stay on the record page —
        // a locked pick never disappears; VOID renders neutral, counts nowhere.
        const st = g && g.pick ? String(g.pick.status || "").toUpperCase() : "";
        if (st !== "PICK" && st !== "VOID") return;
        (byDate[g.date] = byDate[g.date] || []).push(g);
      });
      // PAST picks — prior days only (today's board lives on Games/News until it grades)
      const dates = Array.from(new Set([...Object.keys(byDate), ...Object.keys(dayNotes)]))
        .filter((k) => k && k < todayISO()).sort().reverse();
      if (!dates.length) return "";
      const shown = dates.slice(0, ppShown);
      // matchup names read defensively across payload generations (away / away_team / abbr)
      const muName = (g: any, side: "away" | "home") => {
        const raw = g[side] || g[side + "_team"] || g[side + "_abbr"];
        return raw ? teamShort(raw) : "—";
      };
      const dayBlock = (k: string, open: boolean) => {
        const r = bdr[k] || {};
        const dd = new Date(k + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        const note = dayNotes[k];
        const noteTag = note ? (note.records_incomplete ? "records incomplete" : note.kind === "no_games_scheduled" ? "no games" : "small slate") : "";
        // a flagged day with NO picks renders as an honest note row — a gap in
        // the archive is stated out loud, never left as a silent hole
        if (!byDate[k]) {
          return `<div class="pp-day pp-noteonly"><div class="pp-notehead"><span class="pp-date">${esc(dd)}</span><span class="pp-wl dim">${esc(noteTag || "no picks")}</span></div><div class="pp-notetext">${esc((note && note.note) || "No picks survive for this day.")}</div></div>`;
        }
        const noteLine = note ? `<div class="pp-notetext inday">${esc(note.note)}</div>` : "";
        const wl = r.n_graded ? `${r.wins || 0}–${r.losses || 0}${r.pushes ? `–${r.pushes}` : ""}` : "";
        const roi = r.roi != null ? `${r.roi >= 0 ? "+" : ""}${(r.roi * 100).toFixed(0)}%` : "";
        const list = byDate[k].slice().sort((a: any, b: any) => ((b.pick.stars || 0) - (a.pick.stars || 0)));
        const rows = list.map((g: any) => {
          const p = g.pick;
          const isV = String(p.status || "").toUpperCase() === "VOID";
          const side = p.side ? `${/over/i.test(String(p.side)) ? "OVER" : "UNDER"} ${p.line != null ? lineStr(p.line) : ""}`.trim() : "";
          const res = isV ? `<span class="ppres voidppd" title="Postponed — pick void, no action">V</span>`
            : p.result === "win" ? `<span class="ppres won">W</span>` : p.result === "loss" ? `<span class="ppres lost">L</span>` : p.result === "push" ? `<span class="ppres pushed">P</span>` : `<span class="ppres open">—</span>`;
          return `<button class="pp-row${isV ? " isvoid" : ""}" data-ppgid="${esc(g.game_id)}"><span class="pp-mu">${esc(muName(g, "away"))} @ ${esc(muName(g, "home"))}</span><span class="pp-side">${esc(side)}${p.price != null ? ` <i>${fmtOdds(p.price)}</i>` : ""}</span>${bStars(p.stars)}${res}</button>`;
        }).join("");
        const nV = list.filter((g: any) => String((g.pick || {}).status || "").toUpperCase() === "VOID").length;
        const nP = list.length - nV;
        return `<details class="pp-day"${open ? " open" : ""}><summary><span class="pp-date">${esc(dd)}</span>${wl ? `<span class="pp-wl ${(r.wins || 0) >= (r.losses || 0) ? "pos" : "neg"}">${wl}</span>` : `<span class="pp-wl dim">grading</span>`}${roi ? `<span class="pp-roi ${r.roi >= 0 ? "pos" : "neg"}">${roi}</span>` : ""}<span class="pp-n">${nP} pick${nP === 1 ? "" : "s"}${nV ? ` · ${nV} void` : ""}${noteTag ? ` · ${esc(noteTag)}` : ""}</span><span class="pp-caret" aria-hidden="true">›</span></summary><div class="pp-rows">${noteLine}${rows}</div></details>`;
      };
      return `<div class="ixc pastpicks"><div class="ixc-h">Past picks, day by day</div><div class="ixc-sub">Every published pick — side, line, stars, price and the graded result. Most recent first.</div>
        ${shown.map((k, i) => dayBlock(k, i === 0)).join("")}
        ${dates.length > ppShown ? `<button class="pp-more" id="pp-more">Show more days (${dates.length - ppShown} left)</button>` : ""}
      </div>`;
    }

    async function renderResults() {
      await loadIndex();
      try { await loadBeta(); } catch {}
      const tr = trackRecord();
      const ov = tr.overall || {};
      const roi = ov.roi != null ? ov.roi * 100 : null;
      const rh = recipeHistory();
      const mr = monthRecord();
      const fwd = forwardRecord();
      const view = root.querySelector("#results-view");
      // ONE clear headline record: the DiamondEdge Pick signature (positive — hit% AND
      // return both good). The full all-graded universe (which includes Leans and tracked
      // experiments, and can run slightly negative) sits below WITH its plain explanation,
      // so a good win rate is never shown next to a negative return without context.
      // Two distinct, reconciled numbers — never two bare percents side by side:
      //   (A) "How often our picks win" = the published DiamondEdge signature record (58%+, profitable)
      //   (B) "Everything we track"     = the raw all-graded universe (leans + experiments; ~break-even)
      // Each gets its own labelled card, and (B) explains WHY it differs from (A).
      // SIMPLE + HONEST: a masthead, the overall record hero, and the by-star-tier table.
      // No by-market / by-lead / themes / upsell — just the record and what the stars mean.
      // MARKETING-FORWARD ANALYSIS PAGE (Leon, 2026-07-25): hero record → the graphs
      // (equity curve, stars-vs-wins, calibration, monthly, streaks) → the why-framing →
      // the day-by-day past-picks archive → a premium upsell. All inline SVG, defensive.
      view.innerHTML = `
        <div class="ix-wrap">
        <div class="ix-masthead">
          <div class="ix-eyebrow">DiamondEdge · Insights</div>
          <h2 class="ix-mast-h">The record, graded in public</h2>
          <p class="ix-mast-sub">${headlineStrategyRecord(betaData)
            ? `Every pick we <b>serve</b> is graded against the final at the real price. The live-served record leads. Anything reconstructed or backtested is labelled as such and never blended into it — including on the charts below, which cover the combined history.`
            : `Every pregame totals pick we publish, graded against the final at the real price. Wins, losses, and the record they add up to — no cherry-picking.`}</p>
          <div class="ix-mast-act">
            <button class="ix-btn" id="res-share">Share the record ↗</button>
          </div>
        </div>
        ${betaData ? betaDashboard(betaData) : `<div class="beta-skel">Loading the record…</div>`}
        ${betaData ? `
          ${chartCard("Season equity curve", "Cumulative units, day by day, at the real prices.", equityCurveSvg(betaData), headlineStrategyRecord(betaData) ? "Covers the <b>combined</b> ledger — live-served picks plus the reconstructed and backtested days. Only the tail is a served record; the split is spelled out under the hero above." : "")}
          ${chartCard("Do more stars win more?", "Hit rate by star tier — the scale only means something if the higher tiers deliver.", starPerfSvg(betaData), "Dashed line = break-even (52.4%) at −110 pricing. Counts under each bar.")}
          ${chartCard("Calibration", "When the model says a number, does reality agree? Predicted vs realized win rate.", calibrationSvg(betaData))}
          ${chartCard("Month by month", "Net units each month — hot months and cold months alike.", monthlySvg(betaData))}
          ${streaksBlock(betaData)}
          ${analystRecordSection()}
          ${patternsSection()}
          ${weeklyRaceSection()}
          ${rivalriesSection()}
          ${deskRecapSection()}
          ${strategyRecordSection(betaData)}
          <div class="ix-why"><span class="ixw-k">◆ Every pick shows its work</span><p>Open any pick and you'll see exactly why it exists — the signals that fired, the model's 0–5 confidence score, and the price edge it clears. No black box, no after-the-fact edits.</p></div>
          ${pastPicksSection(betaData)}
          <div class="ix-upsell"><div class="ixu-k">◆ DiamondEdge Premium</div><p>${isSignedIn() ? "Every Strong and Good pick unlocked the moment it publishes — the side, the line, the price and the why." : "Sign in to unlock every pick — the side, the line, the price and the why, the moment it publishes."}</p><button class="ixu-cta" id="ins-upsell2">${isSignedIn() ? "Go Premium" : "Sign in to unlock all picks"}</button></div>
        ` : ""}
        <button class="board-all" id="ins-allpicks">Browse every graded pick →</button>
        <div class="refnote">${esc(recordStrip())}</div>
        </div>`;

      animateCounters(view);
      // past-picks bindings: expandable days, row tap-through, show-more pagination
      const ppm = $("pp-more"); if (ppm) ppm.onclick = () => { ppShown += 14; renderResults(); };
      view.querySelectorAll(".pp-row[data-ppgid]").forEach((b: any) => (b.onclick = () => {
        const gid = b.dataset.ppgid;
        const bg = (betaLiveData && (betaLiveData.games || []).find((g: any) => String(g.game_id) === gid)) || ((betaData && betaData.games) || []).find((g: any) => String(g.game_id) === gid);
        if (bg) openBetaGame(bg);
      }));
      const iu2 = $("ins-upsell2"); if (iu2) iu2.onclick = () => openUnlock();
      // Share the headline record — honest text + the branded OG card renders from the URL.
      const rs = $("res-share");
      if (rs) rs.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        const txt = shareTagline();
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge — the record", text: txt, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${txt} ${url}`); toast("Record copied to clipboard"); } catch { toast(url); }
      };
      const rbk = $("res-breakdown");
      if (rbk) rbk.onclick = () => openRecordBreakdown();
      const iap = $("ins-allpicks"); if (iap) iap.onclick = () => switchTab("beta");
      const iu = $("ins-upsell");
      if (iu) iu.onclick = () => { accountMode = isSignedIn() ? "subscribe" : "signin"; switchTab("account"); };
      const sbm = $("sb-more");
      if (sbm) sbm.onclick = () => openRecordBreakdown();
      // Recent-scores rows open the game detail (same path as the board cards).
      view.querySelectorAll(".gs-row[data-gid]").forEach((bx: any) => {
        const open = () => { const g = findGame(bx.dataset.gid); if (g) openDetail(g); };
        bx.onclick = open;
        bx.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
      });
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
        record_line: `The honest read: about 55% expected at morning prices (56.9% on 239 picks the model never trained on). The ${(rh.hit * 100).toFixed(1)}% backtest since 2022 is in-sample.`,
        _fallback: true,
      };
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
    // Branded record line for the masthead + footer — leads with the HONEST forward expectation,
    // with the in-sample backtest labelled as such (never sold as the forward number).
    // ONE rule for every number that leaves this page (strips, share text, taglines): quote
    // the LIVE-SERVED record, never record.overall. record.overall is the combined block —
    // most of it is reconstruction and walk-forward backtest, and quoting it as "graded in
    // the open so far" reads as a track record it isn't.
    function recordStrip() {
      const hr = headlineStrategyRecord(betaData);
      if (hr && hr.live) {
        const since = stratDateTxt(hr.activation);
        return `Live-served picks, graded in the open — ${stratWL(hr.live)}${hr.live.hit != null ? ` (${stratPct(hr.live.hit)})` : ""}${since ? ` since ${since}` : ""}. Backtested history is reported separately.`;
      }
      return `Every pick graded in the open, win or lose.`;
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
      return `<a class="nf-story ${big ? "nf-hero" : ""}" href="#" data-nf="${esc(key)}" rel="noopener">
        ${img}
        <div class="nf-body"><div class="nf-kick">${meta}</div>
        <h3 class="nf-title">${esc(s.title || s.headline)}</h3>
        ${big && (s.dek || s.summary) ? `<p class="nf-sum clamp2">${esc(cleanBlurb(s.dek || s.summary))}</p>` : ""}</div></a>`;
    }
    // Dedupe headlines vs the lead (and each other) — one card per game. Shared by the front-page
    // render and the article reader's prev/next nav so keys/order always agree.
    function newsDedupedHeadlines(): any[] {
      const nf = newsFeed;
      if (!nf || !nf.lead) return [];
      const keyOf = (s: any) => String((s && s.angle && typeof s.angle === "object" && s.angle.game_id) || (s && (s.headline || s.title)) || "").toLowerCase();
      const seen = new Set<string>([keyOf(nf.lead)]);
      return ((nf.headlines || []) as any[]).filter((s) => { const k = keyOf(s); if (!k || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 9);
    }
    // Displayed story keys in order: lead ("L") then each deduped headline by its ORIGINAL index
    // (so newsStoryByKey resolves the right story even after dedup shifts positions).
    function newsDisplayKeys(): string[] {
      if (!newsFeed || !newsFeed.lead) return [];
      const orig = (newsFeed.headlines || []) as any[];
      return ["L", ...newsDedupedHeadlines().map((s) => String(orig.indexOf(s)))];
    }
    function newsFront() {
      const nf = newsFeed;
      if (!nf || !nf.lead) return "";
      const hl = newsDedupedHeadlines();
      // Honest freshness — pulse "live" only if the feed actually refreshed recently; otherwise
      // just show when it last updated. No fake "live".
      const updT = Date.parse(String(nf.updated_at || nf.generated_at || ""));
      const fresh = !isNaN(updT) && (Date.now() - updT) < 40 * 60 * 1000;
      const updTxt = niceTime(nf.updated_at || nf.generated_at);
      const head = fresh
        ? `<span class="nf-live"><span class="livedot"></span>live${updTxt ? ` · ${esc(updTxt)}` : ""}</span>`
        : (updTxt ? `<span class="nf-upd">Updated ${esc(updTxt)}</span>` : "");
      return `<section class="newsfront">
        <div class="nf-head"><span class="nf-lab">Around the league</span>${head}</div>
        ${newsStory(nf.lead, true, "L")}
        ${hl.length ? `<div class="nf-list">${hl.map((s) => newsStory(s, false, String((nf.headlines || []).indexOf(s)))).join("")}</div>` : ""}
      </section>`;
    }
    // Resolve a story card back to its object, then open OUR article reader.
    function newsStoryByKey(key: string) {
      if (!newsFeed) return null;
      return key === "L" ? newsFeed.lead : ((newsFeed.headlines || []) as any[])[Number(key)];
    }
    function openArticleSheet(s: any, key = "") {
      if (!s) return;
      detail = { _article: true };
      try { const h = String(s.headline || s.title || ""); document.title = /diamondedge/i.test(h) ? h : `${h} — DiamondEdge`; } catch {}  // avoid double-branding; closeDetail restores base
      const navKeys = newsDisplayKeys();
      const ci = key ? navKeys.indexOf(key) : -1;
      const prevKey = ci > 0 ? navKeys[ci - 1] : null;
      const nextKey = ci >= 0 && ci < navKeys.length - 1 ? navKeys[ci + 1] : null;
      const lab = esc((SPORT_LABEL[s.sport] || s.sport || "").toUpperCase());
      const gid = s.angle && typeof s.angle === "object" && s.angle.game_id != null ? s.angle.game_id : (s.game_id != null ? s.game_id : null);
      // Resolve the mapped game across the WHOLE slate, not just the live set: live/today first
      // (findGameLive), then the loaded slate (findGame / gameById) so finished games and games
      // viewed on other dates still resolve. If it's genuinely not loaded we keep the affordance
      // and fall back to jumping the board to it at click-time — never a dead pick.
      const g = gid != null ? (findGameLive(gid) || findGame(gid) || gameById(gid) || null) : null;
      // cleanBlurb() scrubs AI-tell meta-filler ("… storyline, translated into what it means for
      // the number", "to the board") per ARTICLE_SPEC while preserving **bold** lead-ins.
      const paras = String(s.article || s.summary || "").split(/\n+/).map((x) => cleanBlurb(x.trim()))
        .filter((p) => p && !/^—\s*DiamondEdge/i.test(p));           // drop any trailing byline line
      const body = paras.length ? paras.map((p) => `<p>${mdBold(p)}</p>`).join("") : `<p>${esc(cleanBlurb(s.summary || ""))}</p>`;
      const words = paras.join(" ").split(/\s+/).filter(Boolean).length;
      const readMin = Math.max(1, Math.round(words / 200));
      const angleChip = newsAngle(s.angle);
      // If the mapped game already finished, say — honestly — whether our pick hit.
      const gpick = g ? displayPick(g) : null;
      const gres = g && gameState(g).kind === "final" && gpick && gpick.action === "TAKE" ? pickResult(g, gpick) : null;
      const artRes = gres ? `<span class="art-res ${gres}">${gres === "hit" ? "✓ Hit" : gres === "miss" ? "✗ Missed" : "Push"}</span>` : "";
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">${lab} · DiamondEdge</div>
            <div class="art-title">${esc(s.headline || s.title)}</div>
            ${s.dek ? `<div class="sh-meta">${esc(cleanBlurb(s.dek))}</div>` : ""}
          </div>
          <div class="sh-body">
            <div class="art-byline"><span>${esc(s.byline || "DiamondEdge Staff")}${niceTime(s.published_at, s.published_display) ? " · " + esc(niceTime(s.published_at, s.published_display)) : ""} · ${readMin} min read</span><button class="art-share" id="art-share" aria-label="Share this story">Share ↗</button></div>
            ${g ? `<div class="art-mu">${gCrest(g, "away", "art-crest")}<span class="art-mu-t">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span>${gCrest(g, "home", "art-crest")}</div>` : ""}
            ${angleChip ? `<div class="art-angle-row${gid != null ? " art-angle-go" : ""}"${gid != null ? ` data-gid="${esc(String(gid))}" role="button" tabindex="0" aria-label="See our full pick"` : ""}><span class="art-take-lab">Our take</span>${angleChip}${artRes}${gid != null ? `<span class="art-go">See our full pick →</span>` : ""}</div>` : ""}
            <div class="art-body">${body}</div>
            ${prevKey != null || nextKey != null ? `<div class="art-nav">${prevKey != null ? `<button class="art-navbtn" data-navk="${esc(prevKey)}">← Previous</button>` : `<span></span>`}${nextKey != null ? `<button class="art-navbtn next" data-navk="${esc(nextKey)}">Next story →</button>` : `<span></span>`}</div>` : ""}
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = () => closeDetail();
      $("sheet-bg").onclick = () => closeDetail();
      // The whole "Our take" row is the pick affordance — clicking it ALWAYS opens the game's
      // full pick. Resolve the game at click-time (state may have loaded since render), mirroring
      // the article-row handlers: live/loaded slate → openDetail; otherwise jump the board to it.
      const gow = layer.querySelector(".art-angle-go") as any;
      if (gow && gid != null) {
        const openPick = () => {
          const gg = findGameLive(gid) || findGame(gid) || gameById(gid) || g;
          closeDetail();
          // closeDetail wipes #sheet-layer after its 320ms exit animation — openDetail renders
          // into that SAME layer, so it must run AFTER the wipe or its DOM gets erased (the race
          // that made the pick "do nothing"). 360ms clears the teardown; jumpToGames is unaffected.
          if (gg) setTimeout(() => openDetail(gg), 360);
          else setTimeout(() => jumpToGames([gid]), 360);
        };
        gow.onclick = openPick;
        gow.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPick(); } };
      }
      layer.querySelectorAll(".art-navbtn").forEach((b: any) => (b.onclick = () => {
        const ns = newsStoryByKey(b.dataset.navk);
        if (ns) { openArticleSheet(ns, b.dataset.navk); const sb = $("sheet") && $("sheet").querySelector(".sh-body"); if (sb) sb.scrollTop = 0; }
      }));
      const shb = $("art-share");
      if (shb) shb.onclick = async (e: any) => {
        e.stopPropagation();
        const title = String(s.headline || s.title || "DiamondEdge");
        // Article maps to a game on our slate → share /g/<id> so it unfurls to that game's card.
        const url = g && gid ? shareGameUrl(gid) : (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        if ((navigator as any).share) { try { await (navigator as any).share({ title, text: s.dek || title, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${title} — ${url}`); toast("Link copied to clipboard"); } catch { toast(url); }
      };
      bindSheetDrag($("sheet"), $("sh-grab"));
    }
    // The LEAD-STORY card — the front-page format Leon loves — reusable for ANY game (the
    // feature bet + the top games to watch). Woven-score matchup image, matchup headline (never
    // the pick), a game-focused lede, streak chips, and the pick tease on the cover.
    function leadStoryCard(g: any, kicker: string, dateTxt: string) {
      if (!g) return "";
      const gs = gameState(g);
      const pl = displayPick(g);
      const q = pl ? qualityOf(pl) : null;
      const locked = pl ? pickLocked(pl, playState(g, pl)) : false;
      const started = isStarted(g);
      const live = gs.kind === "live";
      const stks = gameStreaks(g).slice(0, 3).map((s: any) => `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("");
      const tint = heroTintFor(g, pl);
      const headline = matchupHeadline(g, pl);
      const lede = gameLede(g);
      // "Started" only for a pre-status game that's begun — never for live (has its own badge) or final.
      const startedTag = gs.kind === "pre" && started ? `<span class="ls-fig-tag started">● Started</span>` : "";
      const sport = SPORT_LABEL[g.sport] || String(g.sport || "").toUpperCase();
      const cta = locked ? "Unlock the full preview →" : "Read the full preview →";
      // Show the pick tease for ANY pick (even the slightest lean, clearly flagged low-confidence);
      // only true PASS games (no lean at all) stay a clean matchup.
      const cover = isPick(pl) ? heroPickCover(g, "lead", true) : "";
      return `<article class="leadstory q-${q || "lean"}${cover ? "" : " nopick"}" data-gid="${esc(g.game_id)}"${locked ? ' data-locked="1"' : ""} role="button" tabindex="0" aria-label="${esc(kicker)} — ${esc(g.away_abbr)} at ${esc(g.home_abbr)}">
        <div class="ls-figure">${heroImage(g, tint, "lead")}${!live ? `<span class="ls-fig-kick">${esc(kicker)} · ${esc(sport)}</span>` : ""}${startedTag}${heroLiveBadge(g, "lead")}${cover}</div>
        <div class="ls-body">
          <h3 class="ls-match">${headline}</h3>
          <div class="ls-byline">${esc(kicker)} · DiamondEdge${dateTxt ? ` · ${esc(dateTxt)}` : ""}</div>
          ${deskMiniRow(g, locked)}
          ${deskStarTake(g, locked)}
          ${lede ? `<p class="ls-lede small">${esc(lede)}</p>` : ""}
          ${stks ? `<div class="pv-stks">${stks}</div>` : ""}
          <span class="hero-cta">${cta}</span>
        </div>
      </article>`;
    }
    // "Next up" — a live countdown to the soonest upcoming first pitch on today's slate, so the
    // News front always shows when the next game (and its pick) goes live.
    function nextUpBanner() {
      const src = livePayload || payload;
      if (!src || !src.games) return "";
      const now = Date.now();
      let next: any = null;
      (src.games as any[]).forEach((g: any) => {
        if (String(g.status || "pre").toLowerCase() !== "pre") return;
        if (gameLocalDay(g) && gameLocalDay(g) !== todayISO()) return;
        const ts = firstPitchTs(g);
        if (ts && ts > now && (!next || ts < next.ts)) next = { g, ts };
      });
      if (!next) return "";
      const g = next.g;
      return `<button class="nextup" data-gid="${esc(g.game_id)}" aria-label="Next game — ${esc(g.away_abbr)} at ${esc(g.home_abbr)}">
        <span class="nu-k">◷ Next up</span>
        <span class="nu-mu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span>
        <span class="nu-cd">first pitch in <b class="fnc-val" data-drop="${next.ts}">${fmtCountdown(next.ts - now)}</b></span>
      </button>`;
    }
    // A News-shaped loading skeleton — a lead-story card + a 2-up grid of them — so the loading
    // state matches the actual content format (not a stack of compact-card shims).
    function skeletonNews() {
      const card = `<div class="skls"><span class="sk sk-fig"></span><div class="skls-b"><span class="sk sk-line w60"></span><span class="sk sk-line w40"></span></div></div>`;
      return `<div class="news"><div class="masthead lead"><span class="sk sk-line" style="height:34px;width:58%;display:block"></span></div><div class="mh-rule"></div>${card}<div class="sk-topgrid">${card}${card}</div></div>`;
    }
    // ═════════════════ CINEMATIC STORIES (the News tab's default mode) ═════════════════
    // Instagram-stories-style: full-viewport dark-glass cards advanced one-by-one — tap
    // right/left = next/prev, swipe supported, thin segmented progress bars up top,
    // ~7s auto-advance with hold-to-pause. Content INTERWEAVES featured pick cards,
    // news stories, yesterday's record recap, and a top-picks summary. A small grid
    // button escapes to the classic scrollable front (accessibility + preference).
    const STORY_MS = 7000;
    let storyIdx = 0, storyLen = 0, storyRafId = 0, storyT0 = 0, storyAcc = 0, storyHold = false;
    function stopStories() { if (storyRafId) cancelAnimationFrame(storyRafId); storyRafId = 0; }
    function setNewsMode(m: "stories" | "grid") {
      newsMode = m;
      try { localStorage.setItem("de_newsmode", m); } catch {}
      if (m !== "stories") stopStories();
      todayFresh = false;
      renderToday();
      if (tab === "today") todayFresh = true;
    }
    // Yesterday's graded record + its picks (for the recap slide). Null when ungraded.
    function yesterdayRecap() {
      const y = shiftDate(todayISO(), -1);
      const r = betaData && betaData.by_date_record && betaData.by_date_record[y];
      if (!r || !r.n_graded) return null;
      const games = (((betaData && betaData.games) || []) as any[])
        .filter((g: any) => g.date === y && g.pick && String(g.pick.status || "").toUpperCase() === "PICK" && g.pick.result)
        .sort((a: any, b: any) => ((b.pick.stars || 0) - (a.pick.stars || 0)));
      return { date: y, rec: r, games: games.slice(0, 5) };
    }
    // Assemble the day's slide deck: flagship pick → yesterday recap → interwoven
    // news + remaining picks → the top-picks summary. Capped so a tap-through stays short.
    function buildStorySlides() {
      const src = livePayload || payload;
      const pool = (((src || {}) as any).games || []).filter((g0: any) => {
        const k = gameState(g0).kind;
        const d0 = gameLocalDay(g0);
        return k === "live" || k === "pre" || d0 === todayISO();
      });
      const picks = pool.map((g: any) => ({ g, pl: displayPick(g) }))
        .filter((r: any) => isBet(r.pl))
        .sort((a: any, b: any) =>
          ((b.pl.grade != null ? Number(b.pl.grade) : 0) - (a.pl.grade != null ? Number(a.pl.grade) : 0)) ||
          ((b.pl.stars || 0) - (a.pl.stars || 0)) ||
          ((b.pl.p || 0) - (a.pl.p || 0)))
        .slice(0, 5);
      const news: any[] = [];
      if (newsFeed && newsFeed.lead) {
        news.push({ s: newsFeed.lead, key: "L" });
        const orig = (newsFeed.headlines || []) as any[];
        newsDedupedHeadlines().forEach((s: any) => news.push({ s, key: String(orig.indexOf(s)) }));
      }
      const slides: any[] = [];
      if (picks[0]) slides.push({ t: "pick", g: picks[0].g, pl: picks[0].pl, rank: 1 });
      // ANALYST DESK slide: the day's strongest consensus is the strongest possible story —
      // "all four analysts agree" leads; a 3–1 majority still makes the deck; a split gets
      // the "desk divided" treatment only when nothing stronger exists.
      const consRank: any = { UNANIMOUS: 3, MAJORITY: 2, SPLIT: 1 };
      const deskBest = pool
        .map((g0: any) => ({ g: g0, c: deskConsensus(g0), n: deskAnalysts(g0).length }))
        .filter((r: any) => r.n >= 2 && r.c && consRank[r.c.state])
        .sort((a: any, b: any) => (consRank[b.c.state] - consRank[a.c.state]) ||
          (((displayPick(b.g) || {}).stars || 0) - ((displayPick(a.g) || {}).stars || 0)))[0] || null;
      if (deskBest) slides.push({ t: "desk", g: deskBest.g, c: deskBest.c });
      // LAST NIGHT AT THE DESK — the nightly recap is the marquee morning story: winner
      // crowned, best call quoted, worst call owned. Rides right behind the day's desk story.
      const drc = latestDeskRecap();
      if (drc) slides.push({ t: "lastnight", rc: drc });
      // the competition scoreboard rides the deck too — stories is the DEFAULT home mode,
      // and the standings are the top-of-home promise
      if (deskRecordRows().length) slides.push({ t: "standings" });
      // THE PATTERNS — the boldest measured tendency as its own revelation slide
      if (patternHighlights().length) slides.push({ t: "patterns" });
      const recap = yesterdayRecap();
      if (recap) slides.push({ t: "recap", ...recap });
      let pi = 1, ni = 0;
      while ((pi < picks.length || ni < news.length) && slides.length < 11) {
        if (ni < news.length) slides.push({ t: "news", ...news[ni++] });
        if (pi < picks.length) { slides.push({ t: "pick", g: picks[pi].g, pl: picks[pi].pl, rank: pi + 1 }); pi++; }
      }
      if (picks.length >= 2) slides.splice(Math.min(slides.length, 5), 0, { t: "summary", picks });
      return slides.slice(0, 12);
    }
    // THE VOICES on a pick slide: the strongest agreeing analyst gets quoted under the call;
    // a lone dissenter gets their dissent quoted out loud ("NOVA disagrees: …"). Nothing
    // renders while the pick is locked (a quote argues the side) or before takes are served.
    function storyVoiceQuote(g: any, pl: any, locked: boolean) {
      if (locked || !pl || pl.action !== "TAKE") return "";
      const ans = deskAnalysts(g);
      if (!ans.length) return "";
      const dir = /under/i.test(String(pl.side || "")) ? "under" : /over/i.test(String(pl.side || "")) ? "over" : "";
      if (!dir) return "";
      const agree = ans.filter((a: any) => a.dir === dir && a.take)
        .sort((x: any, y: any) => ((y.conv != null ? y.conv : 0) - (x.conv != null ? x.conv : 0)));
      const dissenters = ans.filter((a: any) => a.dir && a.dir !== dir);
      let out = "";
      if (agree[0]) {
        const a = agree[0];
        out += `<div class="sts-voice an-${esc(a.key)}" data-an="${esc(a.key)}" role="button" tabindex="0">
          <span class="sts-voice-id">${deskGlyph(a.key, 12)}<b>${esc(a.name)}</b></span>
          <p>“${esc(a.take)}”</p>
        </div>`;
      }
      if (dissenters.length === 1 && dissenters[0].take) {
        const d0 = dissenters[0];
        out += `<div class="sts-voice dissent an-${esc(d0.key)}" data-an="${esc(d0.key)}" role="button" tabindex="0">
          <span class="sts-voice-id">${deskGlyph(d0.key, 12)}<b>${esc(d0.name)} disagrees</b></span>
          <p>“${esc(d0.take)}”</p>
        </div>`;
      }
      return out ? `<div class="sts-voices">${out}</div>` : "";
    }
    // THE NIGHTLY RECAP as a marquee story: "Last Night at the Desk" — the winner's glyph
    // crowned, the best call quoted, the worst call owned honestly. Daily fresh content.
    function storyLastNightSlide(sl: any) {
      const rc = sl.rc;
      const winnerCast = rc.winner && DESK_CAST[rc.winner] ? DESK_CAST[rc.winner] : null;
      const head = rc.headline || recapWinnerLineTxt(rc) || "The desk, graded overnight.";
      return `<div class="sts sts-lastnight${rc.winner ? ` an-${esc(rc.winner)}` : ""}">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ Last Night at the Desk</span>${rc.date ? `<span class="sts-when">${esc(recapDateTxt(rc.date))}</span>` : ""}</div>
        ${winnerCast ? `<div class="sts-ln-winner an-${esc(rc.winner)}" data-an="${esc(rc.winner)}" role="button" tabindex="0">
          <span class="sts-ln-glyph"><span class="sts-ln-crown">${crownSvg(16)}</span>${deskGlyph(rc.winner, 30)}</span>
          <span class="sts-ln-nm"><b>${esc(winnerCast.name)}</b><i>${esc(winnerCast.title)}</i></span>
        </div>` : ""}
        <h3 class="sts-head deskhead ln">${esc(head)}</h3>
        ${(rc.best || rc.worst)
          ? `${recapCallRow(rc.best, "best")}${recapCallRow(rc.worst, "worst")}`
          : (rc.lines.length ? `<div class="rcap-lines sts-ln-lines">${recapLineRows(rc)}</div>` : "")}
        ${rc.note ? `<div class="sts-substat">${esc(rc.note)}</div>` : ""}
        <button class="st-cta" data-go="results">The full desk record →</button>
      </div>`;
    }
    function storyPickSlide(sl: any) {
      const g = sl.g, pl = sl.pl;
      const gs = gameState(g);
      const st = playState(g, pl);
      const locked = pickLocked(pl, st);
      const stars = pl.stars != null ? Math.max(0, Math.min(5, Math.round(Number(pl.stars)))) : 0;
      const tier = stars >= 4 ? "gold" : stars === 3 ? "green" : "blue";
      const over = /(^|\s)over/i.test(String(pl.side || ""));
      const under = /(^|\s)under/i.test(String(pl.side || ""));
      const dir = over ? "ou-over" : under ? "ou-under" : "";
      const state = pickStateTxt(g, pl, st);
      const when = gs.kind === "live"
        ? `<span class="sts-when live"><span class="livedot"></span>${esc(gs.label && gs.label !== "Live" ? gs.label : "LIVE")}</span>`
        : gs.kind === "final" ? `<span class="sts-when">Final</span>`
        : `<span class="sts-when">${esc(gs.si.hasTime && gs.si.time ? gs.si.time : (gs.si.date || ""))}</span>`;
      const team = (side: "away" | "home") => {
        const f = teamRecordFor(g, side);
        return `<div class="sts-team"><span class="sts-crest">${gCrest(g, side)}</span><b>${esc(side === "away" ? g.away_abbr : g.home_abbr)}</b>${f && f.rec ? `<i>${esc(f.rec)}</i>` : ""}</div>`;
      };
      const mid = gs.score && gs.score.split && gs.score.home != null
        ? `<div class="sts-score${gs.kind === "final" ? " fin" : ""}">${num(gs.score.away, 0)}–${num(gs.score.home, 0)}</div>`
        : `<div class="sts-at">@</div>`;
      const call = locked
        ? `<div class="sts-lockwrap"><span class="sts-dots" aria-hidden="true">●●●● ●</span>${pickStars(pl)}<button class="st-cta lock" data-go="unlock">${lockSvg} ${esc(unlockPitchTxt())}</button></div>`
        : `<div class="sts-call ${dir}">${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}</div>
           <div class="sts-meta">${pickStars(pl)}${pickGrade(pl)}${state ? `<span class="sts-res ${state.cls}">${state.txt}</span>` : (gs.kind === "pre" ? countdownChip(g, gs) : "")}</div>
           ${signalRow(pl)}
           ${pickMadeMeta(pl)}`;
      return `<div class="sts sts-pick tier-${tier}">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ ${sl.rank === 1 ? "Flagship Pick" : `Top Pick #${sl.rank}`}</span>${when}</div>
        <div class="sts-mu">${team("away")}${mid}${team("home")}</div>
        <div class="sts-callwrap">${call}</div>
        ${storyVoiceQuote(g, pl, locked)}
        ${locked ? "" : `<button class="st-cta" data-go="pick" data-gid="${esc(g.game_id)}">See the full pick →</button>`}
      </div>`;
    }
    function storyNewsSlide(sl: any) {
      const s = sl.s || {};
      const lab = esc((SPORT_LABEL[s.sport] || s.sport || "").toUpperCase());
      const when = niceTime(s.published_at, s.published_display);
      // Full-bleed cover on a portrait slide needs a tall source; small landscape
      // photos blown up 3-4x read as blur. Gate on natural size once loaded:
      // tiny/broken → drop to the gradient bg; low-res → crisp inset photo card.
      const img = s.image_url ? `<img class="sts-photo" src="${esc(String(s.image_url))}" alt="" loading="lazy" onload="if(!this.naturalWidth||this.naturalWidth<240){this.remove()}else if(this.naturalHeight<700){this.classList.add('lowres')}" onerror="this.remove()">` : "";
      return `<div class="sts sts-news">
        <div class="sts-bg" aria-hidden="true"></div>
        ${img}
        <div class="sts-scrim" aria-hidden="true"></div>
        <div class="sts-newsbody">
          <div class="sts-kick"><span>${lab || "AROUND THE LEAGUE"} · DiamondEdge</span>${when ? `<span class="sts-when">${esc(when)}</span>` : ""}</div>
          <h3 class="sts-head">${esc(s.headline || s.title || "")}</h3>
          ${(s.dek || s.summary) ? `<p class="sts-dek">${esc(cleanBlurb(s.dek || s.summary))}</p>` : ""}
          <button class="st-cta" data-go="news" data-nf="${esc(sl.key)}">Read the story →</button>
        </div>
      </div>`;
    }
    function storyRecapSlide(sl: any) {
      const r = sl.rec || {};
      const wl = `${r.wins || 0}–${r.losses || 0}${r.pushes ? `–${r.pushes}` : ""}`;
      const roi = r.roi != null ? `${r.roi >= 0 ? "+" : ""}${(r.roi * 100).toFixed(0)}% ROI` : "";
      const pos = (r.wins || 0) >= (r.losses || 0);
      const rows = (sl.games || []).map((g: any) => {
        const p = g.pick;
        const side = `${/over/i.test(String(p.side)) ? "OVER" : "UNDER"} ${p.line != null ? lineStr(p.line) : ""}`.trim();
        const res = p.result === "win" ? `<span class="sts-rres won">W</span>` : p.result === "loss" ? `<span class="sts-rres lost">L</span>` : `<span class="sts-rres pushed">P</span>`;
        return `<div class="sts-rrow"><span class="sts-rmu">${esc(teamShort(g.away))} @ ${esc(teamShort(g.home))}</span><span class="sts-rside">${esc(side)}</span>${bStars(p.stars)}${res}</div>`;
      }).join("");
      const dd = new Date(sl.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
      return `<div class="sts sts-recap ${pos ? "pos" : "neg"}">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ Yesterday's Record</span><span class="sts-when">${esc(dd)}</span></div>
        <div class="sts-bigwl">${wl}</div>
        <div class="sts-substat">${r.hit_rate != null ? `${(r.hit_rate * 100).toFixed(0)}% hit` : ""}${roi ? ` · ${roi}` : ""} · graded in the open</div>
        ${rows ? `<div class="sts-rrows">${rows}</div>` : ""}
        <button class="st-cta" data-go="results">See the full record →</button>
      </div>`;
    }
    function storySummarySlide(sl: any) {
      const rows = (sl.picks || []).map((r: any, i: number) => {
        const g = r.g, pl = r.pl;
        const locked = pickLocked(pl, playState(g, pl));
        const side = locked ? `<span class="sts-dots sm" aria-hidden="true">●●●</span>` : `${esc(pl.side || "")}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}`;
        return `<div class="sts-srow" data-gid="${esc(g.game_id)}" role="button" tabindex="0"><span class="sts-srank">#${i + 1}</span><span class="sts-smu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span><span class="sts-sside">${side}</span>${bStars(pl.stars != null ? pl.stars : 1)}</div>`;
      }).join("");
      return `<div class="sts sts-summary">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ Today's Board</span></div>
        <div class="sts-head sm">${sl.picks.length} pick${sl.picks.length === 1 ? "" : "s"} on the board today</div>
        <div class="sts-srows">${rows}</div>
        <button class="st-cta" data-go="games">Open the board →</button>
      </div>`;
    }
    // THE ANALYST DESK slide — the consensus as cinema: "All four say OVER." with the four
    // calls stacked and the chief's verdict. A split gets the proud "desk divided" pass.
    function storyDeskSlide(sl: any) {
      const g = sl.g;
      const c = sl.c || deskConsensus(g);
      const ans = deskAnalysts(g);
      const pl = displayPick(g);
      const locked = pl ? pickLocked(pl, playState(g, pl)) : false;
      const chief = deskChief(g);
      const state = (c && c.state) || "PENDING";
      const sideWord = locked ? "" : String((c && c.side) || "").toUpperCase();
      const head = state === "UNANIMOUS" ? (sideWord ? `All four say ${sideWord}.` : "All four analysts agree.")
        : state === "MAJORITY" ? `${Math.max(c.nOver, c.nUnder)}–${Math.min(c.nOver, c.nUnder)}${sideWord ? ` ${sideWord}` : ""} — the desk leans.`
        : state === "SPLIT" ? "The desk is divided." : "The desk convenes soon.";
      const rows = ans.map((a: any) => {
        const hide = locked; // a.locked = frozen at its wall (provenance), never a redaction
        const dirCls = a.dir === "over" ? "ou-over" : a.dir === "under" ? "ou-under" : "";
        const call = hide ? `<span class="dsk-dots" aria-hidden="true">●●</span>`
          : a.side ? `<b class="sts-dcall ${dirCls}">${a.dir === "over" ? "▲" : a.dir === "under" ? "▼" : ""} ${esc((a.dir || a.side).toUpperCase())}</b>` : `<b class="sts-dcall none">—</b>`;
        return `<div class="sts-drow an-${esc(a.key)}">${deskGlyph(a.key, 14)}<span class="sts-dnm"><b>${esc(a.name)}</b><i>${esc(a.title)}</i></span>${call}${!hide && a.conv != null ? `<span class="sts-dconv">${Math.round(a.conv * 100)}%</span>` : ""}</div>`;
      }).join("");
      const verdict = chief && chief.action
        ? `<div class="sts-chief ${chief.action === "PLAY" ? "ch-play" : chief.action === "LEAN" ? "ch-lean" : "ch-avoid"}"><b>◆ ${chief.action === "AVOID" ? "WE PASS" : chief.action}</b>${chief.rationale ? `<span>${esc(chief.rationale)}</span>` : ""}</div>`
        : "";
      const stCls = state === "UNANIMOUS" ? "unan" : state === "MAJORITY" ? "maj" : "split";
      return `<div class="sts sts-desk cons-${stCls}">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ The Analyst Desk</span><span class="sts-when">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span></div>
        <h3 class="sts-head deskhead">${esc(head)}</h3>
        <div class="sts-drows">${rows}</div>
        ${verdict}
        ${simSaysChip(g, "big")}
        <button class="st-cta" data-go="pick" data-gid="${esc(g.game_id)}">See the desk's full read →</button>
      </div>`;
    }
    // DESK STANDINGS as cinema: the four analysts ranked, records front and center.
    function storyStandingsSlide() {
      const rows = deskRecordRows().slice().sort((a: any, b: any) =>
        ((b.roi == null ? -9 : b.roi) - (a.roi == null ? -9 : a.roi)) || ((b.hit || 0) - (a.hit || 0)) || ((b.win || 0) - (a.win || 0)));
      const items = rows.map((r: any, i: number) => {
        const graded = r.win + r.loss + r.push > 0;
        return `<button class="sts-strow an-${esc(r.key)}${i === 0 && graded ? " lead" : ""}" data-an="${esc(r.key)}">
          <span class="sts-strank">${i + 1}${["st", "nd", "rd", "th"][Math.min(i, 3)]}</span>
          ${deskGlyph(r.key, 15)}
          <span class="sts-dnm"><b>${esc(r.name)}</b><i>${esc(r.title)}</i></span>
          <span class="sts-strec"><b>${graded ? `${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}` : "0–0"}</b>${r.roi != null ? `<i class="${r.roi >= 0 ? "pos" : "neg"}">${bRoi(r.roi)}</i>` : ""}</span>
          ${deskL10Dots(r.last10.slice(-5))}
        </button>`;
      }).join("");
      return `<div class="sts sts-standings">
        <div class="sts-bg" aria-hidden="true"></div>
        <div class="sts-kick"><span>◆ Desk Standings</span></div>
        <h3 class="sts-head deskhead">Four analysts.<br>Every game. One scoreboard.</h3>
        <div class="sts-strows">${items}</div>
        <div class="sts-substat">Graded against real finals, in public — tap an analyst for the full card.</div>
        <button class="st-cta" data-go="results">See the full record →</button>
      </div>`;
    }
    function storySlideHtml(sl: any, i: number) {
      const inner = sl.t === "pick" ? storyPickSlide(sl)
        : sl.t === "news" ? storyNewsSlide(sl)
        : sl.t === "recap" ? storyRecapSlide(sl)
        : sl.t === "desk" ? storyDeskSlide(sl)
        : sl.t === "lastnight" ? storyLastNightSlide(sl)
        : sl.t === "standings" ? storyStandingsSlide()
        : sl.t === "patterns" ? storyPatternsSlide()
        : storySummarySlide(sl);
      return `<div class="st-slide${i === storyIdx ? " on" : ""}" data-si="${i}" role="group" aria-roledescription="story" aria-label="Story ${i + 1} of ${storyLen}">${inner}</div>`;
    }
    function storyFillsSync() {
      document.querySelectorAll(".st-fill[data-sf]").forEach((el: any) => {
        const j = Number(el.dataset.sf);
        el.style.width = j < storyIdx ? "100%" : j > storyIdx ? "0%" : el.style.width;
        if (j === storyIdx && storyAcc === 0) el.style.width = "0%";
      });
    }
    function gotoStory(i: number) {
      if (i < 0) i = 0;
      if (i > storyLen - 1) i = storyLen - 1;
      storyIdx = i;
      storyAcc = 0; storyT0 = performance.now();
      const stage = $("st-stage");
      if (stage) stage.querySelectorAll(".st-slide").forEach((s: any) => s.classList.toggle("on", Number(s.dataset.si) === i));
      storyFillsSync();
    }
    const nextStory = () => { if (storyIdx < storyLen - 1) gotoStory(storyIdx + 1); else { const f = document.querySelector(`.st-fill[data-sf="${storyIdx}"]`) as any; if (f) f.style.width = "100%"; storyAcc = STORY_MS; } };
    const prevStory = () => gotoStory(Math.max(0, storyIdx - 1));
    function storyTick(now: number) {
      if (tab !== "today" || newsMode !== "stories" || !$("stories")) { stopStories(); return; }
      // pause while held, while a sheet/detail covers the stories, or while backgrounded
      if (storyHold || document.hidden || document.body.classList.contains("sheet-open")) {
        storyT0 = now;
      } else if (storyAcc < STORY_MS) {
        const elapsed = storyAcc + (now - storyT0);
        const pct = Math.min(100, (elapsed / STORY_MS) * 100);
        const f = document.querySelector(`.st-fill[data-sf="${storyIdx}"]`) as any;
        if (f) f.style.width = pct.toFixed(1) + "%";
        if (elapsed >= STORY_MS) {
          if (storyIdx < storyLen - 1) gotoStory(storyIdx + 1);
          else storyAcc = STORY_MS; // end of the deck — hold on the last card
        }
      }
      storyRafId = requestAnimationFrame(storyTick);
    }
    function startStoryTimer() {
      stopStories();
      if (REDUCE) { // no auto-advance under reduced motion — fills read as position only
        storyFillsSync();
        const f = document.querySelector(`.st-fill[data-sf="${storyIdx}"]`) as any; if (f) f.style.width = "100%";
        return;
      }
      storyAcc = 0; storyT0 = performance.now();
      storyRafId = requestAnimationFrame(storyTick);
    }
    function bindStories(view: any) {
      const wrap = $("stories"), stage = $("st-stage");
      const gb = $("st-gridbtn"); if (gb) gb.onclick = (e: any) => { e.stopPropagation(); setNewsMode("grid"); };
      view.querySelectorAll("[data-go]").forEach((b: any) => {
        b.onclick = (e: any) => {
          e.stopPropagation();
          const go = b.dataset.go;
          if (go === "unlock") { openUnlock(); return; }
          if (go === "pick") { const g = findGameLive(b.dataset.gid) || findGame(b.dataset.gid); if (g) openDetail(g); else jumpToGames([b.dataset.gid]); return; }
          if (go === "news") { openArticleSheet(newsStoryByKey(b.dataset.nf), b.dataset.nf); return; }
          if (go === "results" || go === "games") switchTab(go);
        };
      });
      view.querySelectorAll(".sts-srow[data-gid]").forEach((rw: any) => {
        const open = (e: any) => { e.stopPropagation(); const g = findGameLive(rw.dataset.gid) || findGame(rw.dataset.gid); if (g) openDetail(g); };
        rw.onclick = open;
        rw.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
      });
      if (!stage) return;
      let pdX = 0, pdAt = 0;
      const hold = () => {
        if (!storyHold) { storyAcc += performance.now() - storyT0; storyHold = true; }
      };
      const release = () => { if (storyHold) { storyHold = false; storyT0 = performance.now(); } };
      stage.addEventListener("pointerdown", (e: any) => { pdX = e.clientX; pdAt = Date.now(); hold(); }, { passive: true });
      stage.addEventListener("pointerup", (e: any) => {
        release();
        const dx = e.clientX - pdX, dt = Date.now() - pdAt;
        if (Math.abs(dx) > 44) { if (dx < 0) nextStory(); else prevStory(); return; }   // swipe
        if (dt >= 420) return;                                                          // hold-release: no advance
        if (e.target && e.target.closest && e.target.closest(".st-cta,[data-go],[data-gid],[data-up],a,button")) return;
        const rect = stage.getBoundingClientRect();
        if (e.clientX - rect.left < rect.width * 0.34) prevStory(); else nextStory();    // tap zones
      });
      stage.addEventListener("pointercancel", release);
      stage.addEventListener("pointerleave", release);
      if (wrap) wrap.onkeydown = (e: any) => {
        if (e.key === "ArrowRight") { e.preventDefault(); nextStory(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); prevStory(); }
      };
    }
    function renderStories(view: any) {
      stopStories();
      const slides = buildStorySlides();
      if (!slides.length) {
        // feeds still landing — a story-shaped shimmer (never an empty stage)
        view.innerHTML = `<div class="stories skel" aria-hidden="true"><div class="st-top"><div class="st-progress"><span class="st-seg"><i class="st-fill" style="width:35%"></i></span><span class="st-seg"></span><span class="st-seg"></span></div></div><div class="st-stage"><div class="st-slide on"><div class="sts sts-skel"><span class="sk sk-line w60"></span><span class="sk sk-line w48"></span><span class="sk sk-line w24"></span></div></div></div></div>`;
        return;
      }
      storyLen = slides.length;
      if (storyIdx > storyLen - 1) storyIdx = 0;
      const dateTxt = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const segs = slides.map((_: any, i: number) =>
        `<span class="st-seg"><i class="st-fill" data-sf="${i}" style="width:${i < storyIdx ? 100 : 0}%"></i></span>`).join("");
      view.innerHTML = `
        <div class="stories" id="stories" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Today at DiamondEdge — stories">
          <div class="st-top">
            <div class="st-progress">${segs}</div>
            <div class="st-bar">
              <span class="st-brand"><span class="st-dia" aria-hidden="true">◆</span>DiamondEdge Desk</span>
              <span class="st-date">${esc(dateTxt)}</span>
              <button class="st-gridbtn" id="st-gridbtn" aria-label="Switch to grid view" title="Grid view"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg></button>
            </div>
          </div>
          <div class="st-stage" id="st-stage">${slides.map((s: any, i: number) => storySlideHtml(s, i)).join("")}</div>
        </div>`;
      bindStories(view);
      startCountdowns();
      startStoryTimer();
    }

    function renderToday() {
      const view = $("today-view");
      if (!view) return;
      if (newsMode === "stories") { renderStories(view); if (tab !== "today") todayFresh = false; return; }
      stopStories();
      const db = briefSource() || fallbackBrief();
      if (!db) { view.innerHTML = skeletonNews(); return; }
      const dd = new Date(String(db.date || todayISO()) + "T12:00:00");
      const dateTxt = isNaN(dd.getTime()) ? String(db.date || "") : dd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const isToday = curDate === todayISO();
      const picksAll = orderTopPicks((db.top_picks || []) as any[]);
      const leadPick = picksAll[0] || null;
      // LEAD STORY — the day's feature bet = the BEST pick on today's slate under the
      // (v4-first) displayPick, falling back to the served brief's top pick.
      // Hero pool = today + live + ANY upcoming (incl. tomorrow) so once today's slate is
      // final the headline reaches to the next actionable pick instead of stranding a loser.
      const ftPool = (((livePayload || payload) || {}).games || []).filter((g0: any) => {
        const k = gameState(g0).kind;
        const d0 = gameLocalDay(g0);
        return k === "live" || k === "pre" || d0 === todayISO();
      });
      const ftBest = isToday ? dayLockedPick(ftPool, 1) : featuredPick(ftPool);
      const leadGame = (ftBest && ftBest.g) || (leadPick ? findGameLive(leadPick.game_id) : null);
      // optional SECOND flagship — only when it's a genuinely strong (3★+) call
      const ft2 = isToday && leadGame ? dayLockedPick(ftPool, 2, String(leadGame.game_id)) : null;
      const flag2 = ft2 && ft2.pl && (ft2.pl.stars || 0) >= 3 ? leadStoryCard(ft2.g, "Flagship Pick", dateTxt) : "";
      let leadStory = "";
      if (leadGame) {
        leadStory = leadStoryCard(leadGame, "Today's Flagship Pick", dateTxt);
      } else {
        leadStory = `<article class="leadstory pass">
          <div class="ls-body">
            <div class="ls-kick"><span class="ls-lab">Feature bet</span></div>
            <h3 class="ls-match">No DiamondEdge Pick today — we only publish when the numbers clear our bar.</h3>
            <p class="ls-lede">Today none did. The top games to watch are below, and every past call stays graded in the open on the Insights tab.</p>
            <div class="ls-ctas"><span class="hero-cta" data-nav="results">See the record →</span><span class="hero-cta alt" data-nav="games">Browse today's board →</span></div>
          </div>
        </article>`;
      }
      // TIGHT MASTHEAD — kicker (the ONE red accent) + short punchy headline + small dek.
      // It's the page NAMEPLATE now — it leads the front, above the hero and the two surfaces.
      // The masthead nameplate is computed from the MODEL's board (never the old brief):
      // how many starred picks are live on today's slate right now.
      const nTakes = ftPool.filter((g0: any) => isBet(displayPick(g0))).length;
      const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
      let tightHead = !isToday ? "The board, recapped"
        : nTakes === 0 ? "The board fills in as game time nears"
        : `${WORDS[Math.min(nTakes, 9)]} pick${nTakes === 1 ? "" : "s"} on the board today`;
      const headDek = ""; // the read lives in the hero + game page; the nameplate stays one clean line
      view.innerHTML = `
        <div class="news">
          <div class="masthead lead">
            <div class="mh-kicker"><span class="lk-tag">DiamondEdge Desk</span><button class="st-modebtn" id="st-storiesbtn" aria-label="Switch to stories view">▸ Stories</button></div>
            <h2 class="lead-head">${esc(tightHead)}</h2>
            ${headDek ? `<p class="mh-dek clamp2">${esc(headDek)}</p>` : ""}
          </div>
          <div class="mh-rule"></div>
          ${deskStandingsStrip()}
          ${patternsStrip()}
          ${deskRecapCard()}
          ${nextUpBanner()}
          <section class="ng-lead front-hero">${leadStory}</section>
          ${flag2 ? `<section class="ng-lead front-hero second">${flag2}</section>` : ""}
          ${newsFront() ? `<div class="front-wire">${newsFront()}</div>` : ""}
          ${socialShareBar()}
          <div class="news-foot">${esc(recordStrip())}</div>
        </div>`;
      // ---- bindings ----
      const stb = $("st-storiesbtn"); if (stb) stb.onclick = () => setNewsMode("stories");
      const sn = $("soc-native"); if (sn) sn.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge", text: shareTagline(), url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${shareTagline()} ${url}`); toast("Copied — paste it anywhere"); } catch { toast(url); }
      };
      const sc = $("soc-copy"); if (sc) sc.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        try { await navigator.clipboard.writeText(url); toast("Link copied to clipboard"); } catch { toast(url); }
      };
      const nav = (el: any) => { const d = el.dataset.nav; if (d) switchTab(d); };
      view.querySelectorAll("[data-nav]").forEach((b: any) => (b.onclick = (e: any) => { e.stopPropagation(); nav(b); }));
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
      // lead story + carousel + story previews + board tiles → detail sheet
      startCountdowns(); // keep the "next up" first-pitch countdown ticking
      view.querySelectorAll(".leadstory[data-gid], .hero[data-gid], .prev[data-gid], .boardlist .tile[data-gid], .nextup[data-gid]").forEach((h: any) => {
        const open = (e: any) => {
          if (e.target && e.target.closest && e.target.closest("[data-up]")) { openUnlock(); return; }
          if (e.target && e.target.closest && e.target.closest("[data-nav]")) return;
          if (h.dataset.locked) { openUnlock(); return; }
          const g = findGameLive(h.dataset.gid);
          if (g) openDetail(g); else jumpToGames([h.dataset.gid]);
        };
        h.onclick = open;
        h.onkeydown = (e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(e); } };
      });
      // News cards open OUR in-app article reader (not a link out).
      view.querySelectorAll(".nf-story[data-nf]").forEach((a: any) => {
        a.onclick = (e: any) => { e.preventDefault(); openArticleSheet(newsStoryByKey(a.dataset.nf), a.dataset.nf); };
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
            <div class="up-st"><div class="v">≈55%</div><div class="k">expected · morning prices</div></div>
            <div class="up-st"><div class="v">56.9%</div><div class="k">out-of-sample · 239 picks</div></div>
            <div class="up-st"><div class="v">${(rh.hit * 100).toFixed(1)}%</div><div class="k">backtest (in-sample)</div></div>
            <div class="up-st"><div class="v">${rh.n.toLocaleString()}</div><div class="k">backtested picks</div></div>
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
        <div class="up-honest">Straight talk: the ${(rh.hit * 100).toFixed(1)}% is a real, rigorous backtest over ${rh.n.toLocaleString()} graded picks — but in-sample, so we plan around the honest ~55% (the ${'56.9%'} out-of-sample slice is the cleanest evidence)${fwd ? `. Since going live the record is ${fwd.wins || 0}-${fwd.losses || 0} — still a tiny sample` : ""}. Every future pick is graded the same way, in the open, win or lose.</div>`;
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
        : `<span class="acct-ic">${personSvg}</span><span class="acct-signin-tx">Sign in</span>`;
      return `<button class="acctbtn${a ? "" : " signin"}" id="acctbtn" aria-label="${a ? "Your account" : "Sign in"}">${inner}${a && prem ? `<span class="acct-star" aria-hidden="true">◆</span>` : ""}</button>`;
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
            <p>Save your preferences and unlock Premium. One honest model, graded in public since 2022 — a real totals edge, honestly sized at <b>~55%</b> expected (backtest ${(rh.hit * 100).toFixed(1)}% over ${rh.n.toLocaleString()} is in-sample).</p>
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
    // ===================== UNIFIED PICK FEED (public/picks_unified{,_live}.json) =====================
    // ONE DiamondEdge Pick per game — pregame totals, star-rated, +EV-gated, price-aware, with
    // every PASS's priced-out reason. Graded in the open; the record accrues in public. History
    // key 'picks_unified' (all days) + live key 'picks_unified_live' (today + tomorrow).
    let betaData: any = null;
    let betaBuiltAt = 0; // last DOM build — skip rebuilds within 60s (tab switches stay instant)
    let betaTab: "today" | "record" | "games" = "today";
    let betaShown = 24;        // games list pagination
    let betaOnlyTakes = true;  // default: games where the model actually made a pick
    async function loadBeta() {
      if (betaData) return betaData;
      // FRESH source = Supabase (slate_snapshots key 'picks_unified'), synced every cycle from
      // the pick box — so prior-day picks/results update with NO deploy. The bundled static
      // file is only a fallback for the deep archive. (Fixes the recurring "yesterday shows
      // all-PASS" bug: the static file only updated on git push, so recent days went missing.)
      let fresh: any = null;
      try { fresh = await Promise.race([snap("picks_unified"), new Promise((r) => setTimeout(() => r(null), 2500))]); } catch {}
      if (!fresh || !fresh.games) {
        const r = await fetch(`/picks_unified.json?v=${new Date().toISOString().slice(0, 10)}`, { cache: "force-cache" });
        if (!r.ok) throw new Error("history fetch " + r.status);
        fresh = await r.json();
      }
      betaData = applyDeskMock(fresh);
      return betaData;
    }
    // LIVE picks (today + tomorrow) — the freshest copy lives in Supabase (slate_snapshots
    // key 'picks_unified_live', synced from the pick box every few minutes), so PRODUCTION
    // updates intraday with no deploy. The bundled static file is the fallback. 5-min cache.
    let betaLiveData: any = null, betaLiveAt = 0;
    async function loadBetaLive() {
      if (betaLiveData && Date.now() - betaLiveAt < 5 * 60 * 1000) return betaLiveData;
      const hadNone = !betaLiveData;
      const reRender = () => { try { if (tab === "today") renderToday(); else renderSlate(true); } catch {} };
      // Supabase is the FRESH source (synced every ~5 min). The bundled static file is a
      // stale-by-design deploy artifact — only a last resort. Give Supabase a real chance.
      let fresh: any = null;
      for (let a = 0; a < 2 && (!fresh || !fresh.games); a++) {
        try { fresh = await Promise.race([snap("picks_unified_live"), new Promise((r) => setTimeout(() => r(null), 4000))]); } catch {}
      }
      let usedFallback = false;
      if (!fresh || !fresh.games) {
        usedFallback = true;
        const r = await fetch("/picks_unified_live.json", { cache: "no-store" });
        if (!r.ok) throw new Error("live fetch " + r.status);
        fresh = await r.json();
      }
      betaLiveData = applyDeskMock(fresh);
      betaLiveAt = Date.now();
      if (hadNone) reRender(); // swap in the real picks / flagship once the feed lands
      // SELF-HEAL: if we had to fall back to the bundled static file (Supabase was slow), it
      // can be days old (deploy gap) — keep retrying Supabase in the background and swap +
      // re-render the moment the fresh copy arrives, so the board NEVER stays stale.
      if (usedFallback) {
        (async () => {
          for (let a = 0; a < 6; a++) {
            await new Promise((r) => setTimeout(r, 3000));
            try {
              const sb: any = await snap("picks_unified_live");
              if (sb && sb.games && sb.generated_utc !== fresh.generated_utc) {
                betaLiveData = applyDeskMock(sb); betaLiveAt = Date.now(); reRender(); return;
              }
            } catch {}
          }
        })();
      }
      return betaLiveData;
    }
    const teamShort = (name: any) => { const s = String(name || "").trim(); const w = s.split(/\s+/); return w.length ? w[w.length - 1] : s; };
    function bStars(n: any) {
      const k = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
      let h = ""; for (let i = 0; i < 5; i++) h += `<i class="${i < k ? "f" : "e"}">${i < k ? "★" : "☆"}</i>`;
      return `<span class="bstars s${k}" aria-label="${k} of 5 stars">${h}</span>`;
    }
    const bPct = (v: any, d = 1) => (v == null || isNaN(Number(v)) ? "—" : (Number(v) * 100).toFixed(d) + "%");
    const bRoi = (v: any) => (v == null || isNaN(Number(v)) ? "—" : (Number(v) >= 0 ? "+" : "") + (Number(v) * 100).toFixed(1) + "%");
    const bWL = (r: any) => (r && r.n ? `${r.win}–${r.loss}${r.push ? `–${r.push}` : ""}` : "0–0");
    // The game's single pick when it's an actionable PICK — used to headline it in the list.
    function bestBetaCell(g: any) {
      const p = g && g.pick;
      return p && String(p.status || "").toUpperCase() === "PICK" ? p : null;
    }
    const betaTakeCount = (g: any) => (g && g.pick && String(g.pick.status || "").toUpperCase() === "PICK" ? 1 : 0);

    // ---- honest framing (no hype): the record accrues in public ----
    function betaFrame(d: any) {
      const dates = Array.isArray(d && d.dates) ? d.dates : [];
      const n = d && d.record && d.record.overall ? d.record.overall.n : 0;
      // The date range covers the whole ledger, most of which was never served — so the
      // count is labelled "graded rows", and the live-served count is stated next to it.
      const hr = headlineStrategyRecord(d);
      const lv = hr && hr.live;
      const range = dates.length ? `Graded ${esc(dates[0])} → ${esc(dates[dates.length - 1])}${n ? ` · ${n} graded rows` : ""}${lv ? ` · ${lv.n} of them served live` : ""}` : "";
      return `<div class="beta-frame">
        <p class="bf-lede">Pregame totals, star-rated and graded in the open — win or lose.</p>
        <div class="bf-note">${range}</div>
      </div>`;
    }

    // ---- the record dashboard — two honest things: (a) the overall picks record as a big hero,
    // (b) the record BY STAR TIER. One record, one scale. Source = record.overall + by_star_tier.
    function betaDashboard(d: any) {
      const rec = d.record || {};
      const ov = rec.overall || {};
      const byStar = rec.by_star_tier || {};
      // Star-tier rows 5→1 — the validation: does a higher star win more? Only render tiers with picks.
      const tierRow = (s: number) => {
        const r = byStar[s] || byStar[String(s)] || {};
        if (!r.n) return "";
        return `<div class="strec-row">
          <span class="strec-star">${bStars(s)}</span>
          <span class="strec-n">${r.n || 0} pick${r.n === 1 ? "" : "s"}</span>
          <span class="strec-wl">${bWL(r)}</span>
          <span class="strec-hit">${r.hit_rate != null ? bPct(r.hit_rate, 1) + " hit" : "—"}</span>
          <span class="strec-roi ${r.roi != null && r.roi < 0 ? "neg" : r.roi != null ? "pos" : ""}">${bRoi(r.roi)} ROI</span>
        </div>`;
      };
      // The EXPANDED 2★ band (activated 7/24) grades separately so the core record stays
      // pure — shown as its own labeled row once it has graded picks.
      const exRow = (() => {
        const r = byStar["2_expanded"] || {};
        if (!r.n) return "";
        return `<div class="strec-row expanded">
          <span class="strec-star">${bStars(2)}<i class="strec-newtag">new band</i></span>
          <span class="strec-n">${r.n} pick${r.n === 1 ? "" : "s"}</span>
          <span class="strec-wl">${bWL(r)}</span>
          <span class="strec-hit">${r.hit_rate != null ? bPct(r.hit_rate, 1) + " hit" : "—"}</span>
          <span class="strec-roi ${r.roi != null && r.roi < 0 ? "neg" : r.roi != null ? "pos" : ""}">${bRoi(r.roi)} ROI</span>
        </div>`;
      })();
      const rows = ([5, 4, 3, 2].map(tierRow).join("") + exRow + tierRow(1)) || `<div class="strec-row empty"><span class="strec-n">Grading as games finish.</span></div>`;
      // LAST 7 DAYS — a compact day-by-day strip under the hero (most recent first), from the
      // same by_date_record that powers the per-day chips. Only days with graded picks count;
      // each day is W-L(-P) tinted by that day's ROI, with the ROI itself as a small trailer.
      const bdr = d.by_date_record || {};
      const l7dates = Object.keys(bdr)
        .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && bdr[k] && bdr[k].n_graded)
        .sort().reverse().slice(0, 7);
      const l7 = l7dates.map((k) => {
        const r = bdr[k];
        const day = new Date(k + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
        const wl = `${r.wins || 0}-${r.losses || 0}${r.pushes ? "-" + r.pushes : ""}`;
        const dir = r.roi != null ? (r.roi > 0 ? "up" : r.roi < 0 ? "down" : "flat") : "flat";
        const rv = r.roi != null ? Math.round(r.roi * 100) : null;
        const roiTxt = rv != null ? (rv > 0 ? `+${rv}%` : rv < 0 ? `${rv}%` : "0%") : "";
        return `<span class="l7d ${dir}" title="${esc(k)} · ${r.n_graded} graded${roiTxt ? ` · ${roiTxt} ROI` : ""}"><i>${esc(day)}</i><b>${wl}</b>${roiTxt ? `<em>${roiTxt}</em>` : ""}</span>`;
      }).join("");
      const last7Strip = l7dates.length
        ? `<div class="strec-l7"><span class="l7k">Last 7 days</span><div class="l7row">${l7}</div></div>`
        : "";
      const gatedNote = `<div class="strec-gate">Every pick has to beat the actual price it's judged at — a call that's on the right side of the number but priced out is an honest pass, not a bet.</div>`;
      // ═══ THE HERO LEADS WITH THE LIVE-SERVED RECORD ═══
      // record.overall is a COMBINED block: live-served picks plus pre-activation
      // reconstruction plus the champion's rolling-origin walk-forward backtest. Most of it
      // was never served to anyone. Leading with it — under the words "graded in public…
      // nothing hidden" — reads as a live track record that does not exist. So the live
      // number leads at full size with its start date, and the combined total is demoted to
      // a labelled secondary block that states exactly how much of it was never live.
      const hr = headlineStrategyRecord(d);
      const lv = hr && hr.live;
      if (lv) {
        const lvPos = (lv.roi || 0) >= 0;
        const since = stratDateTxt(hr.activation);
        // the combined figure the older blocks publish (record.overall) + how much of it
        // was never a served pick — stated as a number, not a hedge.
        const cmb = (hr.combined && hr.combined.n ? hr.combined : (ov && ov.n ? { n: ov.n, win: ov.win, loss: ov.loss, push: ov.push, hit: _fin(ov.hit_rate), roi: _fin(ov.roi) } : null));
        const notLiveN = cmb ? Math.max(0, cmb.n - lv.n) : 0;
        const combinedBlock = cmb && cmb.n > lv.n
          ? `<div class="strec-notlive">
              <div class="snl-k">Also published — the combined total</div>
              <p><b>${esc(stratWL(cmb))}${cmb.hit != null ? ` · ${stratPct(cmb.hit)}` : ""}${cmb.roi != null ? ` · ${stratRoi(cmb.roi)} ROI` : ""} over ${cmb.n}.</b> Only <b>${lv.n}</b> of those were picks we actually served. The other <b>${notLiveN}</b> are the same rules replayed backwards — pre-activation reconstruction and walk-forward backtest. The individual picks are real; the record is not a served one. It stays on the page because the older blocks below report it. Don't read it as a track record.</p>
            </div>`
          : "";
        return `
        <div class="strec-hero ${lvPos ? "pos" : "neg"}">
          <div class="strec-k">The live record — picks we actually served</div>
          <div class="strec-big"><b>${esc(stratWL(lv))}</b></div>
          <div class="strec-stats">
            <span class="strec-stat"><i>${stratPct(lv.hit)}</i><em>hit rate</em></span>
            <span class="strec-stat"><i class="${lvPos ? "pos" : "neg"}">${stratRoi(lv.roi)}</i><em>ROI</em></span>
            <span class="strec-stat"><i>${lv.n}</i><em>served &amp; graded</em></span>
          </div>
          <div class="strec-sub">${since ? `Every pick served since ${esc(since)}, when the current pick rule went live` : "Every pick we've actually served"} — graded against the final at the real price. Backtested history is kept separate, below.</div>
        </div>
        ${combinedBlock}
        ${last7Strip}
        <div class="strec-card">
          <div class="strec-ch">Record by star tier</div>
          <div class="strec-csub">A star is a conviction band. It only means something if the higher tiers win more — so here's each tier, graded.</div>
          <div class="strec-rows">${rows}</div>
          <div class="strec-mixnote">These tiers bucket the <b>combined</b> history above — live and reconstructed together. Read them as a shape check on the star scale, not as a live record.</div>
          ${gatedNote}
        </div>`;
      }
      const roiPos = (ov.roi || 0) >= 0;
      return `
        <div class="strec-hero ${roiPos ? "pos" : "neg"}">
          <div class="strec-k">The picks record</div>
          <div class="strec-big"><b>${bWL(ov)}</b></div>
          <div class="strec-stats">
            <span class="strec-stat"><i>${bPct(ov.hit_rate, 1)}</i><em>hit rate</em></span>
            <span class="strec-stat"><i class="${roiPos ? "pos" : "neg"}">${bRoi(ov.roi)}</i><em>ROI</em></span>
            <span class="strec-stat"><i>${ov.n || 0}</i><em>graded</em></span>
          </div>
          <div class="strec-sub">Pregame totals, graded in public at the real price — win or lose, nothing hidden.</div>
        </div>
        ${last7Strip}
        <div class="strec-card">
          <div class="strec-ch">Record by star tier</div>
          <div class="strec-csub">A star is a conviction band. It only means something if the higher tiers win more — so here's each tier, graded.</div>
          <div class="strec-rows">${rows}</div>
          ${gatedNote}
        </div>`;
    }

    // ---- a compact list card for one game (historical OR live/upcoming) ----
    function betaGameListCard(g: any) {
      const best = bestBetaCell(g);
      const fin = g.final || {};
      const hasFinal = fin.home_runs != null && fin.away_runs != null;
      const fp = firstPitchTs({ start_ts: g.first_pitch_utc });
      // VISIBLE-VOID: a postponed game keeps its row — frozen pick + neutral VOID
      // chip, "Postponed" where the final score would be. Counted in no record.
      const isPpd = String(g.status || "") === "postponed";
      const when = isPpd
        ? "Postponed — pick void, no action"
        : hasFinal
        ? `Final ${teamShort(g.away)} ${fin.away_runs} – ${fin.home_runs} ${teamShort(g.home)}`
        : fp ? new Date(fp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "upcoming";
      const dd = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      const vp = isPpd && g.pick && g.pick.side ? g.pick : null;
      const sideTxt = best ? `${/over/i.test(String(best.side)) ? "OVER" : "UNDER"} ${best.line != null ? lineStr(best.line) : ""}`.trim()
        : vp ? `${/over/i.test(String(vp.side)) ? "OVER" : "UNDER"} ${vp.line != null ? lineStr(vp.line) : ""}`.trim() : "";
      const badge = isPpd
        ? (vp
          ? `<span class="bg-pick voidppd">${bStars(vp.stars)}<span class="bg-side">${esc(sideTxt)}${vp.price != null ? ` ${fmtOdds(vp.price)}` : ""}</span><span class="bg-res void">PPD</span></span>`
          : `<span class="bg-nopick">postponed</span>`)
        : best
        ? `<span class="bg-pick ${best.result || "open"}">${bStars(best.stars)}<span class="bg-side">${esc(sideTxt)}${best.price != null ? ` ${fmtOdds(best.price)}` : ""}</span>${best.result && best.result !== "pass" ? `<span class="bg-res ${best.result}">${best.result === "win" ? "✓" : best.result === "loss" ? "✗" : "P"}</span>` : ""}</span>`
        : `<span class="bg-nopick">${hasFinal ? "pass" : "no pick"}</span>`;
      return `<button class="beta-gcard" data-bgid="${esc(g.game_id)}">
        <span class="bg-mu"><b>${esc(teamShort(g.away))}</b> @ <b>${esc(teamShort(g.home))}</b></span>
        <span class="bg-meta">${esc(dd)} · ${esc(when)}</span>
        ${badge}
      </button>`;
    }
    // ---- the LIVE "Today" board: today's + tomorrow's games, each with its single pick ----
    function betaTodayBoard(lv: any) {
      if (!lv) return `<div class="bc-empty">The live board didn't load — it refreshes through the day; try again shortly.</div>`;
      const games = (lv.games || []) as any[];
      const bc = lv.board_census || {};
      const ov = (lv.record || {}).overall || {};
      // Quote the LIVE-SERVED record here too — "season record" off record.overall would be
      // mostly reconstruction and backtest.
      const lvHr = headlineStrategyRecord(lv) || headlineStrategyRecord(betaData);
      const lvB = lvHr && lvHr.live;
      const recBit = lvB
        ? `<div class="beta-liverec">Live-served record${lvHr.activation ? ` since ${esc(stratDateTxt(lvHr.activation) || lvHr.activation)}` : ""}: <b>${esc(stratWL(lvB))}</b>${lvB.hit != null ? ` · ${stratPct(lvB.hit)}` : ""}${lvB.roi != null ? ` · ${stratRoi(lvB.roi)} ROI` : ""}</div>`
        : ov.n
        ? `<div class="beta-liverec">Season record: <b>${bWL(ov)}</b>${ov.hit_rate != null ? ` · ${bPct(ov.hit_rate, 1)}` : ""}${ov.roi != null ? ` · ${bRoi(ov.roi)} ROI` : ""}</div>`
        : `<div class="beta-liverec dim">Picks grade as games finish — results land here the same night.</div>`;
      // Today's picks (the actionable ones), or an honest no-play note.
      const todayPicks = games.filter((g: any) => bestBetaCell(g)).sort((a: any, b: any) => ((bestBetaCell(b) || {}).score || 0) - ((bestBetaCell(a) || {}).score || 0));
      const cvSlate = todayPicks.length
        ? `<div class="beta-cvslate">${todayPicks.slice(0, 12).map((g: any) => { const p = bestBetaCell(g); const side = `${/over/i.test(String(p.side)) ? "OVER" : "UNDER"} ${p.line != null ? lineStr(p.line) : ""}`.trim(); return `
            <div class="cvp"><span class="cvp-mu">${esc(teamShort(g.away || ""))} @ ${esc(teamShort(g.home || ""))}</span>
              ${bStars(p.stars)}<span class="cvp-side">${esc(side)}${p.price != null ? ` <i>${fmtOdds(p.price)}</i>` : ""}</span></div>`; }).join("")}</div>`
        : `<div class="beta-cvslate none">No pick today — the board only fires when our number and the price both clear.</div>`;
      const upd = lv.generated_utc ? new Date(lv.generated_utc).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
      const byDate: any = {};
      games.forEach((g) => { (byDate[g.date] = byDate[g.date] || []).push(g); });
      const dates = Object.keys(byDate).sort();
      const sections = dates.map((d0) => {
        const dd = new Date(d0 + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        // game-time order (Leon): every day view lists games by first pitch ascending
        const list = byDate[d0].slice().sort((a: any, b: any) => String(a.first_pitch_utc || "").localeCompare(String(b.first_pitch_utc || "")));
        return `<div class="beta-listhead"><span>${esc(dd)}</span></div><div class="beta-glist">${list.map(betaGameListCard).join("")}</div>`;
      }).join("") || `<div class="bc-empty">No games on the live board yet — tomorrow fills in when books post their lines.</div>`;
      return `
        <div class="beta-card livehead">
          <div class="bcard-h">Today's totals — live</div>
          <div class="bcard-sub">Picks firm up as game time nears — a game without one yet may earn one later.${upd ? ` Updated ${esc(upd)}.` : ""}</div>
          ${cvSlate}
          ${recBit}
          <div class="bcard-foot">${bc.n_picks || 0} pick${(bc.n_picks || 0) === 1 ? "" : "s"} across ${bc.n_games || games.length} games so far.</div>
        </div>
        ${sections}`;
    }

    async function renderBeta() {
      const view = $("beta-view");
      if (!view) return;
      if (!betaData) view.innerHTML = `<div class="beta-wrap"><div class="beta-skel">Loading the picks…</div></div>`;
      let d: any, lv: any = null;
      try { d = await loadBeta(); } catch { view.innerHTML = `<div class="beta-wrap"><div class="state"><div class="big">Pick data unavailable</div><div class="sm">Couldn't load the model feed — it refreshes through the day; try again shortly.</div></div></div>`; return; }
      try { lv = await loadBetaLive(); } catch { lv = null; }
      const games = (d.games || []) as any[];
      const list = (betaOnlyTakes ? games.filter((g) => betaTakeCount(g) > 0) : games)
        .slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
      const shown = list.slice(0, betaShown);
      const liveTakes = lv ? ((lv.board_census || {}).n_takes || 0) : 0;
      view.innerHTML = `
        <div class="beta-wrap">
          <div class="beta-masthead">
            <div class="bm-kick">DiamondEdge <span class="bm-badge">Pregame Totals</span></div>
            <h2 class="bm-h">Totals picks, graded in the open</h2>
            <p class="bm-sub">One market, done right: pregame over/unders — price-aware, +EV-gated, star-rated. One DiamondEdge Pick per game, graded at the real price, with the record accruing in public.</p>
          </div>
          ${betaFrame(d)}
          <div class="beta-tabs" role="tablist">
            <button class="beta-tab ${betaTab === "today" ? "on" : ""}" data-btab="today">Today${liveTakes ? ` <span class="bt-count">${liveTakes}</span>` : ""}</button>
            <button class="beta-tab ${betaTab === "record" ? "on" : ""}" data-btab="record">Record</button>
            <button class="beta-tab ${betaTab === "games" ? "on" : ""}" data-btab="games">Games <span class="bt-count">${(betaOnlyTakes ? games.filter((g) => betaTakeCount(g) > 0).length : games.length).toLocaleString()}</span></button>
          </div>
          <div class="beta-pane" style="display:${betaTab === "today" ? "block" : "none"}">${betaTodayBoard(lv)}</div>
          <div class="beta-pane" style="display:${betaTab === "record" ? "block" : "none"}">${betaDashboard(d)}</div>
          <div class="beta-pane" style="display:${betaTab === "games" ? "block" : "none"}">
            <div class="beta-listhead"><span>${betaOnlyTakes ? "Games with a DiamondEdge Pick" : "Every graded game"}</span><button class="beta-togg" id="beta-togg">${betaOnlyTakes ? "Show all games" : "Only games with picks"}</button></div>
            <div class="beta-glist">${shown.map(betaGameListCard).join("")}</div>
            ${list.length > betaShown ? `<button class="beta-more" id="beta-more">Show more (${(list.length - betaShown).toLocaleString()} left)</button>` : ""}
          </div>
        </div>`;
      view.querySelectorAll(".beta-tab").forEach((b: any) => (b.onclick = () => { betaTab = b.dataset.btab; renderBeta(); }));
      const tg = $("beta-togg"); if (tg) tg.onclick = () => { betaOnlyTakes = !betaOnlyTakes; betaShown = 24; renderBeta(); };
      const mo = $("beta-more"); if (mo) mo.onclick = () => { betaShown += 36; renderBeta(); requestAnimationFrame(() => { const el = $("beta-more"); if (el) el.scrollIntoView({ block: "center" }); }); };
      // card clicks resolve against BOTH feeds (live board first, then the historical walk)
      betaBuiltAt = Date.now();
      view.querySelectorAll(".beta-gcard[data-bgid]").forEach((b: any) => (b.onclick = () => {
        const gid = b.dataset.bgid;
        const bg = (lv && (lv.games || []).find((g: any) => String(g.game_id) === gid)) || (betaData.games || []).find((g: any) => String(g.game_id) === gid);
        openBetaGame(bg);
      }));
      animateCounters(view);
    }

    // ---- the per-game pick card: the one DiamondEdge Pick (or the honest pass + its reason) ----
    function openBetaGame(g: any) {
      if (!g) return;
      const fin = g.final || {};
      const dd = g.date ? new Date(g.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
      const p = g.pick || null;
      const isPick = p && String(p.status || "").toUpperCase() === "PICK";
      // VISIBLE-VOID: a postponed game's sheet shows the frozen pick with a
      // neutral VOID chip — the pick never changes and never grades.
      const isVoid = p && String(p.status || "").toUpperCase() === "VOID";
      const side = (isPick || (isVoid && p.side)) ? `${/over/i.test(String(p.side)) ? "OVER" : "UNDER"} ${p.line != null ? lineStr(p.line) : ""}`.trim() : "";
      const resTag = isPick && p.result && p.result !== "push"
        ? `<span class="bcell-res ${p.result}">${p.result === "win" ? "WIN" : "LOSS"}</span>`
        : isPick && p.result === "push" ? `<span class="bcell-res push">PUSH</span>` : "";
      const scoreChip = p && p.score != null ? `<i class="pgrade">${Number(p.score).toFixed(2)}</i>` : "";
      const pickCard = isVoid
        ? `<div class="bcell voidppd" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:14px 16px">
             ${p.side ? `<span class="bcell-stars">${bStars(p.stars)}</span>${scoreChip}<span class="bcell-side"><b>${esc(side)}</b>${p.price != null ? ` ${fmtOdds(p.price)}` : ""}</span>` : ""}<span class="void-chip">VOID — no action</span>
           </div>
           <div class="bgrid-legend">${esc((g.postponed && g.postponed.note) || "Postponed — pick void, no action")} The pick stays exactly as served; it counts in no record.</div>`
        : isPick
        ? `<div class="bcell take s${p.stars} ${p.result || ""}" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:14px 16px">
             <span class="bcell-stars">${bStars(p.stars)}</span>${scoreChip}
             <span class="bcell-side"><b>${esc(side)}</b>${p.price != null ? ` ${fmtOdds(p.price)}` : ""}</span>${resTag}
           </div>
           ${p.vegas_line != null ? `<div class="bgrid-legend">vs Vegas O/U ${esc(lineStr(p.vegas_line))}${p.lead_time ? ` · locked at ${esc(p.lead_time)}` : ""}.</div>` : ""}`
        : `<div class="bcell pass" style="padding:14px 16px"><span class="bcell-pass">PASS</span> <span class="bpass-why">${esc(p ? plainPassReason(v4ToPlay(g, p).v4pass) : "No pick on this game.")}</span></div>`;
      const html = `
        <div class="gamepage betapage" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(g.away)} at ${esc(g.home)}">
          <div class="gp-head">
            <button class="gp-back" id="gp-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <button class="gp-brand" id="gp-brand" aria-label="DiamondEdge — home"><span class="diamond" aria-hidden="true"></span><span class="gp-brand-tx">Diamond<b>Edge</b></span></button>
            <div class="hspacer"></div>
          </div>
          <div class="gp-body" id="gp-body">
            <div class="bgame-hero">
              <div class="bgh-mu"><b>${esc(teamShort(g.away))}</b> @ <b>${esc(teamShort(g.home))}</b></div>
              <div class="bgh-fin">${isVoid || String(g.status || "") === "postponed"
                ? `<span class="ppd-tag">POSTPONED</span> · never played as scheduled`
                : fin.away_runs != null
                ? `Final · ${esc(teamShort(g.away))} <b>${fin.away_runs}</b> – <b>${fin.home_runs}</b> ${esc(teamShort(g.home))}`
                : (() => { const fp = firstPitchTs({ start_ts: g.first_pitch_utc }); return fp ? `First pitch ${esc(new Date(fp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }))} · the pick firms up as game time nears` : "Upcoming"; })()}</div>
              <div class="bgh-date">${esc(dd)} · full game</div>
            </div>
            <div class="bgrid-card">
              <div class="bgrid-h">The DiamondEdge Pick</div>
              ${pickCard}
            </div>
            ${strategiesPanel(g)}
          </div>
        </div>`;
      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      requestAnimationFrame(() => { const p2 = $("gamepage"); if (p2) p2.classList.add("in"); });
      $("gp-back").onclick = () => closeDetail();
      const gpb = $("gp-brand"); if (gpb) gpb.onclick = () => { closeDetail(); switchTab("today"); };
    }

    // ===================== RESEARCH — "THE LAB" (public roadmap of every idea we test) =====================
    // Every idea gets a card: what it looks to do, latest progress, timeline, status. Most die.
    // The survivors earn their stars. Nulls are published on purpose — that's the trust story.
    // Feed: Supabase slate_snapshots key 'research_roadmap' (fresh) → bundled static
    // /research_roadmap.json (fallback) → background self-heal (same recipe as loadBeta).
    let roadmapData: any = null;
    async function loadRoadmap() {
      if (roadmapData) return roadmapData;
      let fresh: any = null;
      try { fresh = await Promise.race([snap("research_roadmap"), new Promise((r) => setTimeout(() => r(null), 4000))]); } catch {}
      let usedFallback = false;
      if (!fresh || !Array.isArray(fresh.items)) {
        usedFallback = true;
        const r = await fetch(`/research_roadmap.json?v=${new Date().toISOString().slice(0, 10)}`, { cache: "force-cache" });
        if (!r.ok) throw new Error("roadmap fetch " + r.status);
        fresh = await r.json();
      }
      if (!fresh || !Array.isArray(fresh.items)) throw new Error("roadmap payload malformed");
      roadmapData = fresh;
      // SELF-HEAL: if we had to fall back to the bundled static file (Supabase slow/missing),
      // keep retrying in the background and swap + re-render the moment the fresh copy lands.
      if (usedFallback) {
        (async () => {
          for (let a = 0; a < 6; a++) {
            await new Promise((r) => setTimeout(r, 3000));
            try {
              const sb: any = await snap("research_roadmap");
              if (sb && Array.isArray(sb.items) && sb.generated_utc !== fresh.generated_utc) {
                roadmapData = sb;
                if (tab === "research") { try { renderResearch(); } catch {} }
                return;
              }
            } catch {}
          }
        })();
      }
      return roadmapData;
    }
    // status → group. Unknowns land in "queued" so a new backend status can never crash the page.
    const LAB_GROUP: any = { live_testing: "fire", building: "fire", piloting: "fire", shipped: "shipped", accruing: "accruing", queued: "queued", closed_null: "grave" };
    const LAB_STATUS_LABEL: any = { live_testing: "Live testing", building: "Building", piloting: "Piloting", shipped: "Shipped", accruing: "Accruing data", queued: "Queued", closed_null: "Door closed" };
    const labDate = (s: any) => {
      const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return String(s || "");
      const d = new Date(`${m[0]}T12:00:00`);
      return isNaN(d.getTime()) ? String(s) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const labEta = (e: any) => {
      const s = String(e || "").trim();
      if (!s || s === "done" || s === "closed") return "";
      return /^eta/i.test(s) ? s : `ETA ${s}`;
    };
    const labPct = (v: any) => { const n = Number(v); return isFinite(n) ? Math.max(0, Math.min(100, n)) : null; };
    // ---- Masthead freshness line: "Live status · updated Xm ago" from payload.generated_utc
    // (NOT slate_snapshots.updated_at — that column is unreliable). Ticks client-side every
    // 60s; past 2h it flips to hours in a muted warn tone (.stale).
    const labAgoMin = (iso: any) => { const t = new Date(String(iso || "")).getTime(); return isFinite(t) ? Math.max(0, Math.round((Date.now() - t) / 60000)) : null; };
    function labFreshText(iso: any) {
      const m = labAgoMin(iso);
      if (m == null) return "Live status";
      if (m < 1) return "Live status · updated just now";
      if (m < 120) return `Live status · updated ${m}m ago`;
      return `Live status · updated ${Math.round(m / 60)}h ago`;
    }
    let labFreshTimer: any = null;
    function tickLabFresh() {
      const el = $("lab-fresh");
      if (!el) return; // Lab not mounted — cheap no-op, the interval just idles
      const iso = el.getAttribute("data-ts");
      const m = labAgoMin(iso);
      el.classList.toggle("stale", m != null && m >= 120);
      const tx = el.querySelector(".lab-fresh-tx");
      if (tx) tx.textContent = labFreshText(iso);
    }
    // one expandable card — the face carries status/tagline/progress/latest; `detail` opens on tap
    function labCard(it: any) {
      const st = String(it.status || "queued");
      const grp = LAB_GROUP[st] || "queued";
      const pct = labPct(it.progress_pct);
      const eta = labEta(it.eta);
      const started = it.started ? labDate(it.started) : "";
      const endLab = grp === "shipped" ? (it.eta === "done" ? "shipped" : labDate(it.eta) || "shipped")
        : grp === "grave" ? "closed"
        : eta ? eta.replace(/^ETA /, "") : "in progress";
      const chip = grp === "shipped" ? `<span class="lab-chip shipped">✓ Shipped</span>`
        : grp === "accruing" ? `<span class="lab-chip accruing"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10M7 21h10M8 3c0 4 3 5.2 4 6 1-.8 4-2 4-6M8 21c0-4 3-5.2 4-6 1 .8 4 2 4 6"/></svg>Accruing</span>`
        : grp === "grave" ? `<span class="lab-chip grave">Door closed</span>`
        : grp === "queued" ? `<span class="lab-chip queued">Queued</span>`
        : `<span class="lab-chip fire"><i class="lab-dot" aria-hidden="true"></i>${esc(LAB_STATUS_LABEL[st] || "In the fire")}</span>`;
      // timeline: started → eta on one thin line; the fill doubles as the progress bar
      const track = started || endLab ? `
        <div class="lab-time">
          <span class="lab-t0">${esc(started || "—")}</span>
          <span class="lab-track"><i style="width:${pct != null ? pct : (grp === "shipped" || grp === "grave" ? 100 : 8)}%"></i></span>
          <span class="lab-t1">${esc(endLab)}</span>
        </div>` : "";
      const latest = it.latest ? `<div class="lab-latest"><b class="lab-latest-k">Latest</b> <span class="lab-latest-tx">${esc(it.latest)}</span></div>` : "";
      // shipped's earned line / the graveyard's killing number — the honest one-liner up front
      const result = it.result && (grp === "shipped" || grp === "grave")
        ? `<div class="lab-result ${grp}">${esc(it.result)}</div>` : "";
      const detail = it.detail ? `<div class="lab-detail">${esc(it.detail)}</div>` : `<div class="lab-detail dim">More detail lands as this one progresses.</div>`;
      return `<details class="lab-card ${grp}">
        <summary>
          <div class="lab-top">${chip}${eta && grp === "fire" ? `<span class="lab-eta">${esc(eta)}</span>` : ""}${it.category ? `<span class="lab-cat">${esc(it.category)}</span>` : ""}<span class="lab-caret" aria-hidden="true">›</span></div>
          <div class="lab-title">${esc(it.title || it.id || "Untitled")}</div>
          ${it.tagline ? `<div class="lab-tagline">${esc(it.tagline)}</div>` : ""}
          ${result}
          ${latest}
          ${track}
        </summary>
        ${detail}
      </details>`;
    }
    function labSection(kicker: string, sub: string, cards: string[], cls = "") {
      if (!cards.length) return "";
      return `<section class="lab-sect ${cls}">
        <div class="lab-sect-head">${cls === "fire" ? `<i class="lab-sect-dot" aria-hidden="true"></i>` : ""}<span class="lab-sect-k">${esc(kicker)}</span><span class="lab-sect-n">${cards.length}</span></div>
        ${sub ? `<p class="lab-sect-sub">${esc(sub)}</p>` : ""}
        <div class="lab-grid">${cards.join("")}</div>
      </section>`;
    }
    async function renderResearch() {
      const view = $("research-view");
      if (!view) return;
      if (!roadmapData) view.innerHTML = `<div class="lab-wrap"><div class="beta-skel">Loading the lab…</div></div>`;
      let d: any;
      try { d = await loadRoadmap(); } catch {
        view.innerHTML = `<div class="lab-wrap"><div class="state"><div class="big">The lab is dark</div><div class="sm">Couldn't load the research roadmap — try again shortly.</div></div></div>`;
        return;
      }
      const items = (Array.isArray(d.items) ? d.items : []) as any[];
      const by = (grp: string) => items.filter((it: any) => (LAB_GROUP[String(it && it.status)] || "queued") === grp);
      const fire = by("fire"), shipped = by("shipped"), accruing = by("accruing"), queued = by("queued"), grave = by("grave");
      // count chips — derived from the items themselves; the served summary is only a fallback
      const sum = (d.summary && typeof d.summary === "object") ? d.summary : {};
      const nShip = shipped.length || Number(sum.shipped) || 0;
      const nFire = fire.length || Number(sum.testing) || 0;
      const nAcc = accruing.length || Number(sum.accruing) || 0;
      const nGrave = grave.length || Number(sum.closed) || 0;
      const chips = [
        nShip ? `<span class="lab-count shipped">${nShip} shipped</span>` : "",
        nFire ? `<span class="lab-count fire">${nFire} in the fire</span>` : "",
        nAcc ? `<span class="lab-count accruing">${nAcc} accruing</span>` : "",
        queued.length ? `<span class="lab-count queued">${queued.length} queued</span>` : "",
        nGrave ? `<span class="lab-count grave">${nGrave} closed honest</span>` : "",
      ].filter(Boolean).join("");
      const upd = d.generated_utc ? new Date(d.generated_utc).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
      const stale0 = (() => { const m = labAgoMin(d.generated_utc); return m != null && m >= 120; })();
      const fresh = d.generated_utc
        ? `<div class="lab-fresh${stale0 ? " stale" : ""}" id="lab-fresh" data-ts="${esc(d.generated_utc)}"><i class="lab-fresh-dot" aria-hidden="true"></i><span class="lab-fresh-tx">${esc(labFreshText(d.generated_utc))}</span></div>`
        : "";
      view.innerHTML = `
        <div class="lab-wrap">
          <div class="ix-masthead">
            <div class="ix-eyebrow">DiamondEdge · The Lab</div>
            <h2 class="ix-mast-h">Every idea we test, in public</h2>
            <p class="ix-mast-sub">This is the whole roadmap — every model, data build and experiment, from first spark to graded verdict. Most die. The survivors earn their stars.</p>
            ${chips ? `<div class="lab-counts">${chips}</div>` : ""}
            ${fresh}
          </div>
          ${items.length ? "" : `<div class="state"><div class="big">Nothing on the bench yet</div><div class="sm">The roadmap fills in as experiments launch.</div></div>`}
          ${labSection("In the fire", "Being built or tested right now — the ideas fighting for a spot on the board.", fire.map(labCard), "fire")}
          ${labSection("Shipped", "Survived testing and live on the site — each with the result that earned it.", shipped.map(labCard), "shipped")}
          ${labSection("Accruing data", "Nothing to test yet — these are quietly banking the history they need first.", accruing.map(labCard), "accruing")}
          ${labSection("On deck", "Queued behind the current burn — next into the fire.", queued.map(labCard), "queued")}
          ${labSection("The graveyard", "Ideas we killed with our own numbers. We publish our nulls — that's why you can trust the picks.", grave.map(labCard), "grave")}
          ${upd ? `<div class="refnote">Roadmap updated ${esc(upd)} · statuses move as experiments run.</div>` : ""}
        </div>`;
      // Freshness heartbeat: one shared 60s interval, re-used across re-renders (data-ts is
      // read from the DOM each tick, so a self-healed payload swap keeps it honest).
      if (!labFreshTimer) labFreshTimer = setInterval(() => { try { tickLabFresh(); } catch {} }, 60000);
    }

    const NAV_LABEL: any = { today: "News", games: "Games", results: "Insights", research: "The Lab", beta: "Totals", settings: "Settings" };
    function renderShell() {
      // Primary nav = the destinations at EVERY width (the top bar is the nav on mobile too now
      // — the bottom nav is retired). The v4 model is now the DEFAULT pick everywhere; its
      // deep-dive view (record + every pick) is reachable from Games, not a nav tab.
      // ALL-IN TOTALS: the pick IS the product — no separate model tab. The record lives in
      // Insights; the wall-by-wall explorer stays reachable from Insights links only.
      const primaryTabs = ["today", "games", "results"];
      // ONE unified STICKY header (brand + account + ticker) — primary nav is now the
      // iOS-style FLOATING GLASS DOCK at the bottom (the golf-app pattern): a dark pill
      // bar, icons per tab, the active tab expands to show its label behind a gold pill.
      root.innerHTML = `
        <header id="app-header">
          <div class="hbar">
            <div class="brand" id="brand">
              <div class="diamond"></div>
              <div class="brand-tx"><h1>Diamond<b>Edge</b></h1><div class="tag">News · Games · Insights</div></div>
            </div>
            <div class="hspacer"></div>
            <div class="navright">
              ${accountButton()}
            </div>
          </div>
          <div class="ticker" id="ticker" aria-label="Live scores"></div>
        </header>
        <main>
          <div id="today-view" style="display:${tab === "today" ? "block" : "none"}"></div>
          <div id="games-view" style="display:${tab === "games" ? "block" : "none"}"></div>
          <div id="results-view" style="display:none"></div>
          <div id="research-view" style="display:none"></div>
          <div id="beta-view" style="display:none"></div>
          <div id="settings-view" style="display:none"></div>
          <div id="upgrade-view" style="display:none"></div>
          <div id="account-view" style="display:none"></div>
        </main>
        <nav class="dockwrap" aria-label="Primary"><div class="dock" id="dock"></div></nav>`;
      renderDock();
      $("brand").onclick = () => switchTab("today");
      const ab = $("acctbtn"); if (ab) ab.onclick = () => switchTab("account");
      // (dock item clicks are wired inside renderDock)
      const hdr0 = $("app-header"); if (hdr0) document.documentElement.style.setProperty("--hdr-h", hdr0.offsetHeight + "px");
      bindHeaderScroll();
      renderTicker();
    }
    // ---- FLOATING GLASS DOCK (iOS-style, the golf-app pattern) ----
    // Dark glass pill fixed above the safe area; icons per tab; the ACTIVE tab expands to
    // show its label behind a glowing gold pill. Re-rendered on every switchTab.
    const DOCK_ICONS: any = {
      today: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z"/><path d="M19 9h1.5v9.5a1.5 1.5 0 0 1-3 0"/><path d="M8 9h5M8 13h7M8 17h4"/></svg>`,
      games: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="5.5" y="5.5" width="13" height="13" rx="2.5" transform="rotate(45 12 12)"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>`,
      results: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5 20V13M12 20V6M19 20v-9"/></svg>`,
      research: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 3h5M10.2 3v6.2l-5.3 9A1.9 1.9 0 0 0 6.5 21h11a1.9 1.9 0 0 0 1.6-2.8l-5.3-9V3"/><path d="M7.2 15.4h9.6"/></svg>`,
    };
    function renderDock() {
      const el = $("dock"); if (!el) return;
      el.innerHTML = ["today", "games", "results", "research"].map((t) => {
        const on = tab === t;
        return `<button class="dock-item${on ? " on" : ""}" data-tab="${t}" aria-label="${NAV_LABEL[t]}"${on ? ' aria-current="page"' : ""}>
          ${on ? `<span class="dock-pill" aria-hidden="true"></span>` : ""}
          <span class="dock-ic">${DOCK_ICONS[t] || ""}</span>
          ${on ? `<span class="dock-lab">${NAV_LABEL[t]}</span>` : ""}
        </button>`;
      }).join("");
      el.querySelectorAll("[data-tab]").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
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
      // The live ticker rides the News homepage only — the Games tab has its own date/league chrome.
      if (tab === "games") { el.style.display = "none"; return; }
      // dedupe by game_id (belt-and-suspenders — a game must never appear twice)
      const seenT = new Set<string>();
      const items = tickerItems().filter((g: any) => { const id = String(g.game_id); if (seenT.has(id)) return false; seenT.add(id); return true; });
      if (!items.length) { el.style.display = "none"; return; }
      el.style.display = "";
      const row = items.map(tickerItemHtml).join(`<span class="tk-dot">·</span>`);
      // Render ONE row first; only clone it for the marquee loop when the content actually
      // OVERFLOWS the ticker — a short row would otherwise show visible duplicates.
      el.innerHTML = `<div class="tk-track still" id="tk-track"><span class="tk-seq" id="tk-seq">${row}</span></div>`;
      el.querySelectorAll(".tk-item").forEach((b: any) => (b.onclick = () => { const g = gameById(b.dataset.gid); if (g) openDetail(g); }));
      // Clone-for-marquee only once the row PROVABLY overflows. Measure twice — right away
      // and again after fonts/layout settle (the first paint can under-measure).
      const maybeLoop = () => {
        const track = $("tk-track"), seq = $("tk-seq");
        if (!track || !seq || REDUCE) return;
        if (track.querySelectorAll(".tk-seq").length > 1) return; // already looping
        if (seq.scrollWidth > el.clientWidth + 12) {
          seq.insertAdjacentHTML("afterend", `<span class="tk-seq" aria-hidden="true">${row}</span>`);
          const clone = track.lastElementChild as any;
          if (clone) clone.querySelectorAll(".tk-item").forEach((b: any) => (b.onclick = () => { const g = gameById(b.dataset.gid); if (g) openDetail(g); }));
          track.classList.remove("still");
        }
      };
      requestAnimationFrame(() => {
        maybeLoop();
        // the ticker changes the header height — republish it for the sticky subhead offset
        const h = $("app-header"); if (h) document.documentElement.style.setProperty("--hdr-h", h.offsetHeight + "px");
      });
      setTimeout(maybeLoop, 700);
    }
    // ---- unified sticky header + collapsing behavior on the Games tab (scroll-driven) ----
    // Driven by BOTH a scroll listener (fast) AND IntersectionObserver sentinels (robust —
    // fires even where programmatic scrolls don't dispatch scroll events). Idempotent.
    let headerScrollBound = false;
    function applyHeaderState(y: number) {
      const hdr = $("app-header"); if (!hdr) return;
      // The header stays FULL SIZE at every width — no scroll-condense/shrink. `.scrolled`
      // only adds a frosted backing so content reads under the sticky bar (it does not resize).
      hdr.classList.toggle("scrolled", y > 6);
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
      requestAnimationFrame(() => applyHeaderState(scrollY()));
    }

    function switchTab(t: string) {
      if (t === tab) return;
      tab = t;
      TABS.forEach((k) => { const v = $(k + "-view"); if (v) v.style.display = k === t ? "block" : "none"; });
      renderDock(); // the floating dock is the primary nav — re-render so the gold pill moves
      // PERF: the view flip + tab highlight paint IMMEDIATELY; every heavy render is deferred
      // one frame so switching never feels laggy. rAF is SUSPENDED in hidden/background tabs,
      // so a setTimeout fallback guarantees the render still lands (whichever fires first wins).
      let rendered = false;
      const renderDeferred = () => {
        if (rendered) return;
        rendered = true;
        window.scrollTo(0, 0);
        renderTicker(); // hides on Games, shows (live-only) elsewhere; republishes header height
        if (t === "today") {
          if (!todayFresh) { renderToday(); todayFresh = true; }
          else if (newsMode === "stories" && $("stories")) startStoryTimer(); // resume the deck on return
        }
        if (t === "results" && !$("results-view").innerHTML.trim()) renderResults();
        if (t === "research" && !$("research-view").innerHTML.trim()) renderResearch();
        if (t === "beta" && (Date.now() - betaBuiltAt > 60 * 1000 || !$("beta-view").innerHTML.trim())) renderBeta();
        if (t === "settings") renderSettings();
        if (t === "upgrade") renderUpgrade();
        if (t === "account") renderAccount();
        if (t === "games") setTimeout(() => { positionInk(); positionLens(); recenterStrip(false); }, 30);
      };
      requestAnimationFrame(renderDeferred);
      setTimeout(renderDeferred, 120);
    }

    // ===================== INIT =====================
    (async function init() {
      // Native-shell detection: the Capacitor WebView appends DiamondEdgeNative/1.0 to the
      // UA and injects window.Capacitor; ?native=1 forces it for testing. Suppresses
      // web-only chrome via body.native (CSS).
      const NATIVE = /DiamondEdgeNative/i.test(navigator.userAgent) || !!(window as any).Capacitor || /[?&]native=1/.test(location.search);
      if (NATIVE) document.body.classList.add("native");
      bindDeskTaps(); // one capture-phase delegate: any [data-an] tap opens the analyst card
      renderShell();
      renderScoresChrome();
      renderToday(); // skeleton until the payload lands
      // V4 = the default pick source: start both feeds NOW; re-render the pick surfaces
      // the moment they land so every game flips from a placeholder PASS to its real pick.
      Promise.allSettled([loadBetaLive(), loadBeta()]).then(() => {
        todayFresh = false;
        if (tab === "today") { renderToday(); todayFresh = true; }
        if ($("slate-body")) renderSlate(true);
      });
      // keep the live pick feed fresh: re-fetch every 5 min while the tab is visible
      setInterval(() => {
        if (document.hidden) return;
        const before = betaLiveData && betaLiveData.generated_utc;
        loadBetaLive().then((lv: any) => {
          if (lv && lv.generated_utc !== before) {
            todayFresh = false;
            if (tab === "today") { renderToday(); todayFresh = true; }
            if ($("slate-body")) renderSlate(true);
          }
        }).catch(() => {});
      }, 5 * 60 * 1000);
      try {
        await loadIndex();
        payload = await loadDay(curDate);
        dayLoading = false;
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
      } catch {
        // Boot data load failed (offline / Supabase blip): don't hang on the skeleton. Show a
        // retry state; the pollers set up below keep trying and replace it on recovery.
        dayLoading = false;
        renderLoadError();
      }
      // ---- SMART SILENT AUTO-REFRESH (no pull-to-refresh, no spinners on loaded content) ----
      // Tiered by cost + volatility, all paused while the tab is hidden:
      //   · live_scores (tiny)   → every ~50s while a game is live/near-start
      //   · live_detail (box)    → every ~40s ONLY while a live game's detail page is open
      //   · pregame_picks (big)  → every ~4 min, applied only when generated_at advances
      setInterval(pollLiveScores, 50 * 1000);
      setInterval(() => { if (detail && detail.game_id != null) pollLiveDetail(); }, 40 * 1000);
      setInterval(pollPregame, 4 * 60 * 1000);
      // resume with one immediate fetch on focus; pausing is handled inside each poller.
      document.addEventListener("visibilitychange", () => { if (!document.hidden) {
        pollLiveScores(); pollPregame(); if (detail) pollLiveDetail();
        // Reopening the app after it sat in the background is the #1 way people saw a stale
        // board ("no picks / old news"). Force the pick + history feeds fresh and re-render.
        betaLiveAt = 0; betaData = null;
        loadBetaLive().then(() => { try { if (tab === "today") renderToday(); else if (tab === "games") renderSlate(true); else if (tab === "beta") renderBeta(); } catch {} }).catch(() => {});
      } });
      window.addEventListener("focus", () => { pollLiveScores(); });
      pollLiveScores();
      loadPitchers().then((d: any) => { if (d) { try { renderSlate(true); } catch {} } }); // ERAs onto tiles once the feed lands
      loadTeams().then((d: any) => { if (d) { try { renderSlate(true); } catch {} } }); // team records + streaks onto tiles (degrades if the feed is absent)
      loadBetaLive().catch(() => {}); // warm the pick feed at boot — tiles are v4-only now, this is their source
      // warm the historical payload too so any prior day's record chip (by_date_record) populates
      loadBeta().then(() => { try { const m = $("meta-area"); if (m) m.innerHTML = metaRow(); } catch {} }).catch(() => {});
      // ── PULL-TO-REFRESH (mobile): drag down from the very top → full refresh ──
      // A hard reload re-fetches every feed (and any new deploy). Indicator shows pull
      // progress; fires past 70px. Desktop unaffected (touch-only).
      (() => {
        let sy = 0, pulling = false, armed = false;
        const bar = document.createElement("div");
        bar.className = "ptr-bar"; bar.innerHTML = `<span class="ptr-ic">↻</span><span class="ptr-t">Pull to refresh</span>`;
        document.body.appendChild(bar);
        const scroller = () => document.scrollingElement || document.documentElement;
        document.addEventListener("touchstart", (e: any) => {
          if (scroller().scrollTop <= 0 && !detail) { sy = e.touches[0].clientY; pulling = true; armed = false; }
        }, { passive: true });
        document.addEventListener("touchmove", (e: any) => {
          if (!pulling) return;
          const dy = e.touches[0].clientY - sy;
          if (dy <= 0 || scroller().scrollTop > 0) { bar.style.transform = ""; bar.classList.remove("show", "go"); armed = false; return; }
          const pull = Math.min(110, dy * 0.55);
          bar.classList.add("show");
          bar.style.transform = `translateY(${pull}px)`;
          armed = pull >= 70;
          bar.classList.toggle("go", armed);
          (bar.querySelector(".ptr-t") as any).textContent = armed ? "Release to refresh" : "Pull to refresh";
        }, { passive: true });
        document.addEventListener("touchend", () => {
          if (!pulling) return;
          pulling = false;
          if (armed) {
            (bar.querySelector(".ptr-t") as any).textContent = "Refreshing…";
            bar.classList.add("spin");
            setTimeout(() => location.reload(), 180);
          } else { bar.style.transform = ""; bar.classList.remove("show", "go"); }
        }, { passive: true });
      })();
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
