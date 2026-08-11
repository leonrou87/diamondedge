import { NextResponse } from "next/server";
import { readUid, supa, touchUser, dataConfigured } from "../_lib/de";

/* ════════════════════════════════════════════════════════════════════════════
   /api/support — the consumer half of the support thread.

   Identity is the signed HttpOnly uid cookie (set by /api/register at
   sign-in). No cookie ⇒ polite empty answers, never an error the UI has to
   handle — signed-out readers simply have no thread.

   EGRESS DISCIPLINE: the app calls GET ?count=1 ONCE at boot (a ~20-byte
   body) to decide whether to show the unread dot, and polls the full thread
   ONLY while the support screen is actually open, every 60s. This route
   keeps both cheap.

   GET            → {ok, msgs:[{id,dir,body,at}]}; marks admin msgs read.
   GET ?count=1   → {n} unread admin replies (tiny).
   POST {body}    → append a user message. NOT real-time by design — the UI
                    says so — so there is no push channel to maintain.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const countOnly = url.searchParams.get("count") === "1";
  const uid = await readUid();
  if (!uid || !dataConfigured()) {
    return NextResponse.json(countOnly ? { n: 0 } : { ok: true, msgs: [] }, { headers: noStore });
  }
  const u = encodeURIComponent(uid);
  if (countOnly) {
    const r = await supa(
      `de_support_messages?uid=eq.${u}&direction=eq.admin&read_by_user=is.false&select=id`,
      { prefer: "count=exact", range: "0-0" },
    );
    // PostgREST puts the total in Content-Range; we asked for ≤1 row, so fall
    // back to counting what came if the header path ever changes shape.
    const n = r.ok && Array.isArray(r.json) ? (r.json.length ? 1 : 0) : 0;
    // Cheap exactness: if there is at least one, get the true count via rows.
    if (n === 1) {
      const all = await supa(
        `de_support_messages?uid=eq.${u}&direction=eq.admin&read_by_user=is.false&select=id`,
        { range: "0-99" },
      );
      return NextResponse.json({ n: all.ok && Array.isArray(all.json) ? all.json.length : 1 }, { headers: noStore });
    }
    return NextResponse.json({ n: 0 }, { headers: noStore });
  }
  const r = await supa(
    `de_support_messages?uid=eq.${u}&select=id,direction,body,created_at&order=created_at.asc`,
    { range: "0-199" },
  );
  const msgs = (r.ok && Array.isArray(r.json) ? r.json : []).map((m: any) => ({
    id: m.id, dir: m.direction, body: m.body, at: m.created_at,
  }));
  // Opening the thread IS reading it.
  await supa(`de_support_messages?uid=eq.${u}&direction=eq.admin&read_by_user=is.false`, {
    method: "PATCH", prefer: "return=minimal", body: { read_by_user: true },
  });
  return NextResponse.json({ ok: true, msgs }, { headers: noStore });
}

export async function POST(req: Request) {
  const uid = await readUid();
  if (!uid || !dataConfigured()) {
    return NextResponse.json({ ok: false, reason: "signin" }, { status: 401, headers: noStore });
  }
  let body: any = null;
  try { body = await req.json(); } catch {}
  const text = String(body?.body || "").trim().slice(0, 4000);
  if (!text) return NextResponse.json({ ok: false, reason: "empty" }, { status: 400, headers: noStore });
  const r = await supa("de_support_messages", {
    method: "POST", prefer: "return=minimal",
    body: [{ uid, direction: "user", body: text, read_by_admin: false, read_by_user: true }],
  });
  if (r.ok) await touchUser(uid);
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502, headers: noStore });
}
