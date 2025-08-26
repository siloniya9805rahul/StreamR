import { getFeaturedMovie } from "@/lib/movies";
import Link from "next/link";
import FeaturedMovieMoreInfo from "./FeaturedMovieMoreInfo";

export default async function FeaturedBanner({ genre, search }) {
  const movie = await getFeaturedMovie(genre, search);

  return (
    <div className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] w-full">
      <video
        src={movie?.trailer?.url}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-75"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Text content */}
      <div
        className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 
                   text-white max-w-xs sm:max-w-md md:max-w-lg"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          {movie?.movieName}
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
          <Link
            href={`/watch/${movie?._id}`}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-white text-black 
                       rounded-lg font-semibold hover:bg-gray-200 text-sm sm:text-base"
          >
            ▶ Play
          </Link>
          <FeaturedMovieMoreInfo description={movie?.description} />
        </div>
      </div>
    </div>
  );
}
