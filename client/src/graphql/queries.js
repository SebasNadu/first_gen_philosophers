import { gql } from "@apollo/client";

export const GET_TOPS_BY_LIKES = gql`
  query getTopArticlesByLikes($total: Int) {
    getTopArticlesByLikes(total: $total) {
      title
      abstract
      body
      picture
      id
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
      abstract
      body
      picture
      id
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
      active
      createdAt
      email
      firstName
      id
      lastName
      profilePicture
      story
      updatedAt
      followers {
        id
        firstName
        profilePicture
      }
      following {
        firstName
        id
        profilePicture
      }
    }
  }
`;

export const GET_ARTICLE_BY_ID = gql`
  query getArticleById($getArticleByIdId: ID!) {
    getArticleById(id: $getArticleByIdId) {
      active
      title
      abstract
      body
      createdAt
      id
      picture
      tags
      user {
        id
        firstName
        profilePicture
        lastName
        followers {
          id
          firstName
          profilePicture
        }
        following {
          id
          firstName
          profilePicture
        }
      }
      comments {
        user {
          firstName
          id
          profilePicture
          followers {
            id
            firstName
            profilePicture
          }
          following {
            firstName
            id
            profilePicture
          }
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

export const GET_ARTICLES = gql`
  query GetArticles {
    getArticles {
      active
      title
      abstract
      body
      createdAt
      id
      picture
      tags
      user {
        id
        firstName
        profilePicture
      }
      likes {
        firstName
        id
        profilePicture
      }
    }
  }
`;
