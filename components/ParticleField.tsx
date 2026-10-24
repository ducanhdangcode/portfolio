"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*
 * Nền 3D "đồ thị tri thức", vẽ bằng WebGL thuần (không thư viện, vài KB):
 *   - Bụi: hơn chục nghìn hạt nhỏ; mỗi hạt có vị trí trên mặt cầu (phân bố Fibonacci) và trên một mặt sóng,
 *     vertex shader trộn hai vị trí theo uMorph nên CPU không tính gì cho từng hạt.
 *   - Đồ thị: vài trăm nút (hub) to hơn, mỗi nút nối tới các nút gần nhất bằng đường mảnh.
 *   - Nhãn: children (nhãn công nghệ dựng sẵn ở server) gắn vào một số hub, vị trí chiếu bằng đúng phép quay của shader.
 * Phần tử có data-orb là "neo": khi neo ở gần giữa màn hình, mọi thứ tụ thành quả cầu đúng tâm và cỡ của neo
 * (CSS quyết định quả cầu nằm đâu, to bao nhiêu ở từng breakpoint). Cuộn xa neo thì hạt đổ xuống thành mặt sóng.
 * Con trỏ xoay quả cầu, cuộn nhanh thì bề mặt gợn mạnh hơn.
 *
 * Hiệu năng: chỉ khởi tạo sau khi trang tải xong và trình duyệt rảnh; chỉ chạy khi có GPU thật (bỏ qua WebGL
 * giả lập bằng CPU); DPR tối đa 1.5; tối đa 60 khung/giây; tự dừng khi tab ẩn; bỏ qua hẳn khi bật giảm chuyển động,
 * tiết kiệm dữ liệu hoặc máy ít RAM.
 */

type Api = { measure: () => void; stop: () => void };

export function ParticleField({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = ref.current;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || reduce || nav.connection?.saveData || (nav.deviceMemory ?? 8) < 2) return;

    // Tạo WebGL context là một tác vụ nặng (vài chục ms trên máy thật, hơn trên máy yếu). Không làm trong lúc trang
    // đang tải: chờ tải xong, rồi dựng ở lúc rảnh ngay khi người dùng tương tác lần đầu, hoặc sau 2.5 giây.
    // Quả cầu bắt đầu ở dạng mặt sóng rồi tụ lại, nên việc xuất hiện sau một nhịp trông như màn mở đầu có chủ ý.
    let idle = 0;
    let timer = 0;
    const labels = [...(labelsRef.current?.children ?? [])] as HTMLElement[];
    const triggers = ["pointermove", "pointerdown", "keydown", "wheel"] as const;
    const start = () => {
      if (!api.current) api.current = run(canvas, labels);
    };
    const kick = () => {
      window.clearTimeout(timer);
      triggers.forEach((t) => window.removeEventListener(t, kick));
      idle = window.requestIdleCallback?.(start, { timeout: 1000 }) ?? window.setTimeout(start, 50);
    };
    const armed = () => {
      timer = window.setTimeout(kick, 2500);
      triggers.forEach((t) => window.addEventListener(t, kick, { once: true, passive: true }));
    };
    if (document.readyState === "complete") armed();
    else window.addEventListener("load", armed, { once: true });
    return () => {
      window.removeEventListener("load", armed);
      triggers.forEach((t) => window.removeEventListener(t, kick));
      window.clearTimeout(timer);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
      api.current?.stop();
      api.current = null;
    };
  }, []);

  // Trang mới có neo khác (hoặc không có): đo lại sau khi DOM của trang đã render
  useEffect(() => {
    api.current?.measure();
  }, [pathname]);

  return (
    <>
      <canvas ref={ref} className="particles" aria-hidden="true" />
      <div ref={labelsRef} className="graph-labels" aria-hidden="true">
        {children}
      </div>
    </>
  );
}

// Camera đặt ở z = CAM nhìn về -z; FOCAL càng lớn thì góc nhìn càng hẹp
const CAM = 3.4;
const FOCAL = 1.6;
// Hub và nhãn nằm hơi ngoài lớp bụi
const HUB_R = 1.06;
const LABEL_R = 1.2;

const VERT = /* glsl */ `
attribute vec3 aSphere;
attribute vec2 aPlane;
attribute float aRand;

uniform float uTime;
uniform float uMorph;
uniform float uAspect;
uniform float uSize;
uniform float uVel;
// Dùng chung với fragment shader (mặc định mediump) nên phải cùng độ chính xác, nếu không sẽ không link được
uniform mediump float uKind;
uniform vec2 uMouse;
uniform vec3 uOrb;

varying float vAlpha;
varying float vM;

const float CAM = ${CAM.toFixed(2)};
const float FOCAL = ${FOCAL.toFixed(2)};

// Simplex noise 3D: Ashima Arts / Stefan Gustavson (MIT)
vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 permute(vec4 x) { return mod289(((x * 34.) + 1.) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - .85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1. / 6., 1. / 3.);
  const vec4 D = vec4(0., .5, 1., 2.);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1. - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0., i1.z, i2.z, 1.)) + i.y + vec4(0., i1.y, i2.y, 1.)) + i.x + vec4(0., i1.x, i2.x, 1.));
  vec3 ns = .142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49. * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7. * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1. - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2. + 1.;
  vec4 s1 = floor(b1) * 2. + 1.;
  vec4 sh = -step(h, vec4(0.));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.);
  m = m * m;
  return 42. * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1., 0., 0., 0., c, s, 0., -s, c); }

void main() {
  float t = uTime;
  // 0: bụi, 1: nút đồ thị, 2: cạnh nối. Nút và cạnh không gợn theo nhiễu để nhãn HTML khớp vị trí.
  float dust = step(uKind, .5);

  // Quả cầu: bề mặt "thở" theo nhiễu, xoay chậm và nghiêng theo con trỏ
  vec3 s = aSphere;
  s *= 1. + dust * snoise(s * 1.5 + vec3(0., 0., t * .2)) * (.12 + uVel * .3);
  s = rotY(t * .07 + uMouse.x * .6) * rotX(.35 - uMouse.y * .4) * s;
  vec3 ps = vec3(uOrb.xy, 0.) + s * uOrb.z;

  // Mặt sóng: lưới trải từ sát camera tới đường chân trời, rộng vừa khít màn hình ở mọi độ sâu
  float depth = aPlane.y;
  float z = mix(1.4, -3.6, depth);
  vec3 pp = vec3(aPlane.x * (CAM - z) * uAspect / FOCAL * 1.15 + uMouse.x * .25, 0., z);
  pp.y = -1.05
    + sin(pp.x * 1.1 + t * .55) * .1
    + sin(z * 1.9 - t * .75) * .09
    + snoise(vec3(pp.xz * .7, t * .1)) * (.16 + uVel * .3);

  // Mỗi hạt chuyển trạng thái lệch nhịp một chút nên quả cầu "đổ" xuống chứ không biến hình cùng lúc
  float m = smoothstep(0., 1., clamp(uMorph * 1.6 - aRand * .6, 0., 1.));
  vec3 p = mix(ps, pp, m);
  vM = m;

  float w = CAM - p.z;
  gl_Position = vec4(p.x * FOCAL / uAspect, p.y * FOCAL, 0., w);
  gl_PointSize = uSize * mix(.55 + aRand * .9, 2.2 + aRand * 1.4, step(.5, uKind)) * CAM / w;

  // Mặt sau quả cầu và phần xa của mặt sóng mờ đi để có chiều sâu; hạt lấp lánh nhẹ
  float front = mix(.14, 1., smoothstep(-.8, .9, s.z));
  float near = mix(1., .1, depth);
  vAlpha = mix(front, near, m) * (.75 + .25 * sin(t * 1.7 + aRand * 60.));
}
`;

const FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform float uAlpha;
uniform float uKind;
varying float vAlpha;
varying float vM;

void main() {
  float a;
  if (uKind > 1.5) {
    // Cạnh nối: mảnh, mờ, biến mất khi quả cầu đã đổ thành mặt sóng
    a = vAlpha * uAlpha * .3 * (1. - vM);
  } else {
    a = (1. - smoothstep(.12, .5, length(gl_PointCoord - .5))) * vAlpha * uAlpha;
  }
  gl_FragColor = vec4(uColor * a, a);
}
`;

function compile(gl: WebGLRenderingContext) {
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// Điểm thứ i trong n điểm phân bố đều trên mặt cầu đơn vị (xoắn Fibonacci)
function fib(i: number, n: number): [number, number, number] {
  const y = 1 - (2 * (i + 0.5)) / n;
  const r = Math.sqrt(1 - y * y);
  return [Math.cos(GOLDEN * i) * r, y, Math.sin(GOLDEN * i) * r];
}

function run(canvas: HTMLCanvasElement, labels: HTMLElement[]): Api | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    // Máy không có GPU (WebGL chạy bằng CPU) thì không tạo context: nền 3D lúc đó chỉ tốn CPU, giật cả trang
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return null;
  // Chrome vẫn cho tạo context trên SwiftShader dù có cờ trên: kiểm tra thêm tên renderer
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  const prog = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) && compile(gl);
  if (!prog) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  gl.useProgram(prog);

  // Máy yếu / màn hình nhỏ: ít hạt hơn
  const small = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;
  const cols = small ? 110 : 170;
  const rows = small ? 64 : 96;
  const count = cols * rows;
  const hubs = small ? 90 : 160;

  // Mỗi hạt 6 số: vị trí trên mặt cầu (xyz), trên mặt sóng (x -1..1, độ sâu 0..1), số ngẫu nhiên.
  // Hạt thứ i đi từ cực trên xuống cực dưới mặt cầu, và từ chân trời về phía camera trên mặt sóng;
  // vị trí trên mặt sóng lệch ngẫu nhiên trong ô lưới để không xếp thành vệt thẳng.
  const dust = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const o = i * 6;
    dust.set(fib(i, count), o);
    dust[o + 3] = (((i % cols) + Math.random() - 0.5) / (cols - 1)) * 2 - 1;
    dust[o + 4] = 1 - (Math.floor(i / cols) + Math.random() - 0.5) / (rows - 1);
    dust[o + 5] = Math.random();
  }

  // Nút đồ thị: phân bố đều trên mặt cầu, rơi xuống vị trí ngẫu nhiên trên mặt sóng
  const hubPos = Array.from({ length: hubs }, (_, i) => fib(i, hubs));
  const hub = new Float32Array(hubs * 6);
  hubPos.forEach(([x, y, z], i) => {
    hub.set([x * HUB_R, y * HUB_R, z * HUB_R, Math.random() * 2 - 1, Math.random(), Math.random()], i * 6);
  });

  // Cạnh: mỗi nút nối tới 3 nút gần nhất (bỏ cạnh trùng)
  const edges = new Set<string>();
  hubPos.forEach((a, i) => {
    hubPos
      .map((b, j) => [j, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2] as const)
      .filter(([j]) => j !== i)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 3)
      .forEach(([j]) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  const lines = new Uint16Array([...edges].flatMap((e) => e.split("-").map(Number)));

  const buffer = (data: Float32Array) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  };
  const dustBuf = buffer(dust);
  const hubBuf = buffer(hub);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, lines, gl.STATIC_DRAW);

  const locs = [
    [gl.getAttribLocation(prog, "aSphere"), 3, 0],
    [gl.getAttribLocation(prog, "aPlane"), 2, 12],
    [gl.getAttribLocation(prog, "aRand"), 1, 20],
  ] as const;
  locs.forEach(([loc]) => gl.enableVertexAttribArray(loc));
  const bind = (b: WebGLBuffer | null) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    for (const [loc, size, offset] of locs) gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 24, offset);
  };

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const uTime = u("uTime");
  const uMorph = u("uMorph");
  const uAspect = u("uAspect");
  const uSize = u("uSize");
  const uVel = u("uVel");
  const uKind = u("uKind");
  const uMouse = u("uMouse");
  const uOrb = u("uOrb");
  const uColor = u("uColor");
  const uAlpha = u("uAlpha");

  gl.enable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);

  // Màu lấy từ CSS (color: var(--accent-ink) trên canvas) nên tự đổi theo theme.
  // Nền tối: cộng sáng (chỗ hạt dày phát sáng); nền sáng: phủ thường để hạt đậm màu.
  let dark = true;
  const readTheme = () => {
    const [r, g, b] = (getComputedStyle(canvas).color.match(/[\d.]+/g) ?? ["255", "90", "31"]).map(Number);
    gl.uniform3f(uColor, r / 255, g / 255, b / 255);
    dark = document.documentElement.dataset.theme !== "light";
    if (dark) gl.blendFunc(gl.ONE, gl.ONE);
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  };
  readTheme();
  const themeObserver = new MutationObserver(readTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Đo kích thước canvas và vị trí các neo (toạ độ trong tài liệu); chỉ chạy khi resize / đổi trang
  let vw = 0;
  let vh = 0;
  let orbs: { cx: number; cy: number; r: number }[] = [];
  const measure = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w !== vw || h !== vh) {
      vw = w;
      vh = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uAspect, w / h);
      gl.uniform1f(uSize, 2.6 * dpr);
    }
    // Toạ độ theo layout (bỏ qua transform), nên neo nằm trong khối đang trượt vào hay nút "hút" con trỏ vẫn đo đúng
    orbs = [...document.querySelectorAll<HTMLElement>("[data-orb]")].map((el) => {
      let x = 0;
      let y = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft;
        y += n.offsetTop;
      }
      return { cx: x + el.offsetWidth / 2, cy: y + el.offsetHeight / 2, r: el.offsetWidth / 2 };
    });
  };
  measure();
  let pending = 0;
  const remeasure = () => {
    if (!pending) pending = requestAnimationFrame(() => ((pending = 0), measure()));
  };
  const resizeObserver = new ResizeObserver(remeasure);
  resizeObserver.observe(document.body);
  window.addEventListener("resize", remeasure);

  let mx = 0;
  let my = 0;
  let tmx = 0;
  let tmy = 0;
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    tmx = (e.clientX / vw) * 2 - 1;
    tmy = 1 - (e.clientY / vh) * 2;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // Mỗi nhãn gắn với một hub, rải đều quanh quả cầu
  const anchors = labels.map((_, k) => hubPos[Math.floor(((k + 0.5) * hubs) / labels.length)]);
  let labelsShown = false;

  // Bắt đầu ở dạng mặt sóng rồi tụ lại thành quả cầu: màn mở đầu
  let morph = 1;
  let vel = 0;
  let lastY = window.scrollY;
  const orb = [0, 0, 1];
  const t0 = performance.now();
  let last = 0;
  let raf = 0;
  let shown = false;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Màn 120/144Hz: vẫn chỉ vẽ ~60 khung/giây
    if (now - last < 15) return;
    last = now;

    const y = window.scrollY;
    vel += (Math.min((Math.abs(y - lastY) / vh) * 14, 1) - vel) * 0.08;
    lastY = y;
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;

    // Neo nào càng gần giữa màn hình thì càng "cầu"; xa hơn ~1 màn hình thì thành mặt sóng hẳn
    let presence = 0;
    let target: (typeof orbs)[number] | null = null;
    for (const o of orbs) {
      const p = 1 - smooth(vh * 0.3, vh * 0.95, Math.abs(o.cy - y - vh / 2));
      if (p > presence) {
        presence = p;
        target = o;
      }
    }
    morph += (1 - presence - morph) * 0.06;
    // px trên màn hình → đơn vị thế giới ở mặt phẳng z = 0
    const k = (2 * CAM) / (FOCAL * vh);
    if (target) {
      orb[0] = (target.cx - vw / 2) * k;
      orb[1] = -(target.cy - y - vh / 2) * k;
      orb[2] = target.r * k;
    }

    const t = (now - t0) / 1000;
    gl.uniform1f(uTime, t);
    gl.uniform1f(uMorph, morph);
    gl.uniform1f(uVel, vel);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform3f(uOrb, orb[0], orb[1], orb[2]);
    // Mặt sóng nằm dưới nội dung nên mờ hơn quả cầu để chữ vẫn dễ đọc
    gl.uniform1f(uAlpha, dark ? 0.85 - morph * 0.56 : 0.7 - morph * 0.4);
    gl.clear(gl.COLOR_BUFFER_BIT);

    bind(dustBuf);
    gl.uniform1f(uKind, 0);
    gl.drawArrays(gl.POINTS, 0, count);
    bind(hubBuf);
    gl.uniform1f(uKind, 2);
    gl.drawElements(gl.LINES, lines.length, gl.UNSIGNED_SHORT, 0);
    gl.uniform1f(uKind, 1);
    gl.drawArrays(gl.POINTS, 0, hubs);

    // Nhãn: cùng phép quay với shader (rotY · rotX), chiếu phối cảnh rồi đặt bằng transform.
    // Mờ dần ở mặt sau quả cầu và biến mất khi quả cầu đổ thành mặt sóng.
    const fade = 1 - smooth(0.05, 0.3, morph);
    if (fade > 0 || labelsShown) {
      labelsShown = fade > 0;
      const ay = t * 0.07 + mx * 0.6;
      const ax = 0.35 - my * 0.4;
      const [cy, sy, cx, sx] = [Math.cos(ay), Math.sin(ay), Math.cos(ax), Math.sin(ax)];
      labels.forEach((el, i) => {
        const [x0, y0, z0] = anchors[i];
        const y1 = cx * y0 - sx * z0;
        const z1 = sx * y0 + cx * z0;
        const x2 = cy * x0 + sy * z1;
        const z2 = -sy * x0 + cy * z1;
        const r = orb[2] * LABEL_R;
        const w = CAM - z2 * r;
        const sxp = ((((orb[0] + x2 * r) * FOCAL) / (vw / vh) / w + 1) / 2) * vw;
        const syp = ((1 - ((orb[1] + y1 * r) * FOCAL) / w) / 2) * vh;
        const scale = (CAM / w) * 0.9;
        el.style.transform = `translate3d(${sxp.toFixed(1)}px,${syp.toFixed(1)}px,0) translate(-50%,-50%) scale(${scale.toFixed(3)})`;
        el.style.opacity = (fade * smooth(-0.35, 0.45, z2)).toFixed(3);
      });
    }

    if (!shown) {
      shown = true;
      canvas.classList.add("is-on");
      document.documentElement.classList.add("gl");
    }
  };
  raf = requestAnimationFrame(frame);

  const stop = () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pending);
    themeObserver.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("pointermove", onPointer);
    canvas.removeEventListener("webglcontextlost", stop);
    canvas.classList.remove("is-on");
    document.documentElement.classList.remove("gl");
  };
  // Mất context (driver reset, quá nhiều tab WebGL): dừng hẳn, trang vẫn đầy đủ không có nền 3D
  canvas.addEventListener("webglcontextlost", stop);

  return { measure, stop };
}
