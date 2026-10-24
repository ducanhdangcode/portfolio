import { Fragment } from "react";
import { ArrowDown, ArrowUpRight, Download, factIcons, socialIcons } from "@/components/icons";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeader } from "@/components/SectionHeader";
import { SplitChars } from "@/components/SplitChars";
import { TechIcon, techBrand } from "@/components/TechIcon";
import { TechTags } from "@/components/TechTags";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

const pad = (n: number) => String(n).padStart(2, "0");
const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

const introWords = site.intro.split(" ");
const stats = [
  { label: "Vị trí đã đảm nhận", value: site.experience.length },
  { label: "Dự án cá nhân", value: projects.length },
  { label: "Công nghệ sử dụng", value: site.tech.reduce((n, g) => n + g.items.length, 0) },
];
const isCurrent = (period: string) => /nay|present/i.test(period);

// Các tầng của chồng stack: nhóm đầu tiên (ngôn ngữ) là tầng đáy; danh sách đọc từ trên xuống nên đảo ngược
const layers = site.tech.map((g, i) => ({ g, i })).reverse();

// "Hash" 7 ký tự cố định cho mỗi commit (FNV-1a), chỉ để trang trí kiểu git log
function shortHash(text: string) {
  let h = 0x811c9dc5;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0)!, 0x01000193);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

// Chữ ở màn chuyển cảnh: tách quanh chữ O đầu tiên (lòng chữ O là "cửa" để camera đi xuyên qua)
const interlude = (() => {
  const i = Math.max(0, site.interlude.search(/o/i));
  return { before: site.interlude.slice(0, i), o: site.interlude[i], after: site.interlude.slice(i + 1) };
})();

function Socials() {
  return (
    <ul className="socials" aria-label="Mạng xã hội">
      {site.socials.map((s) => {
        const Icon = socialIcons[s.icon];
        return (
          <li key={s.href}>
            <a
              href={s.href}
              className="icon-btn"
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
  );
}

export default function Home() {
  return (
    <>
      {/* ───────── Màn đầu: tên khổng lồ + quả cầu đồ thị 3D ───────── */}
      {/* data-scroll: cuộn xuống thì nội dung màn đầu trôi lên nhanh hơn và mờ dần (--sp) */}
      <section id="top" className="hero" aria-labelledby="hero-title" data-scroll>
        {/* Neo của quả cầu đồ thị (ParticleField); không có WebGL thì hiện thành vòng tròn mảnh */}
        <span className="orb orb-hero" data-orb aria-hidden="true" />
        <div className="container hero-inner">
          <p className="hero-status mono">
            {site.available && <i className="pulse" aria-hidden="true" />}
            {site.availableText} · {site.location}
          </p>

          {/* Mỗi dòng trồi lên từ sau mặt nạ; chạy bằng CSS ngay khi tải, không chờ JS.
              data-proximity: chữ gần con trỏ vươn cao và chuyển cam (chỉ scale + màu, không đổi layout) */}
          <h1 id="hero-title" className="hero-name" data-proximity>
            <span className="sr-only">{site.name}</span>
            {site.heroName.map((line, i) => (
              <span key={line} className="hero-line" aria-hidden="true" style={vars({ "--l": i })}>
                <span>
                  {line.split(" ").map((word, wi) => (
                    <Fragment key={wi}>
                      {wi > 0 && " "}
                      <span className="split-word">
                        {Array.from(word).map((ch, ci) => (
                          <span key={ci} className="px-char">
                            {ch}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                  {i === site.heroName.length - 1 && <em className="px-char">.</em>}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-sub">
            <p className="hero-role">
              <strong>{site.role}</strong>
              {site.tagline}
            </p>
            <div className="hero-cta">
              <a href="#projects" className="btn btn-primary btn-lg" data-magnetic>
                Xem dự án
                <ArrowDown size={16} />
              </a>
              <a href={asset(site.cv)} className="btn btn-secondary btn-lg" download data-magnetic>
                <Download size={16} />
                Tải CV
              </a>
            </div>
          </div>
        </div>

        {/* Chân màn đầu: các mảng chuyên môn + gợi ý cuộn */}
        <div className="container hero-foot">
          <ul className="hero-focus mono">
            {site.focus.map((f, i) => (
              <li key={f} style={vars({ "--d": i })}>
                <span>{pad(i + 1)}</span>
                {f}
              </li>
            ))}
          </ul>
          <span className="hero-scroll mono" aria-hidden="true">
            Cuộn
            <i />
          </span>
        </div>
      </section>

      {/* ───────── 01 · Giới thiệu ───────── */}
      <section id="about" className="section about" aria-labelledby="about-title">
        <div className="container about-grid">
          {/* Ảnh dính lại khi cuộn (desktop), nghiêng 3D theo con trỏ */}
          <figure className="about-photo" data-reveal>
            <div className="about-photo-frame" data-tilt>
              <img
                src={asset(site.photo)}
                srcSet={`${asset(site.photoSmall)} 800w, ${asset(site.photo)} ${site.photoSize.width}w`}
                sizes="(min-width: 1024px) 40vw, 100vw"
                alt={site.photoAlt}
                width={site.photoSize.width}
                height={site.photoSize.height}
                loading="lazy"
                decoding="async"
              />
              <span className="about-photo-glare" aria-hidden="true" />
            </div>
            <figcaption className="mono">
              <span>{site.photoCaption}</span>
              <span>{site.role}</span>
            </figcaption>
          </figure>

          <div className="about-body">
            <SectionHeader id="about-title" index="01" eyebrow="Giới thiệu" title={`Xin chào, mình là ${site.heroName.at(-1)}`} />

            {/* Từng từ sáng dần theo vị trí cuộn (--scrub do ScrollEffects đặt; không có JS thì sáng hết) */}
            <p className="about-statement" style={vars({ "--n": introWords.length })} data-scrub>
              {introWords.map((w, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="scrub-word" style={vars({ "--w": i })}>
                    {w}
                  </span>
                </Fragment>
              ))}
            </p>

            <div className="about-details" data-reveal>
              <dl className="facts" data-stagger>
                {site.facts.map((f) => {
                  const Icon = factIcons[f.icon];
                  return (
                    <div key={f.label}>
                      <dt>
                        <Icon size={16} />
                        {f.label}
                      </dt>
                      <dd>{f.value}</dd>
                    </div>
                  );
                })}
              </dl>

              {/* Số liệu tính từ nội dung thật, đếm tăng dần khi hiện */}
              <dl className="about-stats" data-stagger>
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="mono">{s.label}</dt>
                    <dd data-count={s.value}>{pad(s.value)}</dd>
                  </div>
                ))}
              </dl>

              <div className="about-actions">
                <a href={asset(site.cv)} className="btn btn-primary btn-lg" download data-magnetic>
                  <Download size={16} />
                  Tải CV (PDF)
                </a>
                <Socials />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dải chữ chạy giữa hai section: tốc độ và chiều chạy theo vận tốc cuộn, nghiêng theo quán tính (data-marquee) */}
      <div className="band" aria-hidden="true" data-marquee>
        <div className="band-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="band-group">
              {[...site.focus, ...site.focus].map((w, i) => (
                <span key={i}>
                  {w}
                  <i>✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ───────── 02 · Stack: chồng tầng kiến trúc 3D ───────── */}
      {/* data-stack3d: section được ghim, cuộn để tách các tầng ra (exploded view) rồi lần lượt "mở" từng tầng.
          Tầng đang mở: logo dựng đứng lên, dòng tương ứng bên trái bung danh sách công nghệ.
          Danh sách bên trái là nội dung thật (đọc được bằng trình đọc màn hình); sân khấu 3D chỉ để trang trí. */}
      <section id="stack" className="stk" aria-labelledby="stack-title" data-stack3d>
        <div className="stk-sticky">
          <div className="container stk-grid">
            <div className="stk-info">
              <SectionHeader
                id="stack-title"
                index="02"
                eyebrow="Stack"
                title="Công cụ & nền tảng"
                lead="Mỗi tầng của hệ thống là một lớp. Cuộn để bóc từng lớp, từ ngôn ngữ nền tảng lên tới AI."
              />
              {/* Tầng trên cùng của chồng (AI) đứng đầu danh sách, như đọc một sơ đồ kiến trúc từ trên xuống */}
              <ol className="stk-list">
                {layers.map(({ g, i }) => (
                  <li key={g.group} className="stk-row" data-layer={i}>
                    <p className="stk-row-head">
                      <span className="mono">{pad(i + 1)}</span>
                      <span className="stk-row-name">{g.group}</span>
                      <span className="mono stk-row-count">[{pad(g.items.length)}]</span>
                    </p>
                    {/* Thu/bung bằng grid-template-rows 0fr → 1fr; nội dung vẫn nằm trong DOM khi thu */}
                    <div className="stk-row-body">
                      <ul className="stk-row-items">
                        {g.items.map((t, j) => (
                          <li key={t.name} style={vars({ "--brand": techBrand(t.icon), "--j": j })}>
                            <TechIcon name={t.icon} size={16} />
                            {t.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="stk-stage" aria-hidden="true">
              <p className="stk-hud mono">
                <span>
                  Layer <b data-stack3d-count>00</b> / {pad(site.tech.length)}
                </span>
                <span>stack.exploded()</span>
              </p>
              <div className="stk-scene">
                {site.tech.map((g, i) => (
                  <div
                    key={g.group}
                    className="stk-plate"
                    style={vars({ "--i": i, "--brand": techBrand(g.items[0].icon) })}
                  >
                    <span className="stk-plate-label mono">
                      {pad(i + 1)} — {g.group}
                    </span>
                    <span className="stk-tiles">
                      {g.items.map((t, j) => (
                        <span key={t.name} className="stk-tile" style={vars({ "--brand": techBrand(t.icon), "--j": j })}>
                          <TechIcon name={t.icon} size={26} />
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
                {/* Gói dữ liệu chạy dọc xuyên qua các tầng */}
                {[0, 1, 2].map((b) => (
                  <span key={b} className="stk-beam" style={vars({ "--b": b })} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 03 · Kinh nghiệm: git graph ───────── */}
      {/* Desktop đủ rộng/cao: section được ghim, cuộn dọc đẩy dải trượt ngang (data-hscroll, --hp).
          Mobile: đường main chạy dọc. Phần đường đã đi qua tô cam tới giữa màn hình (--fill), nhánh đã tới thì
          sáng lên và các commit bật ra lần lượt (is-passed). */}
      <section id="experience" className="xp" aria-labelledby="experience-title" data-hscroll>
        <div className="xp-sticky">
          <div className="xp-viewport">
            <ol className="xp-track">
              <li className="xp-intro">
                <SectionHeader
                  id="experience-title"
                  index="03"
                  eyebrow="Kinh nghiệm"
                  title="Hành trình làm việc"
                  lead="Mỗi vị trí là một nhánh, mỗi việc đã làm là một commit. Bấm vào commit để xem chi tiết."
                />
                <p className="xp-cmd mono" aria-hidden="true">
                  <span>~/career</span> $ git log --graph --oneline
                </p>
              </li>
              {site.experience.map((job, i) => {
                const current = isCurrent(job.period);
                return (
                  <li key={job.company + job.period} className={`xp-job${current ? " is-current" : ""}`}>
                    {/* Nút trên đường main; nhánh của vị trí chạy dọc xuống qua các commit */}
                    <span className="xp-node" aria-hidden="true" />
                    <span className="xp-year" aria-hidden="true">
                      {job.period.match(/\d{4}/)?.[0]}
                    </span>
                    <p className="xp-when mono">
                      {job.period}
                      {current && <span className="xp-head">HEAD → main</span>}
                    </p>
                    <h3 className="xp-role">{job.role}</h3>
                    <p className="xp-company">
                      {job.company}
                      <span className="mono">
                        {job.type} · {job.location}
                      </span>
                    </p>
                    {/* Commit: một dòng ngắn, bấm để mở chi tiết. Cùng name → mở commit này thì commit khác của
                        cùng vị trí tự đóng (accordion gốc của trình duyệt, không cần JS) */}
                    <ol className="xp-commits">
                      {job.commits.map((c, j) => (
                        <li key={c.title} style={vars({ "--j": j })}>
                          <details className="commit" name={`job-${i}`}>
                            <summary>
                              <code className="commit-hash">{shortHash(job.company + c.title)}</code>
                              <span className="commit-msg">
                                <b>feat({c.scope}):</b> {c.title}
                              </span>
                              <span className="commit-toggle" aria-hidden="true" />
                            </summary>
                            <p className="commit-detail">{c.detail}</p>
                          </details>
                        </li>
                      ))}
                    </ol>
                    <TechTags items={job.stack} />
                  </li>
                );
              })}
              {/* Cuối đường main: nhánh mới chờ được tạo */}
              <li className="xp-next">
                <span className="xp-node" aria-hidden="true" />
                <p className="xp-cmd mono">
                  $ git checkout -b <span>next-chapter</span>
                </p>
                <p className="xp-next-title">
                  Chương tiếp theo<em>?</em>
                </p>
                <a href="#contact" className="btn btn-primary btn-lg" data-magnetic>
                  Cùng làm việc
                  <ArrowUpRight size={16} />
                </a>
              </li>
            </ol>
          </div>
          {/* Thanh tiến trình + bộ đếm vị trí (chỉ hiện ở chế độ ngang) */}
          <div className="container xp-progress" aria-hidden="true">
            <span className="mono" data-hscroll-count>
              01
            </span>
            <span className="xp-bar">
              <i />
            </span>
            <span className="mono">{pad(site.experience.length)}</span>
          </div>
        </div>
      </section>

      {/* ───────── Chuyển cảnh: chữ phóng to dần, camera đi xuyên qua lòng chữ O vào phần dự án ───────── */}
      {/* data-zoom: section cao ~2.5 màn hình, phần dính lại phóng to theo tiến độ cuộn (--zp, scale) */}
      <section className="zoom" aria-hidden="true" data-zoom>
        <div className="zoom-sticky">
          <p className="zoom-cap mono">(04) — Cuộn để đi vào</p>
          <p className="zoom-text">
            {interlude.before}
            <span className="zoom-o">{interlude.o}</span>
            {interlude.after}
          </p>
        </div>
      </section>

      {/* ───────── 04 · Dự án: chồng thẻ sticky ───────── */}
      <section id="projects" className="section" aria-labelledby="projects-title">
        <div className="container">
          <SectionHeader
            id="projects-title"
            index="04"
            eyebrow="Dự án"
            title="Dự án cá nhân"
            lead="Vấn đề kỹ thuật gặp phải, cách giải quyết và con số đo được."
          />
          {/* data-stack: thẻ sau trượt lên đè thẻ trước; thẻ bị đè thu nhỏ, tối dần (--cover) */}
          <div className="pj-stack" data-stack>
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} total={projects.length} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 05 · Liên hệ ───────── */}
      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <div className="container">
          {/* data-scroll: --sp để hai dòng chữ khổng lồ trượt ngược chiều nhau khi cuộn tới */}
          <div className="contact-inner" data-reveal data-scroll>
            <p className="sh-index mono">
              <span>(05)</span>
              Liên hệ
            </p>
            <h2 id="contact-title" className="contact-title" data-proximity>
              {site.contact.title.map((line) => (
                <span key={line} className="contact-line">
                  <SplitChars text={line} />
                </span>
              ))}
            </h2>

            {/* Nút tròn lớn; quả cầu hạt 3D tụ quanh nó (neo data-orb), chữ chạy vòng ngoài */}
            <a href={`mailto:${site.email}`} className="contact-cta" data-magnetic data-cursor="lg">
              <span className="orb orb-contact" data-orb aria-hidden="true" />
              <svg className="contact-ring" viewBox="0 0 200 200" aria-hidden="true">
                <path id="contact-ring-path" d="M100 100m-86 0a86 86 0 1 1 172 0a86 86 0 1 1-172 0" fill="none" />
                <text>
                  <textPath href="#contact-ring-path" textLength="538" lengthAdjust="spacing">
                    {site.contact.ring.repeat(2)}
                  </textPath>
                </text>
              </svg>
              <span className="contact-cta-core">
                <ArrowUpRight size={30} />
                <span>Gửi email</span>
              </span>
            </a>

            <div className="contact-foot">
              <p className="contact-lead">{site.contact.lead}</p>
              <div className="about-actions">
                <a href={asset(site.cv)} className="btn btn-secondary btn-lg" download data-magnetic>
                  <Download size={16} />
                  Tải CV (PDF)
                </a>
                <Socials />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
