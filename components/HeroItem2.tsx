import { useVideoControls } from "@/contexts/VideoControlProvider";
import { PauseIcon, VolumeMutedIcon } from "@/lib/svg";
import { cn } from "@/lib/utils";

export type Position = "tl" | "tr" | "br" | "bl";

const previewClasses: Record<Position, string> = {
  tl: "col-start-1 col-span-1 row-start-1 row-span-1 text-start",
  tr: "col-start-3 col-span-1 row-start-1 row-span-1 text-end",
  br: "col-start-3 col-span-1 row-start-3 row-span-1 text-end",
  bl: "col-start-1 col-span-1 row-start-3 row-span-1 text-start",
};
// const titleClasses: Record<Position, string> = {
//   tl: "col-start-1 col-span-1 row-start-3 row-span-1 text-start",
//   tr: "col-start-3 col-span-1 row-start-3 row-span-1 text-end",
//   br: "col-start-3 col-span-1 row-start-3 row-span-1 text-end",
//   bl: "col-start-1 col-span-1 row-start-3 row-span-1 text-start",
// };

const gridClasses: Record<Position, string> = {
  tl: "grid-cols-[auto_1fr_auto]",
  tr: "grid-cols-[auto_1fr_auto]",
  br: "grid-cols-[auto_1fr_auto] items-end",
  bl: "grid-cols-[auto_1fr_auto] items-end",
};

export const HeroItem2 = ({
  dataItemIndex,
  titlePreviewRef,
  titleRef,
  title,
  descriptionRef,
  description = "this is a test",
  controlsRef,
  onClick,
  className,
  children,
  position = "tr",
}: {
  dataItemIndex: string;
  titlePreviewRef: React.Ref<HTMLDivElement>;
  titleRef: React.Ref<HTMLDivElement>;
  title: string;
  descriptionRef: React.Ref<HTMLDivElement>;
  description: string;
  controlsRef: React.Ref<HTMLDivElement>;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  children?: React.ReactNode;
  position?: Position;
}) => {
  const { getCurrentVideo, toggleVideo, toggleAudio } = useVideoControls();

  return (
    <div
      data-item-index={dataItemIndex}
      onClick={onClick}
      className={cn(
        "grid grid-rows-[auto_1fr_auto_auto] justify-center items-center h-full  rounded-xl text-3xl text-font-reversed font-[330] overflow-hidden",
        className,
        gridClasses[position]
      )}
    >
      {children}
      <div
        ref={titlePreviewRef}
        className={cn(
          "preview-text text-end py-6 px-6  text-2xl",
          previewClasses[position]
        )}
      >
        {title}
      </div>
      <div
        ref={titleRef}
        className={cn(
          "main-text col-start-1 col-span-1 row-start-3 row-span-1 text-start pb-2 px-8"
          // titleClasses[position]
        )}
      >
        {title}
      </div>
      <div
        ref={descriptionRef}
        className="description-text col-start-1 col-span-2 row-start-4 row-span-1 max-w-2xl hidden opacity-0 invisible pb-8 px-8 text-lg"
      >
        {description}
      </div>

      <div
        ref={controlsRef}
        className="controls gap-x-3.5 justify-end items-center col-start-3 col-span-1 row-start-4 row-span-1 hidden opacity-0 invisible pb-8 px-8"
      >
        <PauseIcon
          onClick={(e) => {
            e.stopPropagation();
            const video = getCurrentVideo();
            video && toggleVideo(video);
          }}
          className="size-7"
        />
        <VolumeMutedIcon
          onClick={(e) => {
            e.stopPropagation();
            const video = getCurrentVideo();
            video && toggleAudio(video);
          }}
          className="size-8"
        />
      </div>
    </div>
  );
};
