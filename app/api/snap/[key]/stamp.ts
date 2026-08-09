/* The version of a payload, read out of the payload itself.
   Lives in its own module so scripts/verify_pin_contract.ts can exercise it
   directly — this is the single invariant the `immutable` promise rests on, and
   an invariant nothing can test is a comment. */

/* WHAT VERSION ARE THESE ACTUAL BYTES? — read off the body we are about to
   send, and off nothing else.

   THIS IS THE LINE THE `immutable` PROMISE RESTS ON, so it is worth saying why
   the two obvious cheaper implementations are both wrong.

   NOT A SECOND REQUEST. Comparing the caller's pin against a separately fetched
   version leaves a window in which the publisher writes between the two reads.
   Fetch the version first and the body can be newer than it; fetch the body
   first and the version can be. EITHER ORDER can end with a year of
   immutability stamped onto a generation the URL does not name — wrong bytes,
   in every POP and every browser that saw them, and unrevokable. Reading the
   stamp out of the payload itself is the only formulation with no window at
   all: the thing compared IS the thing served.

   NOT A REGEX EITHER, and this one was caught in production before it shipped.
   `/"generated_utc"\s*:\s*"([^"]+)"/` finds the FIRST occurrence anywhere in the
   document, and these payloads are full of NESTED ones. Measured on the live
   feeds: pregame_picks contains 205 `generated_at` strings and the first belongs
   to a game, not the board; picks_unified_live's first `generated_utc` hit was
   `…T09:14:20Z` against a true top-level of `…T23:26:25Z`. A regex therefore
   compares the pin against a stamp from some inner object — usually failing
   safe, but failing safe by accident is not the same as being correct, and the
   one time it matched by coincidence it would have pinned the wrong generation
   forever.

   So: ONE PASS, TRACKING DEPTH, reading only fields at the top level — the same
   thing Postgres's `payload->>generated_utc` does, which is what the manifest
   publishes, so the two cannot disagree about what "the version" means. The
   preference order (utc, then at) matches the manifest's for the same reason.

   It is a character loop over up to a couple of megabytes, which sounds
   expensive until you notice WHEN it runs: only on a genuine cache miss, and
   the entire point of this design is that misses happen once per publish rather
   than once per TTL. Paying ~10 ms a few dozen times a day to make immutability
   honest is the best trade in the file. */
export function topLevelStamp(body: string): string {
  let depth = 0;
  let i = 0;
  const n = body.length;
  let utc = "";
  let at = "";
  let upd = "";

  // Reads a JSON string starting at the opening quote; returns [value, nextIndex].
  const readStr = (p: number): [string, number] => {
    let out = "";
    p++; // opening quote
    while (p < n) {
      const c = body[p];
      if (c === "\\") {
        // We only ever compare these values, and stamps are plain ASCII
        // timestamps — so an escape is copied verbatim rather than decoded.
        out += body[p] + (body[p + 1] || "");
        p += 2;
        continue;
      }
      if (c === '"') return [out, p + 1];
      out += c;
      p++;
    }
    return [out, p];
  };

  while (i < n) {
    const c = body[i];
    if (c === '"') {
      const [tok, next] = readStr(i);
      // A string at depth 1 is a KEY only if the next non-space char is ':'.
      let j = next;
      while (j < n && (body[j] === " " || body[j] === "\n" || body[j] === "\t" || body[j] === "\r")) j++;
      if (depth === 1 && body[j] === ":" &&
        (tok === "generated_utc" || tok === "generated_at" || tok === "updated_at")) {
        let k = j + 1;
        while (k < n && (body[k] === " " || body[k] === "\n" || body[k] === "\t" || body[k] === "\r")) k++;
        if (body[k] === '"') {
          const [val, after] = readStr(k);
          if (tok === "generated_utc") utc = val;
          else if (tok === "generated_at") at = val;
          else upd = val;
          i = after;
          continue;
        }
      }
      i = next;
      continue;
    }
    if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") depth--;
    i++;
  }
  /* THE ORDER IS A CONTRACT WITH /api/manifest — see the note beside its own
     `gu || ga || pu || updated_at`. These two must read the same field as "the
     version" or every pin stops verifying, silently. */
  return utc || at || upd;
}
