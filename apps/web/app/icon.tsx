import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1c1612 0%, #c4813a 100%)",
          borderRadius: 8,
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#f8fafc">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2 6.2 3.1L12 10.4 5.8 7.3 12 4.2z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
