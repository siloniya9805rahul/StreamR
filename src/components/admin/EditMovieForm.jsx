"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditMovieForm({ movie }) {
  const [movieName, setMovieName] = useState(movie.movieName || "");
  const [description, setDescription] = useState(movie.description || "");
  const [poster, setPoster] = useState(movie.poster || null); // {url, public_id}
  const [loadingPoster, setLoadingPoster] = useState(false);
  const [genre, setGenre] = useState(movie.genre || ""); // single-select for now
  const router = useRouter();
  const handlePosterChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingPoster(true);

    try {
      // Upload new poster
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/cloud/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        toast.error("Poster upload failed");
        setLoadingPoster(false);
        return;
      }

      // Delete old poster if exists
      if (poster?.public_id) {
        await fetch("/api/cloud/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: poster.public_id,
            resource_type: "image",
          }),
        });
      }

      // Update state
      setPoster({
        url: uploadData.url,
        public_id: uploadData.public_id,
      });

      console.log("Poster updated successfully!");
    } catch (err) {
      console.error("Poster upload error:", err);
      toast.error("Error uploading poster");
    } finally {
      setLoadingPoster(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movieName.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!genre) {
      toast.error("Please select a genre");
      return;
    }
    if (!poster) {
      toast.error("Please upload a poster");
      return;
    }

    try {
      console.log("movie title",movieName)
      const res = await fetch(`/api/movies/${movie._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName,
          description,
          genre,
          poster,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Movie updated!");
        router.push(`/admin/movies/all-movies`);
      } else {
        toast.error(data.error || "Failed to update movie");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating movie");
    }
  };
  const genreList = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
  ];
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-5"
    >
      {/* Title */}
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded-lg p-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Genre */}
      <div>
        <label className="block font-medium mb-1">Genre</label>
        <select
          className="w-full border rounded-lg p-2"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value={genre}>-- Select Genre --</option>
          {genreList.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Poster Upload */}
      <div>
        <label className="block font-medium mb-1">Poster</label>
        <div className="relative w-40 h-56 border rounded-lg overflow-hidden">
          {poster ? (
            <img
              src={poster.url}
              alt="Poster"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              No poster
            </div>
          )}

          {/* Edit Icon */}
          <label
            htmlFor="posterInput"
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
          >
            {loadingPoster ? (
              <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
            ) : (
              <Pencil className="w-5 h-5 text-gray-600" />
            )}
          </label>
          <input
            id="posterInput"
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loadingPoster}
            onChange={handlePosterChange}
          />
        </div>
      </div>

      {/* Submit */}
      <button
  type="submit"
  disabled={loadingPoster}
  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
    loadingPoster ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  Save Changes
</button>
    </form>
  );
}
