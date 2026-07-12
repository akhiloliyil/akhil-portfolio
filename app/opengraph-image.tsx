import { ImageResponse } from "next/og";
import { profile } from "@/data/content";

// Social share preview (1200×630). Rendered on the design-canvas dark theme.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.title}`;

const ACCENT = "#7A91FF";
const INK = "#E9EDF5";
const MUTED = "#969FB4";
const BG = "#0B0E16";
const handle = (pos: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  width: 18,
  height: 18,
  border: `3px solid ${ACCENT}`,
  background: BG,
  display: "flex",
  ...pos,
});

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
          background: BG,
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* grid backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(233,237,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(233,237,245,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: ACCENT,
            opacity: 0.16,
            display: "flex",
          }}
        />
        {/* selection-frame corner handles */}
        <div style={handle({ top: 36, left: 36 })} />
        <div style={handle({ top: 36, right: 36 })} />
        <div style={handle({ bottom: 36, left: 36 })} />
        <div style={handle({ bottom: 36, right: 36 })} />

        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <div
            style={{
              display: "flex",
              color: ACCENT,
              fontSize: 26,
              letterSpacing: 8,
              fontFamily: "monospace",
            }}
          >
            PORTFOLIO — DUBAI, UAE
          </div>
          <div
            style={{
              display: "flex",
              color: INK,
              fontSize: 104,
              fontWeight: 700,
              marginTop: 18,
              letterSpacing: -3,
            }}
          >
            {profile.name}
          </div>
          <div style={{ display: "flex", color: MUTED, fontSize: 36, marginTop: 14 }}>
            {profile.title}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 44 }}>
            {["AI-Driven Experiences", "Design Systems", "React · Next.js"].map(
              (t) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    border: "1px solid rgba(233,237,245,0.16)",
                    color: MUTED,
                    padding: "10px 18px",
                    borderRadius: 6,
                    fontSize: 22,
                    fontFamily: "monospace",
                  }}
                >
                  {t}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
