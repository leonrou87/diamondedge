import { ImageResponse } from "next/og";

// iOS "Add to Home Screen" tile — modern white soft-cornered diamond on pure black.
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
          background: "#000000",
        }}
      >
        <div
          style={{
            width: 104,
            height: 104,
            transform: "rotate(45deg)",
            borderRadius: 30,
            background: "#ffffff",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
