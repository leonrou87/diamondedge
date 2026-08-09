/* verify_pin_contract.ts — the one invariant the whole egress design rests on.
 *
 *   run:  node scripts/verify_pin_contract.ts
 *
 * WHAT IT GUARDS. /api/snap serves a pinned URL (`?cv=…`) with
 * `Cache-Control: immutable` for a YEAR. That promise is only safe if the route
 * can prove the bytes it is about to send really are the generation the URL
 * names. Get that wrong and there is no recovery path: the wrong payload sits in
 * every CDN POP and every browser that saw it, for a year, unrevokable.
 *
 * WHY A TEST AND NOT A CODE REVIEW. The first implementation of this check was a
 * one-line regex for `"generated_utc":"…"`, and it was WRONG in production on
 * both live feeds — because these payloads are full of nested stamps. Measured
 * on 2026-08-09: pregame_picks carries 205 `generated_at` strings and the first
 * belongs to a game rather than the board; picks_unified_live's first
 * `generated_utc` hit was 09:14:20Z against a true top-level of 23:26:25Z. It
 * looked obviously correct and was obviously correct for about ten minutes of
 * reading. Only running it against the real feeds found it.
 *
 * So this asserts the property against BOTH synthetic adversarial cases and the
 * LIVE payloads, because those are the ones that caught it. A network failure
 * skips the live half with a loud note rather than passing quietly — a test that
 * silently degrades to checking nothing is worse than no test.
 */
import { topLevelStamp } from "../app/api/snap/[key]/stamp.ts";

const BASE = process.env.DIAMONDEDGE_BASE || "https://diamondedge.kytepush.com";
let failures = 0;

function check(name: string, got: string, expect: string, note = "") {
  const ok = got === expect;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(26)} ${ok ? "" : `expected ${JSON.stringify(expect)}, got ${JSON.stringify(got)}`} ${note}`);
}

/* The synthetic cases, each one a way the naive implementations broke. */
check("nested stamp is ignored",
  topLevelStamp(JSON.stringify({ games: [{ generated_utc: "NESTED" }], generated_utc: "TOP" })), "TOP");
check("escapes do not desync",
  topLevelStamp(JSON.stringify({ games: [{ note: 'a "quoted" \\ thing', generated_at: "NESTED" }], generated_at: "TOP" })), "TOP");
check("stamp name as a VALUE",
  topLevelStamp(JSON.stringify({ label: "generated_utc", generated_at: "REAL" })), "REAL");
check("utc preferred over at",
  topLevelStamp(JSON.stringify({ generated_at: "AT", generated_utc: "UTC" })), "UTC");
check("absent means unknown",
  topLevelStamp(JSON.stringify({ a: 1 })), "");
check("deeply nested only",
  topLevelStamp(JSON.stringify({ g: [[{ generated_utc: "DEEP" }]] })), "");

/* The live half. These are the payloads that falsified the first attempt, so
   they are the ones worth checking against reality rather than a fixture. */
const LIVE = ["pregame_picks", "picks_unified_live"];
for (const key of LIVE) {
  try {
    const r = await fetch(`${BASE}/api/snap/${key}`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    const truth = JSON.parse(text);
    const expect = truth.generated_utc || truth.generated_at || "";
    check(`live: ${key}`, topLevelStamp(text), expect,
      `(${(text.length / 1048576).toFixed(2)} MB)`);
  } catch (e) {
    failures++;
    console.log(`FAIL  live: ${key.padEnd(20)} could not be checked: ${e}`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall pass");
process.exit(failures ? 1 : 0);
