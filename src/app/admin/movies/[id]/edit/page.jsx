// app/admin/movies/[id]/edit/page.jsx (Server Component)
import dbConnect from "@/lib/db";
import Movie from "@/models/Movie";
import EditMovieForm from "@/components/admin/EditMovieForm";

export const metadata = {
  title: "Edit Movie || StreamR ",
  description: "Edit Movie Details ",
};

export default async function EditMoviePage({ params }) {
  await dbConnect();
  const {id} = await params;
  const movie = await Movie.findById(id,"movieName poster genre description").lean();
  

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Movie</h1>
      <EditMovieForm movie={JSON.parse(JSON.stringify(movie))} />
    </div>
  );
}
