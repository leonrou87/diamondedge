import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiamondEdge — Today's Picks, Games & Results",
  description:
    "Today's story, the bets worth taking, and every pick graded in the open — MLB, NBA, NHL, NFL and Soccer.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DiamondEdge" },
};

// Enable notch/home-indicator safe-area insets; theme colour matches the light
// liquid-glass background (the native shell's StatusBar/webview background keys off this).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef1f7",
  colorScheme: "light",
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
