import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return res.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, image } = req.body;

    if (!title || !content || !image) {
      return res.json(
        { error: "Title, content and image are required" },
        { status: 401 }
      );
    }
    const createPost = new Post({
      title,
      content,
      image,
    });

    await createPost.save();

    return NextResponse.json({
      message: "uplode successfully",
      data: createPost,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message || "Error in creating post",
    });
  }
}
