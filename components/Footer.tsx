import Link from "next/link";
import { site } from "@/content/site";
import { Clock } from "./Clock";
import { socialIcons } from "./icons";

const nav = [
  { label: "Giới thiệu", href: "/#about" },
  { label: "Kinh nghiệm", href: "/#experience" },
  { label: "Dự án", href: "/#projects" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-name">{site.name}</p>
            <p>{site.role}</p>
            <p className="footer-note">{site.availableText} — full-time hoặc freelance.</p>
          </div>

          <nav aria-label="Chân trang">
            <p className="footer-title">Điều hướng</p>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="footer-title">Liên hệ</p>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>{site.location}</li>
              <li className="mono">
                <Clock timeZone={site.timeZone} /> GMT+7
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-title">Mạng xã hội</p>
            <ul>
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <li key={s.href}>
                    <a href={s.href} className="footer-social" target="_blank" rel="noreferrer">
                      <Icon size={14} />
                      {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built with Next.js</p>
        </div>
      </div>
    </footer>
  );
}
