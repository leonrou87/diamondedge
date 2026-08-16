import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/* ═══════════════════════════════════════════════════════════════════════════════════════
   /api/session — ONE JOB LEFT: CLEAR A COOKIE FROM THE PAID ERA.

   This file was 288 lines and a fully working paywall server: an HMAC session minter, a
   30-day `de_session` cookie, a redeem endpoint for DE_PREMIUM_CODES, and a live rail to
   api.whop.com that re-validated a membership every 24 hours and wrote `premium = true`
   back to de_users. On 2026-08-16 the paywall was deleted from the product — and all of
   that stayed, exported, reachable, and answering.

   NOTHING CALLED IT. The client's isPremium / setPremium / refreshSession /
   redeemAccessCode / mockCheckout were deleted; /api/premium/[key], the only importer of
   entitledRequest(), mint(), readSession() and COOKIE, was deleted with them. The single
   surviving caller in the whole repo is app/page.tsx's sign-out:

       fetch("/api/session", { method: "DELETE" })

   A dormant paywall server is not neutral. GET still answered "am I entitled?", POST still
   minted a 30-day premium cookie for anyone who guessed a code, and both still called
   markPremium() — a live write path to a `premium` column on real user rows, for a tier
   that no longer exists. It was one fetch away from being re-armed by accident, and it read
   like current architecture to anyone opening the file.

   So it is gone, not commented out. What remains is the cleanup: a browser that still holds
   a `de_session` from before 2026-08-16 gets it dropped on sign-out. The cookie has a 30-day
   maximum age, so this handler is itself temporary — after 2026-09-15 no live cookie can
   exist and the route can go too.

   Deleted alongside it: markPremium() in _lib/de.ts (its only caller was the POST above,
   so nothing can set de_users.premium any more — the column stays as history, which the
   admin console still reads) and verifySmtp() in _lib/smtp.ts (exported, zero importers).
   The env vars DE_PREMIUM_CODES, WHOP_API_KEY and DE_ALLOW_MOCK_CHECKOUT are now read by
   nothing in this repo and should be removed from .env.local and from Vercel.
   ═══════════════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const COOKIE = "de_session";

export async function DELETE() {
  const c = await cookies();
  c.delete(COOKIE);
  return NextResponse.json(
    { ok: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
