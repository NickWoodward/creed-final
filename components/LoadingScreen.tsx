"use client";
import { CreedLogoCompact } from "@/lib/svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const LoadingScreen = ({ className }: { className: string }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const strip = wrapperRef.current?.querySelector(".strip");
    const upper = wrapperRef.current?.querySelector(".upper");
    const lower = wrapperRef.current?.querySelector(".lower");
    const logo = wrapperRef.current?.querySelector(".loading-logo");

    if (!strip || !upper || !lower || !logo) return;
    gsap
      .timeline({ defaults: { ease: "power4.inOut" } })
      .to(strip, {
        xPercent: 100,
        duration: 0.8,
        delay: 1,
      })
      .to(logo, { autoAlpha: 0 }, "<+=0.2")
      .to(upper, { yPercent: -100, duration: 0.6, ease: "power4.in" }, "<+=0.4")
      .to(lower, { yPercent: 100, duration: 0.6, ease: "power4.in" }, "<");
  });
  return (
    <div
      ref={wrapperRef}
      className={cn(
        "grid grid-rows-[1fr_2rem_1fr] h-screen bg-transparent pointer-events-none z-[200]",
        className
      )}
    >
      {/* <CreedLogoCompact /> */}
      <div className="upper relative bg-background-intro">
        <CreedLogoCompact className="text-primary absolute bottom-0 [clip-path:inset(0_0_calc(50%+1rem)_0)] left-1/2 translate-y-[calc(50%+1rem)] -translate-x-1/2 size-[300px] " />
        <CreedLogoCompact className="loading-logo text-primary absolute bottom-0  left-1/2 translate-y-[calc(50%+1rem)] -translate-x-1/2 size-[300px] z-30" />
      </div>
      <div className="strip bg-background-intro"></div>
      <div className="lower relative bg-background-intro">
        <CreedLogoCompact className="text-primary absolute [clip-path:inset(calc(50%+1rem)_0_0_0)] top-0 left-1/2 -translate-y-[calc(50%+1rem)] -translate-x-1/2 size-[300px]" />
      </div>
    </div>
  );
};
