"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { splitText } from "@/lib/utils";
import { FilmIcon } from "@/lib/svg";
import { SectionGrid } from "./SectionGrid";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      if (!paragraphRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom+=50% bottom",
          scrub: 2,
        },
      });

      tl.fromTo(
        ".film-icon-container",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3 }
      )
        .to(
          ".film-icon",
          {
            xPercent: 100,
            yPercent: -18,
            ease: "none",
          },
          "<"
        )
        .fromTo(
          ".image",
          {
            clipPath: "inset(100% 0% 0% 0%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
          },
          "<"
        )
        .add(
          splitText(paragraphRef.current, {
            type: "lines",
            linesClass: "line",
            autoSplit: true,
            onSplit(self: SplitText) {
              return gsap.to(self.lines, {
                backgroundPositionY: 0,
                stagger: 0.6,
                ease: "none",
                scrollTrigger: {
                  trigger: containerRef.current,
                  start: "top top",
                  end: "bottom+=50% bottom",
                  scrub: 1,
                  // markers: true,
                },
              });
            },
          })
        );
    },
    { scope: containerRef }
  );

  return (
    // <div
    //   ref={containerRef}
    //   className="grid grid-cols-6 items-center border border-blue-400 h-full"
    // >
    <SectionGrid ref={containerRef} className="h-full items-center">
      {/* <div className="film-icon-container w-32 col-start-1 col-span-full row-start-1 row-span-1 rotate-[45deg]">
        <FilmIcon className=" text-slate-100" />
        <FilmIcon className=" text-slate-100" />
      </div> */}
      <div className="text col-start-2 col-span-2 row-start-1 row-span-5 text-4xl">
        <p
          ref={(el) => {
            if (el) paragraphRef.current[0] = el;
          }}
          className=""
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          reiciendis doloribus porro fugiat minima unde totam mollitia aut
          exercitationem vel!
        </p>
        <p
          ref={(el) => {
            if (el) paragraphRef.current[1] = el;
          }}
          className=""
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
          reiciendis doloribus porro fugiat minima unde totam mollitia aut
          exercitationem vel!
        </p>
      </div>
      <div className="image h-5/6 col-start-5 col-span-1 row-start-1 row-span-5 bg-slate-200 rounded-xl"></div>
    </SectionGrid>
    // </div>
  );
};
