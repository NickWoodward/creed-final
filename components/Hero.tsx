"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn, splitText } from "@/lib/utils";
import { SectionGrid } from "./SectionGrid";

import { heroData } from "@/lib/content";
import { useVideoControls } from "@/contexts/VideoControlProvider";
import { HeroItem } from "./HeroItem";
import { HlsVideo } from "./HlsVideo";
import { Logo } from "./Logo";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

export const Hero = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const mainItemRef = useRef<HTMLDivElement>(null);

  const itemRefs = useRef<HTMLDivElement[]>([]);
  const setItemRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      itemRefs.current[index] = element;
    };
  };

  const { setCurrentVideo, getCurrentVideo, playVideo, pauseVideo, videosRef } =
    useVideoControls();

  const [accordionValue, setAccordionValue] = useState<string | undefined>(
    undefined
  );

  // Animation refs
  const textContentForwardsRef = useRef<gsap.core.Timeline | null>(null);
  const textContentBackwardsRef = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const textForwards = animateTextForwards();
      if (textForwards) {
        textContentForwardsRef.current = gsap
          .timeline({ paused: true })
          .add(textForwards);
      }
      const textBackwards = animateTextBackwards();

      if (textBackwards) {
        textContentBackwardsRef.current = gsap
          .timeline({ paused: true })
          .add(textBackwards);
      }
      const initialItem = displayRef.current?.querySelector(".initial-item");

      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: window,
        start: "top top",
        end: "+=25%",
        onEnter: () => {
          if (!initialItem) return;
          // TODO: Kill
          textContentBackwardsRef.current?.kill();
          textContentForwardsRef.current?.play(0);
          const itemState = Flip.getState(initialItem);
          itemRefs.current[0].appendChild(initialItem);

          Flip.from(itemState, {
            duration: 0.6,
            ease: "power4.inOut",
            absolute: true,
            simple: true,
            onComplete: () => {
              displayRef.current?.classList.add("pointer-events-none");
            },
          });
        },
        onLeaveBack: () => {
          if (!initialItem) return;
          textContentForwardsRef.current?.kill();
          textContentBackwardsRef.current?.play(0);

          const itemState = Flip.getState(initialItem);
          displayRef.current?.appendChild(initialItem);

          Flip.from(itemState, {
            duration: 0.6,
            ease: "power4.inOut",
            absolute: true,
            simple: true,
          });
        },
      });
    },
    { scope: containerRef }
  );

  function animateTextForwards() {
    const { logoInner, logoOuter, logoText, description } = getHeroText();
    if (!logoInner || !logoOuter || !logoText || !description) return;

    return gsap
      .timeline({})
      .to(
        [logoInner, logoOuter, description],
        {
          autoAlpha: 0,
          duration: 0.4,
        },
        "<"
      )
      .add(
        splitText(logoText, {
          type: "chars",
          mask: "chars",
          charsClass: "char",
          autoSplit: true,
          onSplit(self) {
            return gsap.to(self.chars, {
              autoAlpha: 100,
              y: 100,
              stagger: 0.01,
              ease: "none",
            });
          },
        }),
        "<"
      );
  }

  function animateTextBackwards() {
    const { logoInner, logoOuter, logoText, description } = getHeroText();
    if (!logoInner || !logoOuter || !logoText || !description) return;

    return gsap
      .timeline()
      .to(
        logoInner,
        {
          autoAlpha: 1,
          transformOrigin: "center center",
        },
        "<+=0.2"
      )
      .to(
        logoOuter,
        {
          autoAlpha: 1,
          transformOrigin: "center center",
        },
        "<+=0.04"
      )
      .add(
        splitText(logoText, {
          type: "chars",
          mask: "chars",
          charsClass: "char",
          autoSplit: true,
          onSplit(self) {
            return gsap.to(self.chars, {
              autoAlpha: 0,
              y: 0,
              stagger: 0.01,
              ease: "none",
            });
          },
        }),
        "<"
      )
      .to(
        description,
        {
          autoAlpha: 1,
          duration: 0.4,
          ease: "power1.inOut",
        },
        "<+=0.04"
      );
  }

  function getHeroText() {
    const logoOuter = containerRef.current?.querySelector<HTMLDivElement>(
      ".logo-main .logo-svg .outer"
    );
    const logoInner = containerRef.current?.querySelector<HTMLDivElement>(
      ".logo-main .logo-svg .inner"
    );
    const logoText = containerRef.current?.querySelector<HTMLDivElement>(
      ".logo-main .logo-text"
    );
    const description =
      containerRef.current?.querySelector<HTMLDivElement>(".hero-description");

    return { logoOuter, logoInner, logoText, description };
  }

  //// HERO IMAGE FLIP ////
  const flipItem = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    console.log("flip");
    if (e.currentTarget.classList.contains("open")) {
      console.log("close");
      closeHeroItem(e);
    } else {
      console.log("open");
      openHeroItem(e);
    }
  });

  const openHeroItem = (e: React.MouseEvent<HTMLElement>) => {
    const currentTarget = e.currentTarget;
    if (!currentTarget || !displayRef.current) return;
    gsap.set(currentTarget, { zIndex: 100 });

    const itemState = Flip.getState(currentTarget);
    displayRef.current.appendChild(currentTarget);
    displayRef.current.classList.remove("pointer-events-none");
    currentTarget.classList.add("open");

    gsap.timeline().add(
      Flip.from(itemState, {
        duration: 0.3,
        ease: "power1.inOut",
        absolute: true,
        simple: true,
        onComplete: () => {
          // Get the index of the animating item
          const index = currentTarget.dataset.itemIndex;
          if (!index) return;

          // Find the string id of that video
          const videoId = heroData["videos"][parseInt(index)]?.id;
          setCurrentVideo(videoId);

          // Open the accordion
          console.log("open accordion", index);
          setAccordionValue(`item-${index}`);
        },
      })
    );
  };

  const closeHeroItem = (e: React.MouseEvent<HTMLElement>) => {
    const item = e.currentTarget;
    if (!item || !item.parentElement || !displayRef.current) return;
    gsap.set(item, { zIndex: 100 });

    const itemState = Flip.getState(item);
    const originalGridIndex = item.dataset.itemIndex;
    const originalGridElement =
      itemRefs.current[parseInt(originalGridIndex || "0")];

    console.log({ originalGridElement });

    originalGridElement.append(item);
    displayRef.current.classList.add("pointer-events-none");
    item.classList.remove("open");

    gsap.timeline().add(
      Flip.from(itemState, {
        duration: 0.3,
        ease: "power1.inOut",
        absolute: true,
        simple: true,
        onStart: () => {
          setCurrentVideo("hero-video-1");
        },
        onComplete: () => {
          gsap.set(item, { zIndex: 10 });
        },
      })
    );
  };

  return (
    <SectionGrid
      ref={containerRef}
      className={cn(
        `hero relative h-full
          grid !grid-cols-6 !grid-rows-6 gap-6
        `,
        className
      )}
    >
      <div className="hero-content pointer-events-none absolute inset-0 text-white flex items-center md:mx-0   pl-[5%] xxs:pl-[7%] md:pl-[10%] z-[201]">
        <Logo size="hero" className="logo-main text-logo" />
        <div className="hero-description mt-3 lg:mt-5 ml-3 sm:ml-4 text-secondary-lighter text-xl xxs:text-2xl lg:text-3xl  font-[320] max-w-[88%] xs:max-w-[86%] sm:max-w-[500px] lg:max-w-[650px]">
          {heroData["description"]}
        </div>
      </div>

      {/* Display Overlay */}
      <div
        ref={displayRef}
        className={`display absolute inset-0 overflow-hidden z-[100]`}
      >
        {/* <div className="initial-item flex justify-center items-center h-full border-[3px] rounded-xl bg-teal-300"></div> */}

        <HeroItem
          ref={mainItemRef}
          main={true}
          className="initial-item col-start-1 col-span-1 lg:col-span-full  row-start-1 row-span-1"
        >
          <HlsVideo
            key={heroData["videos"][0].id}
            id={heroData["videos"][0].id}
            url={heroData["videos"][0].url}
            autoPlay={true}
            loop
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
        </HeroItem>
      </div>

      {/* Grid Elements */}
      <div
        ref={setItemRefs(0)}
        className="grid-item col-start-1 col-span-2 row-start-1 row-span-2 rounded-xl z-[200]"
      >
        {/* Empty to start off */}
      </div>

      <div
        ref={setItemRefs(1)}
        className="grid-item col-start-3 col-span-full row-start-1 row-span-3 flex justify-center items-center"
      >
        <HeroItem dataItemIndex="1" onClick={(e) => flipItem(e)} className="">
          <HlsVideo
            key={heroData["videos"][1].id}
            id={heroData["videos"][1].id}
            url={heroData["videos"][1].url}
            loop
            placeholder={heroData["videos"][1].placeholder}
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
        </HeroItem>
      </div>

      <div
        ref={setItemRefs(2)}
        className="grid-item col-start-1 col-span-2 row-start-3 row-span-full flex justify-center items-center"
      >
        <HeroItem
          dataItemIndex="2"
          onClick={(e) => flipItem(e)}
          className="col-start-1 col-span-2 row-start-3 row-span-full"
        >
          <HlsVideo
            key={heroData["videos"][2].id}
            id={heroData["videos"][2].id}
            url={heroData["videos"][2].url}
            loop
            placeholder={heroData["videos"][2].placeholder}
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
        </HeroItem>
      </div>

      <div
        ref={setItemRefs(3)}
        className="grid-item col-start-3 col-span-full row-start-4 row-span-full flex justify-center items-center"
      >
        <HeroItem dataItemIndex="3" onClick={(e) => flipItem(e)} className="">
          <HlsVideo
            key={heroData["videos"][3].id}
            id={heroData["videos"][3].id}
            url={heroData["videos"][3].url}
            loop
            placeholder={heroData["videos"][3].placeholder}
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
        </HeroItem>
      </div>
    </SectionGrid>
    // </div>
  );
};
