import { NextResponse } from "next/server";
import {
  adminConfigured, adminState, checkAdminPassword, setAdminCookie, clearAdminCookie,
} from "../../_lib/admin";

/* ════════════════════════════════════════════════════════════════════════════
   POST /api/admin/login — the only door into /admin/kp-desk.

   Plain HTML form post (the console is server-rendered, no client JS).
   Unconfigured ⇒ 404, exactly like every other admin surface: an
   unconfigured deployment must not reveal that an admin console exists.
   Wrong password ⇒ back to the login form with ?e=1 and NO cookie; the
   password is compared in constant time and never logged or echoed.
   POST with out=1 ⇒ sign out.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) return new NextResponse(null, { status: 404 });
  const url = new URL(req.url);
  let pw = "", out = "";
  try {
    const form = await req.formData();
    pw = String(form.get("password") || "");
    out = String(form.get("out") || "");
  } catch {}
  const dest = (p: string) => new URL(p, url.origin);
  if (out === "1") {
    await clearAdminCookie();
    return NextResponse.redirect(dest("/admin/kp-desk"), 303);
  }
  if (!checkAdminPassword(pw)) {
    // If already signed in, a bad re-auth attempt does not kill the session;
    // it just bounces back. Signed out, it is the ?e=1 login form.
    const authed = (await adminState()) === "ok";
    return NextResponse.redirect(dest(authed ? "/admin/kp-desk" : "/admin/kp-desk?e=1"), 303);
  }
  await setAdminCookie();
  return NextResponse.redirect(dest("/admin/kp-desk"), 303);
}
