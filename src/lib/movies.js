// src/lib/movies.js
import dbConnect from "./db";
import Movie from "@/models/Movie";



export async function getFeaturedMovie(genre, search) {
  await dbConnect();

  // Build query dynamically
  let query = {};
  if (genre) query.genre = genre;
  if (search) {
    query.movieName = { $regex: `^${search}`, $options: "i" }; // starts with search term
  }

  // Fetch one featured movie (newest first)
  const featured = await Movie.findOne(query).sort({ createdAt: -1 }).lean();
  return featured;
}

