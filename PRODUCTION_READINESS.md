# DiamondEdge — production readiness

Last updated: 2026-08-02, frontend round 4 (agentA).
Head at time of writing: `d4afd18`.

This document is the running go/no-go. It records what has been swept, what was fixed,
what is explicitly still open, and what Leon is testing himself before launch. It is meant
to be read top to bottom by whoever picks the work up next.

---

## 1. Landed this round

### `778e412` — the research paper library, and error containment on the briefing

**The library.** The 19-paper corpus landed on contract 1.1 and the Research tab was still
reading the old shape: categories that no longer exist, a `flagship` flag nobody sets, three
top-level prose fields where the payload now ships `sections[].role`. Every paper fell into
an "Other" shelf and none of the evidence rendered at all. Rebuilt against the served
contract:

- **Index** — flagship featured full-width, then the served `categories[]` in their own order,
  each with its blurb and count. The card leads with the **verdict**, because on this corpus
  the verdict is the news (eleven of nineteen papers conclude something did *not* work). Tone
  is derived from the wording, never served, so a null cannot be dressed up as a finding.
- **Reading view** — keyed on section `role`, never on the English heading. `takeaway` is the
  gold pull-out, `extra` folds, `key_figures` set as an evidence ledger up front, `sources` in
  a fold, `related_papers` as footer cards. Markdown covers the subset the corpus actually
  uses (measured across all 19): `###`, `**bold**`, `*em*`, `` `code` ``, fenced blocks,
  bullets, `>` pull-quotes and `|` tables. Tables scroll inside their own container; the page
  body never scrolls sideways.
- **64 charts, 7 types, no chart library.** `interval` / `bar` / `compare` / `funnel` /
  `scoreboard` / `timeline` in CSS, `line` in SVG, all against the app's own tokens.
  House rule: *the drawing never says more than the number does* — bars are zero-based, ranges
  are drawn at true width, and two results that cannot be told apart are left looking
  identical, because on this corpus that is usually the finding. Colour is spent exactly
  twice: brand gold on the row a paper is about, and the green/slate/red of an `interval`
  against its reference line — the one encoding that carries an argument, with a legend that
  states it in words.

**Error containment.** See §2.

### `d4afd18` — the black tag, Preview after the fact, Recap retired, PTR on the board

- **The black DiamondEdge tag.** Our call is now the one dark object on a light tile, flush
  right, gold mark inside, seal beside it in the same right-hand group. Same object in all
  three states — revealed, locked, incoming — so a signed-out reader sees *that* a pick exists
  and that its value is redacted. On-black palette measured on `#0d1420`: gold `#f6c745`
  (12.4:1), mint `#5fe0ac` (10.9:1), rose `#ff8fa3` (8.6:1).
- **Tomorrow's picks are a state, not an absence.** A future-dated game renders the tag in an
  `incoming` state with the served `picks_eta` string (or a plain true sentence). Derived from
  the game's own date, so it works before the backend ships `status: "UPCOMING"`.
- **Recap tab removed.** It said one thing the hero does not already say and said it worse.
  Removed, not relocated.
- **Preview survives the game.** Tabs are now `Preview·Stats·Odds` pregame,
  `Live·Box Score·Preview·Stats·Odds` live, `Box Score·Preview·Stats·Odds` final. Preview
  carries a kicker ("How we saw it before first pitch") — a label, not a caveat.
- **Tab spacing.** `flex:1 1 0` + `min-width:0` makes the cells identical at 3, 4 and 5 tabs;
  type steps down so the longest label fits the smallest cell. Measured: no ellipsis and no
  overflow at 375 or 360, any count.
- **Pull-to-refresh on the Games board.** It did not work there because the predicate
  *required* an open game page. Now armed on the board and on a game page, never with anything
  stacked above, never mid-pan or mid-swipe-back. The board refreshes **in place** (refetch +
  re-render, 650 ms floor so the spinner cannot flash) rather than reloading, so the reader
  keeps their scroll position, league and date.

---

## 2. The "failure occurred when loading a news story" report

**What was actually wrong.** Walking every slide and every tap target on the live feed threw
nothing — so the failure is conditional, and two conditions that produce it were both live:

1. **A dead tap.** `openArticleSheet` began `if (!s) return;`. The deck resolves a story by key
   against `newsFeed`, and that feed refreshes on a poller underneath the mounted deck. If the
   key no longer resolved, the tap did *nothing at all* — which from the outside is exactly
   "I tried to load the news story and it failed".
2. **One bad item taking the whole tab.** Twenty-four independent slide builders are
   concatenated into a single string. A throw in any one of them unwound the entire render,
   `innerHTML` was never assigned, and the reader got an empty News tab.

**What is in place now.** `safeHtml` / `safeRun` boundaries per slide, per running order and
per surface; a designed `failState` with a retry instead of a blank rectangle; and an
unresolvable story opens a real, closable sheet that says so. Both shout on the console in
development and degrade quietly in production. **No user-visible surface anywhere says
"failure occurred" or shows a raw error string** — verified by grep and by the hostile pass.

**Hostile verification** (network-intercepted `news_feed`, six cases): malformed stories
(null headline, string angle, array article, dead image URL, unparseable date), empty object,
`null`, an array, HTTP 500, and a dead socket. Result in every case: **no blank tab, zero dead
taps, and every malformed story still opened a readable sheet.**

---

## 3. Swept and clean

| Check | Result |
|---|---|
| Console errors/warnings, all five tabs, 375 + 360 + desktop | clean |
| Dead-click-target guard (`#dev-deadbar`) | silent |
| Payload-documentation guard (`#dev-leakbar`) | silent |
| Horizontal overflow at 375 / 360 | none (`scrollWidth === clientWidth`) |
| Research index, reading view, all 7 chart types | render; screenshots in `audit-screenshots/research-charts/` |
| Sheets over the dock | holds |
| Pick-row width budget at 360 | no clipping; 1 tile in 15 wraps as a group |
| Game-page tabs at 3 / 4 / 5 | equal cells, no ellipsis, 375 and 360 |
| PTR arms on board + game page, not on Research | verified by synthetic touch |
| `npx next build` | clean |

**Theme note.** The app is deliberately **light-only**: `color-scheme: light` plus a
`prefers-color-scheme: dark` block that restores the light ramp. Rendering under a dark OS
preference was verified to be identical to light — that is the intended behaviour, not a bug.
If a real dark theme is ever wanted, the token ramps already exist and only that override
block has to go.

**Record surfaces.** Nothing in this agent's commit stream touched the record renderers or
their field names, so neither `778e412` nor `d4afd18` can have been the broken window Leon
saw. Both were verified live on production after landing. The contract guard for
`record.headline` / `record.daily` requested alongside that report is **not yet written** —
see §5.

---

## 4. Remaining pre-launch list — Leon's own testing

Explicitly out of scope for this round. The UI renders and the stub states are honest; the
functional testing is Leon's:

- **Signup flow, end to end**
- **Payment / subscription flows**
- **Support email delivery**

---

## 5. Still open — precise handoff

Ordered roughly by value. Each item is stated so it can be picked up without re-discovery.

1. **Statcast / pitch-level game stats.** Build a game-stats layer from
   `/api/v1.1/game/{pk}/feed/live` (per-pitch start speed and type, per-play exit velocity,
   launch angle, distance). Design as `GAME LEADERS`-style modules: hardest pitch (velo, who,
   type), avg/max fastball per pitcher, pitch-type mix, hardest-hit ball, longest home run,
   team LOB / RISP / bullpen innings. Cache per `gamePk` like the existing box score; refresh
   live games on the live cycle; **hide the module rather than showing blanks** when Statcast
   fields are absent. Not started.
2. **Tile vertical density.** Leon wants ~10–15 % of tile height back without losing the air.
   Current measured tile height at 375: **228 px**. Audit candidates: top/bottom padding vs the
   8pt grid, team-row line-height vs the enlarged crests, divider margins, adjacent elements
   both carrying margin. Not started. (Note: the pick row can now wrap on one tile in fifteen
   at 360 — factor that into any height budget.)
3. **Glass material unification + polish pass.** One documented recipe in `globals.css`
   (blur / saturation / tint / hairline / shadow as tokens) applied to every floating and
   overlay surface — sheet headers, date strip, segmented controls, story identity row, sticky
   sub-bars — plus continuous corners, spring timing on every interactive transition, pressed
   states on everything tappable, correct safe-area behaviour, reduced-motion clean. Today
   there are at least three approximations of the glass recipe in the sheet
   (`--glass`, `--chrome-bg`, and per-component ad-hoc values). Not started.
4. **App-wide dedupe sweep.** The single-home rule beyond the game page: desk headline record
   vs calendar vs ROI curve labels; record screen vs desk widget (must be the *same component*,
   not two renderings that can drift); stories slides vs the surfaces they summarise; analyst
   info on roster vs sheets vs slides; board summary line vs tiles. Not started. The Recap-tab
   removal in `d4afd18` is one instance of this rule, done.
5. **Record-contract regression guard.** A dev-guard-family check for the exact fields the
   record renderers consume (`record.headline`, `record.daily`: win/loss/push/record/units/
   hit_rate/n and the daily row shape) — loud in development; in production fall back to the
   last-good rendering or hide the module rather than showing NaN/undefined/empty dashes. Also
   confirm cache headers / service-worker behaviour cannot pin a user on a stale bundle against
   a new payload shape. Not started.
6. **Article popover header continuity.** The news-card → article transition: the card image
   should carry through into the sheet header and the headline settle; the sheet header is
   still round-2 language and should match the Today-card treatment. Not started.
7. **Pick lifecycle screenshots.** Today's local slate was all finals, so `upcoming-gated`,
   `upcoming-premium` (entitlement flipped), and `live` were never shot on a real game. The
   `final-won` and `final-lost` states are verified. Re-shoot when a slate with upcoming/live
   games is available.
8. **Game-page dedupe on a LIVE game.** The single-home rule (hero vs live block vs box score)
   was verified on `pre` and `final` only — no game was in progress during this round.
9. **Tomorrow-group section header.** "Tomorrow · picks drop in the morning" as a group header
   when today and tomorrow render together. The per-game `incoming` tag is done; the board
   still shows one date at a time, so the header is only meaningful once the board renders two
   days at once — decide that first.
10. **Empty / error / extreme states not yet exercised.** No-games day, no-news day, payload
    fetch failure on the *board* (only the news path has been hostile-tested), longest team
    names, `+105` prices, `11.5` totals, doubleheaders.
11. **Meta / production polish.** Page title, description, OG cards, favicon and touch icon
    against the new brand mark; 404 presentability; share links must not leak a gated pick.
    Not audited this round.

---

## 6. Go / no-go by surface

| Surface | Assessment |
|---|---|
| **Games board** | **Go.** Tag lands, no overflow, PTR works, console clean. Tile density is a polish item, not a blocker. |
| **News / briefing** | **Go.** Now the most defensively-tested surface in the app. Popover header continuity is cosmetic. |
| **Game page** | **Go with one gap** — never exercised on a live game (tabs, dedupe, live block). |
| **Desk** | **Not re-audited this round.** Assumed unchanged since round 3. Needs the dedupe pass. |
| **Record** | **Not re-audited this round.** Verified rendering correctly on production; wants the contract guard in §5.5. |
| **Research** | **Go.** Rebuilt and verified end to end this round. |
| **Account / Premium / Settings** | **No-go until Leon's own testing** (§4). UI renders; flows untested. |
