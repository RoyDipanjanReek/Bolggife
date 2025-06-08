"use client";
import TextArea from "@/app/component/TextArea";
import { Input } from "@mui/material";
import React, { useState } from "react";

const initialState = {
  title: "",
  description: "",
  photo: "",
};

function page() {
  const [state, setState] = useState(initialState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <section className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Upload Blog</h1>

      <form className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
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
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Choose an image file</span>
          </label>

          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full"
          />
        </div>
        {state.photo && (
          <div>
            <Image
              src={URL.createObjectURL(state.photo)}
              priority
              alt="Sample image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-32 mt-5"
            />
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary" 
        >
        Submit
        </button>
      </form>
    </section>
  );
}

export default page;
