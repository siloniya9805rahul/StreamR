"use client";

import Link from "next/link";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Signup successful 🎉");
      window.location.href = "/login"; // redirect after signup
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Logo & Login */}
      <div className="w-full flex justify-between items-center px-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-600">StreamR</h1>
        <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Login
                </Link>
      </div>

      <form
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>

        <input
          type="text"
          ref={nameRef}
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="email"
          ref={emailRef}
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <input
          type="password"
          ref={passwordRef}
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
