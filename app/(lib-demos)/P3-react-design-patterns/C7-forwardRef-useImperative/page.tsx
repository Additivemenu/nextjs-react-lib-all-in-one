"use client";

import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { VideoPlayer, type VideoPlayerHandle } from "./components/video-player";
import ReadmeLink from "@/components/links/ReadmeLink";
import { readmePath } from "./readme-path";

// Interface for the status object
interface PlayerStatus {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
}

// Parent component that controls the child
const MediaController: React.FC = () => {
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const [status, setStatus] = useState<PlayerStatus | null>(null);

  const handlePlay = (): void => {
    //! child api enabled by useImperativeHandle
    videoPlayerRef.current?.play();
  };

  const handlePause = (): void => {
    videoPlayerRef.current?.pause();
  };

  const handleStop = (): void => {
    videoPlayerRef.current?.stop();
  };

  const handleVolumeUp = (): void => {
    const currentStatus = videoPlayerRef.current?.getStatus();
    if (currentStatus) {
      videoPlayerRef.current?.setVolume(currentStatus.volume + 10);
    }
  };

  const handleVolumeDown = (): void => {
    const currentStatus = videoPlayerRef.current?.getStatus();
    if (currentStatus) {
      videoPlayerRef.current?.setVolume(currentStatus.volume - 10);
    }
  };

  const handleJumpTo30 = (): void => {
    videoPlayerRef.current?.jumpTo(30);
  };

  const handleGetStatus = (): void => {
    const currentStatus = videoPlayerRef.current?.getStatus();
    setStatus(currentStatus || null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center">Media Controller Demo</h2>
      <ReadmeLink readmePath={readmePath} />

      {/* Video Player component */}

      {/* Child component with ref */}
      <VideoPlayer ref={videoPlayerRef} />

      {/* Parent controls */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Remote Control</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={handlePlay}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            ▶️ Play
          </button>

          <button
            onClick={handlePause}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
          >
            ⏸️ Pause
          </button>

          <button
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            ⏹️ Stop
          </button>

          <button
            onClick={handleVolumeUp}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            🔊 Vol +
          </button>

          <button
            onClick={handleVolumeDown}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            🔉 Vol -
          </button>

          <button
            onClick={handleJumpTo30}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
          >
            ⏭️ Jump 30s
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={handleGetStatus}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Get Status
          </button>

          {status && (
            <div className="mt-3 p-3 bg-white rounded border">
              <h4 className="font-semibold mb-2">Current Status:</h4>
              <pre className="text-sm text-gray-700">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">TypeScript Benefits:</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <code>VideoPlayerHandle</code> interface defines the exposed API
          </li>
          <li>Type safety for all method calls and parameters</li>
          <li>IntelliSense support for available methods</li>
          <li>Compile-time error checking for incorrect usage</li>
          <li>
            <code>forwardRef&lt;VideoPlayerHandle, VideoPlayerProps&gt;</code>{" "}
            provides full type safety
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MediaController;
