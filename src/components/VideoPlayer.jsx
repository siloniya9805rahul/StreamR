"use client";

export default function VideoPlayer({ src, poster }) {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden">
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()} // ✅ works now
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}
