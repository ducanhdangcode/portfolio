"use client";

import { useEffect, useRef } from "react";

/*
 * Chấm trắng đi theo chuột, mix-blend-mode: difference nên đảo màu mọi thứ bên dưới.
 * Phình to trên link/nút, rất to trên phần tử có data-cursor="lg".
 * Chỉ bật với chuột và khi không bật giảm chuyển động.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || reduce) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;

    // Chấm đuổi theo vị trí chuột, dừng vòng lặp khi đã bắt kịp
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!el.classList.contains("is-on")) {
        cx = x;
        cy = y;
        el.classList.add("is-on");
      }
      const target = (e.target as Element).closest?.("a, button, [data-cursor]");
      el.dataset.size = target ? ((target as HTMLElement).dataset.cursor ?? "md") : "";
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onLeave = () => el.classList.remove("is-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
