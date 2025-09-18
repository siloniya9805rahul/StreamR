// metadata 
export const metadata = {
  title: " StreamR Add a Movies",
  description: "Adding a movie in video streaming platform named StreamR",
};

// app/admin/add-movie/page.jsx (Server Component)
import AddMovieForm from "@/components/admin/AddMovieForm";

export default function AddMoviePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 mx-4 md:mx-0">Upload a Movie</h1>
      <AddMovieForm />
    </div>
  );
}
