import { Fragment } from "react";
import { about } from "@/content/site";
import { Reveal } from "./motion";
import { ScrubText } from "./scroll-fx";
import { Container, SectionHeading } from "./ui";

/** Turns "text [[emphasis]] text" into text with the emphasised phrase in full-strength colour. */
function withEmphasis(text: string) {
  return text.split(/(\[\[.+?\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <strong key={i} className="font-medium text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="about" label="About" title="From messy input to something useful." />
        </Reveal>

        {/* Lead paragraph lights up word by word as you scroll through it. */}
        <ScrubText
          text={about.paragraphs[0]}
          className="mb-16 max-w-5xl text-[clamp(1.5rem,2.9vw,2.35rem)] font-medium leading-[1.3] tracking-[-0.02em] text-fg sm:mb-20"
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="space-y-6 lg:col-span-7">
            {about.paragraphs.slice(1).map((p, i) => (
              <p key={i} className="max-w-[62ch] text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
                {withEmphasis(p)}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <dl className="border-t border-line">
              {about.facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-3.5">
                  <dt className="font-mono text-[11px] font-medium uppercase leading-6 tracking-[0.12em] text-subtle">
                    {f.k}
                  </dt>
                  <dd className="text-[15px] leading-6 text-fg">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal className="mt-20 sm:mt-24">
          <h3 className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Toolbox</h3>
          <dl className="border-t border-line">
            {about.skills.map((s) => (
              <div key={s.group} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-[15px] font-medium text-fg">{s.group}</dt>
                <dd className="text-[15px] text-muted">{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
