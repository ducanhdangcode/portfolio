import { Be_Vietnam_Pro, Playfair_Display, Space_Mono } from "next/font/google";

// Cả ba font đều có subset tiếng Việt
// Sans hình học rất đậm cho tiêu đề và thân chữ
export const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

// Serif tương phản cao, chỉ dùng cho số thứ tự lớn (01, 02…)
export const numeral = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["800", "900"],
  variable: "--font-numeral",
  display: "swap",
});

export const mono = Space_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
