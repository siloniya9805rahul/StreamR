// app/profile/page.jsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {


  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>You are not logged in.</p>
      </div>
    );
  }

  // Decode token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>Invalid or expired token.</p>
      </div>
    );
  }

  // Fetch user
  await dbConnect();
  const user = await User.findById(decoded.id).lean();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <BackButton />
      <div className=" flex flex-col items-center px-6">
        <div className="max-w-sm sm:max-w-md w-full bg-gray-900 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col items-center">
            {/* Profile Image */}
            <img
              src={user?.avatar?.url}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover"
            />

            <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>

          {/* Info Section */}
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-gray-400">Joined On</p>
              <p className="text-lg">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}

              </p>
            </div>
          </div>

          <div className="mt-8 text-center flex flex-col space-y-3">
            <Link
              href={`/users/${decoded.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Edit Profile
            </Link>

            <Link
              href={`/users/${decoded.id}/change-password`}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg"
            >
              Change Password
            </Link>

            <span
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex justify-center"
            >
              <LogoutButton />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
