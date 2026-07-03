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
    // Soccer: real logos when the payload serves home_logo/away_logo (ESPN fifa.world
    // pass-through); otherwise try the ESPN country-flag CDN off the abbreviation
    // (national teams), with a graceful text-crest fallback on 404 (club teams).
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
    const SPORT_UNIT: any = { mlb: "runs", nba: "pts", nhl: "goals", nfl: "pts", soccer: "goals" };
    const fmtRec = (o: any) => o ? `${o.wins || 0}-${o.losses || 0}${o.pushes ? "-" + o.pushes : ""}` : "—";
    const isISO = (t: any) => /^\d{4}-\d{2}-\d{2}/.test(String(t || ""));
    const isTS = (t: any) => /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(String(t || ""));
    const REDUCE = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const FINE_HOVER = typeof matchMedia !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;
    // The viewer's local timezone abbreviation (e.g. "EDT", "PST") for labelling localized times.
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
    // The calendar day a game belongs to, in the VIEWER's timezone.
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
    // per-side crest for a game object (uses served logo fields when present)
    const gCrest = (g: any, which: "home" | "away", cls = "") =>
      crestImg(g.sport, which === "home" ? g.home_abbr : g.away_abbr, cls, which === "home" ? g.home_logo : g.away_logo);

    const resOf = (pk: any) => (pk && pk.result && pk.result.status ? pk.result.status : null); // hit|miss|push|null
    const tierCls = (t: any) => "tier-" + (t || "low");

    // ===================== SUGGESTED ACTIONS (fallback source for DE Plays) =====================
    // A game carries `suggested_action` only on the live MLB slate. status SUGGEST → surfaced;
    // status ABSTAIN → silent. HOUSE RULE: the hit-rate NEVER renders without the price/ROI.
    const saOf = (g: any) => {
      const sa = g && g.suggested_action;
      return sa && sa.status === "SUGGEST" ? sa : null;
    };
    const saPct = (p: any, d = 0) => (p == null || isNaN(Number(p)) ? "—" : (Number(p) * 100).toFixed(d) + "%");
    const saAm = (p: any) => (p == null || isNaN(Number(p)) ? "—" : (Number(p) > 0 ? "+" + Number(p) : "" + Number(p)));
    // 3-year record + gate stats, from the served track-record block (literal fallbacks = the frozen artifacts)
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

    // ===================== DIAMONDEDGE PLAYS =====================
    // The signature element: per game, per market (spread / total / moneyline), a TAKE (side +
    // confidence) or an explicit PASS. Primary source is the new `de_plays` field; when absent,
    // fall back to `suggested_action` (run-line TAKEs) + PASS for the other markets, so the UI is
    // correct today and automatically richer when de_plays lands.
    const MARKETS = ["spread", "total", "moneyline"];
    const MK_LAB: any = { spread: "Spread", total: "Total", moneyline: "ML" };
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
    // Build the WHY bullet list for a fallback suggested_action play — plain numbers, no hedging.
    function saWhy(sa: any) {
      const w: string[] = [];
      if (sa.model_p_cover != null && sa.market_p_cover != null)
        w.push(`Model has ${sa.side} covering ${saPct(sa.model_p_cover, 1)} of the time vs the market's implied ${saPct(sa.market_p_cover, 1)} — a ${((sa.model_p_cover - sa.market_p_cover) * 100).toFixed(1)}-pt edge in cover probability.`);
      const p = sa.p_correct != null ? sa.p_correct : sa.meta_p;
      if (p != null) w.push(`The gated meta-model puts this play at ${saPct(p, 1)} to cash.`);
      if (sa.price != null) w.push(`${saAm(sa.price)} needs ${saPct(saBreakeven(sa), 1)} to break even; 3-yr hit ${saRecStr(sa)} at ~−184 avg.`);
      if (sa.n_books) w.push(`Priced across ${sa.n_books} sportsbook${sa.n_books > 1 ? "s" : ""} (${sa.market_basis === "perbook_earliest_pregame" ? "earliest pregame lines" : "market consensus"}).`);
      if (sa.reliability != null) w.push(`Line-reliability score ${(Number(sa.reliability) * 100).toFixed(0)}/100 for this matchup.`);
      return w;
    }
    function normPlay(raw: any, mk: string) {
      if (!raw || typeof raw !== "object") return null;
      const action = String(raw.action || "").toUpperCase() === "TAKE" ? "TAKE" : "PASS";
      // VALUE tier plays (paper-tracked breakthrough totals policy) carry
      // tier "value-a"/"value-b" + paper:true — preserved for distinct styling.
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
    const hasTake = (g: any) => { const P = gamePlays(g); return MARKETS.some((m) => P[m].action === "TAKE"); };

    // ===================== THE WINNING RECIPE (VALUE tier) =====================
    // The ONE validated winning strategy: MLB totals at the morning line when BOTH
    // (a) model vs de-vigged morning market gap >= 3 prob points AND (b) books quote
    // >= 2 distinct total lines (the market itself is split = soft line). Fair prices
    // only (-135..+135). Validated 60.9% over 567 bets @ median -106, +15.6% ROI.
    // Everything below teaches that hierarchy at a glance.
    const RECIPE_REC = "60.9% · −106 avg · +15.6% ROI · 567 bets";
    // The two trigger conditions of a VALUE play, with live values off the payload.
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
    const condCheck = `<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path class="chk" d="M2.5 8.5l3.4 3.4L13.5 4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // Collapsible state for the recipe hero — expanded on first-ever view, collapsed on
    // later sessions, user toggle wins; stable within a session.
    let recipeOpenSess: any = null;
    function recipeIsOpen() {
      if (recipeOpenSess != null) return recipeOpenSess;
      let open = true;
      try {
        const s = localStorage.getItem("de_recipe");
        if (s === "open") open = true;
        else if (s === "closed") open = false;
        else if (localStorage.getItem("de_recipe_seen")) open = false;
        else localStorage.setItem("de_recipe_seen", "1");
      } catch {}
      recipeOpenSess = open;
      return open;
    }
    function recipeHero() {
      if (rangeMode || curDate !== todayISO() || league !== "mlb") return "";
      const open = recipeIsOpen();
      return `<section class="recipehero ${open ? "" : "collapsed"}" id="recipehero">
        <button class="rh-bar" id="rh-toggle" aria-expanded="${open}">
          <span class="rh-dia">◆</span>
          <span class="rh-t">The Winning Recipe</span>
          <span class="rh-rec">${RECIPE_REC}</span>
          <span class="rh-chev">▾</span>
        </button>
        <div class="rh-wrap"><div class="rh-inner">
          <div class="rh-steps">
            <div class="rh-step" style="--i:0"><span class="rh-n">1</span><div class="rh-sk">Model vs market</div><div class="rh-sv">gap ≥ 3 pts</div><div class="rh-sd">our de-vigged probability disagrees with the morning market</div></div>
            <span class="rh-arrow" aria-hidden="true">→</span>
            <div class="rh-step" style="--i:1"><span class="rh-n">2</span><div class="rh-sk">Books split</div><div class="rh-sv">≥ 2 total lines</div><div class="rh-sd">the market can't agree on the number — someone's line is soft</div></div>
            <span class="rh-arrow" aria-hidden="true">→</span>
            <div class="rh-step" style="--i:2"><span class="rh-n">3</span><div class="rh-sk">Bet the total</div><div class="rh-sv">model's side · morning line</div><div class="rh-sd">MLB totals only · fair prices only (−135 to +135)</div></div>
          </div>
          <div class="rh-foot">
            <span class="rh-scope">~1 play per slate · most days it doesn't fire — passing IS the strategy</span>
            <button class="rh-how" id="rh-how">How it works →</button>
          </div>
        </div></div>
      </section>`;
    }

    // Today's VALUE plays, hero placement above the game list.
    function todaysValuePlays(games: any[]) {
      const out: any[] = [];
      games.forEach((g: any) => {
        const P = gamePlays(g);
        MARKETS.forEach((mk) => { const pl = P[mk]; if (pl.action === "TAKE" && pl.value_tier) out.push({ g, pl }); });
      });
      out.sort((a, b) => (a.pl.value_tier === "value-a" ? 0 : 1) - (b.pl.value_tier === "value-a" ? 0 : 1));
      return out;
    }
    function valueSpotlight(games: any[]) {
      if (rangeMode || curDate !== todayISO() || league !== "mlb") return "";
      const vp = todaysValuePlays(games);
      if (!vp.length) {
        return `<section class="vspot quiet">
          <div class="vspot-h"><span class="pl-vdia">◆</span><span class="vspot-t">Value Plays</span></div>
          <div class="vq-line">No value plays today — the recipe didn't trigger (that's discipline, not absence).</div>
        </section>`;
      }
      const cards = vp.map(({ g, pl }: any) => {
        const c = valueConds(pl);
        const live = playLiveState(g, pl);
        const r = pl.result;
        let stat = "";
        if (r) {
          stat = r.status === "hit" ? `<span class="pl-res won">${condCheck} WON</span>`
            : r.status === "miss" ? `<span class="pl-res lost">✗ LOST</span>`
            : `<span class="pl-res pushed">PUSH</span>`;
        } else if (live === "clinch-won") stat = `<span class="pl-res clinched">${condCheck} clinched</span>`;
        else if (live === "clinch-lost") stat = `<span class="pl-res lost">✗ LINE PASSED</span>`;
        else if (live === "inplay") stat = `<span class="pl-res inplay"><span class="ip-dot"></span>in play</span>`;
        const ev = pl.claimed_ev != null ? `claimed EV ${(pl.claimed_ev >= 0 ? "+" : "") + (pl.claimed_ev * 100).toFixed(1)}%` : "";
        const shop = pl.shop && pl.shop.price_american != null
          ? `best shop ${esc(String(pl.shop.book || ""))} ${pl.shop.price_american > 0 ? "+" : ""}${pl.shop.price_american}${pl.shop.line != null ? ` @ ${num(pl.shop.line, 1)}` : ""}` : "";
        return `<button class="vs-card" data-gid="${esc(g.game_id)}" aria-label="VALUE play: ${esc(g.away_abbr)} at ${esc(g.home_abbr)}, ${esc(pl.side || "")}">
          <div class="vs-top">
            <span class="vs-mu">${gCrest(g, "away")}${esc(g.away_abbr)}<span class="vs-at">@</span>${gCrest(g, "home")}${esc(g.home_abbr)}</span>
            <span class="vs-badge ${pl.value_tier === "value-b" ? "vb" : ""}">◆ VALUE${pl.value_tier === "value-b" ? " B" : " A"}</span>
            ${pl.paper ? `<span class="vs-paper">PAPER</span>` : ""}
            <span class="vs-stat">${stat}</span>
          </div>
          <div class="vs-bet">${esc(pl.side || "—")}${pl.price != null ? `<span class="vs-px">@ ${fmtOdds(pl.price)}</span>` : ""}</div>
          <div class="vs-conds">
            <span class="vs-cond">${condCheck}${esc(c.gap)}</span>
            <span class="vs-cond">${condCheck}${esc(c.split)}</span>
          </div>
          ${ev || shop ? `<div class="vs-meta">${[ev, shop].filter(Boolean).join(" · ")}</div>` : ""}
        </button>`;
      }).join("");
      return `<section class="vspot">
        <div class="vspot-h"><span class="pl-vdia">◆</span><span class="vspot-t">Today's Value Plays</span><span class="vspot-sub">both triggers fired — this is the winning recipe</span></div>
        <div class="vs-cards">${cards}</div>
      </section>`;
    }
    function bindLead() {
      const rh = $("recipehero"), tg = $("rh-toggle");
      if (rh && tg) tg.onclick = () => {
        const open = !rh.classList.toggle("collapsed");
        recipeOpenSess = open;
        tg.setAttribute("aria-expanded", String(open));
        try { localStorage.setItem("de_recipe", open ? "open" : "closed"); } catch {}
      };
      const how = $("rh-how");
      if (how) how.onclick = (e: any) => { e.stopPropagation(); openRecipeSheet(); };
      root.querySelectorAll(".vs-card[data-gid]").forEach((c: any) => {
        c.onclick = () => { const g = findGame(c.dataset.gid); if (g) openDetail(g, "total"); };
      });
    }

    // Day record across DE Plays (TAKEs only, resolved results only).
    function dayPlaysRecord(games: any[]) {
      let w = 0, l = 0, t = 0, open = 0, takes = 0;
      games.forEach((g: any) => {
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (pl.action !== "TAKE") return;
          takes++;
          const r = pl.result;
          if (!r) { open++; return; }
          if (r.status === "hit") w++; else if (r.status === "miss") l++; else t++;
        });
      });
      return { w, l, t, open, takes, settled: w + l + t };
    }
    // Season-level plays record line — hit-rate and price/ROI always together (house rule).
    function seasonPlaysLine() {
      const dr = payload && payload.de_plays_record;
      if (dr && typeof dr === "object") {
        const parts: string[] = [];
        if (dr.wins != null || dr.losses != null) parts.push(`${dr.wins || 0}–${dr.losses || 0}${dr.pushes ? `–${dr.pushes}` : ""}`);
        const hit = dr.hit_rate != null ? dr.hit_rate : dr.hit;
        if (hit != null && (dr.roi != null || dr.avg_price != null)) {
          parts.push(`${saPct(hit, 1)} hit${dr.avg_price != null ? ` @ ${saAm(dr.avg_price)} avg` : ""}${dr.roi != null ? ` · ${(dr.roi >= 0 ? "+" : "") + (dr.roi * 100).toFixed(1)}% ROI` : ""}`);
        }
        if (dr.n != null) parts.push(`n=${dr.n}`);
        if (parts.length) return parts.join(" · ");
      }
      const T = saTrack();
      const fwd = T.fwd && T.fwd.n_settled ? ` · live ${saPct(T.fwd.hit, 1)} (${T.fwd.n_settled})` : "";
      return `${saPct(T.g26.hit, 1)} hit @ −184 avg · ${(T.g26.roi * 100).toFixed(1)}% ROI · n=${T.g26.n} (’26)${fwd}`;
    }

    // ===================== STATE =====================
    let tab = "scores";             // "scores" | "analyzer"
    let league = "mlb";             // selected league
    let curDate = todayISO();       // selected date (ISO)
    let histOpen = false;           // history range panel open
    let rangeFrom = "", rangeTo = "";
    let rangeMode = false;          // showing range results
    let rangeGames: any[] = [];     // {date,games}
    let payload: any = null;        // current day's payload
    let indexData: any = null;      // pregame_picks_index
    let detail: any = null;         // open detail game

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
      let inLg = all.filter((g: any) => (g.sport || "").toLowerCase() === lg);
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
      if (st === "final") return { kind: "final", label: "Final", time: "", score: actualScore(g), si };
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
    // Animated number counters: elements carry data-count (target), data-dec, data-suf, data-loc.
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
    // Subtle 3D tilt on desktop hover (hero tiles only) — transforms only, disabled
    // for reduced motion / touch.
    function bindTilt(scope: any) {
      if (REDUCE || !FINE_HOVER) return;
      scope.querySelectorAll(".tile.hero").forEach((card: any) => {
        card.addEventListener("pointermove", (e: any) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.8).toFixed(2)}deg) translateY(-2px)`;
        });
        card.addEventListener("pointerleave", () => { card.style.transform = ""; });
      });
    }
    // Pull-to-refresh (touch): pull down from the top of the scores feed to reload the day.
    let ptrBound = false;
    function bindPull() {
      if (ptrBound) return; ptrBound = true;
      let y0: any = null, pull = 0, on = false;
      document.addEventListener("touchstart", (e: any) => {
        if (window.scrollY <= 0 && tab === "scores" && !detail) { y0 = e.touches[0].clientY; on = true; pull = 0; }
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

    // ===================== SHARED VISUALS (sheet) =====================
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

    // ===================== GAME CARD =====================
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
    // Compact sportsbook odds row: spread · total · moneyline.
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

    // ---- compact-tile helpers (CBS-density grid) ----
    const resMark = (st: string, small = false) => {
      const sz = small ? 9 : 10;
      return st === "hit"
        ? `<svg viewBox="0 0 16 16" width="${sz}" height="${sz}" aria-hidden="true"><path class="chk" d="M2.5 8.5l3.4 3.4L13.5 4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
        : st === "miss" ? "✗" : "P";
    };
    // A play's display state: won|lost|pushed|clinched|cooked|inplay|open
    function playState(g: any, pl: any) {
      const r = pl.result;
      if (r) return r.status === "hit" ? "won" : r.status === "miss" ? "lost" : "pushed";
      const live = playLiveState(g, pl);
      return live === "clinch-won" ? "clinched" : live === "clinch-lost" ? "cooked" : live === "inplay" ? "inplay" : "open";
    }
    // TAKEs ordered for the tile micro-lines: VALUE first, then total > spread > ML.
    function tileTakes(g: any, P: any) {
      const prio: any = { total: 0, spread: 1, moneyline: 2 };
      return MARKETS.map((mk) => P[mk])
        .filter((p: any) => p.action === "TAKE")
        .sort((a: any, b: any) => ((b.value_tier ? 4 : 0) - (a.value_tier ? 4 : 0)) || (prio[a.market] - prio[b.market]));
    }
    // ONE compact DE-play micro-line: "◆ UNDER 12 −112 · 63%" (+ ✓/✗ state tint).
    function playMicro(g: any, pl: any) {
      const st = playState(g, pl);
      const vCls = pl.value_tier ? ` value ${pl.value_tier === "value-a" ? "va" : "vb"}` : " acc";
      const mark = st === "won" || st === "clinched" ? `<span class="tp-res won">${resMark("hit", true)}</span>`
        : st === "lost" || st === "cooked" ? `<span class="tp-res lost">✗</span>`
        : st === "pushed" ? `<span class="tp-res pushed">P</span>`
        : st === "inplay" ? `<span class="tp-res inplay"><span class="ip-dot"></span></span>` : "";
      const conf = pl.p != null ? ` · ${saPct(pl.p)}` : "";
      const px = pl.price != null ? ` ${fmtOdds(pl.price)}` : "";
      return `<button class="t-play${vCls} ${st}" data-gid="${esc(g.game_id)}" data-mk="${pl.market}"
        aria-label="${pl.value_tier ? "VALUE " : ""}${MK_FULL[pl.market]} play: ${esc(pl.side || "")}">
        <span class="tp-dia">◆</span><span class="tp-txt">${esc(pl.side || "—")}${px}${conf}</span>
        ${pl.paper ? `<span class="tp-paper">P</span>` : ""}${mark}
      </button>`;
    }
    // Compact Vegas line: "O/U 8.5 · CLE −1.5" (soccer: O/U + 1X2 prices).
    function tileVegas(g: any) {
      const parts: string[] = [];
      const tp = g.total_pick;
      if (tp && tp.line != null) parts.push(`O/U ${num(tp.line)}`);
      const sp = g.spread_pick;
      if (sp && sp.line != null) parts.push(`${esc(g.home_abbr)} ${sgn(spreadHomeLine(g, sp))}`);
      else {
        const mp = g.ml_pick, pr = (mp && mp.prices) || {};
        if (g.sport === "soccer" && pr.home != null && pr.draw != null && pr.away != null) parts.push(`${fmtOdds(pr.home)}·${fmtOdds(pr.draw)}·${fmtOdds(pr.away)}`);
        else if (mp && mp.side && (mp.price ?? pr.home ?? pr.away) != null) parts.push(`ML ${esc(mp.side)} ${fmtOdds(mp.price ?? pr.home ?? pr.away)}`);
      }
      return parts.length ? `<div class="t-vegas">${parts.join(" · ")}</div>` : "";
    }
    // Tile status strip: "Mid 8th" / "FINAL" / "7:10 PM" (+ competition / day tag right).
    function tileStatus(g: any, gs: any) {
      let left = "";
      if (gs.kind === "live") left = `<span class="ts-live"><span class="livedot"></span>${esc(gs.label !== "Live" && gs.label ? gs.label : "LIVE")}</span>`;
      else if (gs.kind === "final") left = `<span class="ts-final">FINAL</span>`;
      else {
        const t = gs.si.hasTime && gs.si.time ? gs.si.time.replace(TZ_ABBR ? " " + TZ_ABBR : " ", "") : (gs.si.date || "TBD");
        left = `<span class="ts-time">${esc(t)}</span>`;
      }
      const dayTag = gs.kind === "pre" && gameLocalDay(g) && gameLocalDay(g) !== curDate ? `<span class="ts-day">${esc(gs.si.date)}</span>` : "";
      const comp = g.meta && g.meta.competition ? `<span class="ts-comp">${esc(g.meta.competition)}</span>` : "";
      return `<div class="t-status">${left}${dayTag || comp}</div>`;
    }
    function tileRow(g: any, which: "away" | "home", gs: any, hero = false) {
      const ab = which === "away" ? g.away_abbr : g.home_abbr;
      const name = which === "away" ? (g.away_team || g.away_abbr) : (g.home_team || g.home_abbr);
      const sc = gs.score;
      let scoreHtml = "", winner = false, loser = false;
      if (gs.kind !== "pre" && sc && sc.split && sc.home != null) {
        const mine = which === "home" ? sc.home : sc.away;
        const other = which === "home" ? sc.away : sc.home;
        winner = gs.kind === "final" && mine > other;
        loser = gs.kind === "final" && mine < other;
        scoreHtml = `<span class="t-score${gs.kind === "live" ? " live" : ""}" data-count="${num(mine, 0)}">${num(mine, 0)}</span>`;
      }
      // hero rows carry the sub-line (pitcher / L10 form) — compact tiles defer it to the sheet
      let sub = "";
      if (hero) {
        const pi = g.pregame_intel || {};
        const pit = (pi.pitchers || {})[which] || {};
        const form = (pi.form || {})[which] || {};
        if (pit.name) sub = `${esc(pit.name.split(" ").slice(-1)[0])}${pit.era != null ? ` · ${num(pit.era, 2)} ERA` : ""}`;
        else if (form.last10_record) sub = `L10 ${esc(form.last10_record)}`;
      }
      return `<div class="t-row ${winner ? "winner" : ""} ${loser ? "loser" : ""}">
        <span class="t-crest">${gCrest(g, which)}</span>
        <span class="t-ab">${esc(ab)}</span>
        ${hero ? `<span class="t-nm">${esc(name)}</span>` : ""}
        ${sub ? `<span class="t-sub">${sub}</span>` : ""}
        ${scoreHtml}
      </div>`;
    }

    // The 2-col-span HERO tile: VALUE games (gold-edged) + featured live games.
    function heroTile(g: any, idx: number, gs: any, P: any, vPlay: any) {
      const takes = tileTakes(g, P);
      const lead = vPlay || takes[0] || null;
      const ps = g.predicted_score || {};
      const predTxt = ps.away != null && ps.home != null
        ? `<span class="h-pred">pred <b>${esc(g.away_abbr)} ${num(ps.away, 1)}–${num(ps.home, 1)} ${esc(g.home_abbr)}</b></span>` : "";
      const pk = lead ? (lead.market === "spread" ? g.spread_pick : lead.market === "total" ? g.total_pick : g.ml_pick) : g.total_pick;
      const ring = confRing(pk || g.total_pick || g.spread_pick);
      let conds = "";
      if (vPlay) {
        const c = valueConds(vPlay);
        conds = `<div class="h-conds"><span class="vs-cond">${condCheck}${esc(c.gap)}</span><span class="vs-cond">${condCheck}${esc(c.split)}</span></div>`;
      }
      const rest = takes.filter((p: any) => p !== lead);
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-vegas">${num(gs.score.total, 0)} ${SPORT_UNIT[g.sport] || ""} total</div>` : "";
      return `<article class="tile hero ${gs.kind}${vPlay ? " isvalue" : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)} — open deep dive">
        ${tileStatus(g, gs)}
        <div class="h-main">
          <div class="t-teams">${tileRow(g, "away", gs, true)}${tileRow(g, "home", gs, true)}</div>
          <div class="h-side">${ring}${predTxt}</div>
        </div>
        ${totOnly}
        ${lead ? `<div class="h-play">${playMicro(g, lead)}${rest.length ? `<span class="h-more">+${rest.length}</span>` : ""}</div>` : ""}
        ${conds}
        ${tileVegas(g)}
      </article>`;
    }

    function gameCard(g: any, idx: number) {
      const gs = gameState(g);
      const P = gamePlays(g);
      const vPlay = MARKETS.map((mk) => P[mk]).find((p: any) => p.action === "TAKE" && p.value_tier) || null;
      // HERO: any VALUE-play game, plus featured live games.
      if (vPlay || (gs.kind === "live" && g.featured)) return heroTile(g, idx, gs, P, vPlay);
      const takes = tileTakes(g, P);
      const anyTake = takes.length > 0;
      // total-only score (no home/away split available)
      const totOnly = gs.kind !== "pre" && gs.score && !gs.score.split && gs.score.total != null
        ? `<div class="t-vegas">${num(gs.score.total, 0)} ${SPORT_UNIT[g.sport] || ""} total</div>` : "";
      return `<article class="tile ${gs.kind}${anyTake ? " has-play" : ""}" data-gid="${esc(g.game_id || idx)}" style="--i:${Math.min(idx, 14)}" role="button" tabindex="0"
        aria-label="${esc(g.away_abbr)} at ${esc(g.home_abbr)} — open deep dive">
        ${tileStatus(g, gs)}
        <div class="t-teams">${tileRow(g, "away", gs)}${tileRow(g, "home", gs)}</div>
        ${totOnly}
        ${anyTake ? `<div class="t-plays">${takes.slice(0, 2).map((p: any) => playMicro(g, p)).join("")}</div>` : ""}
        ${tileVegas(g)}
      </article>`;
    }

    // ===================== PLAYS RECORD BAND (sticky) =====================
    function playsBand(games: any[]) {
      const r = dayPlaysRecord(games);
      const season = seasonPlaysLine();
      const recCls = r.settled ? (r.w > r.l ? "up" : r.w < r.l ? "down" : "even") : "pending";
      const today = r.takes
        ? `<span class="pb-rec"><b class="w" data-count="${r.w}">${r.w}</b><i>–</i><b class="l" data-count="${r.l}">${r.l}</b>${r.t ? `<i>–</i><b class="t">${r.t}</b>` : ""}</span>${r.open ? `<span class="pb-open">${r.open} open</span>` : ""}`
        : `<span class="pb-none">no plays today</span>`;
      return `<div class="playsband ${recCls}">
        <span class="pb-k"><span class="pb-dia">◆</span>DiamondEdge Plays</span>
        ${today}
        <span class="pb-season">${esc(season)}</span>
      </div>`;
    }

    // Recently-graded plays from the payload's finals tail (prior days) — shown as a compact
    // results rail on the today view so ✓/✗ results are always visible without polluting the
    // day slate. Works off de_plays when present, suggested_action otherwise.
    function recentResultsRail() {
      if (rangeMode || curDate !== todayISO() || !payload) return "";
      const t = todayISO();
      const graded: any[] = [];
      ((payload.games || []) as any[]).forEach((g: any) => {
        if ((g.sport || "").toLowerCase() !== league) return;
        const d = gameLocalDay(g);
        if (d && d >= t) return; // today's results show on the cards themselves
        const P = gamePlays(g);
        MARKETS.forEach((mk) => {
          const pl = P[mk];
          if (pl.action === "TAKE" && pl.result) graded.push({ g, pl, d: d || "" });
        });
      });
      if (!graded.length) return "";
      graded.sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
      let w = 0, l = 0, p = 0;
      graded.forEach((x) => { if (x.pl.result.status === "hit") w++; else if (x.pl.result.status === "miss") l++; else p++; });
      const chips = graded.slice(0, 12).map(({ g, pl, d }: any) => {
        const st = pl.result.status;
        const cls = st === "hit" ? "won" : st === "miss" ? "lost" : "pushed";
        const mark = st === "hit"
          ? `<span class="pl-res won"><svg viewBox="0 0 16 16" width="11" height="11"><path class="chk" d="M2.5 8.5l3.4 3.4L13.5 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
          : st === "miss" ? `<span class="pl-res lost">✗</span>` : `<span class="pl-res pushed">P</span>`;
        const day = d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
        return `<button class="rr-chip ${cls}" data-gid="${esc(g.game_id)}" data-mk="${pl.market}">
          <span class="rr-mu">${esc(g.away_abbr)}@${esc(g.home_abbr)}</span>
          <span class="rr-side">${esc(pl.side || "")}</span>
          ${pl.price != null ? `<span class="rr-px">${fmtOdds(pl.price)}</span>` : ""}
          ${mark}
          ${day ? `<span class="rr-day">${esc(day)}</span>` : ""}
        </button>`;
      }).join("");
      return `<div class="resultsrail">
        <div class="rr-head"><span class="rr-k"><span class="gp-dia">◆</span>Recent Play Results</span><span class="rr-rec"><b class="w">${w}</b>–<b class="l">${l}</b>${p ? `–<b class="t">${p}</b>` : ""} last ${graded.length} plays</span></div>
        <div class="rr-list">${chips}</div>
      </div>`;
    }

    // ===================== SCORES TAB =====================
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
        return `<button class="sporttab ${lg === league ? "on" : ""}" data-lg="${lg}">${SPORT_LABEL[lg]}<span class="cnt" id="cnt-${lg}">${cnt || ""}</span></button>`;
      }).join("");
      root.querySelector("#scores-view").innerHTML = `
        <div id="ptr"><div class="ptr-inner"><span class="ptr-sp"></span><span class="ptr-txt">release to refresh</span></div></div>
        <div class="subhead">
          <div class="sporttabs" id="sporttabs">${tabsHtml}<span class="tab-ink" id="tab-ink"></span></div>
          <div id="band-area"></div>
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
          <span class="rnote">Scans each day's ${SPORT_LABEL[league]} board across ${minDate.slice(0, 4)}–${maxDate.slice(0, 4)}.</span>
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

    function renderSlate() {
      const body = $("slate-body"), band = $("band-area");
      if (!body) return;
      if (rangeMode) {
        if (band) band.innerHTML = "";
        body.innerHTML = renderRangeBody();
      } else if (!payload) {
        if (band) band.innerHTML = "";
        body.innerHTML = skeletonSlate();
        return;
      } else {
        const games = gamesForLeague(payload, league);
        const dispDate = new Date(curDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
        if (band) band.innerHTML = playsBand(games);
        // The strategy hierarchy leads the feed: recipe hero, then today's VALUE
        // spotlight, then the game list.
        const lead = recipeHero() + valueSpotlight(games);
        if (!games.length) {
          body.innerHTML = `${lead}<div class="state"><div class="st-ico">${SPORT_LABEL[league]}</div><div class="big">No ${SPORT_LABEL[league]} games</div><div class="sm">Nothing on the board for ${esc(dispDate)}. Try another league or date.</div></div>`;
        } else {
          body.innerHTML = `${lead}${recentResultsRail()}<div class="slate">${games.map((g: any, i: number) => gameCard(g, i)).join("")}</div>
            <div class="refnote">${games.length} ${SPORT_LABEL[league]} game${games.length > 1 ? "s" : ""} · ${esc(dispDate)} · <button class="refnote-link" id="open-analyzer">DiamondEdge model analyzer →</button></div>`;
        }
      }
      // update tab counts in place
      SPORTS.forEach((lg) => { const el = $("cnt-" + lg); if (el) { const c = payload ? gamesForLeague(payload, lg).length : 0; el.textContent = c || ""; } });
      const oa = $("open-analyzer"); if (oa) oa.onclick = () => switchTab("analyzer");
      bindCards();
      bindLead();
      animateCounters(body);
      if (band) animateCounters(band);
      bindTilt(body);
    }

    function renderRangeBody() {
      if (!rangeGames.length) return `<div class="state"><div class="big">No ${SPORT_LABEL[league]} games in range</div><div class="sm">Try a wider range or another league.</div></div>`;
      let html = "";
      let N = 0, W = 0, L = 0, T = 0;
      rangeGames.forEach((day: any) => {
        const games = gamesForLeague({ games: day.games }, league);
        if (!games.length) return;
        const dr = dayPlaysRecord(games);
        N += games.length; W += dr.w; L += dr.l; T += dr.t;
        const dd = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
        html += `<div class="dayhdr"><span class="dh-date">${esc(dd)}</span><span class="dh-rr">${games.length} game${games.length > 1 ? "s" : ""}${dr.settled ? ` · plays ${dr.w}-${dr.l}${dr.t ? "-" + dr.t : ""}` : ""}</span></div>`;
        html += `<div class="slate">${games.map((g: any, i: number) => gameCard(g, i)).join("")}</div>`;
      });
      html += `<div class="refnote">${N} ${SPORT_LABEL[league]} games across ${rangeGames.length} day${rangeGames.length > 1 ? "s" : ""}${W + L + T ? ` · plays ${W}-${L}${T ? "-" + T : ""}` : ""}</div>`;
      return html;
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
      window.addEventListener("resize", () => { positionInk(); recenterStrip(false); });
    }
    function bindHist() {
      const rf = $("range-from"); if (rf) rf.onchange = () => (rangeFrom = rf.value);
      const rt = $("range-to"); if (rt) rt.onchange = () => (rangeTo = rt.value);
      const rg = $("range-go"); if (rg) rg.onclick = () => runRange();
      const rc = $("range-clear"); if (rc) rc.onclick = () => { rangeMode = false; refreshStrip(); renderSlate(); };
    }
    // Wire the date chips + smooth-slide the active one to centre (direct scrollLeft — no page jump).
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
      const present = leaguesPresent(payload);
      if (!present.has(league) && present.size) {
        league = SPORTS.find((s) => present.has(s)) || league;
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
      root.querySelectorAll(".t-play[data-gid], .rr-chip[data-gid]").forEach((ch: any) => {
        ch.onclick = (e: any) => { e.stopPropagation(); const g = findGame(ch.dataset.gid); if (g) openDetail(g, ch.dataset.mk); };
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

    // ===================== DEEP-DIVE SHEET =====================
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

    // One market's DE Play inside the sheet: action, why-bullets, model-vs-market, line move.
    function sheetPlay(g: any, pl: any, focus: boolean) {
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
        const vBadge = pl.value_tier
          ? `<span class="shp-vbadge ${pl.value_tier === "value-a" ? "va" : "vb"}"><span class="pl-vdia">◆</span>VALUE ${pl.value_tier === "value-a" ? "A" : "B"}</span>${pl.paper ? `<span class="shp-paper">PAPER</span>` : ""}`
          : "";
        head = `<div class="shp-head take ${rCls} ${pl.value_tier ? "is-value" : ""}">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          ${vBadge}
          ${!pl.value_tier ? `<span class="shp-accbadge">accuracy play</span>` : ""}
          <span class="shp-act">TAKE</span>
          <span class="shp-side">${esc(pl.side || "—")}</span>
          ${pl.price != null ? `<span class="shp-px">${fmtOdds(pl.price)}</span>` : ""}
          ${pl.p != null ? `<span class="shp-p">${saPct(pl.p, 1)} conf</span>` : ""}
          ${pl.tier ? `<span class="shp-tier">${esc(pl.tier)}</span>` : ""}
          ${resTxt ? `<span class="shp-res ${rCls || "inplay"}">${resTxt}</span>` : ""}
        </div>`;
      } else {
        head = `<div class="shp-head pass">
          <span class="shp-mk">${MK_FULL[mk]}</span>
          <span class="shp-act pass">PASS</span>
          <span class="shp-passnote">no edge cleared the gate in this market</span>
        </div>`;
      }
      // VALUE play leads with the recipe conditions met + claimed EV + shop price.
      let recipeBlk = "";
      if (pl.action === "TAKE" && pl.value_tier) {
        const c = valueConds(pl);
        recipeBlk = `<div class="shp-recipe">
          <div class="sr-h"><span class="pl-vdia">◆</span> Recipe conditions met</div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.gap)}</b>${c.gapSub ? ` <span class="sr-sub">${esc(c.gapSub)}</span>` : ""} <span class="sr-need">needs ≥ ${c.need}</span></div>
          <div class="sr-row"><span class="sr-ck">✓</span><b>${esc(c.split)}</b> <span class="sr-sub">the market is split — someone's line is soft</span></div>
          <div class="sr-chips">
            ${pl.claimed_ev != null ? `<span class="mvm-chip ${pl.claimed_ev >= 0 ? "pos" : "neg"}">claimed EV ${(pl.claimed_ev >= 0 ? "+" : "") + (pl.claimed_ev * 100).toFixed(1)}%</span>` : ""}
            ${pl.price != null ? `<span class="mvm-chip">morning line ${fmtOdds(pl.price)}</span>` : ""}
            ${pl.shop && pl.shop.price_american != null ? `<span class="mvm-chip be">best shop ${esc(String(pl.shop.book || ""))} ${pl.shop.price_american > 0 ? "+" : ""}${pl.shop.price_american}${pl.shop.line != null ? ` @ ${num(pl.shop.line, 1)}` : ""}</span>` : ""}
          </div>
        </div>`;
      }
      // Regular TAKE = accuracy play: honest framing, right up front.
      const accNote = pl.action === "TAKE" && !pl.value_tier
        ? `<div class="shp-accnote"><b>Accuracy play</b> — picks like this hit ~60–63% of the time, but at prices where that's roughly breakeven money. A good prediction, not a proven edge. The gold <b>◆ VALUE</b> plays are the winning strategy.</div>` : "";
      const why = pl.why && pl.why.length
        ? `<ul class="shp-why">${pl.why.map((w: any) => `<li>${esc(w)}</li>`).join("")}</ul>` : "";
      // model vs market numbers for this market
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
      const vrec = pl.value_tier ? valueRecordBlock(pl) : "";
      return `<div class="shp ${pl.action === "TAKE" ? "is-take" : "is-pass"} ${pl.value_tier ? "is-value" : ""} ${focus ? "hl" : ""}" id="shp-${mk}">
        ${head}${recipeBlk}${accNote}${why}${mvm}${viz}${vrec}
      </div>`;
    }

    // VALUE tier record inside the sheet: frozen validation + June gate + the
    // growing PAPER forward ledger (hit never shown without price/ROI).
    function valueRecordBlock(pl: any) {
      const vr = payload && payload.value_record;
      if (!vr) return "";
      const fwd = vr.forward || {};
      const fRow = (lab: string, o: any) => {
        if (!o || !o.n_settled) return `<tr><td>${esc(lab)}</td><td class="num">0</td><td class="num">—</td><td class="num">—</td></tr>`;
        const ci = o.hit_ci95;
        const hit = o.hit != null ? `${saPct(o.hit, 1)}${ci && ci[0] != null ? ` <span class="vr-ci">[${saPct(ci[0], 0)}–${saPct(ci[1], 0)}]</span>` : ""}` : "—";
        const roi = o.roi != null ? `<span class="${o.roi >= 0 ? "pos" : "neg"}">${(o.roi >= 0 ? "+" : "") + (o.roi * 100).toFixed(1)}%</span>` : "—";
        return `<tr><td>${esc(lab)} <span class="vr-rec">${esc(o.record || "")}</span></td><td class="num">${o.n_settled}</td><td class="num">${hit}</td><td class="num">${roi}</td></tr>`;
      };
      const shopRow = pl.shop && pl.shop.price_american != null
        ? `<div class="vr-shop">best shop: ${esc(String(pl.shop.book || ""))} ${pl.shop.price_american > 0 ? "+" : ""}${pl.shop.price_american} @ ${num(pl.shop.line, 1)}</div>` : "";
      return `<div class="shp-vrec">
        <div class="vr-h"><span class="pl-vdia">◆</span> VALUE tier record <span class="vr-papertag">paper-tracked</span></div>
        <div class="vr-line">${esc(vr.val_record || "")}</div>
        <div class="vr-line">${esc(vr.gate || "")}</div>
        <table class="dsa-tab vr-tab">
          <thead><tr><th>Forward (paper)</th><th>n</th><th>Hit</th><th>ROI</th></tr></thead>
          <tbody>${fRow("Tier A", fwd.tier_a)}${fRow("Tier A+B", fwd.tier_ab)}${fRow("Tier A shopped", fwd.tier_a_shopped)}</tbody>
        </table>
        ${shopRow}
        <div class="vr-foot">${esc(vr.claimed_forward || "")}. Real stakes only after the scaling gate (≥3 months, ≥150 tier-A bets, hit ≥ breakeven, ROI ≥ 0).</div>
      </div>`;
    }

    // Plays track-record context table — record and price/ROI side by side, always.
    function playsTrackTable() {
      const T = saTrack();
      const ci = T.g26.hit_ci95;
      const row = (lab: string, o: any) => o ? `<tr><td>${esc(lab)}</td><td class="num">${(o.n || 0).toLocaleString()}</td><td class="num">${o.hit != null ? saPct(o.hit, 1) : "—"}</td><td class="num ${o.roi != null && o.roi >= 0 ? "pos" : "neg"}">${o.roi != null ? (o.roi >= 0 ? "+" : "") + (o.roi * 100).toFixed(1) + "%" : "—"}</td></tr>` : "";
      const fwdRow = T.fwd && T.fwd.n_settled ? row("Live (forward)", { n: T.fwd.n_settled, hit: T.fwd.hit, roi: T.fwd.roi }) : "";
      return `<div class="shp-track">
        <div class="shp-track-h">Play track record</div>
        <table class="dsa-tab">
          <thead><tr><th>Window</th><th>n</th><th>Hit</th><th>ROI</th></tr></thead>
          <tbody>${row("2024 validation", T.v24)}${row("2025 test", T.t25)}${row("2026 gate", T.g26)}${fwdRow}</tbody>
        </table>
        <div class="dsa-foot">2026 gate: ${saPct(T.g26.hit, 1)}${ci ? ` (CI ${saPct(ci[0], 1)}–${saPct(ci[1], 1)})` : ""} on ${T.g26.n} plays at ~−184 avg · blind dog +1.5 baseline hit ${saPct(T.base.hit, 1)} / ${(T.base.roi * 100).toFixed(1)}% ROI in ’26.</div>
      </div>`;
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
        <div class="dbet-top">
          <div class="dmk">${esc(label)}</div>
          <div class="dmid"><div class="dside">${esc(pk.side)}</div><div class="dline">${line}</div></div>
          <div class="dright">${confRing(pk)}<div class="dtier ${tierCls(tier)}">${esc(tier)}</div>${resTxt ? `<div class="dres ${st}">${resTxt}</div>` : ""}</div>
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
      const anyTake = MARKETS.some((m) => P[m].action === "TAKE");

      // score banner (live/final) with animated counters
      let scoreBanner = "";
      if (gs.score && gs.score.split && gs.score.home != null) {
        scoreBanner = `<div class="sh-score ${gs.kind}">
          <span class="shs-side"><span class="shs-ab">${esc(g.away_abbr)}</span><b data-count="${num(gs.score.away, 0)}">${num(gs.score.away, 0)}</b></span>
          <span class="shs-mid">${gs.kind === "final" ? "Final" : `<span class="livedot"></span>${esc(gs.label)}`}</span>
          <span class="shs-side"><b data-count="${num(gs.score.home, 0)}">${num(gs.score.home, 0)}</b><span class="shs-ab">${esc(g.home_abbr)}</span></span>
        </div>`;
      } else if (gs.score && gs.score.total != null) {
        scoreBanner = `<div class="sh-score ${gs.kind}"><span class="shs-mid">${gs.kind === "final" ? "Final" : "Live"}</span><span class="shs-tot">${num(gs.score.total, 0)} ${SPORT_UNIT[sp] || ""}</span></div>`;
      }

      // VALUE plays lead the sheet — the winning recipe outranks accuracy plays.
      const mksOrdered = MARKETS.slice().sort((a, b) => (P[b].value_tier ? 1 : 0) - (P[a].value_tier ? 1 : 0));
      const plays = `<div class="dsec de-dsec">
        <div class="dsec-h"><span class="gp-dia">◆</span> DiamondEdge Plays</div>
        <div class="dsec-b shp-wrap">
          ${mksOrdered.map((mk) => sheetPlay(g, P[mk], focusMk === mk)).join("")}
          ${anyTake ? playsTrackTable() : `<div class="shp-none">No plays today — the gate passed on all three markets. The model read below is context, not a bet.</div>`}
        </div>
      </div>`;

      const bets = [detailBet(g.spread_pick, "Spread", "spread", g), detailBet(g.ml_pick, "Moneyline", "ml", g), detailBet(g.total_pick, "Total", "total", g)].filter(Boolean).join("");
      const reasoning = g.why && g.why.reasoning ? `<div class="dsec"><div class="dsec-h">Why This Read</div><div class="dsec-b reasoning">${esc(g.why.reasoning)}${g.why.chosen_rationale ? `<div class="rr2">${esc(g.why.chosen_rationale)}</div>` : ""}</div></div>` : "";

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
            <div class="dsec"><div class="dsec-h">Sportsbook Lines</div>${oddsRow(g)}</div>
            ${plays}
            <div class="dsec">
              <div class="dsec-h">Predicted Final Score</div>
              <div class="dsec-b">
                <div class="dscore">
                  <div class="tm ${!homeWin ? "win" : ""}">${gCrest(g, "away")}<div class="pts">${num(ps.away, 1)}</div><div class="ab">${esc(g.away_abbr)}</div></div>
                  <div class="dx">–</div>
                  <div class="tm ${homeWin ? "win" : ""}">${gCrest(g, "home")}<div class="pts">${num(ps.home, 1)}</div><div class="ab">${esc(g.home_abbr)}</div></div>
                </div>
                <div class="dscore-foot">Edge: <b>${esc(ps.winner_abbr || "—")}</b> by <b>${ps.margin != null ? Math.abs(Number(ps.margin)).toFixed(1) : "—"}</b> · projected total <b>${tot} ${SPORT_UNIT[sp] || ""}</b></div>
              </div>
            </div>
            <div class="dsec"><div class="dsec-h">Model Leans (all markets)</div><div class="dsec-b" style="padding-top:4px;padding-bottom:4px">${bets || `<div style="padding:10px 0;color:var(--ink3);font-size:12px">No graded model leans for this game.</div>`}</div></div>
            ${intelSection(g)}
            ${modelsVsMarket(g)}
            ${reasoning}
          </div>
        </div>`;

      let layer = $("sheet-layer");
      if (!layer) { layer = document.createElement("div"); layer.id = "sheet-layer"; document.body.appendChild(layer); }
      layer.innerHTML = html;
      document.body.classList.add("sheet-open");
      $("sheet-close").onclick = closeDetail;
      $("sheet-bg").onclick = closeDetail;
      bindSheetDrag($("sheet"), $("sh-grab"));
      const sheetEl = $("sheet");
      animateCounters(sheetEl);
      if (focusMk) {
        const t = $("shp-" + focusMk);
        if (t) setTimeout(() => t.scrollIntoView({ block: "center", behavior: REDUCE ? "auto" : "smooth" }), 380);
      }
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
    // ===================== RECIPE EXPLAINER SHEET =====================
    // Full "How it works" for the winning recipe: why market-error + soft-line
    // detection wins where out-predicting Vegas failed, the validation table
    // (val / gate / forward paper), and the honest status.
    function openRecipeSheet() {
      detail = { _recipe: true };
      const vr = (payload && payload.value_record) || {};
      const fwd = vr.forward || {};
      const fRow = (lab: string, o: any) => {
        if (!o || !o.n_settled) return `<tr><td>${esc(lab)}</td><td class="num">0</td><td class="num">—</td><td class="num">—</td></tr>`;
        const ci = o.hit_ci95;
        const hit = o.hit != null ? `${saPct(o.hit, 1)}${ci && ci[0] != null ? ` <span class="vr-ci">[${saPct(ci[0], 0)}–${saPct(ci[1], 0)}]</span>` : ""}` : "—";
        const roi = o.roi != null ? `<span class="${o.roi >= 0 ? "pos" : "neg"}">${(o.roi >= 0 ? "+" : "") + (o.roi * 100).toFixed(1)}%</span>` : "—";
        return `<tr><td>${esc(lab)} <span class="vr-rec">${esc(o.record || "")}</span></td><td class="num">${o.n_settled}</td><td class="num">${hit}</td><td class="num">${roi}</td></tr>`;
      };
      const html = `
        <div class="sheet-bg" id="sheet-bg"></div>
        <div class="sheet" id="sheet" role="dialog" aria-modal="true">
          <div class="sh-grab" id="sh-grab"><span></span></div>
          <div class="sh-head gold">
            <button class="close" id="sheet-close" aria-label="Close">✕</button>
            <div class="sh-sport">DiamondEdge · Value Tier</div>
            <div class="rcp-title"><span class="pl-vdia">◆</span>The Winning Recipe</div>
            <div class="sh-meta">MLB totals at the morning line · ${RECIPE_REC}</div>
          </div>
          <div class="sh-body">
            <div class="dsec">
              <div class="dsec-h">The recipe</div>
              <div class="dsec-b rcp-steps">
                <div class="rcp-step"><span class="rh-n">1</span><div><b>Model vs market gap ≥ 3 pts.</b> Our de-vigged probability for the total disagrees with the morning consensus by at least 3 probability points.</div></div>
                <div class="rcp-step"><span class="rh-n">2</span><div><b>Books split on the line.</b> The books quote ≥ 2 distinct total lines the same morning — the market itself is split, so someone's number is soft.</div></div>
                <div class="rcp-step"><span class="rh-n">3</span><div><b>Bet the model's side of the total</b> at the morning line, fair prices only (−135 to +135).</div></div>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">Why this wins where prediction failed</div>
              <div class="dsec-b rcp">
                <p><b>Out-predicting Vegas doesn't pay.</b> Our own accuracy plays prove it: they win roughly 60–63% of the time and still make about breakeven money, because the prices they come at (around −184) need ~65% just to break even. Being right a lot isn't an edge if the market charges you for it.</p>
                <p><b>So the recipe stops competing with the market and starts auditing it.</b> Instead of asking "who wins?", it asks "is the market's number wrong this morning?" — and only bets when there's evidence it is.</p>
                <p><b>Trigger one is the disagreement.</b> When our model's probability for a total is 3+ points away from the de-vigged morning consensus, that's a real disagreement, not noise. But a disagreement alone doesn't tell you who's wrong.</p>
                <p><b>Trigger two is the tell.</b> When the books themselves are quoting two or more different total lines the same morning, the market is split — it hasn't settled on the number, and somebody's line is soft. That's the evidence the gap is the market's error, not ours.</p>
                <p><b>Both together, and only then.</b> Take the model's side of the total at the morning line, at fair prices only (−135 to +135). That fires about once a slate. Most markets, most days, it doesn't fire — and passing is the strategy working, not the strategy missing.</p>
                <p><b>The result:</b> 60.9% over 567 validation bets at a −106 median price — +15.6% ROI (CI +8.1 to +23.2) — and 5-1 in the June one-shot gate. That's the same hit rate the accuracy plays get, bought at coin-flip prices instead of favorite prices. The price is the whole difference.</p>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">Validation record</div>
              <div class="dsec-b">
                <div class="vr-line">${esc(vr.val_record || "Tier A (DISP3) val: 60.9% hit CI [57.0, 64.7], n=567 @ median -106, ROI +15.6% CI [+8.1, +23.2] (embargoed 2024|2025|Apr-May 2026)")}</div>
                <div class="vr-line">${esc(vr.gate || "June 2026 one-shot gate: Tier A 5-1 (n=6), Tier A+B 14-10 (n=24)")}</div>
                <table class="dsa-tab vr-tab">
                  <thead><tr><th>Forward (paper)</th><th>n</th><th>Hit</th><th>ROI</th></tr></thead>
                  <tbody>${fRow("Tier A", fwd.tier_a)}${fRow("Tier A+B", fwd.tier_ab)}${fRow("Tier A shopped", fwd.tier_a_shopped)}</tbody>
                </table>
              </div>
            </div>
            <div class="dsec">
              <div class="dsec-h">Honest status</div>
              <div class="dsec-b rcp-status">
                <p>Paper-tracking forward — every trigger is logged and graded, no real stakes yet. The ${esc(vr.claimed_forward || "defensible forward claim is ~54.6% at ~-108 (= +3.8% EV) — NOT the realized val 60.9%")}.</p>
                <p>Auto-kill is armed: if the forward record decays (trailing hit, EV gap, or trigger-rate alarms), the tier shuts itself down. Real stakes only after the scaling gate — ≥3 months, ≥150 settled tier-A bets, hit ≥ breakeven, ROI ≥ 0.</p>
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

      const view = root.querySelector("#analyzer-view");
      view.innerHTML = `
        <div class="anz-hero">
          <div class="ah-lab">DiamondEdge Analyzer</div>
          <h2>Out-of-Fold Test Record</h2>
          <div class="ah-sub">Every number below is from the out-of-fold test — games the model never trained on, graded against the real result across MLB, NBA, NHL, NFL and Soccer.</div>
          <div class="ah-stats">
            <div class="ah-st"><div class="k">Graded Picks</div><div class="v" data-count="${nTest || 0}" data-loc="1">${(nTest || 0).toLocaleString()}</div></div>
            <div class="ah-st"><div class="k">Record</div><div class="v">${ov.wins || 0}-${ov.losses || 0}${ov.pushes ? `<small> · ${ov.pushes}T</small>` : ""}</div></div>
            <div class="ah-st"><div class="k">Hit Rate</div><div class="v"><span data-count="${hr != null ? hr.toFixed(1) : ""}" data-dec="1" data-suf="%">${hr != null ? hr.toFixed(1) + "%" : "—"}</span>${ci ? `<small> ±${((ci[1] - ci[0]) / 2 * 100).toFixed(1)}</small>` : ""}</div><div class="ah-k2">vs ${be}% breakeven</div></div>
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
      animateCounters(view);
    }

    // ===================== HEADER / SHELL =====================
    function renderShell() {
      root.innerHTML = `
        <header><div class="hbar">
          <div class="brand" id="brand">
            <div class="diamond"></div>
            <div><h1>Diamond<b>Edge</b></h1><div class="tag">Scores · Lines · Plays</div></div>
          </div>
          <div class="hspacer"></div>
          <div class="toptabs">
            <button data-tab="scores" class="${tab === "scores" ? "on" : ""}">Scores</button>
            <button data-tab="analyzer" class="${tab === "analyzer" ? "on" : ""}">Analyzer</button>
          </div>
        </div></header>
        <main>
          <div id="scores-view" style="display:${tab === "scores" ? "block" : "none"}"></div>
          <div id="analyzer-view" style="display:${tab === "analyzer" ? "block" : "none"}"></div>
        </main>`;
      root.querySelectorAll(".toptabs button").forEach((b: any) => (b.onclick = () => switchTab(b.dataset.tab)));
      $("brand").onclick = () => switchTab("scores");
    }

    function switchTab(t: string) {
      if (t === tab) return;
      tab = t;
      $("scores-view").style.display = t === "scores" ? "block" : "none";
      $("analyzer-view").style.display = t === "analyzer" ? "block" : "none";
      root.querySelectorAll(".toptabs button").forEach((b: any) => b.classList.toggle("on", b.dataset.tab === t));
      if (t === "analyzer" && !$("analyzer-view").innerHTML.trim()) renderAnalyzer();
      if (t === "scores") requestAnimationFrame(positionInk);
    }

    // ===================== INIT =====================
    (async function init() {
      renderShell();
      renderScoresChrome();
      bindPull();
      await loadIndex();
      payload = await loadDay(curDate);
      const present = leaguesPresent(payload);
      if (present.size && !present.has(league)) league = SPORTS.find((s) => present.has(s)) || "mlb";
      root.querySelectorAll(".sporttab").forEach((x: any) => x.classList.toggle("on", x.dataset.lg === league));
      positionInk();
      renderSlate();
      requestAnimationFrame(() => { positionInk(); recenterStrip(false); });
    })();
  }, []);

  return <div id="app-root" />;
}
