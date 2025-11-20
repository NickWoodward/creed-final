"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import {
  cn,
  splitText,
  SplitTextAnimator,
  SplitTextWithAnimate,
} from "@/lib/utils";
import { SectionGrid } from "./SectionGrid";

import { heroData } from "@/lib/content";
import { useVideoControls } from "@/contexts/VideoControlProvider";
import { HeroItem } from "./HeroItem";
import { HlsVideo } from "./HlsVideo";
import { Logo } from "./Logo";
import { MinimisedFilter } from "./MinimisedFilter";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip);

export const Hero = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const mainItemRef = useRef<HTMLDivElement>(null);

  const currentItemAnimation = useRef<gsap.core.Timeline | null>(null);

  const itemRefs = useRef<HTMLDivElement[]>([]);
  const setItemRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      itemRefs.current[index] = element;
    };
  };

  //// REFS FOR TEXT ANIMATION ////
  const titlePreviewRefs = useRef<HTMLDivElement[]>([]);
  const setTitlePreviewRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      titlePreviewRefs.current[index] = element;
    };
  };
  const titleRefs = useRef<HTMLDivElement[]>([]);
  const setTitleRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      titleRefs.current[index] = element;
    };
  };
  const descriptionRefs = useRef<HTMLDivElement[]>([]);
  const setDescriptionRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      descriptionRefs.current[index] = element;
    };
  };
  //// END REFS FOR TEXT ANIMATION ////

  //// REFS FOR THE SPLIT TEXT ANIMATORS ////
  // These store extended split text animations that handle resplitting and conflicting animations more gracefully
  // They also allow for the autosplit tween to be added to a timeline
  const titleAnimatorRefs = useRef<SplitTextWithAnimate[]>([]);
  const titlePreviewAnimatorRefs = useRef<SplitTextWithAnimate[]>([]);
  //// END REFS FOR THE SPLIT TEXT ANIMATORS ////

  const minimisedFilterRefs = useRef<HTMLDivElement[]>([]);
  const setMinimisedFilterRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      minimisedFilterRefs.current[index] = element;
    };
  };
  // const splitItemTitlesRef = useRef<SplitTextWithAnimate[]>([]);

  const { setCurrentVideo, getCurrentVideo, playVideo, pauseVideo, videosRef } =
    useVideoControls();

  const { contextSafe } = useGSAP(
    () => {
      //// ITEM TEXT SPLITTING ////
      titleAnimatorRefs.current = titleRefs.current.map(item => {
        const split = SplitTextAnimator(item, {
          type: "chars,lines",
          mask: "chars",
          charsClass: "char",
          autoSplit: true,
        });
        console.log({item})
        gsap.set(split.chars, {xPercent:-100, autoAlpha:0});

        return split;
      });

      // titlePreviewAnimatorRefs.current = titlePreviewRefs.current.map(item => {
      //   return SplitTextAnimator(item, {
      //     type: "chars,lines",
      //     mask: "chars",
      //     charsClass: "char",
      //     autoSplit: true,
      //   });
      // });
      //// END ITEM TEXT SPLITTING ////


      // const splitMainLogo = SplitTextAnimator(".logo-main .logo-text", {
      //   type: "chars,lines",
      //   mask: "chars",
      //   charsClass: "char",
      //   autoSplit: true,
      // });

      // // Split and hide the item titles (not the previews)
      // splitItemTitlesRef.current = titleRefs.current.map((item) => {
      //   const split = SplitTextAnimator(item, {
      //     type: "chars,lines",
      //     mask: "chars",
      //     charsClass: "char",
      //     autoSplit: true,
      //   });
      //   gsap.set(split.chars, { xPercent: -100, autoAlpha: 0 });

      //   return split;
      // });

      // const splitGridLogo = SplitTextAnimator(".logo-grid .logo-text", {
      //   type: "chars,lines",
      //   mask: "chars",
      //   charsClass: "char",
      //   autoSplit: true,
      // });

      let currentContentAnimation: gsap.core.Timeline | undefined;

      const initialItem = displayRef.current?.querySelector(".initial-item");

      ScrollTrigger.create({
        trigger: containerRef.current,
        scroller: window,
        start: "top top",
        end: "+=25%",
        onEnter: () => {
          if (!initialItem) return;
          currentContentAnimation && currentContentAnimation.kill();

          const minimisedFilter = minimisedFilterRefs.current[0];

          // const mainTextAnimation = splitMainLogo.animate?.((self) => {
          //   return gsap.to(self.chars, {
          //     xPercent: -100,
          //     autoAlpha: 0,
          //     stagger: 0.03,
          //     ease: "power4.out",
          //   });
          // });

          // const gridTextAnimation = splitGridLogo.animate?.((self) => {
          //   return gsap.to(self.chars, {
          //     xPercent: 0,
          //     autoAlpha: 1,
          //     stagger: 0.03,
          //     ease: "power4.out",
          //   });
          // });

          const itemState = Flip.getState(initialItem);
          itemRefs.current[0].appendChild(initialItem);

          currentContentAnimation = gsap.timeline().to(".logo-main svg", {
            autoAlpha: 0,
            duration: 0.3,
          });
          // if (mainTextAnimation) {
          //   currentContentAnimation.add(mainTextAnimation, "<");
          // }
          currentContentAnimation
            .add(
              Flip.from(itemState, {
                duration: 0.6,
                ease: "power4.inOut",
                absolute: true,
                simple: true,
                onComplete: () => {
                  displayRef.current?.classList.add("pointer-events-none");
                },
              }),
              "<"
            )
            .to(minimisedFilter, { autoAlpha: 1 }, ">-=0.2");
          currentContentAnimation.to(".logo-grid", { autoAlpha: 1 });

          // if (gridTextAnimation)
          //   currentContentAnimation.add(gridTextAnimation, "<");

          // .to([".grid-item-1-overlay", ".text-logo"], { autoAlpha: 1 });
        },
        onLeaveBack: () => {
          if (!initialItem) return;
          currentContentAnimation && currentContentAnimation.kill();

          const minimisedFilter =
            initialItem.querySelector(".minimised-filter");

          const itemState = Flip.getState(initialItem);
          displayRef.current?.appendChild(initialItem);

          // const mainTextAnimation = splitMainLogo.animate?.((self) => {
          //   return gsap.to(self.chars, {
          //     xPercent: 0,
          //     autoAlpha: 100,
          //     stagger: 0.03,
          //     ease: "power4.out",
          //   });
          // });

          // const gridTextAnimation = splitGridLogo.animate?.((self) => {
          //   return gsap.to(self.chars, {
          //     xPercent: -100,
          //     autoAlpha: 0,
          //     stagger: 0.03,
          //     ease: "power4.out",
          //   });
          // });

          currentContentAnimation = gsap.timeline();
          currentContentAnimation.to(".logo-grid", {
            autoAlpha: 0,
            duration: 1.8,
          });
          // if (gridTextAnimation)
          //   currentContentAnimation.add(gridTextAnimation, "<");

          currentContentAnimation
            .add(
              Flip.from(itemState, {
                duration: 0.6,
                ease: "power4.inOut",
                absolute: true,
                simple: true,
              })
            )
            .to(minimisedFilter, { autoAlpha: 0 }, ">-=0.2")
            .to(
              ".logo-main svg",
              {
                autoAlpha: 1,
                duration: 0.3,
              },
              "<"
            );
          // if (mainTextAnimation) {
          //   currentContentAnimation.add(mainTextAnimation, "<+=3");
          // }
        },
      });
    },
    { scope: containerRef }
  );

  const createItemFocusAnimation = (action: "open"|"close", currentTarget: EventTarget & HTMLElement, itemIndex: number) => {
    currentItemAnimation.current && currentItemAnimation.current.kill();
    console.log({itemIndex})

    //// FLIP ANIMATION SETUP ////
    gsap.set(currentTarget, { zIndex: 100 });

    const itemState = Flip.getState(currentTarget);
    
    if(action === "open") {
      displayRef.current?.appendChild(currentTarget);
      currentTarget.classList.add("open");
      displayRef.current?.classList.remove("pointer-events-none");
    }

    if(action === "close") {
      // gsap.set(currentTarget, { zIndex: 100 });

      const originalGridElement = itemRefs.current[itemIndex];
      originalGridElement.appendChild(currentTarget);
      currentTarget.classList.remove("open");
      displayRef.current?.classList.add("pointer-events-none");
    }
    //// END FLIP ANIMATION SETUP ////

    //// SPLITTEXT ANIMATION SETUP ////
    // The text ref indexes are off by 1 because the 1st item is the main image that doesn't have a text animation
    const contentIndex = itemIndex-1;      
    if(!titleAnimatorRefs?.current[contentIndex].animate) return;

    const titleAnimation = titleAnimatorRefs.current[contentIndex].animate(
      (self) => {
        return gsap.to(self.chars, {
          xPercent: action === "open"? 0 : -100,
          autoAlpha: action === "open"? 1 : 0,
          stagger: 0.02,
          ease: "power4.out",
          onStart: () => console.log("onStart - autoAlpha:", gsap.getProperty(self.chars[0], "autoAlpha"))   
        })
      }
    );

    // const titlePreviewAnimation = titlePreviewAnimatorRefs.current[contentIndex].animate(
    //   (self) => {
    //     return gsap.to(self.chars, {
    //       xPercent: action === "open"? -100 : 0,
    //       autoAlpha: action === "open"? 0 : 1,
    //       stagger: 0.02,
    //       ease: "power4.out",
    //       onStart: () => console.log("onStart - autoAlpha:", gsap.getProperty(self.chars[0], "autoAlpha"))   
    //     })
    //   }
    // );
    //// END SPLITTEXT ANIMATION SETUP ////

    if(!titleAnimation) return;

    currentItemAnimation.current = gsap.timeline();

    if(action === "close") {
      currentItemAnimation.current.add(titleAnimation);
    } else {
      // currentItemAnimation.current.add(titlePreviewAnimation);
    }

    currentItemAnimation.current.add(Flip.from(itemState, {
      duration:0.4,
      ease: "power1.inOut",
      absolute: true,
      simple: true,
      onComplete: () => {
        if(action==="close") gsap.set(currentTarget,{zIndex: 10})
      }
    }), "<+=0.18");

    if(action === "open") {
      currentItemAnimation.current.add(titleAnimation);
    } else {
      // currentItemAnimation.current.add(titlePreviewAnimation);
    }
  }

  const handleClick = contextSafe((e: React.MouseEvent<HTMLElement>) => {
    const currentTarget = e.currentTarget;
    const action = currentTarget.classList.contains("open")? "close":"open";
    const itemIndex = parseInt(currentTarget.dataset.itemIndex || "0");
    console.log(itemIndex)

    createItemFocusAnimation(action, currentTarget, itemIndex);

  });

  //// HERO IMAGE FLIP ////
  // const flipItem = contextSafe((e: React.MouseEvent<HTMLElement>) => {
  //   console.log("flip");
  //   const currentTarget = e.currentTarget;
  //   const itemIndex = parseInt(currentTarget.dataset.itemIndex || "0");
  //   const titlePreview = titlePreviewRefs.current[itemIndex - 1];
  //   const title = titleRefs.current[itemIndex - 1];
  //   const description = descriptionRefs.current[itemIndex - 1];
  //   const minimisedFilter = minimisedFilterRefs.current[itemIndex];

  //   if (e.currentTarget.classList.contains("open")) {
  //     console.log("close");
  //     closeHeroItem(
  //       currentTarget,
  //       itemIndex,
  //       titlePreview,
  //       title,
  //       description,
  //       minimisedFilter
  //     );
  //   } else {
  //     console.log("open");
  //     openHeroItem(
  //       currentTarget,
  //       itemIndex,
  //       titlePreview,
  //       title,
  //       description,
  //       minimisedFilter
  //     );
  //   }
  // });

  // const openHeroItem = (
  //   // e: React.MouseEvent<HTMLElement>,
  //   currentTarget: EventTarget & HTMLElement,
  //   itemIndex: number,
  //   titlePreview: HTMLDivElement,
  //   title: HTMLDivElement,
  //   description: HTMLDivElement,
  //   minimisedFilter: HTMLDivElement
  // ) => {
  //   // const currentTarget = e.currentTarget;
  //   // const minimisedFilter = currentTarget.querySelector(".minimised-filter");
  //   // const itemIndex = parseInt(currentTarget.dataset.itemIndex || "0");

  //   // const description = currentTarget.querySelector(".item-description");
  //   console.log("splitTitles", splitItemTitlesRef.current);

  //   const itemAnimation = splitItemTitlesRef.current[itemIndex - 1].animate?.(
  //     (self) => {
  //       return gsap.to(self.chars, {
  //         xPercent: 0,
  //         autoAlpha: 100,
  //         stagger: 0.03,
  //         ease: "power4.out",
  //       });
  //     }
  //   );

  //   if (!currentTarget || !displayRef.current) return;
  //   gsap.set(currentTarget, { zIndex: 100 });

  //   const itemState = Flip.getState(currentTarget);
  //   displayRef.current.appendChild(currentTarget);
  //   displayRef.current.classList.remove("pointer-events-none");
  //   currentTarget.classList.add("open");

  //   const tl = gsap
  //     .timeline()
  //     .to(minimisedFilter, { autoAlpha: 0 })
  //     // .to(titlePreview, { autoAlpha: 0, duration: 0.2 }, "<")
  //     .add(
  //       Flip.from(itemState, {
  //         duration: 0.3,
  //         ease: "power1.inOut",
  //         absolute: true,
  //         simple: true,
  //         onComplete: () => {
  //           // Get the index of the animating item
  //           const index = currentTarget.dataset.itemIndex;
  //           if (!index) return;

  //           // Find the string id of that video
  //           const videoId = heroData["videos"][parseInt(index)]?.id;
  //           setCurrentVideo(videoId);
  //         },
  //       }),
  //       "<"
  //     );
  //   if (itemAnimation) tl.add(itemAnimation);
  //   // tl.set(description, { height: "auto" }).to(description, { autoAlpha: 1 });
  //   // .to(
  //   //   description,
  //   //   { height: "auto", duration: 0.6, ease: "power2.out" },
  //   //   ">"
  //   // );
  // };

  // const closeHeroItem = (
  //   // e: React.MouseEvent<HTMLElement>,
  //   currentTarget: EventTarget & HTMLElement,
  //   itemIndex: number,
  //   titlePreview: HTMLDivElement,
  //   title: HTMLDivElement,
  //   description: HTMLDivElement,
  //   minimisedFilter: HTMLDivElement
  // ) => {
  //   // const item = e.currentTarget;
  //   // const minimisedFilter = item.querySelector(".minimised-filter");
  //   // const itemTitle = item.querySelector(".item-title");
  //   // const description = item.querySelector(".item-description");
  //   if (!currentTarget || !currentTarget.parentElement || !displayRef.current)
  //     return;
  //   gsap.set(currentTarget, { zIndex: 100 });

  //   const itemState = Flip.getState(currentTarget);
  //   const originalGridIndex = currentTarget.dataset.itemIndex;
  //   const originalGridElement =
  //     itemRefs.current[parseInt(originalGridIndex || "0")];

  //   originalGridElement.append(currentTarget);
  //   displayRef.current.classList.add("pointer-events-none");
  //   currentTarget.classList.remove("open");

  //   gsap
  //     .timeline()
  //     // .to(description, {
  //     //   height: "0",
  //     //   duration: 0.1,
  //     //   ease: "power2.in",
  //     // })

  //     .add(
  //       Flip.from(itemState, {
  //         duration: 0.3,
  //         ease: "power1.inOut",
  //         absolute: true,
  //         simple: true,
  //         onStart: () => {
  //           setCurrentVideo("hero-video-1");
  //         },
  //         onComplete: () => {
  //           gsap.set(currentTarget, { zIndex: 10 });
  //         },
  //       }),
  //       ">"
  //     )
  //     .to(minimisedFilter, { autoAlpha: 1 }, "<");
  // };

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
      <div className="hero-content pointer-events-none absolute inset-0 text-white flex items-center md:mx-0   pl-[5%] xxs:pl-[7%] md:pl-[10%] z-[102]">
        <Logo size="hero" className="logo-main text-logo" />
        <div className="hero-description mt-3 lg:mt-5 ml-3 sm:ml-4 text-font-reversed text-xl xxs:text-2xl lg:text-3xl  font-[320] max-w-[88%] xs:max-w-[86%] sm:max-w-[500px] lg:max-w-[650px]">
          {heroData["description"]}
        </div>
      </div>

      {/* Display Overlay */}
      <div
        ref={displayRef}
        className={`display absolute inset-0 overflow-hidden z-[101]`}
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
          <MinimisedFilter ref={setMinimisedFilterRefs(0)} />
        </HeroItem>
      </div>

      {/* Grid Elements */}
      <div
        ref={setItemRefs(0)}
        className="grid-item relative col-start-1 col-span-2 row-start-1 row-span-2 rounded-xl z-[100]"
      >
        {/* Empty to start off */}
        <div className="absolute inset-0 flex items-center justify-center text-white z-[300]">
          <Logo size="md" className="logo-grid -translate-x-[8%] z-40" />
        </div>
      </div>

      <div
        ref={setItemRefs(1)}
        className="grid-item relative col-start-3 col-span-full row-start-1 row-span-3 flex justify-center items-center"
      >
        <HeroItem
          dataItemIndex="1"
          titlePreviewRef={setTitlePreviewRefs(0)}
          titleRef={setTitleRefs(0)}
          descriptionRef={setDescriptionRefs(0)}
          onClick={(e) => handleClick(e)}
          title={heroData["services"][0].title}
          description={heroData["services"][0].description}
          className=""
        >
          <HlsVideo
            key={heroData["videos"][1].id}
            id={heroData["videos"][1].id}
            url={heroData["videos"][1].url}
            loop
            placeholder={heroData["videos"][1].placeholder}
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
          <MinimisedFilter ref={setMinimisedFilterRefs(1)} />
        </HeroItem>
      </div>

      <div
        ref={setItemRefs(2)}
        className="grid-item relative col-start-1 col-span-2 row-start-3 row-span-full flex justify-center items-center"
      >
        <HeroItem
          dataItemIndex="2"
          titlePreviewRef={setTitlePreviewRefs(1)}
          titleRef={setTitleRefs(1)}
          descriptionRef={setDescriptionRefs(1)}
          onClick={(e) => handleClick(e)}
          title={heroData["services"][1].title}
          description={heroData["services"][1].description}
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
          <MinimisedFilter ref={setMinimisedFilterRefs(2)} />
        </HeroItem>
      </div>

      <div
        ref={setItemRefs(3)}
        className="grid-item col-start-3 col-span-full row-start-4 row-span-full flex justify-center items-center"
      >
        <HeroItem
          dataItemIndex="3"
          titlePreviewRef={setTitlePreviewRefs(2)}
          titleRef={setTitleRefs(2)}
          descriptionRef={setDescriptionRefs(2)}
          onClick={(e) => handleClick(e)}
          title={heroData["services"][2].title}
          description={heroData["services"][2].description}
          className=""
        >
          <HlsVideo
            key={heroData["videos"][3].id}
            id={heroData["videos"][3].id}
            url={heroData["videos"][3].url}
            startTime={heroData["videos"][3].startTime}
            loop
            placeholder={heroData["videos"][3].placeholder}
            className="h-full col-start-1 col-span-full row-start-1 row-span-1 sm:h-full object-cover bg-slate-800"
          />
          <MinimisedFilter ref={setMinimisedFilterRefs(3)} />
        </HeroItem>
      </div>
    </SectionGrid>
  );
};
