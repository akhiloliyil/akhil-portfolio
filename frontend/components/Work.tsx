"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { industries as seedIndustries, type Industry } from "@/data/content";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Industry experience — the pinned horizontal-scroll section. Projects live
// in the WorkV2 grid below, so this tells the "where" story: one numbered
// frame per sector, threaded on the dashed arch.
export default function Work({
  industries = seedIndustries,
}: {
  industries?: Industry[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);
  const linePathRef2 = useRef<SVGPathElement>(null);
  const lineSvgRef = useRef<SVGSVGElement>(null);

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
    <section id="industries" ref={rootRef} className="relative border-b border-line bg-paper text-ink">
      <div className="work-inner py-20 sm:py-28">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-end justify-between gap-4 border-b border-line px-6 pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              ( Where I&apos;ve designed )
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Industry experience
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-xs uppercase tracking-wider text-inkmuted sm:block">
              {industries.length} industries · scroll to explore
            </span>
            <a
              href="#work"
              className="focus-ring inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted transition-colors hover:border-accent hover:text-accent"
            >
              Skip to work
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
            {industries.map((ind, i) => (
              <div key={ind.label} className="work-card">
                <div className="group flex h-full flex-col items-center px-2 text-center transition-transform duration-300 hover:-translate-y-1.5 sm:px-4">
                  <span
                    aria-hidden="true"
                    className="work-number select-none font-display text-[4rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:3px_rgb(var(--ink))] sm:text-[5.5rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative my-5 flex h-20 w-20 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="work-glyph-glow absolute -inset-3 rounded-full"
                    />
                    <span
                      aria-hidden="true"
                      className="relative grid h-[72px] w-[72px] place-items-center rounded-2xl border-2 border-ink bg-panel text-[34px] leading-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                    >
                      {ind.icon}
                    </span>
                  </div>

                  <h3 className="max-w-sm font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                    {ind.label}
                  </h3>
                  {ind.work && (
                    <p className="mt-2 inline-flex max-w-sm items-center gap-2 rounded-full bg-ink px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-paper">
                      <span aria-hidden="true">·</span>
                      {ind.work}
                      <span aria-hidden="true">·</span>
                    </p>
                  )}
                  <p className="mt-3 line-clamp-3 max-w-sm text-[15px] leading-relaxed text-inkmuted">
                    {ind.summary}
                  </p>

                  <div className="mt-4 flex max-w-sm flex-wrap items-center justify-center gap-2">
                    {ind.focus.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted"
                      >
                        {f}
                      </span>
                    ))}
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
