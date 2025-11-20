import { cn } from "@/lib/utils";

export const MinimisedFilter = ({
  ref,
  className,
}: {
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
}) => {
  return (
    <div
      ref={ref}
      className={cn("minimised-filter absolute inset-0 bg-slate-800/50", className)}
    ></div>
  );
};
