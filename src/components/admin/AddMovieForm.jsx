"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Load from "../Loader";

export default function AddMovieForm() {
  const [movieName, setMovieName] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");

  const [poster, setPoster] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);

  const [progress, setProgress] = useState({ poster: 0, trailer: 0, video: 0 });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [readyToAdd, setReadyToAdd] = useState(false);

  // 🔹 Helper: Direct Cloudinary upload with progress
  const uploadFile = async (file, type, key) => {
    const sigRes = await fetch("/api/cloud/sign-upload", {
      method: "POST",
      body: JSON.stringify({ resource_type: type, key }),
      headers: { "Content-Type": "application/json" },
    });
    const { cloudName, apiKey, timestamp, signature, folder, chunk_size, resource_type } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("resource_type", resource_type);
    formData.append("chunk_size", chunk_size);         // 👈 added chunked size


    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress((prev) => ({ ...prev, [key]: percent }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
        else reject(new Error(xhr.responseText));
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    try {
      if (!poster || !trailer || !video) {
        toast.info("Please Select All Files")
        return
      }
      setIsUploading(true)
      toast.info("Uploading files...");
      const results = {};

      if (poster) results.poster = await uploadFile(poster, "image", "poster");
      if (trailer) results.trailer = await uploadFile(trailer, "video", "trailer");
      if (video) results.video = await uploadFile(video, "video", "video");

      setUploadedFiles(results);
      setReadyToAdd(true);
      toast.success("All files uploaded!");
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    }
    finally {
      setIsUploading(false)
    }
  };

  const handleAddMovie = async () => {
    try {
      const movieData = {
        movieName,
        genre,
        description,
        poster: uploadedFiles.poster,
        trailer: uploadedFiles.trailer,
        video: uploadedFiles.video,
      };

      const res = await fetch("/api/movies/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (!res.ok) throw new Error("Failed to add movie");
      toast.success("Movie added successfully!");

      // reset form
      setMovieName("");
      setGenre("");
      setDescription("");
      setPoster(null);
      setTrailer(null);
      setVideo(null);
      setProgress({ poster: 0, trailer: 0, video: 0 });
      setUploadedFiles({});
      setReadyToAdd(false);
    } catch (err) {
      toast.error(`Failed to Add Movie : ${err.message}`);
    }
  };

  const genreList = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller"];

  return (
    <div className="max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">🎬 Add New Movie</h2>

      <div className="space-y-4">
        {/* Movie Name */}
        <div>
          <label className="block mb-1">Movie Name</label>
          <input
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            type="text"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            <option value="">-- Select Genre --</option>
            {genreList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-40 p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        {/* Poster Upload */}
        <div>
          <label className="block mb-1">Poster</label>
          <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files[0])} />
          {progress.poster > 0 && (
            <div className="mt-1 h-2 bg-gray-700 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${progress.poster}%` }} />
            </div>
          )}
        </div>

        {/* Trailer Upload */}
        <div>
          <label className="block mb-1">Trailer</label>
          <input type="file" accept="video/*" onChange={(e) => setTrailer(e.target.files[0])} />
          {progress.trailer > 0 && (
            <div className="mt-1 h-2 bg-gray-700 rounded">
              <div className="h-2 bg-purple-500 rounded" style={{ width: `${progress.trailer}%` }} />
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="block mb-1">Movie Video</label>
          <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
          {progress.video > 0 && (
            <div className="mt-1 h-2 bg-green-500 rounded" style={{ width: `${progress.video}%` }} />
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleUpload}
            disabled={readyToAdd}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            {readyToAdd ? "Files Uploaded!" : (isUploading ?<Load color={"white"} classes="mx-auto" /> : "Upload Files")}
          </button>

          <button
            onClick={handleAddMovie}
            disabled={!readyToAdd}
            className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
          >
            Add Movie
          </button>
        </div>
      </div>
    </div>
  );
}
