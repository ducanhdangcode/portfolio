import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollEffects } from "@/components/ScrollEffects";
import { site } from "@/content/site";
import { mono, numeral, sans } from "@/lib/fonts";
import "./globals.css";

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.intro,
  openGraph: { title, description: site.intro, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Chạy trước khi paint: áp theme đã lưu (không nháy) và bật class js cho hiệu ứng cuộn
const bootScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${sans.variable} ${numeral.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Bỏ qua tới nội dung
        </a>
        <ScrollEffects />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
