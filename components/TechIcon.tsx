import {
  siDocker,
  siDotnet,
  siExpress,
  siGit,
  siGithubactions,
  siJavascript,
  siMinio,
  siMongodb,
  siMysql,
  siNeo4j,
  siNextdotjs,
  siOpenjdk,
  siPostgresql,
  siReact,
  siRedis,
  siRustfs,
  siSpringboot,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import type { TechIconName } from "@/content/site";

type Glyph = { path: string; hex: string };
type Custom = "csharp" | "postgis" | "agentic" | "orchestration";

// Logo thương hiệu từ Simple Icons (CC0).
// Java: Oracle đã gỡ logo Java khỏi bộ nên dùng logo OpenJDK, hover hiện màu cam của Java.
const glyphs: Record<Exclude<TechIconName, Custom>, Glyph> = {
  typescript: siTypescript,
  javascript: siJavascript,
  java: { path: siOpenjdk.path, hex: "E76F00" },
  dotnet: siDotnet,
  springboot: siSpringboot,
  express: siExpress,
  react: siReact,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  mysql: siMysql,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  neo4j: siNeo4j,
  redis: siRedis,
  minio: siMinio,
  rustfs: siRustfs,
  docker: siDocker,
  githubactions: siGithubactions,
  git: siGit,
};

// Icon tự vẽ (nét) cho thứ không có logo trong Simple Icons
const custom: Record<Custom, { brand: string; body: React.ReactNode }> = {
  csharp: {
    brand: "#9B4F96",
    body: (
      <>
        <path d="M12 1.5 21.1 6.75v10.5L12 22.5 2.9 17.25V6.75z" />
        <path d="M11.6 9.3a3.3 3.3 0 1 0 0 5.4" />
        <path d="M14.4 10.1v3.8M16.6 10.1v3.8M13.6 11.1h3.8M13.6 12.9h3.8" strokeWidth="1.1" />
      </>
    ),
  },
  // Địa cầu + ghim bản đồ
  postgis: {
    brand: "#336791",
    body: (
      <>
        <path d="M20.5 12A8.5 8.5 0 1 1 12 3.5" />
        <path d="M3.5 12h9M12 3.5c-2.2 2.3-3.3 5.1-3.3 8.5s1.1 6.2 3.3 8.5" />
        <path d="M18 10.5s-3-2.6-3-5a3 3 0 0 1 6 0c0 2.4-3 5-3 5z" />
        <circle cx="18" cy="5.5" r="0.9" />
      </>
    ),
  },
  // Chuỗi bước có vòng lặp: agent tự lập kế hoạch và lặp lại
  agentic: {
    brand: "var(--accent)",
    body: (
      <>
        <rect x="2.5" y="9" width="5" height="5" rx="1.2" />
        <rect x="9.5" y="9" width="5" height="5" rx="1.2" />
        <rect x="16.5" y="9" width="5" height="5" rx="1.2" />
        <path d="M7.5 11.5h2M14.5 11.5h2" />
        <path d="M19 9V6.5a1.5 1.5 0 0 0-1.5-1.5h-11A1.5 1.5 0 0 0 5 6.5V9" />
        <path d="m3.5 7.5 1.5 1.5 1.5-1.5" />
      </>
    ),
  },
  // Một nút điều phối nối tới nhiều mô hình
  orchestration: {
    brand: "var(--signal)",
    body: (
      <>
        <circle cx="12" cy="12" r="3" />
        <circle cx="4.5" cy="5" r="1.8" />
        <circle cx="19.5" cy="5" r="1.8" />
        <circle cx="4.5" cy="19" r="1.8" />
        <circle cx="19.5" cy="19" r="1.8" />
        <path d="m6 6.4 3.8 3.5M18 6.4l-3.8 3.5M6 17.6l3.8-3.5M18 17.6l-3.8-3.5" />
      </>
    ),
  },
};

// Logo màu đen/gần đen (Next.js, Express) dùng màu chữ để vẫn thấy ở giao diện tối
const DARK = new Set(["000000", "0A0A0A", "191919"]);
const brandColor = (hex: string) => (DARK.has(hex.toUpperCase()) ? "var(--text)" : `#${hex}`);

export function TechIcon({ name, size = 22 }: { name: TechIconName; size?: number }) {
  if (name in custom) {
    const c = custom[name as Custom];
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ "--brand": c.brand } as React.CSSProperties}
      >
        {c.body}
      </svg>
    );
  }

  const glyph = glyphs[name as Exclude<TechIconName, Custom>];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ "--brand": brandColor(glyph.hex) } as React.CSSProperties}
    >
      <path d={glyph.path} />
    </svg>
  );
}
