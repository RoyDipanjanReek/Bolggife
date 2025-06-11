import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

//  Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // Optional Clerk Auth (comment out during Postman testing)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const file = formData.get("file");

    if (!title || !content || !file ) {
      // Check if 'file' is actually an instance of File object
      return NextResponse.json(
        { error: "Title, content, and a valid image file are required." },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_FILE_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`,
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF, and WebP image files are allowed." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let cloudinaryResult;
    try {
      cloudinaryResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "next-cloudinary-uploads",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(new Error("Failed to upload image to Cloudinary."));
            }
            resolve(result);
          }
        );
        uploadStream.end(buffer); // Send the image buffer
      });
    } catch (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || "Cloudinary upload failed." },
        { status: 500 }
      );
    }

    if (!cloudinaryResult || !cloudinaryResult.public_id) {
      throw new Error("Cloudinary did not return a valid public_id.");
    }

    // Save to MongoDB
    const newPost = new Post({
      title,
      content,
      publicId: cloudinaryResult.public_id,
      file: cloudinaryResult.secure_url, 
      // authorId: userId, 
    });

    await newPost.save();

    return NextResponse.json({
      message: "Upload successful",
      data: newPost,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
