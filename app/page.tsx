import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import WorkV2 from "@/components/WorkV2";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import DesignProcess from "@/components/DesignProcess";
import Toolkit from "@/components/Toolkit";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";
import SectionReveal from "@/components/SectionReveal";
import { getContent } from "@/lib/content-store";

// Read the editable content fresh each request so admin edits show immediately.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const c = await getContent();
  // `/?resume` is the link shared with a CV: it also shows hidden shots.
  const resume = "resume" in (await searchParams);

  const enabled = new Set(c.sections.filter((s) => s.enabled).map((s) => s.id));
  const on = (id: string) => enabled.has(id);
  const navLinks = c.sections
    .filter((s) => on(s.id))
    .map((s) => ({ href: `#${s.id}`, label: s.label }));
  // Shots flagged `hidden` stay in the content but are kept off the page
  // (except on the `?resume` link).
  const gallery = resume ? c.gallery : c.gallery.filter((g) => !g.hidden);

  return (
    <main className="min-h-screen bg-paper">
      <SmoothScroll />
      <SectionReveal />
      <Nav links={navLinks} />
      <Hero profile={c.profile} stats={c.stats} />
      {on("about") && <About about={c.about} />}
      {on("industries") && <Work />}
      {on("work") && <WorkV2 projects={c.projects} gallery={gallery} />}
      {on("process") && <DesignProcess process={c.process} />}
      {on("experience") && (
        <Experience experience={c.experience} education={c.education} />
      )}
      {on("gallery") && <Gallery gallery={gallery} projects={c.projects} />}
      {on("toolkit") && <Toolkit toolkit={c.toolkit} />}
      {on("testimonials") && <Testimonials testimonials={c.testimonials} />}
      {on("contact") && <Contact profile={c.profile} />}
    </main>
  );
}
