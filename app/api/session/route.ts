import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";

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

export const COOKIE = "de_session";
const MAX_AGE_S = 60 * 60 * 24 * 30;      // 30 days

type Claims = { sub: string; tier: string; exp: number };

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
  const s = await entitledRequest();
  return NextResponse.json(
    {
      premium: !!s,
      /* So the UI can say something true when the gate is not configured yet,
         instead of silently behaving as though every reader is a free one for
         a reason nobody can see. */
      configured: !!SECRET && CODES.length > 0,
      since: s ? new Date((s.exp - MAX_AGE_S) * 1000).toISOString() : null,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

/** POST {code} — redeem an access code for a session. DELETE — sign out. */
export async function POST(req: Request) {
  if (!SECRET || !CODES.length) {
    return NextResponse.json(
      { ok: false, reason: "unconfigured" },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
  let code = "";
  try {
    const body = await req.json();
    code = String((body && body.code) || "").trim().slice(0, 128);
  } catch {
    /* fall through to the same generic refusal — a malformed body and a wrong
       code get the same answer, because telling them apart is free information
       about the shape of the credential. */
  }
  if (!code || !verifyCode(code)) {
    return NextResponse.json(
      { ok: false, reason: "invalid" },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_S;
  const c = await cookies();
  c.set(COOKIE, mint({ sub: randomUUID(), tier: "premium", exp }), {
    httpOnly: true,          // the whole point: JS cannot read or write it
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
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
