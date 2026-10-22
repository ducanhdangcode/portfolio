import type { SVGProps } from "react";
import type { FactIcon, IconName } from "@/content/site";

type Props = SVGProps<SVGSVGElement> & { size?: number };

// Icon nét (stroke) kiểu Lucide
function Stroke({ size = 16, children, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

// Icon thương hiệu (fill)
function Fill({ size = 16, children, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const ArrowRight = (p: Props) => (
  <Stroke {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
);

export const ArrowLeft = (p: Props) => (
  <Stroke {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </Stroke>
);

export const ArrowUpRight = (p: Props) => (
  <Stroke {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Stroke>
);

export const Download = (p: Props) => (
  <Stroke {...p}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </Stroke>
);

export const Mail = (p: Props) => (
  <Stroke {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Stroke>
);

export const Play = (p: Props) => (
  <Stroke {...p}>
    <path d="M7 5v14l11-7z" />
  </Stroke>
);

export const Sun = (p: Props) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Stroke>
);

export const Moon = (p: Props) => (
  <Stroke {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </Stroke>
);

export const GitHub = (p: Props) => (
  <Fill {...p}>
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" />
  </Fill>
);

export const LinkedIn = (p: Props) => (
  <Fill {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </Fill>
);

export const XLogo = (p: Props) => (
  <Fill {...p}>
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93zm-1.29 19.5h2.04L6.49 3.24H4.3z" />
  </Fill>
);

export const Blog = (p: Props) => (
  <Stroke {...p}>
    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" />
  </Stroke>
);

export const socialIcons: Record<IconName, (p: Props) => React.ReactElement> = {
  github: GitHub,
  linkedin: LinkedIn,
  x: XLogo,
  blog: Blog,
};

// ── Thông tin cá nhân ──
export const User = (p: Props) => (
  <Stroke {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </Stroke>
);

export const Pin = (p: Props) => (
  <Stroke {...p}>
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </Stroke>
);

export const Briefcase = (p: Props) => (
  <Stroke {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
  </Stroke>
);

export const Cap = (p: Props) => (
  <Stroke {...p}>
    <path d="m2 9 10-5 10 5-10 5z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </Stroke>
);

export const Globe = (p: Props) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Stroke>
);

export const Heart = (p: Props) => (
  <Stroke {...p}>
    <path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.4 1 5 3 1.6-2 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z" />
  </Stroke>
);

export const factIcons: Record<FactIcon, (p: Props) => React.ReactElement> = {
  user: User,
  pin: Pin,
  briefcase: Briefcase,
  cap: Cap,
  globe: Globe,
  heart: Heart,
};
