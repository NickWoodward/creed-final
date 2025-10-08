import { Hero } from "@/components/Hero";
import { Pinned } from "@/components/Pinned";
import { Section } from "@/components/Section";
import { SectionGrid } from "@/components/SectionGrid";
import { About } from "@/components/About";
import { SlidingCards } from "@/components/SlidingCards";
import { VideoControlProvider } from "@/contexts/VideoControlProvider";

export default function Home() {
  return (
    <div className="">
      <Section>
        <Pinned className="h-screen col-start-1 col-span-full p-[var(--card-inset)]">
          <VideoControlProvider>
            <Hero />
          </VideoControlProvider>
        </Pinned>
      </Section>

      <Section>
        <Pinned
          end="+=100%"
          markers
          className=" h-screen col-start-1 col-span-full px-[var(--card-inset)]"
        >
          <About />
        </Pinned>
      </Section>

      <Section>
        <SectionGrid>
          {/* Individual Cards are Pinned */}
          <SlidingCards className="col-start-1 col-span-full" />
        </SectionGrid>
      </Section>

      <Section>
        <Pinned
          end="+=100%"
          markers
          className=" h-screen col-start-1 col-span-full px-[var(--card-inset)]"
        >
          <About />
        </Pinned>
      </Section>
    </div>
  );
}
