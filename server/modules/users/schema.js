import gql from "graphql-tag";

export const userSchema = gql`
  scalar DateTime
  # scalar Upload

  type Query {
    getUserById(id: ID!): User!
    getUsers(total: Int): [User]
  }

  type Mutation {
    generateSignedUrl(filename: String!): String!
    login(email: String!, password: String!): AuthData!
    createUser(userInput: UserInputData): Boolean
    updateUser(userInputUpdate: UserInputUpdateData): User!
    deleteUser(id: ID!): Boolean
    followUser(id: ID!): Boolean
    unfollowUser(id: ID!): Boolean
  }

  type AuthData {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    firstName: String
    lastName: String
    active: Boolean
    profilePicture: String
    story: String
    followers: [User]
    following: [User]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UserInputData {
    email: String
    password: String
    firstName: String
    lastName: String
  }

  input UserInputUpdateData {
    email: String
    newPassword: String
    currentPassword: String
    firstName: String
    lastName: String
    active: Boolean
    profilePicture: String
    story: String
  }
`;
