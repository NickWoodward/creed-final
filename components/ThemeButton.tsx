"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Button } from "./ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

gsap.registerPlugin(useGSAP, MorphSVGPlugin);

export const ThemeButton = ({ className }: { className: string }) => {
  const { theme, setTheme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sunRaysRef = useRef<SVGPathElement>(null);
  const iconPathRef = useRef<SVGPathElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      const sunRays =
        sunRaysRef.current?.querySelectorAll<SVGPathElement>("path");
      if (!sunRays || !iconPathRef) return;
      if (theme === "dark") {
        gsap.set(sunRays, { autoAlpha: 1 });
        iconPathRef.current?.setAttribute("d", sunPath);
      } else {
        gsap.set(sunRays, { autoAlpha: 0 });
        iconPathRef.current?.setAttribute("d", moonPath);
      }
    },
    { scope: wrapperRef }
  );

  const sunPath =
    "M16,12 C16,14.20914 14.20914,16 12,16 9.79086,16 8,14.20914 8,12 8,9.79086 9.79086,8 12,8 14.20914,8 16,9.79086 16,12 z";
  const moonPath =
    "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401";

  const handleClick = contextSafe(() => {
    const sunRays = sunRaysRef.current?.querySelectorAll("path");
    if (!sunRays) return;

    if (theme === "dark") {
      gsap.killTweensOf(sunRays);
      gsap
        .timeline()
        .to(sunRays, {
          autoAlpha: 0,
          stagger: 0.03,
        })
        .to(
          iconPathRef.current,
          { morphSVG: moonPath, duration: 0.2 },
          "<+=0.2"
        )
        .to(
          iconPathRef.current,
          { scale: 0.95, transformOrigin: "center", duration: 0.3 },
          "<"
        )
        .to(
          iconPathRef.current,
          {
            rotation: "+=5",
            duration: 0.1,
            yoyo: true,
            repeat: 3,
            ease: "power2.inOut",
          },
          "<+=0.2"
        );
      setTheme("light");
    } else {
      gsap
        .timeline()
        .to(iconPathRef.current, {
          morphSVG: sunPath,
          duration: 0.1,
        })
        .to(
          iconPathRef.current,
          { scale: 1, ease: "back.out(4)", duration: 0.3 },
          "<"
        )
        .to(
          sunRays,
          {
            autoAlpha: 1,
            stagger: 0.04,
          },
          "<"
        );
      setTheme("dark");
    }
  });

  return (
    <div
      ref={wrapperRef}
      className={cn(" size-9", className)}
      onClick={handleClick}
    >
      <Button
        className="flex w-full h-full p-[1px] items-center justify-center "
        variant="ghost"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className=""
        >
          <path ref={iconPathRef} id="iconPath" d="" />
          <g ref={sunRaysRef} className="sun-rays">
            <path d="M12 2v2" />
            <path d="m19.07 4.93-1.41 1.41" />
            <path d="M20 12h2" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M12 20v2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="M2 12h2" />
            <path d="m4.93 4.93 1.41 1.41" />
          </g>
        </svg>
      </Button>
    </div>
  );
};
