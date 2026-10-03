import { process as seedProcess } from "@/data/content";

// Five steps, scannable at a glance; the detail sits behind a tap.
// Paired by index with `process` in content (admin-editable bodies).
const STEPS = [
  { title: "Discover", tags: "Customer Journey · Research" },
  { title: "Define", tags: "IA · User Flows · Requirements" },
  { title: "Design", tags: "Wireframes · UI · Design System" },
  { title: "Validate", tags: "Prototype · Usability Testing" },
  { title: "Build", tags: "React · Next.js · React Native" },
];

export default function Process({ process = seedProcess }: { process?: typeof seedProcess }) {
  return (
    <section id="process" className="relative scroll-mt-24 border-b border-line bg-paper pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">( Process )</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              How a project moves
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-inkmuted">
            Tap a step for the detail.
          </p>
        </div>

        <ol className="mt-8 divide-y divide-line border-y border-line lg:grid lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <details className="group h-full">
                <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center gap-4 py-4 lg:flex-col lg:items-start lg:gap-2 lg:px-5 lg:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-ink">{step.title}</span>
                    <span className="mt-0.5 block text-sm text-inkmuted">{step.tags}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-transform group-open:rotate-45 lg:mt-2"
                  >
                    +
                  </span>
                </summary>
                {process[i]?.body && (
                  <p className="pb-5 pl-9 pr-2 text-sm leading-relaxed text-inkmuted lg:px-5 lg:pl-5">
                    {process[i].body}
                  </p>
                )}
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
