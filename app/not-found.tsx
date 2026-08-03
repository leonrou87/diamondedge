import type { Metadata } from "next";
import Link from "next/link";

/* ═══════════════════ THE 404 ═══════════════════
   There wasn't one. A missing route fell through to Next's stock page — Times New Roman,
   "404 | This page could not be found", on white. Every shared /g/<id> link that goes stale
   lands there, which makes it a surface real readers see, wearing somebody else's design.

   It is the house now, and it is deliberately small: the mark, one sentence in the product's
   own voice, and the single door back. No illustration, no apology, no "oops". The board is
   the app, so the board is where the button goes. */

export const metadata: Metadata = {
  title: "Not found — DiamondEdge",
  description: "That page isn't here. The board is.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
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
        <p className="nf-k">404</p>
        <h1 className="nf-h">This page isn&rsquo;t here.</h1>
        <p className="nf-p">
          The link may be old, or the game may have rolled off the board. Everything we have
          called today is one tap away.
        </p>
        <Link className="nf-btn" href="/">
          Go to today&rsquo;s board
        </Link>
      </div>
    </main>
  );
}
