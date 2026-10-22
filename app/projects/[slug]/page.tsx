import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { PhoneScreens } from "@/components/PhoneScreens";
import { ArrowLeft, ArrowRight, ArrowUpRight, GitHub } from "@/components/icons";
import { getProject, projects } from "@/content/projects";
import { asset } from "@/lib/asset";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = getProject((await params).slug);
  if (!found) return {};
  return { title: found.project.title, description: found.project.tagline };
}

const pad = (n: number) => String(n).padStart(2, "0");
const delay = (i: number) => ({ "--d": i }) as React.CSSProperties;

export default async function CaseStudy({ params }: Props) {
  const found = getProject((await params).slug);
  if (!found) notFound();
  const { project, index, next } = found;

  return (
    <article className="case">
      <div className="container">
        <div className="case-nav enter">
          <Link href="/#projects" className="back-link">
            <ArrowLeft size={16} />
            Tất cả dự án
          </Link>
          <span className="mono">
            {pad(index + 1)} / {pad(projects.length)}
          </span>
        </div>

        <header className="case-header">
          <p className="eyebrow enter" style={delay(1)}>
            <span>Case study</span> / {project.year}
          </p>
          <h1 className="enter" style={delay(2)}>
            {project.title}
          </h1>
          <p className="case-tagline enter" style={delay(4)}>
            {project.tagline}
          </p>
          <div className="hero-cta enter" style={delay(6)}>
            {project.links.live && (
              <a href={project.links.live} className="btn btn-primary" target="_blank" rel="noreferrer">
                Live demo
                <ArrowUpRight size={16} />
              </a>
            )}
            {project.links.code && (
              <a href={project.links.code} className="btn btn-secondary" target="_blank" rel="noreferrer">
                <GitHub size={16} />
                GitHub
              </a>
            )}
          </div>
        </header>

        <dl className="stats case-meta enter" style={delay(7)}>
          <div>
            <dt>Vai trò</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Thời gian</dt>
            <dd>{project.timeline}</dd>
          </div>
          <div>
            <dt>Team</dt>
            <dd>{project.team}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.slice(0, 3).join(", ")}</dd>
          </div>
        </dl>

        {project.screens ? (
          <div className="case-phones enter" style={delay(8)}>
            <PhoneScreens screens={project.screens} size="large" />
          </div>
        ) : (
          <div className="case-cover media-frame enter" style={delay(8)}>
            <Image
              src={asset(project.cover)}
              alt={project.coverAlt}
              width={1600}
              height={1000}
              priority
            />
          </div>
        )}

        <div className="case-body">
          <section className="case-section" data-reveal>
            <h2>
              <span className="mono">01</span> Vấn đề
            </h2>
            <p>{project.problem}</p>
          </section>

          <section className="case-section" data-reveal>
            <h2>
              <span className="mono">02</span> Kiến trúc
            </h2>
            <ArchitectureFlow nodes={project.architecture} />
          </section>

          <section className="case-section" data-reveal>
            <h2>
              <span className="mono">03</span> Giải pháp
            </h2>
            {project.details.map((d) => (
              <p key={d}>{d}</p>
            ))}
            <ul className="tags">
              {project.stack.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div data-reveal>
          <Link href={`/projects/${next.slug}`} className="card next-card">
            <span>
              <span className="eyebrow">Dự án tiếp theo</span>
              <strong>{next.title}</strong>
              <span className="next-tagline">{next.tagline}</span>
            </span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
