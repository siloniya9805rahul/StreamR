import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req, { params }) {
  await dbConnect();
  const { id } = params;
  const { password } = await req.json();

  if (!password || password.length < 6) {
    return new Response(JSON.stringify({ message: "Password too short!" }), {
      status: 400,
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(
      id,
      { password: hashed },
      { new: true }
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Password updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
