import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    login(email: String!, password: String!): User!
  }

  type Mutation {
    createUser(userInput: UserInputData): User!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    firstName: String
    lastName: String
    active: Boolean!
    profilePicture: String
    story: String
    followers: [User]
    following: [User]
    createdAt: String!
    updatedAt: String!
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
`;
