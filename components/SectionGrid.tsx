import { cn } from "@/lib/utils";
import { ReactNode, RefObject } from "react";

type Gap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
type Grid = "narrow" | "md" | "wide" | "full";

const gapClasses = {
  none: "",
  xs: "gap-y-section-xxs",
  sm: "gap-y-section-xs xxs:gap-y-section-sm",
  md: "gap-y-section-sm xxs:gap-y-section-md",
  lg: "gap-y-section-md",
  xl: "",
};
// exported so they can be added to any
export const gridClasses = {
  narrow: "",
  md: "grid-cols-[var(--card-inset)_calc(8%-var(--card-inset))_1fr_calc(8%-var(--card-inset))_var(--card-inset)] lg:grid-cols-[7%_1%_1fr_1%_7%] xl:grid-cols-[var(--card-inset)_14%_1fr_2%_25%_var(--card-inset)]",
  wide: "grid-cols-[var(--card-inset)_5%_1fr_5%_var(--card-inset)] xs:grid-cols-[8%_6%_1fr_6%_8%] sm:grid-cols-[14%_2%_1fr_2%_14%] md:grid-cols-[12%_4%_1fr_4%_12%] lg:grid-cols-[5%_5%_1fr_5%_5%] xl:grid-cols-[var(--card-inset)_calc(14%-var(--card-inset))_1fr_calc(14%-var(--card-inset))_var(--card-inset)]",
  // Full is same as md, but has the majority of space in the inner column, minus a small outer
  full: `
    grid-cols-[var(--card-inset)_calc(8%-var(--card-inset))_1fr_calc(8%-var(--card-inset))_var(--card-inset)] 
    lg:grid-cols-[var(--card-inset)_calc(8%-var(--card-inset))_1fr_calc(8%-var(--card-inset))_var(--card-inset)] 
    xl:grid-cols-[var(--card-inset)_calc(16%-var(--card-inset))_1fr_calc(16%-var(--card-inset))_var(--card-inset)]`,
};

interface Props {
  ref?: RefObject<HTMLDivElement | null>;
  className?: string;
  gap?: Gap;
  grid?: Grid;
  children: ReactNode;
}

export const SectionGrid = ({
  ref,
  className,
  gap = "md",
  grid = "md",
  children,
}: Props) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative section-grid grid lg:max-w-[1420px] lg:mx-auto ",
        gapClasses[gap],
        gridClasses[grid],
        className
      )}
    >
      {children}
    </div>
  );
};
