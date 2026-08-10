/* verify_lite_projection.ts — prove the `?lite=1` projection did not change
 * meaning when it moved out of Postgres.
 *
 *   run:  node scripts/verify_lite_projection.ts [key ...]
 *
 * WHY THIS EXISTS. On 2026-08-10 the projection moved from
 * `public.slate_snapshot_lite` (a Postgres function) into app/api/snap/[key]/lite.ts,
 * because the SQL version had become unpayable: ~3.9 s over PostgREST against
 * `anon`'s 3 s statement_timeout, so the board's own boot read returned HTTP 502
 * on 9 of 10 cold requests (error 57014). The JS version takes 8.1 ms.
 *
 * A projection that moves layers and quietly changes meaning is invisible. The
 * board still renders. Every rail stays green. Some per-game field the Desk
 * reads simply stops arriving, and the cause is a rewritten window function two
 * repositories away. So this compares the two implementations on the real
 * payloads rather than trusting that they agree.
 *
 * WHAT IT COMPARES. For every game, in order, the SET OF TOP-LEVEL KEYS that
 * survived — which is the entire semantic content of the projection. Byte
 * comparison would be useless: Postgres jsonb sorts object keys by length then
 * bytes, JS preserves insertion order, so identical documents have different
 * text. Key sets are order-independent and are exactly what the client reads.
 *
 * It also asserts the two properties the projection is FOR:
 *   * it must never make the payload bigger (measured through the old RPC,
 *     pregame_picks came back 1,160,537 B lite against 1,090,085 B raw — the
 *     board's biggest key was paying for a saving it was not getting)
 *   * `_lite: true` must survive, because page.tsx:15880 reads it.
 *
 * CREDENTIALS. Reads ~/.kytepush-platform.env, like scripts/revalidate_edge.sh.
 * The SQL side runs through the Supabase Management API because the projection
 * it is checking cannot finish inside the anon role's statement timeout — which
 * is the whole reason it moved. Never prints a secret.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import { deriveLite } from "../app/api/snap/[key]/lite.ts";

const KEYS = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const DEFAULT_KEYS = ["picks_unified", "picks_unified_live", "pregame_picks", "picks_v4_beta"];
const TARGETS = KEYS.length ? KEYS : DEFAULT_KEYS;

function env(): Record<string, string> {
  const out: Record<string, string> = {};
  const txt = readFileSync(join(homedir(), ".kytepush-platform.env"), "utf8");
  for (const line of txt.split("\n")) {
    const s = line.trim();
    if (!s || s.startsWith("#") || !s.includes("=")) continue;
    const i = s.indexOf("=");
    out[s.slice(0, i).trim()] = s.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}
const E = env();

/* The SQL side, through the Management API so the statement timeout that broke
   the function in the first place does not also break the test of it. */
async function sqlDigest(key: string) {
  const q = `
    set local statement_timeout='180s';
    with l as (select public.slate_snapshot_lite($$${key}$$) as p)
    select md5(string_agg(sig, '|' order by ord)) as digest,
           count(*) as n_games,
           (select count(*) from jsonb_array_elements((select p from l)->'games') g
             where g ? 'analysts') as with_analysts,
           (select ((select p from l) ? '_lite')::text) as has_lite
    from (
      select t.ord, (select string_agg(k, ',' order by k) from jsonb_object_keys(t.g) k) as sig
      from l, jsonb_array_elements(l.p->'games') with ordinality t(g, ord)
    ) x;`;
  const r = await fetch(`https://api.supabase.com/v1/projects/${E.SUPABASE_PROJECT_REF}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${E.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      // Cloudflare fronts this API and rejects a default UA with error 1010.
      "User-Agent": "diamondedge-verify-lite/1.0",
    },
    body: JSON.stringify({ query: q }),
  });
  if (!r.ok) throw new Error(`management api ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return (await r.json())[0];
}

async function payloadOf(key: string): Promise<string> {
  const r = await fetch(
    `${E.SUPABASE_PROJECT_URL}/rest/v1/slate_snapshots?key=eq.${encodeURIComponent(key)}&select=payload`,
    { headers: { apikey: E.SUPABASE_ANON_KEY, Authorization: `Bearer ${E.SUPABASE_ANON_KEY}` } },
  );
  if (!r.ok) throw new Error(`payload ${key}: HTTP ${r.status}`);
  const rows = await r.json();
  return JSON.stringify(rows?.[0]?.payload ?? null);
}

let failures = 0;
function check(name: string, ok: boolean, note = "") {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(46)} ${note}`);
}

for (const key of TARGETS) {
  console.log(`\n── ${key} ──`);
  let full: string;
  try {
    full = await payloadOf(key);
  } catch (e) {
    failures++; console.log(`FAIL  could not read payload: ${e}`); continue;
  }
  const liteText = deriveLite(full);
  const lite = JSON.parse(liteText);

  const projected = liteText !== full;
  check("lite is never larger than full", liteText.length <= full.length,
    `(${full.length} -> ${liteText.length}${projected ? "" : "  no-op: full returned verbatim"})`);
  /* `_lite` is the marker page.tsx:15880 reads to decide whether a later full
     load still has work to do. It must be present exactly when the projection
     actually removed something — present on a no-op would be a lie, absent on a
     real projection would cost a redundant full fetch. */
  check("_lite marker tracks whether work was done", lite._lite === true === projected,
    `(projected=${projected}, _lite=${lite._lite === true})`);

  if (!Array.isArray(lite.games)) {
    console.log(`SKIP  no games[] — nothing to compare against SQL`);
    continue;
  }
  const sigs = lite.games.map((g: any) => Object.keys(g).sort().join(","));
  const jsDigest = createHash("md5").update(sigs.join("|")).digest("hex");
  const jsAnalysts = lite.games.filter((g: any) => "analysts" in g).length;

  try {
    const s = await sqlDigest(key);
    check("per-game key sets match SQL exactly", s.digest === jsDigest,
      `(js ${jsDigest.slice(0, 12)} / sql ${String(s.digest).slice(0, 12)})`);
    check("game count matches SQL", Number(s.n_games) === lite.games.length,
      `(js ${lite.games.length} / sql ${s.n_games})`);
    check("analysts-retained count matches SQL", Number(s.with_analysts) === jsAnalysts,
      `(js ${jsAnalysts} / sql ${s.with_analysts})`);
  } catch (e) {
    /* NOT a skip. The SQL function timing out is the defect this change was made
       for, and a test that goes quiet exactly when the thing it checks is broken
       is worse than no test. It is reported as a failure with the reason, and
       the JS-side digest is printed so a human can compare it by hand. */
    failures++;
    console.log(`FAIL  SQL side unavailable: ${e}`);
    console.log(`      js digest ${jsDigest}  games ${lite.games.length}  analysts ${jsAnalysts}`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nall pass");
process.exit(failures ? 1 : 0);
