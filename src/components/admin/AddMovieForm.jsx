"use client";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function AddMovieForm() {
  const router = useRouter();
  const movieNameRef = useRef();
  const genreRef = useRef();
  const descriptionRef = useRef();
  const posterRef = useRef();
  const trailerRef = useRef();
  const videoRef = useRef();

  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({}); // { poster: {url, public_id}, ... }
  const [readyToAdd, setReadyToAdd] = useState(false);



  // helper to upload to cloudinary
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/cloud/upload", {
      method: "POST",
      body: formData,
    });

    return await res.json();
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      toast.info("Uploading files... Please Wait...");

      const files = {
        poster: posterRef.current.files[0],
        trailer: trailerRef.current.files[0],
        video: videoRef.current.files[0],
      };

      const results = {};
      for (const key in files) {
        if (files[key]) {
          const res = await uploadFile(files[key]);
          if (!res.success) throw new Error(res.error);
          results[key] = { url: res.url, public_id: res.public_id };
        }
      }

      setUploadedFiles(results);
      setReadyToAdd(true);
      toast.success("All files uploaded successfully!");
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMovie = async () => {
    try {
      const movieData = {
        movieName: movieNameRef.current.value,
        genre: genreRef.current.value,
        description: descriptionRef.current.value,
        poster: uploadedFiles.poster,
        trailer: uploadedFiles.trailer,
        video: uploadedFiles.video,
      };

      const res = await fetch("/api/movies/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      const data = await res.json();
      if (!res.ok) {
        // rollback: delete uploaded files
        for (const key in uploadedFiles) {
          let resource_type;
          if (key == "poster") {
            resource_type = "image"
          } else {
            resource_type = "video"
          }

          await fetch("/api/cloud/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: uploadedFiles[key].public_id, resource_type: resource_type }),
          });
        }
        throw new Error(data.error || "Failed to add movie");
      }

      toast.success("Movie added successfully!");
      router.refresh(); // ✅ refreshes server components without full reload
    } catch (err) {
      toast.error(`Add Movie failed: ${err.message}`);
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
    <div className="max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">🎬 Add New Movie</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Movie Name</label>
          <input
            ref={movieNameRef}
            type="text"
            placeholder="Enter Movie Name"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">Genre</label>
          <select
            ref={genreRef}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            {genreList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            ref={descriptionRef}
            placeholder="Enter Movie Description"
            className="w-full min-h-40 p-2 rounded bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">Poster</label>
          <input ref={posterRef} type="file" accept="image/*" />
        </div>

        <div>
          <label className="block mb-1">Trailer</label>
          <input ref={trailerRef} type="file" accept="video/*" />
        </div>

        <div>
          <label className="block mb-1">Movie Video</label>
          <input ref={videoRef} type="file" accept="video/*" />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleUpload}
            disabled={uploading || readyToAdd}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            {uploading ? "Uploading..." : "Upload Files"}
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
