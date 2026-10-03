"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { toolkit as seedToolkit } from "@/data/content";
import NebulaBackground from "./NebulaBackground";
import ToolkitOrbit from "./ToolkitOrbit";
import { ToolIcon, allToolNames } from "./ToolIcon";

// Scroll-scrubbed reveal: each group's scroll progress is split into equal
// slots (label first, then every chip), so one item lands per stretch of
// scroll — the next only appears as you keep scrolling, and scrolling back
// up rewinds it. A spring on the progress keeps it smooth under Lenis.
function useSlot(progress: MotionValue<number>, index: number, total: number) {
  return useTransform(progress, [index / total, (index + 1) / total], [0, 1]);
}

function GroupLabel({ progress, total, name }: { progress: MotionValue<number>; total: number; name: string }) {
  const p = useSlot(progress, 0, total);
  const x = useTransform(p, [0, 1], [-16, 0]);
  const letterSpacing = useTransform(p, (v) => `${0.3 - v * 0.25}em`);
  return (
    <motion.h3
      style={{ opacity: p, x, letterSpacing }}
      className="font-mono text-[11px] uppercase tracking-wider text-inkmuted"
    >
      {name}
    </motion.h3>
  );
}

function ScrollChip({
  progress,
  index,
  total,
  tool,
  showIcon,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  tool: string;
  showIcon: boolean;
}) {
  const p = useSlot(progress, index, total);
  const y = useTransform(p, [0, 1], [22, 0]);
  const scale = useTransform(p, [0, 1], [0.88, 1]);
  const filter = useTransform(p, (v) => `blur(${(1 - v) * 6}px)`);
  // Icon spins in over the back half of its chip's slot.
  const iconScale = useTransform(p, [0.4, 1], [0, 1]);
  const iconRotate = useTransform(p, [0.4, 1], [-120, 0]);

  return (
    <motion.span style={{ opacity: p, y, scale, filter }} className="inline-flex">
      <span
        className={
          showIcon
            ? "inline-flex cursor-default items-center gap-2 rounded-full border border-line bg-panel py-1.5 pl-1.5 pr-3.5 text-sm text-ink transition-[colors,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
            : "inline-flex cursor-default items-center rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-ink transition-[colors,transform] duration-200 hover:-translate-y-0.5 hover:border-accent"
        }
      >
        {showIcon && (
          <motion.span style={{ scale: iconScale, rotate: iconRotate }} className="inline-flex">
            <ToolIcon name={tool} size={22} />
          </motion.span>
        )}
        {tool}
      </span>
    </motion.span>
  );
}

function ToolGroup({ name, tools, showIcon }: { name: string; tools: string[]; showIcon: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts as the group's top enters the lower screen, completes once its
  // bottom reaches the middle — the whole group is assembled by then.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const total = tools.length + 1;

  return (
    <div ref={ref}>
      <GroupLabel progress={progress} total={total} name={name} />
      <div className="mt-3 flex flex-wrap gap-2">
        {tools.map((tool, i) => (
          <ScrollChip key={tool} progress={progress} index={i + 1} total={total} tool={tool} showIcon={showIcon} />
        ))}
      </div>
    </div>
  );
}

function StaticGroup({ name, tools, showIcon }: { name: string; tools: string[]; showIcon: boolean }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">{name}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool}
            className={
              showIcon
                ? "inline-flex cursor-default items-center gap-2 rounded-full border border-line bg-panel py-1.5 pl-1.5 pr-3.5 text-sm text-ink transition-colors hover:border-accent"
                : "inline-flex cursor-default items-center rounded-full border border-line bg-panel px-4 py-1.5 text-sm text-ink transition-colors hover:border-accent"
            }
          >
            {showIcon && <ToolIcon name={tool} size={22} />}
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

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
                const Group = reduce ? StaticGroup : ToolGroup;
                return (
                  <Group
                    key={name}
                    name={name}
                    tools={tools}
                    showIcon={!NO_ICON_GROUPS.has(name)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
