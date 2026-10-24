import type { Metadata, Viewport } from "next";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ParticleField } from "@/components/ParticleField";
import { ScrollEffects } from "@/components/ScrollEffects";
import { SmoothScroll } from "@/components/SmoothScroll";
import { TechIcon, TechSprite } from "@/components/TechIcon";
import { site, type TechIconName } from "@/content/site";
import { display, mono, sans } from "@/lib/fonts";
import "./globals.css";

const title = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.intro,
  openGraph: { title, description: site.intro, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

// Chạy trước khi paint: áp theme đã lưu (không nháy), bật class js cho hiệu ứng cuộn,
// và bật màn mở đầu (intro-on) cho lần đầu vào trang trong phiên này (tải lại / quay lại không chạy nữa)
const bootScript = `var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(!sessionStorage.getItem("intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("intro-on");sessionStorage.setItem("intro","1")}}catch(e){}`;

// Lời chào chạy lần lượt trong màn mở đầu; từ cuối giữ lại tới khi màn kéo lên
const greetings = ["Xin chào", "Hello", "Bonjour", "Hola", "Ciao", "Hallo", "Xin chào"];

// Nhãn công nghệ bay quanh quả cầu đồ thị: hai mục đầu của mỗi nhóm.
// Dựng ở server rồi truyền vào ParticleField, nên dữ liệu icon không nằm trong bundle JS.
const graphLabels = site.tech
  .flatMap((g): { name: string; icon: TechIconName }[] => g.items.slice(0, 2))
  .map((t) => (
    <span key={t.name} className="graph-label">
      <TechIcon name={t.icon} size={14} />
      {t.name}
    </span>
  ));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <TechSprite />
        {/* Màn mở đầu (~1 giây rồi kéo lên): chỉ là lớp phủ, nội dung trang vẫn hiển thị và tải bên dưới
            ngay từ đầu nên không làm chậm LCP. Bộ đếm 0→100 chạy bằng CSS (@property). */}
        <div className="intro" aria-hidden="true">
          <div className="intro-panel">
            <p className="intro-top mono">
              <span>{site.name}</span>
              <span>Portfolio © {new Date().getFullYear()}</span>
            </p>
            <p className="intro-words">
              {greetings.map((w, i) => (
                <span key={i} style={{ "--w": i } as React.CSSProperties}>
                  {w}
                </span>
              ))}
            </p>
            <p className="intro-count" />
            <span className="intro-bar" />
          </div>
        </div>
        <a href="#main" className="skip-link">
          Bỏ qua tới nội dung
        </a>
        {/* Nền 3D cố định phía sau mọi thứ */}
        <ParticleField>{graphLabels}</ParticleField>
        <SmoothScroll />
        <ScrollEffects />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Cursor />
      </body>
    </html>
  );
}
