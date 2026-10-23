import Image from "next/image";
import Link from "next/link";
import { projectLinks, type Project } from "@/content/projects";
import { ArrowRight, ArrowUpRight, GitHub } from "./icons";
import { PhoneScreens } from "./PhoneScreens";
import { SplitChars } from "./SplitChars";
import { TechTags } from "./TechTags";
import { asset } from "@/lib/asset";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = `/projects/${project.slug}`;

  // Ảnh web đặt trong mockup laptop vẽ bằng CSS, ảnh mobile dùng khung điện thoại.
  // Đặt trên "sân khấu" lưới chấm: nghiêng theo con trỏ (data-tilt), quầng sáng theo con trỏ (data-spotlight)
  const cover = (
    <span className="project-stage" data-tilt data-spotlight>
      {project.screens ? (
        <PhoneScreens screens={project.screens} size="card" decorative />
      ) : (
        <span className="laptop">
          <span className="laptop-screen">
            <Image src={asset(project.cover)} alt="" width={1600} height={1000} />
          </span>
          <span className="laptop-base" />
        </span>
      )}
    </span>
  );

  return (
    <article className={`project-card${projectLinks ? "" : " is-static"}`}>
      <div className="project-body">
        <div className="project-head">
          <span className="project-num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>
              {projectLinks ? (
                <Link href={href}>
                  <SplitChars text={project.title} />
                </Link>
              ) : (
                <SplitChars text={project.title} />
              )}
            </h3>
            <p className="project-kicker mono">
              <span className="sr-only">
                {project.year} / {project.role}
              </span>
              <span aria-hidden="true" data-scramble={project.year}>
                {project.year}
              </span>
              <span aria-hidden="true" data-scramble={project.role}>
                {project.role}
              </span>
            </p>
          </div>
        </div>

        <TechTags items={project.stack} pill />

        <p className="project-tagline">{project.tagline}</p>

        <dl className="project-ps">
          <div>
            <dt className="mono">Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt className="mono">Solution</dt>
            <dd>{project.solution}</dd>
          </div>
        </dl>

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
                data-magnetic
              >
                <GitHub size={14} />
                <span className="roll">
                  <span>Xem mã nguồn trên GitHub</span>
                </span>
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
