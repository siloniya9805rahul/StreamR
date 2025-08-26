"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <div className="ml-10 pt-8 mr-10 mb-10">

    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
      >
      <ArrowLeft size={18} />
      Back
    </button>
        </div>
  );
}
