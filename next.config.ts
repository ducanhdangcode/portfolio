import type { NextConfig } from "next";

// GitHub Pages: trang dự án nằm ở https://<user>.github.io/<repo>/ nên cần basePath "/<repo>".
// Workflow truyền vào qua PAGES_BASE_PATH; build ở máy (không đặt biến) thì basePath rỗng.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Xuất trang tĩnh ra thư mục out/ (GitHub Pages chỉ phục vụ file tĩnh)
  output: "export",
  basePath,
  // /projects/abc/ → out/projects/abc/index.html, chạy ổn trên GitHub Pages
  trailingSlash: true,
  images: {
    // Không có server để tối ưu ảnh lúc chạy; ảnh đã được nén sẵn bằng `npm run images`
    unoptimized: true,
  },
  env: {
    // Dùng trong lib/asset.ts cho ảnh và file tĩnh (next/image và thẻ <a> không tự thêm basePath)
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
