import type { Metadata } from "next";
import RedirectClient from "./redirect-client";

const SPORT: Record<string, string> = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };

async function getGame(id: string) {
  try {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA || !KEY) return null;
    const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.pregame_picks&select=payload`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 300 },
    });
    const rows = await r.json();
    const games = (rows && rows[0] && rows[0].payload && rows[0].payload.games) || [];
    return games.find((g: any) => String(g.game_id) === String(id)) || null;
  } catch {
    return null;
  }
}

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
