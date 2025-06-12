import dbConnect from "@/app/db/dbSetup";
import Post from "@/app/models/Post.model";
import { notFound } from "next/navigation";
export default async function BlogDetail({ params }) {
  const { id } = params;
  console.log("PARAMS:", params);
  await dbConnect();

  const post = await Post.findById(id);
  console.log("FETCHED POST:", post);

  if (!post) {
    return <div>404 | Post not found</div>;
    notFound();
  }


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
