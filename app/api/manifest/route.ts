import { NextResponse } from "next/server";
import { cachedManifest } from "../manifest-source";

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
   for every surface at once, in one request, from ONE Supabase read.

   WHY IT IS SAFE TO POLL THIS AND NOTHING ELSE. Cost is bounded by SIZE, not by
   cadence: a version map for the whole fleet is ~1.7 KB, where the board it
   describes is 8.9 MB. Polling the small thing to avoid polling the big one is
   the entire trade, and it is why the freshness requirement and the egress
   requirement stopped being in tension.

   AND IT IS NOW THE FRESHNESS CLOCK FOR THE SERVER TOO, not just for readers.
   /api/snap keys its read cache on the version this reports, so the drift
   between "the manifest says V" and "the payload cache holds V" is bounded by
   THIS object's safety net (30 s) rather than by the payload's (was 300 s).
   That asymmetry was a real defect: a lost publisher hook guaranteed the
   manifest ran up to 270 s ahead of the body, which is precisely the window in
   which a reader asks for a version the server cannot yet serve. See
   manifest-source.ts and /api/snap's VERSION-KEYED READS note.

   The reader-facing contract is unchanged: same JSON, same field names, same
   TTLs. Only where the numbers come from moved.
   ════════════════════════════════════════════════════════════════════════════ */

export async function GET() {
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
             not a Supabase read: the miss lands on `cachedManifest` in the
             function region, which one publisher hook drops for every POP. */
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
