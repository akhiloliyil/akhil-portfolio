"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number; // normalized position, generated slightly outside [0,1] so
  y: number; // parallax drift never reveals an empty edge
  r: number;
  base: number; // base opacity
  speed: number; // twinkle speed
  phase: number;
  depth: number; // 0.3–1, parallax multiplier (closer stars move more)
};

const STAR_COUNT = 160;
const FIELD_PAD = 0.08;
const MAX_PARALLAX = 30; // px, at the pointer extremes
const PHOTO_PARALLAX = 0.4; // fraction of MAX_PARALLAX the photo itself shifts
const GLOW_RADIUS = 260; // px
const GLOW_EASE = 0.1; // position lerp per frame
const FADE_EASE = 0.08; // opacity lerp per frame

function makeStars(): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const depth = 0.3 + Math.random() * 0.7;
    stars.push({
      x: -FIELD_PAD + Math.random() * (1 + FIELD_PAD * 2),
      y: -FIELD_PAD + Math.random() * (1 + FIELD_PAD * 2),
      r: 0.4 + depth * 1.1 * Math.random() + 0.3,
      base: 0.35 + Math.random() * 0.55,
      speed: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      depth,
    });
  }
  return stars;
}

/**
 * Deep-space backdrop: the nebula photo (always on, slow pan/zoom, see
 * .nebula-photo) plus a canvas starfield that twinkles and drifts toward
 * the cursor with depth-based parallax, and a single soft glow that eases
 * toward the pointer — a restrained "spotlight," not a trail — fading in on
 * entry and out on leave. The glow and stars only paint in dark mode — they
 * don't read against the light-theme paper, where the photo is also dialled
 * down to a faint tint. Drop as the first child of any `relative` section.
 *
 * `parallax` swaps the backdrop from "absolute, stretched to the full
 * section" to "sticky, pinned at one viewport tall" — for sections much
 * taller than 100vh, the stretched version forces `background-size: cover`
 * to zoom the photo to cover the whole (huge) height, which reads as a
 * blown-up, stretched image. Pinning it at viewport height instead keeps
 * the photo at its natural scale and lets it drift past as a proper
 * parallax backdrop while the section scrolls.
 */
export default function NebulaBackground({
  parallax = false,
}: {
  parallax?: boolean;
} = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const section = wrap?.parentElement;
    if (!wrap || !layer || !canvas || !section) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars = makeStars();
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;
    let dark = document.documentElement.classList.contains("dark");
    let accentRGB = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim()
      .split(/\s+/)
      .join(", ");
    let glowTargetX = 0;
    let glowTargetY = 0;
    let glowX = 0;
    let glowY = 0;
    let glowOpacity = 0;
    let glowTargetOpacity = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGlow = () => {
      if (glowOpacity < 0.003) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const grad = ctx.createRadialGradient(
        glowX, glowY, 0,
        glowX, glowY, GLOW_RADIUS
      );
      grad.addColorStop(0, `rgba(${accentRGB}, ${0.16 * glowOpacity})`);
      grad.addColorStop(0.45, `rgba(${accentRGB}, ${0.07 * glowOpacity})`);
      grad.addColorStop(1, `rgba(${accentRGB}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(glowX, glowY, GLOW_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      if (!dark) return;
      drawGlow();
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        const px = s.x * width + curX * s.depth;
        const py = s.y * height + curY * s.depth;
        ctx.globalAlpha = Math.max(0, s.base * twinkle);
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (t: number) => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      glowX += (glowTargetX - glowX) * GLOW_EASE;
      glowY += (glowTargetY - glowY) * GLOW_EASE;
      glowOpacity += (glowTargetOpacity - glowOpacity) * FADE_EASE;
      layer.style.transform = `translate3d(${curX * PHOTO_PARALLAX}px, ${
        curY * PHOTO_PARALLAX
      }px, 0)`;
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      const rect = wrap.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      targetX = (px / rect.width - 0.5) * MAX_PARALLAX * 2;
      targetY = (py / rect.height - 0.5) * MAX_PARALLAX * 2;
      glowTargetX = px;
      glowTargetY = py;
      glowTargetOpacity = 1;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      glowTargetOpacity = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const mo = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      accentRGB = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()
        .split(/\s+/)
        .join(", ");
      if (reduce) draw(0);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      ro.disconnect();
      mo.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={
        parallax
          ? "pointer-events-none sticky top-0 -mb-[100vh] h-screen overflow-hidden"
          : "pointer-events-none absolute inset-0 overflow-hidden"
      }
    >
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <div className="nebula-photo" />
        <canvas ref={canvasRef} className="nebula-stars" />
      </div>
    </div>
  );
}
