import { ImageResponse } from "next/og";
import { displayFonts as fonts } from "@/lib/og-fonts";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Browser-tab icon: "ae" monogram with the gold cursor.
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 12,
          background: "#0f0f10",
          borderRadius: 14,
          color: "#ededeb",
          fontFamily: "Hubot Sans", fontWeight: 700,
          fontSize: 44,
          lineHeight: 1,
        }}
      >
        ae
        <div style={{ width: 7, height: 26, background: "#d9b54a", marginLeft: 2, marginBottom: 3 }} />
      </div>
    ),
    { ...size, fonts },
  );
}
