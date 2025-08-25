import dbConnect from "@/lib/dbConnect";
import Movie from "@/models/Movie";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 8;
  const skip = (page - 1) * limit;

  try {
    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    return Response.json(
      { movies, totalPages, currentPage: page },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
