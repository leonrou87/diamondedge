import { NextResponse } from "next/server";
import { adminState } from "../../_lib/admin";
import { supa } from "../../_lib/de";
import { sendMail, smtpMissing } from "../../_lib/smtp";

/* ════════════════════════════════════════════════════════════════════════════
   POST /api/admin/email — the owner emails a member or a segment.

   Form fields: to = "uid:<id>" | "all" | "premium" | "free",
                subject, body.

   Segment sends go out as ONE SMTP transaction with every recipient as an
   RCPT (i.e. BCC semantics — members never see each other's addresses).
   FAIL CLOSED, NAME THE VAR: with the Gmail creds unset nothing is sent and
   the redirect carries the exact missing env var names for the page to show.
   Not the admin ⇒ 404.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if ((await adminState()) !== "ok") return new NextResponse(null, { status: 404 });
  const url = new URL(req.url);
  const dest = (q: string) =>
    NextResponse.redirect(new URL("/admin/kp-desk/email?" + q, url.origin), 303);

  let to = "", subject = "", body = "";
  try {
    const form = await req.formData();
    to = String(form.get("to") || "").slice(0, 60);
    subject = String(form.get("subject") || "").trim().slice(0, 200);
    body = String(form.get("body") || "").trim().slice(0, 10000);
  } catch {}
  if (!to || !subject || !body) return dest("r=missing");

  const missing = smtpMissing();
  if (missing.length) return dest("r=unset&vars=" + encodeURIComponent(missing.join(",")));

  // ── resolve recipients ──
  let emails: string[] = [];
  if (to.startsWith("uid:")) {
    const u = await supa(`de_users?id=eq.${encodeURIComponent(to.slice(4))}&select=email`);
    if (u.ok && Array.isArray(u.json) && u.json[0]?.email) emails = [u.json[0].email];
  } else if (to === "all" || to === "premium" || to === "free") {
    const filter = to === "all" ? "" : `&premium=is.${to === "premium" ? "true" : "false"}`;
    const u = await supa(`de_users?select=email${filter}&order=created_at.asc`, { range: "0-499" });
    if (u.ok && Array.isArray(u.json)) emails = u.json.map((r: any) => r.email).filter(Boolean);
  }
  if (!emails.length) return dest("r=norecipients");

  const r = await sendMail({ to: emails, subject, text: body });
  return dest(r.ok ? `r=sent&n=${emails.length}` : "r=err&msg=" + encodeURIComponent(r.error || ""));
}
