import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN SESSION — the owner's console at /admin/kp-desk.

   Same HMAC-cookie pattern as /api/session, DIFFERENT secret
   (ADMIN_SESSION_SECRET): a leaked consumer secret must never mint an admin
   cookie, and vice versa. The password itself (ADMIN_PASSWORD) is only ever
   compared server-side, in constant time, and never echoed anywhere.

   FAIL CLOSED, AND INVISIBLY. With either env var unset there is no way to
   sign or verify anything, so every admin surface 404s — the special URL
   reveals nothing about its own existence on an unconfigured deployment.
   ════════════════════════════════════════════════════════════════════════════ */

const PASS = process.env.ADMIN_PASSWORD || "";
const SECRET = process.env.ADMIN_SESSION_SECRET || "";

export const ADMIN_COOKIE = "de_admin";
const MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

export const adminConfigured = () => !!(PASS && SECRET);

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

export function mintAdmin(): string {
  const body = Buffer.from(
    JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + MAX_AGE_S }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readAdmin(raw: string | undefined | null): boolean {
  if (!adminConfigured() || !raw) return false;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return false;
  const body = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const want = sign(body);
  if (mac.length !== want.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(mac), Buffer.from(want))) return false;
    const c = JSON.parse(Buffer.from(body, "base64url").toString());
    return !!c && c.role === "admin" && typeof c.exp === "number" && c.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/** One question every admin surface asks. */
export async function adminState(): Promise<"unconfigured" | "login" | "ok"> {
  if (!adminConfigured()) return "unconfigured";
  try {
    const c = await cookies();
    return readAdmin(c.get(ADMIN_COOKIE)?.value) ? "ok" : "login";
  } catch {
    return "login";
  }
}

/** Constant-time password check. */
export function checkAdminPassword(given: string): boolean {
  if (!adminConfigured()) return false;
  const g = Buffer.from(String(given || ""));
  const w = Buffer.from(PASS);
  if (g.length !== w.length) {
    // burn a comparison anyway so length alone does not change the timing shape
    timingSafeEqual(w, w);
    return false;
  }
  return timingSafeEqual(g, w);
}

export async function setAdminCookie(): Promise<void> {
  const c = await cookies();
  c.set(ADMIN_COOKIE, mintAdmin(), {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: MAX_AGE_S,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
