import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiamondEdge — Scores, Lines & Plays",
  description:
    "Live scores, Vegas lines and the DiamondEdge Play across MLB, NBA, NHL, NFL, and Soccer — spread, total and moneyline calls with a transparent track record.",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "DiamondEdge" },
};

// Enable notch/home-indicator safe-area insets and a native-feeling theme colour.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c2340",
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
