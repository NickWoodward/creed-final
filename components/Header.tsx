"use client";

import Link from "next/link";
// import { MenuContextProvider } from "@/contexts/MenuContext";
// import { MenuBurger } from "./MenuBurger";
// import { Menu } from "./Menu";
import { Logo } from "./Logo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { MobileMenu } from "@/components/MobileMenu";
import { cn } from "@/lib/utils";
import { ThemeButton } from "@/components/ThemeButton";
import { getBreakpoint } from "@/lib/breakpoints";
import { gridClasses } from "./SectionGrid";

export const Header = ({
  className,
}: // mode = "trigger",
{
  className?: string;
  // mode?: "trigger" | "close";
}) => {
  gsap.registerPlugin(useGSAP, ScrollTrigger);

  const headerRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<HTMLButtonElement>(null);
  const menuTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const links = [
    { id: 1, href: "/todos", label: "About" },
    { id: 2, href: "/", label: "My Work" },
    { id: 3, href: "/docs", label: "Contact" },
  ];

  const { contextSafe } = useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: `(max-width: ${getBreakpoint("md")})`,
        isDesktop: `(min-width: ${getBreakpoint("md")})`,
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions || {};

        // SETUP MENU ANIMATION
        if (menuIconRef.current) {
          const paths = menuIconRef.current.querySelectorAll("path");
          console.log(paths);
          menuTimelineRef.current = gsap
            .timeline({})
            .to(paths[1], { autoAlpha: 0, xPercent: 60, duration: 0.15 })
            .to(
              [paths[0], paths[2]],
              {
                y: gsap.utils.wrap([6, -6]),
                duration: 0.3,
                ease: "power2.inOut",
              },
              "<+=0.1"
            )
            .to(
              [paths[0], paths[2]],
              {
                rotation: gsap.utils.wrap([45, -45]),
                transformOrigin: "center",
                duration: 0.3,
                ease: "power2.inOut",
              },
              ">-=0.1"
            )
            // .to(paths[0], { rotation: 45, duration: 0.4 }, 0)
            // .to(paths[2], { rotation: -45, duration: 0.4 }, 0)
            .reverse();
        }

        const navLogo =
          headerRef.current?.querySelector<HTMLDivElement>(".nav-logo");
        const themeWrapper =
          headerRef.current?.querySelector<HTMLDivElement>(".theme-wrapper");
        const menuIcon =
          headerRef.current?.querySelector<HTMLDivElement>(".menu-icon");

        // if (mode === "close") {
        //   gsap.fromTo(
        //     ".nav-logo",
        //     {
        //       autoAlpha: 0,
        //     },
        //     {
        //       autoAlpha: 1,
        //       ease: "power4.out",
        //       duration: 0.3,
        //     }
        //   );
        // }

        const headerTl = gsap.timeline({});
        headerTl.fromTo(
          ".nav-logo",
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            delay: context.conditions?.isMobile ? 0.3 : 0,
            ease: "power4.out",
            duration: 0.3,
          }
        );

        // Hero trigger - immediately on mobile, after hero on desktop
        ScrollTrigger.create({
          trigger: context.conditions?.isMobile
            ? ".hero-section"
            : ".second-section",
          start: context.conditions?.isMobile
            ? () => `top+=${Math.round(window.innerHeight / 2)}px top`
            : "top-=120px top",
          // start: `top${
          //   context.conditions?.isMobile ? "+=500px" : "-=120px"
          // }px top`,
          end: context.conditions?.isMobile ? "" : "top+=100px top-=80px",
          animation: headerTl,
          // markers: true,
          toggleActions: "play play none reverse",
          refreshPriority: -1,
        });

        // if (isDesktop) {
        //   const secondTl = gsap.timeline({ paused: true });
        //   secondTl.fromTo(
        //     ".header",
        //     {
        //       // xPercent: 100,
        //       autoAlpha: 0.9,
        //     },
        //     {
        //       // xPercent: 0,
        //       autoAlpha: 0,
        //       ease: "power4.out",
        //       duration: 0.3,
        //     }
        //   );
        //   ScrollTrigger.create({
        //     trigger: ".cards-section",
        //     start: `top-=120px top`,
        //     end: "top+=100px top-=80px",
        //     animation: secondTl,
        //     // markers: true,
        //     toggleActions: "play play reverse reverse",
        //     refreshPriority: -1,
        //   });
        // }
      }
    );
  });

  const handleMenuClick = contextSafe(() => {
    if (!menuTimelineRef.current) return;

    // if < trigger point, reverse, otherwise do nothing.

    menuTimelineRef.current.reversed(!menuTimelineRef.current.reversed());
  });

  return (
    <header
      ref={headerRef}
      className={cn(
        `header col-start-1 col-span-full 
        h-[40px] 
        self-center flex items-center justify-between  text-white z-[999]
        rounded-xl `,
        className
      )}
    >
      {/* <div className="header-bg absolute scale-y-110 rounded-xl bg-background   inset-0 "></div> */}
      <Link href="/" className="z-40">
        <Logo
          size="xs"
          className="nav-logo invisible opacity-0 h-[40px] border-[3px] border-transparent pr-1 bg-icon shadow-xl rounded-full rounded-r-lg text-font-header -translate-x-[3px]"
        />
      </Link>
      <nav className="hidden invisible opacity-0  z-30">
        <ul className="flex items-center gap-x-4  text-primary">
          {links.map((link) => {
            return (
              <li key={link.id}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mobile-nav-wrapper bg-icon rounded flex items-center h-full gap-x-3.5 px-1 text-font-header ml-auto z-30">
        <ThemeButton className="h-full" />
        <MobileMenu
          menuTriggerRef={menuIconRef}
          handleClick={handleMenuClick}
          // mode={mode}
          className="flex items-center justify-center h-full "
        />
      </div>
      {/* <MenuContextProvider>
        <MenuBurger className="xs:hidden" />
        <Menu />
      </MenuContextProvider> */}
    </header>
  );
};
