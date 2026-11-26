import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { MotionProvider } from "@/components/motion";
import { Nav } from "@/components/nav";
import { Projects } from "@/components/projects";
import { SmoothScroll } from "@/components/scroll-fx";
import { CommandMenu } from "@/components/command-menu";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

export default function Home() {
  // Structured data so search engines understand who this page is about.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: getSiteUrl(),
    email: `mailto:${site.email}`,
    jobTitle: "Software Engineer",
    alumniOf: { "@type": "CollegeOrUniversity", name: "University of Pittsburgh" },
    sameAs: [site.links.github, site.links.linkedin],
  };

  return (
    <MotionProvider>
      <SmoothScroll />
      <CommandMenu />
      {/* Ruled lines in the page gutters, wide screens only */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 hidden w-[calc((100vw-72rem)/2)] xl:block">
        <div className="gutter-rules h-full w-full [mask-image:linear-gradient(to_left,black,transparent)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 right-0 hidden w-[calc((100vw-72rem)/2)] xl:block">
        <div className="gutter-rules h-full w-full [mask-image:linear-gradient(to_right,black,transparent)]" />
      </div>

      <Nav />
      <main id="main" className="relative">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </MotionProvider>
  );
}
