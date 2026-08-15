import type { MetadataRoute } from "next";

/* ═══════════════════ SITEMAP ═══════════════════
   TWO ENTRIES, and the second one is the point.

   DiamondEdge is a single-page app: News, Desk, Games, Research and Account are tabs inside
   one document, not routes, so there is no second URL to list for any of them. The per-game
   share links at /g/<id> are excluded for the same reason robots.ts disallows them — fifteen a
   day, stale within hours, and a sitemap full of dead game pages is worse for the board's own
   ranking than no sitemap at all. A sitemap that lists URLs which do not exist, or which 404
   next week, is a negative signal. This file said so, and added: "when a genuine second route
   appears it belongs here."

   IT APPEARED (2026-08-14). /record is a server-rendered page, not a tab — the whole graded
   ledger in the markup, no JavaScript required to read a single figure on it. It is listed for
   two reasons the front door cannot cover:

     · / is a client-rendered SPA. Measured on production the same day: its server-delivered
       HTML carries 53 characters of body text. Whatever ranks it, it is not its content.
     · /record is the only page on this site whose content is STABLE. The board changes hourly
       (hence `hourly` below); the record grows by one row a night and never rewrites the rows
       behind it, which is `daily`, and which is also the whole claim the product makes.

   priority .9 rather than 1: the front door is still the front door.

   `lastModified` is the build time rather than `new Date()` evaluated per request: this route
   is statically generated, so a request-time clock would be baked in once anyway and would
   only look fresher than it is. */

const ORIGIN = "https://diamondedge.kytepush.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: ORIGIN,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${ORIGIN}/record`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
