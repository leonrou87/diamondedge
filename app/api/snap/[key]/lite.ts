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

/* ═══ THE BOARD WINDOW (`?board=1`) — WHAT A COLD BOOT ACTUALLY READS ═══
   2026-08-17, measured in a real browser against production: a cold load decoded
   9.15 MB, and 5.62 MB of it was `picks_unified?lite=1` — the FULL season
   history (93 dates, 621 games), fetched at boot so the briefing could show
   yesterday's recap rows, a handful of recent winners, and the record chips.
   Every surface that reads deeper history — the Desk, Research, a past date, a
   game page, an analyst card — already lazy-loads the lite shape when it opens.

   So boot gets a THIRD shape: the lite document windowed to the last
   BOARD_KEEP_DAYS days, with the per-game analysis prose stripped. Measured on
   the 2026-08-17 payload: 5,618,148 B lite -> 1,256,666 B board (4.5x), and the
   games the window keeps carry 24+ graded wins against the briefing's need for
   at most 9. All TOP-LEVEL keys survive whole — record (incl. the full daily
   map), by_date_record (93 dates, what the record archive reads), the spec and
   contract blocks — so no record surface can come up short of what the lite
   copy would have said.

   WHAT IS STRIPPED, AND WHY IT IS SAFE:
     * game-level: analysts / consensus / weather / simulator / matchup /
       pregame_line. The boot readers of history rows (yesterdayRecap,
       recentWinners, ppdCard, v4GameFor's grade merge) read none of them; the
       analyst card, which does read `analysts`, upgrades to the lite shape on
       open (app/page.tsx, openAnalystSheet).
     * pick-level: the strategy/analysis prose blobs (forge_strategy, game_case,
       adaptive_strategy, engine_strategy, owner_strategy, signals) — 1.15 MB of
       the window's own weight, read only on a game page, which hydrates from
       `?game=` / the lite shape. `confidence` and `pick_rating` are KEPT: they
       are small and pick-tile surfaces may touch them through v4GameFor.

   Derived from the LITE text (the blobs lite strips are already gone), shares
   lite's noWorse postcondition, and stamps `_board: true` so the client can
   never mistake the window for the history (`_lite` rides through from the lite
   text, and the client's board store is a separate variable that no loadBeta()
   caller can be satisfied by). One origin read still fills every shape. */
export const BOARD_KEEP_DAYS = 10;
export const BOARD_STRIP_GAME = ["analysts", "consensus", "weather", "simulator",
  "matchup", "pregame_line"] as const;
export const BOARD_STRIP_PICK = ["forge_strategy", "game_case", "adaptive_strategy",
  "engine_strategy", "owner_strategy", "signals"] as const;

export function deriveBoard(liteText: string): string {
  const p = JSON.parse(liteText);
  if (!p || typeof p !== "object") return liteText;
  const games = Array.isArray((p as any).games) ? (p as any).games : null;
  if (!games) return noWorse(liteText, JSON.stringify({ ...(p as any), _board: true }));
  // Same UTC day arithmetic as the lite cutoff above — today is always inside.
  const cutoff = new Date(Date.now() - BOARD_KEEP_DAYS * 86400000).toISOString().slice(0, 10);
  const out: any[] = [];
  for (const g of games) {
    if (!(String((g && g.date) || "") >= cutoff)) continue;
    const c = { ...g };
    for (const k of BOARD_STRIP_GAME) delete c[k];
    if (c.pick && typeof c.pick === "object" && !Array.isArray(c.pick)) {
      const pk = { ...c.pick };
      for (const k of BOARD_STRIP_PICK) delete pk[k];
      c.pick = pk;
    }
    out.push(c);
  }
  return noWorse(liteText, JSON.stringify({ ...(p as any), games: out, _board: true }));
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
