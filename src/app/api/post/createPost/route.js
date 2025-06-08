import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export async function POST(req, res) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return res.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.json(
        { error: "Title, content are required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file found" }, { status: 400 });
    }

      const result = await new Promise(
      (resolve, reject) => {
        const uplodeStream = cloudinary.uploader.upload_stream(
          { folder: "next-cloudinary-uploads" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uplodeStream.end(buffer);
      }
    );

    const createPost = new Post({
      title,
      content,
      publicId: result.public_id,
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
