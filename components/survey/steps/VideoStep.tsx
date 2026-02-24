"use client";

import { useRef, useState, useEffect } from "react";

interface VideoStepProps {
  videoPath: string;
  videoFilename: string;
  onVideoEnded: () => void;
  /** Cumulative seconds the video has been playing (from previous visits to this step) */
  initialTimeSpentSeconds?: number;
  /** Number of times the user has completed a viewing (reached end or 90%), including replays */
  initialWatchCount?: number;
  /** Called when time spent or watch count changes (so parent can persist when user goes back/next) */
  onVideoProgress?: (data: { timeSpentSeconds: number; watchCount: number }) => void;
}

export default function VideoStep({
  videoPath,
  videoFilename,
  onVideoEnded,
  initialTimeSpentSeconds = 0,
  initialWatchCount = 0,
  onVideoProgress,
}: VideoStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCalledOnEndedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(initialTimeSpentSeconds);
  const [watchCount, setWatchCount] = useState(initialWatchCount);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onVideoProgressRef = useRef(onVideoProgress);
  onVideoProgressRef.current = onVideoProgress;

  // Notify parent when time or watch count changes (omit onVideoProgress from deps to avoid infinite loop)
  useEffect(() => {
    onVideoProgressRef.current?.({ timeSpentSeconds, watchCount });
  }, [timeSpentSeconds, watchCount]);

  // Clear play interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, []);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    let errorMessage = "Failed to load video. ";
    
    if (video.error) {
      switch (video.error.code) {
        case video.error.MEDIA_ERR_ABORTED:
          errorMessage += "Video loading was aborted.";
          break;
        case video.error.MEDIA_ERR_NETWORK:
          errorMessage += "Network error while loading video.";
          break;
        case video.error.MEDIA_ERR_DECODE:
          errorMessage += "Video decoding error. The video format may not be supported.";
          break;
        case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage += `Video format not supported. Path: ${videoPath}`;
          break;
        default:
          errorMessage += "Unknown error occurred.";
      }
    }
    
    setError(errorMessage);
    console.error("Video error:", video.error, "Path:", videoPath);
  };

  const handleVideoEnded = () => {
    setWatchCount((c) => c + 1);
    if (!hasCalledOnEndedRef.current) {
      hasCalledOnEndedRef.current = true;
      onVideoEnded();
    }
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  };

  const handlePlay = () => {
    if (playIntervalRef.current) return;
    playIntervalRef.current = setInterval(() => {
      setTimeSpentSeconds((s) => s + 1);
    }, 1000);
  };

  const handlePause = () => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  };

  // Also mark step complete if user has watched 90% (allow proceeding)
  const handleTimeUpdate = () => {
    if (videoRef.current && !hasCalledOnEndedRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0 && currentTime / duration >= 0.9) {
        hasCalledOnEndedRef.current = true;
        onVideoEnded();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 items-center">
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50 text-center">
          Please watch the following video
        </h3>
        <div className="w-full max-w-md rounded-lg overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoPath}
            controls
            loop
            className="max-w-full max-h-[70vh] w-auto h-auto"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onError={handleVideoError}
            preload="metadata"
          >
            <source src={videoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {error && (
          <div className="w-full max-w-md p-4 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">
              {error}
            </p>
            <p className="text-xs text-red-600 dark:text-red-300 mt-2">
              Video path: {videoPath}
            </p>
          </div>
        )}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
          Please watch the entire video before continuing.
        </p>
      </div>
      {/* Hidden field to track video filename */}
      <input type="hidden" value={videoFilename} />
    </div>
  );
}

