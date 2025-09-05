"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When route or query changes → start loader
    setLoading(true);

    // Wait for React to render the new page before hiding
    const handlePageRendered = requestAnimationFrame(() => {
      setLoading(false);
    });

    return () => cancelAnimationFrame(handlePageRendered);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-gradient-to-b from-black/60 via-black/30 to-transparent">
      <div className="h-12 w-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}
