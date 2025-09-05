export const dynamic = "force-dynamic"; // disables caching
//metadata
export const metadata = {
  title: " StreamR All Movies",
  description: "View all movie of StreamR",
};

// src/app/admin/movies/page.jsx
import DeleteMovieButton from "@/components/admin/DeleteMovieButton";
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";
import Image from "next/image";
import Link from "next/link";



export default async function AllMoviesPage({ searchParams }) {
  await dbConnect();

  // Get page number from query (?page=2)
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const limit = 8;
  const skip = (page - 1) * limit;

  // Fetch movies with pagination
  const movies = await Movie.find({},"movieName poster genre")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const totalMovies = await Movie.countDocuments();
  const totalPages = Math.ceil(totalMovies / limit);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">All Movies</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Movie Name</th>
            <th className="p-2 border">Poster</th>
            <th className="p-2 border">Genre</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id} className="text-center">
              <td className="p-2 border">{movie.movieName}</td>
              <td className="p-2 border">
              <Image
              src={movie.poster.url}
              alt={"Movie Poster"}
              width={
                100
              }
              height={100}
              className="w-16 h-10 rounded object-cover justify-self-center"
              />
              </td>
              <td className="p-2 border">{movie.genre}</td>
              <td className="p-2 border ">
                <div className="flex gap-2 justify-center items-center h-full">

                <Link
                  href={`/admin/movies/${movie._id}/edit`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                  Edit
                </Link>
                <DeleteMovieButton id={movie._id.toString()} />
                  </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i + 1}
            href={`/admin/movies/all-movies/?page=${i + 1}`}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-gray-800 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
