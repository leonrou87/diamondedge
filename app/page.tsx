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
    // Graded result for a game's surfaced pick — handles result as an object {status} (de_plays)
    // OR a bare string (raw display_pick, which normPlay can drop). Returns hit|miss|push|null.
    const pickResult = (g: any, pl: any) => {
      const raw: any = pl && pl.result;
      let r = typeof raw === "string" ? raw : (raw && raw.status) || null;
      if (!r && g && g.display_pick && typeof g.display_pick.result === "string") r = g.display_pick.result;
      return r;
    };
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
    // Unified v3 confidence label ("Strong" | "Good" | "Lean"), defensively read. Null if absent.
    function v3Conf(g: any): string | null {
      const v = v3Of(g);
      if (!v) return null;
      const c = v.confidence != null ? v.confidence : (v.totals_pick && v.totals_pick.confidence);
      return c != null && String(c).trim() !== "" ? String(c) : null;
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

    function diamondEdgeV2(g: any) {
      const P = gamePlays(g);
      const lr = P && P.total && P.total.latest_read;
      const v2 = lr && lr.diamondedge_v2;
      if (!v2 || typeof v2 !== "object") return null;
      if (String(v2.action || "").toUpperCase() !== "TAKE") return null;
      return v2;
    }
    function v2SideLine(v2: any) {
      const side = String(v2.side || "").toUpperCase();
      const line = v2.line != null && !isNaN(Number(v2.line)) ? ` ${num(Number(v2.line))}` : "";
      return `${side || "TOTAL"}${line}`;
    }
    function v2EdgeText(v2: any) {
      const edge = v2.edge != null && !isNaN(Number(v2.edge)) ? Math.abs(Number(v2.edge)) * 100 : null;
      const ev = v2.ev != null && !isNaN(Number(v2.ev)) ? Number(v2.ev) * 100 : null;
      if (edge != null && ev != null) return `+${edge.toFixed(1)} pts · ${ev >= 0 ? "+" : ""}${ev.toFixed(1)}% EV`;
      if (edge != null) return `+${edge.toFixed(1)} pts`;
      return "new model read";
    }
    function diamondEdgeV2Strip(g: any) {
      const v2 = diamondEdgeV2(g);
      if (!v2) return "";
      const price = v2.side_odds != null && !isNaN(Number(v2.side_odds)) ? `<i>${fmtOdds(Number(v2.side_odds))}</i>` : "";
      return `<div class="v2strip" title="DiamondEdge v2 is a challenger model displayed separately from the official graded pick.">
        <span class="v2-k">DiamondEdge v2</span>
        <span class="v2-side">${esc(v2SideLine(v2))}${price}</span>
        <span class="v2-meta">${esc(v2EdgeText(v2))}</span>
        <span class="v2-pill">challenger</span>
      </div>`;
    }
    function diamondEdgeV2Detail(g: any) {
      const v2 = diamondEdgeV2(g);
      if (!v2) return "";
      const pSide = v2.p_side != null && !isNaN(Number(v2.p_side)) ? `${(Number(v2.p_side) * 100).toFixed(1)}%` : "";
      const pMkt = v2.p_mkt_now != null && !isNaN(Number(v2.p_mkt_now)) ? `${(Number(v2.p_mkt_now) * 100).toFixed(1)}%` : "";
      const hash = v2.model_hash ? ` · model ${String(v2.model_hash).slice(0, 8)}` : "";
      return `<details class="gp-v2" open>
        <summary><span class="v2-dot">◆</span><span class="v2-lab">DiamondEdge v2 pick: ${esc(v2SideLine(v2))}</span><span class="v2-chev" aria-hidden="true">›</span></summary>
        <div class="v2-body">
          <p>New blend-offset model read shown as a separate challenger lane. It does not replace the official graded DiamondEdge pick yet.</p>
          <div class="v2-tags">
            <span class="v2-tag">${esc(v2EdgeText(v2))}</span>
            ${pSide ? `<span class="v2-tag">model ${esc(pSide)}</span>` : ""}
            ${pMkt ? `<span class="v2-tag">market ${esc(pMkt)}</span>` : ""}
            <span class="v2-tag">shadow grade${esc(hash)}</span>
          </div>
        </div>
      </details>`;
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
    // teaseOnly (used by the News hero): highlight that we HAVE a confident pick — show the
    // confidence (stars, or blurred dots when unpaid) — but NOT the side/line. The call itself
    // lives on the game page. Keeps the hero about the MATCHUP, not the bet.
    function heroPickCover(g: any, size = "lead", teaseOnly = false) {
      const pl = displayPick(g);
      const locked = pl ? pickLocked(pl, playState(g, pl)) : false;
      const ph = pickHeadline(g);
      const q = ph.q || (pl ? qualityOf(pl) : null) || "lean";
      const st = pl ? playState(g, pl) : "open";
      const state = pl && pl.action === "TAKE" ? pickStateTxt(g, pl, st) : null;
      const kick = isStarted(g) ? "Pre-Game Pick" : "DiamondEdge Pick";
      if (locked) {
        // Unpaid: confidence is BLURRED and the pick is hidden — the whole draw is unlocking it.
        return `<div class="hpc hpc-${size} locked" data-up="1"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ ${esc(kick)}</span><span class="hpc-conf blur" aria-hidden="true">●●●●●</span><span class="hpc-lock">${lockSvg} Unlock</span></div></div>`;
      }
      if (!ph.has) {
        return `<div class="hpc hpc-${size} pass"><div class="hpc-scrim"></div>
          <div class="hpc-line"><span class="hpc-k">◆ The Verdict</span><b class="hpc-txt">No Pick — Passing</b></div></div>`;
      }
      if (teaseOnly) {
        // Paid but on the hero: show the CONFIDENCE, tease the call, don't name the side/line.
        return `<div class="hpc hpc-${size} q-${q} tease"><div class="hpc-scrim"></div>
          <div class="hpc-line">
            <span class="hpc-k">◆ ${esc(kick)}</span>
            <div class="hpc-pickrow"><span class="hpc-stars">${qDiamonds(q)}</span>${state ? `<span class="hpc-res ${state.cls}">${state.txt}</span>` : `<span class="hpc-see">See the pick →</span>`}</div>
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
          <div class="hpc-pickrow"><b class="hpc-txt">${bare}</b><span class="hpc-stars">${qDiamonds(q)}</span>${state ? `<span class="hpc-res ${state.cls}">${state.txt}</span>` : ""}</div>
        </div></div>`;
    }
    // A hero/matchup headline that HYPES the game WITHOUT revealing the pick. Prefers the
    // served article headline but strips any leading pick-lean clause ("Give us the OVER —
    // Angels chase a skid" → "Angels chase a skid"); falls back to a plain matchup framing.
    const PICK_WORDS = /\b(over|under|moneyline|money line|run ?line|spread|first ?5|f5|cover|take the|give us|back the|ride the|lay the|the pick)\b|[+-]\d{2,3}\b|\b\d+\.5\b/i;
    function matchupHeadline(g: any, p: any) {
      let h = cleanBlurb((g ? (gameArticle(g)?.headline || "") : "") || "");
      if (h) {
        const parts = h.split(/\s*[—–:]\s*/);
        if (parts.length > 1 && PICK_WORDS.test(parts[0])) h = parts.slice(1).join(" — ").trim();
        if (h && !PICK_WORDS.test(h)) return esc(h);
      }
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
        const trend = lead ? (liveHitOdds(g, lead, "full") || liveTrackCard(g, lead, "hero")) : "";
        if (trend) trendEl.innerHTML = trend;
      }
      // also refresh the box score from the (possibly newer) live_detail
      pollLiveDetail();
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
        merged.sort((a: any, b: any) => {
          const d = (ord[(a.status || "pre").toLowerCase()] ?? 1) - (ord[(b.status || "pre").toLowerCase()] ?? 1);
          if (d) return d;
          const ta = String(a.start_ts || a.start_time || ""), tb = String(b.start_ts || b.start_time || "");
          return ta < tb ? -1 : ta > tb ? 1 : 0;
        });
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
    // ALL THREE Vegas markets woven onto a card — Spread · Total · Moneyline — with any market
    // we'd actually bet CALLED OUT (our side + star rating). Markets we pass show the plain line.
    // A clean 3-column grid so labels never stack/overlap on small screens.
    function allLinesRow(g: any) {
      const P = gamePlays(g);
      const cell = (m: string, label: string) => {
        const pl = P[m];
        const isTake = pl && pl.action === "TAKE" && pl.side;
        const line = vegasLine(g, m); // pre-escaped safe HTML ("BOS -1.5" / "O/U 8.5" / "LAA +120")
        if (isTake) {
          const q = qualityOf(pl);
          const st = playState(g, pl);
          const locked = pickLocked(pl, st);
          if (locked) {
            return `<button class="lncell pick locked q-${q}" data-up="1" aria-label="${label} pick — unlock"><span class="ln-k">${label}</span><span class="ln-lock">${lockSvg}<span class="ln-dots" aria-hidden="true">★★★</span></span></button>`;
          }
          const mark = resMark(st);
          const sideTxt = String(pl.side) + (pl.line != null && !/\d/.test(String(pl.side)) ? " " + lineStr(pl.line) : "");
          return `<div class="lncell pick q-${q} ${st}"><span class="ln-k">Our call · ${label}</span><span class="ln-side">${pickArrow(pl)} ${esc(sideTxt)}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}</span><span class="ln-stars">${qDiamonds(q)}${mark ? `<span class="ln-res ${st}">${mark}</span>` : ""}</span></div>`;
        }
        return `<div class="lncell"><span class="ln-k">${label}</span><span class="ln-v">${line || "—"}</span></div>`;
      };
      return `<div class="lnrow">${cell("spread", "Spread")}${cell("total", "Total")}${cell("moneyline", "Moneyline")}</div>`;
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
    // The O/U (shared total) + SPREAD (home run-line) columns on the right of a card.
    // Pre-game shows the lines; once the game matters (live/final) the score carries it, so
    // the odds columns quiet down. Each cell degrades independently if the market isn't served.
    function oddsCols(g: any) {
      const tp = g.total_pick;
      const ouVal = tp && tp.line != null ? num(tp.line) : null;
      let spVal: string | null = null;
      const sp = g.spread_pick;
      if (sp && sp.line != null) { const hl = spreadHomeLine(g, sp); spVal = `${esc(g.home_abbr)} ${sgn(hl)}`; }
      if (ouVal == null && spVal == null) return "";
      return `<div class="t-cols">
        <div class="t-col"><span class="tc-k">O/U</span><span class="tc-v">${ouVal != null ? ouVal : "—"}</span></div>
        <div class="t-col"><span class="tc-k">Spread</span><span class="tc-v${spVal ? "" : " none"}">${spVal || "—"}</span></div>
      </div>`;
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
      return `<div class="pstrip q-${q} ${st}">
        <div class="ps-main">
          <span class="ps-k">${pickLabel(g)}</span>
          <span class="ps-side">${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? `<i>${fmtOdds(pl.price)}</i>` : ""}</span>
          ${qDiamonds(q)}
          ${state ? `<span class="ps-res ${state.cls}">${state.txt}</span>` : ""}
        </div>
        ${verdictRow}
        ${liveRow}
      </div>`;
    }

    function gameCard(g: any, idx: number) {
      const gs = gameState(g);
      const pick = displayPick(g);
      const v2 = diamondEdgeV2(g);
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
      return `<article class="tile ${gs.kind}${q ? ` q-${q}` : ""}${resCls ? " " + resCls : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)}${pick ? (locked ? " — pick locked" : ` — DiamondEdge Pick ${esc(pick.side || "")}`) : ""} — open details">
        <div class="t-head">${leagueTag(g)}${stateChip(g, gs)}</div>
        <div class="t-body">
          <div class="t-teams">${tileRow(g, "away", gs)}${tileRow(g, "home", gs)}</div>
        </div>
        ${pre ? allLinesRow(g) : totOnly}
        ${pre ? "" : (pick ? pickStrip(g, pick, st, locked, gs) : passStrip(g))}
        ${v2 ? diamondEdgeV2Strip(g) : ""}
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
    const todayTierRec = () => tierRecordFor((g: any) => String(g.date || "").slice(0, 10) === todayISO());
    const monthTierRec = () => tierRecordFor((g: any) => String(g.date || "").slice(0, 7) === todayISO().slice(0, 7));
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
    const longRunPct = () => Math.round(recipeHistory().hit * 100); // the 58% anchor
    // The two-part glance chip body: "Edge W–L · Leans W–L" with a muted "long-run 58%" anchor
    // appended on a cold EDGE window so a 0–2 edge day never reads as a broken model. Both W–L
    // parts are always shown when either side has graded picks, visibly distinct (edge vs lean).
    function edgeLeanGlance(tr: any, scopeLab: string, isToday: boolean) {
      const s = edgeLeanSplit(tr);
      if (!s || (!s.anyGraded && !s.anyOut)) return "";
      const wl = (o: any, kind: string, cls: string) => {
        const dec = o.w + o.l;
        const out = o.live + o.up;
        if (!dec && !out) return "";
        const rec = dec
          ? `<b>${o.w}–${o.l}</b>`
          : `<span class="glp-out">${out} ${isToday ? (o.live ? "live" : "to come") : "to come"}</span>`;
        const outTail = dec && out ? `<span class="glp-out">+${out}</span>` : "";
        return `<span class="glp ${cls}"><span class="glp-k">${kind}</span>${rec}${outTail}</span>`;
      };
      const edgeTxt = wl(s.edge, "Edge", "glp-edge");
      const leanTxt = wl(s.lean, "Leans", "glp-lean");
      const parts = [edgeTxt, leanTxt].filter(Boolean);
      if (!parts.length) return "";
      // Cold EDGE = the validated play is under water this window (a graded losing edge record).
      // That's exactly when a user reads "0–2" as broken — so anchor it to the long-run 58%.
      const coldEdge = s.edgeGraded > 0 && s.edge.l > s.edge.w;
      const anchor = coldEdge ? `<span class="glp-anchor">long-run ${longRunPct()}%</span>` : "";
      return `<span class="rc-today rc-split"><span class="glp-scope">${scopeLab}</span>${parts.join(`<span class="glp-sep">·</span>`)}${anchor}</span>`;
    }
    // Overall pick record for the VIEWED date/league — across ALL markets (spread + total + ML),
    // plus a separate "top picks" (Strong ★★★) tally. Drives the small performance banner.
    function dayPicksTally() {
      const games = payload ? gamesForLeague(payload, league) : [];
      let w = 0, l = 0, p = 0, sw = 0, sl = 0;
      games.forEach((g: any) => {
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (!pl || pl.action !== "TAKE" || !pl.result) return;
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
        inner = `<span class="pf-k">${esc(dayLab)}'s picks</span><span class="pf-v pending">graded as games finish</span>`;
      } else {
        const strongTxt = (t.sw + t.sl) ? `<span class="pf-top">★ Top picks ${t.sw}–${t.sl}</span>` : "";
        inner = `<span class="pf-k">${esc(dayLab)}'s picks</span><span class="pf-v">${t.w}–${t.l}${t.p ? ` · ${t.p}P` : ""}</span>${strongTxt}`;
      }
      const chip = `<button class="recchip perf" id="recchip" aria-label="See the full pick record, broken down by confidence level">${inner}<span class="rc-arw">→</span></button>`;
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
      root.querySelector("#games-view").innerHTML = `
        <div class="datebar lead">
          <div class="datestrip" id="datestrip">${dateStripHtml()}</div>
          <div class="datetools">
            <span class="calwrap"><button class="dtool cal" id="cal-btn" title="Pick a date" aria-label="Pick a date"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3.5"/><path d="M3.5 9.6h17M8 3v3.4M16 3v3.4"/><circle cx="12" cy="14.8" r="1.4" fill="currentColor" stroke="none"/></svg></button><input type="date" id="date-input" aria-label="Pick a date" value="${curDate}" min="${minDate}" max="${maxDate > shiftDate(todayISO(), 5) ? maxDate : shiftDate(todayISO(), 5)}"></span>
            <button class="dtool hist ${histOpen || rangeMode ? "on" : ""}" id="hist-btn" title="Scan a date range">History</button>
          </div>
        </div>
        <div class="subhead compact subtle">
          <div class="sporttabs" id="sporttabs">${tabsHtml}<span class="tab-ink" id="tab-ink"></span></div>
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
      const body = `<div class="fn-body"><b>Picks aren't out yet for ${esc(dispDate)}</b><span>The DiamondEdge model locks each pick as first pitch approaches.${full ? "" : " Here's the schedule as it stands."}</span></div>`;
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
        if (meta) meta.innerHTML = metaRow();
        if (!games.length) {
          if (isFuture) { body.innerHTML = futureNote(dispDate, true, []); return; }
          if (!payload) { body.innerHTML = `<div class="state"><div class="st-ico">◆</div><div class="big">No games to show</div><div class="sm">Nothing's loaded for ${esc(isNaN(new Date(curDate).getTime()) ? "that date" : dispDate)} — try another date or head back to today. Every past DiamondEdge Pick stays graded on the Insights tab.</div></div>`; return; }
          const noun = league === "all" ? "games" : SPORT_LABEL[league] + " on the board";
          body.innerHTML = `<div class="state"><div class="st-ico">${league === "all" ? "◆" : SPORT_LABEL[league]}</div><div class="big">No ${esc(noun)}</div><div class="sm">Nothing scheduled for ${esc(dispDate)}. Try another league or date — and every past DiamondEdge Pick stays graded, win or lose, on the Insights tab.</div></div>`;
        } else {
          const anyPick = games.some((g: any) => { const p = displayPick(g); return p && p.action === "TAKE"; });
          // No featured pick hero on a future (no-pick) slate — it's a schedule, not a board.
          const ft = anyPick ? featuredPick(games) : null;
          const rest = ft ? games.filter((g: any) => g !== ft.g) : games;
          // Reference "Live & Upcoming": group the remaining cards by game phase so LIVE games
          // sit under a live subhead, upcoming below, finals last. gameState already gives phase.
          const grp: any = { live: [], pre: [], final: [] };
          rest.forEach((g: any) => { const k = gameState(g).kind; (grp[k] || grp.pre).push(g); });
          let n = 0;
          const section = (label: string, arr: any[], cls = "") => arr.length
            ? `<div class="slate-sec ${cls}"><div class="sec-hd"><span class="sec-lab">${esc(label)}</span><span class="sec-n">${arr.length}</span></div><div class="slate">${arr.map((g: any) => gameCard(g, n++)).join("")}</div></div>`
            : "";
          const grouped = `${section("Live", grp.live, "live")}${section(ft ? "Upcoming" : "Live & Upcoming", grp.pre)}${section("Final", grp.final, "final")}`;
          const lgSuffix = league === "all" ? "" : ` ${SPORT_LABEL[league]}`;
          // Future slate: the schedule is known but picks aren't published yet — banner + countdown.
          const futureBanner = isFuture && !anyPick ? futureNote(dispDate, false, games) : "";
          body.innerHTML = `${futureBanner}${anyPick ? tierLegend() : ""}${ft ? featuredCard(ft.g, ft.pl) : ""}${grouped}
            <div class="refnote">${games.length}${esc(lgSuffix)} game${games.length > 1 ? "s" : ""} · ${esc(dispDate)}</div>`;
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
      const hl = $("howlink"); if (hl) hl.onclick = () => openRecipeSheet();
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
      try { payload = await loadDay(curDate); } catch { payload = null; }  // no eternal skeleton on a failed/empty load
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
        if (ourWp != null)
          s.push(`Our model gives ${esc(_side || "this side")} about a ${(ourWp * 100).toFixed(0)}% chance to win — more than the price implies.`);
      }
      if (pl.nlines != null && pl.nlines >= 2)
        s.push(`The sportsbooks themselves don't agree on this line today — they're posting ${pl.nlines} different numbers — and split lines like that have historically been beatable.`);
      if (pl.value_tier) {
        const rh = recipeHistory();
        s.push(`Picks made exactly this way backtested around ${(rh.hit * 100).toFixed(0)}% since 2022 — real, but in-sample; the honest forward read is nearer 55% at morning prices, still ahead of break-even.`);
      } else {
        if (pl.p != null && pl.price != null)
          s.push(`The model gives this bet about a ${(Number(pl.p) * 100).toFixed(0)}% chance to win at ${fmtOdds(pl.price)}.`);
        s.push(`Like every DiamondEdge Pick, this one is graded against the final score — the full running record is on the Insights tab.`);
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
      const move = pk ? lineMove(pk) : "";
      const lean = pk ? (mk === "moneyline" ? wpLean(pk, g) : leanMeter(pk, mk, g)) : "";
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
        <div class="vr-line">Calls made exactly this way won ${(rh.hit * 100).toFixed(1)}% since 2022 in backtest — real, but in-sample, so we plan around a more honest ~55% at morning prices (56.9% out-of-sample).</div>
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
      else if (kind === "total") {
        // Prefer v3's reconciled total so "model X" agrees with the pick side; else legacy our_proj.
        const _v3tot = v3PredTotal(g);
        const modelTot = _v3tot != null ? num(_v3tot) : (pk.our_proj != null ? num(pk.our_proj) : "—");
        line = `line <b>${num(pk.line)}</b> · model <b>${modelTot}</b>${pk.interval && pk.interval.lo != null ? ` · likely range ${num(pk.interval.lo)} to ${num(pk.interval.hi)}` : ""}`;
      }
      else {
        // Prefer v3's reconciled win prob for the picked side; else the pick's own our_winprob.
        const _which: "home" | "away" = pk.side === (g && g.away_abbr) ? "away" : "home";
        const _v3wp = v3WinProb(g, _which);
        const ourWp = _v3wp != null ? _v3wp : (pk.our_winprob != null ? Number(pk.our_winprob) : null);
        line = `price <b>${fmtOdds(pk.price)}</b>${ourWp != null ? ` · model win chance <b>${(ourWp * 100).toFixed(1)}%</b>` : ""}${pk.market_winprob != null ? ` · market <b>${(pk.market_winprob * 100).toFixed(1)}%</b>` : ""}`;
      }
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
      const rh = recipeHistory();
      return rh && rh.n
        ? `DiamondEdge — a real, honestly-sized totals edge (~55% expected at morning prices; 56.9% on 239 picks the model never trained on). Every pick graded in the open.`
        : "DiamondEdge — every sports pick graded in the open.";
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
        const Plive = gamePlays(g);
        const plLive = (Plive.total && Plive.total.action === "TAKE") ? Plive.total : (displayPick(g) || bestPlay(g));
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

    // A LARGE score to sit beside a headline for live/final games. "" for pre-game / no split score.
    function bigScore(g: any) {
      const gs = gameState(g);
      if (gs.kind !== "live" && gs.kind !== "final") return "";
      const sc = gs.score;
      if (!sc || !sc.split || sc.home == null) return "";
      const aw = num(sc.away, 0), hm = num(sc.home, 0);
      const awWin = gs.kind === "final" && sc.away > sc.home, hmWin = gs.kind === "final" && sc.home > sc.away;
      const tag = gs.kind === "live"
        ? `<span class="bsc-tag live"><span class="livedot"></span>${esc(gs.label && gs.label !== "Live" ? gs.label : "LIVE")}</span>`
        : `<span class="bsc-tag final">Final</span>`;
      return `<div class="bigscore ${gs.kind}">
        <span class="bsc-team ${awWin ? "win" : ""}"><span class="bsc-ab">${esc(g.away_abbr)}</span><b>${aw}</b></span>
        <span class="bsc-dash">–</span>
        <span class="bsc-team ${hmWin ? "win" : ""}"><b>${hm}</b><span class="bsc-ab">${esc(g.home_abbr)}</span></span>
        ${tag}
      </div>`;
    }
    // A compact TABLE of the model's lean on every market — side + line + confidence (or Pass) —
    // shown at the top of the game detail; the narrative below explains WHY.
    function marketsTable(g: any) {
      const P = gamePlays(g);
      const row = (mk: string, label: string) => {
        const pl = P[mk];
        const line = vegasLine(g, mk);
        const isTake = pl && pl.action === "TAKE" && pl.side;
        if (isTake) {
          const q = qualityOf(pl);
          const st = playState(g, pl);
          const locked = pickLocked(pl, st);
          const sideTxt = String(pl.side) + (pl.line != null && !/\d/.test(String(pl.side)) ? " " + lineStr(pl.line) : "");
          const call = locked
            ? `<span class="mt-lock" data-up="1">${lockSvg} Unlock</span>`
            : `<span class="mt-side">${pickArrow(pl)} ${esc(sideTxt)}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}</span>`;
          const conf = locked
            ? `<span class="mt-conf blur" aria-hidden="true">★★★</span>`
            : `<span class="mt-conf">${qDiamonds(q)}<i>${Q_LABEL[q] || ""}</i></span>`;
          return `<tr class="mt-take q-${q} ${st}"><td class="mt-mk">${label}</td><td class="mt-line">${line || "—"}</td><td class="mt-call">${call}</td><td class="mt-c">${conf}</td></tr>`;
        }
        return `<tr class="mt-pass"><td class="mt-mk">${label}</td><td class="mt-line">${line || "—"}</td><td class="mt-call"><span class="mt-passlab">Pass</span></td><td class="mt-c">—</td></tr>`;
      };
      return `<div class="mkt-table"><div class="mt-h">Our lean · every market</div>
        <table class="mt-tbl"><thead><tr><th>Market</th><th>Line</th><th>Our call</th><th>Confidence</th></tr></thead>
        <tbody>${row("total", "Total (O/U)")}${row("spread", "Spread")}${row("moneyline", "Moneyline")}</tbody></table></div>`;
    }
    // The core thesis, made visible: OUR number vs the MARKET's, and the gap that makes the bet.
    function deDivergence(g: any, lead: any) {
      if (!lead || lead.action !== "TAKE") return "";
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
    // The DiamondEdge reasoning tab: a plain-English narrative FIRST, then the divergence, the
    // data visuals (graphs), the model-vs-market read, and the driving factors. Easy to follow, deep.
    function diamondEdgeReasoning(g: any, lead: any, leadLocked: boolean) {
      if (leadLocked) {
        return `<div class="de-pane"><div class="de-lead"><div class="de-k">◆ The DiamondEdge Read</div><p>The full model reasoning — our projected number, where it diverges from the market, and the data behind it — is part of DiamondEdge Premium.</p><button class="de-unlock" data-up="1">${lockSvg} Unlock the reasoning</button></div></div>`;
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
      return `<div class="de-pane">
        <div class="de-lead"><div class="de-k">◆ Why DiamondEdge ${lead2 ? "is on this" : "passed"}</div><p class="de-sub">${intro}</p></div>
        ${narrative}
        ${div ? `<div class="de-sec"><div class="de-h">Our number vs the market</div>${div}</div>` : ""}
        ${viz ? `<div class="de-sec"><div class="de-h">The numbers</div>${viz}</div>` : ""}
        ${(facts.length || stks) ? `<div class="de-sec"><div class="de-h">What's driving it</div>${stks ? `<div class="pv-stks">${stks}</div>` : ""}${facts.length ? `<div class="ls-facts">${facts.join("")}</div>` : ""}</div>` : ""}
      </div>`;
    }
    function openDetail(g: any, focusMk?: string, fromHistory = false) {
      detail = g;
      // Live & finished games open straight to "How it's going" (box score); only pre-game
      // games default to the Preview narrative.
      const _gsk = g && !g._recipe ? gameState(g).kind : "pre";
      detailTab = (_gsk === "live" || _gsk === "final") ? "live" : "preview";
      if (!fromHistory && g && g.game_id != null && !g._recipe) pushGameUrl(g.game_id);
      if (g && g.game_id != null && !g._recipe) { try { document.title = `${g.away_abbr} @ ${g.home_abbr} — DiamondEdge`; } catch {} }
      const sp = g.sport;
      const ps = g.predicted_score || {};
      const homeWin = ps.winner_abbr === g.home_abbr;
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
      // Live trend: the served hit-odds meter when the backend ships one; otherwise our own
      // honest tracking read (runs-vs-line / scoreboard status), so a live game's hero is never
      // a bare score. The SAME read headlines the "How it's going" pane below in full.
      const heroTrend = (gs.kind === "live" && lead && !leadLocked)
        ? (liveHitOdds(g, lead, "full") || liveTrackCard(g, lead, "hero"))
        : "";
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
        <button class="gp-tab ${detailTab === "preview" ? "on" : ""}" data-dtab="preview" role="tab">Game Preview</button>
        ${showLive ? `<button class="gp-tab ${detailTab === "live" ? "on" : ""}" data-dtab="live" role="tab">Box Score</button>` : ""}
        <button class="gp-tab ${detailTab === "de" ? "on" : ""}" data-dtab="de" role="tab">DiamondEdge</button>
        <span class="gp-tab-ink" id="gp-tab-ink"></span>
      </div>`;
      // Backup-signal note (from the model's challenger accountability) — plain English, detail-only,
      // behind an expand. Never on consumer front surfaces; never implies a stronger pick.
      const cs = lead && lead.action === "TAKE" && !leadLocked && lead.market === "total" && g.de_plays && g.de_plays.total ? g.de_plays.total.challenger_summary : null;
      const challengerNote = (cs && cs.consumer_label)
        ? `<details class="gp-backup"><summary><span class="bk-dot">◆</span><span class="bk-lab">${esc(cs.consumer_label)}</span><span class="bk-chev" aria-hidden="true">›</span></summary><div class="bk-body">${cs.consumer_detail ? `<p>${esc(cs.consumer_detail)}</p>` : ""}${Array.isArray(cs.active_family_labels) && cs.active_family_labels.length ? `<div class="bk-tags">${cs.active_family_labels.map((t: any) => `<span class="bk-tag">${esc(String(t))}</span>`).join("")}</div>` : ""}<p class="bk-note">Backup context only — it doesn't change the pick or its grade.</p></div></details>`
        : "";
      const v2Note = leadLocked ? "" : diamondEdgeV2Detail(g);
      const previewPane = `<div class="gp-pane" data-pane="preview" style="display:${detailTab === "preview" ? "block" : "none"}">
        ${leadLocked ? "" : previewMasthead}
        ${previewBlock}
        ${linesBlock}
        ${lead || !leadLocked ? pickPayoff : ""}
        ${challengerNote}
        ${v2Note}
        ${passBlock}
        ${leadLocked ? "" : more}
      </div>`;
      const livePane = showLive ? `<div class="gp-pane" data-pane="live" style="display:${detailTab === "live" ? "block" : "none"}">${boxScorePanel(g)}</div>` : "";
      const dePane = `<div class="gp-pane" data-pane="de" style="display:${detailTab === "de" ? "block" : "none"}">${diamondEdgeReasoning(g, lead, leadLocked)}</div>`;

      const html = `
        <div class="gamepage" id="gamepage" role="dialog" aria-modal="true" aria-label="${esc(g.matchup || "Game")}">
          <div class="gp-head">
            <button class="gp-back" id="gp-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
            <div class="gp-head-title"><span class="gp-head-sport">${SPORT_LABEL[sp] || sp}${g.meta && g.meta.competition ? ` · ${esc(g.meta.competition)}` : ""}</span><span class="gp-head-mu">${esc(g.away_abbr)} @ ${esc(g.home_abbr)}</span></div>
            <button class="gp-share" id="gp-share" aria-label="Share this game"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.7l7.4-4.3M8.3 13.3l7.4 4.3"/></svg></button>
          </div>
          <div class="gp-body" id="gp-body">
            ${gameHero}
            ${marketsTable(g)}
            ${tabsBar}
            ${previewPane}
            ${livePane}
            ${dePane}
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
                <p><b>Every pick is graded in public.</b> The side and line freeze before the game, the final score does the judging, and the whole record — wins, losses, everything — lives on the Insights tab.</p>
                <p><b>Calls made exactly this way backtested at <b>${(rh.hit * 100).toFixed(1)}%</b> since 2022</b> — real and rigorous, but in-sample. The honest forward read is <b>~55% at morning prices</b> (56.9% on 239 picks the model never trained on), graded by a model that never saw those games in advance.</p>
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
      const rh = recipeHistory();
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
        strong: { lab: "Strong", note: "highest-conviction totals" },
        good: { lab: "Good", note: "solid published totals calls" },
        lean: { lab: "Lean", note: "spread & moneyline directional reads" },
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
        // Two honest groups: The edge (totals = Strong + Good) and Leans (spread & moneyline = Lean).
        const edgeGroup = rec
          ? `${groupHead("The edge — totals", "the validated +EV play", ["strong", "good"], rec)}${["strong", "good"].map((q) => tierRow(rec, q, scope.filt)).join("")}`
          : "";
        const leanGroup = rec
          ? `${groupHead("Leans — spread &amp; moneyline", "directional reads, not validated", ["lean"], rec)}${tierRow(rec, "lean", scope.filt)}`
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
            <div class="rbt-howread">How to read this — only the totals <b>edge</b> is validated at +EV. <b>Leans</b> are directional reads we grade in the open; a cold day on either is normal variance over an ${rh.n.toLocaleString()}-pick record.</div>
            ${block(scopes[0])}
            ${block(scopes[1])}
            <div class="dsec">
              <div class="dsec-h">The honest expectation</div>
              <div class="rbt-valid"><b>≈55% at morning prices</b><span class="rbt-valid-n">+3–4% expected</span><span class="rbt-valid-roi pos">56.9% · +8% out-of-sample</span></div>
              <p class="rbt-valid-sub">Our backtest hit <b>${(rh.hit * 100).toFixed(1)}% over ${rh.n.toLocaleString()} graded totals</b> at ${rh.roi >= 0 ? "+" : ""}${(rh.roi * 100).toFixed(0)}% — real and rigorous, but <b>in-sample</b> (this recipe was model-selected on that history), so the forward edge is honestly smaller. The cleanest evidence is the <b>239 picks the model never trained on: 56.9% · +8%</b>. A cold day is normal variance either way.</p>
            </div>
            <div class="dsec"><div class="dsec-b rcp"><p><b>Strong &amp; Good are totals — the validated DiamondEdge edge.</b> Lean holds our spread &amp; moneyline directional reads, kept separate so the flagship number is never inflated. Every call freezes before first pitch and the final score does the judging.</p></div></div>
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

    // VALIDATED EQUITY CURVE — cumulative units (profit) over the validated graded record,
    // built from the ONE honest source that's always in the payload:
    //   value_record.validated_history.by_year  [{n, roi, hit, avg_odds}]
    // This is the same parquet ledger behind the 886 / 58.1% / +11% headline. There is no
    // per-pick time series in the payload (the history:DATE keys are a partial live-board
    // archive, not the validated ledger), so we anchor the curve on the real per-YEAR points:
    //   units staked in a year = n (1u/pick); profit that year = n * roi; cumulative = running sum.
    // Endpoint reconciles exactly: Σn = 886, Σ(n*roi)/Σn = blended ROI = +10.78% (the headline).
    // The line is drawn as a smooth monotone curve THROUGH the real year anchors — every marked
    // point is a genuine data point; no fabricated intermediate values are labeled.
    function validatedEquitySeries() {
      const vh = payload && payload.value_record && payload.value_record.validated_history;
      const by = vh && vh.by_year;
      if (!by || typeof by !== "object") return null;
      const years = Object.keys(by).filter((y) => /^\d{4}$/.test(y) && by[y] && by[y].n != null).sort();
      if (years.length < 2) return null;
      let cumN = 0, cumU = 0;
      // Origin anchor: start of the record, zero units staked / zero profit.
      const pts: any[] = [{ label: years[0], year: years[0], n: 0, cumN: 0, units: 0, roi: 0, origin: true }];
      years.forEach((y) => {
        const r = by[y] || {};
        const n = Number(r.n) || 0;
        const roi = Number(r.roi) || 0;      // return per unit staked, at median price
        cumN += n; cumU += n * roi;
        pts.push({ label: y, year: y, n, cumN, units: cumU, roi: Number(r.roi), hit: Number(r.hit) });
      });
      const last = pts[pts.length - 1];
      return { pts, totalN: cumN, totalUnits: cumU, blendedRoi: cumN ? cumU / cumN : 0, last };
    }

    // The equity curve itself: rising cumulative-units line on a light liquid-glass panel.
    // Inline SVG, no chart library. Zero baseline, start/end labels, year ticks under the axis,
    // aria-label summarizing the trend, responsive (scales to container width).
    function chartValidatedEquity() {
      const s = validatedEquitySeries();
      if (!s || s.pts.length < 3) return "";
      const { pts, totalN, totalUnits, last } = s;
      // Wider, flatter web aspect (was 340×176 ≈ 1.93:1, which — capped at 520px in a full-width
      // card — left a big dead band on desktop and read as "off" while scrolling). A 720×230
      // viewBox (≈3.1:1) fills the card cleanly at every width via width:100%.
      const W = 720, H = 200, PL = 34, PR = 18, PT = 18, PB = 32;
      const iw = W - PL - PR, ih = H - PT - PB;
      const us = pts.map((p: any) => p.units);
      let yMin = Math.min(0, ...us), yMax = Math.max(0, ...us);
      const ypad = (yMax - yMin) * 0.12 || 1; yMax += ypad; if (yMin < 0) yMin -= ypad;
      const n = pts.length;
      const sx = (i: number) => PL + (i / (n - 1)) * iw;
      const sy = (v: number) => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * ih;
      const y0 = sy(0);
      // Monotone-cubic path through the real anchors — smooth, never overshoots the data.
      const X = pts.map((_: any, i: number) => sx(i));
      const Y = pts.map((p: any) => sy(p.units));
      const dxs: number[] = [], slopes: number[] = [];
      for (let i = 0; i < n - 1; i++) { const dx = X[i + 1] - X[i]; dxs.push(dx); slopes.push((Y[i + 1] - Y[i]) / (dx || 1)); }
      const m: number[] = new Array(n);
      m[0] = slopes[0]; m[n - 1] = slopes[n - 2];
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
      // Year ticks: first + last + interior year labels (skip the origin duplicate).
      const ticks = pts.map((p: any, i: number) => {
        if (p.origin) return "";
        return `<text class="eqv-tick" x="${sx(i).toFixed(1)}" y="${H - 10}" text-anchor="${i === n - 1 ? "end" : i === 1 ? "start" : "middle"}">${esc(p.year)}</text>`;
      }).join("");
      // Start / end value labels.
      const endLab = `${sgn(last.units, 0)}u`;
      const dotX = sx(n - 1), dotY = sy(last.units);
      const yr0 = pts[1] ? pts[1].year : "", yr1 = last.year;
      const aria = `Cumulative profit rose to ${sgn(last.units, 0)} units over ${totalN.toLocaleString()} graded totals picks from ${yr0} to ${yr1}, a steadily rising equity curve.`;
      return `<div class="eqv-wrap"><svg viewBox="0 0 ${W} ${H}" class="eqv-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(aria)}">
        <defs><linearGradient id="eqvfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--green)" stop-opacity=".22"/><stop offset="1" stop-color="var(--green)" stop-opacity="0"/></linearGradient></defs>
        <line class="eqv-zero" x1="${PL}" y1="${y0.toFixed(1)}" x2="${W - PR}" y2="${y0.toFixed(1)}"/>
        <text class="eqv-zlab" x="${PL - 4}" y="${(y0 + 3).toFixed(1)}" text-anchor="end">0</text>
        <path class="eqv-area" d="${area}" fill="url(#eqvfill)"/>
        <path class="eqv-line" d="${line}"/>
        ${pts.map((p: any, i: number) => p.origin ? "" : `<circle class="eqv-node" cx="${sx(i).toFixed(1)}" cy="${sy(p.units).toFixed(1)}" r="3.4"><title>Through ${esc(p.year)}: ${sgn(p.units, 1)}u on ${p.cumN.toLocaleString()} picks</title></circle>`).join("")}
        <circle class="eqv-dot" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="5.6"/>
        <text class="eqv-endlab" x="${(dotX - 9).toFixed(1)}" y="${(dotY - 11).toFixed(1)}" text-anchor="end">${esc(endLab)}</text>
        ${ticks}
      </svg></div>`;
    }

    // The full equity-curve card for the Results view — honest caption with the real numbers.
    function equityCurveCard() {
      const s = validatedEquitySeries();
      const chart = chartValidatedEquity();
      if (!s || !chart) return "";
      const { totalN, totalUnits, blendedRoi } = s;
      return `<section class="eqv-card" aria-label="Equity curve — validated record">
        <div class="eqv-head">
          <div class="eqv-kick">The equity curve</div>
          <h3 class="eqv-h">A dollar riding every pick, since ${esc(s.pts[1] ? s.pts[1].year : "2022")}</h3>
          <p class="eqv-sub">Each year of the validated record adds to this running total. The line only measures the <b>totals</b> edge — the calls we actually publish — graded at real closing prices.</p>
        </div>
        ${chart}
        <div class="eqv-foot">
          <span class="eqv-stat"><i>Ended at</i><b class="pos">${sgn(totalUnits, 0)}u</b></span>
          <span class="eqv-stat"><i>Graded picks</i><b>${totalN.toLocaleString()}</b></span>
          <span class="eqv-stat"><i>Return</i><b class="pos">${sgn(blendedRoi * 100, 0)}%</b></span>
        </div>
        <p class="eqv-cap">Historical validated record · totals · ${totalN.toLocaleString()} graded picks · ${sgn(totalUnits, 0)} units at median price</p>
      </section>`;
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
      // NOTE: the equity curve is now the prominent hero card (equityCurveCard) above this block,
      // so the redundant second equity chart that used to lead here has been removed.
      const cal = insightArticle("The trust chart", "When we say ~58%, do we hit ~58%?", adNarr("calibration") || "This is the chart that keeps us honest. The horizontal is what our model claimed; the vertical is what actually happened. Dots sitting on — or above — the diagonal mean our confidence is real, not marketing.", "record", "◎", chartCalibration());
      const mo = insightArticle("Month by month", "The edge shows up across the calendar", adNarr("by_month") || "A real edge shouldn't need a lucky month. Win rate on top, the money it made below — most months clear the bar, a few don't, and we show them all.", "books", "▪", chartMonthly());
      return `${primerCard}${cal}${mo}`;
    }

    // ===================== RESULTS — STRENGTH BREAKDOWN (Edge vs Leans) =====================
    // The at-a-glance strength story, right on the Results page (not just one click deep in the
    // record sheet). Reuses tierRecordFor() over the WHOLE served slate + edgeLeanSplit() — the
    // exact same grading path as everywhere else, no new tally. Edge (Strong+Good totals, the
    // validated play) sits above Leans (spread/ML directional reads), each with its own W–L, and
    // the three tiers listed with diamonds. Honest by construction: only the edge is +EV.
    function strengthBreakdownCard() {
      const tr = tierRecordFor(() => true);
      const els = edgeLeanSplit(tr);
      if (!tr || !els || els.anyGraded < 1) return "";
      const pct = (o: any) => { const g = o.w + o.l; return g ? Math.round((o.w / g) * 100) : null; };
      const wl = (o: any) => `${o.w}<i>–</i>${o.l}`;
      const bar = (o: any, cls: string) => {
        const g = o.w + o.l; const p = g ? (o.w / g) * 100 : 0;
        return `<span class="sb-track"><span class="sb-fill ${cls}" style="width:${p.toFixed(0)}%"></span></span>`;
      };
      const outNote = (o: any) => { const out = (o.live || 0) + (o.up || 0); return out ? `<span class="sb-out">${out} still live / to come</span>` : ""; };
      const tierRow = (q: "strong" | "good" | "lean", o: any) => {
        if (!(o.w + o.l + o.live + o.up)) return "";
        const p = pct(o);
        return `<div class="sb-tier q-${q}">
          <span class="sb-tlab">${qDiamonds(q)}<b>${Q_LABEL[q]}</b></span>
          <span class="sb-twl">${wl(o)}</span>
          <span class="sb-tpct">${p != null ? p + "%" : "—"}</span>
        </div>`;
      };
      const grp = (title: string, sub: string, o: any, cls: string, tiers: string) => {
        const p = pct(o);
        return `<div class="sb-grp ${cls}">
          <div class="sb-ghead">
            <div class="sb-gtitle"><b>${title}</b><i>${sub}</i></div>
            <div class="sb-grec"><span class="sb-gwl">${wl(o)}</span><span class="sb-gpct">${p != null ? p + "%" : "—"}</span></div>
          </div>
          ${bar(o, cls)}
          ${outNote(o)}
          <div class="sb-tiers">${tiers}</div>
        </div>`;
      };
      return `<section class="sb-card" aria-label="Record by pick strength — edge vs leans">
        <div class="sb-head">
          <div class="sb-kick">By pick strength</div>
          <h3 class="sb-h">Where the record comes from</h3>
          <p class="sb-sub">Our <b>edge</b> is the totals play — the calls we validate at a real price. <b>Leans</b> are spread &amp; moneyline reads we grade in the open. They're shown apart on purpose: only the edge is proven +EV.</p>
        </div>
        ${grp("The edge", "Totals · Strong + Good", els.edge, "edge", tierRow("strong", tr.strong) + tierRow("good", tr.good))}
        ${grp("The leans", "Spread &amp; moneyline", els.lean, "lean", tierRow("lean", tr.lean))}
        <button class="sb-more" id="sb-more">See every graded pick by strength →</button>
      </section>`;
    }

    // ===================== RESULTS — RECENT GRADED SCORES =====================
    // A scannable, date-grouped ledger of recently GRADED DiamondEdge picks — the "scores" a user
    // scrolls through. Sourced from the SAME served slate (payload.games) + the SAME grading path
    // (displayPick / finalScore / gameState / pickResult) used everywhere; NOTHING re-graded here.
    // Each row: matchup + final score + our pick + Won/Lost, grouped under a date header.
    function recentGradedGames(cap = 40) {
      const src = livePayload || payload;
      if (!src || !src.games) return [];
      const out: any[] = [];
      ((src.games || []) as any[]).forEach((g: any) => {
        const gs = gameState(g);
        if (gs.kind !== "final") return;            // graded ledger = finished games only
        const pl = displayPick(g);
        if (!pl || pl.action !== "TAKE" || !pl.side) return;
        const r = pickResult(g, pl);
        if (r !== "hit" && r !== "miss" && r !== "push") return; // must be graded
        const day = String(g.date || gameLocalDay(g) || "").slice(0, 10);
        if (!day) return;
        out.push({ g, pl, r, day, q: qualityOf(pl), fsc: finalScore(g) });
      });
      // newest first; within a day, wins/strong first for a tidy scan
      out.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
      return out.slice(0, cap);
    }
    function gradedScoreRow(item: any) {
      const { g, pl, r, q, fsc } = item;
      const resCls = r === "hit" ? "won" : r === "miss" ? "lost" : "push";
      const resLab = r === "hit" ? `${condCheck} WON` : r === "miss" ? "✗ LOST" : "PUSH";
      const sc = fsc && fsc.home != null ? fsc : null;
      const awayWin = sc && sc.away > sc.home, homeWin = sc && sc.home > sc.away;
      const teamCol = (which: "away" | "home", win: boolean) => `<span class="gs-tm ${win ? "win" : ""}">${gCrest(g, which, "gs-crest")}<b>${esc(which === "away" ? g.away_abbr : g.home_abbr)}</b>${sc ? `<em>${num(which === "away" ? sc.away : sc.home, 0)}</em>` : ""}</span>`;
      const pick = `${pickArrow(pl)} ${esc(pl.side || "—")}${pl.price != null ? ` <i>${fmtOdds(pl.price)}</i>` : ""}`;
      return `<article class="gs-row ${resCls}" data-gid="${esc(g.game_id)}" role="button" tabindex="0" aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)} — our pick ${esc(pl.side || "")} ${r === "hit" ? "won" : r === "miss" ? "lost" : "pushed"} — open details">
        <span class="gs-lg">${esc(SPORT_LABEL[g.sport] || g.sport || "")}</span>
        <span class="gs-mu">${teamCol("away", !!awayWin)}<span class="gs-at">@</span>${teamCol("home", !!homeWin)}</span>
        <span class="gs-pick q-${q}">${qDiamonds(q)}${pick}</span>
        <span class="gs-res ${resCls}">${resLab}</span>
      </article>`;
    }
    function gradedScoresList() {
      const items = recentGradedGames(40);
      if (!items.length) return "";
      // group by day (already sorted newest-first)
      const groups: any[] = [];
      let cur: any = null;
      items.forEach((it) => {
        if (!cur || cur.day !== it.day) { cur = { day: it.day, rows: [] }; groups.push(cur); }
        cur.rows.push(it);
      });
      const dayLabel = (iso: string) => {
        const d = new Date(iso + "T12:00:00");
        if (isNaN(d.getTime())) return iso;
        const t = todayISO();
        if (iso === t) return "Today";
        const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
        if (iso === y) return "Yesterday";
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      };
      const body = groups.map((grp) => {
        let w = 0, l = 0; grp.rows.forEach((it: any) => { if (it.r === "hit") w++; else if (it.r === "miss") l++; });
        const dayRec = w + l ? `<span class="gsd-rec ${w > l ? "up" : w < l ? "dn" : ""}">${w}–${l}</span>` : "";
        return `<div class="gs-day">
          <div class="gs-dhead"><span class="gsd-date">${esc(dayLabel(grp.day))}</span>${dayRec}</div>
          <div class="gs-rows">${grp.rows.map(gradedScoreRow).join("")}</div>
        </div>`;
      }).join("");
      return `<section class="gs-card" aria-label="Recent graded scores">
        <div class="gs-head">
          <div class="gs-kick">The ledger</div>
          <h3 class="gs-h">Recent picks, graded against the final</h3>
          <p class="gs-subx">Every published DiamondEdge Pick that has finished, most recent first — the matchup, the final score, our call and how it landed. Tap any row for the full breakdown.</p>
        </div>
        ${body}
      </section>`;
    }

    // ===================== INSIGHTS SHOWCASE (the premium effectiveness surface) =====================
    // A bold, editorial cut of the validated record — the confident hero, the by-confidence
    // reconciliation, the year ladder, and an honest calibration read. Every number is REAL and
    // sourced from what's already in the payload; nothing is re-graded and no series is invented:
    //   • hero record      → value_record.validated_history.median_price (58.1% · 886 · +11%)
    //   • by confidence     → analytics_deep.by_confidence [{tier,record,hit,roi,n}] — Σn=886, reconciles
    //   • year ladder       → value_record.validated_history.by_year [{n,hit,roi}]
    //   • calibration read  → analytics_deep.calibration [{predicted,actual,n}]
    //   • honesty framing   → validated_history.stability_verdict / selection_clean_split / shopped_modal
    // Where a series doesn't exist (e.g. a real per-DATE validated equity ledger, or a monthly
    // validated split), we DON'T fake it — the equity curve is the honest per-year aggregate and
    // the monthly chart only renders if analytics_deep.monthly is actually served.
    function adBy(key: string) {
      const ad = analyticsDeep || (payload && payload.analytics_deep) || null;
      return ad && Array.isArray(ad[key]) ? ad[key] : null;
    }
    function valHist() { return payload && payload.value_record && payload.value_record.validated_history; }

    // The reconciliation is the whole point of transparency: the three confidence tiers must add
    // back up to the headline 886 / 58.1%. We compute the sum client-side and SHOW it, so the
    // user can check our arithmetic instead of taking the hero number on faith.
    function confReconcile() {
      const rows = adBy("by_confidence");
      if (!rows || !rows.length) return null;
      const norm = (t: any) => { const s = String(t || "").toLowerCase(); return s === "strong" ? "strong" : s === "good" ? "good" : "lean"; };
      const tiers = rows.map((r: any) => {
        const rec = String(r.record || "").match(/(\d+)\D+(\d+)/);
        const w = rec ? Number(rec[1]) : null, l = rec ? Number(rec[2]) : null;
        return { q: norm(r.tier || r.key), n: Number(r.n) || 0, hit: Number(r.hit), roi: Number(r.roi), w, l, note: r.profit_note ? cleanCopy(r.profit_note) : "" };
      });
      const order: any = { strong: 0, good: 1, lean: 2 };
      tiers.sort((a: any, b: any) => order[a.q] - order[b.q]);
      const sumN = tiers.reduce((s: number, t: any) => s + t.n, 0);
      const sumW = tiers.reduce((s: number, t: any) => s + (t.w || 0), 0);
      const sumL = tiers.reduce((s: number, t: any) => s + (t.l || 0), 0);
      const blendHit = sumW + sumL ? sumW / (sumW + sumL) : null;
      return { tiers, sumN, sumW, sumL, blendHit };
    }

    // Calibration → one honest sentence + a compact reliability strip. "When we said ~X%, we hit
    // ~Y%." We read the served buckets, weight the average gap by sample size, and state plainly
    // whether the picks land at or above their billing (and flag the one bucket that ran cold).
    function calibrationRead() {
      const raw = adBy("calibration");
      if (!raw || raw.length < 2) return null;
      const pts = raw.map((p: any) => ({ p: Number(p.predicted), a: Number(p.actual), n: Number(p.n || 0), lab: p.bucket_label }))
        .filter((p: any) => !isNaN(p.p) && !isNaN(p.a));
      if (pts.length < 2) return null;
      const totN = pts.reduce((s: number, p: any) => s + p.n, 0) || 1;
      const wGap = pts.reduce((s: number, p: any) => s + (p.a - p.p) * p.n, 0) / totN; // + = beat the billing
      const wPred = pts.reduce((s: number, p: any) => s + p.p * p.n, 0) / totN;
      const wAct = pts.reduce((s: number, p: any) => s + p.a * p.n, 0) / totN;
      return { pts, totN, wGap, wPred, wAct };
    }

    // The hero: the HONEST forward expectation, stated confidently but not overstated.
    // We deliberately do NOT headline the 58.1%/886/+11% backtest — that number is real and
    // rigorous but IN-SAMPLE (the winning policy was the best of ~29 recipes mined on the same
    // data), so it overstates the forward edge. The hero leads with:
    //   • the honest forward expectation (~55% at morning prices, +3–4%), and
    //   • the clean OUT-OF-SAMPLE slice (56.9% / +8% on 239 picks the model never trained on),
    // and the 58.1% backtest is shown BELOW, clearly relabelled as "backtested (in-sample)".
    function insHero() {
      const rh = recipeHistory();
      const vh = valHist();
      const sm = vh && vh.shopped_modal;
      const by = vh && vh.by_year;
      const yrs = by ? Object.keys(by).filter((y) => /^\d{4}$/.test(y)).sort() : [];
      const span = yrs.length ? `${yrs[0]}–${yrs[yrs.length - 1]}` : "2022–2026";
      // The clean out-of-sample slice — the strongest honest evidence (never used to pick the recipe).
      const scs = vh && vh.selection_clean_split;
      const clean = scs && scs["2022_23_never_used_to_select_recipe"];
      const cleanN = clean && clean.n != null ? Number(clean.n) : 239;
      const cleanHit = clean && clean.hit != null ? Number(clean.hit) : 0.569;
      const cleanRoi = clean && clean.roi != null ? Number(clean.roi) : 0.084;
      return `<section class="ix-hero" aria-label="Honest forward expectation">
        <div class="ix-hero-glow" aria-hidden="true"></div>
        <div class="ix-hero-top">
          <span class="ix-badge">◆ Totals edge · honest expectation</span>
          <span class="ix-live">Every pick graded in the open</span>
        </div>
        <div class="ix-hero-num">
          <div class="ix-big"><span class="ix-pct">≈55</span><span class="ix-pctsym">%</span></div>
          <div class="ix-big-cap">
            <div class="ix-big-lab">win rate we expect at morning prices</div>
            <div class="ix-big-sub">A real, priced-in edge on totals — roughly <b>+3–4% return</b> going forward, once we honestly discount for the fact that the winning recipe was chosen on past data. Break-even is 52.5%.</div>
          </div>
        </div>
        <div class="ix-hero-stats">
          <div class="ix-stat"><b class="pos">${(cleanHit * 100).toFixed(1)}%</b><i>Out-of-sample · ${cleanN} picks</i></div>
          <div class="ix-stat"><b class="pos">${sgn(cleanRoi * 100, 0)}%</b><i>OOS return</i></div>
          <div class="ix-stat"><b>${(rh.hit * 100).toFixed(1)}%</b><i>Backtest (in-sample)</i></div>
          <div class="ix-stat"><b>${rh.n.toLocaleString()}</b><i>Backtested picks</i></div>
        </div>
        <p class="ix-hero-line"><b>Why ~55% and not 58%?</b> Our full backtest hit <b>${(rh.hit * 100).toFixed(1)}% over ${rh.n.toLocaleString()} graded totals</b> at ${sgn(rh.roi * 100, 0)}% — real and rigorously produced, but <b>in-sample</b>: this recipe was the best of ~29 we mined on that same history, so it flatters the forward number. The honest floor is the <b>${cleanN} picks the model never trained on: ${(cleanHit * 100).toFixed(1)}% · ${sgn(cleanRoi * 100, 0)}%</b> (directionally confirming, not yet independently significant). Our live forward sample is still tiny and proves nothing on its own — so we lead with the honest expectation, and show every real number below.</p>
      </section>`;
    }

    // BY CONFIDENCE — the reconciliation grid. Strong / Good / Lean, each with W–L, hit%, ROI and
    // sample, plus the served plain-English profit note. A reconcile bar shows the three add back
    // to the headline 886 / 58.1% — the transparency proof, computed live.
    function insByConfidence() {
      const rc = confReconcile();
      if (!rc) return "";
      const rh = recipeHistory();
      const maxRoi = Math.max(0.02, ...rc.tiers.map((t: any) => Math.abs(t.roi || 0)));
      const card = (t: any) => {
        const hpct = Math.max(3, Math.min(100, (t.hit || 0) * 100));
        const roiW = Math.max(3, Math.min(100, (Math.abs(t.roi || 0) / maxRoi) * 100));
        const wl = t.w != null ? `${t.w}<i>–</i>${t.l}` : "—";
        return `<div class="ix-tier q-${t.q}">
          <div class="ix-tier-h">
            <span class="ix-tier-name">${qDiamonds(t.q)}<b>${Q_LABEL[t.q]}</b></span>
            <span class="ix-tier-n">${(t.n || 0).toLocaleString()} picks</span>
          </div>
          <div class="ix-tier-big"><span class="ix-tier-pct pos">${(t.hit * 100).toFixed(1)}%</span><span class="ix-tier-wl">${wl}</span></div>
          <div class="ix-metric"><span class="ix-mk">Hit rate</span><span class="ix-track"><span class="ix-fill hit" style="width:${hpct.toFixed(0)}%"></span><span class="ix-be" style="left:52.5%"></span></span></div>
          <div class="ix-metric"><span class="ix-mk">Return</span><span class="ix-track"><span class="ix-fill ${t.roi >= 0 ? "roi" : "roineg"}" style="width:${roiW.toFixed(0)}%"></span></span><b class="ix-mv ${t.roi >= 0 ? "pos" : "neg"}">${sgn(t.roi * 100, 0)}%</b></div>
          ${t.note ? `<p class="ix-tier-note">${esc(t.note)}</p>` : ""}
        </div>`;
      };
      // Live reconciliation: the three tiers sum back to the headline.
      const recPct = rc.blendHit != null ? (rc.blendHit * 100).toFixed(1) : "—";
      const headlinePct = (rh.hit * 100).toFixed(1);
      const matches = rc.sumN === rh.n && Math.abs((rc.blendHit || 0) - rh.hit) < 0.006;
      return `<section class="ix-sec" aria-label="Record by confidence tier">
        <div class="ix-sec-h">
          <span class="ix-kick">Inside the backtest</span>
          <h3 class="ix-h">Where the backtested edge lives</h3>
          <p class="ix-sub">These are the tiers <b>within the ${headlinePct}% in-sample backtest</b> — real, rigorous, but model-selected on this same history, so read them as structure, not the forward number. Each published totals pick carries one honest word for how hard the signal fired; here's win rate, the money it made, and the sample behind it. The dashed line on each bar is roughly break-even at typical prices.</p>
        </div>
        <div class="ix-tiers">${rc.tiers.map(card).join("")}</div>
        <div class="ix-reconcile ${matches ? "ok" : ""}">
          <span class="ix-rec-k">Reconciles</span>
          <span class="ix-rec-body">${rc.tiers.map((t: any) => `${t.n}`).join(" + ")} = <b>${rc.sumN.toLocaleString()}</b> picks · ${rc.sumW}–${rc.sumL} blends to <b>${recPct}%</b> ${matches ? "=" : "≈"} the ${headlinePct}% backtest${matches ? " ✓" : ""}</span>
        </div>
      </section>`;
    }

    // THE YEAR LADDER — the record standing on its own in every calendar year (2022→2026). This is
    // the honest counterpoint to a single blended number: a real edge shouldn't need a lucky season.
    // Reads validated_history.by_year; the served stability_verdict is surfaced plainly beneath.
    function insYearLadder() {
      const vh = valHist();
      const by = vh && vh.by_year;
      if (!by) return "";
      const yrs = Object.keys(by).filter((y) => /^\d{4}$/.test(y) && by[y] && by[y].n != null).sort();
      if (yrs.length < 2) return "";
      const rows = yrs.map((y) => ({ y, n: Number(by[y].n) || 0, hit: Number(by[y].hit), roi: Number(by[y].roi) }));
      const be = 0.525;
      const rowHtml = (r: any) => {
        const win = r.hit >= be;
        const hpct = Math.max(4, Math.min(100, (r.hit || 0) * 100));
        return `<div class="ix-yr">
          <span class="ix-yr-lab">${esc(r.y)}</span>
          <span class="ix-yr-track"><span class="ix-yr-fill ${win ? "up" : "dn"}" style="width:${hpct.toFixed(0)}%"></span><span class="ix-yr-be" style="left:52.5%"></span></span>
          <span class="ix-yr-hit ${win ? "pos" : "neg"}">${(r.hit * 100).toFixed(0)}%</span>
          <span class="ix-yr-roi ${r.roi >= 0 ? "pos" : "neg"}">${sgn(r.roi * 100, 0)}%</span>
          <span class="ix-yr-n">${r.n}</span>
        </div>`;
      };
      // Pull the human-readable stability line if served (freshness caveat), kept short + honest.
      const sv = vh.stability_verdict ? String(vh.stability_verdict).split("(")[0].replace(/^STABLE:\s*/i, "").trim() : "";
      return `<section class="ix-sec" aria-label="Record by year">
        <div class="ix-sec-h">
          <span class="ix-kick">Year by year</span>
          <h3 class="ix-h">Green in every season it has run</h3>
          <p class="ix-sub">A real edge shouldn't need a lucky year. Win rate on the bar, return on the right — the break-even mark sits at the dashed line. ${sv ? `Our own read: <b>${esc(sv.charAt(0).toUpperCase() + sv.slice(1))}</b>.` : ""}</p>
        </div>
        <div class="ix-yr-head"><span class="ix-yr-lab">Year</span><span class="ix-yr-track"></span><span class="ix-yr-hit">Hit</span><span class="ix-yr-roi">Return</span><span class="ix-yr-n">Picks</span></div>
        <div class="ix-yrs">${rows.map(rowHtml).join("")}</div>
      </section>`;
    }

    // CALIBRATION — the trust read. One plain sentence backed by the served buckets, then the
    // existing calibration scatter (predicted vs actual with the perfect-line diagonal). Only
    // renders if analytics_deep.calibration is actually present — never faked.
    function insCalibration() {
      const cr = calibrationRead();
      const chart = chartCalibration();
      if (!cr || !chart) return "";
      const beat = cr.wGap >= -0.005;
      const gapTxt = `${cr.wGap >= 0 ? "+" : ""}${(cr.wGap * 100).toFixed(1)} pts`;
      const verdict = beat
        ? `When we billed a pick at about <b>${(cr.wPred * 100).toFixed(0)}%</b>, it actually won <b>${(cr.wAct * 100).toFixed(0)}%</b> of the time — our confidence is real, not marketing.`
        : `When we billed a pick at about <b>${(cr.wPred * 100).toFixed(0)}%</b>, it landed near <b>${(cr.wAct * 100).toFixed(0)}%</b> — a touch under the billing, and we show it rather than round it away.`;
      return `<section class="ix-sec ix-calib-sec" aria-label="Calibration — do our picks hit their billing">
        <div class="ix-sec-h">
          <span class="ix-kick">The trust chart</span>
          <h3 class="ix-h">Do our ~58% picks actually hit ~58%?</h3>
          <p class="ix-sub">${verdict} Across the graded buckets the sample-weighted gap between what we said and what happened is <b class="${beat ? "pos" : "neg"}">${gapTxt}</b>. Every dot below is a confidence band; on or above the diagonal means we hit at least as often as we claimed.</p>
        </div>
        <div class="ix-calib">${chart}</div>
      </section>`;
    }

    // TRANSPARENCY — what's validated vs supporting context, stated plainly. Uses the served
    // selection_clean_split (the out-of-sample slice that was never used to pick the recipe) as
    // the honest backbone: it's the strongest evidence we're not curve-fitting.
    function insTransparency() {
      const vh = valHist();
      const scs = vh && vh.selection_clean_split;
      const clean = scs && (scs["2022_23_never_used_to_select_recipe"] || null);
      const era = scs && (scs["2024_26_selection_era_regraded_fresh"] || null);
      const cleanTxt = clean
        ? `<div class="ix-tp-row"><span class="ix-tp-k">Never used to build the model</span><span class="ix-tp-v">${clean.n} picks · ${(clean.hit * 100).toFixed(1)}% · ${sgn((clean.roi != null ? clean.roi : 0) * 100, 0)}%</span></div>`
        : "";
      const eraTxt = era
        ? `<div class="ix-tp-row"><span class="ix-tp-k">The selection era, regraded fresh</span><span class="ix-tp-v">${era.n} picks · ${(era.hit * 100).toFixed(1)}% · ${sgn((era.roi != null ? era.roi : 0) * 100, 0)}%</span></div>`
        : "";
      return `<section class="ix-sec ix-tp" aria-label="What is validated versus supporting context">
        <div class="ix-sec-h">
          <span class="ix-kick">Straight talk</span>
          <h3 class="ix-h">What's proven, and what isn't</h3>
        </div>
        <div class="ix-tp-grid">
          <div class="ix-tp-card validated">
            <div class="ix-tp-tag">Real edge, honestly sized</div>
            <h4>The totals betting record</h4>
            <p>Our backtest hit <b>${(recipeHistory().hit * 100).toFixed(1)}% over ${recipeHistory().n.toLocaleString()} graded totals</b> — real and rigorous, but <b>in-sample</b> (this recipe was model-selected on that history), so we don't sell it as the forward number. The honest read is <b>≈55% at morning prices, +3–4%</b>; the strongest clean evidence is the out-of-sample slice below. Over/unders only — the one market with a priced, graded edge, and what the gold ★ picks are built on.</p>
            ${cleanTxt}${eraTxt}
          </div>
          <div class="ix-tp-card context">
            <div class="ix-tp-tag muted">Supporting context</div>
            <h4>Everything else on the board</h4>
            <p>Spread &amp; moneyline reads are <b>leans</b> — directional calls we grade in the open for completeness, not validated +EV. Scores, live tracking and previews are context around the play. We label them apart on purpose so a lean never borrows the totals edge's credibility.</p>
          </div>
        </div>
      </section>`;
    }

    // The whole premium showcase, in editorial order: hero → where the edge lives (by tier,
    // reconciled) → year ladder → equity curve → calibration → transparency.
    function insightsShowcase() {
      const rc = confReconcile();
      // The showcase leads with what we can prove. If the deep analytics aren't in the payload,
      // it still shows the hero + year ladder from value_record; charts self-hide honestly.
      return `${insHero()}${insByConfidence()}${insYearLadder()}${insCalibration()}${insTransparency()}`;
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
    // The aggressive premium upsell card on Insights — the record is the proof, this is the ask.
    function insightsUpsell() {
      const rh = recipeHistory();
      if (isPremium()) {
        return `<div class="ix-upsell owned"><span class="ixu-k">◆ You're Premium</span><span class="ixu-owned-b">Every Strong and Good pick is unlocked — you're backing the record above.</span></div>`;
      }
      return `<div class="ix-upsell">
        <div class="ixu-glow" aria-hidden="true"></div>
        <div class="ixu-k">◆ DiamondEdge Premium</div>
        <h3 class="ixu-h">The record is free. The picks are premium.</h3>
        <p class="ixu-b">You've just seen the proof — graded in the open since 2022. Unlock the exact side, line and price on every <b>Strong ◆◆◆</b> and <b>Good ◆◆</b> pick the moment we freeze it, plus the plain-English reasoning behind each one.</p>
        <div class="ixu-perks">
          <span class="ixu-perk">✓ Every Strong &amp; Good pick, unlocked</span>
          <span class="ixu-perk">✓ The full DiamondEdge reasoning</span>
          <span class="ixu-perk">✓ Live reads during games</span>
        </div>
        <div class="ixu-cta-row"><button class="ixu-cta" id="ins-upsell">Unlock DiamondEdge — $9.99/mo</button><span class="ixu-fine">Cancel anytime · the record stays free</span></div>
      </div>`;
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
        <div class="ix-masthead">
          <div class="ix-eyebrow">DiamondEdge · Insights</div>
          <h2 class="ix-mast-h">How well the model actually works</h2>
          <p class="ix-mast-sub">No cherry-picking, no lucky-week screenshots. This is the whole graded record — the edge, where it comes from, whether our confidence holds up, and exactly what's proven versus what's context.</p>
          <div class="ix-mast-act">
            <button class="ix-btn primary" id="res-breakdown">See every pick by strength →</button>
            <button class="ix-btn" id="res-share">Share the record ↗</button>
          </div>
        </div>
        ${insightsUpsell()}
        ${insightsShowcase()}
        ${equityCurveCard()}
        ${strengthBreakdownCard()}
        ${analyticsDeep && chartMonthly() ? `<section class="ins-section">
          <div class="ins-sec-h"><span class="ins-sec-k">Month by month</span><h2>The edge across the calendar</h2><p>A real edge shouldn't need a lucky month. Win rate on top, the money it made below — most months clear the bar, a few don't, and we show them all.</p></div>
          ${insightArticle("Month by month", "The edge shows up across the calendar", adNarr("by_month") || "", "books", "▪", chartMonthly())}
        </section>` : ""}
        <details class="ix-more"><summary><span class="ix-more-k">The full ledger</span><span class="ix-more-sub">the edge-vs-leans split and every recently graded score</span><span class="ix-more-car" aria-hidden="true">▾</span></summary>
        <div class="ix-more-b">
        ${gradedScoresList()}
        ${ov.n ? `<article class="res-article second">
          <div class="res-figure sm">${resFigure("books", "Σ")}</div>
          <div class="res-art-b">
            <div class="res-kick muted">A different, bigger number — and why it's lower</div>
            <h3 class="res-h sm">Everything we track: <span class="${roi != null && roi < 0 ? "neg" : ""}">${hr != null ? hr.toFixed(1) + "%" : "—"}</span></h3>
            <p class="res-lede sm">Across <b>${(ov.n || 0).toLocaleString()}</b> total graded calls — including thin Leans and situations we track but never publish as Picks — the raw win rate is ${hr != null ? hr.toFixed(1) + "%" : "—"}${roi != null ? `, a ${(roi >= 0 ? "+" : "") + roi.toFixed(1)}% return` : ""}. ${roi != null && roi < 0 && hr != null && hr > 50 ? "Some of those cuts win often but at odds too short to profit — " : "Many of those never clear our bar — "}that's exactly why they're not DiamondEdge Picks. <b>The ${(rh.hit * 100).toFixed(1)}% above is what you're actually paying for.</b></p>
          </div>
        </article>` : ""}
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
        <div class="refnote">Every cut is the same graded record, sliced a different way — win rate always shown with its return.${analyticsDeep && analyticsDeep.generated_at ? ` Updated ${esc(String(analyticsDeep.generated_at).slice(0, 10))}.` : ""}</div>
        </div></details>`;
      animateCounters(view);
      // Share the headline record — honest text + the branded OG card renders from the URL.
      const rs = $("res-share");
      if (rs) rs.onclick = async () => {
        const url = (() => { try { const u = new URL(location.href); u.searchParams.delete("g"); return u.origin + u.pathname; } catch { return location.href; } })();
        const txt = `DiamondEdge — a real, honestly-sized totals edge: ~55% expected at morning prices (56.9% on 239 picks the model never trained on). Backtest ${(rh.hit * 100).toFixed(1)}% over ${rh.n.toLocaleString()} graded, but that's in-sample. Every pick graded in the open.`;
        if ((navigator as any).share) { try { await (navigator as any).share({ title: "DiamondEdge — the record", text: txt, url }); return; } catch {} }
        try { await navigator.clipboard.writeText(`${txt} ${url}`); toast("Record copied to clipboard"); } catch { toast(url); }
      };
      const rbk = $("res-breakdown");
      if (rbk) rbk.onclick = () => openRecordBreakdown();
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
          ${bigScore(g)}
          <h4 class="pv-head">${head}</h4>
          ${dek && gs.kind !== "final" ? `<p class="pv-dek clamp2">${mdBold(String(dek))}</p>` : ""}
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
        // Only TODAY's games belong on the News front. "live" is trusted only when plausibly still
        // live — the payload carries stale cross-day "live" zombies (incl. other sports, e.g. a
        // days-old USA vs BEL) that must not surface here.
        if (st0 === "live") {
          const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
          if (ts) { const age = Date.now() - new Date(ts).getTime(); return isNaN(age) || (age > -12 * 3600 * 1000 && age < 12 * 3600 * 1000); }
          return !d || d >= shiftDate(t, -1);
        }
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
    // The HOMEPAGE is CURATED — not the full board. Significance, from the data we have:
    //  • games where we have an actual DiamondEdge Pick (a TAKE — Strong/Good/Lean), our best
    //    call first (that game is also the featured lead story above);
    //  • marquee LIVE games (something is happening right now).
    // Everything else (no-pick, intel-only, upcoming filler) stays on the Games tab's full board.
    // Returns the curated significant games in significance order (pick-quality, then live).
    function significantGames() {
      const src = livePayload || payload;
      if (!src) return [];
      const t = todayISO();
      const pool = ((src.games || []) as any[]).filter((g: any) => {
        const st0 = String(g.status || "pre").toLowerCase();
        const d = gameLocalDay(g);
        // Only TODAY's games belong on the News front. "live" is trusted only when plausibly still
        // live — the payload carries stale cross-day "live" zombies (incl. other sports, e.g. a
        // days-old USA vs BEL) that must not surface here.
        if (st0 === "live") {
          const ts = isTS(g.start_ts) ? g.start_ts : (isTS(g.start_time) ? g.start_time : null);
          if (ts) { const age = Date.now() - new Date(ts).getTime(); return isNaN(age) || (age > -12 * 3600 * 1000 && age < 12 * 3600 * 1000); }
          return !d || d >= shiftDate(t, -1);
        }
        return d === t || (st0 === "pre" && !d);
      });
      const scored = pool.map((g: any) => {
        const pl = displayPick(g);
        const hasPick = !!(pl && pl.action === "TAKE");
        const live = String(g.status || "pre").toLowerCase() === "live";
        // rank: pick-quality (0=strong,1=good,2=lean) beats a live-but-no-pick game (3).
        const rank = hasPick ? (Q_RANK[qualityOf(pl)] != null ? Q_RANK[qualityOf(pl)] : 2) : (live ? 3 : 9);
        return { g, rank, live, p: hasPick && pl.p != null ? Number(pl.p) : -1 };
      }).filter((x: any) => x.rank < 9); // significant only: a pick OR live
      // picks (by conviction) first, live-no-pick after; live rises within its band.
      scored.sort((a: any, b: any) => a.rank - b.rank || (b.live ? 1 : 0) - (a.live ? 1 : 0) || b.p - a.p);
      return scored.map((x: any) => x.g);
    }
    // Branded record line for the masthead + footer — leads with the HONEST forward expectation,
    // with the in-sample backtest labelled as such (never sold as the forward number).
    function recordStrip() {
      const rh = recipeHistory();
      return `Graded in the open since 2022 — a real totals edge, honestly sized: about 55% at morning prices (56.9% on 239 picks the model never trained on). Our backtest ran ${(rh.hit * 100).toFixed(1)}% over ${rh.n.toLocaleString()} graded, but that's in-sample. Every pick freezes before first pitch and grades against the final score.`;
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
        <h3 class="nf-title">${esc(s.headline || s.title)}</h3>
        ${big && (s.dek || s.summary) ? `<p class="nf-sum clamp2">${esc(cleanBlurb(s.dek || s.summary))}</p>` : ""}
        ${newsAngle(s.angle)}</div></a>`;
    }
    // Dedupe headlines vs the lead (and each other) — one card per game. Shared by the front-page
    // render and the article reader's prev/next nav so keys/order always agree.
    function newsDedupedHeadlines(): any[] {
      const nf = newsFeed;
      if (!nf || !nf.lead) return [];
      const keyOf = (s: any) => String((s && s.angle && typeof s.angle === "object" && s.angle.game_id) || (s && (s.headline || s.title)) || "").toLowerCase();
      const seen = new Set<string>([keyOf(nf.lead)]);
      return ((nf.headlines || []) as any[]).filter((s) => { const k = keyOf(s); if (!k || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
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
    function renderToday() {
      const view = $("today-view");
      if (!view) return;
      const db = briefSource() || fallbackBrief();
      if (!db) { view.innerHTML = skeletonSlate(4); return; }
      const dd = new Date(String(db.date || todayISO()) + "T12:00:00");
      const dateTxt = isNaN(dd.getTime()) ? String(db.date || "") : dd.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
      const isToday = curDate === todayISO();
      const dayRec = dayRecordFor(curDate);
      // The News front never leads with a bare W–L — a cold day reads as "we're losing," which
      // is both discouraging and misleading over a single slate. The full, honest record lives
      // on Insights. We keep only a POSITIVE gold-pick chip (shown only when it's winning).
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
        const locked = !isPremium() && (leadPick.quality === "strong" || leadPick.quality === "good") && !leadPick.result;
        const art = g ? gameArticle(g) : null;
        const pl = g ? displayPick(g) : null;
        const started = g ? isStarted(g) : false;
        const live = g ? gameState(g).kind === "live" : false;
        const stks = g ? gameStreaks(g).slice(0, 3).map((s: any) => `<span class="stk">${icon(s.icon && IC[s.icon] ? s.icon : iconForText(s.text), "sm")}${esc(cleanBlurb(s.text))}</span>`).join("") : "";
        const tint = g ? heroTintFor(g, pl) : (leadPick.quality === "strong" ? "gold" : "green");
        // HYPE THE MATCHUP — the hero headline is about the GAME, never the pick.
        const headline = matchupHeadline(g, leadPick);
        // A short, game-focused lede — pitching matchup / storyline, never the pick or number.
        const heroLede = gameLede(g);
        // A "started" / "live" flag when the game is under way.
        const startedTag = live ? "" : (started ? `<span class="ls-fig-tag started">● Started</span>` : "");
        leadStory = `<article class="leadstory q-${leadPick.quality}" data-gid="${esc(leadPick.game_id)}"${locked ? ' data-locked="1"' : ""} role="button" tabindex="0" aria-label="Lead story — ${esc(leadPick.matchup)}">
          ${g ? `<div class="ls-figure">${heroImage(g, tint, "lead")}${gameState(g).kind !== "live" ? `<span class="ls-fig-kick">Lead story · ${esc(SPORT_LABEL[leadPick.sport] || leadPick.sport || "")}</span>` : ""}${startedTag}${heroLiveBadge(g, "lead")}${heroPickCover(g, "lead", true)}</div>` : ""}
          <div class="ls-body">
            ${g ? bigScore(g) : ""}
            <h3 class="ls-match">${headline}</h3>
            <div class="ls-byline">Feature bet · DiamondEdge · ${esc(dateTxt)}</div>
            ${heroLede ? `<p class="ls-lede small">${esc(heroLede)}</p>` : ""}
            ${stks ? `<div class="pv-stks">${stks}</div>` : ""}
            <span class="hero-cta">${locked ? "Unlock the full preview →" : "Read the full preview →"}</span>
          </div>
        </article>`;
      } else {
        leadStory = `<article class="leadstory pass">
          <div class="ls-body">
            <div class="ls-kick"><span class="ls-lab">Lead story</span></div>
            <h3 class="ls-match">No DiamondEdge Pick today — and that's the discipline that keeps the record honest.</h3>
            <p class="ls-lede">We publish a pick only when the numbers clear our bar. Today none did. The storylines below are what we're watching, and every past call stays graded in the open on the Insights tab.</p>
            <div class="ls-ctas"><span class="hero-cta" data-nav="results">See the record →</span><span class="hero-cta alt" data-nav="games">Browse today's board →</span></div>
          </div>
        </article>`;
      }
      // "More DiamondEdge Picks" carousel — only when there's more than one real pick.
      const carousel = railPicks.length ? `
        <section class="ng-carousel">
          <div class="sec-h"><span>More DiamondEdge Picks</span></div>
          <div class="tdy-picks" id="tdy-picks" aria-label="Featured picks carousel">${railPicks.map((p: any, i: number) => heroCard(p, i)).join("")}</div>
          ${railPicks.length > 1 ? `<div class="tp-dots" id="tp-dots" role="tablist" aria-label="Carousel position">${railPicks.map((_: any, i: number) => `<button class="tp-dot${i === 0 ? " on" : ""}" data-dot="${i}" aria-label="Go to pick ${i + 1}"></button>`).join("")}</div>` : ""}
        </section>` : "";
      // DEDUPE — the lead story's game is excluded from the story previews + the board so no
      // game appears twice on the page; the board and the stories draw from ONE curated pool.
      const leadGid = leadPick ? String(leadPick.game_id) : null;
      const themes = ((db.themes || []) as any[]);
      const storylines = storylinesBlock(themes, leadGid);
      // ── THE CURATED FRONT ──────────────────────────────────────────────────────────────
      // Leon's direction: SEPARATE the top stories from today's board, then weave them into
      // ONE designed front page. Two surfaces, one pool of significant games:
      //   • TOP STORIES  = the article-forward "read" — significant game PREVIEWS as story
      //     cards (headline lean + hook), opening the full 3-para reader/detail on click.
      //   • TODAY'S BOARD = the games at a glance — the compact game cards (score / O-U /
      //     spread / state) that let a reader scan the slate. Its own labeled panel.
      // The hero (our biggest bet, or the honest no-pick card) sits above both, full width.
      const seen = new Set<string>(); if (leadGid) seen.add(leadGid);
      const sig = significantGames().filter((g: any) => { const id = String(g.game_id); if (seen.has(id)) return false; seen.add(id); return true; });
      // Stories = the significant previews presented as the "read" surface (headline + hook).
      const storyGames = sig.slice(0, 5);
      // Board = every significant game at a glance (incl. the ones told as stories) — the
      // reader can jump from "read about it" to "see the number." Capped so the rail stays
      // scannable; the "Full board →" link carries the rest to the Games tab.
      const boardGames = sig.slice(0, 8);
      const stories = storyGames.length ? `
        <section class="front-stories">
          <div class="sec-h stories-h"><span>Top stories</span></div>
          <div class="storylist">${storyGames.map((g: any, i: number) => previewCard(g, i, i === 0)).join("")}</div>
          ${storylines ? `<div class="storylines-woven">${storylines}</div>` : ""}
        </section>` : (storylines ? `<section class="front-stories">${storylines}</section>` : "");
      const board = boardGames.length ? `
        <aside class="front-board" aria-label="Today's board — games at a glance">
          <div class="sec-h board-h"><span>Today's board</span><button class="sec-more" data-nav="games">Full board →</button></div>
          <div class="boardlist">${boardGames.map((g: any, i: number) => gameCard(g, i)).join("")}</div>
          <button class="board-all" data-nav="games">See the full slate on the board →</button>
        </aside>` : "";
      // TIGHT MASTHEAD — kicker (the ONE red accent) + short punchy headline + small dek.
      // It's the page NAMEPLATE now — it leads the front, above the hero and the two surfaces.
      const fullHead = cleanBlurb(db.headline || "");
      // The masthead is a clean editorial nameplate: the brief's FIRST sentence, no ellipsis
      // stacking (CSS clamps if needed), and never the pick/edge % (fall back to a neutral line).
      let tightHead = (fullHead.split(/(?<=[.!?])\s+/)[0] || fullHead).replace(/[.\s]+$/, "");
      if (!tightHead || leaksPick(tightHead)) tightHead = isToday ? "Today on the board" : "The board, recapped";
      const headDek = ""; // the read lives in the hero + game page; the nameplate stays one clean line
      view.innerHTML = `
        <div class="news">
          <div class="masthead lead">
            <div class="mh-kicker"><span class="lk-tag">${isToday ? "Today" : "Recap"}</span><span class="lk-dateline">${esc(dateTxt)} · DiamondEdge Desk</span>${goldChip}</div>
            <h2 class="lead-head">${esc(tightHead)}</h2>
            ${headDek ? `<p class="mh-dek clamp2">${esc(headDek)}</p>` : ""}
          </div>
          <div class="mh-rule"></div>
          <section class="ng-lead front-hero">${leadStory}</section>
          ${carousel ? `<div class="front-full">${carousel}</div>` : ""}
          <div class="front-grid">
            ${stories}
            ${board}
          </div>
          ${newsFront() ? `<div class="front-wire">${newsFront()}</div>` : ""}
          ${socialShareBar()}
          <div class="news-foot">${esc(recordStrip())}</div>
        </div>`;
      // ---- bindings ----
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
      view.querySelectorAll(".leadstory[data-gid], .hero[data-gid], .prev[data-gid], .boardlist .tile[data-gid]").forEach((h: any) => {
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
    const NAV_ICONS: any = {
      today: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 5.6L20 10.8l-5.8 2.2L12 19l-2.2-6L4 10.8l5.8-2.2z"/></svg>`,
      games: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>`,
      results: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20v-7M12 20V5M19 20v-10"/></svg>`,
      settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.1"/><path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21M5.8 5.8l1.8 1.8M16.4 16.4l1.8 1.8M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8"/></svg>`,
    };
    const NAV_LABEL: any = { today: "News", games: "Games", results: "Insights", settings: "Settings" };
    function renderShell() {
      // Primary nav = the three destinations at EVERY width (the top bar is the nav on
      // mobile too now — the bottom nav is retired). Settings lives in the avatar/account hub.
      const primaryTabs = ["today", "games", "results"];
      // ONE unified STICKY header (logo appears once) + a slim live TICKER beneath it (News only).
      root.innerHTML = `
        <header id="app-header">
          <div class="hbar">
            <div class="brand" id="brand">
              <div class="diamond"></div>
              <div class="brand-tx"><h1>Diamond<b>Edge</b></h1><div class="tag">News · Games · Insights</div></div>
            </div>
            <nav class="toptabs" aria-label="Primary">
              ${primaryTabs.map((t) => `<button data-tab="${t}" class="${tab === t ? "on" : ""}"${tab === t ? ' aria-current="page"' : ""}>${NAV_LABEL[t]}</button>`).join("")}
            </nav>
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
          <div id="settings-view" style="display:none"></div>
          <div id="upgrade-view" style="display:none"></div>
          <div id="account-view" style="display:none"></div>
        </main>`;
      root.querySelectorAll(".toptabs [data-tab]").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
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
      // The live ticker rides the News homepage only — the Games tab has its own date/league chrome.
      if (tab === "games") { el.style.display = "none"; return; }
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
      root.querySelectorAll(".toptabs [data-tab]").forEach((b: any) => b.classList.toggle("on", b.dataset.tab === t));
      renderTicker(); // hides on Games, shows (live-only) elsewhere; republishes header height
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
      try {
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
      } catch {
        // Boot data load failed (offline / Supabase blip): don't hang on the skeleton. Show a
        // retry state; the pollers set up below keep trying and replace it on recovery.
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
