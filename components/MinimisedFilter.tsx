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
      className={cn("minimised-filter absolute bg-slate-800/40", className)}
    ></div>
  );
};
