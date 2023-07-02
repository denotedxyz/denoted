import { gql } from "graphql-request";

export const UPDATE_PAGE_MUTATION = gql`
  mutation ($id: ID!, $content: PartialPageInput!) {
    updatePage(input: { id: $id, content: $content }) {
      document {
        version
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
