// Cluster D verification: the FULL magic-link loop on PRODUCTION, end to end.
// Request link on the live site (375px), read the email over IMAP, open the link,
// confirm signed-in, RELOAD, confirm still signed-in — then desktop signed-in shot.
// Usage: GMAIL_USER=... GMAIL_APP_PASSWORD=... node scripts/shot_magiclink_loop.mjs
import { chromium } from "/Users/leonrou/Desktop/nanny-kytepush/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const base = "https://diamondedge.kytepush.com";
const out = "/Users/leonrou/Desktop/diamondedge/audit-screenshots/bugfix";
mkdirSync(out, { recursive: true });
const EMAIL = "kytepush@gmail.com";
const t0 = new Date();

const shot = async (p, name) => { await p.screenshot({ path: `${out}/${name}.png` }); console.log("  ✓", name); };
const settle = async (p, ms = 3000) => { await p.waitForLoadState("networkidle").catch(() => {}); await p.waitForTimeout(ms); };

// Poll IMAP (python one-liner) for a Supabase auth mail newer than t0; return the verify link.
function readMagicLink() {
  const py = `
import imaplib, email, os, re, html, sys, json
from email.utils import parsedate_to_datetime
M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(os.environ["GMAIL_USER"], os.environ["GMAIL_APP_PASSWORD"])
M.select("INBOX")
typ, data = M.search(None, '(FROM "supabase")')
best = None
for i in data[0].split()[-4:]:
    typ, md = M.fetch(i, "(RFC822)")
    msg = email.message_from_bytes(md[0][1])
    dt = parsedate_to_datetime(msg["date"]).timestamp()
    body = ""
    for part in msg.walk():
        if part.get_content_type() in ("text/html", "text/plain"):
            body += part.get_payload(decode=True).decode("utf-8", "replace")
    body = html.unescape(body)
    links = [u for u in re.findall(r'https?://[^\\s"\\'<>\\)]+', body) if "/auth/v1/verify" in u]
    if links and (best is None or dt > best[0]):
        best = (dt, links[0])
M.logout()
print(json.dumps({"at": best[0] if best else 0, "link": best[1] if best else ""}))
`;
  const j = JSON.parse(execFileSync("python3", ["-c", py], { env: process.env }).toString());
  return j;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });

// ── 1. the sign-in screen, and the send ──
await page.goto(base, { waitUntil: "domcontentloaded" });
await settle(page);
await page.evaluate(() => { localStorage.removeItem("de_account"); localStorage.removeItem("de_supa_session"); });
await page.reload({ waitUntil: "domcontentloaded" });
await settle(page);
await page.click('[data-tab="account"], #dock [data-tab="account"]').catch(async () => {
  // dock button fallback: find by visible label
  await page.getByText("Account", { exact: true }).last().click();
});
await settle(page, 1200);
await shot(page, "01-signin-375");
await page.check("#sgn-terms").catch(() => {});
await page.fill("#sgn-mail", EMAIL);
await page.click("#sgn-mailgo");
await page.waitForSelector(".sgn-sent", { timeout: 15000 });
await shot(page, "02-link-sent-375");
console.log("magic link requested at", new Date().toISOString());

// ── 2. the email ──
let link = "";
for (let i = 0; i < 24; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const j = readMagicLink();
  if (j.link && j.at * 1000 > t0.getTime() - 5000) { link = j.link; break; }
  console.log("  …waiting for email", i);
}
if (!link) { console.error("NO EMAIL ARRIVED (rate limit?)"); await browser.close(); process.exit(1); }
const redir = (link.match(/redirect_to=([^&]+)/) || [])[1] || "";
console.log("email verify link redirect_to =", decodeURIComponent(redir));

// ── 3. click the link ──
await page.goto(link, { waitUntil: "domcontentloaded" });
await settle(page, 4000);
console.log("landed on:", page.url());
const acct1 = await page.evaluate(() => localStorage.getItem("de_account"));
console.log("de_account after link:", acct1 ? "SET " + JSON.parse(acct1).email : "MISSING");
await shot(page, "03-after-link-375");

// account tab should show the member, not the gateway
await page.click('[data-tab="account"], #dock [data-tab="account"]').catch(async () => {
  await page.getByText("Account", { exact: true }).last().click();
});
await settle(page, 1500);
await shot(page, "04-account-signedin-375");

// ── 4. refresh — still signed in ──
await page.reload({ waitUntil: "domcontentloaded" });
await settle(page, 3000);
const acct2 = await page.evaluate(() => localStorage.getItem("de_account"));
console.log("de_account after reload:", acct2 ? "SET " + JSON.parse(acct2).email : "MISSING");
await page.click('[data-tab="account"], #dock [data-tab="account"]').catch(async () => {
  await page.getByText("Account", { exact: true }).last().click();
});
await settle(page, 1500);
const gateway = await page.locator("#sgn-mail").count();
console.log("sign-in gateway visible after reload:", gateway > 0 ? "YES (BUG)" : "no — signed in");
await shot(page, "05-account-after-reload-375");

// ── 5. desktop: same storage state, signed in ──
const dp = await browser.newPage({ viewport: { width: 1440, height: 900 }, storageState: await page.context().storageState() });
await dp.goto(base, { waitUntil: "domcontentloaded" });
await settle(dp, 3000);
await dp.click('[data-tab="account"], #dock [data-tab="account"]').catch(async () => {
  await dp.getByText("Account", { exact: true }).last().click();
});
await settle(dp, 1500);
await shot(dp, "06-account-signedin-desktop");

await browser.close();
console.log(acct1 && acct2 && gateway === 0 ? "LOOP CLOSED — signed in once, refreshed, still signed in." : "LOOP STILL OPEN — see logs");
