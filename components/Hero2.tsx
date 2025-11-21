"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn, SplitTextAnimator, SplitTextWithAnimate } from "@/lib/utils";
import { HeroItem } from "./HeroItem";
import { heroData } from "@/lib/content";
import { HeroItem2, Position } from "./HeroItem2";
import { HlsVideo } from "./HlsVideo";
import { MinimisedFilter } from "./MinimisedFilter";
import { SectionGrid } from "./SectionGrid";
import { useVideoControls } from "@/contexts/VideoControlProvider";
import { DefaultHeroItem } from "./DefaultHeroItem";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

const heroItems = [
  // { id: 0, className: "bg-teal-300", wrapper: { className: "col-start-1 col-span-2 row-start-1 row-span-2" }, content: "Item 1", preview: "Preview 1" },
  {
    id: 0,
    className: "bg-violet-300",
    wrapper: { className: "col-start-3 col-span-full row-start-1 row-span-3" },
    position: "br",
  },
  {
    id: 1,
    className: "bg-sky-300",
    wrapper: { className: "col-start-1 col-span-2 row-start-3 row-span-full" },
    position: "bl",
  },
  {
    id: 2,
    className: "bg-orange-300",
    wrapper: {
      className: "col-start-3 col-span-full row-start-4 row-span-full",
    },
    position: "br",
  },
];

export const Hero2 = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const defaultItemRef = useRef<HTMLDivElement>(null);
  const initialGridItemRef = useRef<HTMLDivElement>(null);

  const { setCurrentVideo, getCurrentVideo, playVideo, pauseVideo, videosRef } =
    useVideoControls();

  const itemRefs = useRef<HTMLDivElement[]>([]);
  const setItemRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      itemRefs.current[index] = element;
    };
  };

  const titleRefs = useRef<HTMLDivElement[]>([]);
  const setTitleRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      titleRefs.current[index] = element;
    };
  };

  const titlePreviewRefs = useRef<HTMLDivElement[]>([]);
  const setTitlePreviewRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      titlePreviewRefs.current[index] = element;
    };
  };

  const descriptionRefs = useRef<HTMLDivElement[]>([]);
  const setDescriptionRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      descriptionRefs.current[index] = element;
    };
  };

  const minimisedFilterRefs = useRef<HTMLDivElement[]>([]);
  const setMinimisedFilterRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      minimisedFilterRefs.current[index] = element;
    };
  };

  const mainTextAnimatorRefs = useRef<SplitTextWithAnimate[]>([]);
  const previewTextAnimatorRefs = useRef<SplitTextWithAnimate[]>([]);

  const currentItemAnimation = useRef<gsap.core.Timeline | null>(null);
  // const currentScrollAnimation = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(() => {
    //// CREATE SPLITTEXT ANIMATORS ////
    mainTextAnimatorRefs.current = titleRefs.current.map((item) => {
      const split = SplitTextAnimator(item, {
        type: "chars,lines",
        mask: "chars",
        charsClass: "char",
        autoSplit: true,
      });

      gsap.set(split.chars, { xPercent: -100, autoAlpha: 0 });

      return split;
    });

    previewTextAnimatorRefs.current = titlePreviewRefs.current.map((item) => {
      return SplitTextAnimator(item, {
        type: "chars,lines",
        mask: "chars",
        charsClass: "char",
        autoSplit: true,
      });
    });
    //// END CREATE SPLITTEXT ANIMATORS ////

    //// DEFAULT HERO ITEM SCROLLTRIGGER ////

    let currentScrollAnimation: gsap.core.Timeline | undefined;
    const initialItem = displayRef.current?.querySelector(".default-hero-item");

    ScrollTrigger.create({
      trigger: containerRef.current,
      scroller: window,
      start: "top top",
      end: "+=25%",
      markers: true,
      onEnter: () => {
        console.log("flip!", initialItem);
        if (!initialItem || !initialGridItemRef.current) return;
        currentScrollAnimation && currentScrollAnimation.kill();

        currentScrollAnimation = gsap.timeline();
        const itemState = Flip.getState(initialItem);
        initialGridItemRef.current.appendChild(initialItem);
        currentScrollAnimation?.add(
          Flip.from(itemState, {
            duration: 0.8,
            ease: "power4.inOut",
            absolute: true,
            simple: true,
            onComplete: () => {
              displayRef.current?.classList.add("pointer-events-none");
              gsap.set(initialItem, { zIndex: 10 });
            },
            onStart: () => {
              gsap.set(initialItem, { zIndex: 101 });
            },
          }),
          "<"
        );
      },
      onLeaveBack: () => {
        if (!initialItem) return;
        currentScrollAnimation && currentScrollAnimation.kill();
        const itemState = Flip.getState(initialItem);
        displayRef.current?.appendChild(initialItem);

        currentScrollAnimation = gsap.timeline();
        currentScrollAnimation?.add(
          Flip.from(itemState, {
            duration: 0.8,
            ease: "power4.inOut",
            absolute: true,
            simple: true,
            onComplete: () => {
              displayRef.current?.classList.toggle("pointer-events-none");
              setCurrentVideo(heroData.defaultVideo.id);
            },
            // onStart: () => {
            //   gsap.set(initialItem, { zIndex: 101 });
            // },
          }),
          "<"
        );
      },
    });
    //// END DEFAULT HERO ITEM SCROLLTRIGGER ////
  });

  const createAnimation = (
    action: "open" | "close",
    currentTarget: EventTarget & HTMLElement,
    itemIndex: number
  ) => {
    currentItemAnimation.current && currentItemAnimation.current.kill();

    // FLIP ANIMATION SETUP //
    const itemState = Flip.getState(currentTarget);

    if (action === "open") {
      displayRef.current?.appendChild(currentTarget);
      currentTarget.classList.add("open");
      displayRef.current?.classList.remove("pointer-events-none");
    }

    if (action === "close") {
      gsap.set(currentTarget, { zIndex: 100 });

      const originalGridElement = itemRefs.current[itemIndex];
      originalGridElement.appendChild(currentTarget);
      currentTarget.classList.remove("open");
      displayRef.current?.classList.add("pointer-events-none");
    }
    // END FLIP ANIMATION SETUP //

    // SPLITTEXT ANIMATION SETUP //
    if (
      !mainTextAnimatorRefs?.current[itemIndex].animate ||
      !previewTextAnimatorRefs?.current[itemIndex].animate
    )
      return;

    const mainTextAnimation = mainTextAnimatorRefs.current[itemIndex].animate(
      (self) => {
        return gsap.to(self.chars, {
          xPercent: action === "open" ? 0 : -100,
          autoAlpha: action === "open" ? 100 : 0,
          stagger: action === "close" ? 0.018 : { each: 0.018, from: "start" },
          ease: "power4.out",
        });
      }
    );

    if (!mainTextAnimation) return;

    const previewTextAnimation = previewTextAnimatorRefs.current[
      itemIndex
    ].animate((self) => {
      return gsap.to(self.chars, {
        xPercent: action === "open" ? -100 : 0,
        autoAlpha: action === "open" ? 0 : 100,
        stagger: action === "close" ? { each: 0.018, from: "end" } : 0.018,
        ease: "power4.out",
      });
    });

    if (!previewTextAnimation) return;
    // END SPLITTEXT ANIMATION SETUP //

    currentItemAnimation.current = gsap.timeline();

    if (action === "close") {
      currentItemAnimation.current.add(mainTextAnimation).to(
        descriptionRefs.current,
        {
          autoAlpha: 0,
          onComplete: () => {
            gsap.set(descriptionRefs.current, { display: "none" });
          },
        },
        "<"
      );
    } else {
      currentItemAnimation.current.add(previewTextAnimation);
    }

    currentItemAnimation.current.add(
      Flip.from(itemState, {
        duration: 0.8,
        absolute: true,
        simple: true,
        ease: "power4.inOut",

        onComplete: () => {
          if (action === "open") {
            // Get the index of the animating item
            const index = currentTarget.dataset.itemIndex;
            if (!index) return;

            // Find the string id of that video
            const videoId = heroData.services[parseInt(index)]?.video.id;
            setCurrentVideo(videoId);
          } else {
            setCurrentVideo(heroData.defaultVideo.id);
          }
        },
      }),
      "<"
    );

    if (action === "open") {
      currentItemAnimation.current.add(
        gsap.set(descriptionRefs.current[itemIndex], {
          display: "block",
          zIndex: 100,
        }),
        ">-=0.2"
      );
      currentItemAnimation.current
        .add(mainTextAnimation, "<")
        .to(descriptionRefs.current[itemIndex], { autoAlpha: 1 }, "<");
    } else {
      currentItemAnimation.current.add(previewTextAnimation);
    }
  };

  const handleClick = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    const currentTarget = e.currentTarget;
    const action = currentTarget.classList.contains("open") ? "close" : "open";
    const itemIndex = parseInt(currentTarget.dataset.itemIndex || "0");

    createAnimation(action, currentTarget, itemIndex);
  });

  return (
    <SectionGrid
      ref={containerRef}
      className={cn(
        `hero  relative h-full
            grid !grid-cols-6 !grid-rows-6 gap-6
          `,
        className
      )}
    >
      <div
        ref={displayRef}
        className={`display z-[101] absolute inset-0 overflow-hidden `}
      >
        <DefaultHeroItem ref={defaultItemRef}>
          <HlsVideo
            id={heroData.defaultVideo.id}
            url={heroData.defaultVideo.url}
            loop
            autoPlay
            className="rounded-xl border-[7px] border-border overflow-hidden object-cover"
          />
          <MinimisedFilter className="rounded-[4px] inset-[7px]" />
        </DefaultHeroItem>
      </div>

      <div
        ref={initialGridItemRef}
        className={cn(
          "relative z-[100] col-start-1 col-span-2 row-start-1 row-span-2 rounded-xl bg-slate-200"
        )}
      >
        {/* Initially empty */}
      </div>

      {heroItems.map((item) => {
        return (
          <div
            key={item.id}
            ref={setItemRefs(item.id)}
            className={cn(
              "grid-item relative rounded-xl",
              item.wrapper.className
            )}
          >
            <HeroItem2
              dataItemIndex={`${item.id}`}
              titlePreviewRef={setTitlePreviewRefs(item.id)}
              titleRef={setTitleRefs(item.id)}
              descriptionRef={setDescriptionRefs(item.id)}
              onClick={handleClick}
              title={heroData.services[item.id].title}
              description={heroData.services[item.id].description}
              position={item.position as Position}
              className={cn("overflow-hidden", item.className)}
            >
              <HlsVideo
                key={heroData.services[item.id].video.id}
                id={heroData.services[item.id].video.id}
                url={heroData.services[item.id].video.url}
                loop
                placeholder={heroData.services[item.id].video.placeholder}
                startTime={heroData.services[item.id].video.startTime}
                className="rounded-xl border-[7px] border-border overflow-hidden object-cover"
              />
              <MinimisedFilter
                className="rounded-[4px] inset-[7px]"
                ref={setMinimisedFilterRefs(item.id)}
              />
            </HeroItem2>
          </div>
        );
      })}
    </SectionGrid>
  );
};
