"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";

import {
  Search,
  Map,
  Palette,
  Play,
  Code2,
} from "lucide-react";

import { process as seedProcess } from "@/data/content";

const stepMeta = [
  {
    icon: Search,
    tags: [
      "Stakeholder Interviews",
      "Competitive Teardown",
      "Analytics Audit",
      "AI-assisted Synthesis",
    ],
  },
  {
    icon: Map,
    tags: [
      "User Personas",
      "Jobs-to-be-Done",
      "Journey Mapping",
      "Team Alignment",
    ],
  },
  {
    icon: Palette,
    tags: [
      "Figma Architecture",
      "Design Systems",
      "Accessibility (WCAG)",
      "High-Fi Prototyping",
    ],
  },
  {
    icon: Play,
    tags: [
      "Usability Testing",
      "Interactive Flows",
      "AI Exploration",
      "Risk De-risking",
    ],
  },
  {
    icon: Code2,
    tags: [
      "React / Next.js",
      "React Native",
      "Quality Assurance",
      "Bridging Code & Design",
    ],
  },
];

export default function DesignProcess({
  process = seedProcess,
}: {
  process?: typeof seedProcess;
}) {
  const reduce = useReducedMotion();

  const listRef = useRef<HTMLOListElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 65%"],
  });

  return (
    <section
      className="
        relative
        overflow-visible
        bg-[#070a10]
        py-24
        lg:py-32
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Purple glow */}
        <div
          className="
            absolute
            -left-[220px]
            top-[80px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[radial-gradient(circle,rgba(126,34,206,0.24)_0%,rgba(88,28,135,0.12)_35%,transparent_72%)]
            blur-[30px]
          "
        />

        {/* Blue glow */}
        <div
          className="
            absolute
            -right-[300px]
            top-[350px]
            h-[800px]
            w-[800px]
            rounded-full
            bg-[radial-gradient(circle,rgba(14,55,125,0.25)_0%,rgba(15,23,42,0.12)_40%,transparent_72%)]
            blur-[40px]
          "
        />

        {/* Center glow */}
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
            bg-[radial-gradient(circle,rgba(34,211,238,0.025),transparent_70%)]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1380px]
          overflow-visible
          px-6
          lg:px-10
          xl:px-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-16
            overflow-visible
            lg:grid-cols-[minmax(360px,0.72fr)_minmax(650px,1.28fr)]
            lg:gap-10
            xl:gap-16
          "
        >
          {/* =================================================
              LEFT / STICKY INTRO
          ================================================== */}

          <div
            className="
              relative
              self-start
              lg:sticky
              lg:top-24
              lg:z-20
              lg:h-fit
              lg:self-start
            "
          >
            <motion.div
              initial={
                reduce
                  ? undefined
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              whileInView={
                reduce
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Eyebrow */}

              <div
                className="
                  mb-8
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.04]
                  px-4
                  py-1.5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.02em]
                  text-cyan-400
                "
              >
                Design Process
              </div>

              {/* Heading */}

              <h2
                className="
                  max-w-[430px]
                  font-display
                  text-[48px]
                  font-semibold
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-[#f7f7fa]
                  sm:text-[56px]
                  lg:text-[58px]
                  xl:text-[62px]
                "
              >
                How I work
              </h2>

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-[440px]
                  text-[15px]
                  leading-[1.7]
                  text-[#9498aa]
                  sm:text-[16px]
                "
              >
                A repeatable, outcome-focused process that connects
                business goals, customer needs, and engineering reality —
                from first research to shipped product.
              </p>

              {/* Availability */}

              <div
                className="
                  mt-8
                  flex
                  max-w-[460px]
                  items-center
                  gap-4
                  rounded-[14px]
                  border
                  border-white/[0.08]
                  bg-white/[0.015]
                  px-5
                  py-4
                  shadow-[0_20px_60px_rgba(0,0,0,0.2)]
                "
              >
                {/* Status indicator */}

                <span
                  className="
                    relative
                    flex
                    h-2.5
                    w-2.5
                    shrink-0
                  "
                >
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      animate-ping
                      rounded-full
                      bg-emerald-400
                      opacity-30
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-emerald-400
                      shadow-[0_0_14px_rgba(52,211,153,0.8)]
                    "
                  />
                </span>

                <span
                  className="
                    text-[13px]
                    font-medium
                    text-[#e7e8ed]
                  "
                >
                  Currently accepting projects for Q2 2025
                </span>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT / TIMELINE
          ================================================== */}

          <div className="relative min-w-0">
            <ol
              ref={listRef}
              className="
                relative
                grid
                grid-cols-[58px_minmax(0,1fr)]
                gap-0
              "
            >
              {/* =================================================
                  BASE TIMELINE
              ================================================== */}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-[28px]
                  top-0
                  h-full
                  w-px
                  bg-[#123344]
                "
              />

              {/* =================================================
                  ACTIVE TIMELINE
              ================================================== */}

              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-[28px]
                    top-0
                    h-full
                    w-px
                    origin-top
                    bg-cyan-400
                    shadow-[0_0_12px_rgba(34,211,238,0.65)]
                  "
                  style={{
                    scaleY: scrollYProgress,
                  }}
                />
              )}

              {/* =================================================
                  PROCESS STEPS
              ================================================== */}

              {process.map((step, index) => {
                const meta =
                  stepMeta[index] ??
                  stepMeta[stepMeta.length - 1];

                const Icon = meta.icon;

                return (
                  <motion.li
                    key={step.title}
                    className="
                      relative
                      col-span-2
                      grid
                      grid-cols-[58px_minmax(0,1fr)]
                      pb-7
                      last:pb-0
                      sm:pb-8
                    "
                    initial={
                      reduce
                        ? undefined
                        : {
                            opacity: 0,
                            y: 35,
                          }
                    }
                    whileInView={
                      reduce
                        ? undefined
                        : {
                            opacity: 1,
                            y: 0,
                          }
                    }
                    viewport={{
                      once: true,
                      margin: "-100px",
                    }}
                    transition={{
                      duration: 0.65,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* =================================================
                        NUMBER
                    ================================================== */}

                    <div className="relative z-10 flex justify-center">
                      <div
                        className="
                          grid
                          h-[50px]
                          w-[50px]
                          place-items-center
                          rounded-full
                          border
                          border-cyan-400/40
                          bg-[#070a10]
                          text-[15px]
                          font-semibold
                          tracking-[-0.02em]
                          text-cyan-400
                          shadow-[0_0_20px_rgba(34,211,238,0.08)]
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>

                    {/* =================================================
                        CARD
                    ================================================== */}

                    <div
                      className="
                        ml-1
                        min-w-0
                        rounded-[22px]
                        border
                        border-[#1a2132]
                        bg-[linear-gradient(135deg,rgba(15,17,27,0.96),rgba(9,12,22,0.96))]
                        p-7
                        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                        transition-all
                        duration-300
                        hover:border-cyan-400/20
                        hover:bg-[linear-gradient(135deg,rgba(18,21,33,0.98),rgba(10,14,25,0.98))]
                        hover:shadow-[0_25px_70px_rgba(0,0,0,0.28)]
                        sm:p-7
                        lg:min-h-[230px]
                        lg:p-8
                      "
                    >
                      {/* Card header */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-6
                        "
                      >
                        <h3
                          className="
                            font-display
                            text-[20px]
                            font-semibold
                            leading-tight
                            tracking-[-0.025em]
                            text-[#f3f4f8]
                            sm:text-[21px]
                          "
                        >
                          {step.title}
                        </h3>

                        {/* Icon */}

                        <div
                          className="
                            grid
                            h-9
                            w-9
                            shrink-0
                            place-items-center
                            rounded-[10px]
                            bg-white/[0.045]
                            text-[#8992a7]
                          "
                        >
                          <Icon
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>

                      {/* Description */}

                      <p
                        className="
                          mt-6
                          max-w-[690px]
                          text-[14px]
                          leading-[1.65]
                          text-[#969daf]
                          sm:text-[15px]
                        "
                      >
                        {step.body}
                      </p>

                      {/* Tags */}

                      <div
                        className="
                          mt-6
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="
                              inline-flex
                              items-center
                              rounded-full
                              border
                              border-white/[0.07]
                              bg-white/[0.035]
                              px-3
                              py-1.5
                              text-[11px]
                              font-medium
                              leading-none
                              text-[#969dad]
                            "
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
