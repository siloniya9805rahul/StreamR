"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function SeriesForm({ movies ,genreList}) {
  const [titleSeries, setTitleSeries] = useState("");
  const [genreSeries, setGenreSeries] = useState("");
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 7;
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handleCheckboxChange = (id) => {
    setSelectedMovies((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedMovies.length === 0) {
    toast.error("Please select at least one movie!");
    return;
  }

  const res = await fetch("/api/series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleSeries,
      genre: genreSeries,
      movieIds: selectedMovies,
    }),
  });

  const data = await res.json();
  if (data.success) {
    toast.success("Series created!");
    setTitleSeries("");
    setGenreSeries("");
    setSelectedMovies([]);
    setCurrentPage(1);
  } else {
    toast.error("Error: " + data.error);
  }
};


  // Pagination slice
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = movies.slice(startIndex, startIndex + moviesPerPage);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Series Title */}
      <div>
        <label className="block font-medium mb-2">Series Title</label>
        <input
          type="text"
          value={titleSeries}
          onChange={(e) => setTitleSeries(e.target.value)}
          className="border rounded p-2 w-full"
          placeholder="Enter series Name"
          required
        />
      </div>
      {/* Series Genre */}
      <div>
        <label className="block font-medium mb-2">Series Genre</label>
        
        <select
          value={genreSeries}
          onChange={(e) => setGenreSeries(e.target.value)}
          className="w-full p-2 rounded border border-gray-700"
        >
          <option value="">-- Select Genre --</option>
          {genreList.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
        </select>
      </div>

      {/* Movies with Pagination */}
      <div>
        <label className="block font-medium mb-2">Select Movies</label>
        <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto border rounded p-3">
  {currentMovies.map((movie) => (
    <div key={movie._id} className="flex items-center gap-2">
      <input
        type="checkbox"
        id={`movie-${movie._id}`}
        checked={selectedMovies.includes(movie._id)}
        onChange={() => handleCheckboxChange(movie._id)}
      />
      <label
        htmlFor={`movie-${movie._id}`}
        className="cursor-pointer text-sm sm:text-base"
      >
        {movie.movieName}
      </label>
    </div>
  ))}
</div>

{/* Pagination */}
<div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    <button
      key={page}
      type="button"
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded text-sm sm:text-base ${
        currentPage === page
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {page}
    </button>
  ))}
</div>

      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Series
      </button>
    </form>
  );
}
