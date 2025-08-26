// app/admin/layout.jsx
import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import AdminHamburger from "@/components/admin/AdminHamburger";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;
  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  // ✅ Security: only allow admins
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        ❌ Access Denied. Admins Only.
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 bg-gray-900 text-white md:flex flex-col p-6 space-y-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <nav className="flex flex-col gap-4">
            <Link href="/admin" className="hover:text-yellow-400">Dashboard</Link>
            <Link href="/admin/movies/add-movie" className="hover:text-yellow-400">➕ Add Movie</Link>
            <Link href="/admin/movies/all-movies" className="hover:text-yellow-400">🎬 See All Movies</Link>
            <Link href="/admin/series/add-series" className="hover:text-yellow-400">➕ Add Series</Link>
          </nav>
          <Link href="/" className="mt-auto bg-red-600 px-4 py-2 rounded text-center hover:bg-red-700">
            🔙 Back to Home
          </Link>
        </aside>
        
        <main className="flex-1 bg-gray-100 py-10  md:p-6">{children}</main>
      </div>
      <AdminHamburger />
    </>
  );
}
