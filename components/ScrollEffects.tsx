"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Hiệu ứng cuộn, điều khiển bằng data-attribute:
 *   data-reveal     hiện dần khi cuộn tới (thêm class is-in)
 *   data-stagger    đánh số --i cho các con để hiện lần lượt
 *   data-progress   --progress 0→1 khi cuộn qua (đường timeline)
 */
export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

    $("[data-stagger]").forEach((parent) =>
      [...parent.children].forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i))),
    );

    if (reduce) {
      $("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    $("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const progress = $("[data-progress]");

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      bar?.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
      root.toggleAttribute("data-scrolled", window.scrollY > 8);

      for (const el of progress) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--progress", clamp((vh * 0.6 - r.top) / r.height).toFixed(3));
        for (const item of el.children) {
          item.classList.toggle("is-passed", item.getBoundingClientRect().top < vh * 0.6);
        }
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}

function clamp(n: number) {
  return Math.min(1, Math.max(0, n));
}
