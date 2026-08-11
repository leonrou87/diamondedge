import { supa } from "../../api/_lib/de";

/* Shared reads for the console pages. All service-key, all server-side. */

export type DeUser = {
  id: string; email: string; name: string | null; provider: string | null;
  created_at: string; last_seen: string; premium: boolean;
  premium_since: string | null; premium_source: string | null;
};

export async function allUsers(q?: string): Promise<DeUser[]> {
  const search = q
    ? `&or=(email.ilike.*${encodeURIComponent(q.replace(/[,()]/g, ""))}*,name.ilike.*${encodeURIComponent(q.replace(/[,()]/g, ""))}*)`
    : "";
  const r = await supa(`de_users?select=*&order=created_at.desc${search}`, { range: "0-499" });
  return r.ok && Array.isArray(r.json) ? r.json : [];
}

export async function userById(id: string): Promise<DeUser | null> {
  const r = await supa(`de_users?id=eq.${encodeURIComponent(id)}&select=*`);
  return r.ok && Array.isArray(r.json) && r.json[0] ? r.json[0] : null;
}

export type DeEvent = {
  id: number; uid: string | null; sid: string | null;
  type: string; meta: string | null; created_at: string;
};

export async function recentEvents(days = 30, cap = 20000): Promise<DeEvent[]> {
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const r = await supa(
    `de_events?select=*&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc`,
    { range: `0-${cap - 1}` },
  );
  return r.ok && Array.isArray(r.json) ? r.json : [];
}

export async function eventsForUser(uid: string, cap = 200): Promise<DeEvent[]> {
  const r = await supa(
    `de_events?uid=eq.${encodeURIComponent(uid)}&select=*&order=created_at.desc`,
    { range: `0-${cap - 1}` },
  );
  return r.ok && Array.isArray(r.json) ? r.json : [];
}

export type DeMsg = {
  id: number; uid: string; direction: "user" | "admin"; body: string;
  created_at: string; read_by_admin: boolean; read_by_user: boolean;
};

export async function allSupport(cap = 1000): Promise<DeMsg[]> {
  const r = await supa(
    `de_support_messages?select=*&order=created_at.desc`,
    { range: `0-${cap - 1}` },
  );
  return r.ok && Array.isArray(r.json) ? r.json : [];
}

export async function threadFor(uid: string): Promise<DeMsg[]> {
  const r = await supa(
    `de_support_messages?uid=eq.${encodeURIComponent(uid)}&select=*&order=created_at.asc`,
    { range: "0-499" },
  );
  return r.ok && Array.isArray(r.json) ? r.json : [];
}

/** Unread user-messages count, for the nav badge. */
export async function unreadSupport(): Promise<number> {
  const r = await supa(
    `de_support_messages?direction=eq.user&read_by_admin=is.false&select=id`,
    { range: "0-98" },
  );
  return r.ok && Array.isArray(r.json) ? r.json.length : 0;
}
