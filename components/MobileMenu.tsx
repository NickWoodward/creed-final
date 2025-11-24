import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Logo } from "./Logo";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RefObject, useRef, useState } from "react";
// import { scrollToHash } from "@/lib/utils";
import { cn, getSamePageAnchor } from "@/lib/utils";
import { SectionGrid } from "./SectionGrid";
import { Button } from "./ui/button";
import { Header } from "./Header";
import { AnimatedMenuIcon } from "@/components/AnimatedMenuIcon";
import { FooterLogo } from "@/components/FooterLogo";

export const MobileMenu = ({
  className,
  menuTriggerRef,
  handleClick,
}: // mode = "trigger",
{
  className: string;
  menuTriggerRef: RefObject<HTMLButtonElement | null>;
  handleClick: () => void;
  // mode?: "close" | "trigger";
}) => {
  const [open, setOpen] = useState(false);
  // const activeMenuItem = useStore($menuItemActive);

  const menuRef = useRef<HTMLDivElement>(null);

  // const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   const link = e.currentTarget;
  //   const hash = getSamePageAnchor(link);

  //   const idxAttr = link.dataset.menuIndex;
  //   if (idxAttr) {
  //     $menuItemActive.set(Number(idxAttr));
  //   }

  //   if (hash) {
  //     setOpen(false);
  //     scrollToHash(hash, e.nativeEvent);
  //   }
  // };

  const { contextSafe } = useGSAP({ scope: menuRef });

  const handleOpenChange = () => {
    handleClick();
    setOpen(() => !open);
  };

  const handleOpenAutoFocus = contextSafe(() => {
    if (!menuRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".menu-item", {
        autoAlpha: 0,
        duration: 0.5,
        xPercent: -20,
        stagger: 0.15,
        delay: 0.15,
        onComplete: () => ctx.kill(),
      });
    });
  });

  // if (mode === "close") {
  //   return (
  //     <DialogClose className={cn("menu-icon shadow-xl w-[40px]", className)}>
  //       <AnimatedMenuIcon mode="close" />
  //     </DialogClose>
  //   );
  // }

  return (
    <Dialog modal={false} open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        ref={menuTriggerRef}
        className={cn(
          "menu-icon focus:ring-primary focus:outline-none  ",
          className
        )}
      >
        {/* <Button
          className="flex w-full h-full items-center justify-center p-1.5 text-secondary-dark"
          variant="ghost"
        ></Button> */}
        <AnimatedMenuIcon mode="trigger" />
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={handleOpenAutoFocus}
        ref={menuRef}
        className=" bg-background p-[var(--card-inset)]  h-screen max-w-full z-[100]"
      >
        {/* <VisuallyHidden.Root> */}
        <DialogTitle>Menu</DialogTitle>
        {/* </VisuallyHidden.Root> */}
        {/* <VisuallyHidden.Root> */}
        <DialogDescription>Menu</DialogDescription>
        {/* </VisuallyHidden.Root> */}
        <SectionGrid
          className="grid-rows-[1fr_auto_1fr]  w-full  rounded-2xl shadow-2xl  border-[5px] border-border "
          // grid="md"
        >
          <ul className="flex flex-col justify-center col-start-2 col-span-3 row-start-2 row-span-1 -translate-y-[4%] gap-8 mx-auto font-medium text-4xl text-font">
            <li className={`menu-item `}>
              <a
                href="/test#hero"
                data-menu-index="1"
                // onClick={handleClick}
                // className={`border-b-4 ${activeMenuItem === 1 ? "border-primary" : "border-transparent"}`}
              >
                About
              </a>
            </li>
            <li className={`menu-item `}>
              <a
                href="/"
                data-menu-index="2"
                // onClick={handleClick}
                // className={`border-b-4 ${activeMenuItem === 2 ? "border-primary" : "border-transparent"}`}
              >
                My Work
              </a>
            </li>
            <li className={`menu-item `}>
              <a
                href="/data-centre-locations"
                data-menu-index="3"
                // onClick={handleClick}
                // className={`border-b-4 ${activeMenuItem === 3 ? "border-primary" : "border-transparent"}`}
              >
                Services
              </a>
            </li>

            <li className={`menu-item `}>
              <a
                href="/test#about"
                data-menu-index="4"
                // onClick={handleClick}
                // className={`border-b-4 ${activeMenuItem === 4 ? "border-primary" : "border-transparent"}`}
              >
                Contact
              </a>
            </li>
          </ul>

          <div className="footer col-start-1 col-span-5 row-start-3 row-span-1 text-font  flex justify-center overflow-hidden">
            <FooterLogo menu />
          </div>
        </SectionGrid>
      </DialogContent>
    </Dialog>
  );
};
