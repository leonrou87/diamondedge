import React from "react";

/* ════════════════════════════════════════════════════════════════════════════
   /admin/kp-desk — shared shell for the owner's console.

   DELIBERATELY NOT THE CONSUMER UI. This imports nothing from app/page.tsx:
   the console is a server-rendered, zero-client-JS tool with its own tiny
   stylesheet. Plain HTML forms, full-page navigations, no chart libraries —
   the charts are server-rendered inline SVG. Boring on purpose: it must
   never break because the consumer bundle changed.

   The root app/layout.tsx owns <html>/<body> (and globals.css), so this is
   a full-viewport wrapper div with every selector scoped under .kpdesk —
   the consumer stylesheet and this one can never fight over an element.
   ════════════════════════════════════════════════════════════════════════════ */

const CSS = `
  .kpdesk { min-height: 100vh; background: #f4f5f7; color: #16181d;
            font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  .kpdesk a { color: #0a6cff; text-decoration: none; }
  .kpdesk a:hover { text-decoration: underline; }
  .kpdesk .kp-wrap { max-width: 1060px; margin: 0 auto; padding: 18px 20px 60px; }
  .kpdesk .kp-top { display: flex; align-items: baseline; gap: 18px; padding: 10px 0 14px;
            border-bottom: 1px solid #e2e4e9; margin-bottom: 18px; flex-wrap: wrap; }
  .kpdesk .kp-brand { font-weight: 700; letter-spacing: .4px; font-size: 15px; }
  .kpdesk .kp-brand small { color: #8a8f99; font-weight: 500; }
  .kpdesk .kp-nav { display: flex; gap: 4px; flex-wrap: wrap; }
  .kpdesk .kp-nav a { padding: 4px 10px; border-radius: 6px; color: #3c414b; font-weight: 500; }
  .kpdesk .kp-nav a.on { background: #16181d; color: #fff; }
  .kpdesk .kp-nav a .b { display: inline-block; min-width: 16px; text-align: center; margin-left: 5px;
                 background: #e33; color: #fff; border-radius: 8px; font-size: 11px;
                 font-weight: 700; padding: 0 4px; }
  .kpdesk .kp-out { margin-left: auto; }
  .kpdesk .kp-out button { border: none; background: none; color: #8a8f99; cursor: pointer; font-size: 12px; }
  .kpdesk h1 { font-size: 19px; margin: 0 0 4px; }
  .kpdesk .sub { color: #6b7079; margin-bottom: 16px; font-size: 13px; }
  .kpdesk .cards { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
  .kpdesk .card { background: #fff; border: 1px solid #e2e4e9; border-radius: 10px; padding: 12px 16px; min-width: 130px; }
  .kpdesk .card .k { font-size: 12px; color: #6b7079; }
  .kpdesk .card .v { font-size: 22px; font-weight: 700; margin-top: 2px; }
  .kpdesk .card .d { font-size: 11px; color: #9aa0aa; margin-top: 2px; }
  .kpdesk .panel { background: #fff; border: 1px solid #e2e4e9; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; overflow-x: auto; }
  .kpdesk .panel h2 { font-size: 14px; margin: 0 0 10px; }
  .kpdesk table { border-collapse: collapse; width: 100%; font-size: 13px; }
  .kpdesk th { text-align: left; color: #6b7079; font-weight: 600; font-size: 12px;
       border-bottom: 1px solid #e2e4e9; padding: 5px 10px 5px 0; white-space: nowrap; }
  .kpdesk td { border-bottom: 1px solid #f0f1f4; padding: 6px 10px 6px 0; vertical-align: top; }
  .kpdesk tr:last-child td { border-bottom: none; }
  .kpdesk .badge { display: inline-block; padding: 1px 8px; border-radius: 9px; font-size: 11px; font-weight: 700; }
  .kpdesk .badge.prem { background: #f4e8c8; color: #7a5d00; }
  .kpdesk .badge.free { background: #eceef2; color: #5c626d; }
  .kpdesk .badge.unread { background: #e33; color: #fff; }
  .kpdesk .muted { color: #9aa0aa; }
  .kpdesk .mono { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
  .kpdesk input[type=text], .kpdesk input[type=search], .kpdesk input[type=password],
  .kpdesk textarea, .kpdesk select {
    font: inherit; padding: 7px 10px; border: 1px solid #ccd0d8; border-radius: 7px;
    background: #fff; color: #16181d; width: 100%; }
  .kpdesk textarea { min-height: 90px; resize: vertical; }
  .kpdesk button.go { font: inherit; font-weight: 600; padding: 7px 16px; border: none;
              border-radius: 7px; background: #16181d; color: #fff; cursor: pointer; }
  .kpdesk button.go:hover { background: #2c2f36; }
  .kpdesk form.row { display: flex; gap: 8px; align-items: center; }
  .kpdesk .note { padding: 9px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 14px; }
  .kpdesk .note.ok { background: #e2f3e6; color: #1c6b2e; }
  .kpdesk .note.err { background: #fbe4e4; color: #8f1f1f; }
  .kpdesk .note.warn { background: #fdf1d8; color: #7a5d00; }
  .kpdesk .thread { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .kpdesk .msg { max-width: 640px; padding: 8px 12px; border-radius: 10px; white-space: pre-wrap; }
  .kpdesk .msg.user { background: #eef1f6; align-self: flex-start; }
  .kpdesk .msg.admin { background: #dcecff; align-self: flex-end; }
  .kpdesk .msg .at { display: block; font-size: 11px; color: #8a8f99; margin-top: 3px; }
  .kpdesk .login { max-width: 320px; margin: 0 auto; padding-top: 18vh; }
  .kpdesk .login .box { background: #fff; border: 1px solid #e2e4e9; border-radius: 12px; padding: 26px; }
  .kpdesk .login h1 { font-size: 16px; margin-bottom: 12px; }
  .kpdesk .login form { display: flex; flex-direction: column; gap: 10px; }
  .kpdesk label.chk { display: flex; gap: 7px; align-items: center; font-size: 13px; color: #3c414b; }
`;

export function Shell(props: {
  active: string; unread?: number; children: React.ReactNode;
}) {
  const tabs: [string, string, string][] = [
    ["users", "Users", "/admin/kp-desk"],
    ["activity", "Activity", "/admin/kp-desk/activity"],
    ["support", "Support", "/admin/kp-desk/support"],
    ["email", "Email", "/admin/kp-desk/email"],
  ];
  return (
    <div className="kpdesk">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="kp-wrap">
        <div className="kp-top">
          <span className="kp-brand">◆ KP DESK <small>· DiamondEdge admin</small></span>
          <nav className="kp-nav">
            {tabs.map(([id, label, href]) => (
              <a key={id} href={href} className={props.active === id ? "on" : ""}>
                {label}
                {id === "support" && (props.unread || 0) > 0 ? <span className="b">{props.unread}</span> : null}
              </a>
            ))}
          </nav>
          <form className="kp-out" method="post" action="/api/admin/login">
            <input type="hidden" name="out" value="1" />
            <button type="submit">sign out</button>
          </form>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export function Login(props: { error?: boolean }) {
  return (
    <div className="kpdesk">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="login">
        <div className="box">
          <h1>◆ KP Desk</h1>
          {props.error ? <div className="note err">Wrong password.</div> : null}
          <form method="post" action="/api/admin/login">
            <input type="password" name="password" placeholder="Password" autoFocus autoComplete="current-password" />
            <button className="go" type="submit">Enter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ── tiny shared formatters (server-side only) ── */
export const fmtDT = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(+d)) return "—";
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "America/New_York",
  });
};
export const fmtD = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(+d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });
};
export const ago = (iso: string | null | undefined) => {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (isNaN(ms)) return "—";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : fmtD(iso);
};

/** Server-rendered SVG bar chart — no chart library, ~1KB of markup. */
export function Bars(props: {
  data: { label: string; value: number }[]; width?: number; height?: number; color?: string;
}) {
  const W = props.width || 900, H = props.height || 120, pad = 2;
  const n = props.data.length || 1;
  const bw = Math.max(2, Math.floor(W / n) - pad);
  const max = Math.max(1, ...props.data.map((d) => d.value));
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 18}`} preserveAspectRatio="none" role="img"
      style={{ display: "block", height: H + 18, maxWidth: "100%" }}>
      {props.data.map((d, i) => {
        const h = Math.round((d.value / max) * H);
        const x = i * (bw + pad);
        return (
          <g key={i}>
            <rect x={x} y={H - h} width={bw} height={Math.max(h, d.value > 0 ? 2 : 0)} rx={2} fill={props.color || "#16181d"}>
              <title>{`${d.label}: ${d.value}`}</title>
            </rect>
            {i % Math.max(1, Math.ceil(n / 10)) === 0 ? (
              <text x={x} y={H + 13} fontSize={9} fill="#9aa0aa">{d.label.slice(5)}</text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
