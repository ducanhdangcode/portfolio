import Image from "next/image";
import { Download, factIcons, socialIcons } from "@/components/icons";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TechIcon } from "@/components/TechIcon";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

const delay = (i: number) => ({ "--d": i }) as React.CSSProperties;

export default function Home() {
  return (
    <>
      {/* ───────── 1 · Ảnh + thông tin cá nhân ───────── */}
      <section id="about" className="intro" aria-labelledby="intro-title">
        <span className="deco-circle deco-circle-hero" aria-hidden="true" />
        <div className="container">
          {/* Chữ "Port / Folio." khổng lồ đè lên ảnh, chỉ để trang trí */}
          <div className="hero">
            <p className="hero-word hero-word-top enter" style={delay(0)} aria-hidden="true">
              <span className="hero-pill" />
              Port
              <span className="hero-underline" />
            </p>
            <div
              className="hero-photo enter"
              style={{ ...delay(1), aspectRatio: `${site.photoSize.width} / ${site.photoSize.height}` }}
            >
              <Image
                src={asset(site.photo)}
                alt={site.photoAlt}
                width={site.photoSize.width}
                height={site.photoSize.height}
                priority
              />
            </div>
            <p className="hero-word hero-word-bottom enter" style={delay(2)} aria-hidden="true">
              Folio.
            </p>
            <p className="hero-role mono enter" style={delay(3)}>
              {site.role}
            </p>
          </div>

          <div className="intro-inner">
            <div className="intro-info">
              <p className="eyebrow enter" style={delay(3)}>
                <span className="eyebrow-num">01</span>
                Giới thiệu
                <span className="eyebrow-rule" aria-hidden="true" />
              </p>
              <h1 id="intro-title" className="enter" style={delay(4)}>
                <span className="intro-hello">Xin chào, mình là</span>
                <span className="intro-name">{site.name}</span>
              </h1>
              <p className="intro-role mono enter" style={delay(5)}>
                {site.role} <span aria-hidden="true">·</span> {site.location}
              </p>
              <p className="intro-text enter" style={delay(6)}>
                {site.intro}
              </p>

              <div className="intro-contact enter" style={delay(7)}>
                <div className="intro-actions">
                  <a href={asset(site.cv)} className="btn btn-primary btn-lg" download>
                    <Download size={16} />
                    Tải CV (PDF)
                  </a>
                  <ul className="socials" aria-label="Mạng xã hội">
                    {site.socials.map((s) => {
                      const Icon = socialIcons[s.icon];
                      return (
                        <li key={s.href}>
                          <a
                            href={s.href}
                            className="icon-btn icon-btn-bordered"
                            aria-label={s.label}
                            data-tip={s.label}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Icon size={17} />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="board facts-board enter" style={delay(6)}>
              <span className="board-prompt mono" aria-hidden="true">
                &gt;_
              </span>
              <dl className="facts">
                {site.facts.map((f) => {
                  const Icon = factIcons[f.icon];
                  return (
                    <div key={f.label}>
                      <dt>
                        <span className="fact-icon" aria-hidden="true">
                          <Icon size={18} />
                        </span>
                        <span className="fact-label">{f.label}</span>
                      </dt>
                      <dd>{f.value}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          <div className="tech" data-reveal>
            <p className="tech-title">
              Ngôn ngữ & framework sử dụng
              <span className="tech-dots" aria-hidden="true" />
            </p>
            <div className="tech-groups" data-stagger>
              {site.tech.map((g, i) => (
                <div key={g.group} className="tech-group">
                  <div className="tech-group-head">
                    <span className="tech-group-num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{g.group}</h3>
                  </div>
                  <ul className="tech-items">
                    {g.items.map((t) => (
                      <li key={t.name}>
                        <TechIcon name={t.icon} size={26} />
                        {t.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2 · Kinh nghiệm ───────── */}
      <section id="experience" className="section" aria-labelledby="experience-title">
        <span className="deco-circle deco-circle-left" aria-hidden="true" />
        <div className="container">
          {/* Bảng viền bo góc: tiêu đề nằm trong bảng, mỗi dòng là một vị trí */}
          <div className="board exp-board" data-reveal>
            <span className="board-prompt mono" aria-hidden="true">
              &gt;_
            </span>
            <SectionHeader
              id="experience-title"
              index="02"
              eyebrow="Experience"
              title="Kinh nghiệm làm việc"
            />
            <ol className="exp-list">
              {site.experience.map((job) => (
                <li key={job.company + job.period} className="exp-row">
                  <div className="exp-when">
                    <p className="exp-period">{job.period}</p>
                    <p className="exp-sub">{job.type}</p>
                  </div>
                  <div className="exp-where">
                    <p className="exp-company">{job.company}</p>
                    <p className="exp-sub">{job.location}</p>
                  </div>
                  <article className="exp-what">
                    <h3>{job.role}</h3>
                    <ul className="exp-bullets">
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <ul className="tags" aria-label="Tech stack">
                      {job.stack.map((t) => (
                        <li key={t} className="tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── 3 · Dự án cá nhân ───────── */}
      <section id="projects" className="section section-alt" aria-labelledby="projects-title">
        <span className="deco-circle deco-circle-right" aria-hidden="true" />
        <div className="container">
          <SectionHeader
            id="projects-title"
            index="03"
            eyebrow="Projects"
            title="Dự án cá nhân"
            lead="Vấn đề kỹ thuật gặp phải, cách giải quyết và con số đo được."
            variant="code"
          />
          <div className="project-list">
            {projects.map((p, i) => (
              <div key={p.slug} data-reveal>
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
