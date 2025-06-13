"use client";
import BlogCard from "@/app/component/BlogCard";
import SearchBar from "@/app/component/SearchBar";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function page() {
  const [blogs, setBlog] = useState([]);
  const [loading, setLoding] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const responce = await axios.get("/api/post/getPost", {
        withCredentials: true,
      });

      if (Array.isArray(responce.data?.data)) {
        setBlog(responce.data.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log("Failed to fetch Blogs", error);
      setError("Failed to fetch blogs");
    } finally {
      setLoding(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoaderCircle />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="hidden sm:block text-2xl font-bold">Blogs</h1>

        <SearchBar />
      </div>

      {blogs.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No blogs available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-2">
          {blogs.map((blog) => (
            <div key={blog._id} className="flex justify-center">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default page;
