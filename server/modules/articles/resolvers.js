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

    getArticlesByUser: async (_, { userId, total }) => {
      if (validator.isEmpty(userId)) {
        const error = new Error("User is required");
        error.code = 422;
        throw error;
      }
      // If total is not provided, return all articles
      if (!total) {
        return Article.find({ user: userId })
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw error;
          });
      }
      // If total is provided, return the number of articles specified by total
      return Article.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(total)
        .catch((error) => {
          throw error;
        });
    },

    getTopArticlesByLikes: async (_, { total }) => {
      try {
        let query = Article.aggregate([
          {
            $addFields: {
              likesCount: { $size: "$likes" },
            },
          },
          {
            $sort: { likesCount: -1 },
          },
        ]);

        if (total) {
          query = query.limit(total);
        }

        const popularArticlesByLikes = await query.exec();
        const articlesWithId = popularArticlesByLikes.map((article) => ({
          ...article,
          id: article._id.toString(),
        }));
        return articlesWithId;
      } catch (error) {
        throw new Error("Error while getting popular articles by likes");
      }
    },

    getTopArticlesByComments: async (_, { total }) => {
      try {
        let query = Article.aggregate([
          {
            $addFields: {
              commentsCount: { $size: "$comments" },
            },
          },
          {
            $sort: { commentsCount: -1 },
          },
        ]);

        if (total) {
          query = query.limit(total);
        }

        const popularArticlesByComments = await query.exec();
        const articlesWithId = popularArticlesByComments.map((article) => ({
          ...article,
          id: article._id.toString(),
        }));
        return articlesWithId;
      } catch (error) {
        throw new Error("Error while getting popular articles by comments");
      }
    },
  },

  Mutation: {
    createArticle: async (_, { articleInput }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const { title, body, tags, picture } = articleInput;
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
        picture,
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
      const { title, body, tags, picture } = articleInput;
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
      if (picture !== undefined && picture !== "") {
        updatedFields.picture = picture;
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

    likeArticle: async (_, { id }, contextValue) => {
      try {
        if (!contextValue.user) {
          const error = new Error("Not authenticated");
          error.code = 401;
          throw error;
        }
        const article = await Article.findById(id);
        if (!article) {
          const error = new Error("Article not found");
          error.code = 404;
          throw error;
        }
        const currentUser = await User.findById(contextValue.user.userId);
        if (!currentUser) {
          const error = new Error("Invalid user");
          error.code = 401;
          throw error;
        }
        // Check if the user has already liked the article
        if (article.likes && article.likes.includes(currentUser.id)) {
          const error = new Error("Already liked");
          error.code = 403;
          throw error;
        }
        // Add the user to the likes array
        article.likes.push(currentUser);
        await article.save();
        return true;
      } catch (error) {
        if (!error.code) {
          error.code = 500;
        }
        throw error;
      }
    },

    unlikeArticle: async (_, { id }, contextValue) => {
      try {
        if (!contextValue.user) {
          const error = new Error("Not authenticated");
          error.code = 401;
          throw error;
        }
        const article = await Article.findById(id);
        if (!article) {
          const error = new Error("Article not found");
          error.code = 404;
          throw error;
        }
        const currentUser = await User.findById(contextValue.user.userId);
        if (!currentUser) {
          const error = new Error("Invalid user");
          error.code = 401;
          throw error;
        }
        // Check if the user has already liked the article
        if (!article.likes || !article.likes.includes(currentUser.id)) {
          const error = new Error("Not liked");
          error.code = 403;
          throw error;
        }
        // Remove the user from the likes array
        article.likes.pull(currentUser);
        await article.save();
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
