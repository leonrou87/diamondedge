/* ════════════════════════════════════════════════════════════════════════════
   THE RECORD, FETCHED THE CHEAP WAY.

   Same shape as app/g/[id]/game-source.ts and for the same reason (the free-tier
   egress emergency, 2026-08-14): a server-rendered route may NOT read
   slate_snapshots straight from Supabase on a clock. It goes through /api/snap,
   which is edge-cached and re-read on PUBLISH rather than on a TTL, so the
   marginal Supabase cost of this page in the common case is zero.

   `?lite=1` because this page reads nothing out of `games` — measured on the
   live board today, lite is 530,614 B against the full 535,193 B, and it carries
   `record` whole (33 daily rows, headline n=195). The saving is small on the
   LIVE key; asking for lite anyway means this route shares the cache unit the
   board already warms instead of pinning a second one.

   `revalidate: 1800` — the record moves when a night finishes grading, i.e. a
   few times a day. 48 potential edge reads a day is the right clock for a page
   whose newest fact is yesterday's.

   A FAILURE IS `null`, AND null RENDERS AS "we could not load it". It must never
   render as zeros: this page's entire value is that its numbers are true, and a
   record page that shows 0-0-0 during a snap outage is worse than one that says
   nothing. See page.tsx's `!rec` branch.
   ════════════════════════════════════════════════════════════════════════════ */

/* Absolute because a server-side fetch has no page to be relative to. Same
   constant as robots.ts, sitemap.ts, game-source.ts and layout's metadataBase. */
const ORIGIN = "https://diamondedge.kytepush.com";

/* ── THE STORY-SAFE SET, AND NOTHING ELSE ──────────────────────────────────
   The served payload carries its own copy policy (`record.copy_policy`,
   policy_id adaptive_desk_display_v1, effective 2026-08-02). It names the blocks
   that product copy may read:

     story_safe   record.headline, record.daily, record.streaks, record.by_month,
                  games[].pick, games[].analysts[].take, games[].matchup,
                  games[].final, games[].diamondedge.rationale_line
     research_only record.patterns, record.analyst_profiles, record.desk_calls,
                  record.by_strategy, record.consensus_history, record.farm,
                  record.coverage, record.spread_stream, record.sim_stream,
                  record.scout_stream, record.expanded_band, record.insights,
                  record.diagnostics, desk_fit, record.by_confidence

   and states flatly: "record.headline is the only product record."

   This page is product copy on the most public surface the site has, so the type
   below deliberately describes ONLY the story-safe blocks. Two things are
   therefore absent on purpose:

     · record.by_star_tier — in NEITHER list, which is not permission. Its buckets
       sum to n=73 against the headline's 195 (they cover only the star-graded
       subset) and the payload's own note says they re-bucket ALL history under
       the CURRENT v3.3 display bands. A public page cannot show a 73-row
       by-tier table under a 195-pick headline without either restating the
       record or inviting the reader to.
     · record.by_date_record — the legacy twin. It disagrees with record.daily on
       7 of the last 8 days (Aug 10 reads 2-5 −3.03u in daily and 4-0 +3.99u in
       the legacy block) and it reads BETTER. One number, one source: this file
       cannot see it, so no future edit to page.tsx can reach it by accident.
   ─────────────────────────────────────────────────────────────────────────── */

export type MonthRow = {
  n?: number; win?: number; loss?: number; push?: number;
  month?: string; units?: number; roi?: number | null;
  record?: string; hit_rate?: number | null;
};

/* ── THE PROVENANCE STAMPS ──────────────────────────────────────────────────
   `basis` and `walk_forward` are fields OF record.daily, which the copy policy
   marks story_safe — so reading them here widens nothing. They were simply never
   carried, and the page that exists to prove the record was therefore blind to
   the one fact a sceptic asks first: WAS THE RULE FIXED BEFORE THE GAMES?

   Measured on the live payload, 2026-08-14: of the 195 graded picks in the
   headline, 145 sit on nights stamped `process_replay` and 50 on nights stamped
   `served_locked`. The replayed nights are +4.34u; the locked nights are −2.21u.
   Every unit of profit in the public figure is in the replayed half, and no
   surface on the site said so.

   WHAT EACH VALUE MEANS (v4/serve/unified_model.py, the PROCESS REPLAY block):

     served_locked   the night's strategy was stamped into the append-only
                     as-served ledger BEFORE that day's first pitch. The strong
                     guarantee: the call demonstrably came first.
     process_replay  the nightly process was RE-RUN for that night, selecting
                     from a window ending strictly before it, with that fence
                     asserted per night rather than assumed. No look-ahead
                     inside any night — but the selector doing the re-running
                     was built afterwards, so it cannot show the desk would have
                     run that rule live.
     served_archive  pre-span days from the hash-pinned archive. Not present in
                     today's payload; typed so an appearance renders rather than
                     silently falling into the replay bucket.

   `walk_forward` answers the same question off WEAKER evidence — it accepts the
   selector's own `selected_at_utc`, and that store is write-once per (date,
   VERSION), so a version bump re-derives past dates and overwrites the proof.
   The payload's own note gives the strict definition ("if and only if its
   strategy was stamped into the as-served ledger"), which is `basis`. Both are
   carried because the page prints both numbers rather than choosing the
   flattering one — and on this record neither is flattering.
   ─────────────────────────────────────────────────────────────────────────── */
export type DayBasis = "served_locked" | "process_replay" | "served_archive";

export type DayRow = {
  n?: number; win?: number; loss?: number; push?: number;
  date?: string; units?: number; roi?: number | null;
  record?: string; hit_rate?: number | null;
  is_today?: boolean;
  counts_in_record?: boolean;
  no_action?: boolean;
  no_action_reason?: string | null;
  basis?: DayBasis | string | null;
  walk_forward?: boolean;
  strategy?: { label?: string; plain_english_rule?: string; status?: string } | null;
};

export type SiteStreaks = {
  current?: { type?: string; length?: number } | null;
  n_decided?: number;
  best_win_streak?: number;
  best_loss_streak?: number;
};

export type PublicRecord = {
  headline: {
    n?: number; win?: number; loss?: number; push?: number;
    roi?: number | null; units?: number; record?: string;
    what?: string; basis?: string; label?: string; status?: string;
    start?: string; first?: string; through?: string;
    n_days?: number; decided?: number;
    by_month?: MonthRow[];
  };
  daily: DayRow[];
  streaks: { site?: SiteStreaks | null; since?: string } | null;
};

export async function getRecord(): Promise<PublicRecord | null> {
  try {
    const r = await fetch(`${ORIGIN}/api/snap/picks_unified_live?lite=1`, {
      next: { revalidate: 1800 },
    });
    if (!r.ok) return null;
    const d = await r.json();
    const rec = d?.record;
    const h = rec?.headline;
    // A headline with no sample is not a record. Refuse it rather than paint zeros.
    if (!h || typeof h.n !== "number" || h.n <= 0) return null;
    return {
      headline: {
        n: h.n, win: h.win, loss: h.loss, push: h.push,
        roi: h.roi, units: h.units, record: h.record,
        what: h.what, basis: h.basis, label: h.label, status: h.status,
        start: h.start, first: h.first, through: h.through,
        n_days: h.n_days, decided: h.decided,
        by_month: Array.isArray(h.by_month) ? h.by_month : (Array.isArray(rec?.by_month) ? rec.by_month : []),
      },
      daily: Array.isArray(rec?.daily) ? rec.daily : [],
      // `site` ONLY. record.streaks.by_analyst runs over a different and much
      // larger population (each analyst's own v2 reads, n_decided ~500) and the
      // payload's own note says the two are never summed. Not carried here, so
      // they cannot be.
      streaks: rec?.streaks
        ? { site: rec.streaks.site ?? null, since: rec.streaks.since }
        : null,
    };
  } catch {
    return null;
  }
}
