import { gql } from "graphql-request";

export const CREATE_PAGE_MUTATION = gql`
  mutation ($content: PageInput!) {
    createPage(input: { content: $content }) {
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
