"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Pinned = ({
  className,
  start = "top top",
  end = "+=25%",
  pin = true,
  pinSpacing = true,
  markers = false,
  children,
}: {
  className?: string;
  start?: string;
  end?: string;
  pin?: boolean;
  pinSpacing?: boolean;
  markers?: boolean;
  children: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start,
        end,
        pin,
        pinSpacing,
        markers,
      });
    },
    { scope: containerRef }
  );

  return (
    <div className={cn("", className)} ref={containerRef}>
      {children}
    </div>
  );
};
