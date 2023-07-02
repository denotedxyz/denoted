import { createStore, del, get, set, values } from "idb-keyval";
import { Page } from "./schema";

const pageStore = createStore("page-db", "page-store");
const pageArchiveStore = createStore("page-archive-db", "page-archive-store");

interface IPageRepository {
  getById(id: string): Promise<Page | null>;
  getAll(ids: string[]): Promise<Page[]>;
  save(id: string, page: Page): Promise<Page>;
  delete(id: string): Promise<string>;
}

export class PageLocalRepository implements IPageRepository {
  constructor() {}

  async getById(id: string): Promise<Page | null> {
    const page = await get<Page>(id, pageStore);
    return page ?? null;
  }

  async getAll(): Promise<Page[]> {
    const pages = await values<Page>(pageStore);
    return pages;
  }

  async save(id: string, page: Page): Promise<Page> {
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
