"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Short label + icon per "what I deliver" line, index-matched to
// about.delivers (content.ts). Kept local to this component rather than in
// the data model — it's purely a display affordance for this one card, and
// drifts harmlessly if that list is ever reordered via the admin CMS.
const DELIVER_META: { title: string; Icon: LucideIcon }[] = [
  { title: "Conversion-Focused Products", Icon: TrendingUp },
  { title: "Simplified Workflows", Icon: Workflow },
  { title: "Scalable Design Systems", Icon: Component },
  { title: "AI-Assisted Prototyping", Icon: Zap },
  { title: "Strategic Product Alignment", Icon: Target },
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
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  const leadParts = about.lead.split(HIGHLIGHT);

  return (
    <section id="about" className="border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div {...fadeUp} className="flex items-center gap-3">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            About &amp; Philosophy
          </span>
        </motion.div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.h2
              {...fadeUp}
              className="max-w-2xl font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl"
            >
              {leadParts.length === 2 ? (
                <>
                  {leadParts[0]}
                  <span className="bg-gradient-to-r from-accent to-[#8b5cf6] bg-clip-text text-transparent">
                    {HIGHLIGHT}
                  </span>
                  {leadParts[1]}
                </>
              ) : (
                about.lead
              )}
            </motion.h2>

            <motion.div {...fadeUp} className="mt-8 space-y-5">
              {about.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="max-w-xl text-base leading-relaxed text-inkmuted"
                >
                  {p}
                </p>
              ))}
            </motion.div>
          </div>

          <motion.div
            {...fadeUp}
            className="rounded-2xl border border-[#8b5cf6]/25 bg-paper p-8 shadow-[0_0_60px_-24px_rgba(139,92,246,0.4)]"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-[#8b5cf6]">
              Commitment to quality
            </span>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
              What I Deliver
            </h3>
            <div className="mt-5 border-t border-line" />

            <motion.ul
              className="mt-6 space-y-6"
              variants={reduce ? undefined : stagger}
              initial={reduce ? undefined : "hidden"}
              whileInView={reduce ? undefined : "show"}
              viewport={{ once: true, margin: "-60px" }}
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
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#8b5cf6]/25 bg-[#8b5cf6]/10">
                      <Icon className="h-5 w-5 text-[#8b5cf6]" />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-ink">
                        {meta?.title ?? d}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-inkmuted">
                        {d}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
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
