"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { toolkit as seedToolkit } from "@/data/content";
import NebulaBackground from "./NebulaBackground";
import ToolkitOrbit from "./ToolkitOrbit";
import { ToolIcon, allToolNames } from "./ToolIcon";

// Each group plays as a short sequence: the label slides in, then the chips
// rise out of a soft blur one at a time, and each icon pops in just after
// its chip lands — so the stack reads as being assembled, not dumped.
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const label: Variants = {
  hidden: { opacity: 0, x: -16, letterSpacing: "0.3em" },
  show: {
    opacity: 1,
    x: 0,
    letterSpacing: "0.05em",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipRow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const chip: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.88, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.7 },
  },
};

const icon: Variants = {
  hidden: { scale: 0, rotate: -120 },
  show: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 16, delay: 0.12 },
  },
};

// These groups' tools skip the icon — both in their own chips (text-only)
// and in the animated orbit pool on the left (real product logos only).
const NO_ICON_GROUPS = new Set(["Platforms", "Practice", "Soft Skills", "Languages"]);

export default function Toolkit({
  toolkit = seedToolkit,
}: {
  toolkit?: typeof seedToolkit;
}) {
  const reduce = useReducedMotion();

  return (
    <section id="toolkit" className="relative border-b border-line">
      {/* No overflow-hidden here — it would clip the containing block and
          silently break the sticky icon orbit below. NebulaBackground
          self-contains via absolute inset-0 / sticky. */}
      <NebulaBackground parallax />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <div className="lg:sticky lg:top-28 lg:flex lg:min-h-[70vh] lg:items-center">
              <ToolkitOrbit
                tools={allToolNames(
                  toolkit.filter((group) => !NO_ICON_GROUPS.has(group.group))
                )}
              />
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {allToolNames(toolkit).length}+ tools, one stack
            </span>
            <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl">
              Design tooling and the{" "}
              <span className="text-accent">
                ship-it stack
              </span>
              , side by side
            </h2>
            <p className="mt-5 max-w-xl text-base text-inkmuted">
              From first wireframe to production build — the design apps,
              front-end stack, AI copilots, and platforms that carry a
              project from idea to shipped.
            </p>

            <div className="mt-9 flex flex-col gap-7">
              {toolkit.map(({ group: name, tools }) => {
                const showIcon = !NO_ICON_GROUPS.has(name);
                return (
                  <motion.div
                    key={name}
                    initial={reduce ? undefined : "hidden"}
                    whileInView={reduce ? undefined : "show"}
                    viewport={{ once: true, amount: 0.3 }}
                    variants={reduce ? undefined : group}
                  >
                    <motion.h3
                      variants={reduce ? undefined : label}
                      className="font-mono text-[11px] uppercase tracking-wider text-inkmuted"
                    >
                      {name}
                    </motion.h3>
                    <motion.div
                      variants={reduce ? undefined : chipRow}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {tools.map((tool) => (
                        <motion.span
                          key={tool}
                          variants={reduce ? undefined : chip}
                          whileHover={reduce ? undefined : { y: -2 }}
                          className={
                            showIcon
                              ? "inline-flex cursor-default items-center gap-2 rounded-full border border-line bg-panel py-1.5 pl-1.5 pr-3.5 text-sm text-ink transition-colors hover:border-accent"
                              : "inline-flex cursor-default items-center rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent"
                          }
                        >
                          {showIcon && (
                            <motion.span
                              variants={reduce ? undefined : icon}
                              className="inline-flex"
                            >
                              <ToolIcon name={tool} size={22} />
                            </motion.span>
                          )}
                          {tool}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
