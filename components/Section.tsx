import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Padding = "none" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "pinned";

const paddingClasses: Record<Padding, string> = {
  none: "py-0",
  xxs: "py-section-xs md:py-section-md",
  xs: "py-section-xs",
  sm: "py-section-sm xs:py-section-lg md:py-section-xl",
  md: "py-section-md sm:py-section-lg md:py-section-xl",
  lg: "py-section-lg sm:py-section-xl",
  xl: "",
  pinned: "md:min-h-screen grid py-section-sm xs:py-section-md md:py-0 ",
};

interface Props {
  id?: string;
  className?: string;
  padding?: Padding;
  bgImage?: ReactNode;
  children: ReactNode;
}

export const Section = ({
  id,
  className,
  bgImage,
  children,
  padding = "md",
}: Props) => {
  return (
    <section
      id={id}
      className={cn(
        "relative bg-background",
        paddingClasses[padding],
        className
      )}
    >
      {bgImage && bgImage}
      {children}
    </section>
  );
};
