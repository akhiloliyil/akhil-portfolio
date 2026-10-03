"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "motion/react";
import {
  gallery as seedGallery,
  projects as seedProjects,
  projectCategories,
  type Shot,
} from "@/data/content";
import { caseStudies, caseStudyForProject, responsiveScreens } from "@/data/case-studies";

// Brief priority: YARA → home-retail commerce (web + app) → Hexa → SellerHub.
const FEATURED_ORDER = ["yara", "home-retail", "hexa", "sellerhub"];
const FEATURED = FEATURED_ORDER.map((slug) => caseStudies.find((c) => c.slug === slug)!).filter(Boolean);
import IndustryExperience from "./IndustryExperience";
import Lightbox from "./Lightbox";

// Arrow-button colours cycle per card, like sticker accents on a case board.
const ARROW_COLORS = ["#6fd3e3", "#8b5cf6", "#f5b14c", "#ff7860", "#d4f04f"];
const INITIAL_COUNT = 6;

// Projects covered by a case study don't repeat in the "more work" grid.
const COVERED = new Set(["yara", "retail-web", "retail-app", "hexa"]);
const COVERED_SHOTS = new Set(["Seller Hub — Marketplace"]);
// Listed first in "more work", in this order; everything else follows.
const PRIORITY = [
  "oms",
  "pim",
  "shot-Imagine AI — Shopping Looks",
  "ai-product-search",
  "kiosk",
  "miles-club",
  "price-tag",
  "sleephubz",
];
const rank = (key: string) => {
  const i = PRIORITY.indexOf(key);
  return i === -1 ? PRIORITY.length : i;
};

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

// "Miles Club" → "MC", "Product Information Management (PIM)" → "PIM".
const monogram = (title: string) =>
  title.match(/\(([A-Z]{2,4})\)/)?.[1] ??
  title
    .split(/[\s—-]+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const yearOf = (period?: string) => period?.match(/\d{4}/)?.[0];

// "Marketplace · Multi-Tenant · Product Design" → "Marketplace · Multi-Tenant".
const shortTag = (tag?: string) => tag?.split("·").slice(0, 2).map((t) => t.trim()).join(" · ");
const FRAME_LABEL = { app: "Mobile app", dashboard: "Web dashboard", ecommerce: "E-commerce" };

const arrowClass =
  "focus-ring flex h-11 w-11 items-center justify-center rounded-full text-black transition-transform duration-300 hover:-rotate-45 hover:scale-110 sm:h-12 sm:w-12";
const arrowIcon = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

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
    ...projects
      .filter((project) => !COVERED.has(project.id))
      .map((project) => {
      const shot = shotFor.get(project.id);
      const caseSlug = caseStudyForProject.get(project.id);
      return {
        key: project.id,
        title: project.name,
        href: project.link,
        caseHref: caseSlug ? `/work/${caseSlug}` : undefined,
        src: shot?.src,
        badge: catMap.get(project.category ?? "")?.label,
        year: yearOf(project.period),
        domain: shortTag(shot?.tag) ?? FRAME_LABEL[project.frameType],
        chips: project.stack.slice(0, 3),
        build: project.build ?? [],
        shot: {
          title: project.name,
          tag: shot?.tag ?? catMap.get(project.category ?? "")?.label ?? "Project",
          url: shot?.url ?? hostOf(project.link) ?? project.org,
          src: shot?.src ?? "",
          projectId: project.id,
        } as Shot,
      };
    }),
    ...gallery
      .filter((g) => !g.projectId && !COVERED_SHOTS.has(g.title))
      .map((g) => ({
        key: `shot-${g.title}`,
        title: g.title,
        href: g.link,
        caseHref: undefined as string | undefined,
        src: g.src,
        badge: "UI Design",
        year: undefined as string | undefined,
        domain: shortTag(g.tag) ?? g.url,
        chips: g.tag.split("·").map((t) => t.trim()),
        build: g.build ?? [],
        shot: g,
      })),
  ]
    // Cards with a real screen lead, so the first rows never look empty.
    .sort((a, b) => Number(!a.src) - Number(!b.src) || rank(a.key) - rank(b.key));

  const featuredCards: typeof cards = FEATURED.map((cs) => ({
    key: cs.slug,
    title: cs.title,
    href: cs.link?.href,
    caseHref: `/work/${cs.slug}`,
    src: cs.cover.src,
    badge: cs.kicker.split("·")[0].trim(),
    year: yearOf(cs.period),
    // Kicker's second half: "AI product design · Conversational commerce".
    domain: cs.kicker.split("·").slice(1).join("·").trim() || cs.kicker,
    chips: cs.tags,
    build: [],
    shot: {
      title: cs.title,
      tag: cs.kicker,
      url: cs.link?.label ?? cs.org,
      src: cs.cover.src,
      projectId: cs.projectId,
      // Mobile web / desktop / app tabs in the popup.
      screens: cs.slug === "home-retail" ? responsiveScreens : undefined,
    } as Shot,
  }));

  // One list: case studies lead, then the rest of the shipped work.
  const allCards = [...featuredCards, ...cards];
  const hasMore = allCards.length > INITIAL_COUNT;
  // Index into `allCards` of the project open in the popup.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  type Card = (typeof cards)[number];
  // popupIndex: the card's position in the shared Lightbox list.
  const renderCard = (card: Card, i: number, popupIndex: number, collapsed = false) => {
    const arrow = ARROW_COLORS[i % ARROW_COLORS.length];
            return (
              <motion.li
                key={card.key}
                variants={item}
                className={`w-[82%] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none ${
                  collapsed ? "sm:hidden" : ""
                }`}
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-panel">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
                    {card.src ? (
                      <Image
                        src={card.src}
                        alt={`${card.title} — screen preview`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      // No screen to show (internal tools): a fixed-dark
                      // monogram panel in the card's accent, so the white
                      // overlay text still reads in both themes.
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[#111318] transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                          backgroundImage: `radial-gradient(circle at 78% 22%, ${arrow}40, transparent 55%), radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)`,
                          backgroundSize: "100% 100%, 18px 18px",
                        }}
                      >
                        <span
                          className="absolute right-6 top-14 font-display text-[clamp(4rem,9vw,7rem)] font-bold leading-none tracking-[-0.06em] sm:right-8"
                          style={{ color: arrow, opacity: 0.35 }}
                        >
                          {monogram(card.title)}
                        </span>
                      </div>
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
                        <h3 className="line-clamp-3 font-display text-xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl sm:leading-[1.05]">
                          {card.title}
                        </h3>
                        <p className="mt-2 truncate font-mono text-sm text-white/75">
                          {card.domain}
                        </p>
                      </div>
                      {/* Eye opens the details popup; arrow opens the live
                          site in a new tab, and only shows when there is one. */}
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => setOpenIndex(popupIndex)}
                          aria-haspopup="dialog"
                          aria-label={`View details: ${card.title}`}
                          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full text-black transition-transform duration-300 hover:scale-110 sm:h-12 sm:w-12"
                          style={{ backgroundColor: arrow }}
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                        {card.caseHref ? (
                          <Link
                            href={card.caseHref}
                            aria-label={`View case study: ${card.title}`}
                            className={arrowClass}
                            style={{ backgroundColor: arrow }}
                          >
                            {arrowIcon}
                          </Link>
                        ) : card.href ? (
                          <a
                            href={card.href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open live site: ${card.title} (opens in a new tab)`}
                            className={arrowClass}
                            style={{ backgroundColor: arrow }}
                          >
                            {arrowIcon}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 p-4 sm:gap-2.5 sm:p-7">
                    {/* Design chips, then build-tech chips in accent so
                        "how it was built" reads apart from "what was designed". */}
                    {card.chips.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-3 py-1 text-sm text-inkmuted sm:px-4 sm:py-1.5"
                      >
                        {s}
                      </span>
                    ))}
                    {card.build
                      .filter((b) => !card.chips.includes(b))
                      .slice(0, 1)
                      .map((b) => (
                        <span
                          key={`build-${b}`}
                          className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm text-accent sm:px-4 sm:py-1.5"
                        >
                          {b}
                        </span>
                      ))}
                  </div>

                </div>
              </motion.li>
            );
  };

  return (
    <section
      id="work"
      className="relative scroll-mt-20 border-b border-line bg-paper py-14 text-ink sm:py-20 lg:py-28"
    >
      <div className="page-container">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent sm:text-sm">
          ( Selected work )
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(1.75rem,5vw,4.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-ink">
            Proof, not
            <br />
            promises
          </h2>
          <p className="max-w-md text-base leading-relaxed text-inkmuted">
            In-depth case studies first: the problem, what I owned, the
            decisions and what shipped. More work follows.
          </p>
        </div>

        <motion.ul
          variants={grid}
          ref={listRef}
          initial={reduce ? false : "hidden"}
          animate={inView || reduce ? "show" : "hidden"}
          aria-label="Selected work — swipe for more"
          className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
        >
          {/* Phones: every card in one swipeable row. From sm: a grid that
              shows the first few, with "View all work" for the rest. */}
          {allCards.map((card, i) =>
            renderCard(card, i, i, !showAll && i >= INITIAL_COUNT)
          )}
        </motion.ul>

        {hasMore && (
          <div className="mt-10 hidden justify-center sm:flex">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="focus-ring min-h-11 rounded-full border border-line px-6 py-3 text-base text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {showAll ? "Show less" : "View all work"}
            </button>
          </div>
        )}

        <Lightbox
          shots={allCards.map((c) => c.shot)}
          projects={projects}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />

        {/* Revealed with the full list, as the close of "View all work". */}
        {(showAll || !hasMore) && <IndustryExperience />}
      </div>
    </section>
  );
}
