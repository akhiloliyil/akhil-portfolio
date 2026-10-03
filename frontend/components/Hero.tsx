"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import CountUp from "react-countup";
import { profile as seedProfile, stats as seedStats } from "@/data/content";
import SelectionFrame from "./SelectionFrame";
import Magnetic from "./Magnetic";
import dynamic from "next/dynamic";
import ResumeButton from "./ResumeButton";
import NebulaBackground from "./NebulaBackground";
import { useMediaQuery, DESKTOP } from "./useMediaQuery";

// Desktop-only particle portrait: code-split, and never mounted on phones
// (it pulls ~4 MB of portrait PNGs and runs a canvas loop).
const CinematicPortrait = dynamic(() => import("./CinematicPortrait"), { ssr: false });

/** Split a stat value like "10+" into { end: 10, prefix: "", suffix: "+" }. */
function parseStat(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return { prefix: value, end: 0, suffix: "", numeric: false };
  return {
    prefix: match[1],
    end: parseFloat(match[2]),
    suffix: match[3],
    numeric: true,
  };
}

// Qualitative impact tiles that sit beside the numeric stats — no invented numbers.
const CAPABILITIES = [
  { value: "Web + Mobile", label: "React · Next.js · React Native" },
  { value: "UX + CX", label: "Customer journeys · Product design" },
  { value: "AI + Design", label: "Conversational · Generative · AI search" },
];

/** Fallback portrait path; the live path comes from profile.portrait. */
const DEFAULT_PORTRAIT = "/images/profile.jpg";

export default function Hero({
  profile = seedProfile,
  stats = seedStats,
  showResume = false,
}: {
  profile?: typeof seedProfile;
  stats?: typeof seedStats;
  // Résumé download only on the `/?resume` link.
  showResume?: boolean;
}) {
  const PROFILE_IMAGE = profile.portrait || DEFAULT_PORTRAIT;
  // The cinematic (desktop) canvas can use its own image; falls back to the card one.
  const CINEMATIC_IMAGE = profile.portraitCinematic || PROFILE_IMAGE;
  // Optional full-colour photo shown when the dust portrait is double-clicked.
  const COLOR_IMAGE = profile.portraitColor || "";
  const heroCinematic = (profile.heroStyle ?? "card") === "cinematic";
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [portraitOk, setPortraitOk] = useState(true);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP);

  // Cursor position within the hero, normalized to [-0.5, 0.5], spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Layered parallax — deeper layers move more; the card counter-moves + tilts.
  const marksX = useTransform(sx, (v) => v * 38);
  const marksY = useTransform(sy, (v) => v * 28);
  const cardX = useTransform(sx, (v) => v * -26);
  const cardY = useTransform(sy, (v) => v * -20);
  const cardRotateY = useTransform(sx, (v) => v * 14);
  const cardRotateX = useTransform(sy, (v) => v * -14);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    // Load split-type + gsap on the client only.
    Promise.all([import("split-type"), import("gsap")]).then(
      ([{ default: SplitType }, { gsap }]) => {
        if (cancelled || !headlineRef.current) return;
        const split = new SplitType(headlineRef.current, { types: "chars" });
        const tween = gsap.from(split.chars, {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.035,
        });
        cleanup = () => {
          tween.kill();
          split.revert();
        };
      }
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // "Lead Product Designer · UI/UX & CX" → "Lead Product Designer — UI/UX & CX".
  const [roleMain, ...roleRest] = profile.title.split("·").map((t) => t.trim());
  const role = roleRest.length ? `${roleMain} — ${roleRest.join(" · ")}` : roleMain;

  // One scannable line: years · location · focus areas.
  const years = stats[0]?.value ? `${stats[0].value} years` : "";
  const place = profile.location.replace("United Arab Emirates", "UAE");
  const meta = [years, place, ...profile.focus].filter(Boolean);

  const cardFrame = (
    <SelectionFrame
      tag={`AKHIL.UI · ${profile.location}`}
      active
      className="aspect-[4/5] w-full border border-line bg-panel p-6 shadow-[0_1px_0_0_rgba(17,25,43,0.04)]"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-paper font-display text-5xl font-semibold text-accent sm:h-52 sm:w-52">
            {portraitOk ? (
              <img
                src={PROFILE_IMAGE}
                alt={`${profile.name} portrait`}
                className="h-full w-full object-cover"
                onError={() => setPortraitOk(false)}
              />
            ) : (
              "AK"
            )}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">
            UI/UX → Code
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-line" />
          <div className="h-2 w-4/5 rounded-full bg-line" />
          <div className="flex gap-2 pt-2">
            <span className="rounded-sm bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted">
              Figma
            </span>
            <span className="rounded-sm bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted">
              React
            </span>
            <span className="rounded-sm bg-coral/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-coral">
              Next.js
            </span>
          </div>
        </div>
      </div>
    </SelectionFrame>
  );

  // Plain circular portrait, no frame/handles/skeleton — used below `lg`
  // instead of cardFrame, which is too busy for the tighter tablet/mobile
  // layout. Gradient ring echoes the site's accent without needing the
  // full card treatment.
  const portraitCircle = (
    <div className="relative h-[220px] w-[220px] shrink-0 rounded-full bg-accent p-[3px] shadow-[0_8px_40px_-12px_rgb(var(--accent)/0.6)] md:h-[280px] md:w-[280px]">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-paper bg-paper font-display text-2xl font-semibold text-accent">
        {portraitOk ? (
          <img
            src={PROFILE_IMAGE}
            alt={`${profile.name} portrait`}
            width={280}
            height={280}
            className="h-full w-full object-cover"
            onError={() => setPortraitOk(false)}
          />
        ) : (
          "AK"
        )}
      </div>
    </div>
  );

  // Phones: a small avatar beside the status line, so the first screen is
  // name → role → value → CTAs, not a large photo pushing them down.
  const avatar = (
    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-paper sm:hidden">
      {portraitOk ? (
        <img
          src={PROFILE_IMAGE}
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-cover"
          onError={() => setPortraitOk(false)}
        />
      ) : null}
    </span>
  );

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative overflow-hidden border-b border-line"
    >
      <NebulaBackground />

      {/* Drifting canvas marks — design tokens scattered on the artboard */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={reduce ? undefined : { x: marksX, y: marksY }}
      >
        <span
          className="float-mark left-[8%] top-[22%]"
          style={{ animationDelay: "0s", animationDuration: "13s" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="7" r="3" />
          </svg>
        </span>
        <span
          className="float-mark float-mark--coral right-[14%] top-[16%]"
          style={{ animationDelay: "1.5s", animationDuration: "15s" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 2v14M2 9h14" />
          </svg>
        </span>
        <span
          className="float-mark float-mark--muted left-[46%] top-[10%]"
          style={{ animationDelay: "3s", animationDuration: "11s" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="2" y="2" width="12" height="12" rx="2" />
          </svg>
        </span>
        <span
          className="float-mark right-[30%] bottom-[18%]"
          style={{ animationDelay: "2.2s", animationDuration: "14s" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
          </svg>
        </span>
        <span
          className="float-mark float-mark--muted left-[16%] bottom-[14%]"
          style={{ animationDelay: "4s", animationDuration: "16s" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <circle cx="5" cy="5" r="2.5" />
          </svg>
        </span>
      </motion.div>

      <div className="page-container relative grid gap-8 pt-8 pb-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6 sm:pt-10 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
        <div className="text-left">
          <div className="load-in flex items-center gap-3">
            {avatar}
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3 py-1.5 font-mono text-[10px] uppercase leading-snug tracking-[0.1em] text-inkmuted sm:text-[11px] sm:tracking-[0.12em]">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to Lead Product Design · UI/UX &amp; CX roles
            </p>
          </div>
          <h1
            ref={headlineRef}
            className="mt-5 overflow-hidden font-display text-[2.75rem] font-bold leading-[1.02] tracking-tight text-ink min-[390px]:text-5xl sm:text-7xl"
          >
            {profile.name}
          </h1>
          <p
            className="load-in mt-2 text-balance font-display text-[1.375rem] font-semibold leading-tight tracking-tight text-accent sm:mt-3 sm:text-[2rem]"
            style={{ "--d": "0.4s" } as React.CSSProperties}
          >
            {role}
          </p>
          <p
            className="load-in mt-4 max-w-xl text-base leading-relaxed text-inkmuted sm:mt-5 sm:text-lg"
            style={{ "--d": "0.5s" } as React.CSSProperties}
          >
            {profile.blurb}
          </p>

          <ul
            aria-label="Profile summary"
            className="load-in mt-4 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink sm:mt-5 sm:gap-x-3 sm:text-[13px]"
            style={{ "--d": "0.6s" } as React.CSSProperties}
          >
            {meta.map((m, i) => (
              <li key={m} className="flex items-center gap-2.5 sm:gap-3">
                {m}
                {i < meta.length - 1 && <span aria-hidden="true" className="text-accent">·</span>}
              </li>
            ))}
          </ul>

          <div
            className="load-in mt-7 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:items-center"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            <Magnetic>
              <a
                href="#work"
                className="focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-onaccent shadow-[0_8px_24px_-8px_rgb(var(--accent)/0.6)] transition-[filter] hover:brightness-110 sm:inline-flex sm:w-auto"
              >
                View selected work
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </Magnetic>
            {showResume && (
              <ResumeButton variant="outline" className="min-h-12 w-full justify-center sm:w-auto" />
            )}
          </div>

          <div
            className="load-in mt-3 flex flex-wrap items-center gap-x-5 font-mono text-xs sm:mt-4"
            style={{ "--d": "0.8s" } as React.CSSProperties}
          >
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex min-h-11 items-center gap-1.5 text-inkmuted underline-offset-4 hover:text-accent hover:underline"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center text-inkmuted underline-offset-4 hover:text-accent hover:underline"
            >
              Email
            </a>
            <a
              href="#contact"
              className="focus-ring inline-flex min-h-11 items-center text-inkmuted underline-offset-4 hover:text-accent hover:underline"
            >
              All contact options →
            </a>
          </div>
        </div>

        <div
          className="load-in hidden justify-end sm:flex"
          style={{ perspective: 1000, "--d": "0.25s" } as React.CSSProperties}
        >
          <motion.div
            animate={reduce || !isDesktop ? undefined : { y: [0, -12, 0] }}
            transition={
              reduce || !isDesktop
                ? undefined
                : { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }
            className={`w-auto lg:w-full lg:max-w-sm ${
              heroCinematic ? "lg:max-w-none" : ""
            }`}
          >
            <motion.div
              style={
                reduce || !isDesktop
                  ? undefined
                  : {
                      x: cardX,
                      y: cardY,
                      rotateX: cardRotateX,
                      rotateY: cardRotateY,
                      transformPerspective: 1000,
                    }
              }
            >
              {/* Below `lg` — plain circular portrait, no frame. The full
                  card/cinematic treatment is desktop-only. */}
              <div className="lg:hidden">{portraitCircle}</div>
              <div className="hidden lg:block">
                {!isDesktop ? null : heroCinematic ? (
                  <CinematicPortrait
                    src={CINEMATIC_IMAGE}
                    colorSrc={COLOR_IMAGE || undefined}
                    alt={`${profile.name} portrait`}
                  />
                ) : (
                  cardFrame
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Selected impact — the numbers on record, then the capabilities
          they add up to. Numbers come from content (admin-editable). */}
      <div className="relative border-t border-line bg-panel">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/4 h-48 w-48 rounded-full bg-accent/30 blur-[70px]"
        />
        <div
          style={{ "--d": "0.9s" } as React.CSSProperties}
          className="load-in page-container relative py-10 sm:py-12"
        >
          <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
            Selected impact
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0 lg:divide-x lg:divide-line">
            {stats.map((stat) => {
              const s = parseStat(stat.value);
              return (
                <div key={stat.label} className="lg:px-6 lg:first:pl-0">
                  <dt className="font-display text-4xl font-extrabold leading-none text-ink sm:text-5xl">
                    {s.numeric ? (
                      <>
                        {s.prefix}
                        <CountUp end={s.end} duration={2} enableScrollSpy scrollSpyOnce />
                        {s.suffix}
                      </>
                    ) : (
                      stat.value
                    )}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-inkmuted first-letter:uppercase">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
            {CAPABILITIES.map((c) => (
              <div key={c.value} className="lg:px-6">
                <dt className="font-display text-2xl font-bold leading-[1.1] text-ink sm:text-[1.75rem]">
                  {c.value}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-inkmuted">{c.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
