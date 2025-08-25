// components/SeriesRow.jsx (Server Component)
import dbConnect from "@/lib/db";
import Series from "@/models/Series";
import Movie from "@/models/Movie";
import MovieCarousel from "@/components/MovieCarousel";


export default async function SeriesRow({ seriesId }) {
  await dbConnect();

  // Fetch series and populate its movies
  const series = await Series.findById(seriesId).lean();
  if (!series) return null;

  // Fetch movies by IDs (only first 10)
  const movies = await Movie.find({ _id: { $in: series.movieIds } })
    .limit(10)
    .lean();

  return (
    <section className="mb-10">
      <h2 className="text-xl px-5 font-bold text-white mb-3">{series.title}</h2>
      <MovieCarousel movies={JSON.parse(JSON.stringify(movies))} />
    </section>
  );
}
