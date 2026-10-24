"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/*
 * Cuộn mượt có quán tính (Lenis, ~3KB) cho chuột/trackpad. Màn hình cảm ứng giữ cuộn gốc của hệ điều hành;
 * Lenis tự tắt khi bật giảm chuyển động.
 * Lenis vẫn cuộn chính window nên sự kiện scroll và các hiệu ứng cuộn khác chạy như cũ.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

    // Đang có màn mở đầu: khoá cuộn tới khi màn kéo lên xong (khớp thời gian trong CSS .intro)
    let unlock = 0;
    if (document.documentElement.classList.contains("intro-on")) {
      lenis.stop();
      unlock = window.setTimeout(() => lenis.start(), 1500);
    }

    // Link tới #section cùng trang (kể cả next/link "/#about"): chặn trước Next.js để chỉ cuộn một lần, có trớn.
    // Chạy ở pha capture trên document, trước React; next/link bỏ qua sự kiện đã preventDefault.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      lenis.scrollTo(target, { offset: -(header + 16), duration: 1.4 });
      history.pushState(history.state, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(unlock);
      lenis.destroy();
    };
  }, []);

  return null;
}
