import type { MetadataRoute } from "next";

// PWA manifest — makes DiamondEdge installable (Android/desktop) in standalone chrome with the
// branded icons (app/icon.tsx, app/apple-icon.tsx).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DiamondEdge — Today's Picks, Games & Results",
    short_name: "DiamondEdge",
    description:
      "Today's story, the bets worth taking, and every pick graded in the open — MLB, NBA, NHL, NFL and Soccer.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eef1f7",
    theme_color: "#eef1f7",
    categories: ["sports"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
