"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mounts Lenis for inertial smooth scrolling and upgrades in-page anchor
 * links to eased scrolls (offset for the sticky nav). Skipped entirely when
 * the user prefers reduced motion — native scroll takes over.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    // Expose so overlays (e.g. the gallery lightbox) can pause/resume scroll.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      (window as unknown as { lenis?: Lenis }).lenis = undefined;
    };
  }, []);

  return null;
}
