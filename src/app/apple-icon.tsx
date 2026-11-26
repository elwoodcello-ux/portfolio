import { ImageResponse } from "next/og";
import { displayFonts as fonts } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon on iPhone / iPad.
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 40,
          background: "#0f0f10",
          color: "#ededeb",
          fontFamily: "Hubot Sans", fontWeight: 700,
          fontSize: 120,
          lineHeight: 1,
        }}
      >
        ae
        <div style={{ width: 18, height: 70, background: "#d9b54a", marginLeft: 6, marginBottom: 8 }} />
      </div>
    ),
    { ...size, fonts },
  );
}
