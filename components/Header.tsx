import Link from "next/link";
import { site } from "@/content/site";
import { Download } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { label: "Giới thiệu", href: "/#about" },
  { label: "Kinh nghiệm", href: "/#experience" },
  { label: "Dự án", href: "/#projects" },
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <nav className="site-nav" aria-label="Chính">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a href={site.cv} className="btn btn-sm btn-secondary" download>
            <Download size={14} />
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
