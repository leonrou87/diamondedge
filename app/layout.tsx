import type { Metadata, Viewport } from "next";
import "./globals.css";

const DESC =
  "Today's story, the bets worth taking, and every pick graded in the open — MLB, NBA, NHL, NFL and Soccer.";

export const metadata: Metadata = {
  metadataBase: new URL("https://diamondedge.kytepush.com"),
  title: "DiamondEdge — Today's Picks, Games & Results",
  description: DESC,
  applicationName: "DiamondEdge",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "DiamondEdge" },
  // Rich share cards — the opengraph-image.tsx route supplies the branded image automatically.
  openGraph: {
    type: "website",
    siteName: "DiamondEdge",
    title: "DiamondEdge — every sports pick graded in the open",
    description: DESC,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DiamondEdge — every sports pick graded in the open",
    description: DESC,
  },
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
