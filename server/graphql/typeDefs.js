import gql from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String!
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

  type Mutation {
    createUser(
      email: String!
      password: String!
      firstName: String
      lastName: String
      active: Boolean
      profilePicture: String
      story: String
    ): User!
  }
`;
