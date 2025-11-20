"use client";

import { cn } from "@/lib/utils";
import Hls from "hls.js";
import { useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVideoControls } from "@/contexts/VideoControlProvider";
import { StaticImageData } from "next/image";

const source =
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

export const HlsVideo = ({
  id,
  url = source,
  loop = false,
  startTime = 0,
  placeholder,
  className,
  filter,
  autoPlay = false,
}: {
  id: string;
  url?: string;
  loop?: boolean;
  startTime?: number;
  placeholder?: string | StaticImageData;
  className?: string;
  filter?: React.ReactNode;
  autoPlay?: boolean;
}) => {
  const { registerVideo, unregisterVideo, setCurrentVideo } =
    useVideoControls();

  const videoRefCallback = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video) return;

      const hls = new Hls({
        testBandwidth: true,
        abrEwmaDefaultEstimate: 5000000, // Start optimistic
        startLevel: -1, // Let HLS.js choose based on bandwidth
        maxBufferLength: 30, // 30 seconds max buffer
        maxMaxBufferLength: 60, // 60 seconds absolute max
        maxBufferSize: 60 * 1000 * 1000, // 60MB max buffer size
        autoStartLoad: autoPlay ? true : false,
      });

      registerVideo(id, video, hls, startTime);

      const handleVideoLoaded = () => {
        if (autoPlay) setCurrentVideo(id);
        // else call setCurrentVideo from the parent component
        ScrollTrigger.refresh();
      };

      if (Hls.isSupported()) {
        hls.loadSource(url);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      }

      video.addEventListener("loadeddata", handleVideoLoaded);

      return () => {
        video.removeEventListener("loadeddata", handleVideoLoaded);
        unregisterVideo(id);
        hls.destroy();
      };
    },
    [url, id]
  );

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center h-full w-full rounded-none overflow-hidden",
        className
      )}
    >
      {filter && filter}
      <video
        ref={videoRefCallback}
        loop={loop}
        poster={
          placeholder
            ? typeof placeholder === "string"
              ? placeholder
              : placeholder.src
            : undefined
        }
        muted
        autoPlay={autoPlay}
        className="h-full w-full object-cover"
      />
    </div>
  );
};
