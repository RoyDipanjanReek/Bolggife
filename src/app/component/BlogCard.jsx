import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import realtiveTime from "dayjs/plugin/relativeTime";

dayjs.extend(realtiveTime);
const BlogCard = ({ blog }) => {
  const [showFull, setShowFull] = useState(false);
  const maxLength = 150;
  const router = useRouter();

  const displayText = showFull
    ? blog.content
    : blog.content.length > maxLength
    ? blog.content.slice(0, maxLength) + "..."
    : blog.content;

  const handleRedirect = () => {
    router.push(`/blog/${blog._id}`);
  };

  const formatDuration = useCallback((second) => {
    const minutes = Math.floor(second / 60)
    const remainingSeconds = Math.round(second % 60);

   return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  },[])

  return (
    <div
      
      className="card bg-base-300 shadow-sm w-96 h-[380px] overflow-hidden"
    >
      <figure className="h-[180px] w-full overflow-hidden">
        {blog.file && (
          <img
            src={blog.file}
            alt={blog.title}
            className="w-full h-60 object-cover"
          />
        )}
      </figure>
      <div className="card-body p-4 overflow-y-auto">
        <h2 className="card-title text-base">{blog.title}</h2>
        <p className="text-sm whitespace-pre-wrap break-words">
          {displayText}{" "}
          {blog.content.length > maxLength && (
            <button
              onClick={handleRedirect}
              className="text-blue-600 text-xs underline ml-1 hover:cursor-pointer"
            >
              {showFull ? "Show less" : "Show more"}
            </button>
          )}
        </p>
        <p className="text-sm text-base-content opacity-70 mb-1">
          Uploaded {dayjs(blog.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
