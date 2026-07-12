"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { toolkit as seedToolkit } from "@/data/content";

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
    <section id="toolkit" className="canvas-grid border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Toolkit
        </h2>
        <p className="mt-3 max-w-xl text-sm text-inkmuted">
          What's in the layers panel — design tooling on one side, the
          front-end stack that ships it on the other.
        </p>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
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
                    className="cursor-default rounded-sm border border-line bg-panel px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent"
                  >
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
