import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { MANIFEST_TAG, snapTag } from "../cache-tags";

/* ════════════════════════════════════════════════════════════════════════════
   /api/revalidate — THE PUBLISHER SAYS WHEN, SO NOTHING HAS TO GUESS.

   This is the line that converts the whole system from time-driven to
   publish-driven. The sync scripts are the only things in the world that know
   the instant a payload actually changed — they compute a content SHA and skip
   the upload when it matches, so they can tell a real write apart from a
   no-op heartbeat, which no cache TTL and no poller ever could. This lets them
   say so.

   WHAT IT DOES AND DOES NOT INVALIDATE — and this distinction is the whole
   reason the architecture is shaped the way it is:

     IT DROPS   the server-side read cache in the function region
                (`unstable_cache`, tag `snap:<key>`), which is the thing sitting
                directly in front of Supabase. That is the meter that is
                overdrawn, so that is the meter this controls.

     IT CANNOT  reach Vercel's CDN. Next.js is explicit that revalidateTag
                invalidates the server cache only and that a CDN keeps serving
                its copy until s-maxage expires.

   A DESIGN THAT NEEDED TO PURGE THE CDN WOULD BE BROKEN HERE. Ours does not
   need to, and that is not luck — it is why payload URLs are content-addressed
   (`?cv=<generated_utc>`). A new generation is a NEW URL, so there is nothing
   at the CDN to purge: the old URL still correctly holds the old generation,
   and the new one is simply not in any POP yet. The only object with a
   time-based CDN TTL is the manifest, and it is a few hundred bytes precisely
   so that it can afford one.

   AND THE STAMPEDE THIS AVOIDS. Measured 2026-08-09: Vercel does NOT coalesce
   concurrent misses — a fully-expired key hit by 200 simultaneous readers
   produced 191 client-side MISSes and 192 origin reads in the same minute. A
   naive purge-on-publish would manufacture exactly that cold moment ~150 times
   a day, and at 10,000 users it would be WORSE than the TTL it replaced. Here
   the herd lands on the function region's shared cache, so N simultaneous
   misses on a new version collapse to one Supabase read; the CDN's copies fill
   from the new URL at their own pace, never in unison.

   FAILURE IS BOUNDED IN BOTH DIRECTIONS, because this is an HTTP call made by a
   cron job on a laptop and it WILL be lost sometimes. A lost call does not
   strand anyone: both caches carry a short `revalidate` safety net, so the
   worst case is seconds-to-minutes of lateness and an origin bill no worse than
   today's. A DUPLICATE call is harmless — dropping a tag twice costs one extra
   read. The failure modes are "slightly late" and "slightly cheap", never
   "wrong".
   ════════════════════════════════════════════════════════════════════════════ */

const SECRET = process.env.SNAP_REVALIDATE_SECRET || "";

/* EXPIRE NOW, RATHER THAN `"max"` — and this is a freshness decision, not a
   caching one.

   Next 16 changed this signature, and the two profiles mean genuinely different
   things. `revalidateTag(tag, "max")` marks the entry STALE: the next reader is
   served the OLD value while a refresh runs behind them. That is the right
   default for a blog, and the wrong one here. It would mean the first reader
   after every publish is handed the previous generation — on live scores, a
   run that has already happened — and only the reader after them sees the new
   one. Applied to the manifest it is worse than it looks: the manifest is the
   clock the whole app reads, so one stale serve delays EVERY surface by a poll
   cycle, and the freshness budget for live scores (~20-25 s end to end today,
   and it may not regress) has no room for it.

   `{ expire: 0 }` expires the entry outright, so the next read is fresh. The
   cost of that choice is a blocking revalidate for whoever arrives first — the
   "thundering herd" the measurements warned about. It is affordable HERE, and
   only here, for two reasons: the herd lands on the function region's single
   shared cache rather than on 20 independent POPs, and there are ~150 publishes
   a day, so the number of readers who can possibly land inside one refresh
   window is small and does not grow with the audience.

   The single-argument form does the same thing but is deprecated in 16 and
   documented as removable, so it is not an option worth taking. */
const EXPIRE_NOW = { expire: 0 } as const;

/* Length-independent compare. The window here is genuinely small — the secret
   is high-entropy and the endpoint only drops caches — but a comparison that
   returns early on the first wrong byte is a habit worth not having, and the
   cost of not having it is four lines. */
function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const KEY_OK = /^[a-z0-9_]+(:[0-9-]{4,10})?$/i;

export async function POST(req: Request) {
  /* NO SECRET CONFIGURED MEANS CLOSED, NOT OPEN. An unset env var is the most
     likely way this ever ends up unprotected, so it fails shut: without a
     secret the endpoint refuses everyone, including the publisher, and the
     safety-net revalidates keep the app correct in the meantime. A cache
     endpoint that silently accepts the world because a variable was missing is
     a free denial-of-wallet against the very meter this exists to protect. */
  if (!SECRET) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  const given = req.headers.get("x-revalidate-secret") || "";
  if (!safeEq(given, SECRET)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let keys: string[] = [];
  try {
    const body = await req.json();
    keys = Array.isArray(body?.keys) ? body.keys : body?.key ? [body.key] : [];
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  keys = keys.map(String).filter((k) => KEY_OK.test(k)).slice(0, 32);
  if (!keys.length) {
    return NextResponse.json({ error: "no keys" }, { status: 400 });
  }

  for (const k of keys) revalidateTag(snapTag(k), EXPIRE_NOW);
  /* ALWAYS the manifest too. It is the map of every surface's current version,
     so any publish makes it stale by definition — and it is the object readers
     consult before deciding whether to fetch anything at all. Forgetting it
     here would mean the payload cache refreshed correctly while every reader
     went on asking for the previous generation, which is the failure this whole
     design exists to make impossible. */
  revalidateTag(MANIFEST_TAG, EXPIRE_NOW);

  return NextResponse.json(
    { ok: true, revalidated: keys, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
