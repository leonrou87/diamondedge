import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { MANIFEST_TAG } from "../cache-tags";

/* ════════════════════════════════════════════════════════════════════════════
   /api/manifest — THE ONE THING IN THE SYSTEM THAT IS STILL ALLOWED TO BE
   POLLED ON A TIMER.

   THE SHAPE OF THE FIX THIS COMPLETES. Every payload URL now carries its own
   content version (`/api/snap/<key>?cv=…`) and is therefore served `immutable`:
   a POP fetches a given generation once, ever, and no clock can make it ask
   again. That removes time from the payload bill entirely — but it only works
   if a reader can cheaply learn WHICH generation is current. This is that
   object, and it is the only place staleness can now enter the system.

   ONE POLL, NOT N. Before this, a reader asking "has anything changed?" issued
   a separate `?v=1` probe per key — three of them on the hot path, each ~1.1 KB
   on the origin leg, each on its own 15 s timer. That is the same mistake as
   the payload poll in miniature: N round trips to learn one fact. This answers
   for every surface at once, in one request, from ONE Supabase read. Requirement
   #5 — one reader per origin object — falls out of that: however many tabs,
   pollers and surfaces are asking, the origin sees a single row read.

   WHY IT IS SAFE TO POLL THIS AND NOTHING ELSE. Cost is bounded by SIZE, not by
   cadence: a version map for the whole fleet is a few hundred bytes, where the
   board it describes is 350 KB. Polling the small thing to avoid polling the
   big one is the entire trade, and it is why the freshness requirement and the
   egress requirement stopped being in tension.

   AND IT IS STILL PUBLISH-DRIVEN UNDERNEATH. The CDN TTL below (10 s) governs
   how fast a reader LEARNS about a publish. It does not govern how often
   Supabase is read: a CDN miss lands on `unstable_cache` in the function region,
   which is dropped by the publisher's own /api/revalidate call at the moment it
   writes. So the origin sees roughly one manifest read per publish, and the
   10 s is paid in function invocations — which are not the meter that is
   overdrawn.

   FRESHNESS, STATED. live_scores is rewritten every ~20 s during game windows.
   A reader learns of a new generation within one manifest CDN TTL (≤10 s) of
   the publisher's hook, then fetches the pinned payload. That is no slower than
   the ~18-25 s end-to-end the app has today, and unlike today it degrades
   visibly rather than silently: `generated_utc` rides in this response, so a
   client (and check_feed_freshness.py) can compare it to wall clock and go red
   when a publisher dies. The old design had no such tell.
   ════════════════════════════════════════════════════════════════════════════ */

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/* THE SURFACES A READER CAN ASK ABOUT. A closed list on purpose: it is the
   manifest's whole job to be small and of predictable size, and an open list is
   one bad key away from being neither. Anything not here can still be fetched
   unpinned through /api/snap — it simply does not get the immutable path. */
const KEYS = [
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
];

/* The floor under the publisher's hook, for the same reason /api/snap has one:
   the hook is an HTTP call from a cron job on a laptop and it will sometimes be
   lost. 30 s means a dead hook costs half a minute of lateness on the live
   feed and nothing worse — and, crucially, a BOUNDED origin bill (2,880
   reads/day of a sub-kilobyte row) rather than an unbounded one. */
const SAFETY_NET_S = 30;

async function readManifest() {
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
      cache: "no-store", // `unstable_cache` above is the cache; this must not double-cache
    },
  );
  if (!r.ok) throw new Error(`manifest ${r.status}`);
  const rows = await r.json();
  const v: Record<string, string> = {};
  let newest = "";
  for (const row of rows || []) {
    /* The CONTENT stamp, never updated_at — the sync scripts heartbeat
       updated_at every cycle even when the payload is byte-identical, so a
       manifest built on it would report a change every five minutes and send
       every reader back for a payload that had not moved. That is the original
       bug, rebuilt one layer up. updated_at is the last resort only. */
    /* THIS ORDER IS A CONTRACT WITH stamp.ts AND MUST NOT DRIFT FROM IT.
       The route decides whether a pinned URL may be called `immutable` by
       reading the same three fields, in this same order, out of the payload it
       is about to serve. If the two ever disagree about which field is "the
       version", every pin silently stops verifying: nothing throws, nothing goes
       red, the app just quietly reverts to TTL-driven reads and the bill creeps
       back. The column is last because it is the only one of the four that
       cannot be read out of the body. */
    const stamp = String(row.gu || row.ga || row.pu || row.updated_at || "");
    if (!stamp) continue;
    v[row.key] = stamp;
    if (stamp > newest) newest = stamp;
  }
  return { v, newest, n: Object.keys(v).length };
}

const cachedManifest = unstable_cache(readManifest, ["manifest-v1"], {
  tags: [MANIFEST_TAG],
  revalidate: SAFETY_NET_S,
});

export async function GET() {
  if (!SUPA || !KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  try {
    const m = await cachedManifest();
    return new NextResponse(
      JSON.stringify({ v: m.v, newest: m.newest, served_utc: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          /* 10 s at the edge is the freshness clock for the whole app. It is
             affordable ONLY because a miss here costs a function invocation and
             not a Supabase read (see the header comment). */
          "Vercel-CDN-Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
          "CDN-Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
          /* Shorter in the browser than at the edge, deliberately — the same
             layering rule /api/snap's TTL table records: a browser window
             stacked on top of an edge window is two generations of lateness on
             the one feed where lateness is visible. */
          "Cache-Control": "public, max-age=5, stale-while-revalidate=60",
        },
      },
    );
  } catch {
    /* A MANIFEST FAILURE MUST NOT LOOK LIKE "NOTHING HAS CHANGED". An empty
       version map would be read by every client as "no surface moved", which is
       indistinguishable from a healthy quiet period and would freeze the board
       silently. 502 + no-store makes the client fall back to its unpinned
       path — more expensive, correct, and self-healing. */
    return new NextResponse(JSON.stringify({ error: "upstream" }), {
      status: 502,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
}
