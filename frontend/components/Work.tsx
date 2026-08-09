"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  projects as seedProjects,
  projectCategories,
  type Project,
} from "@/data/content";

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
  const linePathRef = useRef<SVGPathElement>(null);
  const linePathRef2 = useRef<SVGPathElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);

  // Order projects by industry group (label shown small above each name).
  const catMap = new Map(projectCategories.map((c) => [c.id, c]));
  const ordered: {
    project: Project;
    frame: number;
    cat?: (typeof projectCategories)[number];
  }[] = [];
  let frame = 0;
  const known = new Set(projectCategories.map((c) => c.id));
  for (const cat of projectCategories) {
    for (const project of projects.filter((p) => p.category === cat.id)) {
      frame += 1;
      ordered.push({ project, frame, cat });
    }
  }
  for (const project of projects.filter((p) => !known.has(p.category ?? ""))) {
    frame += 1;
    ordered.push({ project, frame, cat: catMap.get(project.category ?? "") });
  }

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

          // Pad the ends so the first and last items sit centred on screen.
          const setPads = () => {
            const kids = track.children;
            const first = kids[0] as HTMLElement | undefined;
            const last = kids[kids.length - 1] as HTMLElement | undefined;
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

          // The dashed line arching through the track — sized to the full
          // scroll width, redrawn as a gentle bow whenever layout changes.
          // Its vertical position tracks the frame numbers so it visibly
          // threads through them (including through each hollow numeral).
          const lineSvg = lineSvgRef.current;
          const linePath = linePathRef.current;
          const linePath2 = linePathRef2.current;
          const numberEl = track.querySelector<HTMLElement>(".work-number");
          const ARCH_H = 160;
          // A clearly-curved bow so the line reads as part of a circle, not
          // a near-straight line with a slight tilt. A dashed circle mid-
          // rotation looks pixel-identical to a stationary dashed circle
          // with its dash-offset marching (both are just the same repeating
          // pattern sliding along the same curve) — so the "spinning wheel"
          // read comes from pairing this pronounced curve with the dash
          // march below, not from literally rotating the (very wide, so
          // visually fragile to rotate as a rigid piece) line element.
          const ARCH_P0 = ARCH_H * 0.56;
          const ARCH_P1 = ARCH_H * 0.15;
          const ARCH_P2 = ARCH_H * 0.62;
          // Local y of the arch's quadratic bezier at 0 <= t <= 1 (t = x / w).
          const bezierY = (t: number) => {
            const mt = 1 - t;
            return mt * mt * ARCH_P0 + 2 * mt * t * ARCH_P1 + t * t * ARCH_P2;
          };

          const drawArch = () => {
            const w = track.scrollWidth;
            if (!lineSvg || !linePath || !linePath2 || !w) return;
            lineSvg.setAttribute("width", String(w));
            lineSvg.setAttribute("height", String(ARCH_H));
            const d = `M 0 ${ARCH_P0} Q ${w / 2} ${ARCH_P1} ${w} ${ARCH_P2}`;
            // Two layered passes on the same arch — a fine, dense dash and a
            // thicker, wider-spaced one — read as a delicate textured line
            // rather than one bold dashed stroke.
            linePath.setAttribute("d", d);
            linePath.style.strokeDasharray = "2 9";
            linePath.style.strokeDashoffset = "0";
            linePath2.setAttribute("d", d);
            linePath2.style.strokeDasharray = "1 16";
            linePath2.style.strokeDashoffset = "0";

            // Every card shares the same natural (unshifted) top, since
            // they're stretched to equal height and top-aligned within it —
            // so one shared centreY, computed from the curve's actual min
            // and max across the cards that exist, keeps the excursion
            // symmetric (equal clearance needed above and below) instead of
            // anchoring to card 1's arbitrary position on the curve and
            // needing lopsided padding to compensate.
            const ts = cards.map(
              (card) => (card.offsetLeft + card.offsetWidth / 2) / w
            );
            const ys = ts.map(bezierY);
            const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
            cards.forEach((card, i) => {
              card.style.top = ys[i] - centerY + "px";
            });

            if (numberEl) {
              // Every card's own natural top is identical (see above), and
              // each card's local path-y (ys[i]) cancels against its own
              // applied shift (ys[i] - centerY), so this doesn't depend on
              // which card it's calibrated from — centreY (the curve's own
              // midpoint) is all that's needed, offset for the SVG's
              // translateY(-50%).
              lineSvg.style.top =
                numberEl.offsetTop +
                numberEl.offsetHeight * 0.5 -
                centerY +
                ARCH_H * 0.5 +
                "px";
            }
          };
          drawArch();
          ScrollTrigger.addEventListener("refreshInit", drawArch);

          // Dashes visibly march along the line as the page scrolls — the
          // "line is moving" read the horizontal scrub alone doesn't give.
          // The two passes drift at slightly different rates for a subtle
          // layered, textured motion instead of one flat stripe.
          const dashTween = gsap.fromTo(
            [linePath, linePath2],
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: (i: number) =>
                -((linePath?.getTotalLength() ?? 0) + 200) * (i === 0 ? 1 : 1.6),
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: () => "+=" + distance(),
                scrub: 0.6,
              },
            }
          );

          ScrollTrigger.refresh();

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", setPads);
            ScrollTrigger.removeEventListener("refreshInit", drawArch);
            track.style.paddingLeft = "";
            track.style.paddingRight = "";
            root.classList.remove("work-horizontal");
            gsap.set(track, { x: 0 });
            gsap.set(cards, { opacity: 1, scale: 1 });
            cards.forEach((card) => {
              card.style.top = "";
            });
            dashTween.scrollTrigger?.kill();
            dashTween.kill();
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
    <section id="work" ref={rootRef} className="relative border-b border-white/[0.07] bg-[#050508] text-white">
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
              href="#process"
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
            <svg
              ref={lineSvgRef}
              className="work-line"
              aria-hidden="true"
              focusable="false"
            >
              <path
                ref={linePathRef}
                d="M 0 0 Q 0 0 0 0"
                fill="none"
                stroke="rgb(var(--ink))"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.3"
              />
              <path
                ref={linePathRef2}
                d="M 0 0 Q 0 0 0 0"
                fill="none"
                stroke="rgb(var(--ink))"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.3"
              />
            </svg>
            {ordered.map(({ project, frame: frameNo, cat }) => (
              <div
                key={project.id}
                className={`work-card ${project.featured ? "work-card--featured" : ""}`}
              >
                <div className="group flex h-full flex-col items-center px-2 text-center transition-transform duration-300 hover:-translate-y-1.5 sm:px-4">
                  <span
                    aria-hidden="true"
                    className="work-number select-none font-display text-[4rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:3px_rgb(var(--ink))] sm:text-[5.5rem]"
                  >
                    {String(frameNo).padStart(2, "0")}
                  </span>

                  <div className="relative my-4 flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                    <span
                      aria-hidden="true"
                      className="work-glyph-glow absolute -inset-3 rounded-full"
                    />
                    <div className="relative scale-[1.35] transition-transform duration-300 group-hover:scale-[1.5]">
                      <FrameGlyph type={project.frameType} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {project.featured && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-coral px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                        ★ Featured
                      </span>
                    )}
                    {cat && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-paper">
                        <span aria-hidden="true">·</span>
                        {cat.icon} {cat.label}
                        <span aria-hidden="true">·</span>
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3.5 max-w-sm font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-inkmuted">
                    {project.role ? `${project.role} · ` : ""}
                    {project.org}
                  </p>
                  <p className="mt-3 line-clamp-3 max-w-sm text-[15px] leading-relaxed text-inkmuted">
                    {project.summary}
                  </p>

                  <div className="mt-4 flex max-w-sm flex-wrap items-center justify-center gap-2">
                    {project.stack.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:text-coral"
                    >
                      View project ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
