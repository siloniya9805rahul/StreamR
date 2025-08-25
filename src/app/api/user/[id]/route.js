// src/app/api/user/[id]/route.js
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const user = await User.findById(params.id).select("-password").lean();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


export async function PUT(req, { params }) {

    try {
        const {id}=await params;
        await dbConnect();
        const data = await req.json();
        const { name, email, avatar } = data;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, avatar },
            { new: true, runValidators: true }
        ).select("-password");



        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

