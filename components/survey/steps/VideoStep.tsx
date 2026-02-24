"use client";

import { useRef, useState } from "react";

interface VideoStepProps {
  videoPath: string;
  videoFilename: string;
  onVideoEnded: () => void;
}

export default function VideoStep({
  videoPath,
  videoFilename,
  onVideoEnded,
}: VideoStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCalledOnEndedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!hasCalledOnEndedRef.current) {
      hasCalledOnEndedRef.current = true;
      onVideoEnded();
    }
  };

  // Also mark as watched if user has watched significant portion
  const handleTimeUpdate = () => {
    if (videoRef.current && !hasCalledOnEndedRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      // If user has watched at least 90% of the video, allow proceeding
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
            className="max-w-full max-h-[70vh] w-auto h-auto"
            onEnded={handleVideoEnded}
            onTimeUpdate={handleTimeUpdate}
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

