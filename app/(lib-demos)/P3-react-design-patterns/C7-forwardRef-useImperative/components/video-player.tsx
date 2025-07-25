import { useEffect, useImperativeHandle, useState, forwardRef } from "react";

// Define the interface for the methods exposed by the child component
interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (newVolume: number) => void;
  getStatus: () => {
    isPlaying: boolean;
    volume: number;
    currentTime: number;
  };
  jumpTo: (time: number) => void;
}

// Props interface for the VideoPlayer component
interface VideoPlayerProps {
  // Add any props you might need here
  className?: string;
}

// Child component that exposes its internal API to parent
const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (props, ref) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(50);
    const [currentTime, setCurrentTime] = useState<number>(0);

    //! Expose these methods to the parent component
    useImperativeHandle(
      ref,
      (): VideoPlayerHandle => ({
        play: (): void => {
          setIsPlaying(true);
          console.log("Video started playing");
        },
        pause: (): void => {
          setIsPlaying(false);
          console.log("Video paused");
        },
        stop: (): void => {
          setIsPlaying(false);
          setCurrentTime(0);
          console.log("Video stopped");
        },
        setVolume: (newVolume: number): void => {
          setVolume(Math.max(0, Math.min(100, newVolume)));
          console.log(`Volume set to ${newVolume}`);
        },
        getStatus: () => ({
          isPlaying,
          volume,
          currentTime,
        }),
        jumpTo: (time: number): void => {
          setCurrentTime(time);
          console.log(`Jumped to ${time}s`);
        },
      }),
    );

    // Simulate time progress when playing
    useEffect(() => {
      if (!isPlaying) return;

      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }, [isPlaying]);

    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Video Player</h3>
        <div className="bg-gray-800 h-32 rounded flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2">{isPlaying ? "▶️" : "⏸️"}</div>
            <div className="text-sm">
              {Math.floor(currentTime / 60)}:
              {String(currentTime % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">Volume:</span>
            <div className="bg-gray-700 h-2 flex-1 rounded">
              <div
                className="bg-blue-500 h-full rounded transition-all"
                style={{ width: `${volume}%` }}
              />
            </div>
            <span className="text-sm w-8">{volume}</span>
          </div>

          <div className="text-xs text-gray-400">
            Status: {isPlaying ? "Playing" : "Paused"}
          </div>
        </div>
      </div>
    );
  },
);

// Add display name for better debugging
VideoPlayer.displayName = "VideoPlayer";

export { VideoPlayer, type VideoPlayerHandle };
