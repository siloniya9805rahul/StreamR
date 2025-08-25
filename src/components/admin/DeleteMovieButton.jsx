"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function DeleteMovieButton({ id }) {
    const router = useRouter();
    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
            const data = await res.json();

            if (res.ok) {
                toast.success("Movie deleted successfully!");
                router.refresh(); // ✅ refreshes server components without full reload
            } else {
                toast.error(data.error || "Failed to delete movie");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
            Delete
        </button>
    );
}
