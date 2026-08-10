import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { snapTag } from "../../cache-tags";
import { topLevelStamp } from "./stamp";

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
  let base = key;
  if (DATED.test(key)) {
    const [b, d] = key.split(":");
    const yesterdayET = etDate(-1);
    if (d < yesterdayET) return { s: 86400, swr: 604800 };   // frozen
    if (d === yesterdayET) return { s: 300, swr: 3600 };      // still settling
    // Today or later: use the BASE key's live cadence. Looking up the full dated
    // key here would always miss (TTL is keyed on bare names) and silently hand
    // today's board DEFAULT_TTL's 300s instead of pregame_picks' 120s — the
    // comment would have been describing something the code did not do.
    base = b;
  }
  return TTL[base] || DEFAULT_TTL;
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

/* ════════════════════════════════════════════════════════════════════════════
   ORIGIN READS MUST BE PROPORTIONAL TO PUBLISHES — NOT TO TIME, NOT TO USERS,
   AND NOT TO GEOGRAPHY.

   2026-08-09. The edge cache above solved the wrong variable. It made N readers
   cost 1 Supabase read, which is real — measured, 1,000 concurrent viewers cost
   0 origin reads on a warm key. But it left the read count owned by the CLOCK:
   a 120 s TTL is 720 reads a day whether one person is watching or ten thousand
   are, and `pregame_picks` is only actually rewritten ~45 times a day. Measured
   waste on `picks_unified`: 564 origin reads a day against 4 real publishes —
   141x. Projected 27.4 GB/month against a 5 GB plan, at ANY user count.

   And it is worse than "flat", because Vercel's CDN is PER-POP. Each POP fills
   its own copy, so the TTL bill multiplies by the number of POPs an audience
   actually touches — ~1.5 today, ~20 at 10,000 users spread over a continent.
   TTL-driven reads scale with GEOGRAPHY, which is the one axis nobody was
   watching.

   TWO LAYERS FIX IT, AND THEY FIX DIFFERENT HALVES:

   (1) THE URL CARRIES THE CONTENT VERSION (`?cv=`), SO THE CDN NEVER HAS TO
       ASK AGAIN. A pinned URL names one immutable generation of the payload, so
       it is served `immutable` for a year. A POP fetches a given version ONCE,
       EVER. There is no TTL to expire and therefore no timer buying re-reads.

       This is deliberately NOT purge-on-publish. A purge that goes missing
       leaves correct-LOOKING bytes under a correct-LOOKING name indefinitely,
       and nothing anywhere reports it. Content-addressing has no signal to lose:
       a new version is a new URL, and an old URL is still honestly the old
       version. It fails toward correctness rather than toward silent staleness.

   (2) THE UPSTREAM READ IS CACHED IN THE FUNCTION REGION, SO THE POPs COLLAPSE
       INTO ONE. This is the half that kills the geography term, and it works
       because of a measured asymmetry: `x-vercel-id` reads `pdx1::iad1` — the
       request entered at the pdx1 POP but the function ran in iad1. The CDN is
       per-POP; the function region is ONE. `unstable_cache` persists its entry
       in that region, shared by every instance and therefore by every POP. So
       20 POPs missing on the same version cost 20 function invocations and
       exactly ONE Supabase read.

       `unstable_cache` and not `use cache`: the latter needs `cacheComponents`
       enabled app-wide, which changes the rendering model for a 17k-line client
       page and is far too much blast radius for a caching fix. It is also not
       `fetch(next:{revalidate})`, because two of the three read modes are POST
       RPCs and the fetch Data Cache does not promise to cache POST. Caching the
       FUNCTION RESULT is method-agnostic, which is the property we need.

   WHAT INVALIDATES IT: the publisher, at the moment it writes. Every sync
   script POSTs /api/revalidate, which drops tag `snap:<key>`. Reads then equal
   publishes, by construction.

   AND WHAT HAPPENS WHEN THAT HOOK IS LOST — because it is a network call from a
   cron job on a laptop, and it WILL be lost sometimes. `revalidate:
   SAFETY_NET_S` is the belt to the hook's braces. A lost hook does not strand a
   reader on old bytes forever; it costs at most SAFETY_NET_S of staleness and
   degrades the bill to roughly what it is today (288 reads/key/day) rather than
   to a wrong board. Bounded on both axes, which is the whole point.
   ════════════════════════════════════════════════════════════════════════════ */

/* ═══ THE SAFETY NET IS PER-KEY, AND ON THE LIVE FEEDS IT IS TODAY'S TTL ═══

   The hook is the fast path. This is the floor under it, for the days it is
   lost — and picking ONE number for every key would quietly break the one
   guarantee that is not negotiable.

   A single 300 s floor would be right for the board and catastrophic for
   live_scores: a lost hook would leave a reader looking at a score up to five
   minutes old, on a feed whose entire job is to be seconds old. Freshness would
   have been traded for bytes, which is precisely the failure this overhaul is
   not allowed to commit.

   So the live feeds keep a floor equal to the edge TTL they already run at.
   Their worst case with a DEAD hook is therefore EXACTLY what ships today —
   not a regression, not an improvement, identically today — and their best case
   with a live hook is publish-driven. That is the whole contract in one line:
   **with the hook, publish-driven; without it, exactly what you have now.**

   It costs almost nothing to be careful here, and the measurements are why:
   live_scores and live_detail together are 0.35 GB/month of the 27.4 GB
   problem — 1.3%. The expensive keys are the three that publish a few dozen
   times a day and were being re-read every two minutes. Freshness was never
   what cost; there is no reason to buy any of it back. */
const LIVE_KEYS = new Set(["live_scores", "live_detail"]);
/* Long enough that the ~45-publishes-a-day board is genuinely publish-driven,
   short enough that a WHOLE DAY of failed hooks still cannot show anyone a
   board more than five minutes stale. */
const SAFETY_NET_S = 300;
function safetyNetFor(key: string, t: { s: number }) {
  const base = DATED.test(key) ? key.split(":")[0] : key;
  return LIVE_KEYS.has(base) ? t.s : Math.max(t.s, SAFETY_NET_S);
}
/* The version probe is the freshness clock, so its floor is tighter — and it
   costs ~1 KB, so a tight floor is affordable in a way the payload's is not. */
const VERSION_SAFETY_NET_S = 30;

/* A YEAR, AND `immutable`. Only ever sent on a pinned URL whose version we have
   VERIFIED against the bytes we are about to serve (see `pinnedOk`). Promising
   immutability for content we did not check would be the purge failure mode
   wearing a different hat: a permanent, unrevokable lie in every POP and every
   browser that saw it. */
const IMMUTABLE_S = 31536000;

/* THE UPSTREAM READ, CACHED IN THE FUNCTION REGION AND TAGGED FOR THE PUBLISHER.

   `cv` is deliberately NOT part of the cache key. It is tempting — it would make
   the entry content-addressed too — but it would also mean a reader arriving
   with a stale pin manufactures a SECOND origin read for a version that is no
   longer current. Keying on (key, mode, game) instead means every reader, on
   every pin, shares one upstream read per publish. The pin's job is to decide
   how long the ANSWER may be cached, not to fetch a different answer. */
function cachedBody(key: string, mode: string, gameId: string, netS: number) {
  return unstable_cache(
    async () => rawBody(key, mode, gameId),
    ["snap-body", key, mode, gameId],
    { tags: [snapTag(key)], revalidate: netS },
  );
}

function cachedVersion(key: string) {
  return unstable_cache(
    async () => rawVersion(key),
    ["snap-version", key],
    { tags: [snapTag(key)], revalidate: VERSION_SAFETY_NET_S },
  );
}

async function supa(path: string, init?: RequestInit) {
  return fetch(`${SUPA}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      /* ASK FOR BROTLI FIRST, AND KEEP OFFERING GZIP.
         Server-to-server fetch does not negotiate compression on its own the
         way a browser does, and this is the leg that lands on the Supabase
         egress meter. Asking at all was worth 4x (picks_unified: 8.07 MB raw
         vs 2.09 MB gzipped).

         Asking in the right ORDER is worth several times more again. The header
         used to read `gzip, br`, and a server offered both with no preference
         picks the cheaper one to produce — gzip. Measured on the origin leg
         2026-08-09: picks_unified 2,573,924 gzipped vs 461,763 brotli (5.57x),
         picks_unified_live 3.46x, pregame_picks 2.80x. Every one of those bytes
         was being paid on the meter that is overdrawn, for want of a comma's
         worth of preference.

         `br` ALONE, because the polite version does not work. The obvious safe
         formulation is `br, gzip;q=0.5` — brotli preferred, gzip still on the
         table so the worst case is today rather than identity. Measured against
         this project: it returns GZIP. PostgREST's front end ignores the
         q-value and picks the first thing it likes from the list, so the only
         header that actually yields brotli is one that does not mention gzip.

         What that costs is the gzip safety net, and it is worth naming: a
         response the server cannot brotli would come back identity —
         uncompressed, ~4x worse than gzip. Measured on this endpoint it always
         brotlis (teams_v4: 967 B br, 1,009 B gzip, 4,124 B identity), and the
         blast radius is bounded by the rest of this design anyway — a miss here
         happens about once per publish, not once per reader, so even an
         occasional identity response is a handful of them a day rather than
         thousands.

         Decompression is transparent: Node's fetch decodes br from a manually
         set Accept-Encoding (verified), so nothing downstream sees the
         difference. This route runs on the Node runtime, not edge — if that
         ever changes, re-verify that first. */
      "Accept-Encoding": "br",
      ...(init?.headers || {}),
    },
    cache: "no-store", // the EDGE caches this response; the fetch itself must not
  });
}

/* THE CONTENT STAMP, NOT updated_at. The sync scripts deliberately heartbeat
   updated_at every cycle even when the payload is byte-identical
   (sync_unified_live.sh, "HEARTBEAT 2026-07-31"), because the watchdog needs a
   liveness signal. So updated_at answers "is the sync alive", never "did the
   content change" — polling on it would pull the payload every cycle and put
   the leak straight back. */
async function rawVersion(key: string): Promise<{ v: string; updated_at: string | null }> {
  const r = await supa(
    `/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}` +
    `&select=updated_at,ga:payload->>generated_at,gu:payload->>generated_utc`,
  );
  if (!r.ok) throw new Error(`version ${r.status}`);
  const rows = await r.json();
  const row = (rows && rows[0]) || null;
  return { v: row ? (row.gu || row.ga || row.updated_at || "") : "", updated_at: row?.updated_at || null };
}

async function rawBody(key: string, mode: string, gameId: string): Promise<string> {
  if (mode === "game") {
    /* Projected in Postgres, for the same reason as ?lite=1: pulling the
       history to Vercel and picking one game out of it here would leave the
       egress meter reading exactly what it read before the fix. */
    const r = await supa(`/rest/v1/rpc/slate_snapshot_game`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p_key: key, p_game_id: gameId }),
    });
    if (!r.ok) throw new Error(`game ${r.status}`);
    const body = await r.text();
    return body === "" ? "null" : body;
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
    return body === "null" ? "null" : body;
  }
  const r = await supa(
    `/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}&select=payload`,
  );
  if (!r.ok) throw new Error(`snap ${r.status}`);
  const rows = await r.json();
  const payload = rows && rows[0] ? rows[0].payload : null;
  return JSON.stringify(payload ?? null);
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
  /* THE PIN. A caller that already knows which generation it wants says so, and
     in exchange gets a URL that never has to be revalidated. Bounded in length
     because it reaches a cache key and a comparison, nothing else — it is never
     interpolated into a Supabase URL. */
  const cv = (url.searchParams.get("cv") || "").slice(0, 64);
  const t = ttlFor(key, mode);

  try {
    if (mode === "version") {
      const { v, updated_at } = await cachedVersion(key)();
      return new NextResponse(
        JSON.stringify({ key, v, updated_at }),
        { status: 200, headers: cacheHeaders(t, `W/"v-${key}-${v}"`) },
      );
    }

    const body = await cachedBody(key, mode, gameId, safetyNetFor(key, t))();

    /* THE PINNED PATH. Only a VERIFIED match earns a year of immutability.
       A mismatch is not an error and must not be treated as one — it is simply
       a reader holding a pin from one generation ago, which happens naturally
       for a few seconds after every publish. It gets the correct current bytes
       under the ordinary short TTL, and its next manifest poll moves it onto
       the new pin. Never `immutable`, because the URL would then be lying about
       which generation it holds.

       AND PINNING IS OFFERED ONLY WHERE IT CAN BE PROVEN. `?game=` returns a
       single game object, which carries no feed-level stamp
       of its own — so there is nothing in those bytes to check a pin against,
       and the only alternative is the second-request race described above. It
       is therefore left on its ordinary TTL rather than given an immutability
       promise nothing can verify.

       That costs almost nothing, which is why it is an easy call: game detail is
       ~13 KB, changes ~25 times a day, and is fetched only when a reader opens a
       game. The expensive keys — the board and the history — all carry a
       top-level stamp and all get pinned. Declining to pin the one surface whose
       correctness cannot be established is the whole "fail toward correctness"
       rule applied to ourselves. */
    if (cv && mode !== "game") {
      const actual = topLevelStamp(body);
      if (actual && actual === cv) {
        return new NextResponse(body, {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Vercel-CDN-Cache-Control": `public, s-maxage=${IMMUTABLE_S}, immutable`,
            "CDN-Cache-Control": `public, s-maxage=${IMMUTABLE_S}, immutable`,
            "Cache-Control": `public, max-age=${IMMUTABLE_S}, immutable`,
            ETag: `W/"${key}-${cv}"`,
            "x-snap-pin": "hit",
          },
        });
      }
      return new NextResponse(body, {
        status: 200,
        headers: { ...cacheHeaders(t), "x-snap-pin": actual ? "stale" : "unverified" },
      });
    }

    return new NextResponse(body, { status: 200, headers: cacheHeaders(t) });
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
