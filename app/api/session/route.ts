import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
/* Admin-console data layer (2026-08-10): when premium is granted here, the
   server-side user record (de_users) learns about it — that is the ONLY
   coupling, and it is graceful: no service key / no uid cookie ⇒ no-op. */
import { readUid, markPremium } from "../_lib/de";

/* ════════════════════════════════════════════════════════════════════════════
   /api/session — THE FIRST SERVER-SIDE ENTITLEMENT THIS APP HAS EVER HAD.

   WHAT WAS HERE BEFORE: nothing. `entitled()` in page.tsx read
   `localStorage.de_premium === "1"` and `localStorage.de_account`, both written
   by the browser, both settable by anyone with a devtools console. Searching
   the whole api/ tree for "entitl|subscri|stripe|session|premium" returned no
   files. So the paywall had no server half at all, which is why the payload was
   the same bytes for everyone and why redacting it was the only thing that
   could possibly have gated it.

   WHAT THIS IS, HONESTLY. There is still no billing backend — `renderSubscribe`
   says so in its own comment and its checkout is a stub. This is not a
   pretend-Stripe. It is the smallest thing that is REAL: a member presents an
   access code, the server compares it against a secret the browser never sees,
   and mints an HMAC-signed HttpOnly cookie. localStorage cannot forge it,
   devtools cannot set it, and the premium payload route will not open the
   sealed board without it.

   IT IS A PLACEHOLDER IN THE SAME SENSE THE CHECKOUT IS — but a placeholder
   that fails CLOSED. When Stripe lands, the webhook mints exactly this cookie
   on a successful subscription and `verifyCode` is replaced by a customer
   lookup. Nothing else in the app has to change, because everything downstream
   already asks the server rather than localStorage.

   FAIL-CLOSED IS THE DEFAULT AND IT IS DELIBERATE. With `DE_SESSION_SECRET`
   unset there is no way to sign a cookie, so nothing is entitled and every
   reader gets the public board plus the upsell. That is the correct behaviour
   for an unconfigured paywall: the failure mode of a misconfigured gate should
   be "nobody gets in", never "everybody does" — which is precisely the failure
   this whole change is repairing.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const SECRET = process.env.DE_SESSION_SECRET || "";
/* Comma-separated member access codes. A code is a bearer credential, so it is
   compared in constant time and never echoed back — not in a response body, not
   in a log line, not in an error. */
const CODES = (process.env.DE_PREMIUM_CODES || "")
  .split(",").map((s) => s.trim()).filter(Boolean);
/* ═══ THE MOCK CHECKOUT IS RETIRED — IT HAD BECOME THE PAYWALL'S OPEN DOOR ═══
   2026-08-14. It was written on 2026-08-10 for a good reason: there was no
   gateway, and "tap Subscribe → the board unlocks" had to come from somewhere
   real or the button was a lie. It was owner-gated behind DE_ALLOW_MOCK_CHECKOUT
   =1 and it failed closed by default.
   On production that flag was ON, and the Whop rail had landed underneath it the
   same day. So the gate had a second key that cost nothing: POST {"mock":true}
   minted a signed 30-day premium cookie for anybody who asked. Measured before
   removal, against https://diamondedge.kytepush.com — GET /api/session reported
   {"mock":true}; POST {"mock":true} returned 200 {"ok":true,"premium":true} and
   set de_session; that cookie fetched /api/premium/picks_unified_live 200 with
   the night's live picks (side, line, stars) in the clear, against 402 for an
   anonymous caller. A visitor did not need the API: the "Subscribe" button was
   wired to it, under a card form that took no card.
   No caller is left — the client's mockCheckout() went in the same change, and
   nothing in either repo reads the `mock` field or DE_ALLOW_MOCK_CHECKOUT. The
   env var is now inert; it can be deleted in Vercel at the owner's convenience,
   and setting it again does nothing. The two ways to be entitled are the two
   real ones: an owner code from DE_PREMIUM_CODES, or a Whop membership key.
   A paywall may only ever get stronger. */

/* ═══ WHOP — THE REAL PAYMENT RAIL (2026-08-10) ═══
   The store is live at whop.com/kytepush/diamondedge-premium ($12.99/mo, 3-day
   trial). A buyer's membership key is redeemed in the SAME access-code box the
   static codes use: verifyCode() first (owner codes), then Whop's company API.
   A Whop-backed session carries the key in its signed claims (`wk`) and is
   RE-VALIDATED against Whop at most every 24h on GET (`wv` = last verify): a
   cancelled or lapsed-trial membership loses premium within a day, without the
   member ever re-pasting. Whop unreachable ⇒ the session keeps working (a
   billing-API blip must not lock out paying members); invalid ⇒ cookie cleared. */
const WHOP_KEY = process.env.WHOP_API_KEY || "";
const WHOP_OK_STATUS = new Set(["active", "trialing", "completed", "past_due"]);
type WhopAnswer = "valid" | "invalid" | "unavailable";
function whopRowValid(m: any): boolean {
  if (!m || typeof m !== "object") return false;
  if (m.valid === true) return true;
  return WHOP_OK_STATUS.has(String(m.status || "").toLowerCase());
}
async function whopCheck(code: string): Promise<WhopAnswer> {
  if (!WHOP_KEY) return "invalid";
  const h = { Authorization: `Bearer ${WHOP_KEY}` };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 8000);
  try {
    // A pasted `mem_…` membership id resolves directly; anything else is tried
    // as a license key. Both shapes appear in Whop receipts/hub, so both work.
    if (/^mem_[A-Za-z0-9]+$/.test(code)) {
      const r = await fetch(
        `https://api.whop.com/api/v5/company/memberships/${encodeURIComponent(code)}`,
        { headers: h, signal: ctl.signal, cache: "no-store" });
      if (r.ok) return whopRowValid(await r.json()) ? "valid" : "invalid";
      if (r.status === 404) return "invalid";
      return r.status >= 500 ? "unavailable" : "invalid";
    }
    const r = await fetch(
      `https://api.whop.com/api/v5/company/memberships?license_key=${encodeURIComponent(code)}`,
      { headers: h, signal: ctl.signal, cache: "no-store" });
    if (!r.ok) return r.status >= 500 ? "unavailable" : "invalid";
    const j: any = await r.json().catch(() => null);
    const rows: any[] = Array.isArray(j) ? j : (j && Array.isArray(j.data) ? j.data : []);
    return rows.some(whopRowValid) ? "valid" : "invalid";
  } catch {
    return "unavailable";
  } finally {
    clearTimeout(t);
  }
}

export const COOKIE = "de_session";
const MAX_AGE_S = 60 * 60 * 24 * 30;      // 30 days

type Claims = { sub: string; tier: string; exp: number; wk?: string; wv?: number };

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Mint a signed session. `<base64url(claims)>.<hmac>`. */
export function mint(claims: Claims): string {
  const body = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Verify a cookie value and return its claims, or null. Never throws. */
export function readSession(raw: string | undefined | null): Claims | null {
  if (!SECRET || !raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  const body = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const want = sign(body);
  /* Constant-time, and length-checked first because timingSafeEqual throws on a
     length mismatch — and a thrown comparison is a comparison that leaked the
     length. */
  if (mac.length !== want.length) return null;
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return null;
  try {
    const c = JSON.parse(Buffer.from(body, "base64url").toString()) as Claims;
    if (!c || typeof c.exp !== "number" || c.exp * 1000 < Date.now()) return null;
    return c;
  } catch {
    return null;
  }
}

/** Is THIS request entitled? The one question every premium surface asks. */
export async function entitledRequest(): Promise<Claims | null> {
  const c = await cookies();
  const s = readSession(c.get(COOKIE)?.value);
  return s && s.tier === "premium" ? s : null;
}

function verifyCode(given: string): boolean {
  /* Compare against EVERY configured code, and do not short-circuit: the loop
     runs to the end so the time taken does not reveal which code matched or how
     many there are. */
  const g = Buffer.from(given);
  let ok = false;
  for (const c of CODES) {
    const b = Buffer.from(c);
    if (b.length === g.length && timingSafeEqual(b, g)) ok = true;
  }
  return ok;
}

/** GET — "am I entitled?" The client asks the SERVER, never localStorage. */
export async function GET() {
  let s = await entitledRequest();
  /* WHOP SESSIONS RE-PROVE THEMSELVES DAILY. The cookie outlives a cancelled
     subscription by design (30d), so a Whop-backed session re-validates its key
     at most every 24h: still valid → quietly re-minted with a fresh `wv`;
     cancelled/lapsed → cookie cleared, premium off — within a day, no re-paste.
     Whop unreachable → the member keeps access (billing blips never lock out
     paying readers; the next GET retries). */
  if (s && s.wk && (!s.wv || Math.floor(Date.now() / 1000) - s.wv > 86400)) {
    const w = await whopCheck(s.wk);
    const c = await cookies();
    if (w === "invalid") {
      c.delete(COOKIE);
      s = null;
    } else if (w === "valid") {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + MAX_AGE_S;
      c.set(COOKIE, mint({ ...s, exp, wv: now }), {
        httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: MAX_AGE_S,
      });
    }
  }
  return NextResponse.json(
    {
      premium: !!s,
      /* So the UI can say something true when the gate is not configured yet,
         instead of silently behaving as though every reader is a free one for
         a reason nobody can see. */
      configured: !!SECRET && CODES.length > 0,
      /* `mock` used to ride here — whether the owner-gated stub checkout was
         live. There is no stub checkout now, so there is nothing to report and
         nothing for a client to branch on. */
      since: s ? new Date((s.exp - MAX_AGE_S) * 1000).toISOString() : null,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

/** POST {code} — redeem an owner access code or a Whop membership key. That is
    the only way in. DELETE — sign out. */
export async function POST(req: Request) {
  const noStore = { "Cache-Control": "private, no-store" };
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    /* fall through — a malformed body and a wrong code get the same answer,
       because telling them apart is free information about the credential. */
  }
  /* ── THE MOCK CHECKOUT'S BRANCH ────────────────────────────────────────
     Deleted, not disabled. A {"mock":true} body now falls straight through to
     the code path below, where it has no `code` and is answered 401 like any
     other credential-less request — the same answer a wrong code gets, which is
     the point: this endpoint does not tell a caller which of its doors exist. */
  if (!SECRET || (!CODES.length && !WHOP_KEY)) {
    return NextResponse.json(
      { ok: false, reason: "unconfigured" },
      { status: 503, headers: noStore },
    );
  }
  const code = String((body && body.code) || "").trim().slice(0, 128);
  if (!code) {
    return NextResponse.json(
      { ok: false, reason: "invalid" },
      { status: 401, headers: noStore },
    );
  }
  /* Owner codes first (constant-time, offline), then the paid rail: the same
     box redeems a Whop membership key. */
  let via: "code" | "whop" | null = verifyCode(code) ? "code" : null;
  if (!via && WHOP_KEY) {
    const w = await whopCheck(code);
    if (w === "unavailable") {
      return NextResponse.json(
        { ok: false, reason: "whop_unavailable" },
        { status: 503, headers: noStore },
      );
    }
    if (w === "valid") via = "whop";
  }
  if (!via) {
    return NextResponse.json(
      { ok: false, reason: "invalid" },
      { status: 401, headers: noStore },
    );
  }
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const now = Math.floor(Date.now() / 1000);
  const c = await cookies();
  c.set(COOKIE, mint(via === "whop"
    ? { sub: randomUUID(), tier: "premium", exp, wk: code, wv: now }
    : { sub: randomUUID(), tier: "premium", exp }), {
    httpOnly: true,          // the whole point: JS cannot read or write it
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
  try { const uid = await readUid(); if (uid) await markPremium(uid, via); } catch {}
  return NextResponse.json(
    { ok: true, premium: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function DELETE() {
  const c = await cookies();
  c.delete(COOKIE);
  return NextResponse.json(
    { ok: true, premium: false },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
