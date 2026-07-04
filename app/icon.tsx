import { ImageResponse } from "next/og";

// Branded app/favicon — gold diamond on the dark liquid-glass field, matching the OG card.
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
          background: "linear-gradient(135deg, #0b0f18 0%, #1a2233 100%)",
        }}
      >
        <div
          style={{
            width: 300,
            height: 300,
            transform: "rotate(45deg)",
            borderRadius: 56,
            background: "linear-gradient(135deg, #f6dd94, #e0ac20)",
            boxShadow: "0 0 70px rgba(224,172,32,0.6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
