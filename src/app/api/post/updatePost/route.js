import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request) {
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

     // Update the post from here
    const updatedPost = await Post.findByIdAndUpdate(
      post.postId,
      {
        $set: {
          title: post.title,
          content: post.content,
          file: post.file,
        },
      },
      { new: true }
    );

    return NextResponse.json(
      updatedPost,
      { message: "Post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error in updateing the post" },
      { status: 500 }
    );
  }
}
