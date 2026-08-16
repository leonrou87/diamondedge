import { notFound } from "next/navigation";
import { adminState } from "../../../api/_lib/admin";
import { Shell, Login } from "../ui";
import { recentEvents, unreadSupport } from "../data";

/* ════════════════════════════════════════════════════════════════════════════
   /admin/kp-desk/revenue — REVENUE READINESS.

   The picks went free on 2026-08-16 and advertising became the business, so
   this is the page that says what the ad inventory is actually worth. Its
   whole reason for existing is that the owner should price inventory from
   MEASURED numbers rather than from hope.

   Everything here is counted server-side from de_events — first-party, our own
   table, no third-party analytics anywhere in this product — from the three
   types the client emits:

     ad_impression  a unit was rendered into the page
     ad_view        it was VIEWABLE: ≥50% of pixels for ≥1 continuous second,
                    the IAB display standard, measured by IntersectionObserver
     ad_click       the reader clicked through

   `meta` is "<slot>|<partner>", so every number cuts by slot and by partner.

   THE BANNER AT THE TOP IS NOT DECORATION. Until an affiliate approves the
   owner and a real tracking URL replaces `url: "#"` in AD_PARTNERS, every unit
   rendered is the HOUSE card, every click went to our own record page, and the
   revenue is exactly zero. A dashboard that showed "1,240 impressions" without
   saying so would be inviting the owner to believe he is earning money.

   Freshness has the same honest caveat as the Activity page: numbers can only
   be as fresh as the last beacon, because ad events ride the same two-per-
   session batch as everything else. That is the egress-frugal design working.
   ════════════════════════════════════════════════════════════════════════════ */

export const dynamic = "force-dynamic";

const DAYS = 30;
const AD_TYPES = new Set(["ad_impression", "ad_view", "ad_click"]);

/* The inventory, mirrored from AD_SLOTS in app/page.tsx so a slot that has
   never rendered still appears here as a zero rather than silently missing —
   "this slot earned nothing" and "this slot does not exist" are different
   facts and the owner needs to tell them apart. */
const SLOTS: [string, string, string][] = [
  ["board-mid", "Board · mid-slate", "low"],
  ["board-foot", "Board · foot", "very low"],
  ["odds-shop", "Game sheet · Odds tab", "low-moderate"],
  ["article-end", "News reader · end of article", "low"],
  ["desk-foot", "Desk · below the roster", "low"],
  ["article-mid", "News reader · mid-article (held back)", "moderate"],
  ["research-foot", "Research · end of paper (held back)", "low"],
];

const pct = (n: number, d: number) => (d ? `${((n / d) * 100).toFixed(1)}%` : "—");

export default async function RevenuePage() {
  const state = await adminState();
  if (state === "unconfigured") notFound();
  if (state === "login") return <Login />;

  const [events, unread] = await Promise.all([
    recentEvents(DAYS).catch(() => []),
    unreadSupport().catch(() => 0),
  ]);

  type Row = { imp: number; view: number; click: number; partners: Set<string> };
  const bySlot = new Map<string, Row>();
  const byDay = new Map<string, { imp: number; click: number }>();
  const partnersSeen = new Set<string>();
  const row = (k: string) => {
    let r = bySlot.get(k);
    if (!r) { r = { imp: 0, view: 0, click: 0, partners: new Set() }; bySlot.set(k, r); }
    return r;
  };

  for (const e of events) {
    if (!AD_TYPES.has(e.type)) continue;
    const parts = String(e.meta || "").split("|");
    const slot = parts[0] || "?";
    const partner = parts[1] || "house";
    partnersSeen.add(partner);
    const r = row(slot);
    r.partners.add(partner);
    const d = new Date(e.created_at).toLocaleDateString("sv-SE", { timeZone: "America/New_York" });
    if (!byDay.has(d)) byDay.set(d, { imp: 0, click: 0 });
    if (e.type === "ad_impression") { r.imp++; byDay.get(d)!.imp++; }
    else if (e.type === "ad_view") r.view++;
    else { r.click++; byDay.get(d)!.click++; }
  }

  const paidPartners = [...partnersSeen].filter((p) => p !== "house" && p !== "display");
  const tot = [...bySlot.values()].reduce(
    (a, r) => ({ imp: a.imp + r.imp, view: a.view + r.view, click: a.click + r.click }),
    { imp: 0, view: 0, click: 0 },
  );
  const ranked = SLOTS
    .map(([id, label, cost]) => ({ id, label, cost, ...(bySlot.get(id) || { imp: 0, view: 0, click: 0, partners: new Set<string>() }) }))
    .sort((a, b) => b.imp - a.imp);
  const orphans = [...bySlot.keys()].filter((k) => !SLOTS.some(([id]) => id === k));

  return (
    <Shell active="revenue" unread={unread}>
      {!paidPartners.length && (
        <div className="panel">
          <h2>No revenue is being earned</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            No affiliate partner is live. Every unit counted below was the <b>house
            card</b>, and every click went to our own record page — so these numbers are
            <b> traffic, not income</b>. They are what the inventory is worth to a partner,
            measured rather than estimated.
          </p>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            To turn revenue on: get an affiliate approval, then replace{" "}
            <span className="mono">url: &quot;#&quot;</span> with the approved tracking URL in{" "}
            <span className="mono">AD_PARTNERS</span> (<span className="mono">app/page.tsx</span>).
            A display network is the low-value fallback and stays dark — no third-party
            script loads until <span className="mono">AD_NETWORK</span> is set.
          </p>
        </div>
      )}

      <div className="panel">
        <h2>Totals · {DAYS}d</h2>
        <div className="cards">
          <div className="card"><div className="k">Impressions</div><div className="v">{tot.imp.toLocaleString()}</div></div>
          <div className="card"><div className="k">Viewable</div><div className="v">{tot.view.toLocaleString()}</div><div className="sub">{pct(tot.view, tot.imp)} of impressions</div></div>
          <div className="card"><div className="k">Clicks</div><div className="v">{tot.click.toLocaleString()}</div></div>
          <div className="card"><div className="k">CTR</div><div className="v">{pct(tot.click, tot.imp)}</div></div>
          <div className="card"><div className="k">Viewable CTR</div><div className="v">{pct(tot.click, tot.view)}</div><div className="sub">the number a partner will ask for</div></div>
        </div>
        <p className="muted">
          Viewable = at least 50% of the unit&apos;s pixels on screen for one continuous
          second (IAB display standard). Counted first-party; no third-party tracker is
          loaded anywhere in this app.
        </p>
      </div>

      <div className="panel">
        <h2>By slot · {DAYS}d</h2>
        <table>
          <thead>
            <tr>
              <th>Slot</th><th>Reader cost</th><th>Impr.</th><th>Viewable</th>
              <th>View %</th><th>Clicks</th><th>CTR</th><th>Filled by</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.id}>
                <td><span className="mono">{r.id}</span><div className="sub">{r.label}</div></td>
                <td className="muted">{r.cost}</td>
                <td>{r.imp.toLocaleString()}</td>
                <td>{r.view.toLocaleString()}</td>
                <td>{pct(r.view, r.imp)}</td>
                <td>{r.click.toLocaleString()}</td>
                <td>{pct(r.click, r.imp)}</td>
                <td className="muted">{r.partners.size ? [...r.partners].join(", ") : "—"}</td>
              </tr>
            ))}
            {orphans.map((k) => (
              <tr key={k}>
                <td><span className="mono">{k}</span><div className="sub">not in the slot table — check AD_SLOTS</div></td>
                <td className="muted">?</td>
                <td>{bySlot.get(k)!.imp}</td>
                <td>{bySlot.get(k)!.view}</td>
                <td>{pct(bySlot.get(k)!.view, bySlot.get(k)!.imp)}</td>
                <td>{bySlot.get(k)!.click}</td>
                <td>{pct(bySlot.get(k)!.click, bySlot.get(k)!.imp)}</td>
                <td className="muted">{[...bySlot.get(k)!.partners].join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted">
          A slot showing zero has either not rendered yet or is held back in{" "}
          <span className="mono">AD_SLOTS</span>. The pick row itself is deliberately not
          in this table and never will be: an ad on or beside a call implies the partner
          endorses it.
        </p>
      </div>

      {byDay.size > 0 && (
        <div className="panel">
          <h2>Daily</h2>
          <table>
            <thead><tr><th>Day</th><th>Impressions</th><th>Clicks</th><th>CTR</th></tr></thead>
            <tbody>
              {[...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 30).map(([d, v]) => (
                <tr key={d}>
                  <td className="mono">{d}</td>
                  <td>{v.imp.toLocaleString()}</td>
                  <td>{v.click.toLocaleString()}</td>
                  <td>{pct(v.click, v.imp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
