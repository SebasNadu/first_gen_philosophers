import User from "./User.js";
import Article from "../articles/Article.js";
import Comment from "../comments/Comment.js";
import validator from "validator";
import jwt from "jsonwebtoken";

export const userResolver = {
  Query: {
    getUserById: async (_, { id }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      return User.findById(id).catch((error) => {
        throw error;
      });
    },

    getUsers: async (_, { total }) => {
      // If total is not provided, return all users
      if (!total) {
        return User.find()
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw error;
          });
      }
      // If total is provided, return the number of users specified by total
      return User.find()
        .sort({ createdAt: -1 })
        .limit(total)
        .catch((error) => {
          throw error;
        });
    },
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        const error = new Error("User not found");
        error.code = 401;
        throw error;
      }
      const isEquals = await user.comparePassword(password, user.password);
      if (!isEquals) {
        const error = new Error("Password is incorrect");
        error.code = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      return { token, userId: user.id };
    },

    createUser: async (_, { userInput }) => {
      const {
        email,
        password,
        firstName,
        lastName,
        active,
        profilePicture,
        story,
      } = userInput;
      const errors = [];
      if (validator.isEmpty(email)) {
        errors.push({ message: "Email is required" });
      }
      if (!validator.isEmail(email)) {
        errors.push({ message: "Email is invalid" });
      }
      if (validator.isEmpty(password)) {
        errors.push({ message: "Password is required" });
      }
      if (!validator.isLength(password, { min: 5, max: 20 })) {
        errors.push({
          message: "Password must be between 5 and 20 characters",
        });
      }
      if (errors.length > 0) {
        const error = new Error("Invalid input");
        error.data = errors;
        error.code = 422;
        throw error;
      }
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("User already exists");
        error.code = 422;
        throw error;
      }
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        active,
        profilePicture,
        story,
      });
      const savedUser = await user.save();
      return savedUser;
    },

    updateUser: async (_, { userInputUpdate }, contextValue) => {
      if (!contextValue.user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const user = await User.findById(contextValue.user.userId).select(
        "+password"
      );
      const {
        email,
        newPassword,
        currentPassword,
        firstName,
        lastName,
        active,
        profilePicture,
        story,
      } = userInputUpdate;
      // Check the new input
      const updatedFields = {};
      if (firstName !== undefined && firstName !== "") {
        updatedFields.firstName = firstName;
      }
      if (lastName !== undefined && lastName !== "") {
        updatedFields.lastName = lastName;
      }
      if (active !== undefined) {
        updatedFields.active = active;
      }
      if (profilePicture !== undefined && profilePicture !== "") {
        updatedFields.profilePicture = profilePicture;
      }
      if (story !== undefined && story !== "") {
        updatedFields.story = story;
      }
      // Check the email and password
      if (email !== undefined && email !== "") {
        if (!validator.isEmail(email)) {
          const error = new Error("Email is invalid");
          error.code = 422;
          throw error;
        }
        updatedFields.email = email;
      }
      if (newPassword !== undefined && newPassword !== "") {
        if (!validator.isLength(newPassword, { min: 5, max: 20 })) {
          const error = new Error(
            "Password must be between 5 and 20 characters"
          );
          error.code = 422;
          throw error;
        }
        if (validator.isEmpty(currentPassword)) {
          const error = new Error("Current password is required");
          error.code = 422;
          throw error;
        }
        if (currentPassword === newPassword) {
          const error = new Error(
            "New password must be different from current password"
          );
          error.code = 422;
          throw error;
        }
        // Check if current password is correct
        const isEquals = await user.comparePassword(
          currentPassword,
          user.password
        );
        if (!isEquals) {
          const error = new Error("Current password is incorrect");
          error.code = 422;
          throw error;
        }
        updatedFields.password = newPassword;
      }
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(user.id, updatedFields, {
        new: true,
      }).catch((error) => {
        throw error;
      });
      return updatedUser;
    },

    deleteUser: async (_, { id }, contextValue) => {
      if (contextValue.user.userId !== id) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      try {
        const userArticles = await Article.find({ user: id });
        const userArticlesIds = userArticles.map((article) => article._id);
        // Delete all comments in user articles
        await Comment.deleteMany({ article: { $in: userArticlesIds } });
        // Delete all comments of user
        await Comment.deleteMany({ user: id });
        // Delete all articles of user
        await Article.deleteMany({ user: id });
        // Delete all likes of user in articles
        await Article.updateMany(
          { user: id },
          {
            $pull: { likes: id },
            $unset: { user: 1 },
          }
        );
        // Delete all likes of user in comments
        await Comment.updateMany(
          { user: id },
          {
            $pull: { likes: id },
            $unset: { user: 1 },
          }
        );
        // Delete all users following user
        await User.updateMany(
          { following: id },
          {
            $pull: { following: id },
          }
        );
        // Delete all users followed by user
        await User.updateMany(
          { followers: id },
          {
            $pull: { followers: id },
          }
        );
        // Delete user
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
          const error = new Error("User not found");
          error.code = 404;
          throw error;
        }
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
