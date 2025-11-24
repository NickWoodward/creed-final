"use client";
import Hls from "hls.js";
import { createContext, RefObject, useContext, useEffect, useRef } from "react";

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_VIDEO === "true";

interface VideoControlContextType {
  videosRef: RefObject<Map<string, { video: HTMLVideoElement; hls: Hls }>>;
  registerVideo: (
    videoId: string,
    video: HTMLVideoElement,
    hls: Hls,
    startVideo?: number
  ) => void;
  unregisterVideo: (videoId: string) => void;
  setCurrentVideo: (videoId: string | null) => void;
  getCurrentVideo: () => string | null;
  debugVideos?: () => IterableIterator<
    [string, { video: HTMLVideoElement; hls: Hls }]
  >;
  playVideo: (videoId: string) => void;
  pauseVideo: (videoId: string) => void;
  toggleVideo: (videoId: string) => void;
  toggleAudio: (videoId: string) => void;
  getVideoDuration: (videoId: string) => number;
}

const VideoControlContext = createContext<VideoControlContextType | null>(null);

export const VideoControlProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const videosRef = useRef<
    Map<string, { video: HTMLVideoElement; hls: Hls; startTime: number }>
  >(new Map());
  const currentVideoRef = useRef<string | null>(null);

  const debugVideos = (): IterableIterator<
    [string, { video: HTMLVideoElement; hls: Hls }]
  > => {
    return videosRef.current.entries();
  };

  const registerVideo = (
    videoId: string,
    video: HTMLVideoElement,
    hls: Hls,
    startTime: number = 0
  ) => {
    videosRef.current.set(videoId, { video, hls, startTime });
  };

  const unregisterVideo = (videoId: string) => {
    videosRef.current.delete(videoId);
  };

  const setCurrentVideo = (videoId: string | null) => {
    if (currentVideoRef.current) {
      pauseVideo(currentVideoRef.current);
    }

    currentVideoRef.current = videoId;

    if (videoId) {
      playVideo(videoId);
    }
  };
  const getCurrentVideo = () => currentVideoRef.current;

  const playVideo = (videoId: string) => {
    const videoData = videosRef.current.get(videoId);
    if (videoData) {
      videoData.hls.startLoad(videoData.startTime);
      videoData.video.play().catch((error) => {
        if (error.name !== "AbortError") throw error;
      });
    }
  };

  const pauseVideo = (videoId: string) => {
    const videoData = videosRef.current.get(videoId);
    if (videoData) {
      videoData.video.pause();
      videoData.hls.stopLoad();
    }
  };

  const toggleVideo = (videoId: string) => {
    const videoData = videosRef.current.get(videoId);
    if (!videoData) return;

    const { video } = videoData;
    const isPlaying = !video.paused && !video.ended && video.readyState >= 2;

    if (isPlaying) {
      pauseVideo(videoId);
    } else {
      playVideo(videoId);
    }
  };

  const toggleAudio = (videoId: string) => {
    const videoData = videosRef.current.get(videoId);
    if (!videoData) return;

    const { video } = videoData;

    video.muted = !video.muted;
  };

  const getVideoDuration = (videoId: string) => {
    const videoData = videosRef.current.get(videoId);
    if (videoData) return videoData.video.duration;
    return 0;
  };

  return (
    <VideoControlContext.Provider
      value={{
        videosRef,
        registerVideo,
        unregisterVideo,
        setCurrentVideo,
        getCurrentVideo,
        playVideo,
        pauseVideo,
        getVideoDuration,
        toggleVideo,
        toggleAudio,
        ...(DEBUG && { debugVideos }),
      }}
    >
      {children}
    </VideoControlContext.Provider>
  );
};

export const useVideoControls = () => {
  const context = useContext(VideoControlContext);
  if (!context) {
    throw new Error(
      "useVideoControl must be used within a VideoControlProvider"
    );
  }
  return context;
};
