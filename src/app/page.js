//metadata
export const metadata = {
  title: "StreamR || Play Movies",
  description: " StreamR is a video platform on which users can watch their favourite movies|| StreamR",
};

// app/page.jsx (Server Component)
import dynamic from "next/dynamic";
import FeaturedBanner from "@/components/FeaturedBanner";
import GenreSection from "@/components/GenreSection";
import Navbar from "@/components/Navbar";
import SeriesRow from "@/components/SeriesRow";
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";
import Series from "@/models/Series";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const MovieCarousel = dynamic(() => import("@/components/MovieCarousel"), {
  loading: () => <p>Loading...</p>, // shows while component loads
  ssr: true, // default, set to false if you only want client-side
});

export default async function Home({ searchParams }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAdmin;
  if (token) {
    try {
      isAdmin = jwt.verify(token, process.env.JWT_SECRET).isAdmin;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }
  
  await dbConnect();

  // Extract genre from URL query params
  const { genre, search } = await searchParams;

  // Build query
  let query = {};
  if (genre) query.genre = genre;
  let searchMovies = [];
  if (search && search.trim() !== "") {
    searchMovies = await Movie.find({
      movieName: { $regex: `^${search}`, $options: "i" },
      ...(genre && { genre }),
    })
      .limit(10)
      .lean();
  }

  // Fetch series
  const seriesList = await Series.find(query).lean();
  // Fetch unique genres for dropdown
  const genreList = await Series.distinct("genre");

  return (
    <main className="bg-black min-h-screen">
      <Navbar isAdmin={isAdmin} />
      <FeaturedBanner genre={genre} search={search} />
      <GenreSection selectedGenre={genre} genreList={genreList} />
      {/* Search results only if search param exists */}
      {search ? (
        searchMovies.length > 0 ? (
          <MovieCarousel movies={JSON.parse(JSON.stringify(searchMovies))} />
        ) : (
          <p className="text-white text-center mt-10">
            No movies found for {`"${search}"`}
          </p>
        )
      ) : (
        // Show all series if no search
        seriesList.map((series) => (
          <SeriesRow key={series._id} seriesId={series._id.toString()} />
        ))
      )}

    </main>
  );
}
