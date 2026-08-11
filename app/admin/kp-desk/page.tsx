import { notFound } from "next/navigation";
import { adminState } from "../../api/_lib/admin";
import { dataConfigured } from "../../api/_lib/de";
import { Shell, Login, fmtD, ago } from "./ui";
import { allUsers, recentEvents, unreadSupport } from "./data";

/* ════════════════════════════════════════════════════════════════════════════
   /admin/kp-desk — USERS. The owner's front page: every account the app has
   ever seen, searchable, with premium state and a 30-day activity count.

   AUTH SHAPE (same on every console page):
     · env unset        → notFound(): the URL does not exist on an
                          unconfigured deployment. The path is NOT the
                          security — this fail-closed 404 plus the HMAC
                          cookie are.
     · no/invalid cookie → the login form (POSTs to /api/admin/login).
     · valid cookie      → the page.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

export default async function UsersPage(props: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  const sp = await props.searchParams;
  if (state === "login") return <Login error={sp.e === "1"} />;

  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const [users, events, unread] = await Promise.all([
    allUsers(q || undefined), recentEvents(30), unreadSupport(),
  ]);
  const evByUid = new Map<string, number>();
  for (const e of events) if (e.uid) evByUid.set(e.uid, (evByUid.get(e.uid) || 0) + 1);
  const now = Date.now();
  const premium = users.filter((u) => u.premium).length;
  const newWeek = users.filter((u) => now - +new Date(u.created_at) < 7 * 864e5).length;
  const activeDay = users.filter((u) => now - +new Date(u.last_seen) < 864e5).length;

  return (
    <Shell active="users" unread={unread}>
      <h1>Users</h1>
      <p className="sub">
        Every server-registered account. {dataConfigured() ? "" : "Data layer is not configured — set SUPABASE_SERVICE_KEY."}
      </p>
      <div className="cards">
        <div className="card"><div className="k">Users</div><div className="v">{users.length}</div><div className="d">total registered</div></div>
        <div className="card"><div className="k">Premium</div><div className="v">{premium}</div><div className="d">{users.length ? Math.round((premium / users.length) * 100) : 0}% of users</div></div>
        <div className="card"><div className="k">New this week</div><div className="v">{newWeek}</div></div>
        <div className="card"><div className="k">Active today</div><div className="v">{activeDay}</div><div className="d">seen in last 24h</div></div>
      </div>
      <div className="panel">
        <form className="row" method="get" action="/admin/kp-desk">
          <input type="search" name="q" placeholder="Search email or name…" defaultValue={q} />
          <button className="go" type="submit">Search</button>
        </form>
      </div>
      <div className="panel">
        <table>
          <thead>
            <tr><th>Email</th><th>Name</th><th>Provider</th><th>Plan</th><th>Joined</th><th>Last seen</th><th>Events 30d</th></tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={7} className="muted">{q ? "No users match." : "No users yet — the first sign-in in the app will appear here."}</td></tr>
            ) : users.map((u) => (
              <tr key={u.id}>
                <td><a href={`/admin/kp-desk/user/${u.id}`}>{u.email}</a></td>
                <td>{u.name || <span className="muted">—</span>}</td>
                <td>{u.provider || <span className="muted">—</span>}</td>
                <td>{u.premium
                  ? <span className="badge prem">◆ Premium{u.premium_source ? ` · ${u.premium_source}` : ""}</span>
                  : <span className="badge free">Free</span>}</td>
                <td>{fmtD(u.created_at)}</td>
                <td>{ago(u.last_seen)}</td>
                <td>{evByUid.get(u.id) || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
