import Article from "./Article.js";
import User from "../users/User.js";
import Comment from "../comments/Comment.js";
import validator from "validator";
// import fs from "fs";
// import path from "path";
import openai from "../../utils/openai.js";
import cloudinary from "../../utils/cloudinary.js";

export const articleResolver = {
  Query: {
    getArticleById: async (_, { id }) => {
      try {
        const article = await Article.findById(id)
          .populate("user")
          .populate({
            path: "comments",
            model: "Comment",
            populate: { path: "user", model: "User" },
          })
          .populate({ path: "likes", model: "User" });
        return article;
      } catch (error) {
        error.code = 422;
        throw error;
      }
    },

    getArticles: async (_, { total }) => {
      if (!total) {
        // If total is not provided, return all articles
        try {
          const articles = Article.find()
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({
              path: "comments",
              model: "Comment",
              populate: { path: "user", model: "User" },
            })
            .populate({ path: "likes", model: "User" });
          return articles;
        } catch (error) {
          error.code = 422;
          throw error;
        }
      }
      // If total is provided, return the number of articles specified by total
      try {
        const articles = Article.find()
          .sort({ createdAt: -1 })
          .limit(total)
          .populate("user")
          .populate({
            path: "comments",
            model: "Comment",
            populate: { path: "user", model: "User" },
          })
          .populate({ path: "likes", model: "User" });
        return articles;
      } catch (error) {
        error.code = 422;
        throw error;
      }
    },

    getArticlesByUser: async (_, { userId, total }) => {
      if (validator.isEmpty(userId)) {
        const error = new Error("User is required");
        error.code = 422;
        throw error;
      }
      // If total is not provided, return all articles
      if (!total) {
        try {
          const article = Article.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user")
            .populate({
              path: "comments",
              model: "Comment",
              populate: { path: "user", model: "User" },
            })
            .populate({ path: "likes", model: "User" });
          return article;
        } catch (error) {
          error.code = 422;
          throw error;
        }
      }
      // If total is provided, return the number of articles specified by total
      try {
        const article = Article.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(total)
          .populate("user")
          .populate({
            path: "comments",
            model: "Comment",
            populate: { path: "user", model: "User" },
          })
          .populate({ path: "likes", model: "User" });
        return article;
      } catch (error) {
        error.code = 422;
        throw error;
      }
    },

    getTopArticlesByLikes: async (_, { total }) => {
      try {
        if (!total) {
          const articles = await Article.find()
            .sort({ likesCount: -1 })
            .limit(total)
            .populate("user")
            .populate({
              path: "comments",
              model: "Comment",
              populate: { path: "user", model: "User" },
            })
            .populate({ path: "likes", model: "User" });
          return articles;
        }
        const articles = await Article.find()
          .sort({ likesCount: -1 })
          .populate("user")
          .populate({
            path: "comments",
            model: "Comment",
            populate: { path: "user", model: "User" },
          })
          .populate({ path: "likes", model: "User" });
        return articles;
      } catch (error) {
        throw new Error("Error while getting popular articles by likes");
      }
    },

    getTopArticlesByComments: async (_, { total }) => {
      try {
        if (!total) {
          const articles = await Article.find()
            .sort({ commentsCount: -1 })
            .limit(total)
            .populate("user")
            .populate({
              path: "comments",
              model: "Comment",
              populate: { path: "user", model: "User" },
            })
            .populate({ path: "likes", model: "User" });

          return articles;
        }
        const articles = await Article.find()
          .sort({ commentsCount: -1 })
          .populate("user")
          .populate({
            path: "comments",
            model: "Comment",
            populate: { path: "user", model: "User" },
          })
          .populate({ path: "likes", model: "User" });
        return articles;
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
      let abstract = "";
      try {
        const resAbstract = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Create an abstract with the content you are provided with",
            },
            {
              role: "user",
              content: body,
            },
          ],
          temperature: 0,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.log(resAbstract.data.choices[0].message.content);
        abstract = resAbstract.data.choices[0].message.content;
      } catch (error) {
        console.error("Error while creating abstract:", error);
        throw new Error("Error while creating abstract");
      }
      const article = new Article({
        title,
        abstract,
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
        let abstract = "";
        try {
          const resAbstract = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "Create an abstract with the content you are provided with",
              },
              {
                role: "user",
                content: body,
              },
            ],
            temperature: 0,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
          console.log(resAbstract.data.choices[0].message.content);
          abstract = resAbstract.data.choices[0].message.content;
        } catch (error) {
          console.error("Error while creating abstract:", error);
          throw new Error("Error while creating abstract");
        }
        updatedFields.abstract = abstract;
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
        article.likesCount = article.likesCount + 1;
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
        article.likesCount = article.likesCount - 1;
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
          messages: [
            {
              role: "system",
              content:
                "You will be provided with a block of text, and your task is to extract a list of keywords from it.",
            },
            {
              role: "user",
              content: content,
            },
          ],
          temperature: 0.8,
          max_tokens: 64,
          top_p: 1,
        });
        // const keywords = responseText.data.choices[0].message.content.trim();
        const keywords = responseText.data.choices[0].message?.content?.trim();
        const responsePicture = await openai.createImage({
          prompt: `An expressive or abstract paiting or photo of ${keywords}`,
          n: 3,
          size: "1024x1024",
        });
        const pictures = responsePicture.data.data.map((picture) => {
          return picture.url;
        });
        console.log(pictures);
        return pictures;
      } catch (error) {
        if (error.response) {
          console.error(error.response.data);
          console.error(error.response.status);
        } else {
          console.log(error.message);
        }
        throw error;
      }
    },
  },
};
