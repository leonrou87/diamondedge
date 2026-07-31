import type { Metadata, Viewport } from "next";
import { Outfit, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ══ TYPE SYSTEM v2 — "ROUNDED GEOMETRIC" (self-hosted via next/font, zero runtime requests) ══
// WHY THE CHANGE: Bricolage Grotesque is a CONDENSED, high-contrast display face. Set at the
// 8–11px label sizes this app lives in, its narrow counters and thin joins mush together —
// that is the "billboard sport font" that "seems kind of blurry". Replaced with a pair whose
// skeletons are open circles, not compressed ovals:
//
//   OUTFIT   → display. Purely geometric, near-perfect circular bowls, uniform stroke weight,
//              very low contrast. Wide apertures survive tracking and small sizes without
//              filling in, and at 30–58px (scores, headlines, the pick) it reads confident
//              and modern rather than shouty. This is the "curved font".
//   FIGTREE  → body + all UI text. Geometric-humanist with a tall x-height and softly rounded
//              terminals — at 13–17px it is materially more legible than Inter's tighter,
//              more neutral fit, and it shares Outfit's circular skeleton so the two never
//              look like two families. Easy on the eyes is literally its design brief.
//   JETBRAINS MONO → figures only (lines, odds, records, scores). Kept: its tabular numerals
//              are what make the number columns align, and it stays crisp at 12px.
//
// All three are VARIABLE fonts, so every weight the CSS asks for (200–900) is a real master —
// no synthetic/faux bold, which is itself a source of smeared strokes.
// General Sans was evaluated and ruled out: Fontshare-only, so it cannot be self-hosted
// through next/font/google, and shipping the binaries by hand reintroduces the FOUT risk.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-disp",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
const jetmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
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
      className={`${outfit.variable} ${figtree.variable} ${jetmono.variable}`}
    >
      <body>{children}        <script defer src="https://kytepush.com/track.js"></script>
      </body>
    </html>
  );
}
