import { ImageResponse } from "next/og";

// Icon cho iOS "Thêm vào màn hình chính" — cùng hình với app/icon.svg
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1F4B3A",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64">
          <path
            d="M14 17l13 15-13 15"
            fill="none"
            stroke="#C9A86A"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M33 47h17" fill="none" stroke="#F7F4EE" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
