"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Cinematic hero portrait — the photo is shown CRISP inside a glowing circular
 * window; fine dust particles emanate from the window's edge and dissolve
 * outward into black (denser where the silhouette is bright). An amber cursor
 * ring nudges nearby particles. Needs a same-origin image (pixel sampling).
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
    let data: Uint8ClampedArray | null = null;

    const geom = () => {
      const R = Math.min(W, H) * 0.36;
      return { cx: W / 2, cy: H * 0.44, R };
    };

    const brightnessAt = (x: number, y: number) => {
      if (!data) return 140;
      const xi = Math.max(0, Math.min(W - 1, x | 0));
      const yi = Math.max(0, Math.min(H - 1, y | 0));
      const i = (yi * W + xi) * 4;
      return (data[i] + data[i + 1] + data[i + 2]) / 3;
    };

    type P = {
      ang: number;
      rad: number;
      spd: number;
      life: number;
      max: number;
      b: number;
      wob: number;
    };
    let ps: P[] = [];

    const spawn = (): P => {
      const { cx, cy, R } = geom();
      const ang = Math.random() * Math.PI * 2;
      const rad = R * (0.92 + Math.random() * 0.14);
      const b = brightnessAt(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
      return {
        ang,
        rad,
        spd: 0.12 + Math.random() * 0.5,
        life: Math.random() * 40,
        max: 55 + Math.random() * 130,
        b,
        wob: (Math.random() - 0.5) * 0.006,
      };
    };

    const drawImg = (img: HTMLImageElement) => {
      off.width = W;
      off.height = H;
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
      try {
        data = offctx.getImageData(0, 0, W, H).data;
      } catch {
        data = null;
      }
    };

    const drawCrisp = () => {
      const { cx, cy, R } = geom();
      // outer glow
      const glow = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.5);
      glow.addColorStop(0, "rgba(122,145,255,0.10)");
      glow.addColorStop(1, "rgba(122,145,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - R * 1.5, cy - R * 1.5, R * 3, R * 3);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      ctx.filter = "grayscale(1) contrast(1.18) brightness(0.95)";
      ctx.drawImage(off, 0, 0, W, H, 0, 0, W, H);
      ctx.filter = "none";
      const vg = ctx.createRadialGradient(cx, cy - R * 0.1, R * 0.5, cx, cy, R);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(210,216,228,0.5)";
      ctx.lineWidth = 1.25;
      ctx.stroke();
    };

    const render = (animate: boolean) => {
      ctx.clearRect(0, 0, W, H);
      const { cx, cy, R } = geom();

      drawCrisp();

      const band = R * 1.05; // how far the dust reaches beyond the edge
      for (let k = 0; k < ps.length; k++) {
        const p = ps[k];
        if (animate) {
          p.rad += p.spd;
          p.ang += p.wob;
          p.life++;
        }
        const t = p.life / p.max;
        const beyond = Math.max(0, (p.rad - R) / band);
        const a = (1 - t) * Math.max(0, 1 - beyond) * (0.22 + 0.78 * (p.b / 255)) * 0.95;
        if (animate && (a <= 0.012 || t >= 1)) {
          ps[k] = spawn();
          continue;
        }
        let x = cx + Math.cos(p.ang) * p.rad;
        let y = cy + Math.sin(p.ang) * p.rad;
        const m = mouse.current;
        if (animate && m) {
          const dx = x - m.x;
          const dy = y - m.y;
          const dm = Math.hypot(dx, dy);
          if (dm < 60 && dm > 0.01) {
            const push = (1 - dm / 60) * 10;
            x += (dx / dm) * push;
            y += (dy / dm) * push;
          }
        }
        const g = Math.min(255, Math.round(190 + (p.b / 255) * 55));
        ctx.fillStyle = `rgba(${g},${g},${Math.min(255, g + 6)},${a})`;
        ctx.fillRect(x, y, 1.3, 1.3);
      }

      const m = mouse.current;
      if (m) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232,164,66,0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";

    const seedParticles = () => {
      const { R } = geom();
      const count = Math.min(1800, Math.round(R * 7));
      ps = Array.from({ length: count }, spawn);
    };

    const resize = () => {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (img.complete && img.naturalWidth) drawImg(img);
      seedParticles();
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
