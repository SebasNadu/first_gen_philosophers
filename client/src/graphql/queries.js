import { gql } from "@apollo/client";

export const GET_TOPS_BY_LIKES = gql`
  query getTopArticlesByLikes($total: Int) {
    getTopArticlesByLikes(total: $total) {
      title
      picture
      id
      body
      active
      user {
        id
        firstName
        profilePicture
      }
      likes {
        id
        firstName
        profilePicture
      }
      comments {
        id
        content
      }
      createdAt
    }
  }
`;

export const GET_TOPS_BY_COMMENTS = gql`
  query getTopArticlesByComments($total: Int) {
    getTopArticlesByComments(total: $total) {
      title
      picture
      id
      body
      active
      user {
        id
        firstName
        profilePicture
      }
      likes {
        id
        firstName
        profilePicture
      }
      comments {
        id
        content
      }
      createdAt
    }
  }
`;
