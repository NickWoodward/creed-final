import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HeroItem = ({
  main = false,
  children,
  className,
  dataItemIndex,
  id,
  ref,
  titlePreviewRef,
  titleRef,
  descriptionRef,
  title,
  description,
  onClick,
}: {
  main?: boolean;
  children?: ReactNode;
  className?: string;
  dataItemIndex?: string;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
  titlePreviewRef?: React.Ref<HTMLDivElement>;
  titleRef?: React.Ref<HTMLDivElement>;
  descriptionRef?: React.Ref<HTMLDivElement>;
  title?: string;
  description?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      id={id}
      data-item-index={dataItemIndex}
      className={cn(
        `relative h-full w-full rounded-2xl shadow-xl  border-[5px] border-border transition-colors !duration-300  overflow-hidden`,
        !main && "hero-item--sub",
        className
      )}
    >
      {children}
      <div
        className={cn(
          `filter absolute inset-0 bg-gradient-to-tr overflow-hidden`,
          `from-filter-start to-filter-end`
        )}
      ></div>
      {/* <div
        className={cn(
          `filter-disabled absolute inset-0 invisible opacity-0 bg-gradient-to-tr overflow-hidden`,
          `from-filter-disabled-start to-filter-disabled-end `
        )}
      ></div> */}

      {!main && (
        <div
          data-content-index={id}
          className="absolute bottom-0 left-0 pb-2 px-3 grid border gap-y-1 w-5/6 text-font-reversed font-[330]"
        >

          <div ref={titleRef} className="main-text">{title}</div>
          <div ref={titlePreviewRef} className="preview-text absolute bottom-2 left-2">{title}</div>
              

          {/* <div
            ref={titlePreviewRef}
            className="item-title-preview col-start-1 row-start-2 self-end text-2xl "
          >
            {title}
          </div>

          <div className="col-start-1 row-start-1 row-span-1">
            <div ref={titleRef} className="item-title text-2xl ">
              {title}
            </div>
       
          </div> */}
        </div>
      )}
    </div>
  );
};
