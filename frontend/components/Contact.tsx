"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile as seedProfile } from "@/data/content";
import SelectionFrame from "./SelectionFrame";
import Magnetic from "./Magnetic";
import ShareButton from "./ShareButton";
import SaveContact from "./SaveContact";

export default function Contact({
  profile = seedProfile,
}: {
  profile?: typeof seedProfile;
}) {
  const reduce = useReducedMotion();

  return (
    <section id="contact" className="bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <SelectionFrame
            tag="Frame · Contact"
            className="border border-line bg-paper px-8 py-14 text-center sm:px-16"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Open to lead product design &amp; UX/CX roles
            </p>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              Let's design something people actually enjoy using.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-inkmuted">
              Based in {profile.location}. Available for full-time roles and
              select freelance product work.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <SaveContact variant="solid" />
              </Magnetic>
              <Magnetic>
                <a
                  href={`mailto:${profile.email}`}
                  className="focus-ring inline-block rounded-sm bg-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-colors hover:bg-accent"
                >
                  {profile.email}
                </a>
              </Magnetic>
              <a
                href={`tel:${profile.phone.replace(/\s+/g, "")}`}
                className="focus-ring rounded-sm border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
              >
                {profile.phone}
              </a>
              <a
                href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-sm border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.02c-.24.68-1.42 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.36z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-sm border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
              >
                LinkedIn
              </a>
              <ShareButton
                title={`${profile.name} — ${profile.title}`}
                text={`Portfolio of ${profile.name}`}
                className="focus-ring inline-flex items-center gap-2 rounded-sm border border-ink px-5 py-3 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent"
              />
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-inkmuted">
              Tap an NFC card?{" "}
              <a
                href="/card"
                className="text-accent underline-offset-4 hover:underline"
              >
                Open the tap-to-connect card →
              </a>
            </p>
          </SelectionFrame>
        </motion.div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider text-inkmuted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>Built with Next.js &amp; Tailwind CSS</span>
        </footer>
      </div>
    </section>
  );
}
