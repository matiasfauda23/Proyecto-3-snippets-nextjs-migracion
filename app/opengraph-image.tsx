import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen de Open Graph generada en build. Reutiliza la paleta de
 * `globals.css` para no introducir una identidad visual distinta a la del
 * proyecto original.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#f4f6f8",
          color: "#17202a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "72px",
            height: "8px",
            borderRadius: "6px",
            backgroundColor: "#111827",
            marginBottom: "40px",
          }}
        />
        <div style={{ fontSize: "84px", fontWeight: 700, lineHeight: 1.1 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: "38px",
            marginTop: "28px",
            color: "#4b5563",
            maxWidth: "900px",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  );
}
