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
    [70, 0]
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
    [0.97, 1]
  );

  /*
   * Mouse leaves the experience section.
   *
   * Automatically close the highlights.
   */
  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <motion.article
      ref={itemRef}
      style={
        reduce
          ? undefined
          : {
              y,
              opacity,
              scale,
            }
      }
      onMouseLeave={handleMouseLeave}
      className={`
        group
        grid
        grid-cols-1
        gap-6
        py-8

        sm:grid-cols-[250px_32px_minmax(0,1fr)]
        sm:gap-0
        sm:py-9

        lg:grid-cols-[330px_40px_minmax(0,1fr)]

        ${
          index !== total - 1
            ? "border-b border-[#272433]"
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
            text-[#00c7e8]

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
            bg-[#9b5cff]
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
              text-[23px]
              font-semibold
              leading-tight
              tracking-[-0.025em]
              text-white

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
                text-[#9da0b7]

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
              max-w-[920px]

              font-display
              text-[15px]
              leading-[1.65]
              text-[#9da0b7]

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
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                aria-expanded={isExpanded}
                className="
                  inline-flex
                  items-center
                  gap-2

                  border-0
                  bg-transparent
                  p-0

                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.14em]

                  text-[#00c7e8]

                  transition-colors
                  duration-300

                  hover:text-white

                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#9b5cff]
                  focus-visible:ring-offset-4
                  focus-visible:ring-offset-[#0a0a10]
                "
              >
                <span>View more</span>

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
                <ul className="space-y-3 pt-5">
                  {role.highlights.map(
                    (highlight, highlightIndex) => (
                      <motion.li
                        key={highlight}
                        initial={
                          reduce
                            ? undefined
                            : {
                                opacity: 0,
                                x: -12,
                              }
                        }
                        animate={
                          reduce
                            ? undefined
                            : {
                                opacity: 1,
                                x: 0,
                              }
                        }
                        exit={
                          reduce
                            ? undefined
                            : {
                                opacity: 0,
                                x: -8,
                              }
                        }
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
                          text-[#9da0b7]

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
                            bg-[#9b5cff]
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
              text-[#6f7287]
            "
          >
            {role.location}
          </p>
        )}
      </div>
    </motion.article>
  );
}

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

  return (
    <section className="bg-[#050509] py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14">

        {/* ===================================================
            SECTION HEADING
            =================================================== */}

        <motion.h2
          initial={
            reduce
              ? undefined
              : {
                  opacity: 0,
                  y: 20,
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
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            font-display
            text-[42px]
            font-semibold
            leading-[1.05]
            tracking-[-0.04em]
            text-white

            sm:text-[52px]
            lg:text-[58px]
          "
        >
          Professional Experience
        </motion.h2>

        {/* ===================================================
            EXPERIENCE CARD
            =================================================== */}

        <motion.div
          initial={
            reduce
              ? undefined
              : {
                  opacity: 0,
                  y: 30,
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
          className="
            mt-16
            overflow-hidden

            rounded-[28px]

            border
            border-[#272433]

            bg-[#0a0a10]

            px-7
            py-8

            sm:px-10
            sm:py-10

            lg:px-12
            lg:py-12
          "
        >
          {/* Experience list */}

          <div>
            {experience.map((role, i) => (
              <ExperienceItem
                key={`${role.company}-${role.period}`}
                role={role}
                index={i}
                total={experience.length}
              />
            ))}
          </div>
        </motion.div>

        {/* ===================================================
            EDUCATION
            =================================================== */}

        {education?.length > 0 && (
          <motion.div
            initial={
              reduce
                ? undefined
                : {
                    opacity: 0,
                    y: 20,
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
                text-[#77798d]
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
                      text-white
                    "
                  >
                    {item.degree}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[15px]
                      text-[#9da0b7]
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
                      text-[#77798d]
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