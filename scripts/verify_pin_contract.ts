/* verify_pin_contract.ts — the one invariant the whole egress design rests on.
 *
 *   run:  node scripts/verify_pin_contract.ts
 *         node scripts/verify_pin_contract.ts --unit-only     (no network)
 *
 * WHAT IT GUARDS. /api/snap serves a pinned URL (`?cv=…`) with
 * `Cache-Control: immutable` for a YEAR. That promise is only safe if the route
 * can prove the bytes it is about to send really are the generation the URL
 * names. Get it wrong and there is no recovery path: the wrong payload sits in
 * every CDN POP and every browser that saw it, for a year, unrevokable.
 *
 * WHY A TEST AND NOT A CODE REVIEW. The first implementation of this check was a
 * one-line regex for `"generated_utc":"…"`, and it was WRONG in production on
 * both live feeds — because these payloads are full of nested stamps. Measured
 * on 2026-08-09: pregame_picks carries 205 `generated_at` strings and the first
 * belongs to a game rather than the board. It looked obviously correct and was
 * obviously correct for about ten minutes of reading. Only running it against
 * the real feeds found it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AND WHY IT GOT REWRITTEN (2026-08-10). The old version tested the PARSER
 * AGAINST ITSELF. It fetched the UNPINNED url, ran topLevelStamp over the body,
 * and compared that to JSON.parse of the same body. It never once requested a
 * `?cv=` URL. So it could not see — and did not see — the defect that was live
 * in production while it passed:
 *
 *     teams_v4?cv=…T00:37:13Z            served 2026-08-09T23:57:47   39m26s stale
 *     pitchers_v4?cv=…T00:37:17Z         served 2026-08-09T23:57:54   39m23s stale
 *     pregame_picks_index?cv=…T00:37:08  served 00:04:39              32m29s stale
 *
 * all `x-vercel-cache: HIT`, because the pin-MISMATCH branch was returning
 * publicly-cacheable headers under the version-named URL. It also covered only
 * 3 keys, none of the 4 that broke.
 *
 * So the live half now asserts the END-TO-END property, on every key the
 * manifest carries:
 *
 *     the URL names version V  =>  the bytes served carry version V
 *                              AND the response says x-snap-pin: hit
 *                              AND it is HTTP 200
 *
 * That is the property. One run would have printed all four failures.
 * A network failure fails the run rather than skipping quietly — a test that
 * silently degrades to checking nothing is worse than no test.
 */
import { topLevelStamp } from "../app/api/snap/[key]/stamp.ts";

const BASE = process.env.DIAMONDEDGE_BASE || "https://diamondedge.kytepush.com";
const UNIT_ONLY = process.argv.includes("--unit-only");
let failures = 0;

function check(name: string, got: unknown, expect: unknown, note = "") {
  const ok = got === expect;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(34)} ${ok ? "" : `expected ${JSON.stringify(expect)}, got ${JSON.stringify(got)}`} ${note}`);
}

/* ── the synthetic cases, each one a way the naive implementations broke ── */
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
/* The live feeds carry no generated_* at all — only their own `updated_at`.
   That field is what makes them pinnable, so the precedence has to be pinned
   down here too: it must be USED when it is the only stamp, and must LOSE to a
   generated_* when both exist, because that is the order /api/manifest reads. */
check("payload updated_at used",
  topLevelStamp(JSON.stringify({ kind: "live_scores", updated_at: "U" })), "U");
check("generated beats updated",
  topLevelStamp(JSON.stringify({ updated_at: "U", generated_utc: "G" })), "G");

if (UNIT_ONLY) {
  console.log(failures ? `\n${failures} FAILURE(S)` : "\nall pass (unit only)");
  process.exit(failures ? 1 : 0);
}

/* ── the live half: the end-to-end property, on every key ── */
type Row = {
  key: string; want: string; got: string; status: number;
  pin: string; cdn: string; age: string; cc: string; bytes: number;
};

async function head(url: string) {
  const r = await fetch(url, { headers: { "Accept-Encoding": "br, gzip" } });
  const text = await r.text();
  let served = "";
  try {
    const j = JSON.parse(text);
    if (j && typeof j === "object" && !Array.isArray(j)) {
      served = String(j.generated_utc || j.generated_at || j.updated_at || "");
    }
  } catch { served = "<unparseable>"; }
  return { r, text, served };
}

let mf: any;
try {
  const r = await fetch(`${BASE}/api/manifest`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  mf = await r.json();
} catch (e) {
  console.log(`FAIL  manifest could not be read: ${e}`);
  console.log("\n1 FAILURE(S)");
  process.exit(1);
}

const keys = Object.keys(mf.v || {}).sort();
if (!keys.length) { failures++; console.log("FAIL  manifest carried no versions"); }

const rows: Row[] = [];
for (const key of keys) {
  const want = String(mf.v[key]);
  const url = `${BASE}/api/snap/${encodeURIComponent(key)}?cv=${encodeURIComponent(want)}`;
  try {
    const { r, text, served } = await head(url);
    rows.push({
      key, want, got: served, status: r.status,
      pin: r.headers.get("x-snap-pin") || "",
      cdn: r.headers.get("x-vercel-cache") || "",
      age: r.headers.get("age") || "",
      cc: r.headers.get("cache-control") || "",
      bytes: text.length,
    });
  } catch (e) {
    rows.push({ key, want, got: `<${e}>`, status: 0, pin: "", cdn: "", age: "", cc: "", bytes: 0 });
  }
}

console.log(`\n${"key".padEnd(22)} ${"st".padStart(3)} ${"pin".padEnd(11)} ${"cdn".padEnd(8)} ${"bytes".padStart(9)}  verdict`);
for (const r of rows) {
  const problems: string[] = [];
  if (r.status !== 200) problems.push(`HTTP ${r.status}`);
  if (r.got !== r.want) problems.push(`SERVED ${r.got || "<none>"} but URL NAMES ${r.want}`);
  if (r.pin !== "hit") problems.push(`x-snap-pin=${r.pin || "<absent>"}`);
  if (problems.length) failures++;
  console.log(
    `${r.key.padEnd(22)} ${String(r.status).padStart(3)} ${(r.pin || "-").padEnd(11)} ` +
    `${(r.cdn || "-").padEnd(8)} ${String(r.bytes).padStart(9)}  ` +
    (problems.length ? `FAIL  ${problems.join("; ")}` : "ok"),
  );
}

/* ── AND THE MISMATCH BRANCH MUST NOT BE CACHEABLE ──
   This is the specific defect that turned a seconds-long race into a 39-minute
   stale board: a response meaning "I could NOT prove these bytes are the version
   you asked for" was returned with `s-maxage=900, stale-while-revalidate=21600`
   under the version-named URL, so the CDN pinned it and the client — still being
   told the same `cv` by the manifest — kept asking for the poisoned copy. It has
   to be no-store, and nothing but a test will keep it that way. */
if (keys.length) {
  const probe = keys.includes("pregame_picks") ? "pregame_picks" : keys[0];
  const bogus = `${BASE}/api/snap/${probe}?cv=NOT-A-REAL-VERSION-${Date.now()}`;
  try {
    const r = await fetch(bogus);
    const cc = (r.headers.get("cache-control") || "").toLowerCase();
    const cdn = (r.headers.get("cdn-cache-control") || "").toLowerCase();
    const pin = r.headers.get("x-snap-pin") || "";
    check(`mismatch pin is reported`, pin === "stale" || pin === "unverified", true, `(got ${pin || "<absent>"})`);
    check(`mismatch is not browser-cacheable`, cc.includes("no-store"), true, `(${cc})`);
    check(`mismatch is not CDN-cacheable`, cdn.includes("no-store"), true, `(${cdn})`);
  } catch (e) {
    failures++;
    console.log(`FAIL  mismatch branch could not be probed: ${e}`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall pass");
process.exit(failures ? 1 : 0);
