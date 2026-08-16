#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════════════
   THE INVENTORY MUST NOT LIE — run: node scripts/ad_inventory_check.mjs

   The ad system has three files that have to agree, and nothing else checks
   that they do:

     app/ads.ts                     the inventory: every slot, its cost, its cap
     app/page.tsx                   the call sites that actually render them
     app/admin/kp-desk/revenue      the console that prices them

   The console now imports the inventory, so those two cannot drift. The call
   sites can. Two failures matter, and both are silent:

     ORPHAN SLOT     listed in the inventory, rendered nowhere. The console
                     shows the owner a surface he can sell and cannot ship —
                     including a held-back one, whose whole promise is that
                     `enabled: true` turns it on with no code change.
     UNLISTED SLOT   rendered by page.tsx, absent from the inventory. It has
                     no cap, no stated reader-cost, and its rows land in the
                     console's "not in the inventory" row.

   Also asserts the two rules that are supposed to be structural rather than
   remembered: no third-party ad script is configured by default, and no
   partner ships with a live URL unless someone deliberately pasted one.
   ════════════════════════════════════════════════════════════════════════════ */
import { readFileSync } from "node:fs";

const ads = readFileSync(new URL("../app/ads.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

// slot ids: the quoted keys of AD_SLOTS
const listed = [...ads.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]);
// call sites: adSlot("<id>", ...)
const called = [...page.matchAll(/adSlot\(\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

const fail = [];
const uniq = (a) => [...new Set(a)];

for (const id of listed) if (!called.includes(id)) fail.push(`ORPHAN: "${id}" is in the inventory but has no adSlot() call site`);
for (const id of uniq(called)) if (!listed.includes(id)) fail.push(`UNLISTED: adSlot("${id}") is rendered but is not in AD_SLOTS`);

if (!/export const AD_NETWORK[^=]*=\s*null\s*;/.test(ads))
  fail.push("AD_NETWORK is not null — a third-party ad script is configured. Intentional? If so, delete this check with the reason.");
const liveUrls = [...ads.matchAll(/url:\s*"([^"]*)"/g)].map((m) => m[1]).filter((u) => u && u !== "#");
if (liveUrls.length) console.log(`note: ${liveUrls.length} partner URL(s) are live — revenue is switched on.`);

console.log(`inventory: ${listed.length} slots · call sites: ${uniq(called).length}`);
if (fail.length) { for (const f of fail) console.error("FAIL " + f); process.exit(1); }
console.log("ALL PASS — every slot is wired and every wired slot is listed.");
