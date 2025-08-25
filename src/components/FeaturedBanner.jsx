// app/components/FeaturedBanner.jsx (Server Component by default)

import { getFeaturedMovie } from "@/lib/movies";
import Link from "next/link";
import FeaturedMovieMoreInfo from "./FeaturedMovieMoreInfo";

export default async function FeaturedBanner({ genre, search }) {

  const movie = await getFeaturedMovie(genre, search)


  return (
    <div className="relative h-[90vh] w-full">
      <video
        src={movie?.trailer?.url}
        autoPlay={true}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-75"

      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Text content */}
      <div className="absolute bottom-10 left-10 text-white max-w-lg">
        <h1 className="text-4xl font-bold mb-4">{movie?.movieName}</h1>
        <div className="flex gap-4 h-10">
          <Link href={`/watch/${movie?._id}`} className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200">
            ▶ Play
          </Link>
          <FeaturedMovieMoreInfo description={movie?.description} />
        </div>
      </div>
    </div>
  );
}
