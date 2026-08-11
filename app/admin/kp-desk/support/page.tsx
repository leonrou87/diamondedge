import { notFound } from "next/navigation";
import { adminState } from "../../../api/_lib/admin";
import { Shell, Login, fmtDT, ago } from "../ui";
import { allSupport, allUsers, unreadSupport, type DeMsg } from "../data";

/* /admin/kp-desk/support — every thread, unread first, reply inline. */

export const dynamic = "force-dynamic";

export default async function SupportPage(props: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  if (state === "login") return <Login />;
  const sp = await props.searchParams;

  const [msgs, users, unread] = await Promise.all([allSupport(), allUsers(), unreadSupport()]);
  const byUid = new Map<string, DeMsg[]>();
  for (const m of msgs) {
    if (!byUid.has(m.uid)) byUid.set(m.uid, []);
    byUid.get(m.uid)!.push(m);
  }
  const userMap = new Map(users.map((u) => [u.id, u]));
  // unread first, then most recently active
  const threads = [...byUid.entries()].map(([uid, list]) => {
    list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    const unreadN = list.filter((m) => m.direction === "user" && !m.read_by_admin).length;
    const last = list[list.length - 1];
    return { uid, list, unreadN, lastAt: last.created_at };
  }).sort((a, b) => (b.unreadN - a.unreadN) || (+new Date(b.lastAt) - +new Date(a.lastAt)));

  return (
    <Shell active="support" unread={unread}>
      <h1>Support</h1>
      <p className="sub">{threads.length} thread{threads.length === 1 ? "" : "s"} · unread first. Replies land in the member&apos;s in-app thread; tick the box to also email them a copy.</p>
      {sp.sent === "1" ? <div className="note ok">Reply saved{sp.mail === "1" ? " and emailed" : sp.mail === "off" ? " (email not configured — set GMAIL_SUPPORT_USER / GMAIL_SUPPORT_APP_PASSWORD)" : sp.mail === "err" ? " (email failed to send)" : ""}.</div> : null}
      {sp.sent === "0" ? <div className="note err">Reply did not save — try again.</div> : null}
      {threads.length === 0 ? (
        <div className="panel"><p className="muted">No support messages yet. When a member writes in from Account → Support, the thread appears here.</p></div>
      ) : threads.map((t) => {
        const u = userMap.get(t.uid);
        return (
          <div className="panel" key={t.uid}>
            <h2>
              {u ? <a href={`/admin/kp-desk/user/${t.uid}`}>{u.name || u.email}</a> : <span className="mono">{t.uid}</span>}
              {u?.premium ? <span className="badge prem" style={{ marginLeft: 8 }}>◆ Premium</span> : null}
              {t.unreadN > 0 ? <span className="badge unread" style={{ marginLeft: 8 }}>{t.unreadN} new</span> : null}
              <span className="muted" style={{ fontWeight: 400, marginLeft: 8 }}>{ago(t.lastAt)}</span>
            </h2>
            <div className="thread">
              {t.list.slice(-12).map((m) => (
                <div key={m.id} className={`msg ${m.direction}`}>
                  {m.body}
                  <span className="at">{m.direction === "admin" ? "You" : (u?.name || u?.email || "Member")} · {fmtDT(m.created_at)}</span>
                </div>
              ))}
            </div>
            <form method="post" action="/api/admin/reply">
              <input type="hidden" name="uid" value={t.uid} />
              <input type="hidden" name="back" value="/admin/kp-desk/support" />
              <textarea name="body" placeholder="Write a reply…" required style={{ minHeight: 60 }} />
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                <button className="go" type="submit">Reply</button>
                <label className="chk"><input type="checkbox" name="email" value="1" defaultChecked /> also send by email</label>
              </div>
            </form>
          </div>
        );
      })}
    </Shell>
  );
}
