import { connect, type TLSSocket } from "node:tls";

/* ════════════════════════════════════════════════════════════════════════════
   MINIMAL GMAIL SMTP CLIENT — zero dependencies, on purpose.

   This app ships three runtime deps (next, react, react-dom) and the support
   email needs exactly one thing: AUTH LOGIN + one message over
   smtp.gmail.com:465 (implicit TLS). That is ~100 lines of protocol, not a
   nodemailer install.

   FAIL CLOSED, NAME THE VAR. With GMAIL_SUPPORT_USER or
   GMAIL_SUPPORT_APP_PASSWORD unset, smtpMissing() returns exactly which env
   var the owner must set, and nothing ever pretends to have sent. The
   password must be a Google "App Password" (the account login password will
   be refused by Gmail for SMTP).
   ════════════════════════════════════════════════════════════════════════════ */

const HOST = "smtp.gmail.com";
const PORT = 465;
const USER = process.env.GMAIL_SUPPORT_USER || "";
const PASS = process.env.GMAIL_SUPPORT_APP_PASSWORD || "";

/** Which env vars are missing, or [] when sending is possible. */
export function smtpMissing(): string[] {
  const m: string[] = [];
  if (!USER) m.push("GMAIL_SUPPORT_USER");
  if (!PASS) m.push("GMAIL_SUPPORT_APP_PASSWORD");
  return m;
}

function once(sock: TLSSocket, timeoutMs = 15000): Promise<string> {
  return new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => { cleanup(); reject(new Error("smtp timeout")); }, timeoutMs);
    const onData = (d: Buffer) => {
      buf += d.toString("utf8");
      /* An SMTP reply is complete when the LAST line is `NNN<space>...` —
         multiline replies use `NNN-...` continuations. */
      const lines = buf.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1] || "";
      if (/^\d{3} /.test(last)) { cleanup(); resolve(buf); }
    };
    const onErr = (e: Error) => { cleanup(); reject(e); };
    const cleanup = () => { clearTimeout(t); sock.off("data", onData); sock.off("error", onErr); };
    sock.on("data", onData);
    sock.on("error", onErr);
  });
}

async function cmd(sock: TLSSocket, line: string, expect: number[]): Promise<string> {
  const p = once(sock);
  sock.write(line + "\r\n");
  const reply = await p;
  const code = parseInt(reply.trim().split(/\r?\n/).pop() || "", 10);
  if (!expect.includes(code)) throw new Error(`smtp ${code} after ${line.slice(0, 10)}…`);
  return reply;
}

/** RFC-safe-ish header value: strip CR/LF so nothing can inject headers. */
const hdr = (s: string) => String(s || "").replace(/[\r\n]+/g, " ").slice(0, 500);

export type MailResult = { ok: boolean; error?: string };

/** Send one plain-text email to one or more recipients. Never throws. */
export async function sendMail(opts: {
  to: string[]; subject: string; text: string; fromName?: string;
}): Promise<MailResult> {
  const missing = smtpMissing();
  if (missing.length) return { ok: false, error: `unset env: ${missing.join(", ")}` };
  const to = (opts.to || []).map((a) => hdr(a)).filter((a) => a.includes("@")).slice(0, 200);
  if (!to.length) return { ok: false, error: "no valid recipients" };
  let sock: TLSSocket | null = null;
  try {
    sock = await new Promise<TLSSocket>((resolve, reject) => {
      const s = connect({ host: HOST, port: PORT, servername: HOST }, () => resolve(s));
      s.once("error", reject);
      s.setTimeout(15000, () => reject(new Error("smtp connect timeout")));
    });
    await once(sock);                                   // 220 greeting
    await cmd(sock, `EHLO diamondedge.kytepush.com`, [250]);
    await cmd(sock, `AUTH LOGIN`, [334]);
    await cmd(sock, Buffer.from(USER).toString("base64"), [334]);
    await cmd(sock, Buffer.from(PASS).toString("base64"), [235]);
    await cmd(sock, `MAIL FROM:<${USER}>`, [250]);
    for (const rcpt of to) await cmd(sock, `RCPT TO:<${rcpt}>`, [250, 251]);
    await cmd(sock, `DATA`, [354]);
    const body = [
      `From: ${hdr(opts.fromName || "DiamondEdge")} <${USER}>`,
      /* One recipient shows in To:; a segment send BCCs everyone (each RCPT
         above gets a copy, no one sees the list). */
      `To: ${to.length === 1 ? to[0] : USER}`,
      `Subject: ${hdr(opts.subject)}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset=UTF-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      /* Dot-stuffing: a line starting with "." would end DATA early. */
      String(opts.text || "").replace(/\r?\n/g, "\r\n").replace(/(^|\r\n)\./g, "$1.."),
      `.`,
    ].join("\r\n");
    const p = once(sock, 30000);
    sock.write(body + "\r\n");
    const reply = await p;
    if (!/^250 /m.test(reply)) throw new Error("smtp send not accepted");
    try { sock.write("QUIT\r\n"); } catch {}
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 200) };
  } finally {
    try { sock?.destroy(); } catch {}
  }
}

/** Connect + authenticate only — proves the creds without sending anything. */
export async function verifySmtp(): Promise<MailResult> {
  const missing = smtpMissing();
  if (missing.length) return { ok: false, error: `unset env: ${missing.join(", ")}` };
  let sock: TLSSocket | null = null;
  try {
    sock = await new Promise<TLSSocket>((resolve, reject) => {
      const s = connect({ host: HOST, port: PORT, servername: HOST }, () => resolve(s));
      s.once("error", reject);
      s.setTimeout(15000, () => reject(new Error("smtp connect timeout")));
    });
    await once(sock);
    await cmd(sock, `EHLO diamondedge.kytepush.com`, [250]);
    await cmd(sock, `AUTH LOGIN`, [334]);
    await cmd(sock, Buffer.from(USER).toString("base64"), [334]);
    await cmd(sock, Buffer.from(PASS).toString("base64"), [235]);
    try { sock.write("QUIT\r\n"); } catch {}
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 200) };
  } finally {
    try { sock?.destroy(); } catch {}
  }
}
