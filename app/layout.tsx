import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiamondEdge — MLB Mid-Game Model",
  description:
    "Live MLB mid-game score predictions, betting recommendations, and the model's inning-by-inning read on every game.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}        <script defer src="https://kytepush.com/track.js"></script>
      </body>
    </html>
  );
}
