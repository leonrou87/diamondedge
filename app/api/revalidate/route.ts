import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { MANIFEST_TAG, snapTag } from "../cache-tags";
import { readManifest } from "../manifest-source";

/* ════════════════════════════════════════════════════════════════════════════
   /api/revalidate — THE PUBLISHER SAYS WHEN, SO NOTHING HAS TO GUESS.

   This is the line that converts the system from time-driven to publish-driven.
   The sync scripts are the only things in the world that know the instant a
   payload actually changed — they compute a content SHA and skip the upload when
   it matches, so they can tell a real write apart from a no-op heartbeat, which
   no cache TTL and no poller ever could. This lets them say so.

   WHAT IT DOES AND DOES NOT INVALIDATE:

     IT DROPS   the server-side read caches in the function region
                (`unstable_cache`, tags `snap:<key>` and `manifest`), which sit
                directly in front of Supabase. That is the meter that is
                overdrawn, so that is the meter this controls.

     IT CANNOT  reach Vercel's CDN. Next.js is explicit that revalidateTag
                invalidates the server cache only and that a CDN keeps serving
                its copy until s-maxage expires.

   A DESIGN THAT NEEDED TO PURGE THE CDN WOULD BE BROKEN HERE. Ours does not,
   and that is not luck — payload URLs are content-addressed (`?cv=<version>`),
   so a new generation is a NEW URL and there is nothing at the CDN to purge.
   The only object with a time-based CDN TTL is the manifest, and it is ~1.7 KB
   precisely so that it can afford one.

   ─────────────────────────────────────────────────────────────────────────────
   AND IT NOW ANSWERS WITH THE NEW VERSION MAP. (2026-08-10)

   The half of a publish that matters as much as the invalidation is the WARM
   that follows it: measured, nothing here coalesces a concurrent miss (250
   simultaneous readers of a cold key cost 248.4 origin reads), so the publisher
   has to be the first reader after every publish or a herd forms.

   Both warmers used to learn the new version by fetching /api/manifest over
   HTTP — a response held at the CDN for 10 s with 60 s of stale-while-
   revalidate. Measured on production: ages of 17 s, 29 s and 62 s with
   `x-vercel-cache: STALE`. So the warmer routinely read the PREVIOUS generation
   and warmed `?cv=<old>` — filling a URL nobody would request while leaving the
   new one cold for the first real reader. The warm was, reliably, warming the
   wrong thing.

   A publisher should never have to ask a cache what it itself just wrote. Two
   ways out, both supported:

     * the caller sends `v` — the stamps it just published, read straight out of
       the payload it wrote. Free, exact, no round trip. The precedence must be
       generated_utc -> generated_at -> updated_at, matching stamp.ts and
       manifest-source.ts, or the pin will not verify.
     * otherwise this reads the version map FRESH from Supabase (~1.7 KB,
       uncached on purpose) and returns it. Correct at the cost of one small
       read per publish, which is the right trade against a warm that misses.

   FAILURE IS BOUNDED IN BOTH DIRECTIONS, because this is an HTTP call made by a
   cron job on a laptop and it WILL be lost sometimes. A lost call does not
   strand anyone: /api/snap keys its read cache on the version the manifest
   reports, and the manifest carries its own 30 s floor, so a lost hook costs
   seconds of lateness rather than a wrong board. A DUPLICATE call is harmless.
   The failure modes are "slightly late" and "slightly cheap", never "wrong".
   ════════════════════════════════════════════════════════════════════════════ */

const SECRET = process.env.SNAP_REVALIDATE_SECRET || "";

/* EXPIRE NOW, RATHER THAN `"max"` — and this is a freshness decision, not a
   caching one. `revalidateTag(tag, "max")` marks the entry STALE: the next
   reader is served the OLD value while a refresh runs behind them. That is the
   right default for a blog and the wrong one here — it would mean the first
   reader after every publish is handed the previous generation, and applied to
   the manifest it is worse than it looks, because the manifest is the clock the
   whole app reads. `{ expire: 0 }` expires the entry outright, so the next read
   is fresh. The single-argument form does the same thing but is deprecated in
   16 and documented as removable. */
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
  let sent: Record<string, string> = {};
  try {
    const body = await req.json();
    keys = Array.isArray(body?.keys) ? body.keys : body?.key ? [body.key] : [];
    if (body?.v && typeof body.v === "object") {
      for (const [k, v] of Object.entries(body.v)) {
        if (KEY_OK.test(String(k)) && typeof v === "string" && v) {
          sent[String(k)] = v.slice(0, 64);
        }
      }
    }
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  keys = keys.map(String).filter((k) => KEY_OK.test(k)).slice(0, 32);
  if (!keys.length) {
    return NextResponse.json({ error: "no keys" }, { status: 400 });
  }

  for (const k of keys) revalidateTag(snapTag(k), EXPIRE_NOW);
  /* ALWAYS the manifest too. It is the map of every surface's current version,
     so any publish makes it stale by definition — and /api/snap now keys its
     read cache on it, so this is what lets the very next request compute the
     NEW cache key rather than refilling the old one. Forgetting it here would
     mean the payload cache refreshed correctly while every reader went on
     asking for the previous generation. */
  revalidateTag(MANIFEST_TAG, EXPIRE_NOW);

  /* The version map to warm against. Prefer what the publisher told us — it
     wrote the bytes, so it is the one source that cannot be stale. Fall back to
     a fresh read; never to a cached one, which is the bug this replaces. */
  let v: Record<string, string> = {};
  const missing = keys.filter((k) => !sent[k]);
  if (missing.length) {
    try {
      v = (await readManifest()).v;
    } catch {
      /* A manifest read failing must not fail the invalidation — the tags are
         already dropped and the app is already correct. The publisher simply
         does not warm this cycle, and the first real reader pays for one fill. */
      v = {};
    }
  }
  for (const [k, s] of Object.entries(sent)) v[k] = s;

  return NextResponse.json(
    { ok: true, revalidated: keys, v, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
