import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TravelGuards LLC | Drone Products & Accessories";
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
          background: "hsl(204, 62%, 97%)",
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
            background: "radial-gradient(circle, rgba(30,136,229,0.22) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(14,116,184,0.16) 0%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 44 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg, #1565c0 0%, #29b6f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#f4f9fd" }} />
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#0d3b66",
            }}
          >
            TravelGuards
          </span>
        </div>

        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#0d3b66",
            maxWidth: 900,
          }}
        >
          {"Drone products & "}
          <span style={{ color: "#1574c8" }}>accessories.</span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 24,
            color: "rgba(13,59,102,0.62)",
            fontWeight: 400,
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          Retail sales of drone products, accessories, and related merchandise.
        </div>

        <div style={{ display: "flex", gap: 40, marginTop: 52 }}>
          {[
            { value: "Drones", label: "Consumer products" },
            { value: "Accessories", label: "Related items" },
            { value: "Sourcing", label: "Availability help" },
            { value: "Orders", label: "By inquiry" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#1574c8" }}>{s.value}</span>
              <span style={{ fontSize: 14, color: "rgba(13,59,102,0.5)", fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontSize: 15,
            color: "rgba(13,59,102,0.35)",
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
