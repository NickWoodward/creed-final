import { cn } from "@/lib/utils";

export const HeroItem2 = ({
  dataItemIndex,
  titlePreviewRef,
  titleRef,
  title,
  descriptionRef,
  description,
  onClick,
  className,
  children,
}: {
  dataItemIndex: string;
  titlePreviewRef: React.Ref<HTMLDivElement>;
  titleRef: React.Ref<HTMLDivElement>;
  title: string;
  descriptionRef: React.Ref<HTMLDivElement>;
  description: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      data-item-index={dataItemIndex}
      onClick={onClick}
      className={cn(
        "flex justify-center items-center h-full rounded-xl text-3xl text-font-reversed font-[330] overflow-hidden",
        className
      )}
    >
      {children}
      <div
        ref={titlePreviewRef}
        className="preview-text absolute top-3 right-6 text-2xl"
      >
        {title}
      </div>
      <div className="absolute bottom-3 right-6 text-2xl">
        <div ref={titleRef} className="main-text">
          {title}
        </div>
        <div ref={descriptionRef} className="description-text">
          {description}
        </div>
      </div>
    </div>
  );
};
