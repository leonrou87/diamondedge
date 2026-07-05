import { ImageResponse } from "next/og";

// Branded app/favicon — modern: a white, soft-cornered diamond on a pure black field.
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
          background: "#000000",
        }}
      >
        <div
          style={{
            width: 296,
            height: 296,
            transform: "rotate(45deg)",
            borderRadius: 84,
            background: "#ffffff",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
