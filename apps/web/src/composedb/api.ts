import { ComposeClient } from "@composedb/client";
import { CREATE_PAGE_MUTATION } from "./gql/create-page-mutation";
import { PAGE_INDEX_QUERY } from "./gql/page-index-query";
import { PAGE_QUERY } from "./gql/page-query";
import { UPDATE_PAGE_MUTATION } from "./gql/update-page-mutation";
import { EncryptedComposePage, encryptedComposePageSchema } from "./schema";

export type DID = {
  id: string;
};

type CreatePageMutation = {
  createPage: {
    document: EncryptedComposePage;
  };
};

export type CreatePageInput = Pick<
  EncryptedComposePage,
  "encryptedKey" | "localId" | "title" | "content" | "createdAt" | "updatedAt"
>;

export type UpdatePageInput = Partial<Omit<EncryptedComposePage, "id">>;

type UpdatePageMutation = {
  updatePage: {
    document: EncryptedComposePage;
  };
};

export type GetPagesQuery = {
  pageIndex: {
    edges: {
      node: EncryptedComposePage;
    }[];
  };
};

type GetPageQuery = {
  node: EncryptedComposePage;
};

export class ComposeApiClient {
  constructor(private composeClient: ComposeClient) {}

  async createPage(input: CreatePageInput) {
    const result = await this.composeClient.executeQuery<CreatePageMutation>(
      CREATE_PAGE_MUTATION,
      {
        content: input,
      }
    );

    if (result.errors) {
      console.error("Error creating page", result.errors);
      throw new Error("Error creating page");
    }

    if (!result.data?.createPage.document) {
      console.error("Error creating page", result.data);
      throw new Error("Error creating page");
    }

    console.log(result);

    return encryptedComposePageSchema.parse(result.data.createPage.document);
  }

  async updatePage(id: string, input: UpdatePageInput) {
    const result = await this.composeClient.executeQuery<UpdatePageMutation>(
      UPDATE_PAGE_MUTATION,
      {
        id,
        content: input,
      }
    );

    if (result.errors) {
      console.error("Error updating page", result.errors);
      throw new Error("Error updating page");
    }

    if (!result.data?.updatePage.document) {
      console.error("Error updating page", result.data);
      throw new Error("Error updating page");
    }

    return encryptedComposePageSchema.parse(result.data.updatePage.document);
  }

  async getPages() {
    const result = await this.composeClient.executeQuery<GetPagesQuery>(
      PAGE_INDEX_QUERY
    );

    if (result.errors) {
      console.error("Error fetching pages", result.errors);
      throw new Error("Error fetching pages");
    }

    if (!result.data?.pageIndex.edges) {
      console.error("Error fetching pages", result.data);
      throw new Error("Error fetching pages");
    }

    return result.data.pageIndex.edges.map((edge) =>
      encryptedComposePageSchema.omit({ content: true }).parse(edge.node)
    );
  }

  async getPage(id: string) {
    const result = await this.composeClient.executeQuery<GetPageQuery>(
      PAGE_QUERY,
      {
        id,
      }
    );

    if (result.errors) {
      console.error("Error fetching page", result.errors);
      throw new Error("Error fetching page");
    }

    if (!result.data?.node) {
      console.error("Error fetching page", result.data);
      throw new Error("Error fetching page");
    }

    return encryptedComposePageSchema.parse(result.data.node);
  }
}
