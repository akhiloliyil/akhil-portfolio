"use client";

import { useEffect } from "react";

/**
 * Page-wide scroll entrance. Every top-level <section> below the hero has its
 * direct children rise + fade in (staggered) as the section scrolls into view.
 *
 * It animates the children, never the <section> itself — the pinned
 * Industries track and the sticky Toolkit orbit both depend on the section
 * box being untransformed. Sections already on screen at load are left alone
 * (no flash), and nothing is hidden until JS runs, so content never goes
 * missing if this fails. Classes are removed once the transition finishes.
 */
export default function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section:not(#top)")
    ).filter((s) => s.getBoundingClientRect().top > window.innerHeight * 0.9);

    const childrenOf = (s: HTMLElement) => Array.from(s.children) as HTMLElement[];

    sections.forEach((s) =>
      childrenOf(s).forEach((el, i) => {
        el.style.setProperty("--sr-i", String(i));
        el.classList.add("sr-pending");
      })
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          childrenOf(entry.target as HTMLElement).forEach((el) => {
            el.classList.add("sr-in");
            const done = (e: TransitionEvent) => {
              if (e.target !== el || e.propertyName !== "transform") return;
              el.classList.remove("sr-pending", "sr-in");
              el.style.removeProperty("--sr-i");
              el.removeEventListener("transitionend", done);
            };
            el.addEventListener("transitionend", done);
          });
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      sections.forEach((s) =>
        childrenOf(s).forEach((el) => {
          el.classList.remove("sr-pending", "sr-in");
          el.style.removeProperty("--sr-i");
        })
      );
    };
  }, []);

  return null;
}
