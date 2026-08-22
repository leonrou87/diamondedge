import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { brotliCompressSync, brotliDecompressSync, constants } from "node:zlib";
import { snapTag } from "../../cache-tags";
import { currentVersion, KEYS as MANIFEST_KEYS } from "../../manifest-source";
import { deriveBoard, deriveLite } from "./lite";
import { topLevelStamp } from "./stamp";

/* ════════════════════════════════════════════════════════════════════════════
   /api/snap/<key> — ONE Supabase read serves EVERY viewer, and it happens once
   per PUBLISH rather than once per TTL, per POP, or per reader.

   WHY THIS ROUTE EXISTS (2026-08-08).
   The KytePush Supabase project ran to 208% of the FREE plan's 5 GB egress
   allowance on NINE monthly active users. Grace was to end 2026-09-04; the
   vendor's 2026-08-14 notice cut it to 2026-08-17, past which an over-quota
   org that has not upgraded answers HTTP 402 on every app on the project
   (this one, CLOUT, Nanny, THE DOCKET). Upgrading alone does not fix it: the
   access pattern was the bug.
   Every browser tab fetched `slate_snapshots?key=eq.<k>&select=payload` DIRECTLY
   from Supabase, so N readers cost N full payloads and the free 5 GB of CACHED
   egress sat at exactly 0 used. This route is the cache that was missing.

   ─────────────────────────────────────────────────────────────────────────────
   2026-08-10 — WHAT THE LOAD TEST FOUND, AND WHAT IT COST

   The design above was measured and three of its load-bearing claims were false.
   All three are fixed here, and the comments say which is which so the next
   reader does not have to re-derive it.

   (1) THE THREE BIGGEST KEYS WERE NEVER CACHED AT ALL. Next's Data Cache
       silently refuses any entry over 2 MB — `incremental-cache/index.js`
       measures `JSON.stringify(data).length`, drops the write, and emits a
       `console.warn` nobody reads. Serialized, measured on production:
       picks_unified 8,857,410 B, picks_unified?lite=1 4,397,426 B,
       picks_v4_beta 7,161,935 B. So for the board — the boot path — EVERY
       function invocation was a full origin read, forever, at any user count,
       with nothing anywhere reporting it. The whole "20 POPs collapse into one
       Supabase read" argument was void for exactly the keys that mattered.

       FIXED BY STORING THE ENTRY COMPRESSED. The cached unit is brotli, held as
       base64. Measured on the real payload: 8,916,802 B of JSON becomes 313,627 B
       at brotli q5 (28.4x) — 418,172 B once base64'd, comfortably inside the 2 MB
       limit with room for the payload to triple. Compression costs ~40 ms and
       decompression ~3 ms, and both are paid once per publish rather than once
       per reader, because the entry now actually persists.

   (2) THE BOOT PATH'S PRIMARY READ WAS FAILING AT THE DATABASE. `?lite=1`
       returned HTTP 502 on 9 of 10 cold requests. It was not the function and
       not memory: `slate_snapshot_lite('picks_unified')` takes ~3.9 s over
       PostgREST and the `anon` role carries `statement_timeout=3s`
       (verified in pg_roles). The projection was timing out, deterministically,
       on the largest key — and a 502 is what demotes a reader to `snapDirect`
       for 60 s, i.e. to an UNCACHED 1.2 MB read straight off the egress meter,
       with the CORS preflight restored. The optimisation was manufacturing the
       exact traffic it existed to prevent. `picks_v4_beta` timed out too (57014).

       FIXED BY DOING THE PROJECTION HERE INSTEAD. The old comment argued that
       stripping blobs in this handler would make Supabase ship all 8 MB anyway,
       "so the egress meter would not notice the fix". That was written before
       brotli landed on the origin leg, and brotli changed the arithmetic: the
       raw row is 476,270 B on the wire, against ~250 KB for the projected one.
       The projection is now worth ~226 KB per PUBLISH — a few megabytes a
       month — and it was being bought with a 3.9 s query that failed half the
       time. Measured on the real payload, the same projection in JS takes
       8.1 ms. One origin read now fills BOTH shapes, so asking for the lite
       board and the full history costs one read between them, not two.

   (3) NOTHING COALESCED A CONCURRENT MISS. 250 simultaneous readers of a cold
       key cost 248.4 origin reads — 1:1 — and `revalidate/route.ts` claimed the
       opposite in its own comment. Mitigated two ways below: `once()` shares one
       upstream fetch across every request in flight on the same instance (the
       project runs Fluid compute with elastic concurrency, so an instance really
       does serve many at a time), and the cache key now rotates on PUBLISH
       rather than being emptied, so the cold window is created by a new version
       arriving rather than by an invalidation blowing a hole in a warm cache.

   ─────────────────────────────────────────────────────────────────────────────
   FIVE SHAPES, so a cheap question can be asked cheaply:

     ?v=1     VERSION ONLY, ~200 bytes. Legacy: the client now learns every
              surface's version from /api/manifest in one request. Kept as the
              fallback for when that is unavailable.
     ?lite=1  PAYLOAD WITHOUT THE PER-GAME DETAIL BLOBS — 8,916,802 -> 4,139,029
              on picks_unified, measured. Not read until someone opens a game.
     ?board=1 THE BOOT WINDOW — the lite shape cut to the last 10 days with the
              per-game analysis prose stripped (see deriveBoard in lite.ts):
              5,618,148 -> 1,256,666 B on picks_unified, measured 2026-08-17.
              This is what a cold board load reads; the lite/full shapes are
              deferred until a surface that needs history is actually opened.
     ?game=id ONE GAME, WHOLE. The other half of ?lite=1: when a reader does open
              a game we fetch that game's blobs back (~13 KB) instead of
              re-downloading the history to read a fraction of it.
     (none)   the full payload, for the paths that genuinely need it.

   FALLBACK IS THE CALLER'S JOB — BUT ONLY AS THE LAST RESORT. If this route
   fails, page.tsx falls back to a direct Supabase read (snapDirect). That costs
   egress but keeps the app alive, which is the correct trade for a proxy that is
   an optimisation and not a dependency — and it is why (2) above mattered so
   much: a route that 502s does not merely lose its own benefit, it actively
   spends more than having no route at all.

   Which is exactly why the 502 is now the THIRD answer to an upstream failure
   and not the first. In order: `supaRetry` re-asks the origin once with jitter,
   because the failures are a concurrency artefact and spreading them is usually
   enough; failing that, `lkg` serves the last good copy of the board this
   instance built, because bytes a few minutes old beat a blank screen and a
   redirected stampede; and only when there is no such copy does the reader get
   the 502 that sends them direct. See the two comment blocks on those names.
   ════════════════════════════════════════════════════════════════════════════ */

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/* PER-KEY TTLs, in seconds, sized to how often the key is actually rewritten.
   These now govern only the UNPINNED response — a pinned URL is immutable and
   has no TTL at all. `swr` is stale-while-revalidate: past the TTL the edge
   still answers instantly from its copy and refreshes behind the reader's back,
   so a cold revalidate never becomes a slow first paint.

   `b` is the BROWSER max-age, when it must be shorter than min(s, 60).
   WHY IT EXISTS (2026-08-08, measured). live_scores is rewritten every ~20 s.
   With an edge TTL of 20 s AND a browser max-age of 20 s, a reader could sit
   behind BOTH: the edge copy up to 20 s old, and their own cached copy of that
   copy up to 20 s older again. Sampling the proxy against Supabase every 10 s
   showed a MEDIAN LAG OF 20.9 SECONDS — exactly one write generation. Before the
   proxy the browser read Supabase directly and was bounded by its 25 s poll
   alone, so this was a real regression on the one feed where lateness is
   visible. The live keys hold ~10 s at the edge and ~5 s in the browser. */
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
   `pregame_picks:2026-08-08` returned a board with two games still `live` and
   served it with s-maxage=86400, stale-while-revalidate=604800. Anyone opening
   "yesterday" during those hours pinned a board containing live, ungraded games
   for a day at the edge and a week in their browser.

   SO THE CLOCK IS THE SLATE'S CLOCK. Dates on these keys are US/Eastern slate
   dates, and the only correct comparison is against the Eastern date. */
const DATED = /^[a-z_]+:\d{4}-\d{2}-\d{2}$/;

function etDate(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86400000);
  // en-CA gives YYYY-MM-DD; timeZone does the DST arithmetic for us.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(d);
}

function ttlFor(key: string, mode: Mode) {
  if (mode === "version") return { s: 15, swr: 60 };
  let base = key;
  if (DATED.test(key)) {
    const [b, d] = key.split(":");
    const yesterdayET = etDate(-1);
    if (d < yesterdayET) return { s: 86400, swr: 604800 };   // frozen
    if (d === yesterdayET) return { s: 300, swr: 3600 };      // still settling
    // Today or later: use the BASE key's live cadence. Looking up the full dated
    // key here would always miss (TTL is keyed on bare names) and silently hand
    // today's board DEFAULT_TTL's 300 s instead of pregame_picks' 120 s.
    base = b;
  }
  return TTL[base] || DEFAULT_TTL;
}

/* Keys are a closed set of identifiers, never free text from a caller: this is
   the only user-controlled value that reaches a Supabase URL, so it is
   validated rather than escaped. Anything else is a 400, not a proxied read. */
const KEY_OK = /^[a-z0-9_]+(:[0-9-]{4,10})?$/i;

/* ═══ …AND A CHARSET CHECK IS NOT AN AUTHORIZATION CHECK ═══
   2026-08-10. The comment above says "a closed set of identifiers" and the
   regex says "any lowercase word". Those are not the same claim, and the gap
   made this route a GENERIC OPEN PROXY over the whole `slate_snapshots` table:
   it happily served every key the app has never heard of. Verified anonymously
   against production — `props` (337 KB), `midgame_picks`, `today`, `analytics`,
   `nba` (1.3 MB), `nhl` (1.6 MB), `nfl` (673 KB), `soccer:2026-08-01`,
   `picks:<date>` — none of them advertised anywhere, several of them other
   products' pick boards with their own unmodelled schemas, and all of them
   reachable because the regex liked the letters.

   THE LIST IS NOW THE AUTHORIZATION. A key this app does not serve is a 404,
   not a proxied read, so adding a surface to the site is a deliberate act and
   an unrelated board on the same Supabase project is not one request away.
   Dated variants of the archive families are allowed by prefix, because
   `pregame_picks:2026-07-21` is the same surface as `pregame_picks` and
   enumerating a year of dates here would be a list nobody maintains.

   THIS DOES NOT, ON ITS OWN, PROTECT ANYTHING. `slate_snapshots` is readable
   with the anon key that ships in the JS bundle, so anyone can still ask
   PostgREST directly. That is exactly why the fix for the paywall is at the
   SOURCE — what is written to those rows is the redacted variant — and this
   list is the narrower thing it is: it stops this app's own front door from
   being a convenient index of every other app on the project. */
const SERVED_KEYS = new Set<string>([
  ...MANIFEST_KEYS,
  // read by the client but not versioned in the manifest
  "pregame_picks_index",
]);
/* THE de_ms_v1 LEAGUE ARCHIVE FAMILIES (2026-08-21).
   The multisport engine publishes a bare board key AND one dated key per slate
   date it carries — `ms_picks.run_sport` upserts `[sport] + [f"{sport}:{d}"
   for d in keyed_dates]` on every cycle. Measured before this edit: ONE
   cycle published 34 distinct dated league keys (nfl:2026-08-20 …
   wnba:2026-08-30, epl:2026-08-21, mls:2026-08-19, ncaaf:2026-08-29), the
   table holds the earlier days as well, and every one of them answered
   `404 {"error":"unknown key"}` here — because the bare league keys were
   added to MANIFEST_KEYS in
   03a6fc3 while this list — the thing that authorizes the dated variants —
   was never told the leagues existed. A past league day was unreadable
   through this app's own front door.

   WIDENED BY THE LIST'S OWN RULE, WHICH IS THE ONE STATED ABOVE: a dated
   variant is admitted when it is "the same surface" as an already-authorized
   base key, because enumerating a season of dates is a list nobody maintains.
   `ncaaf:2026-08-29` is the NCAAF board on 2026-08-29 — the same schema, the
   same redactor (desk_policy.redact_tracker_card), the same gate — so it is
   the same surface as `ncaaf`.

   AND IT IS DERIVED, NOT COPIED. The `.filter` is the authorization: a league
   family only exists here if its BASE key is already in SERVED_KEYS. Drop a
   league from the manifest and its archive disappears with it; add the eighth
   league to the manifest and adding it here is still a deliberate, visible
   act. This is a strictly narrower widening than "allow any base key's dated
   variant" — which would re-open the generic-proxy hole the block above was
   written to close. */
const LEAGUE_FAMILIES = ["nfl", "nba", "nhl", "wnba", "mls", "epl", "ncaaf"]
  .filter((k) => SERVED_KEYS.has(k));
const DATED_FAMILIES = ["pregame_picks", "picks_unified", "picks_unified_live",
  "news_feed", "history", ...LEAGUE_FAMILIES];
function keyIsServed(key: string): boolean {
  if (SERVED_KEYS.has(key)) return true;
  const i = key.indexOf(":");
  if (i < 0) return false;
  return DATED_FAMILIES.includes(key.slice(0, i));
}

type Mode = "full" | "lite" | "board" | "version" | "game";

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

   A 120 s TTL is 720 reads a day whether one person is watching or ten thousand
   are, and `pregame_picks` is only rewritten ~45 times a day. Measured waste on
   `picks_unified`: 564 origin reads a day against 4 real publishes — 141x. And
   it is worse than "flat", because Vercel's CDN is PER-POP: each POP fills its
   own copy, so the TTL bill multiplies by the number of POPs an audience
   touches. TTL-driven reads scale with GEOGRAPHY, the one axis nobody watched.

   THREE MECHANISMS, AND THEY FIX DIFFERENT HALVES:

   (1) THE URL CARRIES THE CONTENT VERSION (`?cv=`), SO THE CDN NEVER HAS TO ASK
       AGAIN. A pinned URL names one immutable generation, so it is served
       `immutable` for a year and a POP fetches a given version ONCE, EVER.
       There is no TTL to expire and therefore no timer buying re-reads.

       Deliberately NOT purge-on-publish: a purge that goes missing leaves
       correct-LOOKING bytes under a correct-LOOKING name indefinitely, and
       nothing reports it. A new version is a new URL.

   (2) THE UPSTREAM READ IS CACHED IN THE FUNCTION REGION, SO THE POPs COLLAPSE
       INTO ONE. `x-vercel-id` reads `pdx1::iad1` — the request entered at the
       pdx1 POP but the function ran in iad1, and the project is pinned to iad1
       alone. The CDN is per-POP; the function region is ONE. So 20 POPs missing
       on the same version cost 20 function invocations and one Supabase read.

       `unstable_cache` and not `use cache`: the latter needs `cacheComponents`
       enabled app-wide, which changes the rendering model for a 17k-line client
       page — far too much blast radius for a caching fix.

   (3) VERSION-KEYED READS: THE CACHE ENTRY ROTATES ON PUBLISH INSTEAD OF BEING
       EMPTIED. This is new on 2026-08-10 and it closes a measured hole.

       The cache key includes the version /api/manifest currently reports. Two
       consequences, both of which were bugs before:

       DRIFT IS NOW BOUNDED BY THE MANIFEST, NOT BY THE PAYLOAD'S TTL. The two
       safety nets used to be asymmetric — manifest 30 s, body 300 s — so a lost
       publisher hook GUARANTEED the manifest ran up to 270 s ahead of the body.
       In that window every reader asked for a version the server could not yet
       serve, got a mismatch, and (see below) the mismatch was itself cached. A
       reader's own pin cannot cause an extra read, because the key is what the
       MANIFEST says, not what the reader asked for.

       AND FRESHNESS NO LONGER RIDES ON THE BODY'S `revalidate`. It used to:
       `Math.max(t.s, 300)` quietly raised system_health's 60 s floor to 300 s,
       so the health seal — whose entire job is to report a dead publisher
       promptly — reported up to ten minutes late, measured. With the version in
       the key, a new generation is a different entry, so the body's revalidate
       is a memory-reclaim control and nothing more. Freshness is the manifest's
       job alone: 30 s region net + 10 s CDN.

   WHAT INVALIDATES IT: the publisher, at the moment it writes, via
   /api/revalidate dropping tag `snap:<key>`. That is now belt to (3)'s braces
   rather than the sole mechanism — which matters, because it is an HTTP call
   from a cron job on a laptop and it WILL be lost sometimes.
   ════════════════════════════════════════════════════════════════════════════ */

/* When the manifest cannot say what version is current — a blip, or a dated
   archive key it does not carry — the entry falls back to being keyed on the
   name alone, and then it needs the old time-based floor. LIVE_KEYS keep a floor
   equal to the edge TTL they already run at, so their worst case with a DEAD
   hook AND a dead manifest is exactly what shipped before any of this: not a
   regression, not an improvement, identically today. */
const LIVE_KEYS = new Set(["live_scores", "live_detail"]);
const SAFETY_NET_S = 300;
function safetyNetFor(key: string, t: { s: number }) {
  const base = DATED.test(key) ? key.split(":")[0] : key;
  return LIVE_KEYS.has(base) ? t.s : Math.max(t.s, SAFETY_NET_S);
}
/* With a version in the key the entry is already correct by construction, so
   this exists only to stop a generation nobody reads any more from living
   forever.

   RAISED 6h -> 24h (2026-08-15, measured). This timer buys nothing but memory
   reclaim — a new generation is a different cache entry, and freshness is the
   manifest's job alone (30 s region net + 10 s CDN + the publisher's tag drop).
   But every expiry it does cause is a re-read of the WHOLE row, and on
   `picks_unified` the whole row is 10.97 MB. Measured on the 24h window that
   night: 28 payload reads/day of that one key = 2.31 GB/month = 46% of the
   entire 5 GB free allowance, against roughly ONE real publish a day. It was
   the single largest term left on the bill and the only reason the egress rail
   was still FAILing (SINGLE_KEY_FAIL_FRAC: one key over 25% of the plan on its
   own is a bug, not growth).

   Six hours was chosen when this was one lever among several; the cost of a
   generation lingering is bytes of cache, and the cost of it expiring early is
   11 MB off a 5 GB monthly allowance. Those are not the same order of
   magnitude, and the timer should be sized to the expensive side.

   NOT a freshness change: a publish rotates the key immediately, and if the
   manifest cannot name a version the request never reaches this constant —
   `safetyNetFor` keeps its 300 s floor for that path, unchanged. */
const VERSIONED_REVALIDATE_S = 86400;
/* The version probe is a freshness clock of its own, so its floor is tighter —
   and it costs ~1 KB, so a tight floor is affordable in a way the payload's is
   not. */
const VERSION_SAFETY_NET_S = 30;

/* A YEAR, AND `immutable`. Only ever sent on a pinned URL whose version we have
   VERIFIED against the bytes we are about to serve. Promising immutability for
   content we did not check would be the purge failure mode wearing a different
   hat: a permanent, unrevokable lie in every POP and every browser that saw it. */
const IMMUTABLE_S = 31536000;

async function supa(path: string, init?: RequestInit) {
  return fetch(`${SUPA}${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      /* ASK FOR BROTLI FIRST, AND KEEP OFFERING NOTHING ELSE.
         Server-to-server fetch does not negotiate compression on its own the
         way a browser does, and this is the leg that lands on the Supabase
         egress meter. Asking at all was worth 4x. Asking in the right ORDER is
         worth several times more again: a server offered `gzip, br` with no
         preference picks the cheaper one to produce — gzip. Measured on the
         origin leg 2026-08-09: picks_unified 2,573,924 gzipped vs 461,763
         brotli (5.57x), picks_unified_live 3.46x, pregame_picks 2.80x.

         `br` ALONE, because the polite version does not work. The obvious safe
         formulation is `br, gzip;q=0.5`. Measured against this project: it
         returns GZIP. PostgREST's front end ignores the q-value and picks the
         first thing it likes, so the only header that actually yields brotli is
         one that does not mention gzip. What that costs is the gzip safety net:
         a response the server cannot brotli comes back identity. Measured, it
         always brotlis, and the blast radius is bounded by the rest of this
         design anyway — a miss happens about once per publish.

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

/* ═══ THE CACHED UNIT: COMPRESSED, BECAUSE UNCOMPRESSED DID NOT FIT ═══

   Next's Data Cache drops any entry whose `JSON.stringify(data).length` exceeds
   2 MB — silently, with a console.warn, in `incremental-cache/index.js`. The
   three largest keys were all over it, so the board was re-read from Supabase on
   every single function invocation while every rail reported green.

   Brotli q5 is the setting, chosen by measurement rather than by taste: on the
   real picks_unified payload q4 gives 371,968 B in 24.8 ms, q5 313,627 B in
   39.9 ms, q6 299,659 B in 38.9 ms. q5 takes 84% of q6's size for the same time
   and is 16% smaller than q4; past q5 the curve flattens. Base64 costs 33% on
   top (418,172 B) and buys a value that survives whatever JSON transport the
   cache handler uses, which a Buffer might not.

   `v` rides WITH the bytes rather than being recomputed per request. The
   invariant the `immutable` promise rests on is "the thing compared IS the thing
   served", and computing the stamp at the moment of compression satisfies it
   more strictly than re-deriving it later would: there is no second read of
   anything, and no window in which the two could diverge. It also takes
   topLevelStamp's character scan off the hot path entirely — it now runs once
   per publish instead of once per request. */
type Blob = { v: string; b: string; n: number };
type Unit = { full: Blob; lite: Blob; board: Blob };

const BROTLI = (s: string): string => {
  const src = Buffer.from(s, "utf8");
  return brotliCompressSync(src, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 5,
      [constants.BROTLI_PARAM_SIZE_HINT]: src.length,
    },
  }).toString("base64");
};
const blobOf = (text: string): Blob => ({ v: topLevelStamp(text), b: BROTLI(text), n: text.length });
/* A VIEW, not a copy — the decompressed board is ~9 MB and there is no reason to
   duplicate it on the way out. (Buffer is a Uint8Array at runtime but the DOM
   BodyInit types do not accept it, hence the explicit view.) */
const textOf = (bl: Blob): Uint8Array<ArrayBuffer> => {
  const b = brotliDecompressSync(Buffer.from(bl.b, "base64"));
  // zlib always allocates a plain ArrayBuffer here; the assertion is only to
  // narrow ArrayBufferLike, which BodyInit does not accept.
  return new Uint8Array(b.buffer as ArrayBuffer, b.byteOffset, b.byteLength);
};

/* ONE ORIGIN READ FILLS BOTH SHAPES. The board asks for `lite` and the history
   view asks for `full`; before this they were two cache entries behind two
   Supabase reads of the same row. Now the row is read once and projected here,
   which is both cheaper on the meter and the reason the lite path no longer
   depends on a query that times out. */
/* ═══ THE ORIGIN CANNOT SERVE THESE CONCURRENTLY, SO RETRY THE 5xx ═══

   Measured 2026-08-10, straight at Supabase with no Vercel in the path:

       15 simultaneous reads of pregame_picks  (1.1 MB)   1 of 15 -> HTTP 500
       10 simultaneous reads of picks_unified  (9.5 MB)  10 of 10 -> HTTP 500

   A single sequential read of either answers 200 every time. So this is not a
   query problem and not a Vercel problem — it is a free-tier Postgres detoasting
   a 9.5 MB jsonb ten times at once and giving up. It is also the true source of
   the `x-snap-err: snap 500` seen in a 15-way burst through the route: the 502
   was faithfully passing along the origin's own 500.

   That reframes the cache. It is not only a cost optimisation any more — it is
   what keeps readers away from an origin that cannot take them. And it is why a
   retry belongs here rather than nowhere: a 502 out of this route is not a
   neutral failure, it demotes that reader to `snapDirect` for 60 seconds, which
   sends them STRAIGHT AT the thing that just failed, uncached, at full price.

   Two attempts, jittered. The jitter is the active ingredient: the failures are
   simultaneous by construction, so retrying them all at the same instant simply
   reproduces the burst. Spreading them over a few hundred milliseconds is what
   lets the origin serve them one at a time, which it can. Bounded at 2 so a
   genuinely down origin fails fast instead of tripling the load on it, and 5xx
   only — a 4xx is an answer, and retrying an answer is just noise. */
async function supaRetry(path: string, attempts = 2): Promise<Response> {
  let last: Response | null = null;
  for (let i = 0; i < attempts; i++) {
    if (i) await new Promise((r) => setTimeout(r, 150 + Math.random() * 450));
    const r = await supa(path);
    if (r.ok || r.status < 500) return r;
    last = r;
  }
  return last as Response;
}

/* ═══ THE LAST GOOD COPY, KEPT SO AN OUTAGE IS NOT A BLANK BOARD ═══

   2026-08-10. `supaRetry` above makes the origin's concurrency 500s survivable;
   it does not make them SURVIVED. Two jittered attempts still both fail when
   the origin is properly unwell, and what the reader got then was a 502 — which
   is the worst available answer, because page.tsx reads a 502 as "the proxy is
   broken, go direct" and spends 60 seconds sending that reader STRAIGHT AT the
   origin that just refused two requests, uncached, at full price.

   So the route keeps the last unit it successfully built for each key and
   serves that instead. The bytes are a few minutes old; the alternative was no
   bytes at all AND a stampede. That trade is the whole argument for
   stale-while-revalidate, applied at the one layer that previously did not
   have it: the origin read itself.

   WHAT THIS IS NOT. It is per-INSTANCE memory, exactly like `inflight` — an
   instance that has never served this key has nothing to fall back on and will
   still 502. It is a floor under the common case (a warm instance meeting a
   brief origin failure), not a durable cache, and it is deliberately not one:
   a durable stale store would need its own invalidation, and an unreadable
   stale board that outlives the outage is a worse bug than the outage.

   BOUNDED, because the dated archive keys are effectively unbounded — a reader
   walking backwards through the season would otherwise pin one unit per day in
   memory forever. Map preserves insertion order, so the oldest entry is the
   first key and eviction is one line. 24 units at ~420 KB of base64 is ~10 MB
   worst case, which is inside the function's memory with room to spare. */
const LKG_MAX = 24;
const lkg = new Map<string, Unit>();
function rememberUnit(key: string, u: Unit) {
  // Re-insert so a key that is actually being read stays at the young end.
  if (lkg.has(key)) lkg.delete(key);
  lkg.set(key, u);
  while (lkg.size > LKG_MAX) {
    const oldest = lkg.keys().next().value;
    if (oldest === undefined) break;
    lkg.delete(oldest);
  }
}

async function fetchUnit(key: string): Promise<Unit> {
  const r = await supaRetry(
    `/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}&select=payload`,
  );
  if (!r.ok) throw new Error(`snap ${r.status}`);
  const rows = await r.json();
  const payload = rows && rows[0] ? rows[0].payload : null;
  const fullText = JSON.stringify(payload ?? null);
  let liteText = fullText;
  try {
    /* `deriveLite` guarantees its own postcondition — it returns the input
       verbatim when the projection would not shrink it — so there is nothing to
       second-guess here. When it returns the same string the two shapes share
       one blob and one compression pass. */
    liteText = deriveLite(fullText);
  } catch {
    // Malformed payload: `?lite=1` degrades to the full document rather than
    // failing. More bytes than asked for beats no board at all.
    liteText = fullText;
  }
  /* The board window is a projection OF THE LITE TEXT (see deriveBoard) — the
     same degradation ladder applies: a malformed payload answers `?board=1`
     with the lite shape, and a key the window cannot shrink shares lite's blob
     and its compression pass. Still ONE origin read for all three shapes. */
  let boardText = liteText;
  try {
    boardText = deriveBoard(liteText);
  } catch {
    boardText = liteText;
  }
  const full = blobOf(fullText);
  const lite = liteText === fullText ? full : blobOf(liteText);
  const unit = { full, lite, board: boardText === liteText ? lite : blobOf(boardText) };
  /* A ROW THAT IS ABSENT IS NOT A ROW THAT IS GOOD. `payload` is null when the
     key has no row at all, and remembering that would mean a later outage gets
     answered with a confident "null" instead of an error — the empty-board
     failure mode this route's own catch block exists to avoid. Only a real
     document becomes the fallback. */
  if (payload != null) rememberUnit(key, unit);
  return unit;
}

/* SINGLE-FLIGHT, PER INSTANCE. Measured 2026-08-10: 250 simultaneous readers of
   a cold key cost 248.4 origin reads. Nothing coalesced — not the CDN, not
   `unstable_cache` — and revalidate/route.ts asserted the opposite in its own
   comment.

   This is the part that can be fixed from inside the function: the project runs
   Fluid compute with elastic concurrency (`resourceConfig.fluid: true`), so one
   instance really does serve many requests at once, and a module-level in-flight
   map makes all of them share one upstream fetch. It does NOT coalesce across
   instances — that would need a lock nobody here has — so it is a reduction in
   the herd, not its abolition. The publisher's warm is what keeps the herd from
   forming at all; this bounds what it costs when one does. */
const inflight = new Map<string, Promise<unknown>>();
function once<T>(k: string, f: () => Promise<T>): Promise<T> {
  const running = inflight.get(k) as Promise<T> | undefined;
  if (running) return running;
  const p = f().finally(() => { inflight.delete(k); });
  inflight.set(k, p);
  return p;
}

function cachedUnit(key: string, mv: string, netS: number) {
  return unstable_cache(
    async () => fetchUnit(key),
    /* v2 -> v3 on 2026-08-17: Unit grew the `board` blob, and a v2 entry
       revived from the Data Cache would answer `?board=1` with `undefined`.
       The bump costs one origin re-read per key on the first post-deploy miss
       — the same price every publish already pays. */
    ["snap-unit-v3", key, mv],
    { tags: [snapTag(key)], revalidate: netS },
  );
}

function cachedGame(key: string, gameId: string, mv: string, netS: number) {
  return unstable_cache(
    async () => {
      /* Projected in Postgres, and correctly so: this one really does return a
         small slice, so pulling the history here to pick one game out of it
         would leave the egress meter reading what it read before the fix. It is
         also fast — unlike slate_snapshot_lite, it does not rebuild the
         document. */
      const r = await supa(`/rest/v1/rpc/slate_snapshot_game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p_key: key, p_game_id: gameId }),
      });
      if (!r.ok) throw new Error(`game ${r.status}`);
      const body = await r.text();
      return body === "" ? "null" : body;
    },
    ["snap-game-v2", key, gameId, mv],
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

/* THE ROUTE HAD NO TIME LIMIT OF ITS OWN, AND THE DEFAULT WAS NOT ENOUGH.
   2026-08-09: Vercel raised an error anomaly — 502s on /api/snap/[key], 88.9%
   error rate. The route LOOKED healthy from outside because the edge was serving
   cached copies; every request that actually MISSED the cache failed. The
   dominant cause turned out to be upstream (the lite RPC's 3 s statement
   timeout, fixed above), but the ceiling stays: a cold miss on the largest key
   still moves ~9 MB through this function, and a slow answer beats a 502
   because a 502 is what demotes a reader to the uncached direct path. */
export const maxDuration = 60;

export async function GET(
  req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  const { key } = await ctx.params;
  if (!KEY_OK.test(key)) {
    return NextResponse.json({ error: "bad key" }, { status: 400 });
  }
  /* See SERVED_KEYS: the charset check above says the key is well formed, this
     says the app actually serves it. Without the second one this route proxies
     any row in the table. */
  if (!keyIsServed(key)) {
    return NextResponse.json({ error: "unknown key" }, { status: 404 });
  }
  if (!SUPA || !KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  const url = new URL(req.url);
  const gameId = (url.searchParams.get("game") || "").slice(0, 96);
  const mode: Mode =
    url.searchParams.get("v") ? "version"
      : gameId ? "game"
        : url.searchParams.get("board") ? "board"
          : url.searchParams.get("lite") ? "lite"
            : "full";
  /* THE PIN. A caller that already knows which generation it wants says so, and
     in exchange gets a URL that never has to be revalidated. Bounded in length
     because it reaches a comparison and a cache key, nothing else — it is never
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

    /* WHAT THE SERVER THINKS IS CURRENT — never what the caller asked for. See
       VERSION-KEYED READS above. "" when the manifest is unavailable or does not
       carry this key (dated archive keys), in which case the entry falls back to
       the name alone plus the old time-based floor. */
    const mv = await currentVersion(DATED.test(key) ? key.split(":")[0] : key);
    const netS = mv ? VERSIONED_REVALIDATE_S : safetyNetFor(key, t);

    if (mode === "game") {
      const body = await once(`g|${key}|${gameId}|${mv}`, cachedGame(key, gameId, mv, netS));
      /* NOT PINNED, ON PURPOSE. `?game=` returns a single game object, which
         carries no feed-level stamp of its own — there is nothing in those bytes
         to check a pin against, and an immutability promise nothing can verify
         is exactly the failure mode this design exists to avoid. It costs almost
         nothing: ~13 KB, ~25 changes a day, fetched only when a reader opens a
         game. Declining to pin the one surface whose correctness cannot be
         established is "fail toward correctness" applied to ourselves. */
      return new NextResponse(body, {
        status: 200,
        headers: { ...cacheHeaders(t), "x-snap-mv": mv || "-" },
      });
    }

    const unit = await once(`u|${key}|${mv}`, cachedUnit(key, mv, netS));
    // `|| unit.lite` is belt to the v3 cache-key bump's braces: if a pre-board
    // Unit ever reaches this line anyway, the reader gets more bytes, never a crash.
    const blob = mode === "board" ? (unit.board || unit.lite)
      : mode === "lite" ? unit.lite : unit.full;
    const bytes = textOf(blob);

    /* THE PINNED PATH. Only a VERIFIED match earns a year of immutability.

       WHAT `immutable` PROMISES HERE, EXACTLY — because a deploy can change the
       bytes under a pinned URL and it is better to say so than to discover it.

       Observed 2026-08-10, in a real browser: a tab held
       `picks_unified?lite=1&cv=…T00:16:55Z` at 4,314,423 bytes from before the
       deploy and the same URL answered 4,147,411 after it. Same generation, same
       content — the projection had moved from Postgres to JS and stopped
       emitting jsonb's cosmetic spaces. 167,012 bytes of whitespace, nothing
       else; `scripts/verify_lite_projection.ts` compares the surviving key sets
       of all 527 games against the SQL function and they are identical.

       So the promise this URL makes is "these bytes are generation V of this
       surface", NOT "these bytes are byte-for-byte eternal". A redeploy may
       re-render V. That is fine and cannot be avoided cheaply: putting a build
       id in the URL would make every deploy cold at every POP, and at this
       project's 43 deploys a day that costs far more than it protects.

       THE RULE THAT FALLS OUT, and it is a real constraint on future work: a
       change to what a projection MEANS — a field added, a blob stripped — must
       be accompanied by a publish, because readers holding an immutable copy of
       V keep it until the manifest names a new version. Changing the shape of V
       in a deploy alone leaves them on the old shape indefinitely. Changing its
       spelling, as above, is harmless. verify_lite_projection is the guard that
       tells the two apart. */
    if (cv && blob.v && blob.v === cv) {
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Vercel-CDN-Cache-Control": `public, s-maxage=${IMMUTABLE_S}, immutable`,
          "CDN-Cache-Control": `public, s-maxage=${IMMUTABLE_S}, immutable`,
          "Cache-Control": `public, max-age=${IMMUTABLE_S}, immutable`,
          ETag: `W/"${key}-${mode}-${cv}"`,
          "x-snap-pin": "hit",
          "x-snap-mv": mv || "-",
        },
      });
    }

    if (cv) {
      /* ═══ A MISMATCH MUST NOT BE CACHED. THIS IS THE STALE-BOARD BUG. ═══

         A mismatch is not an error: it is a reader holding a pin from one
         generation ago, which happens for a few seconds after every publish. It
         gets the correct current bytes — but this branch used to return them
         with `...cacheHeaders(t)`, i.e. PUBLICLY CACHEABLE, under the
         VERSION-NAMED URL.

         That turned a seconds-long race into hours. Measured on production
         2026-08-10 at 00:50 UTC, on the exact URL a browser fetches:

             teams_v4?cv=…00:37:13Z          served 2026-08-09T23:57:47  (39m26s stale)
             pitchers_v4?cv=…00:37:17Z       served 2026-08-09T23:57:54  (39m23s stale)
             pregame_picks_index?cv=…00:37:08 served 00:04:39            (32m29s stale)

         all `x-vercel-cache: HIT`, with `s-maxage=900, swr=21600` — 15 minutes
         fresh and six hours stale-while-revalidate, on a response whose whole
         meaning is "I could NOT prove these bytes are the version you asked
         for". At the same moment the UNPINNED url for those keys returned the
         CURRENT bytes: the pin did not merely fail to help, it delivered older
         data than no pin at all. And the client had no way out, because the
         manifest kept naming the same `cv`, so it kept requesting the same
         poisoned URL until the CDN entry aged out on its own.

         `no-store` is the whole fix. The window collapses back to what it
         always should have been — one request — and the next request
         self-heals. The cost is that a mismatch is not shared between readers,
         which is correct: a mismatch should be rare, and if it is not, the thing
         to fix is why, not how long it is cached for. */
      return new NextResponse(bytes, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
          "x-snap-pin": blob.v ? "stale" : "unverified",
          "x-snap-mv": mv || "-",
          "x-snap-have": blob.v || "-",
        },
      });
    }

    return new NextResponse(bytes, {
      status: 200,
      headers: { ...cacheHeaders(t), "x-snap-mv": mv || "-" },
    });
  } catch (e) {
    /* A PROXY FAILURE MUST NOT LOOK LIKE AN EMPTY BOARD. 502 (not 200-with-null)
       is what tells page.tsx's snap() to fall through to the direct Supabase
       read — expensive, but the reader still sees their picks. And no-store on
       the error so a transient blip can never be cached and served to everybody
       for a whole TTL.

       THE REASON RIDES IN A HEADER. The 90%-502 episode took a load test and a
       role-config lookup to diagnose because the failure said only "upstream" —
       a route that fails opaquely on the one path that costs real money is a
       route that fails twice. This is the upstream error text, truncated, on a
       response nothing caches. */
    const why = (e instanceof Error ? e.message : String(e)).slice(0, 120);

    /* ═══ SERVE THE LAST GOOD COPY BEFORE SERVING THE FAILURE ═══
       See `lkg` above. A board a few minutes old is a board; a 502 is a blank
       screen AND a reader redirected onto the failing origin for a minute.

       THREE THINGS THIS RESPONSE IS CAREFUL ABOUT.

       (1) IT IS NEVER PINNED. A `?cv=` request whose stamp matches these bytes
           would otherwise earn `immutable` for a year — a year of a stale
           generation, promised during an outage, revocable by nothing. The
           pinned branch is above the catch and stale bytes never reach it.

       (2) IT IS NOT SHARED FOR LONG. `s-maxage` is deliberately short rather
           than the key's own TTL: the point is to absorb the burst that an
           origin failure produces, not to install old bytes at the edge for
           the five minutes the fresh ones would have earned. One minute of
           sharing turns a thousand readers into one origin read on recovery.

       (3) IT SAYS SO. `x-snap-stale` and the age let a rail — or the next
           person reading a HAR — tell "the board is old because the origin is
           down" from "the board is old because the publisher is dead". Those
           have different owners and previously looked identical.

       `version` and `game` modes have no fallback here on purpose: the version
       probe is ~1 KB and answering it with a stale stamp would tell every
       reader to keep a generation that may have moved, and `?game=` is 13 KB
       fetched only on a tap, where a retry is the honest answer. */
    const stale = (mode === "full" || mode === "lite" || mode === "board") ? lkg.get(key) : undefined;
    if (stale) {
      const blob = mode === "board" ? (stale.board || stale.lite)
        : mode === "lite" ? stale.lite : stale.full;
      return new NextResponse(textOf(blob), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Vercel-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Cache-Control": "public, max-age=15, stale-while-revalidate=300",
          "x-snap-stale": "1",
          "x-snap-have": blob.v || "-",
          "x-snap-err": why.replace(/[^\x20-\x7e]/g, " "),
        },
      });
    }

    return new NextResponse(JSON.stringify({ error: "upstream" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "x-snap-err": why.replace(/[^\x20-\x7e]/g, " "),
      },
    });
  }
}
