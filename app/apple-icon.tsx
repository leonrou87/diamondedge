import { ImageResponse } from "next/og";

/* iOS "Add to Home Screen" tile — the same house mark as the favicon and the masthead.
   One geometry everywhere; see the note in icon.tsx. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07090f",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path
            d="M16 3.4 28.6 16 16 28.6 3.4 16Z"
            fill="none"
            stroke="#f5be42"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M16 10.6 21.4 16 16 21.4 10.6 16Z" fill="#f5be42" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
