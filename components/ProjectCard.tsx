import Image from "next/image";
import Link from "next/link";
import { projectLinks, type Project } from "@/content/projects";
import { ArrowRight, ArrowUpRight, GitHub } from "./icons";
import { PhoneScreens } from "./PhoneScreens";
import { SplitChars } from "./SplitChars";
import { TechTags } from "./TechTags";
import { asset } from "@/lib/asset";

const pad = (n: number) => String(n).padStart(2, "0");

// Một thẻ trong chồng thẻ dự án: chữ bên trái, "sân khấu" thiết bị bên phải.
// Thẻ nằm trong .pj-stack (data-stack): khi thẻ sau trượt lên đè, thẻ này thu nhỏ và tối dần (--cover).
export function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const href = `/projects/${project.slug}`;

  // Ảnh web đặt trong mockup laptop vẽ bằng CSS, ảnh mobile dùng khung điện thoại.
  // Sân khấu nghiêng 3D theo con trỏ (data-tilt), quầng sáng theo con trỏ (data-spotlight)
  const stage = (
    <span className="pj-stage" data-tilt data-spotlight>
      {project.screens ? (
        <PhoneScreens screens={project.screens} size="card" decorative />
      ) : (
        <span className="laptop">
          <span className="laptop-screen">
            <Image src={asset(project.cover)} alt="" width={1600} height={1000} loading="lazy" />
          </span>
          <span className="laptop-base" />
        </span>
      )}
    </span>
  );

  return (
    <article className="pj" style={{ "--i": index } as React.CSSProperties} data-reveal>
      <div className="pj-card">
        <div className="pj-info">
          <p className="pj-top mono">
            <span className="pj-count">
              {pad(index + 1)} / {pad(total)}
            </span>
            <span>
              {project.year} — {project.role}
            </span>
          </p>

          <h3 className="pj-title">
            {projectLinks ? (
              <Link href={href}>
                <SplitChars text={project.title} />
              </Link>
            ) : (
              <SplitChars text={project.title} />
            )}
          </h3>

          <p className="pj-tagline">{project.tagline}</p>

          <TechTags items={project.stack} />

          <dl className="pj-ps">
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
            <div className="pj-links">
              {projectLinks && (
                <Link href={href} className="btn btn-primary">
                  Case study
                  <ArrowRight size={14} />
                </Link>
              )}
              {projectLinks && project.links.live && (
                <a href={project.links.live} className="btn btn-ghost" target="_blank" rel="noreferrer">
                  Live demo
                  <ArrowUpRight size={14} />
                </a>
              )}
              {/* Link GitHub luôn hiện, kể cả khi projectLinks đang tắt */}
              {project.links.code && (
                <a
                  href={project.links.code}
                  className={`btn ${projectLinks ? "btn-ghost" : "btn-secondary"}`}
                  target="_blank"
                  rel="noreferrer"
                  data-magnetic
                >
                  <GitHub size={15} />
                  Mã nguồn trên GitHub
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          )}
        </div>

        {projectLinks ? (
          <Link href={href} className="pj-media" tabIndex={-1} aria-hidden="true">
            {stage}
          </Link>
        ) : (
          <div className="pj-media" aria-hidden="true">
            {stage}
          </div>
        )}

        {/* Lớp tối phủ lên khi thẻ sau đè lên (opacity theo --cover) */}
        <span className="pj-shade" aria-hidden="true" />
      </div>
    </article>
  );
}
