import Series from "@/models/Series";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

// Create a new Series
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, genre, movieIds } = body;

    if (!title || !genre || !movieIds || movieIds.length === 0) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newSeries = await Series.create({ title, genre, movieIds });
    return NextResponse.json(
      { message: "Series created successfully", series: newSeries ,success: true},
      { status: 201 }
    );
  } catch (err) {
    console.error("Error Creating Series:", err);
    return NextResponse.json(
      { error: "Failed to create Series" },
      { status: 500 }
    );
  }
}

// Get all Series with populated movies
export async function GET() {
  try {
    await dbConnect();
    const series = await Series.find().populate("movieIds"); // ✅ corrected
    return NextResponse.json(series);
  } catch (err) {
    console.error("Error Fetching Series:", err);
    return NextResponse.json(
      { error: "Failed to fetch Series" },
      { status: 500 }
    );
  }
}
