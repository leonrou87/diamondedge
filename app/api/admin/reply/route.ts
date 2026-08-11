import { NextResponse } from "next/server";
import { adminState } from "../../_lib/admin";
import { supa } from "../../_lib/de";
import { sendMail, smtpMissing } from "../../_lib/smtp";

/* ════════════════════════════════════════════════════════════════════════════
   POST /api/admin/reply — the owner answers a support thread.

   Form fields: uid, body, email=1 (optionally mirror the reply to the
   member's inbox — "you'll also get a copy by email" is the promise the
   consumer UI makes), back (path to bounce to).

   FAIL CLOSED: not the admin ⇒ 404, indistinguishable from a URL that does
   not exist. Email mirroring only when the Gmail creds are set; a reply
   that could not be emailed still lands in the thread and the redirect says
   so (?mail=off) rather than pretending.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if ((await adminState()) !== "ok") return new NextResponse(null, { status: 404 });
  const url = new URL(req.url);
  let uid = "", body = "", wantMail = false, back = "";
  try {
    const form = await req.formData();
    uid = String(form.get("uid") || "").slice(0, 40);
    body = String(form.get("body") || "").trim().slice(0, 4000);
    wantMail = String(form.get("email") || "") === "1";
    back = String(form.get("back") || "");
  } catch {}
  const dest = (p: string) => NextResponse.redirect(new URL(p, url.origin), 303);
  const backPath = back.startsWith("/admin/kp-desk") ? back : "/admin/kp-desk/support";
  if (!uid || !body) return dest(backPath + "?sent=0");

  const ins = await supa("de_support_messages", {
    method: "POST", prefer: "return=minimal",
    body: [{ uid, direction: "admin", body, read_by_admin: true, read_by_user: false }],
  });
  if (!ins.ok) return dest(backPath + "?sent=0");
  // Reading the thread to answer it — the user's messages are now read.
  await supa(`de_support_messages?uid=eq.${encodeURIComponent(uid)}&direction=eq.user&read_by_admin=is.false`, {
    method: "PATCH", prefer: "return=minimal", body: { read_by_admin: true },
  });

  let mailFlag = "";
  if (wantMail) {
    if (smtpMissing().length) {
      mailFlag = "&mail=off";
    } else {
      const u = await supa(`de_users?id=eq.${encodeURIComponent(uid)}&select=email,name`);
      const email = u.ok && Array.isArray(u.json) && u.json[0]?.email;
      if (email) {
        const r = await sendMail({
          to: [email],
          subject: "DiamondEdge support — a reply to your message",
          text:
            `${body}\n\n—\nDiamondEdge support · diamondedge.kytepush.com\n` +
            `Reply in the app (Account → Support) or just answer this email.`,
        });
        mailFlag = r.ok ? "&mail=1" : "&mail=err";
      } else {
        mailFlag = "&mail=err";
      }
    }
  }
  return dest(backPath + "?sent=1" + mailFlag);
}
