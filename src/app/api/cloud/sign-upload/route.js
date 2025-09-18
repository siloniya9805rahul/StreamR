import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, resource_type } = body;

    if (!key && !resource_type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Cloudinary upload preset folder path (StreamR/Images or StreamR/Videos)
    const fullFolder = `StreamR/${key}`
    const chunk_size=6000000;

    // Create signed upload parameters
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: fullFolder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: fullFolder,
      resource_type,
      chunk_size
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
