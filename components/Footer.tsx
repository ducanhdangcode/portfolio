import Link from "next/link";
import { site } from "@/content/site";
import { socialIcons } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="mono">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="footer-links">
          <li>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          {site.socials.map((s) => {
            const Icon = socialIcons[s.icon];
            return (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  <Icon size={14} />
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
        <Link href="/#top" className="footer-top mono">
          Về đầu trang ↑
        </Link>
      </div>
    </footer>
  );
}
