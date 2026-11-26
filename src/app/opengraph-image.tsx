import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { displayFonts as fonts } from "@/lib/og-fonts";

// The preview card shown when the link is shared on LinkedIn, iMessage, Slack, etc.
export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Read once at module scope so the card is generated at build time.
const photo = site.photo
  ? `data:image/jpeg;base64,${await readFile(join(process.cwd(), "public", site.photo), "base64")}`
  : null;

export default async function OpenGraphImage() {
  const [first, ...rest] = site.name.split(" ");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "stretch",
          gap: 64,
          padding: "64px 72px",
          background: "#0f0f10",
          color: "#ededeb",
          fontFamily: "Hubot Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 500, color: "#a0a0a6" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: "#d9b54a" }} />
            {site.location} · CS + Econ at Pitt
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 124, fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.04em" }}>{first}</div>
            <div style={{ fontSize: 124, fontWeight: 700, lineHeight: 0.92, letterSpacing: "-0.04em" }}>{rest.join(" ")}</div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 500, lineHeight: 1.2, marginTop: 28, color: "#bababf" }}>
              Builds software that freelancers pay for.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 24, fontWeight: 500, color: "#a0a0a6" }}>
            <span>Incoming SWE intern @ PNC, summer 2027</span>
            <span>Founder @ FlowFrame</span>
          </div>
        </div>
        {photo ? (
          <img src={photo} alt="" width={400} height={500} style={{ objectFit: "cover", border: "1px solid #26262a" }} />
        ) : null}
      </div>
    ),
    { ...size, fonts },
  );
}
