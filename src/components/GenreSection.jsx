// src/components/GenreSection.jsx
import Link from "next/link";

export default function GenreSection({ selectedGenre,genreList }) {
 genreList.unshift("All")
  return (
    <div className="flex flex-wrap gap-3 py-4 px-5">
      {genreList.map((genre) => {
        const isActive = selectedGenre === genre || (!selectedGenre && genre === "All");

        return (
          <Link
            key={genre}
            href={genre === "All" ? "/" : `/?genre=${genre}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {genre}
          </Link>
        );
      })}
    </div>
  );
}
