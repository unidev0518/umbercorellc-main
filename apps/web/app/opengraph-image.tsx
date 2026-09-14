import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "UmberCore | Software, Data, Cloud & AI Consulting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "hsl(24, 22%, 5%)",
          padding: "72px 80px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,129,58,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,165,116,0.14) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #c4813a 0%, #c4a574 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#140f0c" }} />
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#e0b07a",
            }}
          >
            UmberCore
          </span>
        </div>

        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#f4ece4",
            maxWidth: 900,
          }}
        >
          {"Software, Data & AI "}
          <span style={{ color: "#e0b07a" }}>for modern businesses.</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 24,
            color: "rgba(241,245,249,0.5)",
            fontWeight: 400,
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          Technology consulting — design, build, integrate, host, and operate modern systems.
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 52 }}>
          {[
            { value: "Software", label: "Consulting & delivery" },
            { value: "Data", label: "Processing & pipelines" },
            { value: "Cloud", label: "Hosting & infrastructure" },
            { value: "AI", label: "Assisted engineering" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#e0b07a" }}>{s.value}</span>
              <span style={{ fontSize: 14, color: "rgba(241,245,249,0.35)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontSize: 15,
            color: "rgba(241,245,249,0.2)",
            letterSpacing: "0.12em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          umbercore.com
        </div>
      </div>
    ),
    { ...size }
  );
}
