"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import {
  Sparkles,
  Route,
  Component,
  ShoppingBag,
  Code2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Landmark,
  Briefcase,
  GraduationCap,
  Plane,
  House,
  Hotel,
  Building2,
  Pause,
  Play,
  Target,
  type LucideIcon,
} from "lucide-react";

import { about as seedAbout, industries as industryDetails } from "@/data/content";

// Paired with about.delivers by index — keep the two in the same order.
// `para` moves one of about.paragraphs (by index) into that tab's panel as
// an "In practice" note; the rest of the paragraphs stay in the intro.
const DELIVER_META: {
  title: string;
  Icon: LucideIcon;
  para?: number;
}[] = [
  { title: "Product & CX Design", Icon: Route, para: 2 },
  { title: "E-commerce & Digital Platforms", Icon: ShoppingBag },
  { title: "Design Systems", Icon: Component },
  { title: "AI Product & UX", Icon: Sparkles, para: 3 },
  { title: "Front-End Development", Icon: Code2 },
];

// Sector icons, matched by name. Sectors added later in admin fall back to
// the building icon, so nothing breaks when the list changes.
// Summary, focus tags and real projects per sector come from `industries`
// in content.ts (same data as the old pinned Industries section).
const INDUSTRY_DETAILS = new Map(industryDetails.map((d) => [d.label, d]));

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  "E-commerce & Retail": ShoppingBag,
  "Healthcare & HealthTech": HeartPulse,
  FinTech: Landmark,
  "Enterprise & B2B": Briefcase,
  Education: GraduationCap,
  "Travel & Tourism": Plane,
  "Real Estate": House,
  Hospitality: Hotel,
};

// "A, b, c and d" → ["A", "B", "C", "D"] for the panel's skill chips. Falls
// back to the plain sentence when it doesn't read as a list.
function toChips(text: string): string[] | null {
  const parts = text
    .split(/,\s+|\s+and\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (parts.length < 3 || parts.some((t) => t.length > 40)) return null;
  return parts.map((t) => t.charAt(0).toUpperCase() + t.slice(1));
}

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HIGHLIGHT = "simple, scalable, and high-performing";

export default function About({
  about = seedAbout,
}: {
  about?: typeof seedAbout;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-advance: on until the visitor takes over (picks a tab, uses
  // Prev/Next or the arrow keys) or presses pause. Never for reduced motion.
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { amount: 0.4 });
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const autoplay = playing && !reduce;
  // Paused rather than stopped: the progress bar freezes and resumes.
  const paused = hovered || focused || !cardInView;

  const caps = about.delivers.map((d, i) => {
    const meta = DELIVER_META[i];
    return {
      title: meta?.title ?? d,
      Icon: meta?.Icon ?? Target,
      text: d,
      chips: toChips(d),
      note: meta?.para != null ? about.paragraphs[meta.para] : undefined,
    };
  });
  const current = caps[Math.min(active, caps.length - 1)];

  // How long each tab stays up: ~220 words per minute over what's on screen,
  // plus a few seconds to take in the layout — clamped to 6–14s.
  const words = [current.chips?.join(" ") ?? current.text, current.note ?? ""]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  const dwell = Math.min(14000, Math.max(6000, 3000 + words * 270));

  // The visitor picked a tab themselves — stop auto-advancing.
  const select = (i: number) => {
    setPlaying(false);
    setActive(i);
  };

  // In the swipe row (below xl), keep the selected tab in view when "Next"
  // or the arrow keys move past the visible edge. Scrolls the row only,
  // never the page.
  useEffect(() => {
    const tab = tabRefs.current[active];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    const left = tab.offsetLeft - row.offsetLeft;
    if (left < row.scrollLeft || left + tab.offsetWidth > row.scrollLeft + row.clientWidth)
      row.scrollTo({ left: left - 20, behavior: reduce ? "auto" : "smooth" });
  }, [active, reduce]);
  // Only the sectors are shown (matched by name, else the 2nd group).
  const industries =
    about.expertise.find((g) => /industr/i.test(g.group)) ?? about.expertise[1];
  // Industry Experience — on desktop the card pins and the sector cards are
  // dealt one by one like a riffle shuffle: right pile → centre → left pile.
  // Phones, tablets and reduced motion keep the plain grid.
  const indPinRef = useRef<HTMLDivElement>(null);
  const indTrackRef = useRef<HTMLUListElement>(null);
  const indCountRef = useRef<HTMLSpanElement>(null);
  const indBarRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const pin = indPinRef.current;
    const track = indTrackRef.current;
    if (!pin || !track) return;
    gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger in step with Lenis smooth scrolling.
    const lenis = (
      window as unknown as {
        lenis?: { on?: (e: string, cb: () => void) => void; off?: (e: string, cb: () => void) => void };
      }
    ).lenis;
    const onLenisScroll = () => ScrollTrigger.update();
    lenis?.on?.("scroll", onLenisScroll);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // The pinned deck (~700px) must clear the floating nav: 800px+ tall on
      // desktop, 700px+ on phones/tablets (shorter screens keep the grid).
      mm.add(
        "(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference), (max-width: 1023px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
        () => {
          pin.classList.add("ind-horizontal");
          const tiles = gsap.utils.toArray<HTMLElement>(".ind-tile", track);
          const slots = tiles.map((t) => t.parentElement as HTMLElement);
          const n = tiles.length;
          // Room above the cards for the lift as one arcs between piles.
          const LIFT = 40;

          // Riffle deck: every card sits in the same centred slot and is
          // moved by transform. Size the deck to the tallest card and
          // work out how far the two piles sit from centre.
          let tileW = 0;
          let pileX = 0;
          const layout = () => {
            tileW = slots[0]?.offsetWidth ?? 0;
            const h = Math.max(...tiles.map((t) => t.scrollHeight));
            slots.forEach((s) => (s.style.height = h + "px"));
            track.style.height = h + LIFT + 24 + "px";
            pileX = Math.min(tileW * 0.82, (track.clientWidth - tileW) / 2 - 12);
          };
          layout();
          ScrollTrigger.addEventListener("refreshInit", layout);

          let current = -1;
          const setActive = (i: number) => {
            if (i === current) return;
            current = i;
            tiles.forEach((t, j) => t.classList.toggle("is-active", j === i));
            if (indCountRef.current)
              indCountRef.current.textContent = String(i + 1).padStart(2, "0");
          };

          // d = how far card i is from the current position (negative = already
          // dealt to the left pile, positive = still waiting on the right).
          // |d| ≤ 1: in flight — it lifts and tilts in 3D as it arcs across.
          // |d| > 1: resting in a pile, fanned a little more per card deep.
          // One scroll gesture = one card: while pinned, the deck can only
          // move one card from the last settled one; when scrolling stops
          // the page snaps to exactly that card (see onScrollEnd below).
          let settled = 0;
          let snapping = false;
          let st: ScrollTrigger | undefined;
          const deal = (progress: number) => {
            let pos = progress * (n - 1);
            pos = gsap.utils.clamp(settled - 1, settled + 1, pos);
            tiles.forEach((tile, i) => {
              const d = i - pos;
              const ad = Math.abs(d);
              const s = Math.sign(d);
              let x: number, y: number, rot: number, rotY: number, scale: number, bright: number, opacity = 1;
              if (ad <= 1) {
                const arc = Math.sin(Math.PI * ad);
                x = s * pileX * ad;
                y = -arc * LIFT;
                rot = s * 7 * ad;
                rotY = -s * 22 * arc;
                scale = 1 - 0.08 * ad;
                bright = 1 - 0.45 * ad;
              } else {
                const k = ad - 1;
                x = s * (pileX + k * 18);
                y = k * 7;
                rot = s * (7 + k * 2.5);
                rotY = 0;
                scale = 0.92 - 0.02 * k;
                bright = Math.max(0.3, 0.55 - 0.08 * k);
                opacity = k > 3 ? 0 : 1;
              }
              slots[i].style.zIndex = String(100 - Math.round(ad * 10));
              gsap.set(tile, {
                x,
                y,
                rotation: rot,
                rotationY: rotY,
                scale,
                opacity,
                filter: `brightness(${bright.toFixed(3)})`,
              });
            });
            setActive(Math.min(n - 1, Math.max(0, Math.round(pos))));
            if (indBarRef.current) indBarRef.current.style.transform = `scaleX(${progress})`;
          };
          deal(0);

          // A proxy tween so `scrub` smooths the deal like the other pins.
          const state = { p: 0 };
          const tween = gsap.to(state, {
            p: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "center center",
              end: () => "+=" + window.innerHeight * 0.4 * n,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              // Arriving from a jump (nav link, scrollbar) starts at the end
              // you came in from — but not while we're pulling back an
              // overshoot, which re-enters on purpose.
              onEnter: () => {
                if (!snapping) settled = 0;
              },
              onEnterBack: () => {
                if (!snapping) settled = n - 1;
              },
            },
            onUpdate: () => deal(state.p),
          });
          st = tween.scrollTrigger;

          const lenis = (
            window as unknown as {
              lenis?: { scrollTo?: (y: number, o?: { duration?: number }) => void };
            }
          ).lenis;
          const scrollToCard = (i: number) => {
            if (!st) return;
            // Inset 1px so the first/last card stays inside the pin range.
            const y = gsap.utils.clamp(
              st.start + 1,
              st.end - 1,
              st.start + (i / (n - 1)) * (st.end - st.start)
            );
            if (Math.abs(window.scrollY - y) < 2) return;
            snapping = true;
            if (lenis?.scrollTo) lenis.scrollTo(y, { duration: 0.6 });
            else window.scrollTo({ top: y, behavior: "smooth" });
          };
          const onScrollEnd = () => {
            if (!st) return;
            const y = window.scrollY;
            const near = window.innerHeight * 1.5;
            if (st.isActive) {
              const raw = st.progress * (n - 1);
              // A small nudge (under 12% of a card) snaps back to the same card.
              const step = raw - settled > 0.12 ? 1 : raw - settled < -0.12 ? -1 : 0;
              settled = gsap.utils.clamp(0, n - 1, settled + step);
              scrollToCard(settled);
              if (step === 0) snapping = false;
            } else if (y > st.end && y - st.end < near && settled < n - 1) {
              // A flick overshot the end mid-deck: pull back to the next card.
              settled += 1;
              scrollToCard(settled);
            } else if (y < st.start && st.start - y < near && settled > 0) {
              settled -= 1;
              scrollToCard(settled);
            } else {
              snapping = false;
            }
          };
          ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

          ScrollTrigger.refresh();

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", layout);
            ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
            track.style.height = "";
            slots.forEach((s) => {
              s.style.height = "";
              s.style.zIndex = "";
            });
            pin.classList.remove("ind-horizontal");
            gsap.set(tiles, { clearProps: "opacity,transform,filter" });
            tiles.forEach((t) => t.classList.remove("is-active"));
            if (indBarRef.current) indBarRef.current.style.transform = "";
          };
        }
      );
    }, pin);

    return () => {
      lenis?.off?.("scroll", onLenisScroll);
      ctx.revert();
    };
  }, []);

  const moved = new Set(DELIVER_META.map((m) => m.para).filter((n) => n != null));
  const introParagraphs = about.paragraphs.filter((_, i) => !moved.has(i));

  // Arrow keys / Home / End move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = caps.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? active === last ? 0 : active + 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? active === 0 ? last : active - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next == null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  // Always set: MotionConfig (reducedMotion="user") drops the movement for
  // reduced-motion visitors, while the reveal still runs so nothing stays hidden.
  const fadeUp = {
        initial: {
          opacity: 0,
          y: 20,
        },
        whileInView: {
          opacity: 1,
          y: 0,
        },
        viewport: {
          once: true,
          margin: "-80px",
        },
        transition: {
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  const leadParts = about.lead.split(HIGHLIGHT);

  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-paper
        py-14
        text-ink
        sm:py-20
        lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND — SAME AS "HOW I WORK"
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Purple left glow */}
        <div
          className="
            absolute
            -left-[250px]
            top-[80px]
            h-[850px]
            w-[850px]
            rounded-full
            bg-[radial-gradient(circle,rgb(var(--accent)/0.16)_0%,rgb(var(--accent)/0.07)_35%,transparent_72%)]
            blur-[30px]
          "
        />

        {/* Blue / cyan right glow */}
        <div
          className="
            absolute
            -right-[300px]
            top-[250px]
            h-[850px]
            w-[850px]
            rounded-full
            bg-[radial-gradient(circle,rgb(var(--accent)/0.12)_0%,rgb(var(--accent)/0.05)_40%,transparent_72%)]
            blur-[40px]
          "
        />

        {/* Very subtle center glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[radial-gradient(circle,rgb(var(--accent)/0.05),transparent_70%)]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="page-container relative"
      >
        {/* ===================================================
            HEADER
        ==================================================== */}

        <motion.div
          {...fadeUp}
          className="
            flex
            items-center
            gap-3
          "
        >
          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-accent/20
              bg-accent/[0.06]
              px-4
              py-2
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.02em]
              text-accent
            "
          >
            About & Philosophy
          </span>
        </motion.div>

        {/* ===================================================
            MAIN CONTENT — intro left, capability tabs right
        ==================================================== */}

        <div
          className="
            mt-10
            grid
            gap-12
            lg:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.8fr_1.2fr]
            lg:gap-16
          "
        >
          {/* =================================================
              LEFT — statement, short intro, how I work
          ================================================== */}

          <div>
            <motion.h2
              {...fadeUp}
              className="
                font-display
                text-lg
                font-semibold
                leading-[1.3]
                tracking-[-0.02em]
                text-ink
                sm:text-2xl
                lg:text-[26px]
              "
            >
              {leadParts.length === 2 ? (
                <>
                  {leadParts[0]}
                  <span className="text-accent">{HIGHLIGHT}</span>
                  {leadParts[1]}
                </>
              ) : (
                about.lead
              )}
            </motion.h2>

            <motion.div {...fadeUp} className="mt-8 space-y-5">
              {introParagraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="text-base leading-[1.75] text-inkmuted lg:max-w-xl"
                >
                  {p}
                </p>
              ))}
            </motion.div>

            {about.flow?.length ? (
              <motion.div {...fadeUp} className="mt-10 hidden sm:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                  How I work
                </p>

                <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 lg:max-w-xl">
                  {about.flow.map((step, i) => (
                    <li key={step} className="flex items-center gap-1.5">
                      <span className="rounded-md border border-line bg-panel px-2.5 py-1 text-[13px] text-ink">
                        {step}
                      </span>
                      {i < about.flow.length - 1 && (
                        <ArrowRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 text-inkmuted"
                          strokeWidth={1.8}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ) : null}
          </div>

          {/* =================================================
              RIGHT — WHAT I BRING (tabs + detail panel)
          ================================================== */}

          <motion.div
            {...fadeUp}
            ref={cardRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            // Keyboard focus only — a mouse click on Play leaves focus on the
            // button, which must not keep the card paused after the pointer leaves.
            onFocus={(e) => setFocused((e.target as HTMLElement).matches(":focus-visible"))}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
            }}
            className="
              rounded-[22px]
              border
              border-line
              bg-panel
              p-5
              shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              sm:p-7
            "
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                  Capabilities
                </span>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-ink">
                  What I Bring
                </h3>
              </div>
              <div className="flex items-center gap-3 pb-0.5">
                <p className="hidden text-xs text-inkmuted sm:block">
                  {!autoplay
                    ? "Select an area to see what it covers"
                    : paused
                      ? "Paused"
                      : "Auto-plays · hover to pause"}
                </p>
                {!reduce && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? "Stop auto-advance" : "Start auto-advance"}
                    aria-pressed={!playing}
                    className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-inkmuted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    {playing ? (
                      <Pause className="h-3.5 w-3.5" strokeWidth={2.2} />
                    ) : (
                      <Play className="h-3.5 w-3.5" strokeWidth={2.2} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,14rem)_1fr] xl:gap-5">
              {/* Tab list — a swipe row on phones, a vertical list on desktop. */}
              <div
                role="tablist"
                aria-label="Capabilities"
                aria-orientation="vertical"
                onKeyDown={onTabKey}
                className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:-mx-7 sm:px-7 xl:mx-0 xl:snap-none xl:flex-col xl:gap-1.5 xl:overflow-visible xl:px-0 xl:pb-0 [&::-webkit-scrollbar]:hidden"
              >
                {caps.map((cap, i) => {
                  const selected = i === active;
                  return (
                    <button
                      key={cap.title}
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      id={`about-tab-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="about-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(i)}
                      className={`focus-ring group relative flex shrink-0 overflow-hidden snap-start items-center gap-3 rounded-xl border p-2 pr-3.5 text-left transition-colors duration-200 xl:w-full xl:pr-3 ${
                        selected
                          ? "border-accent/35 bg-accent/10 text-ink"
                          : "border-line text-inkmuted hover:border-accent/25 hover:bg-ink/[0.04] hover:text-ink"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                          selected
                            ? "bg-accent text-onaccent"
                            : "bg-ink/[0.05] text-inkmuted group-hover:text-accent"
                        }`}
                      >
                        <cap.Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1 whitespace-nowrap text-sm font-medium leading-snug xl:whitespace-normal">
                        {cap.title}
                      </span>
                      {/* Time left on this tab; its end advances to the next. */}
                      {selected && autoplay && (
                        <span
                          key={active}
                          aria-hidden="true"
                          onAnimationEnd={() => setActive((a) => (a + 1) % caps.length)}
                          className="about-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
                          style={{
                            animationDuration: `${dwell}ms`,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      )}
                      <ChevronRight
                        aria-hidden="true"
                        className={`hidden h-4 w-4 shrink-0 transition-all duration-200 xl:block ${
                          selected
                            ? "translate-x-0.5 text-accent"
                            : "text-inkmuted/50 group-hover:translate-x-0.5 group-hover:text-ink"
                        }`}
                        strokeWidth={2}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Detail panel */}
              <div
                id="about-panel"
                role="tabpanel"
                aria-labelledby={`about-tab-${active}`}
                className="relative flex min-h-[20rem] flex-col overflow-hidden rounded-2xl border border-line bg-paper p-5 sm:p-6"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                        What it covers
                      </p>
                      <span className="font-mono text-[11px] tabular-nums text-inkmuted">
                        {String(active + 1).padStart(2, "0")} / {String(caps.length).padStart(2, "0")}
                      </span>
                    </div>

                    {/* The tab already names it on wide screens; phones scroll the
                        tab row, so repeat the title here. */}
                    <h4 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink xl:sr-only">
                      {current.title}
                    </h4>

                    {current.chips ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {current.chips.map((chip) => (
                          <li
                            key={chip}
                            className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-1.5 text-sm text-ink/85"
                          >
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
                            {chip}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-4 text-[15px] leading-[1.7] text-ink/85">{current.text}</p>
                    )}

                    {current.note && (
                      <div className="mt-6 rounded-xl border border-accent/15 bg-accent/[0.05] p-4">
                        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                          In practice
                        </p>
                        <p className="mt-2 text-sm leading-[1.7] text-inkmuted">{current.note}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Step through without hunting for the next tab. */}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => select(active - 1)}
                    disabled={active === 0}
                    aria-label={active > 0 ? `Previous: ${caps[active - 1].title}` : "Previous"}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-inkmuted transition-colors hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => select((active + 1) % caps.length)}
                    className="focus-ring group inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <span className="text-inkmuted group-hover:text-accent">
                      {active === caps.length - 1 ? "Back to" : "Next:"}
                    </span>
                    <span className="max-w-[12rem] truncate font-medium">
                      {caps[(active + 1) % caps.length].title}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================================================
            INDUSTRY EXPERIENCE — core expertise and tech are covered by
            the capabilities above and the Toolkit section, so only the
            sectors are shown here, as a highlighted feature card.
        ==================================================== */}

        {industries && (
          <div ref={indPinRef} className="mt-16 lg:mt-20">
          <motion.div
            {...fadeUp}
            className="group/card relative isolate overflow-hidden rounded-[28px] border border-accent/25 bg-[linear-gradient(135deg,rgb(var(--accent)/0.10),rgb(var(--panel))_45%,rgb(var(--panel)))] p-6 shadow-[0_0_0_1px_rgb(var(--accent)/0.06),0_30px_80px_-30px_rgb(var(--accent)/0.35)] transition-colors duration-300 hover:border-accent/40 sm:p-10 lg:p-12"
          >
            {/* Decoration: two accent glows, a large watermark icon, and an
                accent hairline along the top edge. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.22),transparent_70%)] blur-2xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.10),transparent_70%)] blur-2xl"
            />
            <Building2
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 -z-10 h-64 w-64 text-accent opacity-[0.06] transition-transform duration-700 group-hover/card:-rotate-6 group-hover/card:scale-105"
              strokeWidth={1}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
            />

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5">
                <span className="relative">
                  <span aria-hidden="true" className="work-glyph-glow absolute -inset-4 rounded-full" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-onaccent shadow-[0_10px_30px_-8px_rgb(var(--accent)/0.6)] transition-transform duration-300 group-hover/card:-rotate-6 sm:h-16 sm:w-16">
                    <Building2 className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
                  </span>
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                    Sectors I&apos;ve designed for
                  </p>
                  <h3 className="mt-1.5 font-display text-[28px] font-semibold leading-none tracking-[-0.035em] text-ink sm:text-4xl lg:text-5xl">
                    {industries.group}
                  </h3>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold leading-none tracking-[-0.05em] text-accent sm:text-6xl lg:text-7xl">
                  {industries.items.length}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-inkmuted">
                  sectors
                </span>
              </div>
            </div>

            {/* Scroll progress — only in the pinned desktop mode. */}
            <div className="ind-progress mt-8 hidden items-center gap-4" aria-hidden="true">
              <span className="font-mono text-[11px] tabular-nums text-inkmuted">
                <span ref={indCountRef} className="text-accent">01</span> /{" "}
                {String(industries.items.length).padStart(2, "0")}
              </span>
              <span className="relative h-px flex-1 overflow-hidden bg-line">
                <span
                  ref={indBarRef}
                  className="absolute inset-0 origin-left scale-x-0 bg-accent shadow-[0_0_10px_rgb(var(--accent)/0.6)]"
                />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-inkmuted">
                Scroll to explore
              </span>
            </div>

            <ul ref={indTrackRef} className="ind-track mt-8 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
              {industries.items.map((it, i) => {
                const ItemIcon = INDUSTRY_ICONS[it] ?? Building2;
                const detail = INDUSTRY_DETAILS.get(it);
                return (
                  <motion.li
                    key={it}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="flex"
                  >
                    {/* Inner tile carries the visuals so the GSAP scroll
                        reveal never fights the entrance animation above. */}
                    <div className="ind-tile group/item relative isolate flex flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-paper/70 p-5 backdrop-blur-sm transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_18px_40px_-18px_rgb(var(--accent)/0.5)] sm:p-6">
                    {/* Accent wash that rises on hover. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(var(--accent)/0.12),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
                    />
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-all duration-300 group-hover/item:scale-105 group-hover/item:bg-accent group-hover/item:text-onaccent sm:h-12 sm:w-12">
                        <ItemIcon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.8} />
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-inkmuted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h4 className="mt-5 font-display text-lg font-semibold leading-snug tracking-[-0.015em] text-ink">
                      {it}
                    </h4>

                    {/* Real projects in this sector, when there are any. */}
                    {detail?.work && (
                      <p className="mt-1.5 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.06em] text-accent">
                        {detail.work.split(" · ").join(" • ")}
                      </p>
                    )}

                    {detail?.summary && (
                      <p className="mt-3 text-sm leading-[1.65] text-inkmuted">{detail.summary}</p>
                    )}

                    {detail?.focus?.length ? (
                      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                        {detail.focus.map((f) => (
                          <li
                            key={f}
                            className="rounded-full border border-line bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.06em] text-inkmuted transition-colors duration-300 group-hover/item:border-accent/30 group-hover/item:text-ink"
                          >
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
