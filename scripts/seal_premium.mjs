#!/usr/bin/env node
/* seal_premium.mjs — seal a FULL board payload for the entitled route.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * WHAT THIS IS FOR
 * The model writes two artifacts: the PUBLIC board, which goes to the web root
 * and to Supabase under its ordinary key, and the FULL board, which stays on
 * the build machine at 0600 (v4/serve/state/private/*.full.json). This turns
 * the second one into a row `<key>__sealed` that only /api/premium can open.
 *
 * WHY SEALED RATHER THAN PRIVATE. `slate_snapshots` is readable with the anon
 * JWT that ships in the public JS bundle, so a "private" second key would be a
 * second public key. Making it genuinely private needs an RLS policy plus a
 * service credential in the deployment — two things that, if either is
 * misconfigured, fail OPEN and put the whole board back on the wire with every
 * rail still green. That is the failure this whole change exists to repair.
 * Encryption fails the other way: a missing key means nobody can read it.
 *
 * AES-256-GCM, random 12-byte IV per seal, auth tag stored beside the
 * ciphertext. The tag matters: anyone can READ this row, and anyone with the
 * service key can WRITE it, so the route must be able to tell a tampered board
 * from a real one. GCM does that and throws rather than returning garbage.
 *
 * Usage:  node scripts/seal_premium.mjs <full.json> <snapshot-key>
 * Env:    DE_PREMIUM_SEAL_KEY   (64 hex chars = 32 bytes)
 *         SUPABASE_PROJECT_URL, SUPABASE_SERVICE_KEY
 * Secrets are read from the environment and NEVER printed.
 */
import { readFileSync } from "node:fs";
import { createCipheriv, randomBytes } from "node:crypto";

const [src, key] = process.argv.slice(2);
if (!src || !key) {
  console.error("usage: seal_premium.mjs <full.json> <snapshot-key>");
  process.exit(2);
}

const hex = process.env.DE_PREMIUM_SEAL_KEY || "";
if (!/^[0-9a-f]{64}$/i.test(hex)) {
  console.error("seal_premium: DE_PREMIUM_SEAL_KEY must be 64 hex chars "
    + "(32 bytes). Nothing sealed, nothing pushed.");
  process.exit(3);
}
const SURL = process.env.SUPABASE_PROJECT_URL || process.env.SUPABASE_URL || "";
const SKEY = process.env.SUPABASE_SERVICE_KEY || "";
if (!SURL || !SKEY) {
  console.error("seal_premium: SUPABASE_PROJECT_URL / SUPABASE_SERVICE_KEY "
    + "not in the environment. Nothing pushed.");
  process.exit(4);
}

const raw = readFileSync(src, "utf8");
/* COMPACT SERIALIZATION (2026-08-13). The builders pretty-print the full
   twins; sealing the indentation made the picks_unified ciphertext ~19MB and
   the upsert began dying on the DB's statement timeout (57014) — members sat
   on an Aug-11 board for two days. Re-serializing compact is byte-for-byte the
   same JSON to the route's JSON.parse and cuts the statement ~47%. */
let plaintext = raw;
try { plaintext = JSON.stringify(JSON.parse(raw)); } catch { /* sealed as-is; the probe below rejects non-JSON anyway */ }
/* Fail loudly if handed the PUBLIC artifact by mistake. Sealing the redacted
   board would be harmless but silently useless — members would pay for the
   same thing free readers get, and nothing would report it. */
try {
  const probe = JSON.parse(plaintext);
  if (probe && probe.premium_variant === "public") {
    console.error(`seal_premium: ${src} is the PUBLIC variant — there is `
      + "nothing premium in it to seal. Point this at the .full.json twin.");
    process.exit(5);
  }
} catch {
  console.error(`seal_premium: ${src} is not JSON`);
  process.exit(5);
}

const iv = randomBytes(12);
const c = createCipheriv("aes-256-gcm", Buffer.from(hex, "hex"), iv);
const ct = Buffer.concat([c.update(plaintext, "utf8"), c.final()]);
const payload = {
  alg: "aes-256-gcm",
  iv: iv.toString("base64"),
  ct: ct.toString("base64"),
  tag: c.getAuthTag().toString("base64"),
  v: new Date().toISOString(),
  n: plaintext.length,
  note: "Sealed premium board. Opened only by /api/premium behind a verified "
    + "session. Readable by anyone; useful to nobody without the key.",
};

const res = await fetch(`${SURL}/rest/v1/slate_snapshots?on_conflict=key`, {
  method: "POST",
  headers: {
    apikey: SKEY,
    Authorization: `Bearer ${SKEY}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  },
  body: JSON.stringify([{
    key: `${key}__sealed`,
    payload,
    updated_at: new Date().toISOString(),
  }]),
});
if (!res.ok) {
  console.error(`seal_premium: upsert ${key}__sealed failed HTTP ${res.status}`);
  process.exit(1);
}
console.log(`sealed ${key}__sealed  (${plaintext.length.toLocaleString()} B `
  + `plaintext -> ${payload.ct.length.toLocaleString()} B base64 ciphertext)`);
