# DiamondEdge — production readiness

Last updated: 2026-08-03, frontend round 5 (agentA).
Head at time of writing: `7dcf2c8`.

This document is the running go/no-go. It records what has been swept, what was fixed,
what is explicitly still open, and what Leon is testing himself before launch. It is meant
to be read top to bottom by whoever picks the work up next.

---

## 1. Landed in round 5

Five commits, landed in order: `ca0011f` · `da02f24` · `00401ab` · `c8bc6e8` · `7dcf2c8`.

### `ca0011f` — one glass material, a denser tile, the brand on every card the app hands out

**The material.** There were at least three approximations of "our glass": the dock's bespoke
five-layer capsule, the `--chrome-blur`/`--chrome-bg` pair the sticky bars used, and a scatter
of per-component `blur(4…18px)` values invented at the call site. Three recipes is three
materials, and it showed — the dock, the date band and a sheet header caught the light
differently on the same screen. There is now **one** recipe, tokenised at the top of
`globals.css` as five parts doing five optical jobs (filter · tint · hairline · specular ·
drop) in three densities:

| token | density | used by |
|---|---|---|
| `--mat-tint` | CHROME — bars that pin | games chrome, `.gp-head`, `.pitcherpage .gp-bar`, sheet header |
| `--mat-tint-thin` | SUB-BAR — a band nested inside chrome | date strip, league rail, every segmented control |
| `--mat-tint-smoke` | FLOAT — the capsule | the dock |

plus `--mat-filter` / `--mat-filter-lite`, `--mat-hair`, `--mat-spec`, `--mat-drop`,
`--mat-drop-float`, `--mat-scrim`. **Verified in the painted DOM: exactly two distinct
`backdrop-filter` values remain app-wide** (the full pass and the lite pass), where there were
five. Both theme ramps carry the tokens and the light-only override restores the light values,
so a dark-OS reader never gets dark glass on light surfaces.

The dock's smoke came down from `.30/.21` to `.19/.13`. Round 3 asked for the capsule to read
"a tiny tiny bit darker" than the page and its comment claimed "materially more of the board
reads through the blur" — at `.30` that was not true; it read as a grey slab.

**The finishing coat.** Continuous corners (`corner-shape: superellipse(1.8)`, progressively
enhanced, only where the curvature is visible) · one motion ladder (`--t-press/fast/mid/slow`,
spring for anything with mass) replacing about a dozen invented durations · a pressed state on
everything tappable, applied by ROLE so anything added later inherits it, momentary only, and
removed under reduced motion · one hairline instead of three ways of drawing a ring · safe
areas on the four surfaces that actually reach an edge.

**Tile density.** 232px → 178–199px measured across every board state at 375 (**−15 to −23 %**
against the target of 10–15 %). Not a squeeze — a padding audit: four of the six vertical
blocks were paying for padding twice (16px above an 11px cap-height label; a `gap:1px` and a
`margin-top:-2px` cancelling each other one pixel apart; two paddings stacked at the same seam;
the board's between-CARDS gap used between blocks INSIDE a card). The horizontal gutter came
off with it, which handed the pick row the 4px it was short of — **the one-tile-in-fifteen wrap
at 360 is gone**.

**Meta / OG / 404.** The per-game share card was still drawing the pre-round-4 mark (a rounded
rectangle turned 45°) while the icon, masthead and site card had moved to the Cut Diamond; both
cards now carry the real mark and drop Georgia for the house sans. The description claimed five
leagues against a product that ships one and a half. `theme_color` was answered three different
ways (viewport `#0b111e`, manifest `#eef1f7`, masthead `#131a28`) and `colorScheme:"dark"`
declared a dark app the stylesheet then spent a block undoing — one value now, taken from the
masthead. And there is a 404: it was Next's stock Times New Roman page, which every stale
`/g/<id>` link lands on.

### `da02f24` — Statcast GAME LEADERS, and the article header

**Statcast.** `/api/v1.1/game/<pk>/feed/live` through StatsAPI's `fields=` filter — 804 KB → 164
KB raw, 14 KB on the wire — riding the box score's **existing** cache: same 25 s TTL live,
fetched exactly once when final, same silent degradation, same repaint triggers. One extra
parallel fetch inside `loadMlbBox`; team aggregates come from the boxscore the app already
caches, so they cost nothing.

Two things about `fields=` the URL is shaped around: it matches on key NAME and every
intermediate name on the path must be listed (asking for `spinRate` without `breaks` returns
pitchData with no spin **and no error**), and there is no way to select `breaks.spinRate` alone,
so listing `breaks` drags in all eight break fields — the 99 KB → 164 KB difference, worth
paying because spin is what makes a velocity reading mean something.

Modules: hardest pitch · hardest-hit ball · longest home run · fastball-velocity leaderboard
(max and average per arm) · pitch mix for the arm that threw the most on each side · the team
day (LOB, RISP, bullpen innings, strikes/pitches). Every one is **absent** when the game did not
produce the fact, and if none survive the heading goes too.

Three honesty calls: a **cutter is not a fastball** (thrown 3–6 mph slower on purpose; FB is
four-seam / two-seam / sinker only, minimum five thrown, and the module says so); **team LOB is
the boxscore's formatted string**, never `teamStats.batting.leftOnBase`, which is a different
statistic that disagrees with it; and `"1.1"` innings means one and a **third**, so bullpen IP
is summed in outs. Pitch-mix bars are zero-based at true share, not scaled to the row maximum.

Measured coverage on four 2026 games: 100 % of `isPitch` events carry pitchData with startSpeed,
type and spin all present; batted-ball data is on 64–77 % of plays.

**The article header** is the card, continued. The news card is an App-Store "Today" card — the
photograph fills it, a scrim rises from the foot, the headline sits ON the image. Tapping it
landed on the web-article-teaser anatomy the Today card exists to replace. Same anatomy now,
one register bigger, and it carries through: same URL so the image is warm in cache, entering
by continuing the card's crop (1.05 → 1) rather than cross-fading in as a new picture, with the
type settling behind it on a 60/110 ms stagger.

### `00401ab` — the single-source sweep

The game page's "a fact has ONE home" rule, applied to the rest of the app. Every item is a
place two numbers could drift apart on a customer-facing surface.

- **One day ledger.** A day's W–L was reconstructed in **six** independent places. Two already
  disagreed and one was a latent outage: the recap slide read ONLY the legacy `by_date_record`,
  while `record.daily` (the current contract) ships as an ARRAY the slide could not read at all
  — so the day the backend drops the legacy key, that slide silently stops rendering. The slide
  also printed the SERVED hit rate while the record screen derived `w/(w+l)`; on a day with a
  push those are different numbers two taps apart. And the last-7 strip was the only surface in
  the app printing the record with **hyphens**. One normaliser now reads both shapes of
  `record.daily` and backfills from `by_date_record`, newest contract winning per-day.
- **One W–L string** (eighteen inline builds), **one grader** (`gradeOf` — fifteen surfaces each
  tested `p.result === "win"` against the raw string; they agreed only by coincidence of the
  current payload), **one news list** (the deck's running order and the reader's prev/next were
  derived twice from the same arithmetic), **one dek fallback**, **one precision** (the record
  hero printed "+8.5u / 53.7%" while the scope rows six inches below printed "+8.45u / 54%" for
  the same window in the same viewport).
- **A paywall leak.** The briefing deck's "the desk leans" headline recomputed the desk
  consensus from the same source as `consensusBanner` — the canonical rendering, which
  suppresses the side word whenever the pick is locked — with **no gate**, and printed the side
  in 28px display type on the first screen a signed-out reader sees. Same gate as the banner now.
- **Dead code deleted**: `boardSummaryBar`, `dayPicksTally`, `featuredCard` — three more
  independent renderings of facts the live surfaces own, waiting to be wired back up and disagree.

### `c8bc6e8` + `7dcf2c8` — the pre-serve board, and the pending state

**The board said "nothing scheduled" on a day with eight games — for six hours, every morning.**
The board reads the backend's `pregame_picks` snapshot, which is regenerated when the day's
picks publish at 06:00 PT. Between midnight and that serve it still holds *yesterday's* slate,
so on the calendar day itself it found nothing and printed **"NO MLB ON THE BOARD · Nothing
scheduled for Monday, August 3"** over a day with eight scheduled games. It never surfaced in
testing because you have to be looking at the board on the right day in the right six hours —
which is what happened while this round was running.

`picks_unified_live` already carries the day's games as `status: "upcoming"` with a `picks_eta`.
Those games are on the board now, each with the INCOMING tag and the schedule note above them.
Three things it took, each its own small lie:

- **The merge is scoped, not a union.** The first cut merged by `game_id` and doubled every past
  board — thirty tiles for fifteen games, each matchup twice — because the two feeds give the
  SAME game DIFFERENT `game_id`s. Matching on team names instead would be a heuristic on a
  surface where a duplicated game is a duplicated PICK. The merge fires **only** when the
  board's own payload has nothing at all for that date and league.
- **The shapes differ.** Full team names where the tile reads `*_abbr`, `first_pitch_utc` where
  it reads `start_ts`, and no `sport` on any game. Merged raw, the tiles rendered as two blank
  crests, a dangling "L2" and a start time of "TBD".
- **A pass is a verdict, and you cannot pass on a game you have not read.** The pass panel
  counted them as games the desk "read and priced" and led with "Nothing cleared the bar" — and
  the game page said the same thing in the DiamondEdge Pick slot.

**`picksPending(g)`** is the single predicate for "our picks for this game are not published
yet", and it is built on fields nothing in the render path rewrites (`pick.status`,
`pick.is_upcoming`, `desk_status`, plus a date-level fallback read off the live feed's own
objects). The first cut read the game-level `status`, which **the live-score overlay rewrites**
from "upcoming" to "pre" — so the board said "PICKS SOON" while the game page one tap later
said "the pass is the pick", about the same game, in the same minute.

**The ETA sentence is composed, not served.** The same feed shipped BOTH "Picks drop tomorrow
morning" (on the game) and "Picks drop this morning" (on the pick) for the same game; a relative
day word in a cached payload outlives the day it was written in. Built from the date and the
served *time* now — and `picks_eta` arrives as an **object**, which the old reader stringified,
so the tag was one render away from printing "[object Object]".

---

## 2. The record-contract guard (the answer to the broken-record window)

The record is the product's whole argument and it renders entirely from two payload objects
whose field names live on the backend. The failure mode is not a crash — it is `NaN–NaN`, or
"undefined% hit", or a module that quietly becomes an em dash.

**In development** — a third dev guard in the same idiom as `#dev-deadbar` and `#dev-leakbar`:
a console error naming the exact missing path **and the feed it came from**, plus a fixed
banner. It checks that `record.headline` carries the fields the renderers actually consume (an
explicit list, because "is an object" passes on `{}`), that `record.daily` is one of the two
supported shapes, that its rows **parse** and not merely exist, and that nothing consumed is NaN.

**In production** — not installed, but the renderers are separately hardened: every record
figure goes through a reader that refuses non-finite values and remembers the last good headline
for the session. Stale-but-true beats blank; blank beats wrong.

**Hostile-tested**, the way the news path was in round 4 — both payloads mangled at the point
they land (headline replaced with a field-free object, every daily row's `win`/`loss` renamed,
the legacy `by_date_record` emptied):

| | result |
|---|---|
| dev guard | named all six missing headline fields **and** the feed |
| Desk headline | fell through to a TRUE record from the next ledger down |
| 14-day widget | honest "no picks" dots |
| painted DOM | **zero** occurrences of `NaN`, zero of `undefined` |

**Version skew, both directions.** Every reader accepts the old AND the new field name, so a
user pinned on a stale bundle against a new payload — and a fresh bundle against a cached old
payload — both render. **Cache audit:** no service worker, no `vercel.json`, no custom headers;
Next serves content-hashed immutable chunks behind HTML the browser revalidates, so a *reload*
can never pin a stale bundle. The residual case is a long-lived standalone PWA tab that never
reloads while the payload moves underneath it — which is exactly the case the alias readers and
the safe reader cover.

---

## 3. Swept and clean

Headless, three widths × four dates × five tabs (`audit-screenshots/round5/`):

| Check | Result |
|---|---|
| Console errors, 375 + 360 + desktop, every tab and date | **zero** |
| Horizontal page overflow | **zero** at every width |
| `NaN` / `undefined` / `[object Object]` in the painted DOM | **zero** |
| Dead-click guard · payload-leak guard · record-contract guard | all silent |
| Distinct `backdrop-filter` values app-wide | 2 (was 5) |
| Tile height at 375 | 178–199px (was 227–232) |
| Pick-row wrap at 360 | none (incoming tag re-fitted: callrow 37px → 17px) |
| Board: today / yesterday / two days back / a future day | correct, **zero duplicate game ids or matchups** |
| Total payload fetch failure (all sources blocked) | designed empty state; Desk falls to its zero-state; News shows the end card; no raw error anywhere |
| Empty future day | standalone schedule note |
| `npx next build` | clean |
| 404 route | on brand, `robots: noindex` |
| OG cards | verified they do not leak a gated pick — the `/g/` card says a pick EXISTS and stops |

Two elements report internal overflow and **both are intentional**: `#games-view`'s full-bleed
negative margin on the sticky chrome, and the native date input parked over the calendar button.

**Theme note.** The app is deliberately **light-only**: `color-scheme: light` plus a
`prefers-color-scheme: dark` block that restores the light ramp. The material tokens are defined
in all three blocks, so the recipe is a real two-theme system the day that override comes out.

---

## 4. Remaining pre-launch list — Leon's own testing

Explicitly out of scope for the frontend rounds. The UI renders and the stub states are honest;
the functional testing is Leon's:

- **Signup flow, end to end**
- **Payment / subscription flows**
- **Support email delivery**

---

## 5. Still open

1. **LIVE-game verification.** The single-home rule (hero vs live block vs box score), the
   5-tab bar, the live pick states and the Statcast modules on a live cycle have been exercised
   on `pre` and `final` only. No game was in progress at any point across rounds 4 and 5 — first
   pitch on the day this was written is 3:40 PM local. **Everything else in the pick lifecycle is
   now shot**: `upcoming-gated`, `upcoming-premium`, `final-won`, `final-lost`, each signed-out
   and with the entitlement flipped.
2. **Doubleheaders and extreme prices.** `+105`, `11.5` totals and the longest team names all
   render without clipping in the sweep above, but no doubleheader appeared on any of the four
   dates tested — the two-games-same-teams-same-day case is unexercised.
3. **The remaining dedupe items**, lower value than the ones taken: the pick call block still has
   more than one markup (the briefing slide hand-builds it; the board delegates to
   `compactDePickHtml`) and the patterns meta chips are rebuilt inline rather than shared with
   `patternCard`. Neither can currently disagree about a NUMBER — they are presentation
   duplicates, not fact duplicates — which is why they were left.
4. **A "Tomorrow" group header** when today and tomorrow render together. The board still shows
   one date at a time and the per-game incoming tag plus the schedule note now carry the meaning,
   so this is only worth doing if the board ever renders two days at once.
5. **The signup sheet's brand lockup** is a gold rounded-square plate carrying the diamond, which
   is the app-icon idiom rather than the masthead's. Cosmetic, one surface.

---

## 6. Go / no-go by surface

| Surface | Assessment |
|---|---|
| **Games board** | **Go.** Tile density −15…−23 %, no overflow, no duplicates, the pre-serve window now tells the truth, incoming tag on every pending game, console clean at all three widths. |
| **News / briefing** | **Go.** Round 4's defensive work holds; the article header is now the card continued, and the deck's ungated consensus leak is closed. |
| **Game page** | **Go with one gap** — never exercised on a live game (tabs, dedupe, live block, Statcast live cycle). Pre and final are verified, GAME LEADERS renders and hides correctly. |
| **Desk** | **Go.** Now provably the same component and the same numbers as the Record screen; falls to an honest zero-state under a total payload failure. |
| **Record** | **Go.** Six independent day-ledger readings collapsed to one, guarded in dev, hardened in production, hostile-tested. |
| **Research** | **Go.** Unchanged since round 4; re-verified clean this round. |
| **Account / Premium / Settings** | **No-go until Leon's own testing** (§4). UI renders; flows untested. |
