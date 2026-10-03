"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import {
  gallery as seedGallery,
  projects as seedProjects,
  projectCategories,
} from "@/data/content";

// Arrow-button colours cycle per card, like sticker accents on a case board.
const ARROW_COLORS = ["#6fd3e3", "#8b5cf6", "#f5b14c", "#ff7860", "#d4f04f"];
const INITIAL_COUNT = 6;

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const hostOf = (link?: string) => {
  if (!link) return undefined;
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

const yearOf = (period?: string) => period?.match(/\d{4}/)?.[0];

export default function WorkV2({
  projects = seedProjects,
  gallery = seedGallery,
}: {
  projects?: typeof seedProjects;
  gallery?: typeof seedGallery;
}) {
  const reduce = useReducedMotion();
  const [showAll, setShowAll] = useState(false);
  // Driven by state rather than `whileInView` so cards mounted later by
  // "View all work" also animate in (a one-shot whileInView leaves them at 0).
  const listRef = useRef<HTMLUListElement>(null);
  const inView = useInView(listRef, { once: true, margin: "-80px" });
  const catMap = new Map(projectCategories.map((c) => [c.id, c]));
  const shotFor = new Map(
    gallery.filter((g) => g.projectId).map((g) => [g.projectId!, g])
  );

  // Projects first, then standalone UI shots (gallery images not tied to a
  // project) so every screen in the gallery has a place on the page.
  const cards = [
    ...projects.map((project) => {
      const shot = shotFor.get(project.id);
      return {
        key: project.id,
        title: project.name,
        href: project.link,
        src: shot?.src,
        badge: catMap.get(project.category ?? "")?.label,
        year: yearOf(project.period),
        domain: shot?.url ?? hostOf(project.link) ?? project.org,
        chips: project.stack.slice(0, 3),
      };
    }),
    ...gallery
      .filter((g) => !g.projectId)
      .map((g) => ({
        key: `shot-${g.title}`,
        title: g.title,
        href: g.link,
        src: g.src,
        badge: "UI Design",
        year: undefined as string | undefined,
        domain: g.url,
        chips: g.tag.split("·").map((t) => t.trim()),
      })),
  ];

  const visible = showAll ? cards : cards.slice(0, INITIAL_COUNT);
  const hasMore = cards.length > INITIAL_COUNT;

  return (
    <section
      id="work"
      className="relative border-b border-line bg-paper py-20 text-ink sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent sm:text-sm">
          ( Selected work )
        </p>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
          <h2 className="font-display text-[clamp(1.75rem,5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-ink">
            Proof, not
            <br />
            promises
          </h2>
          {hasMore && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="focus-ring rounded-full border border-line px-7 py-4 text-base text-ink transition-colors hover:border-accent hover:text-accent sm:text-lg"
            >
              {showAll ? "Show less" : "View all work"}
            </button>
          )}
        </div>

        <motion.ul
          variants={grid}
          ref={listRef}
          initial={reduce ? false : "hidden"}
          animate={inView || reduce ? "show" : "hidden"}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {visible.map((card, i) => {
            const arrow = ARROW_COLORS[i % ARROW_COLORS.length];
            const Wrapper = card.href ? "a" : "div";

            return (
              <motion.li key={card.key} variants={item} className="min-w-0">
                <Wrapper
                  {...(card.href
                    ? { href: card.href, target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="focus-ring group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-panel"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                    {card.src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={card.src}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    {/* Fixed dark scrim so the white overlay text reads in both themes. */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
                    />

                    <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3 sm:inset-x-7">
                      {card.badge && (
                        <span className="truncate rounded-full bg-black/70 px-4 py-1.5 font-mono text-xs tracking-[0.15em] text-white backdrop-blur-sm sm:text-sm">
                          {card.badge}
                        </span>
                      )}
                      {card.year && (
                        <span className="ml-auto font-mono text-sm text-white/80">
                          {card.year}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-6">
                      <div className="min-w-0">
                        <h3 className="font-display text-2xl font-bold leading-[1.05] tracking-tight text-white sm:text-3xl">
                          {card.title}
                        </h3>
                        <p className="mt-2 truncate font-mono text-sm text-white/75">
                          {card.domain}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-black transition-transform duration-300 group-hover:-rotate-45 group-hover:scale-110"
                        style={{ backgroundColor: arrow }}
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 p-5 sm:p-7">
                    {card.chips.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-4 py-1.5 text-sm text-inkmuted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </Wrapper>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
