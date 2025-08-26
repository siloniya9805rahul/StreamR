//metadata
export const metadata = {
  title: "Edit User | StreamR",
  description: "edit user details like name email profile picture || StreamR",
};

import dbConnect from "@/lib/db";
import User from "@/models/User";
import EditProfileForm from "@/components/EditProfileForm";
import BackButton from "@/components/BackButton";

export default async function EditUser({ params }) {
  await dbConnect();
  const { id } = await params;

  let user = null;
  try {
    user = await User.findById(id).lean();
  } catch (err) {
    console.error("Error fetching user:", err);
  }
  if (!user) return <div className="flex min-h-screen w-full justify-center items-center font-extrabold text-2xl sm:text-5xl">User not found</div>;

  return (
    <main className="bg-black text-white min-h-screen">
      <BackButton />
      <div className=" flex justify-center items-start sm:items-center sm:px-6 py-10">
        <div className="w-full max-w-lg bg-gray-900 p-6 rounded-2xl shadow-xl">
          <h1 className="text-xl sm:text-2xl font-bold text-center">Edit Profile</h1>
          <EditProfileForm user={JSON.parse(JSON.stringify(user))} />
        </div>
      </div>

    </main>
  );
}
