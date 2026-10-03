"use client";

import {
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";

import {
  Sparkles,
  Route,
  Component,
  ShoppingBag,
  Code2,
  ArrowRight,
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

// Paired with about.delivers by index — keep the two in the same order.
const DELIVER_META: {
  title: string;
  Icon: LucideIcon;
}[] = [
  { title: "Product & CX Design", Icon: Route },
  { title: "E-commerce & Digital Platforms", Icon: ShoppingBag },
  { title: "Design Systems", Icon: Component },
  { title: "AI Product & UX", Icon: Sparkles },
  { title: "Front-End Development", Icon: Code2 },
];

const HIGHLIGHT = "simple, scalable, and high-performing";

export default function About({
  about = seedAbout,
}: {
  about?: typeof seedAbout;
}) {
  const reduce = useReducedMotion();

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
                text-lg
                font-semibold
                leading-[1.3]
                tracking-[-0.02em]
                text-ink
                sm:text-2xl
                lg:max-w-2xl
                lg:text-[26px]
              "
            >
              {leadParts.length === 2 ? (
                <>
                  {leadParts[0]}

                  <span
                    className="text-accent"
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
              {about.paragraphs.map((p, pi) => (
                <p
                  key={p.slice(0, 24)}
                  className={`${pi >= 2 ? "hidden sm:block" : ""}
                    text-base
                    leading-[1.75]
                    text-inkmuted
                    lg:max-w-xl
                  `}
                >
                  {p}
                </p>
              ))}
            </motion.div>

            {about.flow?.length ? (
              <motion.div {...fadeUp} className="mt-10 hidden sm:block">
                <p
                  className="
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.08em]
                    text-accent
                  "
                >
                  How I work
                </p>

                <ol
                  className="
                    mt-4
                    flex
                    flex-wrap
                    items-center
                    gap-x-1.5
                    gap-y-2
                    lg:max-w-xl
                  "
                >
                  {about.flow.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className="
                          rounded-md
                          border
                          border-line
                          bg-panel
                          px-2.5
                          py-1
                          text-[13px]
                          text-ink
                        "
                      >
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
              Capabilities
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
              What I Bring
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
              variants={stagger}
              initial="hidden"
              whileInView="show"
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
                    variants={item}
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
            Expertise & Industries
          </h3>

          <div
            className="
              mt-6
              grid
              gap-x-10
              gap-y-8
              sm:grid-cols-[1.4fr_0.6fr]
            "
          >
            {about.expertise.map((group, gi) => (
              <div
                key={group.group}
                className={gi === 0 ? "sm:col-span-2" : "hidden sm:block"}
              >
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