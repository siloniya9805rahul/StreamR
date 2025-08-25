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

  // Map mouse wheel to horizontal scroll
  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollBy({
        left: e.deltaY, // vertical wheel → horizontal scroll
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-10 hover:bg-black"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Movie List */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth scrollbar-hide"
      >
        {movies.map((movie) => (
          <Link href={`/watch/${movie._id}`}
            key={movie._id}
            className="min-w-[180px] flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden"
            onMouseEnter={() => {
              const timeout = setTimeout(() => setHoveredId(movie._id), 1000); // 1000ms delay like Netflix
              setHoverTimeout(timeout);
            }}
            onMouseLeave={() => {
              clearTimeout(hoverTimeout);
              setHoveredId(null);
            }}
          >
            {hoveredId === movie._id ? (
              <video
                src={movie.trailer.url}
                autoPlay
                muted
                loop
                className="max-w-75 h-full object-cover"
              />
            ) : (
              <img
                src={movie.poster.url}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}
            <p className="text-white text-sm p-2 truncate">{movie.title}</p>
          </Link>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full z-10 hover:bg-black"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
