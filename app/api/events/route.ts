import { NextResponse } from "next/server";
import { readUid, supa, touchUser, dataConfigured } from "../_lib/de";

/* ════════════════════════════════════════════════════════════════════════════
   POST /api/events — the first-party analytics beacon, egress-frugal.

   THE CONTRACT WITH THE CLIENT (this platform fought an egress crisis, so it
   is written down): the app sends AT MOST two of these per session — one at
   session start, one at tab-hide via sendBeacon with everything batched.
   Never per-click streaming. The body is tiny:
       {sid, ev:[{t:"tab", m:"games", ts:169...}, ...]}

   sendBeacon posts text/plain, so this parses req.text() → JSON. Caps
   everywhere: ≤64KB body, ≤60 events, short strings. Anything malformed is
   dropped silently — a beacon endpoint that errors loudly is an endpoint
   that gets retried, and retries are egress.

   NO THIRD PARTY. These rows land in de_events (RLS-deny to anon) and are
   read only by the owner's console at /admin/kp-desk.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const TYPES = new Set(["session", "tab", "game", "unlock", "upgrade", "signout"]);

export async function POST(req: Request) {
  const done = () => new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  if (!dataConfigured()) return done();
  let body: any = null;
  try {
    const raw = await req.text();
    if (!raw || raw.length > 65536) return done();
    body = JSON.parse(raw);
  } catch { return done(); }
  const evs = Array.isArray(body?.ev) ? body.ev.slice(0, 60) : [];
  if (!evs.length) return done();
  const sid = String(body.sid || "").slice(0, 40) || null;
  const uid = await readUid();
  const rows = evs
    .map((e: any) => ({
      uid,
      sid,
      type: String(e?.t || "").slice(0, 24),
      meta: e?.m != null ? String(e.m).slice(0, 80) : null,
      /* Client timestamps are advisory; created_at is server truth. The batch
         arrives at tab-hide, so rows are at most one session late — fine for
         a daily console. */
    }))
    .filter((r: any) => TYPES.has(r.type));
  if (rows.length) {
    await supa("de_events", { method: "POST", prefer: "return=minimal", body: rows });
    if (uid) await touchUser(uid); // activity IS presence — last_seen rides the beacon
  }
  return done();
}
