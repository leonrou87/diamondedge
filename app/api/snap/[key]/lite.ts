/* The `?lite=1` projection, in its own module so scripts/verify_lite_projection.ts
   can exercise it directly against the Postgres function it replaced — for the
   same reason stamp.ts is its own module. This one moved layers, and a
   projection that moved layers and quietly changed meaning would be invisible:
   the board would render, every rail would be green, and some per-game field the
   Desk reads would simply have stopped arriving.

   WHY IT MOVED (2026-08-10). It used to be `public.slate_snapshot_lite`, a
   Postgres function, and the argument for that was sound when it was written:
   projecting in the Vercel function would mean Supabase shipped the whole
   payload anyway, so the egress meter would not notice. Brotli on the origin leg
   falsified it. The raw row is 476,270 B on the wire against ~250 KB projected,
   so the projection is worth ~226 KB PER PUBLISH — a few megabytes a month.

   Meanwhile its cost had become unpayable. Measured on production:
   `slate_snapshot_lite('picks_unified')` runs ~3.9 s over PostgREST, and the
   `anon` role carries `statement_timeout=3s` (verified in pg_roles). So the
   board's own boot read failed — 9 of 10 cold requests returned HTTP 502, error
   57014, "canceling statement due to statement timeout". `picks_v4_beta` timed
   out too. And a 502 from /api/snap is not a neutral failure: it demotes that
   reader to `snapDirect` for 60 seconds, i.e. to an uncached 1.2 MB read
   straight off the egress meter with the CORS preflight restored. The
   optimisation was manufacturing the exact traffic it existed to prevent.

   The same projection here, measured on the real 8,916,802-byte payload, takes
   8.1 ms — 480x faster than the query that could not finish, on a payload the
   function has already parsed for other reasons.

   THE CONTRACT IT REPRODUCES, field for field:
     * four per-game blobs always removed
     * `analysts` kept when the game is inside the rolling window OR among the N
       most recent games in the payload. The count floor is not a cache rule
       doing a correctness job by accident — it is what keeps the Desk's "recent
       calls" ledger fillable across an offseason, a break, or a sync outage,
       where a pure date window would silently empty it with no error.
     * ordering by date descending with array position as the tiebreak, so it is
       deterministic on a day where several games share a date
     * `_lite: true` at the top level. page.tsx reads it (`fresh._lite === true`,
       app/page.tsx:15880) to decide whether a later full load still has work to
       do, so it is part of the contract and not a debug marker.

   The window is UTC because Postgres's `current_date` was, on a UTC server.

   VERIFIED, not asserted: scripts/verify_lite_projection.ts computes the set of
   surviving keys for every game, in order, from this code and from the SQL
   function, and compares md5s. On 2026-08-10 both gave
   29d39f0e4935c9102f79c64775d79e54 over 527 games, 283 of them keeping
   `analysts`. */

export const LITE_STRIP = ["diamondedge", "strategies", "analysts_v2", "scout"] as const;
export const LITE_KEEP_DAYS = 21;
export const LITE_KEEP_MIN = 60;

/* A PROJECTION THAT MAKES THE PAYLOAD BIGGER IS NOT A PROJECTION, so this is
   the function's own postcondition rather than a guard some caller has to
   remember. Measured through the old RPC: pregame_picks came back 1,160,537 B
   "lite" against 1,090,085 B raw, picks_v4_beta_live 261,627 against 245,777 —
   those keys carry none of the stripped blobs, so all the projection did was
   re-serialise the document and add a marker. The board's second-biggest key was
   paying for a saving it was not getting, and nothing reported it because a
   bigger answer is still a correct answer.

   Returning the input verbatim also means `_lite` is absent on those keys, which
   is the conservative direction for the one client that reads it: page.tsx takes
   a missing `_lite` to mean "a full load still has work to do", so the failure
   mode is one extra fetch, never a missing field. */
function noWorse(fullText: string, liteText: string): string {
  return liteText.length < fullText.length ? liteText : fullText;
}

export function deriveLite(fullText: string): string {
  const p = JSON.parse(fullText);
  if (!p || typeof p !== "object") return fullText;
  const games = Array.isArray((p as any).games) ? (p as any).games : null;
  if (!games) return noWorse(fullText, JSON.stringify({ ...(p as any), _lite: true }));

  const cutoff = new Date(Date.now() - LITE_KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  /* date desc, nulls last, array position desc as the tiebreak — the same order
     `row_number() over (order by (g->>'date') desc nulls last, ord desc)` gave.
     A missing date becomes "", which sorts last in a descending compare, which
     is what `nulls last` means here. */
  const floor = new Set(
    games
      .map((g: any, i: number) => [String((g && g.date) || ""), i] as [string, number])
      .sort((a: [string, number], b: [string, number]) =>
        (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : b[1] - a[1]))
      .slice(0, LITE_KEEP_MIN)
      .map((x: [string, number]) => x[1]),
  );
  const out = games.map((g: any, i: number) => {
    const c = { ...g };
    for (const k of LITE_STRIP) delete c[k];
    if (!(String((g && g.date) || "") >= cutoff || floor.has(i))) delete c.analysts;
    return c;
  });
  return noWorse(fullText, JSON.stringify({ ...(p as any), games: out, _lite: true }));
}
