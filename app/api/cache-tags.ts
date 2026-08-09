/* The cache-tag vocabulary, in one place.

   Three routes have to agree on these strings or the whole publish-driven
   design quietly degrades into the time-driven one it replaced: /api/snap and
   /api/manifest TAG their reads with them, /api/revalidate DROPS them when a
   publisher writes. A typo would not throw — it would simply mean nothing is
   ever invalidated, the safety-net revalidates take over, and the egress bill
   creeps back to where it started with every rail still green. That is exactly
   the kind of silent regression this overhaul exists to prevent, so the strings
   live here rather than being spelled out three times.

   (They are also not imported across `route.ts` boundaries for this reason: a
   route module importing another route module drags a second handler into the
   bundle and makes the dependency graph a thing you have to reason about.) */

export const MANIFEST_TAG = "manifest";

export function snapTag(key: string): string {
  return `snap:${key}`;
}
