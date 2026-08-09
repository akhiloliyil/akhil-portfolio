"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { profile, testimonials as seedTestimonials } from "@/data/content";
import NebulaBackground from "./NebulaBackground";

// The name mentioned *inside* the quotes (they're testimony about Akhil,
// not by him) — highlighted wherever it appears in the quote text.
const OWNER_FIRST_NAME = profile.name.split(/\s+/)[0];

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

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Picks out Akhil's name and the reviewer's company inside the quote text
// and gives each its own colour — the rest of the sentence reads as plain
// prose. (The reviewer's own name, e.g. "Naveen", doesn't appear in their
// own quote, so that's not one of the search terms.)
function renderQuote(quote: string, company?: string) {
  const firstName = OWNER_FIRST_NAME;
  const terms = [firstName, company].filter(Boolean) as string[];
  if (!terms.length) return quote;

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "g");
  return quote.split(pattern).map((part, i) => {
    if (part === firstName) {
      return (
        <span key={i} className="font-semibold text-accent">
          {part}
        </span>
      );
    }
    if (part === company) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function Testimonials({
  testimonials = seedTestimonials,
}: {
  testimonials?: typeof seedTestimonials;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

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

  // Heading — split into characters and stagger them up as it scrolls in.
  useEffect(() => {
    const el = headingRef.current;
    if (!el || reduce) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: "chars, words" });
      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        ease: "power3.out",
        duration: 0.7,
        stagger: 0.025,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [reduce]);

  // Active quote — split into words and reveal them each time the slide changes.
  useEffect(() => {
    const root = slidesRef.current;
    if (!root || reduce) return;
    const quote = root.querySelectorAll<HTMLElement>("blockquote")[selected];
    const t = testimonials[selected];
    if (!quote || !t) return;
    gsap.registerPlugin(SplitText);
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(quote, { type: "words, lines" });

      // SplitText rebuilds the blockquote into plain word-divs, discarding
      // any nested <span> markup that was there before it ran — so the
      // name/company highlight has to be re-applied here, after the split,
      // by matching each word div's own text instead of relying on JSX.
      const clean = (s: string) => s.replace(/[.,!?;:"']+$/, "").replace(/^[.,!?;:"']+/, "");
      const firstName = OWNER_FIRST_NAME;
      const companyWords = t.company ? t.company.split(/\s+/) : [];
      const words = split.words as HTMLElement[];

      words.forEach((w) => {
        if (clean(w.textContent ?? "") === firstName) {
          w.classList.add("font-semibold", "text-accent");
        }
      });
      if (companyWords.length) {
        for (let i = 0; i <= words.length - companyWords.length; i++) {
          const slice = words.slice(i, i + companyWords.length);
          const isMatch = slice.every(
            (w, j) => clean(w.textContent ?? "") === companyWords[j]
          );
          if (isMatch) {
            slice.forEach((w) => w.classList.add("font-semibold"));
            break;
          }
        }
      }

      gsap.from(split.words, {
        opacity: 0,
        yPercent: 60,
        filter: "blur(6px)",
        ease: "power2.out",
        duration: 0.5,
        stagger: 0.02,
      });
    }, quote);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [selected, reduce, testimonials]);

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="relative border-b border-line bg-[#050508]">
      <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Testimonials
            </p>
            <h2
              ref={headingRef}
              className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              What people say
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => embla?.scrollPrev()}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => embla?.scrollNext()}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-accent text-white transition-opacity hover:opacity-90"
            >
              <Chevron dir="right" />
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-8 sm:p-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex items-start" ref={slidesRef}>
              {testimonials.map((t, i) => (
                <figure
                  key={i}
                  className="min-w-0 shrink-0 grow-0 basis-full"
                >
                  {/* Decorative quote mark */}
                  <svg
                    viewBox="0 0 48 48"
                    className="h-10 w-10 text-accent/30"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18 10c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7zm22 0c-6 3-10 9-10 17v11h12V26h-7c0-4 2-7 6-9l-1-7z" />
                  </svg>

                  <blockquote className="mt-4 font-serif text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
                    {renderQuote(t.quote, t.company)}
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-accent/50 font-display text-sm font-semibold text-accent">
                      {initials(t.name)}
                    </span>
                    <span>
                      <span className="block font-display text-base font-semibold text-ink">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-wider text-accent">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
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
