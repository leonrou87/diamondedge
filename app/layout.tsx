import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ── MODERN TYPE SYSTEM (self-hosted via next/font — zero runtime requests) ──
// Space Grotesk = display/headers/UI chrome · Inter = body/UI text ·
// JetBrains Mono = tabular figures (lines, odds, records, scores).
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-disp",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jetmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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

// Enable notch/home-indicator safe-area insets; theme colour matches the dark
// liquid-glass background (the native shell's StatusBar/webview background keys off this).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b111e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${inter.variable} ${jetmono.variable}`}
    >
      <body>{children}        <script defer src="https://kytepush.com/track.js"></script>
      </body>
    </html>
  );
}
