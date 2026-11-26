import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { displayFonts as fonts } from "@/lib/og-fonts";

// The preview card shown when the link is shared on LinkedIn, iMessage, Slack, etc.
export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0f0f10",
          color: "#ededeb",
          fontFamily: "Hubot Sans", fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#bababf", fontFamily: "monospace" }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#3fb950" }} />
          {site.location.toLowerCase()} · cs + econ @ pitt
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, lineHeight: 1, letterSpacing: "-0.03em" }}>{site.name}</div>
          <div style={{ display: "flex", alignItems: "flex-end", fontSize: 58, marginTop: 18, color: "#bababf" }}>
            builds software that freelancers pay for.
            <div style={{ width: 26, height: 50, background: "#d9b54a", marginLeft: 8, marginBottom: 8 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 40, fontSize: 26, color: "#a0a0a6", fontFamily: "monospace" }}>
          <span>SWE intern @ PNC ’27</span>
          <span>founder @ FlowFrame</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
