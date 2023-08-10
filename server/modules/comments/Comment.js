import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
