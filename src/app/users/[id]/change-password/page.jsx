"use client";

//metadata
export const metadata = {
  title: "Change Password ||StreamR",
  description: "Changing User password.",
};

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { toast } from "react-toastify";

export default async function ForgetPasswordPage({ params }) {
  const { id } = await params;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${id}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating password");

      toast.success("Password updated successfully!");
      router.push("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
<BackButton/>
      <div className="flex items-center justify-center ">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

          

          <div className="mb-4">
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
