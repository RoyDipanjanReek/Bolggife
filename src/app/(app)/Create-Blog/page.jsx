"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function page() {
  // const [state, setState] = useState(initialState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // max file size 5mb
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size is too large");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await fetch("/api/post/createPost", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to uplode the blog");
      }
      const data = await response.json();

      setIsUploading(data);
      router.push("/Home");
    } catch (error) {
      console.log("Failed to upload bolg", error);
      alert("Failed to upload bolg");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Blog</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">
            <span className="label-text">Blog Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Blog Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Choose an image for your blog</span>
          </label>

          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        {file && (
          <div>
            <img
              src={URL.createObjectURL(file)}
              alt="Sample image"
              width={300}
              height={300}
              className="w-32 mt-5"
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Uplode Blog"}
        </button>
      </form>
    </section>
  );
}

export default page;
