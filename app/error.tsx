"use client";

import { useEffect } from "react";

/* ═══════════════════ THE ERROR BOUNDARY ═══════════════════
   There wasn't one. The entire product renders from a single ~17,000-line client component,
   so any exception it throws — one malformed field on one payload, one null the renderer did
   not expect — unmounted the tree and left a WHITE SCREEN. No message, no retry, and nothing
   anywhere that could tell us it happened. That is the largest blast radius in the app: it is
   not one card that breaks, it is every reader at once.

   WHAT THIS IS AND IS NOT. It is not error reporting and does not pretend to be — there is no
   Sentry here and adding one is a separate decision. It is the difference between a white
   screen and a page that says what happened and offers the way back, which is the part a
   reader experiences.

   THE PROP IS `unstable_retry`, NOT `reset`. In this version of Next `reset()` only clears the
   boundary's state and re-renders the same children off the same data — for a payload that
   failed to load, that re-throws immediately and the button does nothing. `unstable_retry()`
   re-FETCHES and re-renders, which is the behaviour a "Try again" button promises. `reset` is
   still exported and still the thing most examples show, which is exactly why this note is
   here (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md).

   IT SAYS THE HONEST THING. Not "oops" and not "something went wrong" alone: the sentence
   distinguishes a display failure from a betting-record failure, because the second is the
   one a reader would actually worry about and it is not what happened. Nothing is re-graded
   by a render error. */

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    /* The one place a client crash is currently recorded. `digest` is the server-side hash
       Next assigns so a stack that has been minified in production can still be correlated;
       it is the only identifier available without a reporting service. */
    // eslint-disable-next-line no-console
    console.error("[diamondedge] render error", error?.digest || "", error);
  }, [error]);

  return (
    <main className="nf-wrap">
      <div className="nf-card">
        <svg className="nf-mark" width="46" height="46" viewBox="0 0 32 32" aria-hidden="true">
          <path
            d="M16 3.4 28.6 16 16 28.6 3.4 16Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M16 10.6 21.4 16 16 21.4 10.6 16Z" fill="currentColor" />
        </svg>
        <p className="nf-k">Error</p>
        <h1 className="nf-h">This screen didn&rsquo;t draw.</h1>
        <p className="nf-p">
          Something went wrong rendering the board. Nothing about your record changed — every
          pick stays graded exactly as it was served. Try again, or head back to today.
        </p>
        <button className="nf-btn" type="button" onClick={() => unstable_retry()}>
          Try again
        </button>
        <a className="nf-alt" href="/">
          Go to today&rsquo;s board
        </a>
      </div>
    </main>
  );
}
