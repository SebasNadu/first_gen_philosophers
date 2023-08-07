import User from "../models/User.js";

export const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
    createUser: async (
      _,
      { email, password, firstName, lastName, active, profilePicture, story }
    ) => {
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
