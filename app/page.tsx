import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Work from "@/components/Work";
import WorkV2 from "@/components/WorkV2";
import Experience from "@/components/Experience";
import Gallery from "@/components/Gallery";
import Process from "@/components/Process";
import Toolkit from "@/components/Toolkit";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import ComplexSystems from "@/components/ComplexSystems";
import DesignSystems from "@/components/DesignSystems";
import HowILead from "@/components/HowILead";
import DesignToCode from "@/components/DesignToCode";
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
  // `/?resume` is the link shared with a CV: it shows the résumé download
  // and the hidden projects / shots.
  const resume = "resume" in (await searchParams);

  const enabled = new Set(c.sections.filter((s) => s.enabled).map((s) => s.id));
  const on = (id: string) => enabled.has(id);
  // Shots flagged `hidden` stay in the content but are kept off the page
  // (except on the `?resume` link).
  const gallery = resume ? c.gallery : c.gallery.filter((g) => !g.hidden);
  const projects = resume ? c.projects : c.projects.filter((p) => !p.hidden);

  return (
    <main className="min-h-screen bg-paper">
      <SmoothScroll />
      <SectionReveal />
      {/* Recruiter-first nav (Work · Experience · About · Process · Contact
          + Résumé) — fixed in Nav; section toggles only control what renders. */}
      <Nav showResume={resume} />
      <Hero profile={c.profile} stats={c.stats} showResume={resume} />
      {on("work") && <WorkV2 projects={projects} gallery={gallery} />}
      {on("industries") && <Work />}
      {on("systems") && <ComplexSystems />}
      {on("design-systems") && <DesignSystems />}
      {on("design-systems") && <DesignToCode />}
      {on("leadership") && <HowILead />}
      {on("process") && <Process process={c.process} />}
      {on("experience") && (
        <Experience experience={c.experience} education={c.education} />
      )}
      {on("gallery") && <Gallery gallery={gallery} projects={projects} />}
      {on("about") && <About about={c.about} />}
      {on("toolkit") && <Toolkit toolkit={c.toolkit} />}
      {on("testimonials") && <Testimonials testimonials={c.testimonials} />}
      {on("contact") && <Contact profile={c.profile} showResume={resume} />}
    </main>
  );
}
