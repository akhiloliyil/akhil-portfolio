"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { testimonials as seedTestimonials } from "@/data/content";
import SelectionFrame from "./SelectionFrame";

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

export default function Testimonials({
  testimonials = seedTestimonials,
}: {
  testimonials?: typeof seedTestimonials;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
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
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Testimonials
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What people say
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => embla?.scrollPrev()}
              className="focus-ring grid h-9 w-9 place-items-center rounded-sm border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => embla?.scrollNext()}
              className="focus-ring grid h-9 w-9 place-items-center rounded-sm border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full pr-6 sm:basis-1/2 lg:basis-1/3"
              >
                <SelectionFrame
                  tag={`Voice ${String(i + 1).padStart(2, "0")}`}
                  className="flex h-full flex-col border border-line bg-panel p-6"
                >
                  <span className="font-display text-4xl leading-none text-accent">
                    &ldquo;
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink">
                    {t.quote}
                  </p>
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="font-display text-sm font-semibold text-ink">
                      {t.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-inkmuted">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                </SelectionFrame>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
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
