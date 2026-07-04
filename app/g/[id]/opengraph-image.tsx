import { ImageResponse } from "next/og";

// Node runtime (not edge) — the pregame_picks payload is multi-MB; edge choked and fell back.
export const runtime = "nodejs";

// Per-game share card — a shared /g/<id> link unfurls to THIS game's matchup (+ our totals pick).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DiamondEdge game";

const SPORT: Record<string, string> = { mlb: "MLB", nba: "NBA", nhl: "NHL", nfl: "NFL", soccer: "Soccer" };

async function getGame(id: string) {
  try {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA || !KEY) return null;
    const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.pregame_picks&select=payload`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      cache: "no-store",
    });
    const rows = await r.json();
    const games = (rows && rows[0] && rows[0].payload && rows[0].payload.games) || [];
    return games.find((g: any) => String(g.game_id) === String(id)) || null;
  } catch {
    return null;
  }
}

// Totals only (the validated edge) — never surface a spread/ML lean on the share card.
function totalPick(g: any) {
  const t = g && g.de_plays && g.de_plays.total;
  if (t && String(t.action).toUpperCase() === "TAKE" && t.side) return { side: String(t.side), line: t.line };
  const dp = g && g.display_pick;
  if (dp && String(dp.action).toUpperCase() === "TAKE" && dp.market === "total" && dp.side) return { side: String(dp.side), line: dp.line };
  return null;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await getGame(id);
  const mu = g ? `${g.away_abbr} @ ${g.home_abbr}` : "DiamondEdge";
  const sport = g ? (SPORT[g.sport] || g.sport || "") : "";
  const pick = g ? totalPick(g) : null;
  const pickTxt = pick ? `${pick.side}${pick.line != null && !/[0-9.]/.test(pick.side) ? " " + pick.line : ""}` : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "78px",
          background:
            "radial-gradient(1000px 500px at 100% -10%, rgba(224,172,32,0.18), transparent 60%), linear-gradient(135deg, #0b0f18 0%, #141b28 100%)",
          color: "#f0f4fa",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div style={{ width: 52, height: 52, transform: "rotate(45deg)", borderRadius: 12, background: "linear-gradient(135deg, #f6dd94, #e0ac20)", boxShadow: "0 0 34px rgba(224,172,32,0.5)" }} />
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
            <span>Diamond</span>
            <span style={{ color: "#e0ac20" }}>Edge</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sport ? <div style={{ display: "flex", fontSize: 30, color: "#8fa0b8", fontFamily: "Arial, sans-serif", letterSpacing: "3px", fontWeight: 700 }}>{String(sport).toUpperCase()}</div> : null}
          <div style={{ display: "flex", fontSize: 86, fontWeight: 800, lineHeight: 1.05 }}>{mu}</div>
          {pickTxt ? <div style={{ display: "flex", alignItems: "center", fontSize: 46, color: "#e0ac20", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>DiamondEdge Pick: {pickTxt}</div> : null}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8fa0b8", fontFamily: "Arial, sans-serif" }}>Every pick graded in the open · diamondedge.kytepush.com</div>
      </div>
    ),
    { ...size }
  );
}
