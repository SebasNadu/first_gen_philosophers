import User from "../models/User.js";
import validator from "validator";
import jwt from "jsonwebtoken";

export const resolvers = {
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

    editProfile: async (_, { profileInput }, contextValue) => {
      const { user } = contextValue;
      if (!user) {
        const error = new Error("Not authenticated");
        error.code = 401;
        throw error;
      }
      const { firstName, lastName, active, profilePicture, story } =
        profileInput;
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
      const updatedUser = await User.findByIdAndUpdate(
        user.userId,
        updatedFields,
        { new: true }
      );
      return updatedUser;
    },
  },
};
