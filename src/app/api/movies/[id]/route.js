import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";
import cloudinary from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

// GET => Get single movie by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ movie }, { status: 200 });
  } catch (err) {
    console.error("Error fetching movie:", err);
    return NextResponse.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}


export async function DELETE(req, context) {
  const { id } = await context.params; // ✅ await params
  await dbConnect();

  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // Delete poster, trailer, video if they exist
    const resources = [movie.poster?.public_id, movie.trailer?.public_id, movie.video?.public_id];
    for (const res of resources) {
      if (res) {
        try {
          if (res === movie.poster.public_id) {
            await cloudinary.uploader.destroy(res, { resource_type: "image" });
          }
          else { await cloudinary.uploader.destroy(res, { resource_type: "video" }); }
        } catch (err) {
          console.error("Failed to delete Cloudinary resource:", res, err);
        }
      }
    }

    // Delete movie from DB
    await Movie.findByIdAndDelete(id);

    return NextResponse.json({ message: "Movie and media deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedMovie = await Movie.findByIdAndUpdate(id, body, { new: true });

    if (!updatedMovie) {
      return NextResponse.json({ success: false, error: "Movie not found" }, { status: 404 });
    }
    // ✅ Revalidate movies list page so updated data shows
    revalidatePath("/admin/movies/all-movies");
    return NextResponse.json({ success: true, movie: updatedMovie });
  } catch (err) {
    console.error("Movie Update Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
