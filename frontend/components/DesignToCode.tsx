"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Target,
  Route,
  Palette,
  Component,
  Code2,
  Rocket,
  type LucideIcon,
} from "lucide-react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Design-led, with the front-end skill to carry it into production.
const FLOW: { step: string; note: string; Icon: LucideIcon }[] = [
  { step: "Product problem", Icon: Target, note: "Start from the customer and business problem, e.g. shoppers who know their need but not the product name." },
  { step: "UX", Icon: Route, note: "Journeys, information architecture and flows that solve that problem end to end." },
  { step: "UI", Icon: Palette, note: "High-fidelity screens and every state, designed and prototyped in Figma." },
  { step: "Design system", Icon: Component, note: "Tokens and components that web, app and internal tools share." },
  { step: "React · Next.js · React Native", Icon: Code2, note: "Hands-on front-end (e.g. the Trade Partner Program in React and Next.js), and close collaboration with developers on production apps." },
  { step: "Production", Icon: Rocket, note: "Shipped on the retail website, the shopping app and internal platforms." },
];

// Design → Code — a pinned horizontal scroll like Industry experience
// (Work.tsx): the steps travel past one by one on a dashed line, with an
// accent fill tracking how far along the flow you are. Mobile gets a swipe
// carousel and reduced-motion desktop a plain grid (see globals.css).
export default function DesignToCode() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGSVGElement>(null);
  const dashRef = useRef<SVGLineElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

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
      const cards = gsap.utils.toArray<HTMLElement>(".d2c-card");
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          root.classList.add("d2c-horizontal");
          const viewport = root.querySelector<HTMLElement>(".d2c-viewport");
          const vw = () => viewport?.clientWidth ?? window.innerWidth;
          const line = lineRef.current;
          const dash = dashRef.current;
          const fill = fillRef.current;
          const numberEl = track.querySelector<HTMLElement>(".d2c-number");

          // Centre the first and last steps on screen, then run the line
          // through the middle of the step numbers across the full track.
          const layout = () => {
            const kids = track.querySelectorAll<HTMLElement>(".d2c-card");
            const first = kids[0];
            const last = kids[kids.length - 1];
            if (first)
              track.style.paddingLeft = Math.max(24, (vw() - first.offsetWidth) / 2) + "px";
            if (last)
              track.style.paddingRight = Math.max(24, (vw() - last.offsetWidth) / 2) + "px";

            const w = track.scrollWidth;
            const y = numberEl ? numberEl.offsetTop + numberEl.offsetHeight / 2 : 0;
            if (line && dash) {
              line.setAttribute("width", String(w));
              line.style.top = y + "px";
              dash.setAttribute("x2", String(w));
            }
            if (fill) {
              fill.style.width = w + "px";
              fill.style.top = y + "px";
            }
          };
          layout();
          ScrollTrigger.addEventListener("refreshInit", layout);

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
            // The accent fill always reaches the centre of the screen.
            onUpdate() {
              if (!fill) return;
              const w = track.scrollWidth || 1;
              const reach = this.progress() * distance() + vw() / 2;
              fill.style.transform = `scaleX(${Math.min(1, reach / w)})`;
            },
          });

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

          // Dashes march along the line as you scroll.
          const dashTween = gsap.fromTo(
            dash,
            { strokeDashoffset: 0 },
            {
              strokeDashoffset: () => -(track.scrollWidth / 2),
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
            ScrollTrigger.removeEventListener("refreshInit", layout);
            track.style.paddingLeft = "";
            track.style.paddingRight = "";
            root.classList.remove("d2c-horizontal");
            gsap.set(track, { x: 0 });
            gsap.set(cards, { opacity: 1, scale: 1 });
            if (fill) fill.style.transform = "";
            dashTween.scrollTrigger?.kill();
            dashTween.kill();
          };
        }
      );
    }, root);

    return () => {
      lenis?.off?.("scroll", onLenisScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="design-to-code"
      ref={rootRef}
      className="relative overflow-hidden border-b border-line bg-panel text-ink"
    >
      <div className="d2c-inner py-14 sm:py-20 lg:py-28">
        <div className="page-container">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.02em] text-accent">
                Design → Code
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                From problem to production
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-inkmuted">
              Design-led, code-literate. I work in code to protect design
              quality all the way to production, not to replace engineering.
            </p>
          </div>
        </div>

        <div className="d2c-viewport mt-10 lg:mt-0">
          <div ref={trackRef} className="d2c-track">
            <svg ref={lineRef} className="d2c-line" height="4" aria-hidden="true" focusable="false">
              <line
                ref={dashRef}
                x1="0"
                y1="2"
                x2="0"
                y2="2"
                stroke="rgb(var(--ink))"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2 10"
                opacity="0.35"
              />
            </svg>
            <span ref={fillRef} aria-hidden="true" className="d2c-fill" />

            {FLOW.map((f, i) => (
              <div key={f.step} className="d2c-card">
                <div className="group flex h-full flex-col items-center text-center">
                  <span
                    aria-hidden="true"
                    className="d2c-number select-none bg-panel px-3 font-display text-[3.5rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:2.5px_rgb(var(--ink))] transition-colors duration-300 group-hover:[-webkit-text-stroke:2.5px_rgb(var(--accent))] sm:text-[4.5rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="mt-6 flex h-full w-full flex-col items-center rounded-[22px] border border-line bg-paper p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/30 sm:p-7">
                    <div className="relative">
                      <span aria-hidden="true" className="work-glyph-glow absolute -inset-3 rounded-full" />
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent/15 bg-accent/10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <f.Icon className="h-5 w-5 text-accent" strokeWidth={1.8} />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold leading-snug tracking-[-0.02em] text-ink">
                      {f.step}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.65] text-inkmuted">{f.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
