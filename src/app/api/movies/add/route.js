import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";

// POST => Add a new movie
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { movieName, genre, poster, trailer, video, description } = body;

    if (!movieName || !genre || !poster || !trailer || !video || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newMovie = await Movie.create({
      movieName,
      genre,
      poster,
      trailer,
      video,
      description,
    });

    return NextResponse.json(
      { message: "Movie added successfully", movie: newMovie },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding movie:", err);
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
  }
}


