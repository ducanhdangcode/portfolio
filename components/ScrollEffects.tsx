"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Hiệu ứng cuộn và con trỏ, điều khiển bằng data-attribute:
 *   data-reveal     hiện dần khi cuộn tới (thêm class is-in)
 *   data-stagger    đánh số --i cho các con để hiện lần lượt
 *   data-scrub      --scrub 0→1 khi cuộn qua (chữ sáng dần từng từ)
 *   data-scroll     --sp 0→1 từ lúc phần tử chạm đáy tới lúc rời đỉnh màn hình (parallax)
 *   data-hscroll    git graph kinh nghiệm. Chế độ ngang (CSS đặt --h-on: 1): --dist = quãng trượt (px, đo một lần),
 *                   --hp 0→1 khi cuộn qua. Cả hai chế độ: --fill = phần đường main đã đi qua, nút nào đã qua
 *                   có is-passed; [data-hscroll-count] hiện số vị trí đã đi qua
 *   data-stack3d    chồng tầng 3D: --gap (khoảng tách các tầng), --e (mức tách 0→1), --tx/--ty (nghiêng theo con trỏ),
 *                   tầng đang mở .is-active, tầng phía trên .is-above, dòng danh sách tương ứng .is-active
 *   data-zoom       màn chuyển cảnh: chữ phóng to dần theo cuộn, tâm phóng là lòng chữ O (.zoom-o); --zp 0→1
 *   data-marquee    dải chữ chạy liên tục khi trong màn hình, tốc độ/chiều theo vận tốc cuộn, --skew theo quán tính
 *   data-proximity  chữ con (.px-char/.split-char) có --f 0→1 theo khoảng cách tới con trỏ
 *   data-stack      chồng thẻ sticky: mỗi thẻ có --cover 0→1 khi thẻ kế tiếp trượt lên đè nó
 *   data-nav        link điều hướng tới #id; link của section đang ở giữa màn hình có data-active
 *   data-scramble   chữ "giải mã" thành giá trị của attribute khi khối reveal cha hiện
 *   data-count      đếm từ 0 tới giá trị của attribute khi khối reveal cha hiện
 *   data-spotlight  --mx/--my theo vị trí con trỏ (vệt sáng)
 *   data-magnetic   phần tử bị con trỏ "hút" nhẹ
 *   data-tilt       nghiêng 3D theo con trỏ
 * Ngoài ra: root có data-scrolled khi đã cuộn, data-hide-header khi đang cuộn xuống (header thu lại).
 *
 * Hiệu năng: vị trí các phần tử được đo một lần (và khi kích thước trang đổi), mỗi khung hình chỉ tính
 * từ scrollY nên không ép trình duyệt tính lại layout; chỉ ghi style khi giá trị thực sự đổi.
 */

type Track = { el: HTMLElement; top: number; h: number; v: string };

export function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const $ = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

    $("[data-stagger]").forEach((parent) =>
      [...parent.children].forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i))),
    );

    // Đánh dấu link của section đang cắt ngang giữa màn hình (chạy cả khi giảm chuyển động)
    const links = $("[data-nav]");
    const navIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const a of links) a.toggleAttribute("data-active", a.dataset.nav === entry.target.id);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    // #top (màn đầu) không có link: khi nó ở giữa màn hình thì không mục nào sáng
    ["top", ...links.map((a) => a.dataset.nav ?? "")].forEach((id) => {
      const section = document.getElementById(id);
      if (section) navIO.observe(section);
    });

    if (reduce) {
      $("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return () => navIO.disconnect();
    }

    let alive = true;
    const isAlive = () => alive;
    const timers: number[] = [];
    const offs: (() => void)[] = [];
    const listen = <K extends keyof WindowEventMap>(
      el: Window | HTMLElement,
      type: K,
      fn: (e: WindowEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      el.addEventListener(type, fn as EventListener, opts);
      offs.push(() => el.removeEventListener(type, fn as EventListener));
    };

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

    const track = (els: Element[]): Track[] => els.map((el) => ({ el: el as HTMLElement, top: 0, h: 0, v: "" }));
    const set = (t: Track, name: string, v: string) => {
      if (t.v === v) return;
      t.v = v;
      t.el.style.setProperty(name, v);
    };

    const bar = track($(".scroll-progress"));
    const scrub = track($("[data-scrub]"));
    const scrolled = track($("[data-scroll]"));
    // Git graph: nút trên đường main (.xp-job, .xp-next); vị trí "at" tính trong hệ toạ độ của track
    const hscroll = track($("[data-hscroll]")).map((t) => ({
      ...t,
      track: t.el.querySelector<HTMLElement>(".xp-track")!,
      viewport: t.el.querySelector<HTMLElement>(".xp-viewport")!,
      count: t.el.querySelector<HTMLElement>("[data-hscroll-count]"),
      nodes: [...t.el.querySelectorAll<HTMLElement>(".xp-job, .xp-next")].map((el) => ({ el, at: 0, v: "" })),
      jobs: t.el.querySelectorAll(".xp-job").length,
      dist: 0,
      vw: 0,
      base: 0,
      start: 0,
      len: 1,
    }));
    const stacks = $("[data-stack]").map((el) => track([...el.children]));
    const zooms = track($("[data-zoom]")).map((t) => {
      const text = t.el.querySelector<HTMLElement>(".zoom-text")!;
      return { ...t, text: track([text])[0], o: t.el.querySelector<HTMLElement>(".zoom-o")!, dx: 0, dy: 0 };
    });
    // Chồng tầng 3D: tầng đang mở = theo tiến độ cuộn, hoặc theo dòng đang trỏ chuột trong danh sách
    const stack3d = track($("[data-stack3d]")).map((t) => ({
      ...t,
      stage: t.el.querySelector<HTMLElement>(".stk-stage")!,
      plates: [...t.el.querySelectorAll<HTMLElement>(".stk-plate")],
      rows: [...t.el.querySelectorAll<HTMLElement>(".stk-row")],
      count: t.el.querySelector<HTMLElement>("[data-stack3d-count]"),
      e: track([t.el])[0],
      gapMax: 64,
      active: -2,
      scrolled: -1,
      hover: -1,
    }));
    const openLayer = (s: (typeof stack3d)[number]) => {
      const a = s.hover >= 0 ? s.hover : s.scrolled;
      if (a === s.active) return;
      s.active = a;
      s.plates.forEach((p, i) => {
        p.classList.toggle("is-active", i === a);
        p.classList.toggle("is-above", a >= 0 && i > a);
      });
      for (const r of s.rows) r.classList.toggle("is-active", Number(r.dataset.layer) === a);
      s.el.toggleAttribute("data-open", a >= 0);
      if (s.count) s.count.textContent = pad(Math.max(0, a + 1));
      s.stage.dataset.layer = a >= 0 ? pad(a + 1) : "";
    };

    const measured = [...scrub, ...scrolled, ...hscroll, ...zooms, ...stack3d];

    // Chữ phản ứng theo con trỏ: --f 0→1 theo khoảng cách tới con trỏ, đuổi theo mục tiêu (lerp) cho mượt.
    // CSS chỉ đổi scale + màu nên không làm xô lệch layout (không tính vào CLS)
    const prox = $("[data-proximity]").map((el) => ({
      el,
      r: 1,
      top: 0,
      bottom: 0,
      chars: [...el.querySelectorAll<HTMLElement>(".px-char, .split-char")].map((c) => ({ el: c, x: 0, y: 0, f: 0, v: "" })),
    }));
    const pointer = { x: 0, y: 0, active: false };
    let proxFrame = 0;
    const proxStep = () => {
      let moving = false;
      const py = pointer.y + window.scrollY;
      for (const g of prox) {
        const near = pointer.active && py > g.top && py < g.bottom;
        for (const c of g.chars) {
          const d = near ? Math.hypot(c.x - pointer.x, c.y - py) / g.r : 1;
          const t = d < 1 ? (1 - d) * (1 - d) * (3 - 2 * (1 - d)) : 0;
          c.f += (t - c.f) * 0.16;
          if (Math.abs(t - c.f) < 0.002) c.f = t;
          else moving = true;
          const v = c.f.toFixed(3);
          if (v !== c.v) c.el.style.setProperty("--f", (c.v = v));
        }
      }
      proxFrame = moving ? requestAnimationFrame(proxStep) : 0;
    };

    // Dải chữ chạy: chạy liên tục khi đang trong màn hình; cuộn nhanh thì chạy nhanh hơn, đổi chiều theo chiều cuộn
    const bands = $("[data-marquee]").map((el) => ({
      el: el,
      track: el.querySelector<HTMLElement>(".band-track")!,
      x: 0,
      w: 0,
      visible: false,
      skew: track([el])[0],
    }));
    let bandFrame = 0;
    let bandLast = 0;
    let bandDir = -1;
    const bandStep = (now: number) => {
      const dt = bandLast ? Math.min(now - bandLast, 50) / 16.67 : 1;
      bandLast = now;
      if (vel > 0.5) bandDir = -1;
      else if (vel < -0.5) bandDir = 1;
      const speed = (1.1 + Math.min(Math.abs(vel), 60) * 0.3) * dt * bandDir;
      let any = false;
      for (const b of bands) {
        if (!b.visible || !b.w) continue;
        any = true;
        b.x += speed;
        if (b.x <= -b.w) b.x += b.w;
        else if (b.x > 0) b.x -= b.w;
        b.track.style.transform = `translate3d(${b.x.toFixed(1)}px,0,0)`;
        set(b.skew, "--skew", Math.max(-8, Math.min(8, vel * -0.18)).toFixed(2));
      }
      bandFrame = any ? requestAnimationFrame(bandStep) : 0;
      if (!any) bandLast = 0;
    };
    const bandIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const b = bands.find((x) => x.el === e.target);
        if (b) b.visible = e.isIntersecting;
      }
      if (!bandFrame && bands.some((b) => b.visible)) bandFrame = requestAnimationFrame(bandStep);
    });
    bands.forEach((b) => bandIO.observe(b.el));

    let vh = window.innerHeight;
    let max = 0;
    // Vị trí "tĩnh" và chỗ dính của từng thẻ trong chồng: tạm bỏ sticky để đọc vị trí gốc (chỉ khi đo lại)
    const stackTops: { top: number; stick: number }[][] = [];
    const measure = () => {
      vh = window.innerHeight;
      // Quãng trượt ngang phải đặt trước vì nó đổi chiều cao section, kéo theo vị trí mọi thứ phía dưới
      for (const h of hscroll) {
        const on = getComputedStyle(h.el).getPropertyValue("--h-on").trim() === "1";
        h.vw = h.viewport.clientWidth;
        h.dist = on ? Math.max(0, h.track.scrollWidth - h.vw) : 0;
        h.el.style.setProperty("--dist", String(h.dist));
        // Đường main chạy từ nút đầu tiên tới cuối track: ngang (desktop) hoặc dọc (mobile)
        for (const n of h.nodes) n.at = on ? n.el.offsetLeft : n.el.offsetTop;
        h.start = h.nodes[0]?.at ?? 0;
        h.len = Math.max(1, (on ? h.track.scrollWidth : h.track.offsetHeight) - h.start);
        h.track.style.setProperty("--rail", String(h.start));
      }
      stacks.forEach((cards, s) => {
        stackTops[s] = cards.map((c) => {
          const stick = parseFloat(getComputedStyle(c.el).top) || 0;
          c.el.style.position = "relative";
          const top = docTop(c.el);
          c.el.style.position = "";
          return { top, stick };
        });
      });
      max = root.scrollHeight - vh;
      for (const t of measured) {
        t.top = docTop(t.el);
        t.h = t.el.offsetHeight;
      }
      for (const h of hscroll) h.base = docTop(h.track);

      // Zoom: tâm phóng là giữa lòng chữ O (chữ in hoa: tâm hơi thấp hơn giữa hộp dòng);
      // dx/dy = khoảng cách từ chữ O tới giữa màn hình, để vừa phóng vừa kéo chữ O về giữa
      for (const z of zooms) {
        const ox = z.o.offsetLeft + z.o.offsetWidth / 2;
        const oy = z.o.offsetTop + z.o.offsetHeight * 0.54;
        z.text.el.style.transformOrigin = `${ox}px ${oy}px`;
        z.dx = window.innerWidth / 2 - (z.text.el.offsetLeft + ox);
        z.dy = vh / 2 - (z.text.el.offsetTop + oy);
      }

      // Chữ phản ứng theo con trỏ: tâm từng chữ (toạ độ tài liệu, bỏ qua transform) và bán kính ảnh hưởng theo cỡ chữ
      for (const g of prox) {
        g.r = parseFloat(getComputedStyle(g.el).fontSize) * 0.95;
        for (const c of g.chars) {
          c.x = docLeft(c.el) + c.el.offsetWidth / 2;
          c.y = docTop(c.el) + c.el.offsetHeight / 2;
        }
        g.top = Math.min(...g.chars.map((c) => c.y)) - g.r;
        g.bottom = Math.max(...g.chars.map((c) => c.y)) + g.r;
      }
      for (const b of bands) b.w = (b.track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      // Khoảng tách tối đa giữa các tầng tỉ lệ theo cỡ tấm (cỡ tấm do CSS quyết định theo màn hình)
      for (const s of stack3d) s.gapMax = Math.max(36, (s.plates[0]?.offsetWidth ?? 300) * 0.19);
      schedule();
    };

    let lastY = window.scrollY;
    let vel = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      for (const t of bar) set(t, "--p", (max > 0 ? y / max : 0).toFixed(4));
      if (y > 8 !== root.hasAttribute("data-scrolled")) root.toggleAttribute("data-scrolled", y > 8);

      // Bắt đầu sáng khi mép trên ở 95% màn hình, sáng hết khi lên tới 55%
      for (const t of scrub) set(t, "--scrub", clamp((vh * 0.95 - (t.top - y)) / (vh * 0.4)).toFixed(3));
      for (const t of scrolled) set(t, "--sp", clamp((vh - (t.top - y)) / (vh + t.h)).toFixed(3));

      // Vận tốc làm mượt; còn trớn thì vẽ tiếp khung sau cho tới khi về 0
      vel += (y - lastY - vel) * 0.2;
      lastY = y;
      if (Math.abs(vel) < 0.05) vel = 0;

      // Git graph. Ngang: section cao thêm đúng bằng quãng trượt, tiến độ = đã cuộn qua đầu section / quãng trượt.
      // c = vị trí giữa màn hình (ngang) hoặc 60% chiều cao màn hình (dọc), đổi sang hệ toạ độ của track:
      // đường main tô cam tới c, nút nào đã nằm trước c thì sáng lên và bung các commit
      for (const h of hscroll) {
        let c: number;
        if (h.dist) {
          const p = clamp((y - h.top) / h.dist);
          set(h, "--hp", p.toFixed(4));
          c = p * h.dist + h.vw * 0.5;
        } else {
          c = y + vh * 0.6 - h.base;
        }
        set(h, "--fill", clamp((c - h.start) / h.len).toFixed(4));
        let passed = 0;
        for (const n of h.nodes) {
          const on = n.at + 24 < c ? "1" : "";
          if (on) passed++;
          if (n.v !== on) n.el.classList.toggle("is-passed", (n.v = on) === "1");
        }
        const label = pad(Math.min(h.jobs, Math.max(1, passed)));
        if (h.count && h.count.textContent !== label) h.count.textContent = label;
      }

      // Zoom xuyên chữ: tăng tốc dần (bậc 3) như camera lao vào
      for (const z of zooms) {
        const p = clamp((y - z.top) / Math.max(1, z.h - vh));
        set(z, "--zp", p.toFixed(4));
        const e = Math.min(1, p * 1.5);
        const move = `translate(${(z.dx * e).toFixed(1)}px, ${(z.dy * e).toFixed(1)}px)`;
        set(z.text, "transform", `${move} scale(${(1 + p ** 3 * 120).toFixed(3)})`);
      }

      // Chồng tầng: 14% đầu tách các tầng ra (khít → exploded), phần còn lại chia đều cho từng tầng, từ đáy lên đỉnh
      for (const s of stack3d) {
        const p = clamp((y - s.top) / Math.max(1, s.h - vh));
        const k = clamp(p / 0.14);
        const e = k * k * (3 - 2 * k);
        set(s, "--gap", `${(10 + e * (s.gapMax - 10)).toFixed(1)}px`);
        set(s.e, "--e", e.toFixed(3));
        s.scrolled = p < 0.14 ? -1 : Math.min(s.plates.length - 1, Math.floor(((p - 0.14) / 0.8) * s.plates.length));
        openLayer(s);
      }

      // Cuộn mà con trỏ đứng yên: chữ dưới con trỏ đổi theo vị trí mới
      if (pointer.active && prox.length && !proxFrame) proxFrame = requestAnimationFrame(proxStep);

      // Chồng thẻ: thẻ i bị đè dần khi thẻ i+1 đi từ đáy màn hình lên tới chỗ dính của nó
      stacks.forEach((cards, s) => {
        cards.forEach((c, i) => {
          const next = stackTops[s]?.[i + 1];
          const cover = next ? clamp((y - (next.top - vh)) / (vh - next.stick)) : 0;
          set(c, "--cover", cover.toFixed(3));
        });
      });

      // Cuộn xuống quá màn đầu thì thu header, cuộn lên thì hiện lại
      const hide = y > vh * 0.6 && vel > 0.5;
      if (hide || vel < -0.5 || y < vh * 0.6) {
        if (hide !== root.hasAttribute("data-hide-header")) root.toggleAttribute("data-hide-header", hide);
      }

      if (vel !== 0) schedule();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    listen(window, "scroll", schedule, { passive: true });
    listen(window, "resize", measure);
    // Font tải xong, ảnh có kích thước, nội dung đổi… làm trang cao/thấp đi: đo lại
    let pendingMeasure = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pendingMeasure);
      pendingMeasure = requestAnimationFrame(measure);
    });
    ro.observe(document.body);

    // Hiệu ứng con trỏ: chỉ bật với chuột (màn hình cảm ứng không có hover)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $("[data-spotlight]").forEach((el) =>
        listen(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }),
      );

      $("[data-magnetic]").forEach((el) => {
        listen(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.3;
          const y = (e.clientY - r.top - r.height / 2) * 0.3;
          el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        });
        listen(el, "pointerleave", () => (el.style.transform = ""));
      });

      // Nút: lớp màu bung ra từ đúng điểm con trỏ đi vào, thu về điểm con trỏ đi ra
      $(".btn").forEach((el) => {
        const at = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--x", `${e.clientX - r.left}px`);
          el.style.setProperty("--y", `${e.clientY - r.top}px`);
        };
        listen(el, "pointerenter", at);
        listen(el, "pointerleave", at);
      });

      // Chồng tầng: trỏ vào một dòng thì mở tầng đó (rời danh sách thì về theo cuộn); con trỏ trên sân khấu làm chồng nghiêng
      for (const s of stack3d) {
        for (const r of s.rows) {
          listen(r, "pointerenter", () => {
            s.hover = Number(r.dataset.layer);
            openLayer(s);
          });
        }
        const list = s.el.querySelector<HTMLElement>(".stk-list");
        if (list)
          listen(list, "pointerleave", () => {
            s.hover = -1;
            openLayer(s);
          });
        listen(s.stage, "pointermove", (e) => {
          const r = s.stage.getBoundingClientRect();
          s.el.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
          s.el.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
        });
        listen(s.stage, "pointerleave", () => {
          s.el.style.setProperty("--tx", "0");
          s.el.style.setProperty("--ty", "0");
        });
      }

      if (prox.length) {
        listen(
          window,
          "pointermove",
          (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.active = true;
            if (!proxFrame) proxFrame = requestAnimationFrame(proxStep);
          },
          { passive: true },
        );
        listen(document.documentElement, "pointerleave", () => {
          pointer.active = false;
          if (!proxFrame) proxFrame = requestAnimationFrame(proxStep);
        });
      }

      $("[data-tilt]").forEach((el) => {
        listen(el, "pointermove", (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(1100px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
        });
        listen(el, "pointerleave", () => (el.style.transform = ""));
      });
    }

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      offs.forEach((off) => off());
      io.disconnect();
      navIO.disconnect();
      ro.disconnect();
      bandIO.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pendingMeasure);
      cancelAnimationFrame(proxFrame);
      cancelAnimationFrame(bandFrame);
    };
  }, [pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
}

// Vị trí trong tài liệu theo layout (không tính transform), nên phần tử đang trôi/parallax vẫn đo đúng
function docTop(el: HTMLElement) {
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
  return y;
}

function docLeft(el: HTMLElement) {
  let x = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) x += n.offsetLeft;
  return x;
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
