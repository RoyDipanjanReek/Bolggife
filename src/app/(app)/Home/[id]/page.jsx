import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { notFound } from "next/navigation";
import mongoose from "mongoose"; 
import Image from "next/image";

export default async function BlogDetail({ params }) {
  const { id } = await params;
  await dbConnect();

  // Validate MongoDB ObjectId before querying
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return notFound();
  }

  let post = null;
  try {
    post = await Post.findById(id).lean();
  } catch (e) {
    return notFound();
  }

  if (!post) {
    console.log(`Post not found for id: ${id}`);
    return notFound();
  }

  console.log("Fetched post:", post);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Blog Image */}
      {post.image && 
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          className="w-full h-auto rounded-lg object-cover shadow"
        />
      }

      {/* Blog Title */}
      <h1 className="text-4xl font-bold">{post.title}</h1>

      {/* Blog Content */}
      <div className="prose prose-lg max-w-none text-white font-bold text-2xl">
        {post.content}
      </div>
    </div>
  );
}
