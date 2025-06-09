import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const url = new URL(request.nextUrl);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Delete image from cloudinary 
    if (post.imagePublicId) {
      await cloudinary.v2.uploader.destroy(post.imagePublicId);
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error in deleting the post" },
      { status: 500 }
    );
  }
}
