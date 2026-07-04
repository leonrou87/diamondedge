import { ImageResponse } from "next/og";

// Node runtime — fetches the multi-MB pregame_picks payload for the live record.
export const runtime = "nodejs";

// Branded 1200×630 share card — rendered for any DiamondEdge link shared to social/messages.
// Shows the LIVE validated record (social proof) when available; falls back to the tagline.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DiamondEdge — every sports pick graded in the open";

async function getRecord() {
  try {
    const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!SUPA || !KEY) return null;
    const r = await fetch(`${SUPA}/rest/v1/slate_snapshots?key=eq.pregame_picks&select=payload`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 300 },
    });
    const rows = await r.json();
    const vh = rows && rows[0] && rows[0].payload && rows[0].payload.value_record && rows[0].payload.value_record.validated_history;
    const mp = (vh && vh.median_price) || {};
    if (mp.hit == null) return null;
    return { hit: Number(mp.hit), roi: mp.roi != null ? Number(mp.roi) : null, n: vh.bets_graded ? Number(vh.bets_graded) : null };
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const rec = await getRecord();
  const stat = rec
    ? `${(rec.hit * 100).toFixed(1)}% winners${rec.n ? ` · ${rec.n.toLocaleString()} graded picks` : ""}${rec.roi != null ? ` · ${rec.roi >= 0 ? "+" : ""}${(rec.roi * 100).toFixed(0)}% return` : ""}`
    : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1000px 500px at 100% -10%, rgba(224,172,32,0.18), transparent 60%), linear-gradient(135deg, #0b0f18 0%, #141b28 100%)",
          color: "#f0f4fa",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
          <div style={{ width: 64, height: 64, transform: "rotate(45deg)", borderRadius: 14, background: "linear-gradient(135deg, #f6dd94, #e0ac20)", boxShadow: "0 0 40px rgba(224,172,32,0.5)" }} />
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: "-1px" }}>
            <span>Diamond</span>
            <span style={{ color: "#e0ac20" }}>Edge</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
            Every pick, graded in the open.
          </div>
          {stat ? (
            <div style={{ display: "flex", fontSize: 40, color: "#e0ac20", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>{stat}</div>
          ) : (
            <div style={{ display: "flex", fontSize: 34, color: "#8fa0b8", fontFamily: "Arial, sans-serif", maxWidth: 900 }}>The story, the bets worth taking, and every call graded against the final score.</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#e0ac20", fontFamily: "Arial, sans-serif", fontWeight: 700, letterSpacing: "3px" }}>
          DIAMONDEDGE.KYTEPUSH.COM
        </div>
      </div>
    ),
    { ...size }
  );
}
