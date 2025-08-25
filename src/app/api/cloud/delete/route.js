import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const { public_id ,resource_type} = await req.json();
    if (!public_id) {
      return NextResponse.json({ success: false, error: "No public_id provided" }, { status: 400 });
    }

    await cloudinary.uploader.destroy(public_id, { resource_type: resource_type });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
