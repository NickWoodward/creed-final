"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Pinned } from "./Pinned";
import { cn, splitText } from "@/lib/utils";

const slides = [
  {
    id: 0,
    title: "Slide 1",
    classes: "col-start-1 row-start-1",
  },
  {
    id: 1,
    title: "Slide 2",
  },
  {
    id: 2,
    title: "Slide 3",
  },
];

export const SlidingCards = ({ className }: { className: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);

  const setTextRefs = (index: number) => {
    return (element: HTMLDivElement) => {
      textRefs.current[index] = element;
    };
  };

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLDivElement>(".sliding-item");

      items.forEach((item: HTMLDivElement, index: number) => {
        const tl = gsap.timeline({});

        const first = index === 0;
        const last = index === items.length - 1;
        if (first) {
          // Set the initial scale of the inner item
          const inner = item.querySelector(".inner");
          tl.set(inner, { scale: 0, autoAlpha: 0 });

          // Inner item animation
          tl.to(inner, {
            scale: 1,
            autoAlpha: 1,
            transformOrigin: "center center",
            ease: "none",
            onEnter: () => console.log("enter"),
          });

          splitText(textRefs.current[0], {
            type: "chars",
            mask: "chars",
            charsClass: "char",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.chars, {
                delay: 0.4,
                // autoAlpha: 100,
                y: 100,
                stagger: 0.01,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "bottom top",
                  end: "bottom+=200% top",
                  // scrub: 2,
                  // markers: true,
                  toggleActions: "play reverse play reverse",
                },
              });
            },
          });
        } else {
          const prev = items[index - 1];

          tl.to(prev, {
            scale: 0,
          });
          splitText(textRefs.current[index], {
            type: "chars",
            mask: "chars",
            charsClass: "char",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.chars, {
                // autoAlpha: 100,
                y: 100,
                stagger: 0.01,
                ease: "none",
                scrollTrigger: {
                  trigger: item,
                  start: "top top",
                  end: "bottom+=100% top",
                  // scrub: 2,
                  // markers: true,
                  toggleActions: "play reverse play reverse",
                },
              });
            },
          });
        }

        ScrollTrigger.create({
          trigger: item,
          start: first ? "top top" : "top bottom",
          end: `+=100%`,
          // markers: true,
          animation: tl,
          scrub: 1,
          // onEnter: () => console.log("Enter"),
          // onEnterBack: () => console.log("onEnterBack"),
          // onLeave: () => console.log("onLeave"),
          // onLeaveBack: () => console.log("onLeaveBack")
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={cn("grid", className)}>
      {/* <Pinned end="+=100%" >
        <SlideMask />
      </Pinned> */}
      {/* <Pinned end="+=100%" >
        <SlideBorder />
      </Pinned> */}
      {slides.map((slide, index) => {
        return (
          <Pinned
            key={slide.id}
            pin={true}
            pinSpacing={false}
            end={`max`}
            className={cn(index === 0 ? `mb-[300vh]` : "mb-[200vh]")}
          >
            <div
              id={`${slide.id}`}
              className={cn("sliding-item flex h-screen  py-12", slide.classes)}
            >
              <div
                className={cn(
                  index === 0 ? "bg-slate-300" : "bg-slate-400",
                  "content inner flex items-center justify-center w-full h-full "
                )}
              >
                <div ref={setTextRefs(index)} className="text text-5xl">
                  {slide.title}
                </div>
              </div>
            </div>
          </Pinned>
        );
      })}
    </div>
  );
};

const SlideMask = () => {
  return (
    <div className="sliding-item [border-width:var(--inset)] h-screen col-start-1 row-start-1"></div>
  );
};

const SlideBorder = () => {
  return (
    <div className="sliding-item border h-screen col-start-1 row-start-1"></div>
  );
};
