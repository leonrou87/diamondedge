import { NextResponse } from "next/server";
import { readUid, setUidCookie, supa, touchUser, upsertUser, dataConfigured } from "../_lib/de";

/* ════════════════════════════════════════════════════════════════════════════
   POST /api/register — the moment a sign-in becomes a SERVER-SIDE user.

   The client's mock sign-in still writes its localStorage record exactly as
   before; this route is the fire-and-forget mirror that gives the owner a
   user list for the first time. Upserts de_users by email, sets the signed
   HttpOnly uid cookie, logs one 'signup' event on first sight.

   GRACEFUL BY CONTRACT: no service key, no Supabase, malformed body — the
   response is still 200 {ok:false} and the app carries on exactly as it did
   before this route existed. Sign-in must never break because analytics is
   down. POST {signout:true} just bumps last_seen.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "private, no-store" };

export async function POST(req: Request) {
  let body: any = null;
  try { body = await req.json(); } catch {}
  if (!dataConfigured() || !body) {
    return NextResponse.json({ ok: false }, { headers: noStore });
  }

  // ── sign-out ping: last_seen only ──
  if (body.signout === true) {
    const uid = await readUid();
    if (uid) await touchUser(uid);
    return NextResponse.json({ ok: true }, { headers: noStore });
  }

  const row = await upsertUser({
    email: body.email, name: body.name, provider: body.provider,
  });
  if (!row || !row.id) return NextResponse.json({ ok: false }, { headers: noStore });

  const isNew =
    row.created_at && Date.now() - new Date(row.created_at).getTime() < 60 * 1000;
  if (isNew) {
    await supa("de_events", {
      method: "POST", prefer: "return=minimal",
      body: [{ uid: row.id, sid: String(body.sid || "").slice(0, 40) || null, type: "signup", meta: String(body.provider || "").slice(0, 24) }],
    });
  }
  await setUidCookie(row.id);
  /* The response carries the unread support-reply count, so "check for replies on app
     open" costs ZERO extra requests — the register call the app already makes is the
     check. Tiny by construction: {"ok":true,"n":0} is 20 bytes. */
  let n = 0;
  const un = await supa(
    `de_support_messages?uid=eq.${encodeURIComponent(row.id)}&direction=eq.admin&read_by_user=is.false&select=id`,
    { range: "0-98" },
  );
  if (un.ok && Array.isArray(un.json)) n = un.json.length;
  return NextResponse.json({ ok: true, n }, { headers: noStore });
}
