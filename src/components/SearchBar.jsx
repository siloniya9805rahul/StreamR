"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("movie") || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-gray-800 rounded-lg overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-1 bg-gray-800 text-white outline-none"
      />
      <button
        type="submit"
        className="px-3 py-2 bg-red-500 hover:bg-red-600 transition"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
