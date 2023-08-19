import { gql } from "@apollo/client";

export const GENERATE_PICTURES = gql`
  mutation generatePictures($content: String!) {
    generatePictures(content: $content)
  }
`;

export const CREATE_USER = gql`
  mutation createUser($userInput: UserInputData) {
    createUser(userInput: $userInput) {
      token
      userId
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

export const CREATE_ARTICLE = gql`
  mutation Mutation($articleInput: ArticleInputData) {
    createArticle(articleInput: $articleInput) {
      id
    }
  }
`;
