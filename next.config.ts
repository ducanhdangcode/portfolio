import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 dùng cho ảnh chân dung ở phần giới thiệu (nét hơn mức mặc định 75)
    qualities: [75, 90],
  },
};

export default nextConfig;
