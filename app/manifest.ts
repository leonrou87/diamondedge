import type { MetadataRoute } from "next";

// PWA manifest — makes DiamondEdge installable (Android/desktop) in standalone chrome with the
// branded icons (app/icon.tsx, app/apple-icon.tsx).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DiamondEdge — Today's Picks, Games & Results",
    short_name: "DiamondEdge",
    description:
      "Today's story, the bets worth taking, and every MLB pick graded in the open — win or lose, in public.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    // The splash is the PAGE (the light field the board sits on); the theme colour is the
    // MASTHEAD, which is the surface that meets the system chrome. They are two different
    // surfaces and they were both set to the same wrong value. See app/layout.tsx.
    background_color: "#f8fbff",
    theme_color: "#131a28",
    categories: ["sports"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
