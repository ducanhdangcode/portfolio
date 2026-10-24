import Link from "next/link";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";
import { Clock } from "./Clock";
import { Download } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

export const nav = [
  { label: "Giới thiệu", href: "/#about" },
  { label: "Stack", href: "/#stack" },
  { label: "Kinh nghiệm", href: "/#experience" },
  { label: "Dự án", href: "/#projects" },
  { label: "Liên hệ", href: "/#contact" },
];

const initials = site.name
  .split(" ")
  .slice(-2)
  .map((w) => w[0])
  .join("");

export function Header() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="brand" aria-label={`${site.name} — về đầu trang`}>
            <span className="brand-mark" aria-hidden="true">
              {initials}
            </span>
            <span className="brand-name">{site.name}</span>
          </Link>
          <div className="header-actions">
            <span className="header-clock mono" aria-label="Giờ Hà Nội">
              HN <Clock timeZone={site.timeZone} />
            </span>
            <ThemeToggle />
            <a href={asset(site.cv)} className="btn btn-sm btn-primary" download>
              <Download size={14} />
              Resume
            </a>
          </div>
        </div>
      </header>

      {/* Desktop: nằm giữa header. Mobile: dock nổi ở đáy, chỉ hiện số, mục đang xem bung nhãn.
          data-nav: ScrollEffects đánh dấu mục ứng với section đang ở giữa màn hình */}
      <nav className="dock" aria-label="Chính">
        {nav.map((item, i) => (
          <Link key={item.href} href={item.href} data-nav={item.href.split("#")[1]}>
            <span className="dock-num mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="dock-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
