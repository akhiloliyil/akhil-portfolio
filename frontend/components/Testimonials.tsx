import { testimonials as seedTestimonials } from "@/data/content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Three short recommendations, all visible at once — no carousel to click through.
export default function Testimonials({
  testimonials = seedTestimonials,
}: {
  testimonials?: typeof seedTestimonials;
}) {
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="relative border-b border-line bg-paper py-14 sm:py-20 lg:py-24">
      <div className="page-container">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">( Recommendations )</p>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          What colleagues say
        </h2>

        {/* Phones: swipe carousel (next card peeks in). From md: three across. */}
        <ul
          aria-label="Recommendations — swipe for more"
          className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.slice(0, 3).map((t, i) => (
            <li
              key={t.name}
              aria-label={`${i + 1} of ${Math.min(3, testimonials.length)}`}
              className="w-[86%] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <figure className="flex h-full flex-col rounded-[24px] border border-line bg-panel p-6 sm:p-7">
                <svg viewBox="0 0 48 48" className="h-8 w-8 text-accent/40" fill="currentColor" aria-hidden="true">
                  <path d="M18 10c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7zm22 0c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7z" />
                </svg>
                <blockquote className="mt-3 flex-1 font-serif text-[17px] leading-relaxed text-ink sm:mt-4 sm:text-lg">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-accent/50 font-display text-sm font-semibold text-accent"
                  >
                    {initials(t.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold text-ink">
                      {t.linkedin ? (
                        <a href={t.linkedin} target="_blank" rel="noreferrer" className="focus-ring hover:text-accent">
                          {t.name}
                        </a>
                      ) : (
                        t.name
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-inkmuted">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p aria-hidden="true" className="font-mono text-[10px] uppercase tracking-wider text-inkmuted md:hidden">
          Swipe →
        </p>
      </div>
    </section>
  );
}
