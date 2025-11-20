"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn, SplitTextAnimator, SplitTextWithAnimate } from "@/lib/utils";
import { HeroItem } from "./HeroItem";
import { heroData } from "@/lib/content";
import { HeroItem2 } from "./HeroItem2";
import { HlsVideo } from "./HlsVideo";
import Image from "next/image";
import { MinimisedFilter } from "./MinimisedFilter";
import { SectionGrid } from "./SectionGrid";

gsap.registerPlugin(useGSAP, Flip);

const heroItems = [
  // { id: 0, className: "bg-teal-300", wrapper: { className: "col-start-1 col-span-2 row-start-1 row-span-2" }, content: "Item 1", preview: "Preview 1" },
  {
    id: 0,
    className: "bg-violet-300",
    wrapper: { className: "col-start-3 col-span-full row-start-1 row-span-3" },
  },
  {
    id: 1,
    className: "bg-sky-300",
    wrapper: { className: "col-start-1 col-span-2 row-start-3 row-span-full" },
  },
  {
    id: 2,
    className: "bg-orange-300",
    wrapper: {
      className: "col-start-3 col-span-full row-start-4 row-span-full",
    },
  },
];

export const Hero2 = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

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

  const currentAnimation = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(() => {
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
  });

  const createAnimation = (
    action: "open" | "close",
    currentTarget: EventTarget & HTMLElement,
    itemIndex: number
  ) => {
    currentAnimation.current && currentAnimation.current.kill();

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
          stagger: action === "close" ? 0.02 : { each: 0.02, from: "end" },
          ease: "power4.out",
          onStart: () =>
            console.log(
              "onStart - autoAlpha:",
              gsap.getProperty(self.chars[0], "autoAlpha")
            ),
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
        stagger: action === "close" ? { each: 0.02, from: "end" } : 0.02,
        ease: "power4.out",
      });
    });

    if (!previewTextAnimation) return;
    // END SPLITTEXT ANIMATION SETUP //

    currentAnimation.current = gsap.timeline();

    if (action === "close") {
      currentAnimation.current.add(mainTextAnimation);
    } else {
      currentAnimation.current.add(previewTextAnimation);
    }

    currentAnimation.current.add(
      Flip.from(itemState, {
        duration: 0.4,
        ease: "power1.inOut",
        absolute: true,
        simple: true,
      }),
      "<+=0.18"
    );

    if (action === "open") {
      currentAnimation.current.add(mainTextAnimation);
    } else {
      currentAnimation.current.add(previewTextAnimation);
    }
  };

  const handleClick = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    const currentTarget = e.currentTarget;
    const action = currentTarget.classList.contains("open") ? "close" : "open";
    const itemIndex = parseInt(currentTarget.dataset.itemIndex || "0");

    createAnimation(action, currentTarget, itemIndex);
  });

  return (
    //  <div className="hero relative h-screen
    //         grid grid-cols-6 grid-rows-6 gap-6 p-[var(--card-inset)]">
    <SectionGrid
      ref={containerRef}
      className={cn(
        `hero relative h-full
            grid !grid-cols-6 !grid-rows-6 gap-6
          `,
        className
      )}
    >
      <div
        ref={displayRef}
        className={`display z-[101] absolute inset-0 overflow-hidden pointer-events-none`}
      ></div>

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
              className={cn("", item.className)}
            >
              <HlsVideo
                key={heroData.services[item.id].video.id}
                id={heroData.services[item.id].video.id}
                url={heroData.services[item.id].video.url}
                loop
                placeholder={heroData.services[item.id].video.placeholder}
                className="rounded-xl overflow-hidden object-cover"
              />
              <MinimisedFilter
                className="rounded-xl"
                ref={setMinimisedFilterRefs(item.id)}
              />
            </HeroItem2>
          </div>
        );
      })}
      {/* </div> */}
    </SectionGrid>
  );
};
