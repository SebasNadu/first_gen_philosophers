import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String, required: true }],
    picture: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
