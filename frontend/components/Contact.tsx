"use client";

import { Mail, Phone } from "lucide-react";
import { profile as seedProfile } from "@/data/content";
import Magnetic from "./Magnetic";
import ResumeButton from "./ResumeButton";
import NebulaBackground from "./NebulaBackground";
import ShareButton from "./ShareButton";
import SaveContact from "./SaveContact";

// One-tap actions. Phones: a 2×2 grid of labelled, 48px-tall buttons (thumb
// friendly, no guessing what an icon means). From sm: a single row of pills.
const pill =
  "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent active:bg-panel";

export default function Contact({
  profile = seedProfile,
  showResume = false,
}: {
  profile?: typeof seedProfile;
  // Résumé download only on the `/?resume` link.
  showResume?: boolean;
}) {
  return (
    <section id="contact" className="relative bg-paper">
      <div className="page-container relative pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-14 sm:py-28">
        {/* Entrance comes from the page-wide SectionReveal. */}
        <div
          className="relative overflow-hidden rounded-3xl border border-line bg-paper px-5 py-10 text-center sm:px-16 sm:py-20"
        >
          <div className="contact-card-glow pointer-events-none absolute inset-0" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-panel px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-inkmuted sm:px-4 sm:text-[11px] sm:tracking-[0.15em]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to Lead Product Design · UI/UX &amp; CX roles
            </span>

            <h2 className="mx-auto mt-6 max-w-2xl text-balance font-serif text-[2.1rem] leading-[1.1] text-ink sm:text-6xl">
              Let&apos;s design something people{" "}
              <em className="text-accent not-italic">
                actually
              </em>{" "}
              enjoy using.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-inkmuted">
              Based in {profile.location}. Open to Lead Product Design, UI/UX
              &amp; CX opportunities in the UAE and Saudi Arabia.
            </p>

            {/* Primary: the résumé (only on the `/?resume` link). */}
            {showResume && (
              <div className="mt-8 flex justify-center sm:mt-9">
                <ResumeButton variant="solid" className="min-h-12 w-full justify-center sm:w-auto sm:px-7" />
              </div>
            )}

            {/* Secondary: one-tap contact. */}
            <ul className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className={`${pill} w-full`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`${pill} w-full`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.02c-.24.68-1.42 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.36z" />
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className={`${pill} w-full`} aria-label={`Email ${profile.email}`}>
                  <Mail className="h-4 w-4" strokeWidth={2} />
                  <span className="sm:hidden">Email</span>
                  <span className="hidden sm:inline">{profile.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s+/g, "")}`} className={`${pill} w-full`} aria-label={`Call ${profile.phone}`}>
                  <Phone className="h-4 w-4" strokeWidth={2} />
                  <span className="sm:hidden">Call</span>
                  <span className="hidden sm:inline">{profile.phone}</span>
                </a>
              </li>
            </ul>

            {/* Tertiary: save to contacts, share the portfolio. */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <SaveContact variant="gradient" className="min-h-11" />
              </Magnetic>
              <ShareButton
                title={`${profile.name} — ${profile.title}`}
                text={`Portfolio of ${profile.name}`}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-inkmuted transition-colors hover:text-accent"
              />
            </div>

            <p className="mt-8 font-mono text-[11px] uppercase tracking-wider text-inkmuted">
              Tap an NFC card?{" "}
              <a
                href="/card"
                className="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:underline"
              >
                Open the tap-to-connect card →
              </a>
            </p>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-inkmuted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name} · Lead Product Designer
            based in Dubai, UAE
          </span>
          <span>Built with Next.js &amp; Tailwind CSS</span>
        </footer>
      </div>
    </section>
  );
}
