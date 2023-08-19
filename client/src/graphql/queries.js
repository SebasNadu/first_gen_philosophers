import { gql } from "@apollo/client";

export const GET_TOPS_BY_LIKES = gql`
  query getTopArticlesByLikes($total: Int) {
    getTopArticlesByLikes(total: $total) {
      title
      picture
      id
      body
      active
      tags
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
      tags
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

export const GET_USER_BY_ID = gql`
  query getUserById($getUserByIdId: ID!) {
    getUserById(id: $getUserByIdId) {
      id
      active
      createdAt
      email
      firstName
      followers {
        id
        profilePicture
      }
      following {
        id
        profilePicture
      }
      lastName
      profilePicture
      story
      updatedAt
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
  query getArticleById($getArticleByIdId: ID!) {
    getArticleById(id: $getArticleByIdId) {
      active
      body
      createdAt
      id
      picture
      tags
      title
      user {
        id
        firstName
        profilePicture
        lastName
        followers {
          id
        }
        following {
          id
        }
      }
      comments {
        user {
          firstName
          id
          profilePicture
        }
        content
        createdAt
        id
        likes {
          id
          profilePicture
          firstName
        }
      }
      likes {
        firstName
        id
        profilePicture
      }
      countLikes
      countComments
    }
  }
`;
