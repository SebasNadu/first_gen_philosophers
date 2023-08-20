import gql from "graphql-tag";

export const articleSchema = gql`
  scalar DateTime

  type Query {
    getArticleById(id: ID!): Article!
    getArticles(total: Int): [Article]
    getArticlesByUser(userId: ID!, total: Int): [Article]
    getTopArticlesByLikes(total: Int): [Article]
    getTopArticlesByComments(total: Int): [Article]
  }

  type Mutation {
    createArticle(articleInput: ArticleInputData): Article!
    updateArticle(id: ID!, articleInput: ArticleInputData): Article!
    deleteArticle(id: ID!): Boolean
    likeArticle(id: ID!): Boolean
    unlikeArticle(id: ID!): Boolean
    generatePictures(content: String!): [String]
  }

  type User {
    id: ID
    email: String
    password: String
    firstName: String
    lastName: String
    active: Boolean
    profilePicture: String
    story: String
    followers: [User]
    following: [User]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Comment {
    id: ID
    content: String
    user: User
    article: Article
    likes: [User]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Article {
    id: ID
    title: String
    abstract: String
    body: String
    tags: [String]
    picture: String
    active: Boolean
    user: User
    likes: [User]
    countLikes: Int
    comments: [Comment]
    countComments: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input ArticleInputData {
    title: String!
    body: String!
    tags: [String]
    picture: String
    active: Boolean!
  }
`;
