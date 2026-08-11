import { notFound } from "next/navigation";
import { adminState } from "../../../../api/_lib/admin";
import { Shell, Login, fmtD, fmtDT, ago } from "../../ui";
import { userById, eventsForUser, threadFor, unreadSupport } from "../../data";

/* /admin/kp-desk/user/[id] — one member: profile, activity, support thread. */

export const dynamic = "force-dynamic";

const EVENT_LABEL: Record<string, string> = {
  session: "Opened the app",
  tab: "Viewed tab",
  game: "Opened game",
  unlock: "Saw unlock prompt",
  upgrade: "Upgraded to premium",
  signup: "Signed up",
  signout: "Signed out",
};

export default async function UserDetail(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  if (state === "login") return <Login />;
  const { id } = await props.params;
  const sp = await props.searchParams;
  const user = await userById(id);
  if (!user) notFound();
  const [events, thread, unread] = await Promise.all([
    eventsForUser(id), threadFor(id), unreadSupport(),
  ]);
  const back = `/admin/kp-desk/user/${id}`;

  return (
    <Shell active="users" unread={unread}>
      <p style={{ marginBottom: 8 }}><a href="/admin/kp-desk">← All users</a></p>
      <h1>{user.name || user.email}</h1>
      <p className="sub">
        {user.email} · {user.provider || "unknown provider"} ·{" "}
        {user.premium
          ? <span className="badge prem">◆ Premium since {fmtD(user.premium_since)}{user.premium_source ? ` (${user.premium_source})` : ""}</span>
          : <span className="badge free">Free</span>}
      </p>
      <div className="cards">
        <div className="card"><div className="k">Joined</div><div className="v" style={{ fontSize: 15 }}>{fmtD(user.created_at)}</div></div>
        <div className="card"><div className="k">Last seen</div><div className="v" style={{ fontSize: 15 }}>{ago(user.last_seen)}</div></div>
        <div className="card"><div className="k">Events on record</div><div className="v" style={{ fontSize: 15 }}>{events.length}{events.length >= 200 ? "+" : ""}</div></div>
        <div className="card"><div className="k">Email this member</div>
          <div className="v" style={{ fontSize: 15 }}><a href={`/admin/kp-desk/email?to=uid:${user.id}`}>Compose →</a></div></div>
      </div>

      <div className="panel">
        <h2>Support thread</h2>
        {sp.sent === "1" ? <div className="note ok">Reply saved{sp.mail === "1" ? " and emailed" : sp.mail === "off" ? " (email not configured — set GMAIL_SUPPORT_USER / GMAIL_SUPPORT_APP_PASSWORD)" : sp.mail === "err" ? " (email failed to send)" : ""}.</div> : null}
        {sp.sent === "0" ? <div className="note err">Reply did not save — try again.</div> : null}
        {thread.length === 0 ? <p className="muted">No messages yet.</p> : (
          <div className="thread">
            {thread.map((m) => (
              <div key={m.id} className={`msg ${m.direction}`}>
                {m.body}
                <span className="at">{m.direction === "admin" ? "You" : user.name || user.email} · {fmtDT(m.created_at)}{m.direction === "user" && !m.read_by_admin ? " · new" : ""}</span>
              </div>
            ))}
          </div>
        )}
        <form method="post" action="/api/admin/reply">
          <input type="hidden" name="uid" value={user.id} />
          <input type="hidden" name="back" value={back} />
          <textarea name="body" placeholder="Write a reply…" required />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <button className="go" type="submit">Reply</button>
            <label className="chk"><input type="checkbox" name="email" value="1" defaultChecked /> also send by email</label>
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Activity</h2>
        {events.length === 0 ? <p className="muted">No events recorded for this user yet.</p> : (
          <table>
            <thead><tr><th>When</th><th>What</th><th>Detail</th></tr></thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDT(e.created_at)}</td>
                  <td>{EVENT_LABEL[e.type] || e.type}</td>
                  <td className="mono">{e.meta || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Shell>
  );
}
