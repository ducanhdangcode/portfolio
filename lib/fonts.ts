import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

// Cả ba font đều có subset tiếng Việt
export const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Geist({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const mono = Geist_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
});
