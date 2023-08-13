import Article from "./Article.js";
import User from "../users/User.js";
import Comment from "../comments/Comment.js";
import validator from "validator";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const configuration = new Configuration({
  orgainzationId: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
      const { title, body, tags, picture, active } = articleInput;
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
      let cloudinaryPictureUrl = null;
      if (picture) {
        try {
          const response = await fetch(picture);
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }

          const imageStream = response.body;
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "article-pictures" },
            (error, result) => {
              if (error) {
                throw error;
              }
              cloudinaryPictureUrl = result.secure_url;
            }
          );

          imageStream.pipe(uploadStream);
        } catch (error) {
          console.error("Error while uploading image:", error);
          throw new Error("Error while uploading image");
        }
      }
      const article = new Article({
        title,
        body,
        tags,
        picture: cloudinaryPictureUrl,
        active,
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
      const { title, body, tags, picture, active } = articleInput;
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
        try {
          const response = await fetch(picture);
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }

          const imageStream = response.body;
          const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: "article-pictures" },
              (error, result) => {
                if (error) {
                  reject(error);
                }
                resolve(result);
              }
            );

            imageStream.pipe(uploadStream);
          });

          updatedFields.picture = result.secure_url;

          // Remove old picture if present
          const articleToUpdate = await Article.findById(id);
          if (articleToUpdate.picture) {
            try {
              const publicId = articleToUpdate.picture.match(/\/([^/]+)$/)[1];
              await cloudinary.uploader.destroy(publicId, { invalidate: true });
            } catch (error) {
              console.error("Error deleting old image:", error);
              error.code = 500;
              throw error;
            }
          }
        } catch (error) {
          console.error("Error while uploading image:", error);
          throw new Error("Error while uploading image");
        }
      }
      if (active !== undefined) {
        updatedFields.active = active;
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

        if (article.picture) {
          try {
            const publicId = article.picture.match(/\/([^/]+)$/)[1]; // Extract public_id
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
          } catch (error) {
            console.error("Error deleting image:", error);
            error.code = 500;
            throw error;
          }
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

    generatePictures: async (_, { content }, contextValue) => {
      try {
        if (!contextValue.user) {
          const error = new Error("Not authenticated");
          error.code = 401;
          throw error;
        }
        const responseText = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          message: [
            `You will be providded with a block of text, and your task is to exitract a list of keywords from it: ${content}`,
          ],
          temperature: 0.5,
          maxTokens: 64,
        });
        const keywords = responseText.data.choices[0].text.split(",");
        const responsePicture = await openai.createImage({
          prompt: keywords,
          n: 3,
          size: "1024x1024",
        });
        const pictures = responsePicture.data.images;
        return pictures;
      } catch (error) {
        error.code = 500;
        error.message = "Error generating pictures";
        throw error;
      }
    },
  },
};
