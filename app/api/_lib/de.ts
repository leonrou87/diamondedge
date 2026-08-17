import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/* ════════════════════════════════════════════════════════════════════════════
   THE FIRST SERVER-SIDE USER STORE THIS APP HAS EVER HAD (2026-08-10).

   Before this file, "an account" was a localStorage record the browser wrote
   to itself — the server had no idea who anyone was. Three Supabase tables
   change that: de_users, de_events, de_support_messages. All three are
   RLS-DENY to the anon key (the anon key ships in the public bundle; these
   tables are the opposite of slate_snapshots, which is deliberately public).
   Every read and write goes through here, server-side, with the SERVICE key.

   FAIL-OPEN FOR UX, CLOSED FOR DATA. If SUPABASE_SERVICE_KEY is unset or a
   query fails, every helper returns a harmless null/false and the consumer
   app behaves exactly as it did before this file existed. No user-facing
   flow may ever break because the admin data layer is down.
   ════════════════════════════════════════════════════════════════════════════ */

const SUPA_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
/* The uid cookie is signed with the SAME secret as the premium session cookie
   (DE_SESSION_SECRET) — one signing secret for consumer cookies, one
   (ADMIN_SESSION_SECRET) for the admin console. An unsigned uid would let
   anyone read anyone's support thread by pasting a cookie. */
const UID_SECRET = process.env.DE_SESSION_SECRET || "";

export const dataConfigured = () => !!(SUPA_URL && SERVICE_KEY);

/* ═══ THE CONSOLE MUST NOT PAINT AN OUTAGE AS AN EMPTY BUSINESS (2026-08-17) ═══
   Every helper in kp-desk/data.ts fails soft to [] — right for the consumer
   contract above, but the admin console renders those empties as "Users: 0",
   which is a CONFIDENT WRONG NUMBER during a Supabase 402 (the free-tier
   egress cap). This records the last failed call so the console's Shell can
   say "the data layer is refusing" instead. Module-level and per-instance on
   purpose: the console's own queries run in the same invocation as its
   render, so by the time Shell reads this, the page's own reads have already
   set it. Not a monitor — the platform's egress_watch owns alerting; this is
   honesty in the one UI that would otherwise lie. */
let lastDataFailure: { status: number; at: number } | null = null;

export function dataLayerFault(withinMs = 15000): { status: number } | null {
  if (!lastDataFailure) return null;
  if (Date.now() - lastDataFailure.at > withinMs) return null;
  return { status: lastDataFailure.status };
}

/** Raw PostgREST call with the service key. Never throws; never cached. */
export async function supa(
  pathAndQuery: string,
  init?: { method?: string; body?: any; prefer?: string; range?: string },
): Promise<{ ok: boolean; status: number; json: any }> {
  if (!dataConfigured()) return { ok: false, status: 0, json: null };
  try {
    const headers: Record<string, string> = {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    };
    if (init?.prefer) headers.Prefer = init.prefer;
    if (init?.range) { headers.Range = init.range; headers["Range-Unit"] = "items"; }
    const r = await fetch(`${SUPA_URL}/rest/v1/${pathAndQuery}`, {
      method: init?.method || "GET",
      headers,
      body: init?.body != null ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
    let json: any = null;
    try { json = await r.json(); } catch { /* 204s and HEADs have no body */ }
    if (!r.ok) lastDataFailure = { status: r.status, at: Date.now() };
    return { ok: r.ok, status: r.status, json };
  } catch {
    lastDataFailure = { status: 0, at: Date.now() };
    return { ok: false, status: 0, json: null };
  }
}

/* ── The uid cookie: `<uuid>.<hmac>` — HttpOnly, one year. ── */
export const UID_COOKIE = "de_uid";
const UID_MAX_AGE_S = 60 * 60 * 24 * 365;

function uidSign(uid: string): string {
  return createHmac("sha256", UID_SECRET).update(uid).digest("base64url");
}

export async function setUidCookie(uid: string): Promise<boolean> {
  if (!UID_SECRET) return false; // no secret ⇒ no signable identity ⇒ no cookie
  const c = await cookies();
  c.set(UID_COOKIE, `${uid}.${uidSign(uid)}`, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: UID_MAX_AGE_S,
  });
  return true;
}

/** The signed-in visitor's server-side user id, or null. Never throws. */
export async function readUid(): Promise<string | null> {
  if (!UID_SECRET) return null;
  try {
    const c = await cookies();
    const raw = c.get(UID_COOKIE)?.value;
    if (!raw) return null;
    const dot = raw.lastIndexOf(".");
    if (dot < 1) return null;
    const uid = raw.slice(0, dot);
    const mac = raw.slice(dot + 1);
    const want = uidSign(uid);
    if (mac.length !== want.length) return null;
    if (!timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return null;
    return uid;
  } catch {
    return null;
  }
}

/** Upsert a user by email; returns the row ({id,...}) or null. */
export async function upsertUser(u: {
  email: string; name?: string; provider?: string;
}): Promise<any | null> {
  const email = String(u.email || "").trim().toLowerCase().slice(0, 254);
  if (!email || !email.includes("@")) return null;
  const r = await supa("de_users?on_conflict=email", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: [{
      email,
      name: String(u.name || "").slice(0, 120) || null,
      provider: String(u.provider || "").slice(0, 24) || null,
      last_seen: new Date().toISOString(),
    }],
  });
  return r.ok && Array.isArray(r.json) && r.json[0] ? r.json[0] : null;
}

/* markPremium() DELETED (2026-08-16). Its only caller was the redeem handler in
   /api/session, which had no client and is now gone. It was the single write path to
   de_users.premium — nothing can set that column any more. The column itself stays:
   the admin console reads it as history of who paid while there was something to buy. */

/** Bump last_seen; fire-and-forget semantics (errors swallowed inside supa). */
export async function touchUser(uid: string): Promise<void> {
  if (!uid) return;
  await supa(`de_users?id=eq.${encodeURIComponent(uid)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { last_seen: new Date().toISOString() },
  });
}
