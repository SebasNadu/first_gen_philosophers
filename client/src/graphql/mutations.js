import { gql } from "@apollo/client";

export const GENERATE_PICTURES = gql`
  mutation generatePictures($content: String!) {
    generatePictures(content: $content)
  }
`;

export const CREATE_USER = gql`
  mutation createUser($userInput: UserInputData) {
    createUser(userInput: $userInput)
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        active
        createdAt
        email
        firstName
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
  }
`;

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($articleInput: ArticleInputData) {
    createArticle(articleInput: $articleInput) {
      id
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followUserId: ID!) {
    followUser(id: $followUserId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($unfollowUserId: ID!) {
    unfollowUser(id: $unfollowUserId)
  }
`;

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($likeArticleId: ID!) {
    likeArticle(id: $likeArticleId)
  }
`;

export const UNLIKE_ARTICLE = gql`
  mutation UnlikeArticle($unlikeArticleId: ID!) {
    unlikeArticle(id: $unlikeArticleId)
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($commentInput: CommentInputData) {
    createComment(commentInput: $commentInput) {
      content
      createdAt
      id
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
      article {
        id
      }
    }
  }
`;

export const LIKE_COMMENT = gql`
  mutation LikeComment($likeCommentId: ID!) {
    likeComment(id: $likeCommentId)
  }
`;

export const UNLIKE_COMMENT = gql`
  mutation UnlikeComment($unlikeCommentId: ID!) {
    unlikeComment(id: $unlikeCommentId)
  }
`;
