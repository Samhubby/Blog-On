import { Schema, Types, model } from "mongoose";

const blogSchema = Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    coverImage: {
      type: String,
      default: "/cover/cover.jpg",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Blog = model("Blog", blogSchema);
