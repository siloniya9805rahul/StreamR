import SeriesForm from "@/components/admin/SeriesForm";
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";

//metadata
export const metadata = {
  title: " StreamR All Series",
  description: "View all Series of StreamR",
};

export default async function SeriesAdminPage() {
  await dbConnect();

  // Fetch movies directly on server
  const movies = await Movie.find().sort({ createdAt: -1 }).lean();
   // Fetch unique genres for dropdown
  const genreList = await Movie.distinct("genre");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Series</h1>

      {/* Pass movies down to client form */}
      <SeriesForm movies={JSON.parse(JSON.stringify(movies))} genreList={genreList} />
    </div>
  );
}
