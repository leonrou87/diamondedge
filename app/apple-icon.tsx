import { ImageResponse } from "next/og";

// iOS "Add to Home Screen" tile — same gold diamond on the dark liquid-glass field.
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
          background: "linear-gradient(135deg, #0b0f18 0%, #1a2233 100%)",
        }}
      >
        <div
          style={{
            width: 106,
            height: 106,
            transform: "rotate(45deg)",
            borderRadius: 20,
            background: "linear-gradient(135deg, #f6dd94, #e0ac20)",
            boxShadow: "0 0 26px rgba(224,172,32,0.6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
