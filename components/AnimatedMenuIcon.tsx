import { getBreakpoint } from "@/lib/breakpoints";
import { MenuIcon } from "@/lib/svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const AnimatedMenuIcon = ({ mode }: { mode: string }) => {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: `(max-width: ${getBreakpoint("md")})`,
        isDesktop: `(min-width: ${getBreakpoint("md")})`,
      },
      (context) => {
        const { isMobile } = context.conditions || {};

        if (!isMobile) return;

        if (mode === "trigger") console.log("trigger");
        else console.log("CLOSED");
      }
    );
  });
  return <MenuIcon />;
};
