import Image from "next/image";
import { Fragment } from "react";
import { Download, factIcons, socialIcons } from "@/components/icons";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SplitChars } from "@/components/SplitChars";
import { TechIcon } from "@/components/TechIcon";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

const delay = (i: number) => ({ "--d": i }) as React.CSSProperties;

const roleLine = `${site.role} · ${site.location}`;
const introWords = site.intro.split(" ");
const stats = [
  { label: "Vị trí đã đảm nhận", value: site.experience.length },
  { label: "Dự án cá nhân", value: projects.length },
  { label: "Công nghệ sử dụng", value: site.tech.reduce((n, g) => n + g.items.length, 0) },
];

export default function Home() {
  return (
    <>
      {/* ───────── 1 · Ảnh + thông tin cá nhân ───────── */}
      <section id="about" className="intro" aria-labelledby="intro-title">
        <span className="deco-circle deco-circle-hero" aria-hidden="true" />
        <div className="container">
          {/* Chữ "Port / Folio." khổng lồ đè lên ảnh, chỉ để trang trí */}
          {/* data-scroll-y: --sy = số px đã cuộn, để chữ tách ra và ảnh trôi khi cuộn */}
          <div className="hero" data-scroll-y>
            <p className="hero-word hero-word-top enter" style={delay(0)} aria-hidden="true">
              <span className="hero-pill" />
              <SplitChars text="Port" />
              <span className="hero-underline" />
            </p>
            <span className="hero-glow" aria-hidden="true" />
            <div
              className="hero-photo enter"
              style={{ ...delay(1), aspectRatio: `${site.photoSize.width} / ${site.photoSize.height}` }}
              data-cursor="lg"
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
              <SplitChars text="Folio." />
            </p>
            <p className="hero-role mono enter" style={delay(3)}>
              {site.role}
            </p>
          </div>

        </div>

        {/* Hai dải chữ bắt chéo, chạy ngược chiều nhau */}
        <div className="marquee" aria-hidden="true">
          {(["outline", "solid"] as const).map((kind) => (
            <div key={kind} className={`marquee-band marquee-band-${kind}`}>
              <div className="marquee-track">
                {[0, 1, 2, 3].map((copy) => (
                  <span key={copy} className="marquee-group">
                    {site.marquee.map((word) => (
                      <span key={word}>
                        {word}
                        <i>✦</i>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="container">
          {/* Các con có class rv hiện lần lượt theo --d khi khối cuộn tới */}
          <div className="intro-inner" data-reveal data-scroll>
            <span className="intro-ghost" aria-hidden="true">
              01
            </span>
            <div className="intro-info">
              <p className="eyebrow rv" style={delay(0)}>
                <span className="eyebrow-num">01</span>
                Giới thiệu
                <span className="eyebrow-rule" aria-hidden="true" />
              </p>
              <h1 id="intro-title">
                <span className="intro-hello rv" style={delay(1)}>
                  Xin chào, mình là
                </span>
                <span className="intro-name" data-cursor="lg">
                  <SplitChars text={`${site.name}.`} />
                </span>
              </h1>
              <p className="intro-role mono rv" style={delay(3)}>
                <span className="sr-only">{roleLine}</span>
                <span aria-hidden="true" data-scramble={roleLine}>
                  {roleLine}
                </span>
              </p>
              <p className="intro-text rv" style={{ ...delay(4), "--n": introWords.length } as React.CSSProperties} data-scrub>
                {introWords.map((w, i) => (
                  <Fragment key={i}>
                    {i > 0 && " "}
                    <span className="scrub-word" style={{ "--w": i } as React.CSSProperties}>
                      {w}
                    </span>
                  </Fragment>
                ))}
              </p>

              <div className="intro-contact rv" style={delay(5)}>
                <div className="intro-actions">
                  <a href={asset(site.cv)} className="btn btn-primary btn-lg" download data-magnetic>
                    <Download size={16} />
                    <span className="roll">
                      <span>Tải CV (PDF)</span>
                    </span>
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
                            data-magnetic
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

            <div className="board facts-board rv" style={delay(2)} data-spotlight data-tilt>
              <span className="board-prompt mono" aria-hidden="true">
                &gt;<span className="caret">_</span>
              </span>
              <dl className="facts" data-stagger>
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
              {/* Số liệu tính từ nội dung thật, đếm tăng dần khi hiện */}
              <dl className="stat-row" data-stagger>
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd data-count={s.value}>{String(s.value).padStart(2, "0")}</dd>
                  </div>
                ))}
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
