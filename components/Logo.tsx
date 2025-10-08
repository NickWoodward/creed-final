import { CreedLogoCompact } from "@/lib/svg";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

type Props = {
  size: Size;
  className?: string;
  compact?: boolean;
};

const sizeClasses: Record<Size, string> = {
  xs: "h-9",
  sm: "h-12",
  md: "h-16",
  lg: "h-24 xxs:h-24 md:h-[108px] lg:h-[150px]",
  xl: "h-[108px]",
  hero: "h-20 xxs:h-24 md:h-32",
};

export const Logo = ({ compact = false, size, className }: Props) => {
  return (
    <>
      {/* <CreedLogo
        className={cn("creed-logo-compact ", sizeClasses[size], className)}
      /> */}
      <div
        style={{ borderRadius: "9999px 5000px 5000px 9999px" }}
        className={cn(
          "relative flex items-center",
          size === "xs" && "gap-x-[1px]",
          size === "sm" && "gap-x-[3px]",
          size === "md" && "gap-x-[4px]",
          size === "lg" && "gap-x-[4px] sm:gap-x-[5px] lg:gap-x-[8px]",
          size === "xl" && "gap-x-[5px]",
          size === "hero" && "gap-x-[4px] sm:gap-x-[5px] lg:gap-x-[8px]",
          className
        )}
      >
        {/* {true && (
          <div className="absolute left-2 -right-12 h-[90%] md:bg-secondary-darker md:bg-opacity-80 rounded-l-full rounded-r-full z-[-1]"></div>
        )} */}
        {compact ? (
          <CreedLogoCompact className={cn("logo-svg", sizeClasses[size])} />
        ) : (
          <>
            <div
              className={cn(
                "logo-c-bg rounded-full",
                size === "xs" && "bg-icon  p-[3px] scale-[1.1]"
              )}
            >
              <CreedLogoCompact
                className={cn("logo-svg", sizeClasses[size])}
                strokeWidth={size === "xs" ? 2 : undefined}
              />
            </div>
            <span
              className={cn(
                "logo-text font-[360] ",
                size === "xs" && "text-3xl font-[420]",
                size === "sm" && "text-4xl",
                size === "md" && "text-5xl",
                size === "lg" && "text-7xl sm:text-[72px] lg:text-[105px]",
                size === "xl" && "text-[92px]",
                size === "hero" &&
                  "text-6xl xxs:text-7xl sm:text-[72px] lg:text-[105px]"
              )}
            >
              reed
            </span>
          </>
        )}
      </div>
    </>
  );
};
