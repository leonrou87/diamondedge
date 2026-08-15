import type { Metadata } from "next";
import Link from "next/link";
import { getRecord, type DayRow, type MonthRow } from "./record-source";
import "./record.css";

/* ════════════════════════════════════════════════════════════════════════════
   /record — THE PUBLIC LEDGER, SERVER-RENDERED.

   WHY THIS ROUTE EXISTS.

   Measured on production before it did: the whole site is ONE crawlable URL, and
   that URL is a client-rendered SPA whose server-delivered HTML contains 53
   characters of body text — the <title>, and nothing else. Every fact the
   product is built on (195 graded picks, 32 nights, the losing month shown at
   the same weight as the winning one) lives inside a JavaScript tab. A crawler
   sees none of it. A link preview sees none of it. An answer engine sees none of
   it. A reader who is sent the URL sees a loading state.

   The brand promise is that every pick is graded in public. It was public in the
   sense that a reader who downloaded the app's payload could find it — not in
   the sense that anyone could LINK to it. This route is that promise made
   addressable: no JavaScript, one HTTP request, the whole record in the markup.

   WHAT IT MAY SAY. Only the blocks the served payload's own copy policy marks
   story_safe (record.headline, record.daily, record.streaks, record.by_month) —
   see the long note in record-source.ts, which is where that boundary is
   enforced rather than merely described. record.by_star_tier and the legacy
   record.by_date_record are unreachable from this file.

   WHAT IT MAY NOT SAY. Nothing about a game that has not been graded. This page
   never touches `games`, so there is no side, no line, no star count and no
   pass/pick fact about any live board anywhere in it — the paywall and the leak
   gate are not merely respected here, they are out of scope by construction.

   THE TWO DERIVED NUMBERS. Everything on the page is served except a Wilson
   interval and a flat-price counterfactual, both computed from the served
   win/loss counts and both shown WITH their method stated in the copy. They are
   here because they are the two things a reader needs in order to read the
   headline correctly and the app currently says neither: that 195 picks cannot
   separate a 44% rule from a 58% one, and that the positive unit count comes
   from the prices, not from the hit rate.
   ════════════════════════════════════════════════════════════════════════════ */

export const revalidate = 1800;

const TITLE = "The DiamondEdge record — every pick, graded in public";
const DESC =
  "Every pick DiamondEdge has served since July 1, 2026, graded at the price and line it was served at. The losing nights are on this page at the same size as the winning ones.";

/* THE SHARE CARD IS THE SITE'S EXISTING ONE, ON PURPOSE. app/opengraph-image.tsx
   already renders record.headline over a cumulative-units curve drawn through
   record.daily — it is, already, a card about this page. Naming it here is
   required rather than optional: declaring an `openGraph` object in a child
   segment replaces the inherited one, and without `images` this route shipped a
   `twitter:card = summary_large_image` with no image behind it (verified in the
   prerendered markup before this line existed). One card, one ledger, no second
   thing to keep in sync. */
const OG_IMAGE = "/opengraph-image";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/record" },
  openGraph: {
    type: "article", siteName: "DiamondEdge", title: TITLE, description: DESC,
    url: "/record", images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [OG_IMAGE] },
};

/* ── FORMATTERS ─────────────────────────────────────────────────────────── */

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ISO date -> "Wed, Aug 12". Parsed as UTC and read back in UTC: these strings
   are calendar days, not instants, and `new Date("2026-08-12")` in a local zone
   west of UTC is Aug 11. */
function dayLabel(iso?: string) {
  if (!iso || iso.length < 10) return iso || "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return `${DOW[t.getUTCDay()]}, ${MON[m - 1]} ${d}`;
}
function longDate(iso?: string) {
  if (!iso || iso.length < 10) return iso || "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${MON[m - 1]} ${d}, ${y}`;
}
function monthLabel(ym?: string) {
  if (!ym || ym.length < 7) return ym || "";
  const [y, m] = ym.split("-").map(Number);
  return `${MON[m - 1]} ${y}`;
}
/* Units always carry their sign — a ledger that hides the minus is not a ledger. */
function unitTxt(u?: number | null) {
  if (typeof u !== "number" || !isFinite(u)) return "—";
  const r = Math.round(u * 100) / 100;
  if (r === 0) return "0.00u";
  return `${r > 0 ? "+" : "−"}${Math.abs(r).toFixed(2)}u`;
}
function unitCls(u?: number | null) {
  if (typeof u !== "number" || !isFinite(u)) return "flat";
  const r = Math.round(u * 100) / 100;
  return r > 0 ? "pos" : r < 0 ? "neg" : "flat";
}
function pct(x?: number | null, dp = 1) {
  if (typeof x !== "number" || !isFinite(x)) return "—";
  return `${(x * 100).toFixed(dp)}%`;
}
function signedPct(x?: number | null, dp = 1) {
  if (typeof x !== "number" || !isFinite(x)) return "—";
  const v = x * 100;
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toFixed(dp)}%`;
}

/* WILSON SCORE INTERVAL, 95%. The right interval for a proportion at this sample
   size — unlike the normal approximation it does not run off the end of [0,1]
   and it does not collapse when a bucket is small. Computed over DECIDED picks
   (wins + losses); pushes are not trials. */
function wilson95(win: number, loss: number) {
  const n = win + loss;
  if (n <= 0) return null;
  const p = win / n;
  const z = 1.959963985;
  const den = 1 + (z * z) / n;
  const centre = (p + (z * z) / (2 * n)) / den;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return { lo: Math.max(0, centre - half), hi: Math.min(1, centre + half) };
}

/* THE PRICE AT -110 — what the SAME 94-90 would have returned had every ticket
   been laid at the standard number. Risk 1.10 to win 1.00: each win pays
   100/110 = 0.909u, each loss costs 1u, pushes cost nothing. The gap between
   this and the served unit count is, exactly, the part of the result that came
   from the price rather than from being right. */
const BREAKEVEN_110 = 110 / 210; // 0.5238…
function flat110Units(win: number, loss: number) {
  return win * (100 / 110) - loss;
}

/* ════════════════════════════════════════════════════════════════════════════ */

export default async function RecordPage() {
  const rec = await getRecord();

  const mast = (
    <header className="rec-mast">
      <span className="rec-mast-dia" aria-hidden="true" />
      <span className="rec-mast-name">DiamondEdge</span>
      <Link href="/" className="rec-mast-back">Today&rsquo;s board &rarr;</Link>
    </header>
  );

  /* THE null BRANCH. A record page that paints zeros during a feed outage is
     worse than one that says nothing: its entire value is that its numbers are
     true. So it says so, in the app's own voice, and sends the reader to the
     board — which has its own last-known-good handling. */
  if (!rec) {
    return (
      <main className="rec-page">
        {mast}
        <div className="rec-head">
          <div className="rec-kick">The public record</div>
          <h1 className="rec-h1">The ledger is not loading right now.</h1>
          <p className="rec-lede">
            This page reads the same served record the app does, and it would rather show you
            nothing than show you a number it cannot stand behind. Try it again in a few minutes,
            or open the board — it keeps its own last-known-good copy.
          </p>
        </div>
        <div className="rec-down">
          <Link href="/" className="rec-cta-b">Open DiamondEdge</Link>
        </div>
      </main>
    );
  }

  const h = rec.headline;
  const win = h.win ?? 0, loss = h.loss ?? 0, push = h.push ?? 0;
  const decided = h.decided ?? (win + loss);
  const ci = wilson95(win, loss);
  const flat = flat110Units(win, loss);
  const priceGap = (h.units ?? 0) - flat;
  const hitRate = decided > 0 ? win / decided : null;
  const beatsBreakeven = hitRate != null && hitRate >= BREAKEVEN_110;

  /* Graded nights only, newest first. Today's row is excluded on purpose: the
     served headline is stamped `through` yesterday, and a row the record does
     not yet count has no business under a table that footes to the record.
     `counts_in_record === false` is the payload's own flag for exactly that. */
  const days: DayRow[] = rec.daily
    .filter((d) => !d.is_today && d.counts_in_record !== false && (d.n ?? 0) > 0)
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const months: MonthRow[] = (h.by_month ?? []).slice().sort((a, b) => String(b.month).localeCompare(String(a.month)));
  const site = rec.streaks?.site ?? null;
  const cur = site?.current ?? null;

  /* How many different rules were in force across the graded nights. This is the
     single most under-sold honest fact in the payload: the engine changed its
     mind twelve times and the record counted every night straight through. */
  const ruleCount = new Set(days.map((d) => d.strategy?.label).filter(Boolean)).size;

  return (
    <main className="rec-page">
      {mast}

      <div className="rec-head">
        <div className="rec-kick">The public record</div>
        <h1 className="rec-h1">Every pick, graded in public.</h1>
        <p className="rec-lede">
          This is the whole ledger: <b>every pick DiamondEdge has served since {longDate(h.start)}</b>,
          graded at the price and the line it was served at. Nothing re-graded, nothing restated,
          and no strategy replayed over days it did not actually play. The losing nights are on
          this page at the same size as the winning ones, because a record you can only read the
          good half of is an advertisement.
        </p>
      </div>

      {/* ── THE FIGURE ── */}
      <section className="rec-hero">
        <div className="rec-hero-rec">{h.record}</div>
        <div className="rec-hero-sub">
          <b>{h.n} graded picks</b> over {h.n_days} nights, {longDate(h.first)} through {longDate(h.through)}
          {push > 0 ? <> — {decided} of them decided, {push} pushed.</> : "."}
        </div>

        <div className="rec-figs">
          <div className="rec-fig">
            <div className="rec-fig-k">Hit rate</div>
            <div className="rec-fig-v">{pct(hitRate)}</div>
            <div className="rec-fig-n">of {decided} decided</div>
          </div>
          <div className="rec-fig">
            <div className="rec-fig-k">Units</div>
            <div className={`rec-fig-v ${unitCls(h.units)}`}>{unitTxt(h.units)}</div>
            <div className="rec-fig-n">flat 1u a pick</div>
          </div>
          <div className="rec-fig">
            <div className="rec-fig-k">Return</div>
            <div className={`rec-fig-v ${unitCls(h.roi)}`}>{signedPct(h.roi, 1)}</div>
            <div className="rec-fig-n">on {decided}u staked</div>
          </div>
          <div className="rec-fig">
            <div className="rec-fig-k">Rules used</div>
            <div className="rec-fig-v">{ruleCount}</div>
            <div className="rec-fig-n">across {days.length} nights</div>
          </div>
        </div>
      </section>

      {/* ── HOW TO READ IT ── the part nobody else prints ── */}
      <section className="rec-sec">
        <h2 className="rec-h2">How to read this honestly</h2>
        <p className="rec-p">
          Most services show you a number like {h.record} and let you assume it means an edge.
          Here is what it actually supports, and what it does not.
        </p>

        <div className="rec-caveat">
          <p className="rec-p">
            <b>{h.n} picks is a small sample, and it is small in a specific, measurable way.</b>{" "}
            {ci && (
              <>
                A 95% Wilson interval around {pct(hitRate)} on {decided} decided picks runs from{" "}
                <b>{pct(ci.lo)} to {pct(ci.hi)}</b>. A rule that truly wins {pct(ci.lo)} of the time and
                a rule that truly wins {pct(ci.hi)} of the time would both produce a run like this one
                often enough that we could not tell them apart yet. The break-even hit rate at the
                standard −110 price is {pct(BREAKEVEN_110, 1)} — and it sits{" "}
                {BREAKEVEN_110 > ci.lo && BREAKEVEN_110 < ci.hi ? "inside that interval" : "outside that interval"}.
                So this record is{" "}
                {BREAKEVEN_110 > ci.lo && BREAKEVEN_110 < ci.hi
                  ? "not yet proof of an edge. It is a start, kept in public so it can become one — or not."
                  : "beginning to separate from chance, and we will keep printing the interval as it moves."}
              </>
            )}
          </p>
          <p className="rec-p">
            <b>
              The {unitTxt(h.units)} did not come from the hit rate.
            </b>{" "}
            {pct(hitRate)} is {beatsBreakeven ? "above" : "below"} the {pct(BREAKEVEN_110, 1)} you need
            to break even at −110. Laid at a flat −110, this exact {win}&ndash;{loss} would have
            returned <b>{unitTxt(flat)}</b>. It returned {unitTxt(h.units)} instead — a{" "}
            {unitTxt(priceGap)} difference that came from the prices the picks were served at, not
            from being right more often. That is a real part of how the product works and it is a
            fragile one: it depends on getting the number you were quoted.
          </p>
          <p className="rec-p small">
            Both figures in this box are computed from the win and loss counts above — Wilson score
            interval at 95% over decided picks, and 100/110 per win against 1 per loss for the
            flat-price line. Everything else on this page is served exactly as it is graded.
          </p>
        </div>
      </section>

      {/* ── MONTHS ── */}
      {months.length > 0 && (
        <section className="rec-sec">
          <h2 className="rec-h2">Month by month</h2>
          <p className="rec-p">
            Both months are here, in the order they happened, at the same weight.
          </p>
          <div className="rec-tw">
            <table className="rec-t">
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Picks</th>
                  <th scope="col">Record</th>
                  <th scope="col">Hit</th>
                  <th scope="col">Units</th>
                  <th scope="col">Return</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.month} className="mth">
                    <td>{monthLabel(m.month)}</td>
                    <td className="num">{m.n}</td>
                    <td className="num">{m.record}</td>
                    <td className="num">{pct(m.hit_rate)}</td>
                    <td className={`num u ${unitCls(m.units)}`}>{unitTxt(m.units)}</td>
                    <td className={`num u ${unitCls(m.roi)}`}>{signedPct(m.roi, 1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── STREAKS ── */}
      {site && (
        <section className="rec-sec">
          <h2 className="rec-h2">The streaks, both directions</h2>
          <p className="rec-p">
            Over {site.n_decided} decided picks. Pushes are neutral — they neither extend nor break
            a streak.
          </p>
          <div className="rec-streaks">
            {cur?.type && (
              <div className="rec-st">
                <div className="rec-st-k">Right now</div>
                <div className={`rec-st-v ${cur.type === "loss" ? "loss" : cur.type === "win" ? "win" : ""}`}>
                  {cur.length} {cur.type === "loss" ? "L" : cur.type === "win" ? "W" : ""}
                </div>
              </div>
            )}
            <div className="rec-st">
              <div className="rec-st-k">Best winning run</div>
              <div className="rec-st-v win">{site.best_win_streak}</div>
            </div>
            <div className="rec-st">
              <div className="rec-st-k">Worst losing run</div>
              <div className="rec-st-v loss">{site.best_loss_streak}</div>
            </div>
          </div>
        </section>
      )}

      {/* ── EVERY NIGHT ── */}
      {days.length > 0 && (
        <section className="rec-sec">
          <h2 className="rec-h2">Every night, in order</h2>
          <p className="rec-p">
            One row per night the board posted picks, newest first. The last column is the rule that
            was frozen before that night&rsquo;s first game — it changed {ruleCount} times across
            these {days.length} nights, and the record counts every one of them straight through. A
            product that quietly restarts its record when the model changes is not keeping a record.
          </p>
          <div className="rec-tw">
            <table className="rec-t">
              <thead>
                <tr>
                  <th scope="col">Night</th>
                  <th scope="col">Picks</th>
                  <th scope="col">Record</th>
                  <th scope="col">Units</th>
                  <th scope="col" className="rule">Rule in force that night</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date}>
                    <td>{dayLabel(d.date)}</td>
                    <td className="num">{d.n}</td>
                    <td className="num">{d.record}</td>
                    <td className={`num u ${unitCls(d.units)}`}>{unitTxt(d.units)}</td>
                    <td className="rule">{d.strategy?.label || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── BASIS ── served verbatim ── */}
      <section className="rec-sec">
        <h2 className="rec-h2">What counts, and what does not</h2>
        {h.basis && <p className="rec-p">{h.basis}</p>}
        <p className="rec-p">
          A pick is frozen before the game — side, line and price — and it is graded against that
          frozen ticket whatever the number moves to afterwards. Picks are counted one row per game.
          Units are flat: one unit a pick, every pick, no staking plan doing quiet work in the
          background.
        </p>
        <p className="rec-p small">
          This page shows the MLB product record, which is the only record DiamondEdge has run long
          enough to publish. NFL, WNBA and MLS boards keep their own separate ledgers from the day
          each one armed, and they are never blended into the figure above. Records are updated as
          nights finish grading; this page is current through {longDate(h.through)}.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="rec-cta">
        <div className="rec-cta-h">This is the record. The board is live.</div>
        <p className="rec-cta-p">
          Scores, news and the full slate are free. The picks behind the ledger above are the paid
          part — one honest call per game, frozen before first pitch, graded here win or lose.
        </p>
        <Link href="/" className="rec-cta-b">See today&rsquo;s board</Link>
      </section>

      <footer className="rec-foot">
        DiamondEdge is a sports information product, not a bookmaker and not financial advice. Bet
        only what you can afford to lose. 21+. Problem gambling? Call 1-800-GAMBLER.{" "}
        <Link href="/">Back to DiamondEdge</Link>.
      </footer>
    </main>
  );
}
