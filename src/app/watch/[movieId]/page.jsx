// app/watch/[movieId]/page.jsx
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";
import VideoPlayer from "@/components/VideoPlayer";
import BackButton from "@/components/BackButton";

// Dynamic metadata
export async function generateMetadata({ params }) {
  await dbConnect();
   const { movieId } = await params;
  const movie = await Movie.findById(movieId).lean();
  if (!movie) return { title: "Movie Not Found" };

  return {
    title: movie.movieName,
    description: movie.description,
    openGraph: {
      title: movie.movieName,
      description: movie.description,
      images: movie.poster.url ? [movie.poster.url] : [],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: movie.movieName,
      description: movie.description,
      images: movie.poster.url ? [movie.poster.url] : [],
    },
  };
}

export default async function WatchMoviePage({ params }) {
  await dbConnect();
  const { movieId } = await params;
  const movie = await Movie.findById(movieId).lean();

  if (!movie) {
    return <div className="text-white text-center mt-10">Movie not found</div>;
  }

  return (
    <main className="bg-black min-h-screen">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8">
        
        {/* Video Section */}
        <div className="w-full md:w-[70%] aspect-video">
          <VideoPlayer src={movie.video.url} poster={movie.poster.url} />
        </div>

        {/* Movie Details */}
        <div className="w-full md:w-[30%] text-white space-y-4">
          <h1 className="text-3xl font-bold">{movie.movieName}</h1>
          <p className="text-gray-300">
            <strong>Genre:</strong> {movie.genre}
          </p>
          <p className="text-gray-300 max-h-40 overflow-y-auto">
            <strong>Description:</strong> {movie.description}
          </p>
          <p className="text-gray-400 text-sm">
            Uploaded: {new Date(movie.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </main>
  );
}
