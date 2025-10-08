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
  title = "Item",
  onClick,
  accordionValue,
  onAccordionChange,
}: {
  main?: boolean;
  children?: ReactNode;
  className?: string;
  dataItemIndex?: string;
  id?: string;
  ref?: React.Ref<HTMLDivElement>;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  accordionValue?: string;
  onAccordionChange?: (val: string | undefined) => void;
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
      <div
        className={cn(
          `filter-disabled absolute inset-0 invisible opacity-0 bg-gradient-to-tr overflow-hidden`,
          `from-filter-disabled-start to-filter-disabled-end `
        )}
      ></div>
      {main && (
        <div className="grid-item-1-overlay invisible opacity-0 absolute inset-0 flex justify-center items-center  z-50">
          <Logo
            size="md"
            className="invisible opacity-0 -translate-x-[2%] text-logo z-40"
          />
        </div>
      )}
      {/* <div className="flex justify-between w-full">
                <BatteryIcon className="w-7 h-7 text-white" />
                <div className="recording   flex items-center gap-1">
                  <div className="recording-icon w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="recording-text text-xs text-white">REC</div>
                </div>
              </div> */}
      {!main && (
        <div className="overlay pointer-coarse:hidden absolute inset-0 overflow-hidden rounded-[4px]">
          <div className="viewfinder absolute inset-[var(--sliding-card-padding)] ">
            {/* <div className="tl absolute rounded-tl-[8px] top-0 left-0 w-[25%] h-[25%] border-l-2 border-t-2 border-white"></div>
            <div className="tr absolute rounded-tr-[8px] top-0 right-0 w-[25%] h-[25%] border-r-2 border-t-2 border-white"></div> */}
            <div className="viewfinder-content pt-3 pb-2 pl-1 xxs:pl-2 pr-2 xxs:pr-6 flex flex-col items-start justify-between w-full h-full">
              <div
                onClick={(e) => e.stopPropagation()}
                className="pb-1 flex justify-start items-end h-full w-full text-primary text-xl xl:text-2xl font-[320]"
              >
                {/* <div className="hero-item-title">{title}</div> */}
                <Accordion
                  type="single"
                  value={accordionValue}
                  onValueChange={onAccordionChange}
                  collapsible
                >
                  <AccordionItem value={`item-${dataItemIndex}`}>
                    <AccordionTrigger className="hero-item-title text-xl xxs:text-2xl font-[400]">
                      <span>{title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="ml-2 text-lg xxs:text-xl font-[350] text-secondary-light">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Eum asperiores tenetur omnis sit sequi optio, deserunt
                      fugit fuga suscipit magni!
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {/* <div className="bl absolute rounded-bl-[8px] bottom-0 left-0 w-[25%] h-[25%] border-l-2 border-b-2 border-white"></div>
            <div className="br absolute rounded-br-[8px] bottom-0 right-0 w-[25%] h-[25%] border-r-2 border-b-2 border-white"></div> */}
          </div>
        </div>
      )}
    </div>
  );
};
