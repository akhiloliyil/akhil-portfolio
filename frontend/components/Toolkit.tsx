"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { toolkit as seedToolkit } from "@/data/content";
import NebulaBackground from "./NebulaBackground";
import ToolkitMarquee from "./ToolkitMarquee";
import { ToolIcon, allToolNames } from "./ToolIcon";

const groupStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const chip: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Toolkit({
  toolkit = seedToolkit,
}: {
  toolkit?: typeof seedToolkit;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="toolkit"
      className="relative overflow-hidden border-b border-line"
    >
      <NebulaBackground />
      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Toolkit
        </h2>
        <p className="mt-3 max-w-xl text-sm text-inkmuted">
          What's in the layers panel — design tooling on one side, the
          front-end stack that ships it on the other.
        </p>

        <div className="mt-12 grid items-center gap-10 rounded-2xl border border-line bg-panel p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ToolkitMarquee tools={allToolNames(toolkit)} />
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-accent">
              {allToolNames(toolkit).length}+ tools, one stack
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Design tooling and the ship-it stack, side by side
            </h3>
            <p className="mt-3 text-sm text-inkmuted">
              From first wireframe to production build — the design apps,
              front-end stack, AI copilots, and platforms that carry a
              project from idea to shipped.
            </p>
            <a
              href="#toolkit-groups"
              className="focus-ring mt-6 inline-block rounded-sm bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-accent"
            >
              Browse the full list
            </a>
          </div>
        </div>

        <div
          id="toolkit-groups"
          className="mt-16 grid scroll-mt-24 gap-x-8 gap-y-10 sm:grid-cols-2"
        >
          {toolkit.map((group) => (
            <motion.div
              key={group.group}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-70px" }}
              variants={reduce ? undefined : groupStagger}
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent">
                {group.group}
              </h3>
              {/* Animated underline — grows to full width as the group reveals */}
              <div className="mt-2 h-px w-full bg-line">
                <motion.div
                  className="h-px origin-left bg-accent"
                  initial={reduce ? undefined : { scaleX: 0 }}
                  whileInView={reduce ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.tools.map((tool) => (
                  <motion.span
                    key={tool}
                    variants={reduce ? undefined : chip}
                    whileHover={reduce ? undefined : { y: -3 }}
                    className="inline-flex cursor-default items-center gap-2 rounded-sm border border-line bg-panel py-1.5 pl-1.5 pr-3 text-sm text-ink transition-colors hover:border-accent"
                  >
                    <ToolIcon name={tool} size={22} />
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
