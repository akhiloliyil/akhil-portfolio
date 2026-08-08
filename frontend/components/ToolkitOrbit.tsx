"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ToolIcon } from "./ToolIcon";

const CONTAINER_SIZE = 520;
const EDGE_PADDING = 8;
const GAP_PADDING = 10;

// Tile sizes only — positions are randomized (see randomLayout), so this
// array just fixes how many tiles there are and their relative scale.
const TILE_SIZES = [84, 68, 76, 72, 84, 66, 76, 60];

function polarToXY(angle: number, radius: number, size: number) {
  const rad = (angle * Math.PI) / 180;
  const maxReach = CONTAINER_SIZE / 2 - size / 2 - EDGE_PADDING;
  return { x: radius * maxReach * Math.cos(rad), y: radius * maxReach * Math.sin(rad), size };
}

// A deterministic starting layout so server and client agree on the very
// first paint (see the mount effect below, which replaces it with a fresh
// random scatter — real randomness has to happen client-side only, or
// hydration would flag a mismatch between server and browser output).
const DEFAULT_POSITIONS = [
  { angle: 255, radius: 0.95 },
  { angle: 195, radius: 0.55 },
  { angle: 140, radius: 0.9 },
  { angle: 85, radius: 0.65 },
  { angle: 35, radius: 0.92 },
  { angle: 350, radius: 0.5 },
  { angle: 305, radius: 0.85 },
  { angle: 60, radius: 0.3 },
].map(({ angle, radius }, i) => polarToXY(angle, radius, TILE_SIZES[i]));

// Scatters each tile at a random angle and a random distance from the
// centre. Math.sqrt(random()) keeps the scatter uniform *by area* instead
// of clumping everything near the middle (plain `random() * maxReach`
// biases points inward). Each draw is rejected and retried if it would
// overlap a tile already placed — checked as axis-aligned boxes, since the
// tiles are square, not circles.
function randomLayout(sizes: number[]) {
  const placed: { x: number; y: number; size: number }[] = [];

  for (const size of sizes) {
    const maxReach = CONTAINER_SIZE / 2 - size / 2 - EDGE_PADDING;
    let point = { x: 0, y: 0 };

    for (let attempt = 0; attempt < 60; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * maxReach;
      const candidate = { x: dist * Math.cos(angle), y: dist * Math.sin(angle) };

      const clear = placed.every((p) => {
        const gap = (p.size + size) / 2 + GAP_PADDING;
        return Math.abs(p.x - candidate.x) >= gap || Math.abs(p.y - candidate.y) >= gap;
      });

      point = candidate;
      if (clear) break;
    }

    placed.push({ ...point, size });
  }

  return placed;
}

// The curated first paint — recognizable logos, good color spread. Random
// cycling (below) then rotates in the rest of the real tool list over time.
const SEED_NAMES = [
  "Figma",
  "Photoshop",
  "ReactJS",
  "Next.js",
  "ChatGPT",
  "Node.js",
  "Adobe XD",
  "Illustrator",
];

const BOB_DURATIONS = [6, 7.5, 5.5, 8, 6.5, 7, 5, 8.5];
const SWAP_BASE_MS = 3400;
const SWAP_STAGGER_MS = 550;

function seedFor(tools: string[]) {
  return TILE_SIZES.map((_, i) => {
    const seed = SEED_NAMES[i];
    if (seed && tools.includes(seed)) return seed;
    return tools[i % tools.length];
  });
}

export default function ToolkitOrbit({ tools }: { tools: string[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string[]>(() => seedFor(tools));
  const [positions, setPositions] = useState(DEFAULT_POSITIONS);

  // Re-scatter once on mount — client-only, so it can't disagree with the
  // server-rendered HTML. Skipped under reduced motion so the layout
  // doesn't shift right after paint.
  useEffect(() => {
    if (reduce) return;
    setPositions(randomLayout(TILE_SIZES));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reduce || tools.length <= TILE_SIZES.length) return;

    const timers = TILE_SIZES.map((_, i) =>
      window.setInterval(
        () => {
          setActive((prev) => {
            const used = new Set(prev);
            const pool = tools.filter((t) => !used.has(t));
            const choices = pool.length ? pool : tools;
            const next = [...prev];
            next[i] = choices[Math.floor(Math.random() * choices.length)];
            return next;
          });
        },
        SWAP_BASE_MS + i * SWAP_STAGGER_MS
      )
    );

    return () => timers.forEach((t) => window.clearInterval(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tools.join("|"), reduce]);

  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[520px]"
    >
      <div className="absolute inset-[8%] rounded-full border border-accent/15" />
      <div className="absolute inset-[26%] rounded-full border border-accent/10" />

      {positions.map((pos, i) => {
        const xPct = 50 + (pos.x / CONTAINER_SIZE) * 100;
        const yPct = 50 + (pos.y / CONTAINER_SIZE) * 100;
        return (
          <div
            key={i}
            className="toolkit-orbit-tile"
            style={{
              left: `${xPct}%`,
              top: `${yPct}%`,
              transition: "left 0.8s ease-out, top 0.8s ease-out",
              animationDuration: `${BOB_DURATIONS[i % BOB_DURATIONS.length]}s`,
              animationDelay: `${(i % BOB_DURATIONS.length) * -0.7}s`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active[i]}
                initial={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <ToolIcon name={active[i]} size={pos.size} variant="glow" />
              </motion.div>
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
