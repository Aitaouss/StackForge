import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "StackForge — create-stackforge-app";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(145deg, #09090b 0%, #0f172a 45%, #064e3b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#6ee7b7",
            marginBottom: 16,
          }}
        >
          create-stackforge-app
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 900 }}>
          Ship full-stack monorepos with shared contracts
        </div>
        <div style={{ fontSize: 26, marginTop: 28, color: "#a1a1aa", maxWidth: 820 }}>
          Next.js · NestJS · Prisma · Zod contracts · Docker · presets · CI
        </div>
      </div>
    ),
    { ...size },
  );
}
