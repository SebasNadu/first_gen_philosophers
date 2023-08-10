import gql from "graphql-tag";

export const commentSchema = gql`
  scalar DateTime

  type Query {
    getCommentById(id: ID!): Comment!
    getCommentsByUser(userId: ID!, total: Int): [Comment]
    getCommentsByArticle(articleId: ID!, total: Int): [Comment]
  }

  type Mutation {
    createComment(commentInput: CommentInputData): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean
  }

  type Comment {
    id: ID!
    content: String!
    user: User!
    article: Article!
    likes: [User]
    createdAt: DateTime!
    updatedAt: DateTime!
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

  type Article {
    id: ID!
    title: String!
    body: String!
    tags: [String]
    picture: String
    user: User!
    likes: [User]
    comments: [Comment]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CommentInputData {
    content: String!
    articleId: ID!
  }
`;
