import { notFound } from "next/navigation";
import { adminState } from "../../../api/_lib/admin";
import { Shell, Login, Bars } from "../ui";
import { allUsers, recentEvents, unreadSupport } from "../data";

/* ════════════════════════════════════════════════════════════════════════════
   /admin/kp-desk/activity — the analytics read.

   Everything on this page is computed server-side from de_events rows the
   app's two-beacons-per-session posted (session start + tab-hide batch) —
   no third-party analytics, no chart library, charts are inline SVG.
   The numbers can only be as fresh as the last beacon: a session that is
   still open has not flushed its tab/game events yet. That is the accepted
   cost of the egress-frugal design.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const dayKey = (iso: string) =>
  new Date(iso).toLocaleDateString("sv-SE", { timeZone: "America/New_York" }); // YYYY-MM-DD

export default async function ActivityPage() {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  if (state === "login") return <Login />;

  const DAYS = 30;
  const [events, users, unread] = await Promise.all([
    recentEvents(DAYS), allUsers(), unreadSupport(),
  ]);
  const now = Date.now();

  // ── per-day rollups ──
  const days: string[] = [];
  for (let i = DAYS - 1; i >= 0; i--) days.push(dayKey(new Date(now - i * 864e5).toISOString()));
  const sessionsByDay = new Map<string, number>();
  const visitorsByDay = new Map<string, Set<string>>();
  const tabCounts = new Map<string, number>();
  const gameCounts = new Map<string, number>();
  const unlockSids = new Set<string>();
  const upgradeSids = new Set<string>();
  const allSids = new Set<string>();
  const sids7 = new Set<string>();
  const sids1 = new Set<string>();
  for (const e of events) {
    const d = dayKey(e.created_at);
    const who = e.uid || e.sid || "";
    if (who) {
      allSids.add(who);
      const age = now - +new Date(e.created_at);
      if (age < 7 * 864e5) sids7.add(who);
      if (age < 864e5) sids1.add(who);
      if (!visitorsByDay.has(d)) visitorsByDay.set(d, new Set());
      visitorsByDay.get(d)!.add(who);
    }
    if (e.type === "session") sessionsByDay.set(d, (sessionsByDay.get(d) || 0) + 1);
    if (e.type === "tab" && e.meta) tabCounts.set(e.meta, (tabCounts.get(e.meta) || 0) + 1);
    if (e.type === "game" && e.meta) gameCounts.set(e.meta, (gameCounts.get(e.meta) || 0) + 1);
    if (e.type === "unlock" && (e.sid || e.uid)) unlockSids.add(e.uid || e.sid || "");
    if (e.type === "upgrade" && (e.sid || e.uid)) upgradeSids.add(e.uid || e.sid || "");
  }
  const topGames = [...gameCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  const tabOrder = ["today", "games", "desk", "research", "account"];
  const tabRows = tabOrder
    .map((t) => [t, tabCounts.get(t) || 0] as [string, number])
    .concat([...tabCounts.entries()].filter(([t]) => !tabOrder.includes(t)));
  const tabTotal = tabRows.reduce((s, [, n]) => s + n, 0) || 1;

  // ── funnel (30d) ──
  const signups = users.filter((u) => now - +new Date(u.created_at) < DAYS * 864e5).length;
  const premiumNow = users.filter((u) => u.premium).length;
  const premium30 = users.filter((u) => u.premium && u.premium_since && now - +new Date(u.premium_since) < DAYS * 864e5).length;
  const funnel: [string, number, string][] = [
    ["Visitors (unique, 30d)", allSids.size, "distinct beacon sessions"],
    ["Signups (30d)", signups, "accounts created"],
    ["Saw unlock prompt", unlockSids.size, "unique visitors who hit the paywall"],
    ["Upgraded (30d)", Math.max(upgradeSids.size, premium30), "went premium"],
  ];
  const fMax = Math.max(1, ...funnel.map(([, n]) => n));

  return (
    <Shell active="activity" unread={unread}>
      <h1>Activity</h1>
      <p className="sub">Last 30 days · {events.length} events · first-party beacon only (one post at session start, one batch at tab-hide).</p>
      <div className="cards">
        <div className="card"><div className="k">DAU</div><div className="v">{sids1.size}</div><div className="d">unique visitors, 24h</div></div>
        <div className="card"><div className="k">WAU</div><div className="v">{sids7.size}</div><div className="d">unique visitors, 7d</div></div>
        <div className="card"><div className="k">Sessions 30d</div><div className="v">{[...sessionsByDay.values()].reduce((a, b) => a + b, 0)}</div></div>
        <div className="card"><div className="k">Premium members</div><div className="v">{premiumNow}</div><div className="d">{users.length ? Math.round((premiumNow / users.length) * 100) : 0}% of {users.length} users</div></div>
      </div>

      <div className="panel">
        <h2>Sessions per day</h2>
        <Bars data={days.map((d) => ({ label: d, value: sessionsByDay.get(d) || 0 }))} />
      </div>
      <div className="panel">
        <h2>Unique visitors per day</h2>
        <Bars color="#0a6cff" data={days.map((d) => ({ label: d, value: visitorsByDay.get(d)?.size || 0 }))} />
      </div>

      <div className="panel">
        <h2>Premium conversion funnel · 30d</h2>
        <table>
          <tbody>
            {funnel.map(([label, n, d]) => (
              <tr key={label}>
                <td style={{ width: 220 }}>{label}</td>
                <td style={{ width: "50%" }}>
                  <div style={{ background: "#eceef2", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${Math.max(2, Math.round((n / fMax) * 100))}%`, background: "#16181d", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{n}</div>
                  </div>
                </td>
                <td className="muted">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Tab popularity · 30d</h2>
        <table>
          <tbody>
            {tabRows.map(([t, n]) => (
              <tr key={t}>
                <td style={{ width: 120, textTransform: "capitalize" }}>{t}</td>
                <td style={{ width: "50%" }}>
                  <div style={{ background: "#eceef2", borderRadius: 6 }}>
                    <div style={{ width: `${Math.max(1, Math.round((n / tabTotal) * 100))}%`, background: "#0a6cff", height: 10, borderRadius: 6 }} />
                  </div>
                </td>
                <td>{n} <span className="muted">({Math.round((n / tabTotal) * 100)}%)</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Top games opened · 30d</h2>
        {topGames.length === 0 ? <p className="muted">No game opens recorded yet.</p> : (
          <table>
            <thead><tr><th>Game</th><th>Opens</th></tr></thead>
            <tbody>
              {topGames.map(([gid, n]) => (
                <tr key={gid}><td className="mono">{gid}</td><td>{n}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Shell>
  );
}
