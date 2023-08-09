import gql from "graphql-tag";

export const typeDefs = gql`
  scalar DateTime
  type Query {
    getUserById(id: ID!): User!
    getUsers(total: Int): [User]
  }

  type Mutation {
    login(email: String!, password: String!): AuthData!
    createUser(userInput: UserInputData): User!
    editProfile(profileInput: ProfileInputData): User!
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

  input ProfileInputData {
    firstName: String
    lastName: String
    active: Boolean
    profilePicture: String
    story: String
  }
`;
