"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { about as seedAbout } from "@/data/content";
import SelectionFrame from "./SelectionFrame";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function About({
  about = seedAbout,
}: {
  about?: typeof seedAbout;
}) {
  const reduce = useReducedMotion();

  const fadeUp = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="about" className="border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div {...fadeUp}>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            About
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {about.lead}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...fadeUp} className="space-y-5">
            {about.paragraphs.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="max-w-xl text-base leading-relaxed text-inkmuted"
              >
                {p}
              </p>
            ))}
          </motion.div>

          <div className="lg:pl-2">
            <SelectionFrame
              tag="Frame · What I deliver"
              className="border border-line bg-paper p-7"
            >
              <h3 className="font-mono text-xs uppercase tracking-wider text-accent">
                What I deliver
              </h3>
              <motion.ul
                className="mt-5 space-y-3"
                variants={reduce ? undefined : stagger}
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, margin: "-60px" }}
              >
                {about.delivers.map((d) => (
                  <motion.li
                    key={d.slice(0, 24)}
                    variants={reduce ? undefined : item}
                    className="flex gap-3 text-sm leading-relaxed text-ink"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    {d}
                  </motion.li>
                ))}
              </motion.ul>
            </SelectionFrame>
          </div>
        </div>

        <motion.div
          {...fadeUp}
          className="mt-16 border-t border-line pt-10"
        >
          <h3 className="font-mono text-xs uppercase tracking-wider text-inkmuted">
            Core Expertise
          </h3>
          <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-[1.6fr_0.4fr]">
            {about.expertise.map((group) => (
              <div key={group.group}>
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                  {group.group}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((it) => (
                    <motion.span
                      key={it}
                      whileHover={reduce ? undefined : { y: -3 }}
                      className="cursor-default rounded-sm border border-line bg-paper px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent"
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
