import Link from "next/link";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";
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
              <span className="roll">
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a href={asset(site.cv)} className="btn btn-sm btn-secondary" download>
            <Download size={14} />
            <span className="roll">
              <span>Resume</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
