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

  return (
    <main className="min-h-screen bg-paper">
      <SmoothScroll />
      <Nav />
      <Hero profile={c.profile} stats={c.stats} />
      <About about={c.about} />
      <Work projects={c.projects} />
      <DesignProcess process={c.process} />
      <Experience experience={c.experience} education={c.education} />
      <Gallery gallery={c.gallery} projects={c.projects} />
      <Toolkit toolkit={c.toolkit} />
      <Testimonials testimonials={c.testimonials} />
      <Contact profile={c.profile} />
    </main>
  );
}
