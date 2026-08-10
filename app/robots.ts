import type { MetadataRoute } from "next";

/* ═══════════════════ ROBOTS ═══════════════════
   /robots.txt was a 404 — and a 404 here is not "no rules", it is a 14.7 KB HTML error page
   served to every crawler that asks, on a product about to go public.

   WHAT IS DISALLOWED, AND WHY IT IS SHORT. Only the two things that are not pages:
     · /api/*  — the snapshot proxy. Crawling it is pure origin cost against a Supabase egress
                 budget that is already the binding constraint, and there is nothing in it a
                 search result could usefully show.
     · /g/*    — per-game share links. They are real, they render, and they are deliberately
                 excluded: there are ~15 a day, they go stale within hours, and letting a
                 crawler index thousands of them buries the board under dead game pages. They
                 stay fully shareable — this asks a crawler not to catalogue them, which is a
                 different thing from hiding them.
   Everything else is the single-page app at /, which is what should rank.

   The sitemap is named absolutely because that is what the format requires; `metadataBase` in
   app/layout.tsx is the same origin and is the one place to change it. */

const ORIGIN = "https://diamondedge.kytepush.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/g/"],
    },
    sitemap: `${ORIGIN}/sitemap.xml`,
    host: ORIGIN,
  };
}
