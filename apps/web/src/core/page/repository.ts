import { createStore, del, get, set, values } from "idb-keyval";
import { EncryptedPage, Page } from "./schema";
import { ComposeApiClient } from "../../composedb/api";
import { EncryptedComposePage } from "../../composedb/schema";

const pageStore = createStore("page-db", "page-store");
const pageArchiveStore = createStore("page-archive-db", "page-archive-store");

interface IPageRepository<TPage extends Page | EncryptedPage> {
  getById(id: string): Promise<TPage | null>;
  getAll(): Promise<TPage[]>;
  create(page: Partial<TPage>): Promise<TPage>;
  update(id: string, page: TPage): Promise<TPage>;
  delete(id: string): Promise<string>;
}

export class PageCacheRepository implements IPageRepository<Page> {
  constructor() {}

  async getById(id: string): Promise<Page | null> {
    const page = await get<Page>(id, pageStore);
    return page ?? null;
  }

  async getAll(): Promise<Page[]> {
    const pages = await values<Page>(pageStore);
    return pages;
  }

  async create(page: Partial<Page>): Promise<Page> {
    throw new Error("Method not supported");
  }

  async update(id: string, page: Page): Promise<Page> {
    await set(id, page, pageStore);
    return page;
  }

  async delete(id: string): Promise<string> {
    const page = await this.getById(id);
    await set(id, page, pageArchiveStore);
    await del(id, pageStore);
    return id;
  }
}

export class PageRepository implements IPageRepository<EncryptedPage> {
  constructor(private readonly composeApi: ComposeApiClient) {}

  private toEncryptedPage(page: EncryptedComposePage): EncryptedPage {
    return {
      encryptedKey: page.encryptedKey,
      remoteId: page.id,
      localId: page.localId,
      title: page.title,
      content: page.content,
      createdAt: new Date(page.createdAt),
      updatedAt: new Date(page.updatedAt),
      deletedAt: page.deletedAt ? new Date(page.deletedAt) : null,
    };
  }

  private fromEncryptedPage(
    page: EncryptedPage
  ): Partial<EncryptedComposePage> {
    return {
      encryptedKey: page.encryptedKey,
      id: page.remoteId!,
      localId: page.localId!,
      title: page.title,
      content: page.content ?? "",
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
      deletedAt: page.deletedAt ? page.deletedAt.toISOString() : null,
    };
  }

  async getById(id: string) {
    const page = await this.composeApi.getPage(id);
    return this.toEncryptedPage(page);
  }

  async getAll() {
    const pages = await this.composeApi.getPages();
    return pages.map((page) => this.toEncryptedPage(page));
  }

  async create(page: Partial<EncryptedPage>): Promise<EncryptedPage> {
    const createdPage = await this.composeApi.createPage({
      localId: page.localId!,
      encryptedKey: page.encryptedKey!,
      title: page.title ?? "",
      content: page.content ?? "",
      createdAt: page.createdAt!.toISOString(),
      updatedAt: page.updatedAt!.toISOString(),
    });

    return this.toEncryptedPage(createdPage);
  }

  async update(id: string, page: EncryptedPage) {
    const encryptedComposePage = this.fromEncryptedPage(page);
    const updatedPage = await this.composeApi.updatePage(id, {
      title: encryptedComposePage.title,
      content: encryptedComposePage.content,
      updatedAt: encryptedComposePage.updatedAt,
    });
    return this.toEncryptedPage(updatedPage);
  }

  async delete(id: string) {
    const updatedPage = await this.composeApi.updatePage(id, {
      encryptedKey: "",
      title: "",
      content: "",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return updatedPage.id;
  }
}
