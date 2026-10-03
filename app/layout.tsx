import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://akhil-oliyil.com";
const title = "Akhil Kumar — Lead Product Designer, UI/UX & CX · Dubai, UAE";
const description =
  "Lead Product Designer in Dubai with 16+ years in UI/UX, product design and CX — e-commerce, enterprise platforms, marketplaces, design systems and AI product experiences, from customer journey to React/Next.js production.";

// Structured data so search engines can read the profile as a Person.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akhil Kumar",
  jobTitle: "Lead Product Designer — UI/UX & CX",
  url: siteUrl,
  image: `${siteUrl}/images/profile.jpg`,
  email: "mailto:akhiloliyil@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: ["https://www.linkedin.com/in/akhil-kumar-49789656/"],
  knowsAbout: [
    "Product Design",
    "UX Design",
    "Customer Experience",
    "E-commerce UX",
    "Enterprise UX",
    "Design Systems",
    "AI Product Design",
    "React",
    "Next.js",
    "React Native",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Akhil Kumar",
    "Lead Product Designer UAE",
    "UI/UX Designer UAE",
    "Product Designer Dubai",
    "UX/CX Designer",
    "E-commerce Product Designer",
    "Enterprise UX Designer",
    "AI Product Designer",
    "Design Systems",
  ],
  authors: [{ name: "Akhil Kumar" }],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Akhil Kumar — Portfolio",
    locale: "en_AE",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the layout extend under the notch / home indicator; padding uses
  // env(safe-area-inset-*) where it matters (nav, contact).
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d0a" },
  ],
};

// Runs before paint to set the theme class from storage / system preference,
// avoiding a flash of the wrong theme on load.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    // Default to dark unless the user explicitly chose light before.
    var dark = t ? t === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable} font-body antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
