"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Load from "./Loader";

export default function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      setLoading(true)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      console.log("Login successful!");
      // Redirect after login
      window.location.href = "/"; 
    } catch (error) {
      toast.error("Something went wrong!");
    }finally{
      setLoading(false)
    }
  }


  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
      {/* Header: logo left + signup right */}
      <div className="flex items-center justify-between mb-6">
        {/* Logo (plain text, no link) */}
        <div className="text-2xl font-bold text-blue-600">StreamR</div>

        {/* Signup button */}
        <Link
          href="/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Login to Your Account
      </h2>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            ref={emailRef}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Password</label>
          <input
            type="password"
            ref={passwordRef}
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          {loading?<Load color={"white"} />:"Login"}
        </button>
      </form>
    </div>
  );
}
