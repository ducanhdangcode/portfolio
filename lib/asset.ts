// Thêm basePath cho file trong public/ (ảnh, CV…) khi deploy lên GitHub Pages.
// Link giữa các trang dùng next/link nên đã tự có basePath, không cần hàm này.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
