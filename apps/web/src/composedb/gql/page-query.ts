import { gql } from "graphql-request";

export const PAGE_QUERY = gql`
  query ($id: ID!) {
    node(id: $id) {
      ... on Page {
        id
        localId
        encryptedKey
        title
        content
        createdBy {
          id
        }
        createdAt
        updatedBy {
          id
        }
        updatedAt
        deletedBy {
          id
        }
        deletedAt
      }
    }
  }
`;
