"use client";
import { useEffect } from "react";

// Humans who open /g/<id> get redirected into the app focused on that game (?g=<id>).
// Crawlers don't run JS, so they read the server-rendered per-game OG metadata first.
export default function RedirectClient({ id }: { id: string }) {
  useEffect(() => {
    try { window.location.replace(`/?g=${encodeURIComponent(id)}`); } catch {}
  }, [id]);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", color: "#4a5568", background: "#eef1f7" }}>
      <span>Opening DiamondEdge…</span>
    </div>
  );
}
