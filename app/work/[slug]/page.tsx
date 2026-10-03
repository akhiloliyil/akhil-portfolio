import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import ResumeButton from "@/components/ResumeButton";
import ScreenGallery, { type GalleryShot } from "@/components/ScreenGallery";
import MobileMore from "@/components/MobileMore";
import {
  APPROACH_STEPS,
  caseStudies,
  caseStudyBySlug,
  type CaseImage,
  type CaseStudy,
} from "@/data/case-studies";

type Params = { params: Promise<{ slug: string }> };

const NAV_LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
];

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) return {};
  const title = `${cs.title} — Case study · Akhil Kumar`;
  return {
    title,
    description: cs.oneLiner,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      type: "article",
      title,
      description: cs.oneLiner,
      url: `/work/${cs.slug}`,
      images: [{ url: cs.cover.src, width: cs.cover.width, height: cs.cover.height, alt: cs.cover.alt }],
    },
    twitter: { card: "summary_large_image", title, description: cs.oneLiner, images: [cs.cover.src] },
  };
}

/* ----------------------------------------------------------------------- */

function Section({
  id,
  index,
  title,
  children,
}: {
  id?: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id ?? `s${index}`}-h`} className="scroll-mt-24 border-t border-line py-10 sm:py-16 lg:py-20">
      <div className="grid gap-5 lg:grid-cols-[14rem_1fr] lg:gap-12">
        <h2 id={`${id ?? `s${index}`}-h`} className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          <span className="text-inkmuted">{String(index).padStart(2, "0")} — </span>
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

// Case-study images: wide shots open in the full-screen viewer (tap to zoom).
function wide(img: CaseImage): GalleryShot {
  return { src: img.src, alt: img.alt, width: img.width, height: img.height, title: img.caption };
}

// Numbered steps: a compact vertical list on phones, cards from `sm`.
function Flow({ steps }: { steps: { label: string; note: string }[] }) {
  return (
    <ol className="divide-y divide-line border-y border-line sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0 sm:border-0 lg:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.label} className="flex gap-4 py-4 sm:block sm:rounded-2xl sm:border sm:border-line sm:bg-panel sm:p-5">
          <span className="font-mono text-[11px] text-accent sm:block">{String(i + 1).padStart(2, "0")}</span>
          <span className="block">
            <span className="block font-display text-base font-semibold leading-tight text-ink sm:mt-2">{s.label}</span>
            <span className="mt-1 block text-sm leading-relaxed text-inkmuted sm:mt-2">{s.note}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------------------- */

// Builds the ordered section list; sections without data are skipped, and
// numbering follows what's actually shown.
function sectionsFor(cs: CaseStudy) {
  const list: { id?: string; title: string; body: ReactNode }[] = [];

  list.push({
    id: "problem",
    title: "Problem",
    body: (
      <div className="max-w-3xl space-y-4">
        {cs.challenge.map((p, i) => (
          <p key={i} className={i === 0 ? "font-display text-lg leading-relaxed text-ink sm:text-2xl" : "text-base leading-relaxed text-inkmuted sm:text-lg"}>
            {p}
          </p>
        ))}
      </div>
    ),
  });

  list.push({
    id: "users",
    title: "Users",
    body: (
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {cs.users.map((u) => (
          <li key={u.name} className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
            <p className="font-display text-base font-semibold text-ink sm:text-lg">{u.name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-inkmuted">{u.need}</p>
          </li>
        ))}
      </ul>
    ),
  });

  list.push({
    id: "role",
    title: "My role",
    body: (
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{cs.role.title}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {cs.role.scope.map((s) => (
              <li key={s} className="rounded-full border border-line bg-panel px-3 py-1 text-sm text-ink">{s}</li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-inkmuted">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink">Team · </span>
            {cs.role.team}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">What I owned</p>
          <MobileMore
            initial={4}
            noun="items"
            listClassName="mt-3 space-y-3"
            itemClassName="flex gap-3 text-base leading-relaxed text-ink"
            items={cs.role.owned.map((o) => (
              <Fragment key={o}>
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {o}
              </Fragment>
            ))}
          />
        </div>
      </div>
    ),
  });

  list.push({
    id: "challenge",
    title: "Challenge",
    body: (
      <MobileMore
        initial={3}
        noun="problem areas"
        listClassName="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2"
        itemClassName="bg-panel p-5 sm:p-6"
        items={cs.problems.map((p, i) => (
          <Fragment key={p.title}>
            <p className="font-mono text-[11px] text-accent">P{i + 1}</p>
            <p className="mt-1 font-display text-base font-semibold text-ink sm:text-lg">{p.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-inkmuted">{p.body}</p>
          </Fragment>
        ))}
      />
    ),
  });

  list.push({
    id: "journey",
    title: "Journey / workflow",
    body: (
      <>
        <p className="mb-4 font-display text-lg font-semibold text-ink sm:mb-6 sm:text-xl">{cs.journey.title}</p>
        <Flow steps={cs.journey.steps} />
      </>
    ),
  });

  list.push({
    id: "approach",
    title: "UX approach",
    body: (
      <>
        <p className="mb-4 font-mono text-[11px] uppercase leading-relaxed tracking-wider text-inkmuted">
          {APPROACH_STEPS.filter((step) => cs.approach[step]).join(" → ")}
        </p>
        <MobileMore
          initial={3}
          noun="steps"
          ordered
          listClassName="divide-y divide-line border-y border-line"
          itemClassName="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6"
          items={APPROACH_STEPS.filter((step) => cs.approach[step]).map((step) => (
            <Fragment key={step}>
              <span className="font-display text-base font-semibold text-ink">{step}</span>
              <span className="text-sm leading-relaxed text-inkmuted">{cs.approach[step]}</span>
            </Fragment>
          ))}
        />
      </>
    ),
  });

  if (cs.capabilities?.length) {
    list.push({
      id: "ai-interactions",
      title: "AI interactions",
      body: (
        <MobileMore
          initial={4}
          noun="interactions"
          listClassName="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3"
          itemClassName="rounded-2xl border border-line bg-panel p-5 sm:p-6"
          items={cs.capabilities.map((c) => (
            <Fragment key={c.label}>
              <p className="font-display text-base font-semibold text-ink sm:text-lg">{c.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-inkmuted">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent">UX decision · </span>
                {c.decision}
              </p>
            </Fragment>
          ))}
        />
      ),
    });
  }

  list.push({
    id: "solution",
    title: "Solution",
    body: (
      <div className="space-y-12">
        {cs.screens.map((img) => (
          <div key={img.src}>
            <ScreenGallery layout="wide" shots={[wide(img)]} />
            {img.notes?.length ? (
              <MobileMore
                initial={3}
                noun="decisions"
                ordered
                listClassName="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                itemClassName="flex gap-4"
                items={img.notes.map((n, i) => (
                  <Fragment key={n.title}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-semibold text-onaccent">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-display text-base font-semibold text-ink">{n.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-inkmuted">{n.body}</span>
                    </span>
                  </Fragment>
                ))}
              />
            ) : null}
          </div>
        ))}
      </div>
    ),
  });

  if (cs.mobileScreens?.length) {
    list.push({
      id: "mobile-ux",
      title: "Mobile UX decisions",
      body: (
        <>
          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-inkmuted">
            Real screens at device size, each with the decision behind it. Tap a
            screen to view it full size.
          </p>
          <ScreenGallery
            shots={cs.mobileScreens.map((m) => ({ src: m.src, alt: m.alt, width: 414, height: 900, title: m.title, note: m.note }))}
          />
        </>
      ),
    });
  }

  if (cs.beforeAfter?.length) {
    list.push({
      id: "before-after",
      title: "Before → after",
      body: (
        <div className="space-y-12">
          {cs.beforeAfter.map((ba, i) => (
            <div key={i}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-inkmuted">Before</p>
                  <ScreenGallery layout="wide" shots={[wide(ba.before)]} />
                </div>
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-accent">After</p>
                  <ScreenGallery layout="wide" shots={[wide(ba.after)]} />
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-inkmuted">{ba.note}</p>
            </div>
          ))}
        </div>
      ),
    });
  }

  list.push({
    id: "design-system",
    title: "Design system",
    body: (
      <>
        <p className="max-w-3xl text-base leading-relaxed text-ink sm:text-lg">{cs.designSystem.summary}</p>
        <MobileMore
          initial={3}
          noun="components"
          listClassName="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          itemClassName="bg-panel p-5"
          items={cs.designSystem.parts.map((p) => (
            <Fragment key={p.label}>
              <p className="font-display text-base font-semibold text-ink">{p.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-inkmuted">{p.note}</p>
            </Fragment>
          ))}
        />
      </>
    ),
  });

  list.push({
    id: "design-to-code",
    title: "Design → code",
    body: <Flow steps={cs.designToCode} />,
  });

  list.push({
    id: "outcome",
    title: "Outcome",
    body: (
      <ul className="max-w-3xl space-y-3 sm:space-y-4">
        {cs.outcome.map((o) => (
          <li key={o} className="flex gap-3 font-display text-base leading-snug text-ink sm:text-xl">
            <span aria-hidden="true" className="text-accent">✓</span>
            {o}
          </li>
        ))}
      </ul>
    ),
  });

  if (cs.learnings?.length) {
    list.push({
      id: "learnings",
      title: "Learning",
      body: (
        <ul className="max-w-3xl space-y-3 text-base leading-relaxed text-inkmuted">
          {cs.learnings.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      ),
    });
  }

  return list;
}

export default async function CaseStudyPage({ params }: Params) {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) notFound();

  const sections = sectionsFor(cs);
  const i = caseStudies.indexOf(cs);
  const next = caseStudies[(i + 1) % caseStudies.length];

  return (
    <main className="min-h-screen bg-paper">
      <SmoothScroll />
      <Nav links={NAV_LINKS} home="/" />

      <article className="page-container">
        {/* 01 — Overview */}
        <header className="pb-10 pt-8 sm:pb-14 sm:pt-16">
          <Link
            href="/#work"
            className="focus-ring inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-wider text-inkmuted hover:text-accent"
          >
            ← All work
          </Link>
          <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-accent sm:mt-10 sm:text-xs">
            <span className="text-inkmuted">01 — </span>Overview · {cs.kicker}
          </p>
          <h1 className="mt-3 max-w-4xl text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.03em] text-ink sm:mt-4 sm:text-6xl">
            {cs.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-inkmuted sm:mt-6 sm:text-xl">{cs.oneLiner}</p>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-10">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">Company</dt>
              <dd className="mt-1 text-ink">{cs.org}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">Role</dt>
              <dd className="mt-1 text-ink">{cs.role.title}</dd>
            </div>
            {cs.period && (
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">Timeline</dt>
                <dd className="mt-1 text-ink">{cs.period}</dd>
              </div>
            )}
            {cs.link && (
              <div className="col-span-2">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-inkmuted">Live</dt>
                <dd className="mt-1">
                  <a href={cs.link.href} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline">
                    {cs.link.label} ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-8 sm:mt-12">
            <ScreenGallery layout="wide" shots={[wide(cs.cover)]} priority />
          </div>

          {/* Jump links — a phone reader can skip straight to the evidence. */}
          <nav aria-label="On this page" className="-mx-5 mt-6 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex gap-2 whitespace-nowrap">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="focus-ring inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm text-ink active:bg-panel"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {sections.map((s, idx) => (
          <Section key={s.title} id={s.id} index={idx + 2} title={s.title}>
            {s.body}
          </Section>
        ))}

        <footer className="border-t border-line py-16 sm:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <Link href={`/work/${next.slug}`} className="focus-ring group block">
              <p className="font-mono text-xs uppercase tracking-wider text-inkmuted">Next case study</p>
              <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink transition-colors group-hover:text-accent sm:text-4xl">
                {next.title} →
              </p>
            </Link>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href="/#contact"
                className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-onaccent hover:brightness-110"
              >
                Get in touch
              </a>
              <ResumeButton variant="outline" className="min-h-12" />
            </div>
          </div>
        </footer>
      </article>
    </main>
  );
}
