"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials as seedTestimonials } from "@/data/content";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Testimonials({
  testimonials = seedTestimonials,
}: {
  testimonials?: typeof seedTestimonials;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Testimonials
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What people say
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => embla?.scrollPrev()}
              className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => embla?.scrollNext()}
              className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">
            {testimonials.map((t, i) => (
              <figure
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full px-1 sm:px-4"
              >
                {/* Decorative quote mark */}
                <svg
                  viewBox="0 0 48 48"
                  className="h-12 w-12 text-accent/25"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 10c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7zm22 0c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7z" />
                </svg>

                <blockquote className="mt-4 text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
                  {t.quote}
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 font-display text-sm font-semibold text-accent">
                    {initials(t.name)}
                  </span>
                  <span>
                    <span className="block font-display text-base font-semibold text-ink">
                      {t.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-inkmuted">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? "w-6 bg-accent" : "w-1.5 bg-line hover:bg-inkmuted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
