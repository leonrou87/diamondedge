import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createDecipheriv, createHash } from "node:crypto";
import { snapTag } from "../../cache-tags";
import { entitledRequest } from "../../session/route";

/* ════════════════════════════════════════════════════════════════════════════
   /api/premium/<key> — THE OTHER HALF OF THE PAYWALL, AND THE ANSWER TO THE
   CACHING TENSION.

   ─────────────────────────────────────────────────────────────────────────────
   THE TENSION, STATED HONESTLY

   `/api/snap` is public, unauthenticated and CDN-cached. ONE response is shared
   by every reader — that is not an incidental property, it is the entire reason
   the route exists: this Supabase project ran to 208% of its free egress
   allowance on nine users because every browser read the payload directly, and
   the fix was "one origin read serves everyone".

   A cache like that CANNOT be auth-aware. Making it so means putting the auth
   state into the cache key, which is per-reader caching, which is the access
   pattern that caused the bill. So "just check the cookie in /api/snap" trades
   the paywall bug for the egress bug.

   The two requirements only compete while ONE payload serves both audiences.
   Split the payload and they stop:

     PUBLIC   — the redacted board. Written by the model, upserted under the
                existing keys, served by /api/snap, `?cv=` pinned, immutable,
                shared by every reader INCLUDING members. Unchanged economics —
                and it is roughly half the bytes it used to be, so the egress
                case gets better rather than worse.
     PREMIUM  — this route. Uncached at the edge, `private, no-store`, opened
                only for a verified session. Its reader count is the paying
                denominator, not the internet's.

   ─────────────────────────────────────────────────────────────────────────────
   WHY THE FULL BOARD IS SEALED RATHER THAN HIDDEN

   The obvious design is a second Supabase key holding the full board, readable
   only by this route. It does not work here: `slate_snapshots` is readable with
   the `anon` JWT that SHIPS IN THE PUBLIC JS BUNDLE, so a second key is a second
   public key. Making it private needs an RLS policy and a service credential in
   the deployment — two moving parts, either of which failing OPEN puts the whole
   board back on the wire, silently, with every rail still green. That is the
   exact failure this change exists to repair, so repeating its shape would be
   perverse.

   So the premium row is CIPHERTEXT. AES-256-GCM, sealed at publish time by
   scripts/seal_premium.mjs with a key the browser never sees. Three properties
   fall out, and the third is the one that makes this design better than the RLS
   one rather than merely equivalent:

     1. Anonymous reachability stops mattering. The row can be fetched by anyone,
        through PostgREST, through this route, through a leak of the anon key —
        and it is noise without `DE_PREMIUM_SEAL_KEY`.
     2. There is no policy to misconfigure. The failure mode of a missing key is
        "nobody can decrypt", not "everybody can read".
     3. THE CIPHERTEXT IS STILL CACHEABLE. The expensive part — one origin read
        of a multi-megabyte row — is shared by every member exactly as it is for
        every public reader. Only the DECRYPTION is per-request, and that is
        milliseconds of CPU on bytes already in memory. The "one origin read
        serves everyone" property survives on BOTH sides of the paywall, which
        an auth-keyed cache would have destroyed on one of them.

   AND IT FAILS CLOSED. No session, or no seal key, or no sealed row: 402, and
   the client renders the same locked surfaces and the same upsell a signed-out
   reader gets. There is no path through this file that returns a pick to an
   unverified caller.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SEAL_KEY_HEX = process.env.DE_PREMIUM_SEAL_KEY || "";

/* ── OPEN ACCESS: THE PAYWALL IS OFF, SO THE SEALED HALF IS DEAD WEIGHT ──────
   (2026-08-15) The platform publishes with DE_OPEN_ACCESS=1, which makes
   `desk_policy` emit every public variant WHOLE — no redaction, picks and all.
   The sealed twin is then byte-for-byte the same board the public route already
   serves to everybody, and this route's only remaining effect is to pull a
   multi-megabyte ciphertext row out of Supabase to hand a member something they
   already have.

   MEASURED, 24h of edge_logs, 2026-08-15: 99 sealed payload reads a day across
   picks_unified__sealed / picks_unified_live__sealed / pregame_picks__sealed
   and the de_ms_v1 twins — 1.92 GB/month, 38% of the ENTIRE 5 GB free-plan
   allowance, spent on a duplicate of the free board. That single term is most
   of why the egress rail has never once been green.

   So while open access is on, the gate answers `premium_required` BEFORE it
   touches the network. page.tsx treats a 402 as an answer rather than a failure
   (`serverPremium = false`, then stop asking) and falls through to the public
   board, which under open access is the full board — so no reader loses a
   single pick. Set DE_OPEN_ACCESS=0 on Vercel and the paywall is back on the
   next request: the seal key, the closed key list, the decryptor, the session
   check and the sealer are all still here, untouched. Nothing was deleted; one
   switch decides whether the second copy is worth paying for. */
const OPEN_ACCESS = process.env.DE_OPEN_ACCESS === "1";

/* The keys that have a sealed premium twin. A closed list for the same reason
   /api/snap has one: this is a proxy, and a proxy with an open key space is an
   index of everything behind it. */
const PREMIUM_KEYS = new Set(["picks_unified_live", "picks_unified",
  "pregame_picks", "picks_v4_beta_live", "picks_v4_beta",
  /* NFL/NBA/NHL/WNBA/MLS tracker boards (de_ms_v1). Sealed by the platform's
     multisport/picks/sync_ms_premium.sh from the private full mirrors —
     ungraded cards' pick/stars/why live only behind this route. (MLS renders
     under the SOCCER tab; its board, record and sealed twin stay `mls`.) */
  "nfl", "nba", "nhl", "wnba", "mls"]);
const SEALED_SUFFIX = "__sealed";

type Sealed = { alg: string; iv: string; ct: string; tag: string; v?: string };

function sealKey(): Buffer | null {
  if (!/^[0-9a-f]{64}$/i.test(SEAL_KEY_HEX)) return null;
  return Buffer.from(SEAL_KEY_HEX, "hex");
}

function open(blob: Sealed, key: Buffer): string {
  if (blob.alg !== "aes-256-gcm") throw new Error(`alg ${blob.alg}`);
  const d = createDecipheriv("aes-256-gcm", key,
    Buffer.from(blob.iv, "base64"));
  d.setAuthTag(Buffer.from(blob.tag, "base64"));
  /* GCM AUTHENTICATES — `final()` throws if the ciphertext was altered. That is
     load-bearing rather than incidental: the sealed row lives in a table anyone
     can read, and (with the service key) write. Without the tag check, a
     tampered row would decrypt to garbage that this route would hand a paying
     member as a board. It throws instead, and the caller answers 502. */
  return Buffer.concat([
    d.update(Buffer.from(blob.ct, "base64")),
    d.final(),
  ]).toString("utf8");
}

/* One origin read per publish, shared across every member — see (3) above. The
   entry holds CIPHERTEXT, so caching it is not a paywall hole; the plaintext is
   never written to the cache and never leaves this function unauthenticated. */
function cachedSealed(key: string) {
  return unstable_cache(
    async (): Promise<Sealed | null> => {
      const r = await fetch(
        `${SUPA}/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key + SEALED_SUFFIX)}&select=payload`,
        {
          headers: {
            apikey: ANON, Authorization: `Bearer ${ANON}`,
            "Accept-Encoding": "br",
          },
          cache: "no-store",
        },
      );
      if (!r.ok) throw new Error(`sealed ${r.status}`);
      const rows = await r.json();
      return rows && rows[0] ? (rows[0].payload as Sealed) : null;
    },
    ["premium-sealed-v1", key],
    { tags: [snapTag(key)], revalidate: 120 },
  );
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  const { key } = await ctx.params;
  const headers = { "Cache-Control": "private, no-store" };

  /* THE GATE IS FIRST AND THERE IS NOTHING BEFORE IT. Not a key lookup, not a
     cache read — an unentitled caller must not even be able to learn from
     timing whether a sealed row for this key exists.

     Open access is checked ahead of even that, and it is not an exception to
     the rule: when the public board is unredacted there is no secret left for
     timing to leak, and the whole point is to answer without a network read.
     The reply is the SAME 402 shape an unentitled caller gets, so the client
     needs no new branch. */
  if (OPEN_ACCESS) {
    return NextResponse.json(
      {
        error: "premium_required",
        reason: "open_access",
        upgrade: "/#account",
        message: "Every pick is currently free — the public board is the "
          + "full board. There is nothing behind this route right now.",
      },
      { status: 402, headers },
    );
  }
  const session = await entitledRequest();
  if (!session) {
    return NextResponse.json(
      {
        error: "premium_required",
        upgrade: "/#account",
        message: "Today's picks are part of DiamondEdge Premium. "
          + "The full graded record stays free.",
      },
      { status: 402, headers },
    );
  }
  if (!PREMIUM_KEYS.has(key)) {
    return NextResponse.json({ error: "unknown key" }, { status: 404, headers });
  }
  const k = sealKey();
  if (!k || !SUPA || !ANON) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503, headers });
  }
  try {
    const blob = await cachedSealed(key)();
    if (!blob) {
      return NextResponse.json({ error: "no sealed board" },
        { status: 404, headers });
    }
    const text = open(blob, k);
    return new NextResponse(text, {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": "application/json; charset=utf-8",
        /* So a member's own tooling can tell the two boards apart at a glance,
           and so a bug that serves the public board to a member is visible
           rather than merely disappointing. */
        "x-de-variant": "premium",
        "x-de-seal": createHash("sha256").update(blob.ct).digest("hex").slice(0, 12),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "seal", detail: String((e as Error)?.message || e).slice(0, 120) },
      { status: 502, headers },
    );
  }
}
