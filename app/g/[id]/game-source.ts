/* ════════════════════════════════════════════════════════════════════════════
   ONE GAME, FETCHED AS ONE GAME.

   WHY THIS FILE EXISTS (2026-08-14, the free-tier egress emergency).

   /g/<id> has two server-rendered surfaces — `generateMetadata` in page.tsx and
   the share card in opengraph-image.tsx — and each carried its own copy of this
   function. Both did the same thing:

       fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.pregame_picks&select=payload`,
             { next: { revalidate: 300 } })
       …then .games.find(g => g.game_id === id)

   That is the ORIGINAL BUG of this codebase, still living in the one corner the
   /api/snap redesign never swept: a DIRECT Supabase read, on a TIME-BASED TTL,
   of a payload measured today at 286,840 bytes gzipped (1,061,847 raw) — pulled
   in full to read ONE game out of 335. Nothing about it scaled with how often
   the data changed; 86400/300 is 288 potential origin reads a day whether the
   board moved once or never, and it sat entirely outside the version-pinned,
   publish-invalidated cache every other reader goes through.

   /api/snap has had the right shape for this all along. `?game=<id>` returns
   that one game, whole, out of the SAME cached unit every other reader shares —
   so the marginal Supabase cost of a share card is zero in the common case, and
   the unit itself is re-read on PUBLISH rather than on a clock.

   MEASURED, both shapes, on the live board today:
       full payload via Supabase   286,840 B   (and one origin read per TTL lapse)
       ?game=<id> via /api/snap      3,608 B   (and no origin read at all when warm)
   79x smaller, and it carries every field these two surfaces read:
   away_team/away_abbr, home_team/home_abbr, sport, status, start_time, and
   de_plays (which is what hasPick() inspects for the share card).

   THE TTL THAT REMAINS IS ON THE RIGHT OBJECT. `revalidate: 300` below caches a
   3.6 KB response from OUR edge, not a 287 KB row from Supabase. That is the
   whole trade this file exists to make: keep the cheap clock, move it off the
   metered thing.

   A MISS IS `null`, NOT AN ERROR — verified against the live route: an id the
   board does not carry answers HTTP 200 with the four bytes `null`, which is
   exactly what `.find()` returned before. Both callers already treat null as
   "render the generic title/card", so an unknown game, a cold route and a snap
   outage all degrade the same graceful way they did before.

   NO SUPABASE FALLBACK, DELIBERATELY. The obvious "if snap fails, read the row
   direct" would put the 287 KB TTL read back on exactly the days the system is
   already unwell — a fallback that fires hardest when the account can least
   afford it. These two surfaces are a <title> and a share image: degrading them
   to the generic copy costs a nicer link preview, never a pick, never the board.
   ════════════════════════════════════════════════════════════════════════════ */

/* Absolute because a server-side fetch has no page to be relative to. Same
   constant as robots.ts, sitemap.ts and layout.tsx's metadataBase. */
const ORIGIN = "https://diamondedge.kytepush.com";

export async function getGame(id: string) {
  try {
    const r = await fetch(
      `${ORIGIN}/api/snap/pregame_picks?game=${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } },
    );
    if (!r.ok) return null;
    return (await r.json()) || null;
  } catch {
    return null;
  }
}
