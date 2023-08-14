import { gql } from "@apollo/client";

export const GENERATE_PICTURES = gql`
  mutation generatePictures($content: String!) {
    generatePictures(content: $content)
  }
`;
