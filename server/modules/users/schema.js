import gql from "graphql-tag";

export const userSchema = gql`
  scalar DateTime
  type Query {
    getUserById(id: ID!): User!
    getUsers(total: Int): [User]
  }

  type Mutation {
    login(email: String!, password: String!): AuthData!
    createUser(userInput: UserInputData): User!
    updateUser(userInputUpdate: UserInputUpdateData): User!
    deleteUser(id: ID!): Boolean
  }

  type AuthData {
    token: String!
    userId: String!
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
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    active: Boolean
    profilePicture: String
    story: String
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
