import User from "../models/User.js";
import validator from "validator";

export const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
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
  },
};
