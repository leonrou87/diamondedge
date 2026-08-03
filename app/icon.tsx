import { ImageResponse } from "next/og";

/* THE APP ICON — the house mark, knocked out.
   Same geometry as the masthead (see --de-mark in globals.css): a true rhombus outline with a
   solid core. The old icon was a rotated rounded SQUARE — a different shape from the mark it
   was supposed to represent, which is why the brand never felt like one system. Gold on near
   black, flat, no gradient and no bevel. */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
        <svg width="512" height="512" viewBox="0 0 32 32">
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
