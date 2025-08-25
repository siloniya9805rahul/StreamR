"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminHamburger() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-15 top-7 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="fixed top-15 right-0 mt-2 w-48 bg-gray-900 text-white rounded-lg shadow-lg p-2 
          animate-slideIn z-50 min-h-screen"
        >
          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/movies/all-movies"
            className="block px-4 py-2 rounded hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            🎬 See All Movies
          </Link>
          <Link
            href="/admin/movies/add-movie"
            className="block text-white px-4 py-2 rounded hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            ➕ Add Movie
          </Link>
          <Link
            href="/admin/series/add-series"
            className="block text-white px-4 py-2 rounded hover:text-yellow-400"
            onClick={() => setOpen(false)}
          >
            ➕ Add Series
          </Link>
          <Link href="/" className="fixed bottom-30 right-5 bg-red-600 px-4 py-2 rounded text-center hover:bg-red-700">
                      🔙 Back to Home
                    </Link>
        </div>
      )}
    </div>
  );
}
