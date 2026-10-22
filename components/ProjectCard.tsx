import Image from "next/image";
import Link from "next/link";
import { projectLinks, type Project } from "@/content/projects";
import { ArrowRight, ArrowUpRight, GitHub } from "./icons";
import { PhoneScreens } from "./PhoneScreens";
import { asset } from "@/lib/asset";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = `/projects/${project.slug}`;

  const cover = project.screens ? (
    <PhoneScreens screens={project.screens} size="card" decorative />
  ) : (
    <span className="media-frame">
      <Image src={asset(project.cover)} alt="" width={1600} height={1000} />
    </span>
  );

  return (
    <article className={`card project-card${projectLinks ? "" : " is-static"}`}>
      <div className="project-body">
        <p className="project-kicker mono">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </p>
        <h3>{projectLinks ? <Link href={href}>{project.title}</Link> : project.title}</h3>
        <p className="project-tagline">{project.tagline}</p>

        <dl className="project-ps">
          <div>
            <dt>Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>Solution</dt>
            <dd>{project.solution}</dd>
          </div>
        </dl>

        <ul className="tags" aria-label="Tech stack">
          {project.stack.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        {(projectLinks || project.links.code) && (
          <div className="project-links">
            {projectLinks && (
              <Link href={href} className="btn btn-sm btn-primary">
                Case study
                <ArrowRight size={14} />
              </Link>
            )}
            {projectLinks && project.links.live && (
              <a href={project.links.live} className="btn btn-sm btn-ghost" target="_blank" rel="noreferrer">
                Live demo
                <ArrowUpRight size={14} />
              </a>
            )}
            {/* Link GitHub luôn hiện, kể cả khi projectLinks đang tắt */}
            {project.links.code && (
              <a
                href={project.links.code}
                className={`btn btn-sm ${projectLinks ? "btn-ghost" : "btn-secondary"}`}
                target="_blank"
                rel="noreferrer"
              >
                <GitHub size={14} />
                Xem mã nguồn trên GitHub
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </div>

      {projectLinks ? (
        <Link href={href} className="project-media" tabIndex={-1} aria-hidden="true">
          {cover}
        </Link>
      ) : (
        <div className="project-media" aria-hidden="true">
          {cover}
        </div>
      )}
    </article>
  );
}
