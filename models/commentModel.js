import { Schema, Types, model } from "mongoose";

const commentSchema = Schema(
  {
    comment: {
      type: String,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    blog: {
      type: Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true }
);

export const Comment = model("Comment", commentSchema);
