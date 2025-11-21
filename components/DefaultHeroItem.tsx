import { cn } from "@/lib/utils";

export const DefaultHeroItem = ({
  className,
  ref,
  children,
}: {
  className?: string;
  ref: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        "default-hero-item  grid justify-center items-center h-full rounded-xl text-3xl text-font-reversed font-[330] overflow-hidden",
        className
      )}
    >
      <div className="bg absolute inset-[7px] bg-slate-900 rounded-xl"></div>
      {children}
    </div>
  );
};
