import type { Metadata } from "next";
import RedirectClient from "./redirect-client";
/* ONE GAME, NOT THE WHOLE BOARD. This used to read
   slate_snapshots?key=eq.pregame_picks&select=payload straight from Supabase on
   a 300 s TTL — 286,840 gzipped bytes to name two teams. See game-source.ts. */
import { getGame } from "./game-source";

const SPORT: Record<string, string> = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };

// Per-game <title>/description; the og:image is supplied by opengraph-image.tsx in this segment.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const g = await getGame(id);
  const mu = g ? `${g.away_team || g.away_abbr} @ ${g.home_team || g.home_abbr}` : "DiamondEdge";
  const sport = g ? (SPORT[g.sport] || g.sport || "") : "";
  const title = g ? `${g.away_abbr} @ ${g.home_abbr} — DiamondEdge` : "DiamondEdge — Today's Picks";
  const description = g
    ? `DiamondEdge's read on ${mu}${sport ? ` (${sport})` : ""} — every pick graded in the open.`
    : "Today's story, the bets worth taking, and every pick graded in the open.";
  return {
    title,
    description,
    openGraph: { type: "website", siteName: "DiamondEdge", title, description, url: `/g/${id}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RedirectClient id={id} />;
}
