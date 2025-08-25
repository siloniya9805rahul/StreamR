import Link from "next/link";
import { User } from "lucide-react";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function Navbar() {
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
  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-wide text-red-500">
        StreamR
      </Link>

      {/* Navigation + Search */}
      <div className="flex items-center gap-8">
        {/* <Link href="/movies" className="hover:text-red-400 transition">
          Movies
        </Link>
        <Link href="/series" className="hover:text-red-400 transition">
          Series
        </Link> */}

        {/* Search Component (Client) */}
        <SearchBar />
      </div>

      {/* Profile Menu */}
      <div className="relative group">
        <button className="flex items-center gap-2 hover:text-red-400 transition">
          <User size={22} />
          <span className="hidden sm:inline">Profile</span>
        </button>
        <div className="absolute right-0 mt-0.5 w-40 bg-gray-900 rounded-lg shadow-lg hidden group-hover:block">
          
          {user?.isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
              >
                Admin
              </Link>
            )}
          <Link
            href="/dashboard"
            className="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
          >
            Dashboard
          </Link>
          
          <div
            className="block px-4 py-2 hover:bg-gray-700 rounded-b-lg text-red-400"
          >
          <LogoutButton/>
          </div>
        </div>
      </div>
    </nav>
  );
}
