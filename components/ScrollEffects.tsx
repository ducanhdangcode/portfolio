"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Hiệu ứng cuộn và con trỏ, điều khiển bằng data-attribute:
 *   data-reveal     hiện dần khi cuộn tới (thêm class is-in)
 *   data-stagger    đánh số --i cho các con để hiện lần lượt
 *   data-progress   --progress 0→1 khi cuộn qua (đường timeline)
 *   data-scrub      --scrub 0→1 khi cuộn qua (chữ sáng dần từng từ)
 *   data-scroll     --sp 0→1 từ lúc phần tử chạm đáy tới lúc rời đỉnh màn hình (parallax)
 *   data-scroll-y   --sy = số px đã cuộn (chỉ dùng cho phần đầu trang)
 *   data-scramble   chữ "giải mã" thành giá trị của attribute khi khối reveal cha hiện
 *   data-count      đếm từ 0 tới giá trị của attribute khi khối reveal cha hiện
 *   data-spotlight  --mx/--my theo vị trí con trỏ (vệt sáng)
 *   data-magnetic   phần tử bị con trỏ "hút" nhẹ
 *   data-tilt       nghiêng 3D theo con trỏ
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

    let alive = true;
    const isAlive = () => alive;
    const timers: number[] = [];
    const offs: (() => void)[] = [];

    $("[data-reveal]:not(.is-in) [data-count]").forEach((el) => (el.textContent = pad(0)));

    // Chỉ chạy cho phần tử thuộc đúng khối reveal này; khối reveal lồng bên trong tự chạy khi nó hiện
    const own = (el: HTMLElement, sel: string) =>
      [...el.querySelectorAll<HTMLElement>(sel)].filter((t) => t.parentElement?.closest("[data-reveal]") === el);

    const play = (el: HTMLElement) => {
      own(el, "[data-scramble]").forEach((t) => timers.push(window.setTimeout(() => scramble(t, isAlive), 350)));
      own(el, "[data-count]").forEach((t) => timers.push(window.setTimeout(() => countUp(t, isAlive), 700)));
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("is-in");
          play(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    $("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));

    const bar = document.querySelector<HTMLElement>(".scroll-progress");
    const progress = $("[data-progress]");
    const scrub = $("[data-scrub]");
    const scrolled = $("[data-scroll]");
    const scrollY = $("[data-scroll-y]");

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

      // Bắt đầu sáng khi mép trên ở 95% màn hình, sáng hết khi lên tới 55%
      for (const el of scrub) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--scrub", clamp((vh * 0.95 - r.top) / (vh * 0.4)).toFixed(3));
      }

      for (const el of scrolled) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sp", clamp((vh - r.top) / (vh + r.height)).toFixed(3));
      }

      // Qua khỏi 1.5 màn hình thì phần đầu trang đã khuất, khỏi cập nhật
      const sy = Math.min(window.scrollY, vh * 1.5);
      for (const el of scrollY) el.style.setProperty("--sy", sy.toFixed(0));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Hiệu ứng con trỏ: chỉ bật với chuột (màn hình cảm ứng không có hover)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const on = (el: HTMLElement, type: "pointermove" | "pointerleave", fn: (e: PointerEvent) => void) => {
        el.addEventListener(type, fn);
        offs.push(() => el.removeEventListener(type, fn));
      };

      $("[data-spotlight]").forEach((el) =>
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }),
      );

      $("[data-magnetic]").forEach((el) => {
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.3;
          const y = (e.clientY - r.top - r.height / 2) * 0.3;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        });
        on(el, "pointerleave", () => (el.style.transform = ""));
      });

      $("[data-tilt]").forEach((el) => {
        on(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(1100px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
        });
        on(el, "pointerleave", () => (el.style.transform = ""));
      });
    }

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      offs.forEach((off) => off());
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

const pad = (n: number) => String(n).padStart(2, "0");

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

// Chữ chốt dần từ trái sang phải, phần chưa chốt là ký tự ngẫu nhiên
function scramble(el: HTMLElement, alive: () => boolean) {
  const final = el.dataset.scramble ?? "";
  const start = performance.now();
  const step = (now: number) => {
    const t = alive() ? Math.min(1, (now - start) / 900) : 1;
    const settled = Math.floor(t * final.length);
    let out = final.slice(0, settled);
    for (let i = settled; i < final.length; i++) {
      out += final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function countUp(el: HTMLElement, alive: () => boolean) {
  const target = Number(el.dataset.count) || 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = alive() ? Math.min(1, (now - start) / 1400) : 1;
    const eased = t === 1 ? 1 : 1 - 2 ** (-10 * t);
    el.textContent = pad(Math.round(eased * target));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
