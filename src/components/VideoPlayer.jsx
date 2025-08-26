"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle progress update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(percent);
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Fullscreen
  const handleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="w-full aspect-video relative rounded-xl overflow-hidden bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        playsInline
        controlsList="nodownload noplaybackrate"
        preload="metadata"
        className="w-full h-full object-cover"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col gap-2">
        
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full accent-blue-500"
        />

        {/* Buttons */}
        <div className="flex justify-between items-center text-white">
          <div className="flex gap-3 items-center">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="p-2 hover:scale-110 transition">
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="p-2 hover:scale-110 transition">
              {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </div>

          {/* Fullscreen */}
          <button onClick={handleFullscreen} className="p-2 hover:scale-110 transition">
            <Maximize size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
