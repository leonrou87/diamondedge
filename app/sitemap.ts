import type { MetadataRoute } from "next";

/* ═══════════════════ SITEMAP ═══════════════════
   Deliberately ONE ENTRY, and that is not laziness.

   DiamondEdge is a single-page app: News, Desk, Games, Research and Account are tabs inside
   one document, not routes, so there is no second URL to list. The only other real routes are
   the per-game share links at /g/<id>, and those are excluded here for the same reason
   robots.ts disallows them — fifteen a day, stale within hours, and a sitemap full of dead
   game pages is worse for the board's own ranking than no sitemap at all.

   A sitemap that lists URLs which do not exist, or which 404 next week, is a negative signal.
   One URL that is always right is the honest version of this file, and when a genuine second
   route appears it belongs here.

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
  ];
}
