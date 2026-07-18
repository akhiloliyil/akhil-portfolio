"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Cinematic hero portrait — the photo is shown crisp inside a glowing circular
 * window and dissolves into thousands of image-sampled dust particles around
 * it, on a black field. An amber cursor ring pushes the particles as it moves.
 * Uses a same-origin image (canvas pixel sampling requires it).
 */
export default function CinematicPortrait({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const off = document.createElement("canvas");
    const offctx = off.getContext("2d", { willReadFrequently: true });
    if (!offctx) return;

    let W = 0;
    let H = 0;
    let raf = 0;
    let ready = false;

    type Src = { x: number; y: number; b: number };
    type P = {
      x: number;
      y: number;
      ang: number;
      spd: number;
      life: number;
      max: number;
      b: number;
    };
    let sources: Src[] = [];
    let ps: P[] = [];

    const geom = () => ({
      cx: W / 2,
      cy: H * 0.44,
      R: Math.min(W, H) * 0.29,
    });

    const spawn = (): P => {
      const s = sources[(Math.random() * sources.length) | 0] ?? {
        x: W / 2,
        y: H / 2,
        b: 140,
      };
      const { cx, cy } = geom();
      return {
        x: s.x,
        y: s.y,
        ang: Math.atan2(s.y - cy, s.x - cx),
        spd: 0.05 + Math.random() * 0.35,
        life: Math.random() * 40,
        max: 70 + Math.random() * 150,
        b: s.b,
      };
    };

    const build = (img: HTMLImageElement) => {
      off.width = W;
      off.height = H;
      // cover-fit the image into WxH
      const ir = img.width / img.height;
      const cr = W / H;
      let dw: number;
      let dh: number;
      let dx: number;
      let dy: number;
      if (ir > cr) {
        dh = H;
        dw = H * ir;
        dx = (W - dw) / 2;
        dy = 0;
      } else {
        dw = W;
        dh = W / ir;
        dx = 0;
        dy = (H - dh) / 2;
      }
      offctx.clearRect(0, 0, W, H);
      offctx.drawImage(img, dx, dy, dw, dh);

      let data: Uint8ClampedArray;
      try {
        data = offctx.getImageData(0, 0, W, H).data;
      } catch {
        return; // tainted (cross-origin) — bail out of particles
      }

      const { cx, cy, R } = geom();
      sources = [];
      const step = 2;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const i = (y * W + x) * 4;
          const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (b < 40) continue; // skip near-black background
          const dist = Math.hypot(x - cx, y - cy);
          if (dist < R * 0.92) continue; // inside window → covered by crisp image
          if (dist > R * 2.3) continue; // too far out
          sources.push({ x, y, b });
        }
      }
      ps = Array.from(
        { length: Math.min(1500, Math.floor(sources.length * 0.9)) },
        spawn
      );
      ready = sources.length > 0;
    };

    const drawCrisp = () => {
      const { cx, cy, R } = geom();
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.filter = "grayscale(1) contrast(1.2) brightness(0.9)";
      ctx.drawImage(off, 0, 0, W, H, 0, 0, W, H);
      ctx.filter = "none";
      const vg = ctx.createRadialGradient(cx, cy - R * 0.1, R * 0.25, cx, cy, R);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = vg;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(214,219,229,0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const render = (animate: boolean) => {
      ctx.clearRect(0, 0, W, H);
      if (!ready) {
        drawCrisp();
        return;
      }
      const { cx, cy, R } = geom();
      for (let k = 0; k < ps.length; k++) {
        const p = ps[k];
        if (animate) {
          p.life++;
          p.x += Math.cos(p.ang) * p.spd;
          p.y += Math.sin(p.ang) * p.spd;
          const m = mouse.current;
          if (m) {
            const dxm = p.x - m.x;
            const dym = p.y - m.y;
            const dm = Math.hypot(dxm, dym);
            if (dm < 55 && dm > 0.01) {
              p.x += (dxm / dm) * 1.6;
              p.y += (dym / dm) * 1.6;
            }
          }
        }
        const dist = Math.hypot(p.x - cx, p.y - cy);
        const t = p.life / p.max;
        const distFade = Math.max(0, 1 - Math.max(0, dist - R) / (R * 1.25));
        const a = (1 - t) * distFade * (p.b / 255) * 0.9;
        if (animate && (a <= 0.012 || t >= 1)) {
          ps[k] = spawn();
          continue;
        }
        const g = Math.min(255, Math.round(185 + (p.b / 255) * 60));
        ctx.fillStyle = `rgba(${g},${g},${Math.min(255, g + 6)},${a})`;
        ctx.fillRect(p.x, p.y, 1.3, 1.3);
      }
      drawCrisp();
      const m = mouse.current;
      if (m) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232,164,66,0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (img.complete && img.naturalWidth) build(img);
    };

    const loop = () => {
      render(true);
      raf = requestAnimationFrame(loop);
    };

    img.onload = () => {
      resize();
      if (reduce) render(false);
      else loop();
    };
    img.onerror = () => {
      resize();
      render(false);
    };
    img.src = src;

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) render(false);
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [src, reduce]);

  return (
    <div
      ref={wrapRef}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => {
        mouse.current = null;
      }}
      className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md"
      style={{ background: "#05060a", cursor: "crosshair" }}
      aria-label={alt}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">
        UI/UX → Code
      </div>
    </div>
  );
}
