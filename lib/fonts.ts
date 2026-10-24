import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

// Cả ba đều là variable font có subset tiếng Việt: một file cho mọi độ đậm (thay vì một file mỗi weight).
// Chỉ preload chữ tiêu đề và chữ thân (2 font × 2 subset = 4 file); mono tải khi cần, display: swap nên không chặn chữ.

// Tiêu đề: grotesque có trục độ rộng (wdth), dùng bản hẹp + rất đậm cho chữ khổng lồ
export const display = Bricolage_Grotesque({
  subsets: ["latin", "vietnamese"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

// Chữ thân
export const sans = Geist({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

// Nhãn, số liệu, dòng lệnh
export const mono = Geist_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
