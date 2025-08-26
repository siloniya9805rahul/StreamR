"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

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
      className="flex items-center bg-gray-800 rounded-full overflow-hidden w-full sm:w-100"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm sm:text-base outline-none"
      />
      <button
        type="submit"
        className="px-3 py-2.5 bg-red-500 hover:bg-red-600 transition flex items-center justify-center"
      >
        <Search size={18} />
      </button>
    </form>
  );
}
