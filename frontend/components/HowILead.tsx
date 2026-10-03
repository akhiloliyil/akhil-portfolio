"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { Compass, Layers, Users, type LucideIcon } from "lucide-react";

// Each practice is paired with where it shows up in the work on record.
const GROUPS: {
  title: string;
  label: string;
  Icon: LucideIcon;
  items: { do: string; where: string }[];
}[] = [
  {
    title: "Direction",
    label: "Set the course",
    Icon: Compass,
    items: [
      { do: "Define product experience direction", where: "Product design, UI/UX and CX across a UAE home & furniture retailer's e-commerce, marketplace, mobile and enterprise products." },
      { do: "Translate business requirements into UX", where: "Stakeholder workshops and workflow analysis behind OMS, PIM, Hexa and pricing." },
      { do: "Lead customer journey thinking", where: "Journey mapping as the starting point for YARA, the mobile app and the omnichannel concept." },
      { do: "Establish design principles", where: "UX standards shared across web and mobile." },
    ],
  },
  {
    title: "Systems & quality",
    label: "Keep it consistent",
    Icon: Layers,
    items: [
      { do: "Build scalable design systems", where: "One system for the website, the app and internal tools." },
      { do: "Review UX/UI quality", where: "Design reviews before handoff and during implementation." },
      { do: "Improve existing products", where: "Ongoing optimisation of listing, product, cart and checkout flows." },
    ],
  },
  {
    title: "Collaboration",
    label: "Ship it together",
    Icon: Users,
    items: [
      { do: "Partner with product and engineering", where: "Product, engineering, business, marketing and senior stakeholders." },
      { do: "Support development implementation", where: "Hands-on React / Next.js; working alongside React Native and AI engineers." },
      { do: "Mentor and guide design practice", where: "Design direction and consistency across projects, from agency lead-designer work to enterprise retail." },
    ],
  },
];

// Always set: MotionConfig (reducedMotion="user") drops the movement for
// reduced-motion visitors, while the reveal still runs so nothing stays hidden.
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function HowILead() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 80%", "end 70%"],
  });

  return (
    <section
      id="leadership"
      className="relative overflow-hidden bg-paper py-14 text-ink sm:py-20 lg:py-32"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(var(--accent)/0.14)_0%,transparent_70%)] blur-[30px]"
      />

      <div className="page-container relative z-10">
        {/* Header */}
        <motion.div {...fadeUp} className="mx-auto max-w-[720px] text-center">
          <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.02em] text-accent">
            How I Lead
          </span>
          <h2 className="mt-5 font-display text-[38px] font-semibold sm:mt-7 min-[390px]:text-[44px] leading-[0.98] tracking-[-0.045em] text-ink sm:text-[56px] lg:text-[64px]">
            Direction, systems,
            <br />
            <span className="text-accent">delivery.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[15px] leading-[1.7] text-inkmuted sm:text-[16px]">
            I set the experience direction, build the system that keeps it
            consistent, and stay close to delivery so it ships the way it
            was designed.
          </p>
        </motion.div>

        {/* Pillars */}
        <div ref={gridRef} className="relative mt-10 sm:mt-16 lg:mt-24">
          {/* Scroll progress rail (desktop) */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-0 hidden h-px bg-line lg:block">
            <motion.span
              className="absolute inset-0 origin-left bg-accent shadow-[0_0_12px_rgb(var(--accent)/0.65)]"
              style={{ scaleX: scrollYProgress }}
            />
          </div>

          <ol className="grid grid-cols-1 lg:grid-cols-3">
            {GROUPS.map((g, gi) => (
              <motion.li
                key={g.title}
                className="group relative border-t border-line pb-8 pt-8 first:border-t-0 first:pt-0 sm:pb-12 sm:pt-10 lg:border-l lg:border-t-0 lg:px-8 lg:pb-0 lg:pt-12 lg:first:border-l-0 lg:first:pl-0 lg:first:pt-12 lg:last:pr-0 xl:px-10"
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.65, delay: gi * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Node on the rail */}
                <span
                  aria-hidden="true"
                  className={`absolute -top-[5px] hidden h-[9px] w-[9px] rounded-full border border-accent bg-paper shadow-[0_0_10px_rgb(var(--accent)/0.5)] transition-colors duration-300 group-hover:bg-accent lg:block ${gi === 0 ? "left-0" : "-left-[5px]"}`}
                />

                <div className="flex items-end justify-between gap-6">
                  <span
                    aria-hidden="true"
                    className="font-display text-[64px] font-bold sm:text-[88px] leading-[0.8] tracking-[-0.06em] text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_rgb(var(--accent)/0.55)] group-hover:text-accent/10 lg:text-[104px]"
                  >
                    0{gi + 1}
                  </span>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-inkmuted transition-colors duration-300 group-hover:border-accent/40 group-hover:text-accent">
                    <g.Icon size={18} strokeWidth={1.8} />
                  </div>
                </div>

                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent sm:mt-8">
                  {g.label}
                </p>
                <h3 className="mt-2 font-display text-[26px] font-semibold leading-tight tracking-[-0.03em] text-ink">
                  {g.title}
                </h3>

                <ul className="mt-5 space-y-4 sm:mt-7 sm:space-y-6">
                  {g.items.map((it) => (
                    <li key={it.do} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[9px] h-px w-2.5 bg-accent"
                      />
                      <p className="font-display text-[15px] font-semibold leading-snug text-ink">
                        {it.do}
                      </p>
                      {/* Evidence line: tablet/desktop only — keeps the phone page short. */}
                      <p className="mt-1.5 hidden text-[14px] leading-[1.65] text-inkmuted sm:block">
                        {it.where}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
