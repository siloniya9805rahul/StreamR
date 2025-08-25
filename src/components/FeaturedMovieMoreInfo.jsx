"use client";

import { useState } from "react";

export default function FeaturedMovieMoreInfo({ description }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShow(!show)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 h-10 rounded-lg font-semibold"
      >
        {show ? "Hide Info" : "More Info"}
      </button>

      {show && (
        <p className="mt-2 max-w-md bg-gray-800 p-3 rounded-md">
          {description}
        </p>
      )}
    </div>
  );
}
