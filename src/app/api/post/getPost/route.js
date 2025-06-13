import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const post = await Post.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        data: post,
        message: "All post are here",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error in getting post" },
      { status: 401 }
    );
  }
}
