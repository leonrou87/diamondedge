"use client";

/* ═══════════════════ THE LAST BOUNDARY ═══════════════════
   `app/error.tsx` wraps the page. It does NOT wrap the root layout above it, so a throw in the
   layout — the font loader, the metadata, anything in that file — still produces a white
   screen with no boundary underneath it. This is the one that catches those.

   IT REPLACES THE ROOT LAYOUT WHEN ACTIVE, which is why it declares its own <html> and <body>:
   the layout it would have inherited them from is the thing that failed. For the same reason it
   cannot rely on globals.css having been applied — the stylesheet is imported BY that layout —
   so every rule this page needs is inline. That is not a style preference; a class name here
   would resolve to nothing on the failure this file exists for.

   The colours are the product's, written out literally rather than as var(--…) tokens, for the
   same reason: the custom properties are declared in the stylesheet that may not be there. */

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0b0c0e",
          color: "#e9eaec",
          padding: "24px",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <title>Something went wrong — DiamondEdge</title>
        <div style={{ maxWidth: "34ch", textAlign: "center" }}>
          <svg width="46" height="46" viewBox="0 0 32 32" aria-hidden="true" style={{ color: "#a67208" }}>
            <path
              d="M16 3.4 28.6 16 16 28.6 3.4 16Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M16 10.6 21.4 16 16 21.4 10.6 16Z" fill="currentColor" />
          </svg>
          <p
            style={{
              margin: "14px 0 6px",
              fontSize: "11px",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "#8b8f96",
            }}
          >
            DiamondEdge
          </p>
          <h1 style={{ margin: "0 0 10px", fontSize: "22px", lineHeight: 1.25, fontWeight: 600 }}>
            Something went wrong.
          </h1>
          <p style={{ margin: "0 0 20px", fontSize: "14px", lineHeight: 1.55, color: "#a8acb3" }}>
            The app failed to start. Nothing about your record changed — every pick stays graded
            exactly as it was served.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              appearance: "none",
              border: "1px solid #2a2d33",
              background: "#15171a",
              color: "#e9eaec",
              borderRadius: "999px",
              padding: "11px 22px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
