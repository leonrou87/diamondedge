import { unstable_cache } from "next/cache";
import { MANIFEST_TAG } from "./cache-tags";

/* The version map, in one place, because THREE routes now need it and they must
   not disagree about what "the current version" is.

   /api/manifest   serves it to readers — the freshness clock for the whole app.
   /api/snap       keys its read cache on it, so a publish rotates the cache
                   entry by construction instead of relying on an invalidation
                   arriving (see the note on VERSION-KEYED READS in route.ts).
   /api/revalidate returns it to the publisher, so the publisher can warm the
                   URL it just created rather than the one it just replaced.

   That last one is a bug this module exists to make impossible. Until
   2026-08-10 both warmers (revalidate_edge.sh, edge_revalidate.py) learned the
   new version by fetching /api/manifest over HTTP — a response held at the CDN
   for 10 s with 60 s of stale-while-revalidate. Measured on production: ages of
   17 s, 29 s and 62 s with `x-vercel-cache: STALE`. So the warmer routinely read
   the PREVIOUS generation and dutifully warmed `?cv=<old>`, leaving the new
   pinned URL cold for the first real reader — the exact herd the warm exists to
   prevent. A publisher should never have to ask a cache what it itself just
   wrote. */

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/* THE SURFACES A READER CAN ASK ABOUT. A closed list on purpose: it is the
   manifest's whole job to be small and of predictable size, and an open list is
   one bad key away from being neither. Anything not here can still be fetched
   unpinned through /api/snap — it simply does not get the immutable path. */
export const KEYS = [
  "live_scores",
  "live_detail",
  "pregame_picks",
  "pregame_picks_index",
  "picks_unified",
  "picks_unified_live",
  "picks_v4_beta",
  "picks_v4_beta_live",
  "news_feed",
  "pitchers_v4",
  "teams_v4",
  "research_roadmap",
  "research_papers",
  "system_health",
  /* de_ms_v1 sport boards (2026-08-10). Without these the league tabs' snap()
     hit /api/snap/nfl, got the 404 the SERVED_KEYS list exists to give, demoted
     the whole session off the proxy (snapProxyFailed) and burned the reader's
     12-read direct budget on Supabase full-price reads. In the manifest they are
     first-class surfaces: stamped (~40 bytes each), edge-cached at DEFAULT_TTL,
     and revalidated on real change by the platform's `edge_revalidate.notify()`
     hook, which every publisher of these keys calls.

     CORRECTED 2026-08-16: this used to credit "the platform's mssync hook".
     `com.diamondedge.mssync` was the PREMIUM SEALER and was deleted with the
     paywall that morning — it never revalidated these bare keys, and it does
     not exist. Behaviour here is unaffected; the sentence was simply false, and
     a false comment on a live cache path sends the next debugger looking for a
     job that is gone. (Platform-side register: `v4/serve/fleet_manifest.py`.) */
  "nfl",
  "nba",
  "nhl",
  "wnba",
  "mls",
];

export type Manifest = { v: Record<string, string>; newest: string; n: number };

/* THE ONE READ THAT IS STILL ALLOWED TO BE ON A TIMER.

   Everything else in this system is now publish-driven. This is not, and cannot
   be: it is the object that TELLS a reader a publish happened, so a design in
   which it only refreshes when told about a publish is circular. Its cost is
   bounded by SIZE instead — 14 surfaces of stamp is ~1.7 KB on the wire, against
   the 8.9 MB board it describes. Polling the small thing so nothing has to poll
   the big one is the entire trade.

   30 s is the floor under the publisher's hook. The hook is an HTTP call from a
   cron job on a laptop and it WILL be lost sometimes; this bounds what a lost
   one costs, on both axes — half a minute of lateness, and 2,880 reads a day of
   a sub-kilobyte row rather than an unbounded number of reads of a megabyte one. */
export const MANIFEST_SAFETY_NET_S = 30;

export async function readManifest(): Promise<Manifest> {
  /* `pu` — the payload's OWN updated_at, which is not the same thing as the
     column of the same name and is the difference between the live feeds being
     pinnable or not.

     live_scores carries `updated_at: "2026-08-09T23:32:44Z"` inside the payload,
     while the column reads "2026-08-09T23:32:44.473069+00:00". Same instant,
     different precision — so a manifest built on the column can never
     string-match a stamp read out of the body, and those keys were the only two
     that failed to pin. Selecting the payload's field lets the two agree, which
     turns the app's most-polled surface from time-driven into publish-driven
     without touching how fresh it is. The column stays as the last fallback for
     any key that carries no internal stamp at all. */
  const sel = "key,updated_at,ga:payload->>generated_at,gu:payload->>generated_utc,pu:payload->>updated_at";
  const r = await fetch(
    `${SUPA}/rest/v1/slate_snapshots` +
    `?key=in.(${KEYS.map(encodeURIComponent).join(",")})&select=${encodeURIComponent(sel)}`,
    {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        // The leg that lands on the Supabase egress meter — never uncompressed.
        // `br` alone, for the reason spelled out at /api/snap's `supa()`: this
        // project's PostgREST front end ignores q-values, so a header that
        // mentions gzip at all gets gzip.
        "Accept-Encoding": "br",
      },
      cache: "no-store", // `cachedManifest` is the cache; this must not double-cache
    },
  );
  if (!r.ok) throw new Error(`manifest ${r.status}`);
  const rows = await r.json();
  const v: Record<string, string> = {};
  let newest = "";
  for (const row of rows || []) {
    /* THIS ORDER IS A CONTRACT WITH stamp.ts AND MUST NOT DRIFT FROM IT.
       /api/snap decides whether a pinned URL may be called `immutable` by
       reading the same three fields, in this same order, out of the payload it
       is about to serve. If the two ever disagree about which field is "the
       version", every pin silently stops verifying: nothing throws, nothing goes
       red, the app just quietly reverts to TTL-driven reads and the bill creeps
       back. The column is last because it is the only one of the four that
       cannot be read out of the body.

       The CONTENT stamp, never updated_at, for the same reason: the sync scripts
       heartbeat updated_at every cycle even when the payload is byte-identical,
       so a manifest built on it would report a change every five minutes and
       send every reader back for a payload that had not moved. That is the
       original bug, rebuilt one layer up. */
    const stamp = String(row.gu || row.ga || row.pu || row.updated_at || "");
    if (!stamp) continue;
    v[row.key] = stamp;
    if (stamp > newest) newest = stamp;
  }
  return { v, newest, n: Object.keys(v).length };
}

/* Cached in the FUNCTION REGION, so however many CDN points of presence miss at
   once, Supabase sees one read. Tagged, so a publisher's /api/revalidate drops
   it at the instant of a write and the 30 s above is only ever a floor. */
export const cachedManifest = unstable_cache(readManifest, ["manifest-v1"], {
  tags: [MANIFEST_TAG],
  revalidate: MANIFEST_SAFETY_NET_S,
});

/* ═══ THE LAST GOOD MANIFEST, KEPT SO A METERED-OUT ORIGIN IS NOT A DEAD SITE ═══

   2026-08-17, the free-tier 402 emergency. When Supabase starts answering 402,
   two layers already keep the board alive WITHOUT this: (1) a STALE
   unstable_cache entry is served immediately and the failed background
   revalidation is swallowed (verified in this Next version's
   unstable-cache.js — the .catch logs and returns the cached response), and
   (2) /api/snap's own `lkg` map. But both hang off ONE thread: /api/snap keys
   its payload cache on the version THIS module reports. The moment
   `cachedManifest` throws — a function instance whose Data Cache entry is
   missing or evicted — `currentVersion` returned "", every snap cache key
   rotated from (key, mv) to (key, ""), and every one of those entries was
   COLD. So the exact instant the origin became unreachable was the instant we
   threw away our warm cache of it and went asking again. The failure mode was
   self-inflicted rotation, not staleness.

   This is the module-level floor under that: the last manifest this instance
   successfully built. Per-instance and unpersisted, exactly like /api/snap's
   `lkg`, and for the same reason — a durable stale store would need its own
   invalidation. During an egress-cap outage "nothing has changed" is also
   TRUE: the publishers write through the same capped project, so no new
   generation can exist while the cap holds.

   `stale` rides on the answer so /api/manifest can SAY so (x-manifest-stale)
   rather than dressing old versions up as fresh — the same honesty contract
   as x-snap-stale. */
let lkgManifest: Manifest | null = null;
let lkgManifestAtMs = 0;

export type ManifestAnswer = { m: Manifest; stale: boolean; ageS: number };

export async function manifestWithFallback(): Promise<ManifestAnswer> {
  try {
    const m = await cachedManifest();
    lkgManifest = m;
    lkgManifestAtMs = Date.now();
    return { m, stale: false, ageS: 0 };
  } catch (e) {
    if (lkgManifest) {
      return {
        m: lkgManifest,
        stale: true,
        ageS: Math.round((Date.now() - lkgManifestAtMs) / 1000),
      };
    }
    throw e;
  }
}

/* The current version of one key, for /api/snap's cache key. Never throws:
   a manifest blip must degrade snap to its old time-driven behaviour, never
   break it. "" means "I do not know", and every caller reads it that way.

   Reads through the last-good fallback above ON PURPOSE: a stale version here
   keeps /api/snap's cache key STABLE during an origin outage, which is what
   lets its warm payload entries go on serving. "" would rotate every key cold
   at the worst possible moment — see the block above. */
export async function currentVersion(key: string): Promise<string> {
  try {
    const { m } = await manifestWithFallback();
    return String((m && m.v && m.v[key]) || "");
  } catch {
    return "";
  }
}
