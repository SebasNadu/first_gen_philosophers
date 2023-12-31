import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    body: { type: String, required: true },
    tags: { type: [{ type: String, required: true }], default: [] },
    picture: { type: String, required: false },
    active: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    countLikes: { type: Number, default: 0 },
    comments: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      default: [],
    },
    countComments: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
