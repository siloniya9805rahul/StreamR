"use client";

import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Dummy user for now (replace with jwt verify logic if needed)
  const user = { isAdmin: true };

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold tracking-wide text-red-500">
        StreamR
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <SearchBar />
      </div>

      {/* Desktop Profile */}
      <div className="hidden md:block relative group">
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
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <div className="block px-4 py-2 hover:bg-gray-700 rounded-b-lg text-red-400">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none text-white"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="fixed top-20 right-0 min-h-screen sm:w-2/3 w-3/4 bg-gray-900 text-white flex flex-col p-4 gap-3 md:hidden shadow-lg">
          <SearchBar />
          {user?.isAdmin && (
            <Link
              href="/admin"
              className="px-2 py-2 hover:bg-gray-700 rounded"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
          <Link
            href="/dashboard"
            className="px-2 py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <div className="px-2 py-2 hover:bg-gray-700 rounded text-red-400">
            <LogoutButton />
          </div>
        </div>
      )}
    </nav>
  );
}
