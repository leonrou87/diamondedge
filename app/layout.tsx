import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiamondEdge — Pre-Game Picks",
  description:
    "Pre-game model picks across MLB, NBA, NHL, NFL, and Soccer — spreads, moneylines, totals, predicted scores, and a transparent out-of-fold track record.",
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
