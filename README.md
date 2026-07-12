# Akhil Kumar — Portfolio

A single-page Next.js (App Router) portfolio built from your resume content,
designed around a "design canvas" motif — selection handles, mono labels,
and a grid backdrop — that reflects the design-tool-to-code path your work
actually follows (Adobe XD / Figma → React / React Native).

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels)

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Edit your content

Everything text-based — name, bio, projects, experience, skills, contact
links — lives in one place:

```
data/content.ts
```

Update that file and the whole site updates. No need to touch components
unless you want to change layout or styling.

## Structure

```
app/
  layout.tsx      — fonts, metadata
  page.tsx        — assembles the page sections
  globals.css     — design tokens, grid backdrop, selection-handle styles
components/
  Nav.tsx         — sticky top nav
  Hero.tsx        — intro + signature canvas panel
  Work.tsx        — selected project frames
  Experience.tsx  — role timeline + education
  Toolkit.tsx     — grouped skills
  Contact.tsx     — closing CTA + footer
  SelectionFrame.tsx — the reusable corner-handle wrapper (the page's
                        signature visual element)
data/content.ts   — all resume content
```

## Deploy

Easiest path is Vercel:

```bash
npm i -g vercel
vercel
```

Or build a production bundle yourself:

```bash
npm run build
npm run start
```

## Notes

- The hero "photo" is an abstract monogram panel rather than your headshot —
  drop a real photo into `public/` and swap it into `components/Hero.tsx`
  if you'd like your face on the page.
- Project thumbnails are drawn as simple frame glyphs rather than real
  screenshots (none were available to pull from cleanly). Swap in real
  screenshots by adding images to `public/work/` and updating
  `components/Work.tsx`.
