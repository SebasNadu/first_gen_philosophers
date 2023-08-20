import Comment from "./Comment.js";
import Article from "../articles/Article.js";
import User from "../users/User.js";
import validator from "validator";

export const commentResolver = {
  Query: {
    getCommentById: async (_, { id }) => {
      return Comment.findById(id).catch((error) => {
        throw error;
      });
    },

    getCommentsByArticle: async (_, { articleId, total }) => {
      if (validator.isEmpty(articleId)) {
        const error = new Error("Article is required");
        error.code = 422;
        throw error;
      }
      // If total is not provided, return all comments
      if (!total) {
        return Comment.find({ article: articleId })
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw error;
          });
      }
      // If total is provided, return the number of comments specified by total
      return Comment.find({ article: articleId })
        .sort({ createdAt: -1 })
        .limit(total)
        .catch((error) => {
          throw error;
        });
    },

    getCommentsByUser: async (_, { userId, total }) => {
      if (validator.isEmpty(userId)) {
        const error = new Error("User is required");
        error.code = 422;
        throw error;
      }
      // If total is not provided, return all comments
      if (!total) {
        return Comment.find({ user: userId })
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw error;
          });
      }
      // If total is provided, return the number of comments specified by total
      return Comment.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(total)
        .catch((error) => {
          throw error;
        });
    },
  },

  Mutation: {
    createComment: async (_, { commentInput }, contextValue) => {
      // authenticate user
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const { content, articleId } = commentInput;
      const errors = [];
      if (validator.isEmpty(content)) {
        errors.push({ message: "Content is required" });
      }
      if (validator.isEmpty(articleId)) {
        errors.push({ message: "Article is required" });
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
      const article = await Article.findById(articleId);
      if (!article) {
        const error = new Error("Invalid article");
        error.code = 401;
        throw error;
      }
      const comment = new Comment({
        content,
        article,
        user: currentUser,
      });
      // save comment to database
      const createdComment = await comment.save();
      // add comment to article
      article.comments.push(createdComment);
      article.countComments = article.comments.length;
      await article.save();
      return createdComment;
    },

    updateComment: async (_, { id, content }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const errors = [];
      if (validator.isEmpty(content)) {
        errors.push({ message: "Content is required" });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input(s)");
        error.data = errors;
        error.code = 422;
        throw error;
      }
      // check if comment exists and update it
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content },
        {
          new: true,
        }
      ).catch((error) => {
        throw error;
      });
      return updatedComment;
    },

    deleteComment: async (_, { id }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      try {
        const comment = await Comment.findById(id);
        if (!comment) {
          const error = new Error("Invalid comment");
          error.code = 401;
          throw error;
        }
        // check if user is authorized to delete comment
        if (comment.user.toString() !== contextValue.user.userId) {
          const error = new Error("Not authorized");
          error.code = 403;
          throw error;
        }
        // delete comment
        await Comment.findByIdAndDelete(id);
        return true;
      } catch (error) {
        if (!error.code) {
          error.code = 500;
        }
        throw error;
      }
    },

    likeComment: async (_, { id }, contextValue) => {
      try {
        if (!contextValue.user) {
          const error = new Error("Not authenticated");
          error.code = 401;
          throw error;
        }
        const comment = await Comment.findById(id);
        if (!comment) {
          const error = new Error("Comment not found");
          error.code = 404;
          throw error;
        }
        const currentUser = await User.findById(contextValue.user.userId);
        if (!currentUser) {
          const error = new Error("Invalid user");
          error.code = 401;
          throw error;
        }
        // Check if the user has already liked the Comment
        if (comment.likes && comment.likes.includes(currentUser.id)) {
          const error = new Error("Already liked");
          error.code = 403;
          throw error;
        }
        // Add the user to the likes array
        comment.likes.push(currentUser);
        comment.likesCount = comment.likesCount + 1;
        await comment.save();
        return true;
      } catch (error) {
        if (!error.code) {
          error.code = 500;
        }
        throw error;
      }
    },

    unlikeComment: async (_, { id }, contextValue) => {
      try {
        if (!contextValue.user) {
          const error = new Error("Not authenticated");
          error.code = 401;
          throw error;
        }
        const comment = await Comment.findById(id);
        if (!comment) {
          const error = new Error("Comment not found");
          error.code = 404;
          throw error;
        }
        const currentUser = await User.findById(contextValue.user.userId);
        if (!currentUser) {
          const error = new Error("Invalid user");
          error.code = 401;
          throw error;
        }
        // Check if the user has already liked the comment
        if (!comment.likes || !comment.likes.includes(currentUser.id)) {
          const error = new Error("Not liked");
          error.code = 403;
          throw error;
        }
        // Remove the user from the likes array
        comment.likes.pull(currentUser);
        comment.likesCount = comment.likesCount - 1;
        await comment.save();
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
