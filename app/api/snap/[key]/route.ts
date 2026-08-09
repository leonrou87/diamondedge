import { NextResponse } from "next/server";

/* ════════════════════════════════════════════════════════════════════════════
   /api/snap/<key> — ONE Supabase read serves EVERY viewer.

   WHY THIS ROUTE EXISTS (2026-08-08).
   The KytePush Supabase project ran to 208% of the FREE plan's 5 GB egress
   allowance (10.398 GB) on NINE monthly active users — ~1.15 GB per user per
   month. Grace ends 2026-09-04, after which every app on the project (this one,
   CLOUT, Nanny, THE DOCKET) starts returning HTTP 402. Upgrading does not fix
   it: at 1,000 users the same pattern is ~1.15 TB/month and Pro ships 250 GB.
   The access pattern is the bug.

   The pattern was: every browser tab fetched
   `slate_snapshots?key=eq.<k>&select=payload` DIRECTLY from Supabase. Nothing
   sat in between, so N readers cost N full payloads, and the free 5 GB of
   CACHED egress sat at exactly 0 used. Every read was a cache miss because
   there was no cache.

   This route is the cache. It is same-origin, so Vercel's edge CDN can hold the
   response, and:

     * N viewers inside one TTL cost ONE Supabase read, not N.
     * The CORS preflight disappears. `apikey` is not a CORS-safelisted header,
       so every cross-origin snapshot GET was preceded by an OPTIONS round trip
       — ~185 of them per key per day in the edge logs, ~890 bytes each, paid
       for nothing.
     * The anon key stops being handed to every browser for direct table
       access; reads go through a surface we control.

   THREE SHAPES, so a cheap question can be asked cheaply:

     ?v=1     VERSION ONLY. ~200 bytes. Returns the content stamp so a poller
              can decide whether to pull anything at all. This is the single
              biggest win in the app: pollPregame used to download the entire
              1.2 MB payload every 4 minutes and THEN compare generated_at to
              decide nothing had changed — 15 times an hour, per open tab.
     ?lite=1  PAYLOAD WITHOUT THE DETAIL BLOBS. picks_unified is 8.27 MB and
              93% of it is games[]; 5.74 MB of that is five per-game blobs
              (diamondedge / analysts / analysts_v2 / strategies / scout) that
              are not read until someone OPENS a game. Measured 2026-08-08:
              2.15 MB -> 850 KB on the wire.
     ?game=id ONE GAME, WHOLE. The other half of ?lite=1, and the reason the
              projection is safe: when a reader does open a game, we fetch that
              game's blobs back — 2.9 KB — instead of re-downloading the entire
              history to read 15 KB of it. Measured 2026-08-08: 2,145,888 bytes
              -> 2,908. It was the largest line left in a session once the
              4-minute poller stopped buying answers it already had.
     (none)   the full payload, for the paths that genuinely need it.

   CACHE HEADERS, ALL THREE, ON PURPOSE.
     Vercel-CDN-Cache-Control  Vercel's edge. The one that converts N reads
                               into 1. Long, with stale-while-revalidate so a
                               reader is never made to wait on a revalidate.
     CDN-Cache-Control         any CDN in front of that.
     Cache-Control             the browser. Deliberately SHORTER than the edge
                               TTL: a reader who reloads should get the edge's
                               fresh copy, and the edge copy is already cheap.

   FALLBACK IS THE CALLER'S JOB. If this route fails, page.tsx falls back to a
   direct Supabase read (snapDirect). That costs egress but keeps the app alive,
   which is the correct trade for a proxy that is an optimisation and not a
   dependency.
   ════════════════════════════════════════════════════════════════════════════ */

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/* PER-KEY TTLs, in seconds, sized to how often the key is actually rewritten —
   never shorter, because a TTL shorter than the write cadence buys staleness
   risk for nothing, and never long enough to show a reader a stale score.
     live_scores    swept every ~60-75s during game windows; 2 KB.
     pregame_picks  rebuilt ~every 30 min.
     picks_unified* synced from the pick box every few minutes.
     pitchers/teams/index/news  daily-to-hourly build artefacts.
   `swr` is stale-while-revalidate: past the TTL the edge still answers
   instantly from its copy and refreshes behind the reader's back, so a cold
   revalidate never becomes a slow first paint. */
/* `b` is the BROWSER max-age, when it must be shorter than min(s, 60).
   WHY IT EXISTS (2026-08-08, measured). live_scores is rewritten every ~20s.
   With an edge TTL of 20s AND a browser max-age of 20s, a reader could sit
   behind BOTH: the edge copy up to 20s old, and their own cached copy of that
   copy up to 20s older again. Sampling the proxy against Supabase every 10s for
   20 samples showed a MEDIAN LAG OF 20.9 SECONDS — exactly one write generation
   — with half the samples served STALE at age 20. Before the proxy the browser
   read Supabase directly and was bounded by its 25s poll alone, so this was a
   real regression on the one feed where lateness is visible to a reader.
   The live keys now hold ~10s at the edge and ~5s in the browser, which keeps
   the layered worst case under one generation. It costs almost nothing: the
   live_scores payload is 75 bytes since the field projection landed. */
const TTL: Record<string, { s: number; swr: number; b?: number }> = {
  live_scores: { s: 10, swr: 60, b: 5 },
  live_detail: { s: 10, swr: 60, b: 5 },
  pregame_picks: { s: 120, swr: 900 },
  picks_unified_live: { s: 120, swr: 900 },
  picks_unified: { s: 300, swr: 3600 },
  picks_v4_beta: { s: 300, swr: 3600 },
  picks_v4_beta_live: { s: 120, swr: 900 },
  news_feed: { s: 300, swr: 3600 },
  pregame_picks_index: { s: 900, swr: 21600 },
  pitchers_v4: { s: 900, swr: 21600 },
  teams_v4: { s: 900, swr: 21600 },
  research_roadmap: { s: 900, swr: 21600 },
  research_papers: { s: 3600, swr: 86400 },
  system_health: { s: 60, swr: 600 },
};
const DEFAULT_TTL = { s: 300, swr: 3600 };

/* A DATED KEY EVENTUALLY STOPS CHANGING — BUT NOT AT MIDNIGHT UTC.
   `pregame_picks:2026-07-21` does become a frozen day, and freezing it is the
   cheapest win in the archive. The question is WHEN.

   THE BUG THIS REPLACES (2026-08-08, observed in production). The test was
       d < new Date().toISOString().slice(0, 10)
   — the date in UTC. A US evening slate runs to roughly 07:00 UTC, so from
   00:00 to ~07:00 UTC every night the UTC date has already rolled over while
   that day's games are STILL BEING PLAYED. At 03:14 UTC a fetch of
   `pregame_picks:2026-08-08` returned a board with two games still `live`, a
   generated_at 11 minutes old and actively being rewritten — and served it with
   s-maxage=86400, stale-while-revalidate=604800. Anyone opening "yesterday"
   during those hours pinned a board containing live, ungraded games for a day
   at the edge and a week in their browser. The overnight grades never arrived.
   The old comment asserted "A DATED KEY CAN NEVER CHANGE AGAIN", which was
   false for about a third of every day.

   SO THE CLOCK IS THE SLATE'S CLOCK. Dates on these keys are US/Eastern slate
   dates, and the only correct comparison is against the Eastern date. Two tiers,
   because "finished" and "will never be touched again" are different claims:

     older than yesterday   FROZEN. Every wall, every game, every grade is long
                            settled. A day at the edge, a week of swr.
     yesterday              SETTLING. Its games are over, but a west-coast game
                            can end after midnight ET and overnight grading and
                            article regeneration land on it. Short TTL, so a
                            correction shows up rather than being pinned.
     today or later         the live cadence in TTL above. Never frozen. */
const DATED = /^[a-z_]+:\d{4}-\d{2}-\d{2}$/;

function etDate(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86400000);
  // en-CA gives YYYY-MM-DD; timeZone does the DST arithmetic for us.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
}

function ttlFor(key: string, mode: "full" | "lite" | "version" | "game") {
  if (mode === "version") return { s: 15, swr: 60 };
  if (DATED.test(key)) {
    const [, d] = key.split(":");
    const yesterdayET = etDate(-1);
    if (d < yesterdayET) return { s: 86400, swr: 604800 };   // frozen
    if (d === yesterdayET) return { s: 300, swr: 3600 };      // still settling
    // today or a future date: fall through to the key's live cadence
  }
  return TTL[key] || DEFAULT_TTL;
}

/* Keys are a closed set of identifiers, never free text from a caller: this is
   the only user-controlled value that reaches a Supabase URL, so it is
   validated rather than escaped. Anything else is a 400, not a proxied read. */
const KEY_OK = /^[a-z0-9_]+(:[0-9-]{4,10})?$/i;

function cacheHeaders(t: { s: number; swr: number; b?: number }, etag?: string) {
  // The browser's window must never be able to stack a second full generation on
  // top of the edge's — see the `b` note above TTL. Default stays min(s, 60).
  const browser = t.b !== undefined ? t.b : Math.min(t.s, 60);
  const h: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    // the edge: the copy that makes one Supabase read serve everyone
    "Vercel-CDN-Cache-Control": `public, s-maxage=${t.s}, stale-while-revalidate=${t.swr}`,
    "CDN-Cache-Control": `public, s-maxage=${t.s}, stale-while-revalidate=${t.swr}`,
    // the browser: shorter on purpose (see the header comment)
    "Cache-Control": `public, max-age=${browser}, stale-while-revalidate=${t.swr}`,
  };
  if (etag) h.ETag = etag;
  return h;
}

async function supa(path: string, init?: RequestInit) {
  return fetch(`${SUPA}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      // ASK FOR GZIP. Server-to-server fetch does not negotiate compression on
      // its own the way a browser does, and this is the leg that lands on the
      // Supabase egress meter. Measured on picks_unified: 8.07 MB raw vs
      // 2.09 MB gzipped — the single cheapest 4x in the whole system.
      "Accept-Encoding": "gzip, br",
      ...(init?.headers || {}),
    },
    cache: "no-store", // the EDGE caches this response; the fetch itself must not
  });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  const { key } = await ctx.params;
  if (!KEY_OK.test(key)) {
    return NextResponse.json({ error: "bad key" }, { status: 400 });
  }
  if (!SUPA || !KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  const url = new URL(req.url);
  const gameId = (url.searchParams.get("game") || "").slice(0, 96);
  const mode: "full" | "lite" | "version" | "game" =
    url.searchParams.get("v") ? "version"
      : gameId ? "game"
        : url.searchParams.get("lite") ? "lite"
          : "full";
  const t = ttlFor(key, mode);

  try {
    if (mode === "version") {
      /* THE CONTENT STAMP, NOT updated_at. The sync scripts deliberately
         heartbeat updated_at every cycle even when the payload is
         byte-identical (sync_unified_live.sh, "HEARTBEAT 2026-07-31"), because
         the watchdog needs a liveness signal. So updated_at answers "is the
         sync alive", never "did the content change" — polling on it would pull
         the payload every cycle and put the leak straight back. */
      const r = await supa(
        `/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}` +
        `&select=updated_at,ga:payload->>generated_at,gu:payload->>generated_utc`,
      );
      const rows = await r.json();
      const row = (rows && rows[0]) || null;
      const v = row ? (row.gu || row.ga || row.updated_at || "") : "";
      return new NextResponse(
        JSON.stringify({ key, v, updated_at: row?.updated_at || null }),
        { status: 200, headers: cacheHeaders(t, `W/"v-${key}-${v}"`) },
      );
    }

    if (mode === "game") {
      /* Also projected in Postgres, for the same reason as ?lite=1: pulling the
         history to Vercel and picking one game out of it here would leave the
         egress meter reading exactly what it read before the fix. */
      const r = await supa(`/rest/v1/rpc/slate_snapshot_game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p_key: key, p_game_id: gameId }),
      });
      if (!r.ok) throw new Error(`game ${r.status}`);
      const body = await r.text();
      return new NextResponse(body === "" ? "null" : body, {
        status: 200,
        headers: cacheHeaders(t),
      });
    }

    if (mode === "lite") {
      /* Projected in POSTGRES, not here. Stripping the blobs in this handler
         would still make Supabase ship all 8.27 MB to Vercel on every cache
         miss — the egress meter would not notice the fix at all. The RPC means
         the bytes are never read off disk in the first place. */
      const r = await supa(`/rest/v1/rpc/slate_snapshot_lite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p_key: key }),
      });
      if (!r.ok) throw new Error(`lite ${r.status}`);
      const body = await r.text();
      return new NextResponse(body === "null" ? "null" : body, {
        status: 200,
        headers: cacheHeaders(t),
      });
    }

    const r = await supa(
      `/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}&select=payload`,
    );
    if (!r.ok) throw new Error(`snap ${r.status}`);
    const rows = await r.json();
    const payload = rows && rows[0] ? rows[0].payload : null;
    return new NextResponse(JSON.stringify(payload ?? null), {
      status: 200,
      headers: cacheHeaders(t),
    });
  } catch {
    /* A PROXY FAILURE MUST NOT LOOK LIKE AN EMPTY BOARD. 502 (not 200-with-
       null) is what tells page.tsx's snap() to fall through to the direct
       Supabase read — expensive, but the reader still sees their picks. And
       no-store on the error so a transient blip can never be cached and
       served to everybody for a whole TTL. */
    return new NextResponse(JSON.stringify({ error: "upstream" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
