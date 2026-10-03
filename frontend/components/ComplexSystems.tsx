"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import {
  PackageCheck,
  Database,
  Store,
  Tag,
  BadgePercent,
  Smartphone,
  Users,
  ArrowUpRight,
  Check,
  type LucideIcon,
} from "lucide-react";

// The retailer's internal / operational products. Copy is condensed from the
// project write-ups in content.json — what was complex and what the design
// did about it. Tiles with a case study link to it.
type System = {
  name: string;
  domain: string;
  users: string;
  complexity: string;
  simplified: string;
  caseStudy?: string;
  Icon: LucideIcon;
};

const SYSTEMS: System[] = [
  {
    name: "OMS",
    Icon: PackageCheck,
    domain: "Order operations",
    users: "Operations, warehouse, sales & customer support",
    complexity: "The full order lifecycle, from confirmation to fulfilment, delivery and returns, shared across four teams.",
    simplified: "Real-time dashboards, advanced search and status tracking, a single detailed order view, replenishment alerts, and approval workflows with audit logs.",
  },
  {
    name: "PIM",
    Icon: Database,
    domain: "Product information",
    users: "Merchandising, marketing & e-commerce teams",
    complexity: "Product data and digital assets that must stay consistent across websites, apps, marketplaces and ERP.",
    simplified: "Bulk editing, hierarchical taxonomy, asset management, validation with approval workflows, version history and CSV/Excel import-export.",
  },
  {
    name: "SellerHub",
    Icon: Store,
    domain: "Marketplace operations",
    users: "Marketplace sellers",
    complexity: "Time-bound order decisions, fulfilment states and itemised payouts.",
    simplified: "An action-first dashboard, status tabs and statements that add up to the net payable amount.",
    caseStudy: "sellerhub",
  },
  {
    name: "Pricing",
    Icon: Tag,
    domain: "Price tags & catalogue",
    users: "Retail operations & merchandising teams",
    complexity: "Price changes across thousands of products, and printing in-store tags for them in bulk.",
    simplified: "Batch tag editing from templates with live preview, print configuration, bulk pricing updates and CSV/Excel import-export.",
  },
  {
    name: "Miles Club",
    Icon: BadgePercent,
    domain: "Promotions engine",
    users: "Marketing, merchandising & operations teams",
    complexity: "Rule-based promotions across stores, e-commerce, apps, affiliates and loyalty, for multiple brands and stores.",
    simplified: "Guided campaign set-up with configurable rules and reusable templates, segmentation, an approval workflow and performance tracking.",
  },
  {
    name: "Hexa Store",
    Icon: Smartphone,
    domain: "Store operations",
    users: "Showroom sales staff & managers",
    complexity: "Customers, stock, pending orders and several open baskets, all needed at once on a busy showroom floor.",
    simplified: "One mobile app: KPI dashboard, fast product search with live stock, multi-basket ordering and segmented customer management.",
    caseStudy: "hexa",
  },
];

const PATTERNS = [
  "Role-based access",
  "Real-time dashboards",
  "Search & filtering",
  "Bulk editing",
  "Approval workflows",
  "Audit logs",
  "Import / export",
  "Alerts",
];

// `custom` = delay, so cards in the same board row arrive in sequence.
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// Always set: MotionConfig (reducedMotion="user") drops the movement for
// reduced-motion visitors, while the reveal still runs so nothing stays hidden.
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

// Cards alternate like a scope-of-work board: in the middle column the
// number sits on top and the title drops to the bottom; elsewhere the title
// leads and the number closes the card.
function SystemCard({ s, n, numberFirst }: { s: System; n: number; numberFirst: boolean }) {
  const number = (
    <div className="flex items-center justify-end gap-3">
      {s.caseStudy && (
        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
          Case study
          <ArrowUpRight
            aria-hidden="true"
            className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      )}
      <span className="font-display text-xl font-semibold tabular-nums text-accent">
        {String(n).padStart(2, "0")}
      </span>
    </div>
  );

  const body = (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-inkmuted">
        {s.domain}
      </p>
      <h3 className="mt-3 font-display text-[1.9rem] font-bold uppercase leading-[0.95] tracking-[-0.045em] text-ink sm:text-[2.25rem]">
        {s.name}
      </h3>
      <p className="mt-4 flex items-start gap-2 text-[13px] leading-snug text-inkmuted">
        <Users aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
        {s.users}
      </p>
      <p className="mt-4 text-sm leading-[1.65] text-inkmuted">
        <span className="font-mono text-[10px] uppercase tracking-wider">Challenge · </span>
        {s.complexity}
      </p>
      <p className="mt-3 text-sm leading-[1.65] text-ink">
        <span className="font-mono text-[10px] uppercase tracking-wider text-accent">Design · </span>
        {s.simplified}
      </p>
    </div>
  );

  return numberFirst ? (
    <>
      {number}
      {body}
    </>
  ) : (
    <>
      {body}
      {number}
    </>
  );
}

export default function ComplexSystems() {
  return (
    <section id="systems" className="relative overflow-hidden bg-paper py-14 text-ink sm:py-20 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[260px] top-[40px] h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.12)_0%,rgb(var(--accent)/0.05)_38%,transparent_72%)] blur-[30px]" />
        <div className="absolute -right-[200px] bottom-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.08)_0%,transparent_70%)] blur-[30px]" />
      </div>

      {/* From lg: one 3-column board. The intro takes the first cell, the
          six systems follow, and the patterns panel closes the last row. */}
      <div className="page-container relative grid gap-5 lg:grid-cols-3 lg:gap-6">
        <motion.div {...fadeUp} className="lg:pr-4">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="font-display text-[6.5rem] font-bold leading-[0.8] tracking-[-0.06em] text-ink sm:text-[8.5rem] lg:text-[9.5rem]"
            >
              {String(SYSTEMS.length).padStart(2, "0")}
            </span>
            <span className="pt-1 font-display text-lg font-medium text-ink sm:text-xl">
              {"{Complex systems}"}
            </span>
          </div>
          <h2 className="mt-8 font-display text-3xl font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:text-4xl">
            Designing <span className="text-accent">complex systems</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-inkmuted">
            Behind the storefront are the tools that run the business. My role
            on these products is to simplify complex workflows,
            information-heavy interfaces and operational processes, so teams
            can do more with fewer steps and fewer errors.
          </p>
        </motion.div>

        {/* Phones/tablets: a swipeable row. From lg the list dissolves into
            the board grid (role keeps it announced as a list). */}
        <motion.ul
          role="list"
          aria-label="Systems — swipe for more"
          className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:contents [&::-webkit-scrollbar]:hidden"
        >
          {SYSTEMS.map((s, i) => {
            // Board position: card i lands in column (i + 1) % 3 (0 = left).
            const numberFirst = (i + 1) % 3 === 1;
            const card =
              "flex h-full min-h-[400px] flex-col justify-between gap-8 border border-line bg-panel/50 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-accent/50 sm:p-9 lg:min-h-[460px]";
            return (
              <motion.li
                key={s.name}
                // Each card watches itself: the ul is display:contents from lg
                // (no box), so it can't be the in-view trigger.
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={((i + 1) % 3) * 0.08}
                className="w-[85%] max-w-[360px] shrink-0 snap-start sm:w-[46%] sm:max-w-none lg:w-auto"
              >
                {s.caseStudy ? (
                  <Link href={`/work/${s.caseStudy}`} className={`focus-ring group ${card}`}>
                    <SystemCard s={s} n={i + 1} numberFirst={numberFirst} />
                  </Link>
                ) : (
                  <div className={card}>
                    <SystemCard s={s} n={i + 1} numberFirst={numberFirst} />
                  </div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.div
          {...fadeUp}
          className="flex flex-col justify-end border border-line bg-panel/50 p-7 backdrop-blur-sm sm:p-9 lg:col-span-2"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-inkmuted">
            Recurring patterns across these products
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {PATTERNS.map((p) => (
              <li
                key={p}
                className="inline-flex items-center gap-1.5 border border-line bg-paper px-3 py-1.5 text-sm text-ink"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" strokeWidth={2.2} />
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
