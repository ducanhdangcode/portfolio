// Nén ảnh trong public/ sang WebP trước khi deploy.
// GitHub Pages chỉ phục vụ file tĩnh nên Next.js không tối ưu ảnh lúc chạy được.
// Chạy: npm run images  (chạy lại mỗi khi thêm/đổi ảnh, rồi commit file .webp)
//
// width = chiều rộng tối đa sau khi nén. Lấy khoảng 2× kích thước hiển thị để nét trên màn hình Retina.
import { stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const images = [
  // Ảnh đại diện: hiển thị tối đa ~620px
  { src: "profile-2.png", width: 1400, quality: 85 },
  // Ảnh chụp màn hình điện thoại: hiển thị tối đa ~300px
  { src: "lumilearn1.png", width: 640, quality: 85 },
  { src: "lumilearn2.png", width: 640, quality: 85 },
  // Ảnh chụp màn hình nhiều chữ nhỏ: giữ nguyên kích thước, chất lượng cao để chữ không nhòe
  { src: "repolensx.png", width: 1663, quality: 92 },
];

const dir = "public";
const kb = (n) => `${Math.round(n / 1024)}KB`;

for (const { src, width, quality } of images) {
  const input = join(dir, src);
  const output = join(dir, src.replace(/\.(png|jpe?g)$/i, ".webp"));
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);
  const before = (await stat(input)).size;
  console.log(`${src} → ${output} (${info.width}×${info.height}, ${kb(before)} → ${kb(info.size)})`);
}
