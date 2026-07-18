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
import CinematicPortrait from "./CinematicPortrait";
import ResumeButton from "./ResumeButton";
import SaveContact from "./SaveContact";

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

/** Fallback portrait path; the live path comes from profile.portrait. */
const DEFAULT_PORTRAIT = "/images/profile.jpg";

export default function Hero({
  profile = seedProfile,
  stats = seedStats,
}: {
  profile?: typeof seedProfile;
  stats?: typeof seedStats;
}) {
  const PROFILE_IMAGE = profile.portrait || DEFAULT_PORTRAIT;
  // The cinematic (desktop) canvas can use its own image; falls back to the card one.
  const CINEMATIC_IMAGE = profile.portraitCinematic || PROFILE_IMAGE;
  const heroCinematic = (profile.heroStyle ?? "card") === "cinematic";
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [portraitOk, setPortraitOk] = useState(true);
  const reduce = useReducedMotion();

  // Cursor position within the hero, normalized to [-0.5, 0.5], spring-smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  // Layered parallax — deeper layers move more; the card counter-moves + tilts.
  const blobX = useTransform(sx, (v) => v * 64);
  const blobY = useTransform(sy, (v) => v * 44);
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

  return (
    <section
      id="top"
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="canvas-grid relative overflow-hidden border-b border-line"
    >
      {/* Floating gradient — soft accent/coral wash, parallaxed by the cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={reduce ? undefined : { x: blobX, y: blobY }}
      >
        <div className="hero-blob hero-blob--accent absolute -left-24 -top-24 h-80 w-80 rounded-full" />
        <div className="hero-blob hero-blob--coral absolute -right-16 top-40 h-72 w-72 rounded-full" />
        <div className="hero-blob hero-blob--violet absolute bottom-0 left-1/3 h-64 w-64 rounded-full" />
      </motion.div>

      {/* Drifting canvas marks — design tokens scattered on the artboard */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
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

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Portfolio — Dubai, UAE
          </p>
          <h1
            ref={headlineRef}
            className="mt-5 overflow-hidden font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl"
          >
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl font-mono text-sm uppercase tracking-wide text-inkmuted">
            {profile.title}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-inkmuted sm:text-lg">
            {profile.blurb}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {profile.focus.map((f) => (
              <li
                key={f}
                className="rounded-sm border border-line bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-inkmuted"
              >
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#work"
                className="focus-ring inline-block rounded-sm bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-accent"
              >
                View selected work
              </a>
            </Magnetic>
            <Magnetic>
              <SaveContact variant="solid" />
            </Magnetic>
            <a
              href={`mailto:${profile.email}`}
              className="focus-ring rounded-sm border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {profile.email}
            </a>
            <ResumeButton />
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
            {stats.map((stat) => {
              const s = parseStat(stat.value);
              return (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-semibold text-ink">
                    {s.numeric ? (
                      <>
                        {s.prefix}
                        <CountUp end={s.end} duration={2} />
                        {s.suffix}
                      </>
                    ) : (
                      stat.value
                    )}
                  </dt>
                  <dd className="mt-1 font-mono text-[11px] uppercase leading-snug tracking-wide text-inkmuted">
                    {stat.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div
          className="flex justify-center lg:justify-end"
          style={{ perspective: 1000 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }
            className={`w-full max-w-sm ${
              heroCinematic ? "lg:max-w-none" : ""
            }`}
          >
            <motion.div
              style={
                reduce
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
              {heroCinematic ? (
                <>
                  {/* Mobile always shows the framed card — the cinematic dust
                      portrait (and its hover reveal) is desktop-only. */}
                  <div className="lg:hidden">{cardFrame}</div>
                  <div className="hidden lg:block">
                    <CinematicPortrait
                      src={CINEMATIC_IMAGE}
                      alt={`${profile.name} portrait`}
                    />
                  </div>
                </>
              ) : (
                cardFrame
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
