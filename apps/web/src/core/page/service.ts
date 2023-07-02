import { nanoid } from "nanoid";
import { PageLocalRepository } from "./repository";
import { Page, PageInput } from "./schema";

class PageService {
  constructor(private readonly pageRepository: PageLocalRepository) {}

  async create(input?: PageInput): Promise<Page> {
    const id = nanoid(8);

    const page = await this.pageRepository.save(id, {
      localId: id,
      remoteId: null,
      title: input?.title ?? "",
      content: input?.content ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    return page;
  }

  async updateTitle(id: string, title: string): Promise<Page> {
    const page = await this.pageRepository.getById(id);

    if (!page) {
      throw new Error("Page not found");
    }

    const updatedPage = await this.pageRepository.save(id, {
      ...page,
      title,
      updatedAt: new Date(),
    });

    return updatedPage;
  }

  async updateContent(id: string, content: string): Promise<Page> {
    const page = await this.pageRepository.getById(id);

    if (!page) {
      throw new Error("Page not found");
    }

    const updatedPage = await this.pageRepository.save(id, {
      ...page,
      content,
      updatedAt: new Date(),
    });

    return updatedPage;
  }

  async getById(id: string) {
    const page = await this.pageRepository.getById(id);
    return page;
  }

  async getAll() {
    const pages = await this.pageRepository.getAll();
    return pages;
  }

  async delete(id: string) {
    return await this.pageRepository.delete(id);
  }
}

export const pageService = new PageService(new PageLocalRepository());
