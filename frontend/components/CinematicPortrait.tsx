"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Cinematic hero portrait — the whole face is rendered as thousands of fine
 * dust particles sampled from the photo (dense in bright areas, dissolving to
 * black at the edges). On hover, a crisp circular window follows the cursor and
 * reveals the real photo through the dust, ringed by an amber cursor.
 * Needs a same-origin image (canvas pixel sampling).
 */
export default function CinematicPortrait({
  src,
  alt,
  colorSrc,
}: {
  src: string;
  alt: string;
  colorSrc?: string;
}) {
  const reduce = useReducedMotion();
  // Double-click swaps the dust view for the full-colour photo (and back).
  const [revealed, setRevealed] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number; y: number } | null>(null);
  const renderRef = useRef<((animate: boolean) => void) | null>(null);

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
    let hasImg = false;

    type Dot = { x: number; y: number; b: number; ph: number; amp: number };
    let dots: Dot[] = [];

    const revealR = () => Math.min(W, H) * 0.24;

    // Dust ring that traces the reveal window — a dense feathered band of specks
    // that spray outward from the circle edge (fixed once, animated in render).
    type RingP = { ang: number; off: number; s: number; ph: number; b: number };
    const ring: RingP[] = [];
    const RING_N = 900;
    for (let i = 0; i < RING_N; i++) {
      // Offset biased into a bright core band at the edge with an outward spray.
      const spray = Math.pow(Math.random(), 2.4);
      const off = (Math.random() - 0.5) * 3 + spray * 22;
      ring.push({
        ang: Math.random() * Math.PI * 2,
        off,
        s: 0.6 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        b: 1 - spray * 0.75, // brighter near the edge, dimmer as it sprays out
      });
    }

    const drawImgToOff = (img: HTMLImageElement) => {
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

      dots = [];
      let data: Uint8ClampedArray;
      try {
        data = offctx.getImageData(0, 0, W, H).data;
      } catch {
        hasImg = false;
        return;
      }
      hasImg = true;
      const step = 3;
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          const i = (y * W + x) * 4;
          const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (b < 40) continue; // dark background → no dust
          // probability of keeping scales with brightness (denser highlights)
          if (Math.random() > 0.35 + (b / 255) * 0.65) continue;
          dots.push({
            x: x + (Math.random() - 0.5) * step,
            y: y + (Math.random() - 0.5) * step,
            b,
            ph: Math.random() * Math.PI * 2,
            amp: 1.3 + Math.random() * 2.8,
          });
        }
      }
      // cap for performance
      if (dots.length > 7000) {
        for (let i = dots.length - 1; i > 0; i--) {
          const j = (Math.random() * (i + 1)) | 0;
          [dots[i], dots[j]] = [dots[j], dots[i]];
        }
        dots.length = 7000;
      }
    };

    let time = 0;
    const render = (animate: boolean) => {
      if (animate) time += 0.02;
      ctx.clearRect(0, 0, W, H);
      if (!hasImg) return;
      const m = mouse.current;
      const rr = revealR();

      // dust
      for (let k = 0; k < dots.length; k++) {
        const d = dots[k];
        let x = d.x;
        let y = d.y;
        if (animate) {
          x += Math.cos(time * 0.8 + d.ph) * d.amp;
          y += Math.sin(time * 0.7 + d.ph * 1.3) * d.amp;
        }
        // clear dust inside the reveal window
        if (m) {
          const dx = x - m.x;
          const dy = y - m.y;
          if (dx * dx + dy * dy < rr * rr) continue;
        }
        const tw = animate ? 0.5 + 0.5 * Math.sin(time * 2.4 + d.ph * 2.5) : 1;
        const a = Math.min(0.95, (d.b / 255) * 1.05) * tw;
        const g = Math.min(255, 205 + ((d.b / 255) * 45) | 0);
        ctx.fillStyle = `rgba(${g},${g},${Math.min(255, g + 6)},${a})`;
        ctx.fillRect(x, y, 1.25, 1.25);
      }

      // spotlight reveal — crisp photo through the dust at the cursor
      if (m) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, rr, 0, Math.PI * 2);
        ctx.clip();
        ctx.filter = "grayscale(1) contrast(1.15) brightness(0.98)";
        ctx.drawImage(off, 0, 0, W, H, 0, 0, W, H);
        ctx.filter = "none";
        // soft inner edge so the reveal blends into the dust
        const vg = ctx.createRadialGradient(m.x, m.y, rr * 0.62, m.x, m.y, rr);
        vg.addColorStop(0, "rgba(0,0,0,0)");
        vg.addColorStop(1, "rgba(5,6,10,0.9)");
        ctx.fillStyle = vg;
        ctx.fillRect(m.x - rr, m.y - rr, rr * 2, rr * 2);
        ctx.restore();

        // dusty particle border around the reveal window
        for (let i = 0; i < ring.length; i++) {
          const p = ring[i];
          // slow drift + shimmer so the ring feels alive
          const a = p.ang + (animate ? time * 0.06 * (i % 2 ? 1 : -1) : 0);
          const jitter = animate ? Math.sin(time * 2.2 + p.ph) * 1.4 : 0;
          const r = rr + p.off + jitter;
          const x = m.x + Math.cos(a) * r;
          const y = m.y + Math.sin(a) * r;
          const tw = animate ? 0.5 + 0.5 * Math.sin(time * 3 + p.ph * 3) : 1;
          const al = Math.min(0.95, p.b * 0.95 * tw);
          ctx.fillStyle = `rgba(244,246,252,${al})`;
          ctx.fillRect(x, y, p.s, p.s);
        }

        ctx.beginPath();
        ctx.arc(m.x, m.y, 15, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232,164,66,0.85)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    renderRef.current = render;

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
      if (img.complete && img.naturalWidth) drawImgToOff(img);
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

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (reduce) renderRef.current?.(false);
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mouse.current = null;
        if (reduce) renderRef.current?.(false);
      }}
      onDoubleClick={() => colorSrc && setRevealed((v) => !v)}
      className="relative aspect-[4/5] w-full rounded-md"
      style={{
        background: "transparent",
        cursor: colorSrc ? "pointer" : "crosshair",
      }}
      aria-label={alt}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Full-colour photo — fades in on double-click, fades back out on the next. */}
      {colorSrc && (
        <img
          src={colorSrc}
          alt={alt}
          className={`absolute inset-0 h-full w-full rounded-md object-cover object-top transition-opacity duration-700 ${
            revealed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-5 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-white/45 transition-opacity ${
          revealed ? "opacity-0" : "opacity-100"
        }`}
      >
        {colorSrc ? "Double-click to reveal" : "UI/UX → Code"}
      </div>
    </div>
  );
}
