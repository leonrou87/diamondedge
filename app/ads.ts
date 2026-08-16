/* ════════════════════════════════════════════════════════════════════════════
   THE AD CONFIG — ONE FILE, TWO READERS.

   The picks went free on 2026-08-16 and advertising became the business. This
   module is the whole configuration of that business: who the partners are,
   which surfaces are for sale, what each one costs the reader, and what fills
   it when nobody has bought it.

   IT LIVES HERE RATHER THAN IN page.tsx BECAUSE IT HAS TWO READERS.
   `app/page.tsx` renders the units; `app/admin/kp-desk/revenue` prices them.
   The revenue console used to keep its own hand-typed copy of the slot table,
   which is a drift waiting to happen: add a slot, forget the mirror, and the
   console silently reports on an inventory that no longer matches the app —
   the owner would be pricing a surface that does not exist, or blind to one
   that does. Both now import this. There is one inventory.

   ═══ THE HARD RULES, IN CODE RATHER THAN IN A COMMENT ═══
    1. THE PICK ROW IS NEVER AN AD. Not the call strip, not the tile verdict,
       not the live pick line, not the Record or any graded receipt. An ad
       inside or beside a call implies the partner endorses it. `AD_SLOTS`
       simply contains no such placement, and adding one is the thing not to
       do. This is why the game sheet has exactly one slot and it is on the
       Odds tab: that tab is about the MARKET, and the pick lives on another.
    2. NO AD MAY BE MISTAKEN FOR EDITORIAL. Every unit — including the house
       card — carries an eyebrow saying what it is and renders in the app's aside
       language rather than the article or card voice. Every PAID unit also links
       with rel="noopener sponsored" and target="_blank". The house card does not,
       and should not: it is an internal link to our own /record, where
       rel="sponsored" would be a false declaration in the other direction.
    3. THE ONLY NUMBER A UNIT MAY QUOTE IS OUR OWN PUBLISHED LINE, and the
       partner is named as somewhere to shop it — never as a voice on it.
    4. NO THIRD-PARTY SCRIPT LOADS UNTIL A NETWORK IS CONFIGURED. `AD_NETWORK`
       is null out of the box: no tag, no tracker, no request, nothing in the
       boot path.
    5. THE STORY DECK IS OFF LIMITS. Its paint window (only the live slide ±1
       painted) exists because iOS Safari killed the page without it. An extra
       full-screen layer pulling a remote image is precisely that crash. There
       is no deck slot and there should not be one.
   ════════════════════════════════════════════════════════════════════════════ */

export type AdPartner = {
  id: string;
  label: string;
  tagline: string;
  /** The approved tracking URL. "#" means DARK — the partner never renders. */
  url: string;
  /** Per-state licensing. null = "no restriction recorded", NOT "allowed everywhere".
      A POPULATED array makes the partner dark everywhere — see adPartnerDark. */
  states?: string[] | null;
};

/* OWNER: paste approved affiliate tracking links here. A partner with url "#"
   is DARK — it never renders, and every slot falls through to the house card.
   LEAVE `states` NULL for a nationally-available offer. Record states only for a
   book with partial licensing, and know what that does: it makes the partner dark
   everywhere, because this app cannot tell where the reader is (see below). The
   revenue console names any partner dark for that reason. */
export const AD_PARTNERS: AdPartner[] = [
  { id: "book-a", label: "Your Sportsbook", tagline: "Compare totals and prices on today's board", url: "#", states: null },
  { id: "book-b", label: "Second Book",     tagline: "Line-shop the slate before first pitch",     url: "#", states: null },
];

/* OWNER: a display network is the LOW-VALUE FALLBACK — it fills a slot no
   affiliate wants, at a fraction of the money. Leave null and no third-party
   script is ever injected anywhere in this app.

   Set BOTH fields after signing up: `id` is the publisher/account id the tag
   wants, `src` is the network's script URL. `src` is what makes the loader in
   page.tsx the single, auditable place a remote tag can enter this product —
   there is no other `document.createElement("script")` in the ad path, and a
   network configured without a `src` stays dark rather than rendering a hole. */
export const AD_NETWORK: { id: string; src: string } | null = null;

/** CONFIGURED = the owner has pasted an approved tracking URL over "#". */
const adConfigured = (p: AdPartner) => !!(p && p.label && p.url && p.url !== "#");

/* ═══ LICENSING ELIGIBILITY — WHY `states` FAILS CLOSED ═══
   `states` was a decorative field: the type documented it, the owner checklist
   told him to populate it the day a book landed with partial licensing, and
   NOTHING READ IT. That is the worst kind of safeguard — it reads like one, so
   the restriction gets recorded, believed, and never enforced, and the failure
   is invisible until a regulator makes it visible.

   Enforcing it properly needs to know which state the reader is in, and THIS APP
   HAS NO GEO SIGNAL: no IP lookup, no permission prompt, and the analytics
   discipline here is two requests per session, so buying one for a geo endpoint
   is not free either. There is no honest way to satisfy a restriction we cannot
   evaluate — and a timezone guess is worse than nothing, because the harm is
   entirely in the direction of a wrong "allowed".

   So the field is enforced by refusing to render rather than by guessing:
     states: null / []   no restriction recorded — the partner renders. This is
                         the default, and what a nationally-available offer uses.
     states: ["NJ", …]   a restriction IS recorded and cannot be evaluated, so
                         the partner is DARK everywhere until a geo source exists.
   Dark is a real cost, so it is never silent: adDarkPartners() hands the reason
   to the revenue console, which prints it beside the partner. The owner finds out
   from his own dashboard rather than from a month of zeroes. */
const adReaderState = (): string | null => null;   // no geo source today — see above

/** null = this partner may render. A string = why it cannot, in the owner's words. */
export const adPartnerDark = (p: AdPartner): string | null => {
  if (!adConfigured(p)) return 'no approved tracking URL yet — still url: "#"';
  if (p.states && p.states.length) {
    const st = adReaderState();
    if (!st) return `licensing recorded for ${p.states.join(", ")}, and this app has no geo signal to check a reader against — dark everywhere until one exists`;
    if (!p.states.includes(st)) return `not licensed in ${st}`;
  }
  return null;
};

/** Partners that can actually render — approved, pasted, and with no unmet restriction. */
export const adLivePartners = (): AdPartner[] =>
  AD_PARTNERS.filter((p) => p && adPartnerDark(p) === null);

/** Partners the owner HAS configured that still cannot render, and why. Console prints these. */
export const adDarkPartners = (): { partner: AdPartner; why: string }[] =>
  AD_PARTNERS.filter(adConfigured)
    .map((p) => ({ partner: p, why: adPartnerDark(p) || "" }))
    .filter((r) => !!r.why);

export type AdSlot = {
  /** Where it is, in the reader's words — the console prints this. */
  label: string;
  /** board · game · news · desk · research. Groups the console's table. */
  surface: "board" | "game" | "news" | "desk" | "research";
  enabled: boolean;
  /** The fill ladder, in order of value: affiliate (CPA, the real money),
      display (a network tag, pennies), house (never an empty hole). */
  kinds: ("affiliate" | "display" | "house")[];
  /** Distinct PLACEMENTS of this slot per session — see the note on placements
      in page.tsx. Not renders: a repaint of a unit already on screen is the
      same placement and spends nothing. */
  cap: number;
  /** board-mid only: the smallest slate worth interrupting. */
  minSlate?: number;
  /** THE HONEST COST TO THE READER. Written down because the temptation, once
      money is involved, is to quietly promote a slot up this scale. */
  cost: "very low" | "low" | "low-moderate" | "moderate";
  note: string;
};

/* ═══ THE INVENTORY ═══ Every placement worth having, named, with what it
   costs the reader stated honestly. Slots marked enabled:false are BUILT AND
   WIRED — their call site exists and renders nothing — so turning one on is a
   one-word config change here, not a code change. An inventory listing a slot
   with no call site would be a lie to the owner about what he has to sell. */
export const AD_SLOTS: Record<string, AdSlot> = {
  /* ── BOARD ── the highest-traffic surface in the app. */
  "board-mid": {
    label: "Board · mid-slate", surface: "board", enabled: true,
    kinds: ["affiliate", "display", "house"], cap: 2, minSlate: 7, cost: "low",
    note: "one unit after the 6th tile, only on a slate of 7+, so it is never between the first games and never inside a tile",
  },
  "board-foot": {
    label: "Board · foot of the slate", surface: "board", enabled: true,
    kinds: ["affiliate", "display", "house"], cap: 2, cost: "very low",
    note: "terminal position below the last tile — the cheapest surface in the app, zero interruption, lowest CPM",
  },
  /* ── GAME ── exactly one, and it is on the Odds tab by rule 1. */
  "odds-shop": {
    label: "Game sheet · Odds tab", surface: "game", enabled: true,
    kinds: ["affiliate", "house"], cap: 3, cost: "low-moderate",
    note: "the highest-intent surface: a reader on this tab is line-shopping. Closes the pane, under the market's own record. No display tier — a network banner does not belong beside our line history",
  },
  /* ── NEWS ── */
  "article-end": {
    label: "News reader · end of article", surface: "news", enabled: true,
    kinds: ["affiliate", "display", "house"], cap: 4, cost: "low",
    note: "terminal position after the article body and its CTA row",
  },
  "article-mid": {
    label: "News reader · mid-article", surface: "news", enabled: false,
    kinds: ["affiliate", "display", "house"], cap: 2, cost: "moderate",
    note: "HELD BACK: interrupts prose mid-read. Wired and measurable — turn on only if fill rate at real CPM justifies the interruption",
  },
  /* ── DESK ── */
  "desk-foot": {
    label: "Desk · below the roster", surface: "desk", enabled: true,
    kinds: ["affiliate", "display", "house"], cap: 1, cost: "low",
    note: "the slot the 'Go Premium' ask vacated — terminal, already styled, a long way from any pick row",
  },
  /* ── RESEARCH ── */
  "research-foot": {
    label: "Research · end of a paper", surface: "research", enabled: false,
    kinds: ["house"], cap: 2, cost: "low",
    note: "HELD BACK: small audience, and a paper that concludes a thing did NOT work is the last place to sell a bet. House-only inventory by design — no affiliate tier is offered here at any price",
  },
};

/* NOT INVENTORY, AND DELIBERATELY SO — the surfaces that will never carry a
   unit, written down so the answer to "why isn't there an ad there?" is on the
   record rather than rediscovered:
     · the pick row, the call strip, the tile verdict, the live pick line
     · /record and every graded receipt — an ad on a result implies the partner
       vouches for it
     · the story deck (crash guard; see rule 5)
     · the sign-in and support surfaces */
export const AD_NEVER = [
  "the pick row, call strip, tile verdict and live pick line",
  "the Record and every graded receipt",
  "the story deck (paint-window crash guard)",
  "sign-in and support",
] as const;
