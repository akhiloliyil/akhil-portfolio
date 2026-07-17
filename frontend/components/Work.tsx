"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects as seedProjects } from "@/data/content";
import SelectionFrame from "./SelectionFrame";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function FrameGlyph({ type }: { type: "app" | "dashboard" | "ecommerce" }) {
  const ink = "rgb(var(--ink))";
  const line = "rgb(var(--line))";
  const accent = "rgb(var(--accent))";
  const coral = "rgb(var(--coral))";
  if (type === "app") {
    return (
      <svg viewBox="0 0 48 64" className="h-12 w-9" aria-hidden="true">
        <rect x="1" y="1" width="46" height="62" rx="6" fill="none" stroke={ink} strokeWidth="2" />
        <rect x="9" y="9" width="30" height="6" fill={line} />
        <rect x="9" y="20" width="30" height="4" fill={line} />
        <rect x="9" y="28" width="20" height="4" fill={line} />
        <circle cx="24" cy="56" r="3" fill={accent} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 48" className="h-9 w-12" aria-hidden="true">
      <rect x="1" y="1" width="62" height="46" rx="4" fill="none" stroke={ink} strokeWidth="2" />
      <rect x="1" y="1" width="62" height="10" fill={line} />
      <circle cx="8" cy="6" r="1.5" fill={coral} />
      <rect x="8" y="18" width="20" height="22" fill={line} />
      <rect x="32" y="18" width="24" height="10" fill={line} />
      <rect x="32" y="31" width="24" height="9" fill={accent} opacity="0.25" />
    </svg>
  );
}

export default function Work({
  projects = seedProjects,
}: {
  projects?: typeof seedProjects;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = (
      window as unknown as {
        lenis?: { on?: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void };
      }
    ).lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on?.("scroll", onLenisScroll);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      const mm = gsap.matchMedia();

      // Desktop — pin the section and scrub the cards across horizontally,
      // so they arrive one by one; the page continues only once they're done.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          root.classList.add("work-horizontal");
          const viewport = root.querySelector<HTMLElement>(".work-viewport");
          const vw = () => viewport?.clientWidth ?? window.innerWidth;

          // Pad the ends so the first and last cards sit centred on screen.
          const setPads = () => {
            const first = cards[0];
            const last = cards[cards.length - 1];
            if (first)
              track.style.paddingLeft =
                Math.max(24, (vw() - first.offsetWidth) / 2) + "px";
            if (last)
              track.style.paddingRight =
                Math.max(24, (vw() - last.offsetWidth) / 2) + "px";
          };
          setPads();
          // Recompute before every ScrollTrigger measurement (incl. resize).
          ScrollTrigger.addEventListener("refreshInit", setPads);

          const distance = () => Math.max(0, track.scrollWidth - vw());

          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Each card eases to full opacity as it approaches centre-screen.
          gsap.set(cards, { opacity: 0.35, scale: 0.96 });
          cards.forEach((card) => {
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: tween,
                start: "left 85%",
                end: "left 45%",
                scrub: true,
              },
            });
          });

          ScrollTrigger.refresh();

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", setPads);
            track.style.paddingLeft = "";
            track.style.paddingRight = "";
            root.classList.remove("work-horizontal");
            gsap.set(track, { x: 0 });
            gsap.set(cards, { opacity: 1, scale: 1 });
          };
        }
      );

      // Mobile / tablet uses a native horizontal swipe carousel (CSS
      // scroll-snap) — no GSAP needed there.
    }, root);

    return () => {
      lenis?.off?.("scroll", onLenisScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section id="work" ref={rootRef} className="border-b border-line bg-paper">
      <div className="work-inner py-20 sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 border-b border-line px-6 pb-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Selected work
          </h2>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs uppercase tracking-wider text-inkmuted sm:block">
              {projects.length} frames · scroll to explore
            </span>
            <a
              href="#experience"
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted transition-colors hover:border-accent hover:text-accent"
            >
              Skip work
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="work-viewport mt-10 lg:mt-0">
          <div
            ref={trackRef}
            className="work-track flex px-6"
            style={{ perspective: 1200 }}
          >
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={`work-card ${project.featured ? "work-card--featured" : ""}`}
              >
                <div className="group h-full rounded-sm transition-transform duration-300 will-change-transform hover:-translate-y-1.5">
                  <SelectionFrame
                    tag={`${project.featured ? "★ Featured" : `Frame ${String(i + 1).padStart(2, "0")}`} · ${project.org}`}
                    className={`h-full border bg-panel p-7 transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-[0_18px_40px_-24px_rgba(17,25,43,0.45)] sm:p-9 ${
                      project.featured ? "border-accent/40" : "border-line"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="work-glyph">
                        <div className="transition-transform duration-300 group-hover:scale-110">
                          <FrameGlyph type={project.frameType} />
                        </div>
                      </div>
                      <div className="text-right font-mono text-[10px] uppercase leading-relaxed tracking-wider text-inkmuted">
                        <div>{project.org}</div>
                        {project.period && <div>{project.period}</div>}
                      </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink">
                        {project.name}
                      </h3>
                      {project.role && (
                        <span className="rounded-sm bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                          {project.role}
                        </span>
                      )}
                    </div>
                    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-inkmuted">
                      {project.summary}
                    </p>

                    <ul
                      className={`mt-7 space-y-3 ${
                        project.featured
                          ? "sm:grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-3 sm:space-y-0"
                          : ""
                      }`}
                    >
                      {project.details.slice(0, 4).map((d) => (
                        <li key={d} className="flex gap-3 text-sm leading-relaxed text-ink">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                      {project.stack.map((s) => (
                        <span key={s} className="rounded-sm bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted">
                          {s}
                        </span>
                      ))}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="focus-ring ml-auto inline-flex items-center gap-1 rounded-sm font-mono text-[10px] uppercase tracking-wider text-accent transition-colors hover:text-coral"
                        >
                          View project ↗
                        </a>
                      )}
                    </div>
                  </SelectionFrame>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
