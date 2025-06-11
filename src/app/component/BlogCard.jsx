import React from "react";

const BlogCard = ({ blog }) => {
  return (
    <div className="card bg-base-300 shadow-sm w-96 h-[380px] overflow-hidden">
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
        <p className="text-sm whitespace-pre-wrap break-words">{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogCard;
