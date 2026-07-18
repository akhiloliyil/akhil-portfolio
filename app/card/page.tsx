import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getContent } from "@/lib/content-store";
import SaveContact from "@/components/SaveContact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akhil Kumar — Tap to connect",
  description:
    "Save Akhil Kumar's contact, résumé and links in one tap. NFC- and QR-friendly digital business card.",
  robots: { index: false },
};

/** Absolute origin of this deployment (env override, else request headers). */
async function getOrigin(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://akhil-oliyil.com";
}

const PROFILE_IMAGE = "/images/profile.jpg";

function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5 shrink-0",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "resume":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.02c-.24.68-1.42 1.3-1.95 1.38-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.77-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.18 1.54 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.68-.17 1.36z" />
        </svg>
      );
    case "call":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "email":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      );
    case "portfolio":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return null;
  }
}

export default async function CardPage() {
  const { profile } = await getContent();
  const origin = await getOrigin();
  const cardUrl = `${origin}/card`;

  // QR points back to this card so a non-NFC visitor reaches the same hub.
  const qrSvg = await QRCode.toString(cardUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#111827", light: "#00000000" },
  });

  const phoneTel = profile.phone.replace(/\s+/g, "");
  const phoneWa = profile.phone.replace(/\D/g, "");

  const links: {
    key: string;
    label: string;
    sub: string;
    href: string;
    external?: boolean;
  }[] = [
    { key: "whatsapp", label: "WhatsApp", sub: profile.phone, href: `https://wa.me/${phoneWa}`, external: true },
    { key: "call", label: "Call", sub: profile.phone, href: `tel:${phoneTel}` },
    { key: "email", label: "Email", sub: profile.email, href: `mailto:${profile.email}` },
    { key: "linkedin", label: "LinkedIn", sub: "Connect", href: profile.linkedin, external: true },
    { key: "portfolio", label: "Portfolio", sub: "See selected work", href: origin, external: true },
  ];

  return (
    <main className="canvas-grid relative min-h-screen bg-paper px-5 py-10 sm:py-16">
      {/* Back to portfolio — pinned to the window's top-right corner */}
      <a
        href="/"
        className="focus-ring fixed left-4 top-4 z-20 inline-flex items-center gap-2 rounded-sm border border-line bg-panel/80 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted backdrop-blur transition-colors hover:border-accent hover:text-accent sm:left-6 sm:top-6"
      >
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
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to portfolio
      </a>

      <div className="mx-auto w-full max-w-md">
        {/* Header / identity */}
        <header className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-accent bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE_IMAGE}
              alt={`${profile.name} portrait`}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">
            {profile.name}
          </h1>
          <p className="mt-2 max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-wider text-inkmuted">
            {profile.title}
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-inkmuted">
            {profile.location}
          </p>
        </header>

        {/* Primary CTA */}
        <div className="mt-8">
          <SaveContact variant="solid" className="w-full justify-center py-4 text-sm" />
        </div>

        {/* Link list */}
        <ul className="mt-4 space-y-3">
          {links.map((l) => (
            <li key={l.key}>
              <a
                href={l.href}
                {...(l.key === "resume" ? { download: "Akhil-Kumar-Resume.pdf" } : {})}
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="focus-ring group flex items-center gap-4 rounded-sm border border-line bg-panel px-5 py-4 text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name={l.key} />
                <span className="flex flex-col">
                  <span className="font-mono text-xs uppercase tracking-wider">
                    {l.label}
                  </span>
                  <span className="mt-0.5 text-xs text-inkmuted group-hover:text-accent/80">
                    {l.sub}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="ml-auto h-4 w-4 text-inkmuted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* QR — for people without NFC */}
        <section className="mt-10 flex flex-col items-center">
          <div
            className="rounded-lg bg-white p-4 shadow-[0_1px_0_0_rgba(17,25,43,0.06)]"
            // Fixed light backing so the QR stays scannable in dark mode too.
          >
            <div
              className="h-40 w-40"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-inkmuted">
            Scan to open this card
          </p>
        </section>

        <footer className="mt-10 text-center font-mono text-[10px] uppercase tracking-wider text-inkmuted">
          © {new Date().getFullYear()} {profile.name}
        </footer>
      </div>
    </main>
  );
}
