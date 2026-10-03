"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Home,
  LayoutGrid,
  Loader2,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";

// A spec sheet for what the retail design system covers. The specimens are
// redrawn in this site's own tokens (the retailer's values aren't public),
// so the colour swatches really are live tokens and follow the theme toggle.

const SWATCHES = [
  { token: "paper", cls: "bg-paper" },
  { token: "panel", cls: "bg-panel" },
  { token: "line", cls: "bg-line" },
  { token: "inkmuted", cls: "bg-inkmuted" },
  { token: "ink", cls: "bg-ink" },
  { token: "accent", cls: "bg-accent" },
  { token: "coral", cls: "bg-coral" },
];

const TYPE_SCALE = [
  { role: "Display", size: "48", cls: "font-display text-[2.1rem] font-bold tracking-[-0.04em]" },
  { role: "Heading", size: "24", cls: "font-display text-2xl font-semibold tracking-tight" },
  { role: "Body", size: "16", cls: "text-base" },
  { role: "Label", size: "11", cls: "font-mono text-[11px] uppercase tracking-wider" },
];

const SPACING = [4, 8, 12, 16, 24, 32, 48];

const STATES = ["Default", "Focus", "Disabled", "Loading", "Error"] as const;
type UiState = (typeof STATES)[number];

// Where it's visible — each links to that case study's design-system section.
const EVIDENCE = [
  { label: "Retail web + app", note: "Shared tokens & components", slug: "home-retail" },
  { label: "YARA", note: "Conversational components", slug: "yara" },
  { label: "SellerHub", note: "Order & status patterns", slug: "sellerhub" },
  { label: "Hexa", note: "Enterprise mobile", slug: "hexa" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Tile({
  n,
  title,
  caption,
  className = "",
  children,
}: {
  n: string;
  title: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`flex flex-col rounded-[24px] border border-line bg-paper p-5 sm:p-7 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{title}</h3>
        <span className="font-mono text-[11px] tabular-nums text-inkmuted">{n}</span>
      </div>
      <p className="mt-1.5 text-sm text-inkmuted">{caption}</p>
      <div className="mt-6 flex-1">{children}</div>
    </motion.div>
  );
}

function Foundations() {
  return (
    <div className="grid gap-7 md:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-inkmuted">Colour tokens</p>
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7 md:grid-cols-4">
          {SWATCHES.map((s) => (
            <li key={s.token}>
              <span className={`block aspect-square rounded-xl border border-line ${s.cls}`} />
              <span className="mt-1.5 block truncate font-mono text-[10px] text-inkmuted">--{s.token}</span>
            </li>
          ))}
        </ul>

        <p className="mt-7 font-mono text-[10px] uppercase tracking-wider text-inkmuted">Spacing · 4pt</p>
        <ul className="mt-3 flex items-end gap-2">
          {SPACING.map((n) => (
            <li key={n} className="flex flex-col items-center gap-1.5">
              <span className="block w-3 rounded-sm bg-accent/80" style={{ height: n }} />
              <span className="font-mono text-[10px] tabular-nums text-inkmuted">{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-inkmuted">Type scale</p>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {TYPE_SCALE.map((t) => (
            <li key={t.role} className="flex items-baseline justify-between gap-3 py-2.5">
              <span className={`truncate leading-none text-ink ${t.cls}`}>{t.role}</span>
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-inkmuted">{t.size}px</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Components() {
  const [on, setOn] = useState(true);
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex min-h-10 items-center rounded-full bg-accent px-5 text-sm font-semibold text-onaccent">
          Add to cart
        </span>
        <span className="inline-flex min-h-10 items-center rounded-full border border-line px-5 text-sm text-ink">
          Save
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Example toggle"
          onClick={() => setOn((v) => !v)}
          className={`focus-ring relative h-6 w-11 rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-panel shadow transition-transform ${
              on ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      <div className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-panel px-3.5 text-sm text-inkmuted">
        <Search aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
        What are you looking for?
      </div>

      <div className="flex flex-wrap gap-2">
        {["Sofas", "Beds", "Outdoor"].map((c, i) => (
          <span
            key={c}
            className={`rounded-full px-3 py-1 text-xs ${
              i === 0 ? "bg-ink text-paper" : "border border-line text-ink"
            }`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Product card wireframe: structure only, no invented product data. */}
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-line bg-panel">
            <div className="relative aspect-[4/3] bg-line/60">
              {i === 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-coral px-2 py-0.5 font-mono text-[9px] font-semibold uppercase text-white">
                  Sale
                </span>
              )}
            </div>
            <div className="space-y-1.5 p-2.5">
              <span className="block h-2 w-4/5 rounded-full bg-line" />
              <span className="block h-2 w-1/2 rounded-full bg-accent/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function States() {
  const [state, setState] = useState<UiState>("Default");
  const disabled = state === "Disabled";
  const error = state === "Error";
  return (
    <div className="grid gap-5">
      <div role="tablist" aria-label="Component state" className="flex flex-wrap gap-1.5">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={s === state}
            onClick={() => setState(s)}
            className={`focus-ring rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
              s === state ? "bg-ink text-paper" : "border border-line text-inkmuted hover:text-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-2xl border border-dashed border-line bg-panel/60 p-4 sm:p-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-inkmuted">Email</span>
          <div
            className={`mt-1.5 flex min-h-11 items-center rounded-xl border bg-panel px-3.5 text-sm transition-all ${
              error
                ? "border-coral text-ink"
                : state === "Focus"
                  ? "border-accent text-ink ring-2 ring-accent/30"
                  : disabled
                    ? "border-line text-inkmuted/50"
                    : "border-line text-inkmuted"
            }`}
          >
            {error ? "name@" : state === "Focus" ? "name@example.com" : "you@example.com"}
            {state === "Focus" && <span className="ml-px h-4 w-px animate-pulse bg-ink" />}
          </div>
          {error && <p className="mt-1.5 text-xs text-coral">Enter a complete email address</p>}
        </div>

        <span
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all ${
            disabled
              ? "bg-line text-inkmuted"
              : `bg-accent text-onaccent ${state === "Focus" ? "ring-2 ring-accent ring-offset-2 ring-offset-paper" : ""}`
          }`}
        >
          {state === "Loading" && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {state === "Loading" ? "Placing order" : "Place order"}
        </span>
      </div>

      {/* Inline feedback banners, as in the SellerHub order screens. */}
      <div className="grid gap-2">
        <p className="flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-xs text-ink">
          <Check aria-hidden="true" className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
          Successfully accepted the order
        </p>
        <p className="flex items-center gap-2 rounded-xl bg-coral/10 px-3 py-2 text-xs text-ink">
          <X aria-hidden="true" className="h-3.5 w-3.5 text-coral" strokeWidth={2.5} />
          Something went wrong. Try again
        </p>
      </div>
    </div>
  );
}

// Mobile patterns visible in the shipped app screens (see the case studies).
function MobilePatterns() {
  const steps = ["Placed", "Confirmed", "In transit", "Delivered"];
  return (
    <div className="mx-auto w-full max-w-[250px] overflow-hidden rounded-[30px] border-[6px] border-ink/90 bg-panel shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
      <div className="space-y-3 p-3.5">
        <div className="rounded-xl border border-line p-2.5">
          <p className="text-[10px] text-inkmuted">Your order is in transit</p>
          <ol className="mt-2 flex items-center">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 items-center last:flex-none">
                <span
                  className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${
                    i < 3 ? "bg-accent" : "border border-line"
                  }`}
                >
                  {i < 3 && <Check aria-hidden="true" className="h-2 w-2 text-onaccent" strokeWidth={4} />}
                </span>
                {i < steps.length - 1 && <span className={`h-px flex-1 ${i < 2 ? "bg-accent" : "bg-line"}`} />}
              </li>
            ))}
          </ol>
          <p className="mt-1.5 flex justify-between font-mono text-[7px] uppercase text-inkmuted">
            <span>Placed</span>
            <span>Delivered</span>
          </p>
        </div>

        <div className="relative grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-lg bg-line/60" />
          ))}
          <span className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[9px] text-paper shadow-lg">
            <SlidersHorizontal aria-hidden="true" className="h-2.5 w-2.5" /> Sort · Filter
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-line p-1.5">
          <span className="grid h-7 w-14 place-items-center rounded-lg border border-line font-mono text-[10px] text-ink">− 1 +</span>
          <span className="grid h-7 flex-1 place-items-center rounded-lg bg-accent text-[10px] font-semibold text-onaccent">
            Add to cart
          </span>
        </div>
      </div>

      <nav aria-hidden="true" className="flex justify-around border-t border-line px-2 py-2.5 text-inkmuted">
        <Home className="h-4 w-4 text-accent" />
        <LayoutGrid className="h-4 w-4" />
        <ShoppingCart className="h-4 w-4" />
        <User className="h-4 w-4" />
      </nav>
    </div>
  );
}

function Behaviour() {
  return (
    <ul className="grid gap-3">
      <li className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink font-display text-lg font-bold text-paper">
          Aa
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">Contrast · WCAG AA</span>
          <span className="block text-xs text-inkmuted">4.5:1 for text, checked in both themes</span>
        </span>
      </li>
      <li className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-3.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line ring-2 ring-accent ring-offset-2 ring-offset-panel">
          <span className="h-2 w-6 rounded-full bg-ink/70" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">Visible focus</span>
          <span className="block text-xs text-inkmuted">Every control reachable by keyboard</span>
        </span>
      </li>
      <li className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-3.5">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-dashed border-accent">
          <span className="h-3 w-3 rounded-full bg-accent" />
          <span className="absolute -bottom-4 font-mono text-[8px] text-inkmuted">44pt</span>
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">Touch targets</span>
          <span className="block text-xs text-inkmuted">44pt minimum, primary actions in thumb reach</span>
        </span>
      </li>
      <li className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-3.5">
        <span className="flex h-11 w-11 shrink-0 items-end justify-center gap-0.5 rounded-xl border border-line p-1.5">
          <span className="h-4 w-2 rounded-[2px] bg-inkmuted/60" />
          <span className="h-6 w-3.5 rounded-[2px] bg-ink/80" />
          <span className="h-3 w-1.5 rounded-[2px] bg-accent" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">Web + mobile parity</span>
          <span className="block text-xs text-inkmuted">One component, adapted per breakpoint</span>
        </span>
      </li>
    </ul>
  );
}

export default function DesignSystems() {
  return (
    <section id="design-systems" className="relative scroll-mt-20 border-b border-line bg-panel py-14 sm:py-20 lg:py-28">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-16">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">( Design systems )</p>
            <h2 className="mt-4 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:mt-5 sm:text-5xl">
              One system, <span className="text-accent">every surface</span>
            </h2>
          </motion.div>
          <motion.p {...fadeUp} className="max-w-xl text-base leading-relaxed text-inkmuted lg:justify-self-end">
            At a leading home &amp; furniture retailer I established and maintain the
            design system shared by the website, the mobile app and internal
            tools. Its UI libraries, reusable components and UX standards keep
            products consistent, accessible and faster to ship.
          </motion.p>
        </div>

        {/* Spec-sheet bento: one tile per layer of the system. */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-12">
          <Tile n="01" title="Foundations" caption="Tokens for colour, type and spacing." className="lg:col-span-7">
            <Foundations />
          </Tile>
          <Tile n="02" title="Components" caption="Buttons, inputs, chips, cards." className="lg:col-span-5">
            <Components />
          </Tile>
          <Tile n="03" title="States" caption="Tap a state — every component ships with all of them." className="lg:col-span-5">
            <States />
          </Tile>
          <Tile n="04" title="On mobile" caption="Patterns from the shipped app." className="lg:col-span-3">
            <MobilePatterns />
          </Tile>
          <Tile n="05" title="Behaviour" caption="Accessibility and responsiveness built in." className="lg:col-span-4">
            <Behaviour />
          </Tile>
        </div>

        <p className="mt-4 text-xs text-inkmuted">
          Specimens are redrawn in this site&apos;s own tokens. The swatches are live and follow the theme toggle.
        </p>

        <motion.div {...fadeUp} className="mt-10 sm:mt-14">
          <p className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">See it in the work</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EVIDENCE.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/work/${e.slug}#design-system`}
                  className="focus-ring group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-accent/60"
                >
                  <span>
                    <span className="block font-display text-lg font-semibold text-ink">{e.label}</span>
                    <span className="mt-1 block text-sm text-inkmuted">{e.note}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-inkmuted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
