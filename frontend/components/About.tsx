"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import {
  TrendingUp,
  Workflow,
  Component,
  Zap,
  Target,
  type LucideIcon,
} from "lucide-react";

import { about as seedAbout } from "@/data/content";

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const DELIVER_META: {
  title: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Conversion-Focused Products",
    Icon: TrendingUp,
  },
  {
    title: "Simplified Workflows",
    Icon: Workflow,
  },
  {
    title: "Scalable Design Systems",
    Icon: Component,
  },
  {
    title: "AI-Assisted Prototyping",
    Icon: Zap,
  },
  {
    title: "Strategic Product Alignment",
    Icon: Target,
  },
];

const HIGHLIGHT = "don't just look good";

export default function About({
  about = seedAbout,
}: {
  about?: typeof seedAbout;
}) {
  const reduce = useReducedMotion();

  const fadeUp = reduce
    ? {}
    : {
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
        py-24
        text-ink
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
        className="
          relative
          mx-auto
          max-w-[1380px]
          px-6
          lg:px-10
          xl:px-12
        "
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
            MAIN CONTENT
        ==================================================== */}

        <div
          className="
            mt-10
            grid
            gap-12
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-16
          "
        >
          {/* =================================================
              LEFT
          ================================================== */}

          <div>
            <motion.h2
              {...fadeUp}
              className="
                font-display
                text-4xl
                font-semibold
                leading-[1.05]
                tracking-[-0.04em]
                text-ink
                sm:text-5xl
                lg:max-w-2xl
                lg:text-[52px]
              "
            >
              {leadParts.length === 2 ? (
                <>
                  {leadParts[0]}

                  <span
                    className="
                      bg-gradient-to-r
                      from-sky-400
                      to-accent
                      bg-clip-text
                      text-transparent
                    "
                  >
                    {HIGHLIGHT}
                  </span>

                  {leadParts[1]}
                </>
              ) : (
                about.lead
              )}
            </motion.h2>

            <motion.div
              {...fadeUp}
              className="mt-8 space-y-5"
            >
              {about.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="
                    text-base
                    leading-[1.75]
                    text-inkmuted
                    lg:max-w-xl
                  "
                >
                  {p}
                </p>
              ))}
            </motion.div>
          </div>

          {/* =================================================
              WHAT I DELIVER
          ================================================== */}

          <motion.div
            {...fadeUp}
            className="
              rounded-[22px]
              border
              border-line
              bg-panel
              p-7
              shadow-[0_20px_60px_rgba(0,0,0,0.22)]
              sm:p-8
            "
          >
            <span
              className="
                font-mono
                text-[11px]
                uppercase
                tracking-[0.08em]
                text-accent
              "
            >
              Commitment to quality
            </span>

            <h3
              className="
                mt-2
                font-display
                text-2xl
                font-semibold
                tracking-[-0.025em]
                text-ink
              "
            >
              What I Deliver
            </h3>

            <div
              className="
                mt-5
                border-t
                border-line
              "
            />

            <motion.ul
              className="mt-6 space-y-6"
              variants={reduce ? undefined : stagger}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{
                once: true,
                margin: "-60px",
              }}
            >
              {about.delivers.map((d, i) => {
                const meta = DELIVER_META[i];

                const Icon = meta?.Icon ?? Target;

                return (
                  <motion.li
                    key={d.slice(0, 24)}
                    variants={reduce ? undefined : item}
                    className="flex gap-4"
                  >
                    {/* Icon */}
                    <span
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-accent/15
                        bg-accent/10
                      "
                    >
                      <Icon
                        className="
                          h-5
                          w-5
                          text-accent
                        "
                        strokeWidth={1.8}
                      />
                    </span>

                    {/* Content */}
                    <div>
                      <p
                        className="
                          font-display
                          text-base
                          font-semibold
                          text-ink
                        "
                      >
                        {meta?.title ?? d}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-[1.65]
                          text-inkmuted
                        "
                      >
                        {d}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>

        {/* ===================================================
            CORE EXPERTISE
        ==================================================== */}

        <motion.div
          {...fadeUp}
          className="
            mt-16
            border-t
            border-line
            pt-10
          "
        >
          <h3
            className="
              font-mono
              text-[11px]
              uppercase
              tracking-[0.08em]
              text-inkmuted
            "
          >
            Core Expertise
          </h3>

          <div
            className="
              mt-6
              grid
              gap-x-10
              gap-y-8
              sm:grid-cols-[1.6fr_0.4fr]
            "
          >
            {about.expertise.map((group) => (
              <div key={group.group}>
                <p
                  className="
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.08em]
                    text-accent
                  "
                >
                  {group.group}
                </p>

                <div
                  className="
                    mt-4
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {group.items.map((it) => (
                    <motion.span
                      key={it}
                      whileHover={
                        reduce
                          ? undefined
                          : {
                              y: -3,
                            }
                      }
                      className="
                        cursor-default
                        rounded-full
                        border
                        border-line
                        bg-panel
                        px-3
                        py-1.5
                        text-sm
                        text-inkmuted
                        transition-colors
                        hover:border-accent/40
                        hover:text-accent
                      "
                    >
                      {it}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}