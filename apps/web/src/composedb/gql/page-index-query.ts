import { gql } from "graphql-request";

export const PAGE_INDEX_QUERY = gql`
  query {
    pageIndex(first: 1000) {
      edges {
        node {
          version
          id
          localId
          encryptedKey
          title
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
  }
`;
