import { notFound } from "next/navigation";
import { adminState } from "../../../api/_lib/admin";
import { Shell, Login } from "../ui";
import { recentEvents, unreadSupport } from "../data";
import { AD_SLOTS, AD_NETWORK, AD_NEVER, adLivePartners } from "../../../ads";

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

/* THE INVENTORY IS IMPORTED, NOT RETYPED. This page used to keep its own copy
   of the slot table, which drifts the first time a slot is added and leaves the
   owner pricing a surface that no longer exists — or blind to one that does.
   app/ads.ts is the single table; app/page.tsx renders from it and this page
   prices from it. A slot that has never rendered still appears here as a zero,
   because "earned nothing" and "does not exist" are different facts. */
const SLOTS = Object.entries(AD_SLOTS).map(([id, s]) => ({ id, ...s }));
const SURFACE_ORDER = ["board", "game", "news", "desk", "research"];

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

  /* WHETHER REVENUE IS ON IS A FACT ABOUT THE CONFIG, NOT ABOUT THE EVENTS.
     Reading it off `partnersSeen` (as this page first did) means a deployment
     whose beacon is not writing — which is this one, see the blindness banner
     below — reports the same "no partner" as a correctly-measured empty week.
     One of those is a config the owner controls and the other is a broken
     pipe, so the page asks the config directly. */
  const livePartners = adLivePartners();
  const networkLive = !!(AD_NETWORK && AD_NETWORK.id && AD_NETWORK.src);
  const revenueLive = livePartners.length > 0 || networkLive;
  const paidPartners = [...partnersSeen].filter((p) => p !== "house");
  const tot = [...bySlot.values()].reduce(
    (a, r) => ({ imp: a.imp + r.imp, view: a.view + r.view, click: a.click + r.click }),
    { imp: 0, view: 0, click: 0 },
  );
  const ranked = SLOTS
    .map((s) => ({ ...s, ...(bySlot.get(s.id) || { imp: 0, view: 0, click: 0, partners: new Set<string>() }) }))
    .sort((a, b) => (SURFACE_ORDER.indexOf(a.surface) - SURFACE_ORDER.indexOf(b.surface)) || b.imp - a.imp);
  const orphans = [...bySlot.keys()].filter((k) => !AD_SLOTS[k]);

  return (
    <Shell active="revenue" unread={unread}>
      {!events.length && (
        <div className="panel">
          <h2>⚠ Nothing is being measured</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            <b>Not one event of any kind</b> — ad or otherwise — has reached{" "}
            <span className="mono">de_events</span> in {DAYS} days. That is not a quiet
            week: the app emits a <span className="mono">session</span> row for every
            visit. The beacon is not writing, so <b>every number on this page is a floor
            of zero, not a measurement</b>, and none of the inventory below can be priced
            until it is fixed.
          </p>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            <span className="mono">POST /api/events</span> returns 204 and writes nothing
            when <span className="mono">dataConfigured()</span> is false — that is{" "}
            <span className="mono">SUPABASE_URL</span> (or{" "}
            <span className="mono">NEXT_PUBLIC_SUPABASE_URL</span>) plus{" "}
            <span className="mono">SUPABASE_SERVICE_KEY</span> in the deployment&apos;s
            environment. Set the service key in Vercel and redeploy; rows start arriving
            on the next session.
          </p>
        </div>
      )}

      {!revenueLive && (
        <div className="panel">
          <h2>No revenue is being earned</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            This is read from the <b>configuration</b>, not from the numbers below: no
            partner in <span className="mono">AD_PARTNERS</span> has a real tracking URL
            and no display network is set. So every unit rendered was the <b>house
            card</b>, every click went to our own record page, and the income is exactly
            zero. What follows is <b>traffic, not income</b> — what the inventory is worth
            to a partner, measured rather than estimated.
          </p>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            To turn revenue on: get an affiliate approval, then replace{" "}
            <span className="mono">url: &quot;#&quot;</span> with the approved tracking URL in{" "}
            <span className="mono">AD_PARTNERS</span> (<span className="mono">app/ads.ts</span>).
            A display network is the low-value fallback and stays dark — no third-party
            script loads anywhere in this app until <span className="mono">AD_NETWORK</span>{" "}
            has both an id and a script src.
          </p>
        </div>
      )}
      {revenueLive && !paidPartners.length && !!events.length && (
        <div className="panel">
          <h2>Configured, but nothing paid has rendered yet</h2>
          <p className="muted" style={{ lineHeight: 1.6 }}>
            {livePartners.length} affiliate partner{livePartners.length === 1 ? " is" : "s are"} live
            {networkLive ? " and a display network is configured" : ""}, but every unit
            counted below still came back <span className="mono">house</span>. Check the
            slot table: a slot whose fill ladder starts at{" "}
            <span className="mono">affiliate</span> should be showing the partner id.
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
        <h2>The inventory · {DAYS}d</h2>
        <table>
          <thead>
            <tr>
              <th>Slot</th><th>State</th><th>Reader cost</th><th>Impr.</th><th>Viewable</th>
              <th>View %</th><th>Clicks</th><th>CTR</th><th>Filled by</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.id} style={r.enabled ? undefined : { opacity: 0.62 }}>
                <td>
                  <span className="mono">{r.id}</span>
                  <div className="sub">{r.label}</div>
                  <div className="sub muted">{r.note}</div>
                </td>
                <td className="muted">
                  {r.enabled ? "live" : "held back"}
                  <div className="sub">{r.kinds.join(" → ")}</div>
                  <div className="sub">cap {r.cap}/session</div>
                </td>
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
                <td><span className="mono">{k}</span><div className="sub">not in the inventory — a slot was renamed or removed while its rows survive</div></td>
                <td className="muted">?</td>
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
          Every slot in <span className="mono">app/ads.ts</span> is listed, live or not,
          and every one of them is <b>wired</b> — a held-back slot&apos;s call site exists
          and renders nothing, so turning it on is a one-word config change rather than
          new code. &quot;Filled by&quot; is the fill ladder&apos;s answer in practice:{" "}
          <span className="mono">house</span> means nobody paid for it.
        </p>
        <p className="muted">
          <b>Not inventory, and never will be:</b> {AD_NEVER.join("; ")}. An ad on or
          beside a call implies the partner endorses it, and an ad on a graded result
          implies they vouch for it.
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
