"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

import {
  education as seedEducation,
  experience as seedExperience,
} from "@/data/content";

/* =========================================================
   EXPERIENCE ITEM
   ========================================================= */

function ExperienceItem({
  role,
  index,
  total,
}: {
  role: (typeof seedExperience)[number];
  index: number;
  total: number;
}) {
  const reduce = useReducedMotion();

  /*
   * Controls the View More state.
   */
  const [isExpanded, setIsExpanded] = useState(false);

  /*
   * Reference for individual experience.
   */
  const itemRef = useRef<HTMLElement>(null);

  /*
   * Scroll progress for this experience item.
   */
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start 90%", "start 35%"],
  });

  /*
   * Experience moves upward while entering viewport.
   */
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [70, 0]
  );

  /*
   * Fade in.
   */
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 1],
    [0, 0.7, 1]
  );

  /*
   * Small scale animation.
   */
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [0.97, 1]
  );

  /*
   * Mouse leaves the experience section.
   *
   * Automatically close the highlights.
   */
  // Expand/collapse is a tap toggle — no hover dependency, so it works
  // the same with touch, mouse and keyboard.

  return (
    <motion.article
      ref={itemRef}
      // Always bound: the server can't know the motion preference, so the
      // scroll-linked values (flattened for reduced motion) keep the card visible.
      style={{ y, opacity, scale }}
      className={`
        group
        grid
        grid-cols-1
        gap-3
        py-6
        sm:gap-6
        sm:py-8

        sm:grid-cols-[250px_32px_minmax(0,1fr)]
        sm:gap-0
        sm:py-9

        lg:grid-cols-[330px_40px_minmax(0,1fr)]

        ${
          index !== total - 1
            ? "border-b border-line"
            : ""
        }
      `}
    >
      {/* =====================================================
          PERIOD
          ===================================================== */}

      <div className="pt-1">
        <span
          className="
            font-display
            text-[18px]
            font-semibold
            tracking-[-0.02em]
            text-accent

            sm:text-[19px]
          "
        >
          {role.period}
        </span>
      </div>

      {/* =====================================================
          TIMELINE DOT
          ===================================================== */}

      <div className="relative hidden sm:block">
        <motion.span
          animate={
            reduce
              ? undefined
              : {
                  scale: isExpanded ? 1.15 : 1,
                }
          }
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            left-0
            top-[5px]
            h-[13px]
            w-[13px]
            rounded-full
            bg-accent
          "
        />
      </div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div className="min-w-0">
        {/* -----------------------------------------------------
            TITLE + COMPANY
        ----------------------------------------------------- */}

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3
            className="
              font-display
              text-[19px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-ink

              sm:text-[25px]
            "
          >
            {role.title || role.company}
          </h3>

          {role.title && (
            <span
              className="
                font-display
                text-[18px]
                font-normal
                text-inkmuted

                sm:text-[19px]
              "
            >
              at {role.company}
            </span>
          )}
        </div>

        {/* -----------------------------------------------------
            DESCRIPTION
        ----------------------------------------------------- */}

        {role.blurb && (
          <p
            className="
              mt-4
              hidden
              max-w-[920px]
              sm:block

              font-display
              text-[15px]
              leading-[1.65]
              text-inkmuted

              sm:text-[16px]
              lg:text-[17px]
            "
          >
            {role.blurb}
          </p>
        )}

        {/* =====================================================
            VIEW MORE
            ===================================================== */}

        {role.highlights &&
          role.highlights.length > 0 && (
            <div className="mt-2 sm:mt-4">
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                aria-expanded={isExpanded}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  gap-2

                  border-0
                  bg-transparent
                  p-0

                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.14em]

                  text-accent

                  transition-colors
                  duration-300

                  hover:text-ink

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-accent
                  focus-visible:ring-offset-4
                  focus-visible:ring-offset-paper
                "
              >
                <span>{isExpanded ? "Show less" : "View more"}</span>

                <motion.span
                  animate={{
                    y: isExpanded ? 2 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    flex
                    h-4
                    w-4
                    items-center
                    justify-center
                  "
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </button>
            </div>
          )}

        {/* =====================================================
            EXPANDABLE HIGHLIGHTS
            ===================================================== */}

        <AnimatePresence initial={false}>
          {isExpanded &&
            role.highlights &&
            role.highlights.length > 0 && (
              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                transition={{
                  height: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: {
                    duration: 0.25,
                  },
                }}
                className="overflow-hidden"
              >
                {role.blurb && (
                  <p className="pt-2 text-[14px] leading-[1.65] text-inkmuted sm:hidden">{role.blurb}</p>
                )}
                <ul className="space-y-3 pt-3 sm:pt-5">
                  {role.highlights.map(
                    (highlight, highlightIndex) => (
                      <motion.li
                        key={highlight}
                        initial={{
                                opacity: 0,
                                x: -12,
                              }}
                        animate={{
                                opacity: 1,
                                x: 0,
                              }}
                        exit={{
                                opacity: 0,
                                x: -8,
                              }}
                        transition={{
                          duration: 0.3,
                          delay: reduce
                            ? 0
                            : highlightIndex * 0.045,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="
                          flex
                          gap-3

                          text-[14px]
                          leading-[1.7]
                          text-inkmuted

                          sm:text-[15px]
                        "
                      >
                        {/* Purple bullet */}
                        <span
                          className="
                            mt-[9px]
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-accent
                          "
                        />

                        <span>{highlight}</span>
                      </motion.li>
                    )
                  )}
                </ul>
              </motion.div>
            )}
        </AnimatePresence>

        {/* -----------------------------------------------------
            LOCATION
        ----------------------------------------------------- */}

        {role.location && (
          <p
            className="
              mt-5

              font-mono
              text-[10px]
              uppercase
              tracking-[0.12em]
              text-inkmuted
            "
          >
            {role.location}
          </p>
        )}
      </div>
    </motion.article>
  );
}

const RECENT_ROLES = 4;

// Web Design → UI/UX → Product Design → CX → Design Systems → Enterprise → AI
// years drives each era's column width on the timeline; step its bar height.
const CAREER_ARC = [
  {
    from: "2010",
    period: "2010 — 2013",
    years: 3,
    stages: ["Web Design"],
    note: "Web design and front-end builds at Media Crow, Viaweb and Eden Software.",
  },
  {
    from: "2013",
    period: "2013 — 2020",
    years: 7,
    stages: ["UI/UX"],
    note: "Senior UI/UX for UK, European, US and UAE clients at eWoke and Citrus, then UAE e-commerce and marketplaces at Shopinc and Organic & Real.",
  },
  {
    from: "2020",
    period: "2020 — Present · Home & furniture retail",
    years: 6,
    stages: ["Product Design", "CX", "Design Systems", "Enterprise", "AI"],
    note: "Leading UI/UX & CX across e-commerce, mobile, marketplace and enterprise platforms, then AI experiences like YARA.",
  },
];

/* =========================================================
   MAIN EXPERIENCE COMPONENT
   ========================================================= */

export default function Experience({
  experience = seedExperience,
  education = seedEducation,
}: {
  experience?: typeof seedExperience;
  education?: typeof seedEducation;
}) {
  const reduce = useReducedMotion();
  const [showAllRoles, setShowAllRoles] = useState(false);

  return (
    <section id="experience" className="scroll-mt-20 bg-paper py-14 sm:py-20 lg:py-32">
      <div className="page-container">

        {/* ===================================================
            SECTION HEADING
            =================================================== */}

        <motion.h2
          initial={{
                  opacity: 0,
                  y: 20,
                }}
          whileInView={{
                  opacity: 1,
                  y: 0,
                }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            font-display
            text-[34px]
            font-semibold
            leading-[1.05]
            tracking-[-0.04em]
            text-ink

            sm:text-[52px]
            lg:text-[58px]
          "
        >
          Professional Experience
        </motion.h2>

        {/* Career arc — a growth staircase on a 2010 → today axis. Column
            widths follow the years in each era; the bars step up as the
            role grew. Dates and companies match the timeline below. */}
        <ol
          aria-label="Career arc"
          className="mt-10 grid gap-8 md:gap-0 md:[grid-template-columns:var(--cols)]"
          style={{ ["--cols" as string]: CAREER_ARC.map((e) => `minmax(0,${e.years}fr)`).join(" ") }}
        >
            {CAREER_ARC.map((era, i) => {
              const last = i === CAREER_ARC.length - 1;
              return (
                <motion.li
                  key={era.period}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col md:pr-6 lg:pr-8"
                >
                  <p className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">
                    <span className="mr-2 text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {era.period}
                  </p>

                  <ul className="mt-3 flex flex-wrap items-center gap-1.5">
                    {era.stages.map((stage, j) => (
                      <li key={stage} className="flex items-center gap-1.5">
                        {j > 0 && <span aria-hidden="true" className="text-accent">→</span>}
                        <span
                          className={
                            era.stages.length > 1
                              ? `rounded-full px-3 py-1 text-sm font-medium ${
                                  j === era.stages.length - 1
                                    ? "bg-accent text-onaccent"
                                    : "border border-line text-ink"
                                }`
                              : "font-display text-2xl font-semibold tracking-tight text-ink"
                          }
                        >
                          {stage}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* md:mb-8 keeps a minimum gap above the bar, which mt-auto
                      would otherwise collapse to 0 in the tallest column. */}
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-inkmuted md:mb-8">{era.note}</p>

                  {/* The step: taller each era. Phones show it as a growing rule. */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative mt-5 h-2 overflow-hidden rounded-full md:mt-auto md:!w-full md:h-[var(--step)] md:rounded-b-none md:rounded-t-[18px] ${
                      last
                        ? "bg-accent"
                        : "border border-line bg-[repeating-linear-gradient(135deg,rgb(var(--accent)/0.18)_0_2px,transparent_2px_9px)]"
                    }`}
                    style={{ width: `${((i + 1) / CAREER_ARC.length) * 100}%`, ["--step" as string]: `${56 + i * 56}px` }}
                  >
                    <span
                      className={`absolute bottom-2 left-4 hidden font-display text-4xl font-bold leading-none tracking-[-0.05em] md:block ${
                        last ? "text-onaccent" : "text-ink/25"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {last && (
                      <span className="absolute right-4 top-3 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-onaccent md:inline-flex">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-onaccent" />
                        Now
                      </span>
                    )}
                  </motion.div>

                  {/* Year axis under the bars (desktop). */}
                  <div className="relative hidden border-t border-line pt-2 md:-mr-6 md:flex md:justify-between md:pr-6 lg:-mr-8 lg:pr-8">
                    <span className="font-mono text-[11px] tabular-nums text-inkmuted">{era.from}</span>
                    {last && <span className="font-mono text-[11px] text-accent">Today</span>}
                  </div>
                </motion.li>
              );
            })}
        </ol>

        {/* ===================================================
            EXPERIENCE CARD
            =================================================== */}

        <motion.div
          initial={{
                  opacity: 0,
                  y: 30,
                }}
          whileInView={{
                  opacity: 1,
                  y: 0,
                }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mt-16
            overflow-hidden

            rounded-[28px]

            border
            border-line

            bg-panel

            px-5
            py-4

            sm:px-10
            sm:py-10

            lg:px-12
            lg:py-12
          "
        >
          {/* Experience list */}

          {/* Phones: the four most recent roles, older ones on request. */}
          <div id="experience-roles">
            {experience.map((role, i) => (
              <div
                key={`${role.company}-${role.period}`}
                className={!showAllRoles && i >= RECENT_ROLES ? "max-sm:hidden" : undefined}
              >
                <ExperienceItem role={role} index={i} total={experience.length} />
              </div>
            ))}
          </div>
          {experience.length > RECENT_ROLES && (
            <button
              type="button"
              onClick={() => setShowAllRoles((v) => !v)}
              aria-expanded={showAllRoles}
              aria-controls="experience-roles"
              className="focus-ring mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 font-mono text-xs uppercase tracking-wider text-ink active:bg-paper sm:hidden"
            >
              {showAllRoles ? "Show fewer roles" : `Show all ${experience.length} roles`}
            </button>
          )}
        </motion.div>

        {/* ===================================================
            EDUCATION
            =================================================== */}

        {education?.length > 0 && (
          <motion.div
            initial={{
                    opacity: 0,
                    y: 20,
                  }}
            whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
            viewport={{
              once: true,
              margin: "-60px",
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-20"
          >
            {/* Education heading */}

            <p
              className="
                font-mono
                text-[11px]
                uppercase
                tracking-[0.16em]
                text-inkmuted
              "
            >
              Education
            </p>

            {/* Education items */}

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {education.map((item) => (
                <div key={item.degree}>
                  <h3
                    className="
                      font-display
                      text-[18px]
                      font-semibold
                      text-ink
                    "
                  >
                    {item.degree}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      text-inkmuted
                    "
                  >
                    {item.school}
                  </p>

                  <p
                    className="
                      mt-2
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.12em]
                      text-inkmuted
                    "
                  >
                    {item.period}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}