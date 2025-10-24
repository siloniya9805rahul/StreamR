"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function MovieCarousel({ movies }) {
  const scrollRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    });
  };

  // Horizontal scroll with mouse wheel
  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollBy({
        left: e.deltaY,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative px-7 md:px-10">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        aria-label="slide left"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-10 hover:bg-black"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Movie List */}
      <div
        ref={scrollRef}
        onWheel={(e) => {
    if (window.innerWidth > 668) handleWheel(e); // only for desktop
  }}
        className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide"
      >
        {movies.map((movie) => (
          <Link
            href={`/watch/${movie._id}`}
            key={movie._id}
            className="min-w-[180px] flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden relative"
            onMouseEnter={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              const timeout = setTimeout(() => setHoveredId(movie._id), 800); // Slightly faster Netflix feel
              setHoverTimeout(timeout);
            }}
            onMouseLeave={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              setHoveredId(null);
            }}
          >
            {hoveredId === movie._id && movie.trailer?.public_id ? (
              <video
                src={`https://res.cloudinary.com/rahul-siloniya/video/upload/w_320,h_200,c_fill,f_auto,q_auto:best/${movie.trailer.public_id}.mp4`}
                autoPlay
                muted
                loop
                loading="lazy"
                className="aspect-[1.6] h-[200px] object-cover"
              />
            ) : (
              <img
                src={`https://res.cloudinary.com/rahul-siloniya/image/upload/w_320,h_200,c_fill,f_auto,q_auto:best/${movie.poster.public_id}.jpg`}
                alt={movie?.movieName}
                loading="lazy"
                className="aspect-[1.6] h-[200px] object-cover"
              />
            )}
            <p className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white text-sm p-2 truncate">
              {movie?.movieName}
            </p>
          </Link>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        aria-label="slide right"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-10 hover:bg-black"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
