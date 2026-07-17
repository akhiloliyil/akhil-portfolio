import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import DesignProcess from "@/components/DesignProcess";
import Toolkit from "@/components/Toolkit";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import SmoothScroll from "@/components/SmoothScroll";
import { getContent } from "@/lib/content-store";

// Read the editable content fresh each request so admin edits show immediately.
export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();

  const enabled = new Set(c.sections.filter((s) => s.enabled).map((s) => s.id));
  const on = (id: string) => enabled.has(id);
  const navLinks = c.sections
    .filter((s) => s.enabled)
    .map((s) => ({ href: `#${s.id}`, label: s.label }));

  return (
    <main className="min-h-screen bg-paper">
      <SmoothScroll />
      <Nav links={navLinks} />
      <Hero profile={c.profile} stats={c.stats} />
      {on("about") && <About about={c.about} />}
      {on("work") && <Work projects={c.projects} />}
      {on("process") && <DesignProcess process={c.process} />}
      {on("experience") && (
        <Experience experience={c.experience} education={c.education} />
      )}
      {on("gallery") && <Gallery gallery={c.gallery} projects={c.projects} />}
      {on("toolkit") && <Toolkit toolkit={c.toolkit} />}
      {on("testimonials") && <Testimonials testimonials={c.testimonials} />}
      {on("contact") && <Contact profile={c.profile} />}
    </main>
  );
}
