import { notFound } from "next/navigation";
import { adminState } from "../../../api/_lib/admin";
import { smtpMissing } from "../../../api/_lib/smtp";
import { Shell, Login } from "../ui";
import { allUsers, userById, unreadSupport } from "../data";

/* ════════════════════════════════════════════════════════════════════════════
   /admin/kp-desk/email — send an email to one member or a segment.

   Sends go through Gmail SMTP (GMAIL_SUPPORT_USER + GMAIL_SUPPORT_APP_PASSWORD
   — the password must be a Google App Password, not the account login).
   FAIL CLOSED, NAME THE VAR: when creds are missing the form says exactly
   which env var to set and the send route refuses; nothing ever pretends
   to have sent. Segment sends BCC every recipient in one transaction.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export default async function EmailPage(props: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  if (state === "login") return <Login />;
  const sp = await props.searchParams;

  const missing = smtpMissing();
  const [users, unread] = await Promise.all([allUsers(), unreadSupport()]);
  const premium = users.filter((u) => u.premium).length;
  const to = typeof sp.to === "string" ? sp.to : "";
  const toUser = to.startsWith("uid:") ? await userById(to.slice(4)) : null;
  const r = typeof sp.r === "string" ? sp.r : "";

  return (
    <Shell active="email" unread={unread}>
      <h1>Email</h1>
      <p className="sub">One member or a segment, from {process.env.GMAIL_SUPPORT_USER || "the support inbox"}. Segment sends are BCC — members never see each other&apos;s addresses.</p>

      {r === "sent" ? <div className="note ok">Sent to {sp.n || "?"} recipient{sp.n === "1" ? "" : "s"}.</div> : null}
      {r === "err" ? <div className="note err">Send failed: {typeof sp.msg === "string" ? sp.msg : "unknown error"}. Nothing was sent.</div> : null}
      {r === "missing" ? <div className="note err">Recipient, subject and body are all required.</div> : null}
      {r === "norecipients" ? <div className="note err">That segment has no members with an email address.</div> : null}
      {r === "unset" || missing.length ? (
        <div className="note warn">
          Email is not configured — nothing can be sent until the owner sets{" "}
          <b className="mono">{(typeof sp.vars === "string" && sp.vars ? sp.vars.split(",") : missing).join(", ")}</b>{" "}
          in the environment (Vercel → diamondedge → Settings → Environment Variables).
          GMAIL_SUPPORT_APP_PASSWORD must be a Google <b>App Password</b> for the kytepush@gmail.com
          account (Google Account → Security → 2-Step Verification → App passwords) — the normal
          login password will be refused by Gmail SMTP.
        </div>
      ) : null}

      <div className="panel">
        <form method="post" action="/api/admin/email" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label>
            To
            <select name="to" defaultValue={toUser ? `uid:${toUser.id}` : (to === "premium" || to === "free" ? to : "all")}>
              {toUser ? <option value={`uid:${toUser.id}`}>{toUser.name || toUser.email} ({toUser.email})</option> : null}
              <option value="all">All users ({users.length})</option>
              <option value="premium">Premium members ({premium})</option>
              <option value="free">Free members ({users.length - premium})</option>
            </select>
          </label>
          <label>Subject<input type="text" name="subject" required maxLength={200} /></label>
          <label>Message<textarea name="body" required maxLength={10000} style={{ minHeight: 140 }} /></label>
          <div>
            {missing.length
              ? <button className="go" type="button" disabled title={`Set ${missing.join(", ")} first`} style={{ opacity: .5, cursor: "not-allowed" }}>Send (set {missing.join(", ")})</button>
              : <button className="go" type="submit">Send</button>}
          </div>
        </form>
      </div>
    </Shell>
  );
}
