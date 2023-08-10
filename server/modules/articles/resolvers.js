import Article from "./Article.js";
import User from "../users/User.js";
import Comment from "../comments/Comment.js";
import validator from "validator";

export const articleResolver = {
  Query: {
    getArticleById: async (_, { id }) => {
      return Article.findById(id).catch((error) => {
        throw error;
      });
    },

    getArticles: async (_, { total }) => {
      if (!total) {
        // If total is not provided, return all articles
        return Article.find()
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw error;
          });
      }
      // If total is provided, return the number of articles specified by total
      return Article.find()
        .sort({ createdAt: -1 })
        .limit(total)
        .catch((error) => {
          throw error;
        });
    },
  },

  Mutation: {
    createArticle: async (_, { articleInput }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const { title, body, tags } = articleInput;
      const errors = [];
      // Validate input
      if (validator.isEmpty(title)) {
        errors.push({ message: "Title is required" });
      }
      if (validator.isEmpty(body)) {
        errors.push({ message: "Body is required" });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input(s)");
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const currentUser = await User.findById(contextValue.user.userId);
      if (!currentUser) {
        const error = new Error("Invalid user");
        error.code = 401;
        throw error;
      }
      const article = new Article({
        title,
        body,
        tags,
        user: currentUser,
      });
      const savedArticle = await article.save();
      return savedArticle;
    },

    updateArticle: async (_, { id, articleInput }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const { title, body, tags } = articleInput;
      const updatedFields = {};
      // Validate input and update fields
      if (title !== undefined && title !== "") {
        updatedFields.title = title;
      }
      if (body !== undefined && body !== "") {
        updatedFields.body = body;
      }
      if (tags !== undefined) {
        updatedFields.tags = tags;
      }
      const updatedArticle = await Article.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true }
      ).catch((error) => {
        throw error;
      });
      return updatedArticle;
    },

    deleteArticle: async (_, { id }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      try {
        const article = await Article.findById(id);
        if (!article) {
          const error = new Error("Article not found");
          error.code = 404;
          throw error;
        }
        // Check if the user is the owner of the article
        if (article.user.toString() !== contextValue.user.userId) {
          const error = new Error("Not authorized");
          error.code = 403;
          throw error;
        }
        // Delete all comments associated with the article
        await Comment.deleteMany({ article: id });
        // Delete the article
        await Article.findByIdAndDelete(id);
        return true;
      } catch (error) {
        if (!error.code) {
          error.code = 500;
        }
        throw error;
      }
    },
  },
};
