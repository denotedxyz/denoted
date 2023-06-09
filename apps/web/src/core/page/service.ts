import { nanoid } from "nanoid";
import { PageCacheRepository, PageRepository } from "./repository";
import { EncryptedPage, Page, PageInput } from "./schema";

import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { Address } from "viem";
import { ComposeApiClient } from "../../composedb/api";
import { composeClient } from "../../lib/compose";
import {
  decryptString,
  encryptString,
  generateEncryptionKey,
} from "../../lib/crypto";
import { litClient, storeEncryptionKey } from "../../lib/lit";
import { importStoredEncryptionKey } from "./utils";
import { User } from "../../contexts/user-context";

class PageService {
  constructor(
    private readonly pageCacheRepository: PageCacheRepository,
    private readonly pageRepository: PageRepository,
    private readonly litClient: LitNodeClient,
    private readonly user: User
  ) {}

  async create(input?: PageInput): Promise<Page> {
    const id = nanoid(8);
    const encryptionKey = await generateEncryptionKey();

    const page: Page = {
      key: encryptionKey,
      localId: id,
      remoteId: null,
      title: input?.title ?? "",
      content: input?.content ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    await this.pageCacheRepository.update(id, page);

    if (this.user) {
      try {
        const encryptedPage = await this.encrypt(
          page,
          this.user.address,
          encryptionKey
        );

        const { remoteId } = await this.pageRepository.create(encryptedPage);

        await this.pageCacheRepository.update(id, {
          ...page,
          remoteId,
        });
      } catch (error) {
        console.log("Error creating page", error);
      }
    }

    return page;
  }

  async updateTitle(id: string, title: string): Promise<Page> {
    const page = await this.pageCacheRepository.getById(id);

    if (!page) {
      throw new Error("Page not found");
    }

    const updatedPage = await this.pageCacheRepository.update(id, {
      ...page,
      title,
      updatedAt: new Date(),
    });

    if (this.user) {
      if (!updatedPage.remoteId) {
        throw new Error("Page remoteId not found");
      }

      if (!updatedPage.key) {
        throw new Error("Page key not found");
      }

      try {
        const encryptedPage = await this.encrypt(
          updatedPage,
          this.user.address,
          updatedPage.key
        );

        await this.pageRepository.update(updatedPage.remoteId, encryptedPage);
      } catch (error) {
        console.log("Error updating page title", error);
      }
    }

    return updatedPage;
  }

  async updateContent(id: string, content: string): Promise<Page> {
    const page = await this.pageCacheRepository.getById(id);

    if (!page) {
      throw new Error("Page not found");
    }

    const updatedPage = await this.pageCacheRepository.update(id, {
      ...page,
      content,
      updatedAt: new Date(),
    });

    if (this.user) {
      if (!updatedPage.remoteId) {
        throw new Error("Page remoteId not found");
      }

      if (!updatedPage.key) {
        throw new Error("Page key not found");
      }

      try {
        const encryptedPage = await this.encrypt(
          updatedPage,
          this.user.address,
          updatedPage.key
        );

        await this.pageRepository.update(updatedPage.remoteId, encryptedPage);
      } catch (error) {
        console.log("Error updating page content", error);
      }
    }

    return updatedPage;
  }

  async getById(id: string) {
    const cachedPage = await this.pageCacheRepository.getById(id);

    if (cachedPage) {
      return cachedPage;
    }

    if (this.user) {
      const pages = await this.pageRepository.getAll();

      const remotePage = pages.find((page) => page.localId === id);

      if (!remotePage) {
        throw new Error("Page not found");
      }

      if (!remotePage.encryptedKey) {
        throw new Error("Page encryptedKey not found");
      }

      const storedEncryptionKey = await importStoredEncryptionKey(
        remotePage.encryptedKey,
        this.user.address,
        this.litClient
      );

      const page = await this.decrypt(remotePage, storedEncryptionKey);

      await this.pageCacheRepository.update(id, page);

      return page;
    }

    throw new Error("Page not found");
  }

  async getAll() {
    const pages = await this.pageCacheRepository.getAll();
    return pages;
  }

  async delete(id: string) {
    await this.pageCacheRepository.delete(id);
    await this.pageRepository.delete(id);
  }

  async encrypt(
    page: Page,
    userAddress: Address,
    encryptionKey: CryptoKey
  ): Promise<EncryptedPage> {
    const [title, content] = await Promise.all([
      await encryptString(page.title, encryptionKey),
      page.content ? await encryptString(page.content, encryptionKey) : null,
    ]);

    const { encryptedKey } = await storeEncryptionKey(
      encryptionKey,
      userAddress,
      this.litClient
    );

    return {
      ...page,
      title,
      content,
      encryptedKey: encryptedKey,
    };
  }

  async decrypt(page: EncryptedPage, encryptionKey: CryptoKey): Promise<Page> {
    const [title, content] = await Promise.all([
      page.title ? await decryptString(page.title, encryptionKey) : "",
      page.content ? await decryptString(page.content, encryptionKey) : "",
    ]);

    return {
      ...page,
      key: encryptionKey,
      title,
      content,
    };
  }
}

export function createPageService(user: User) {
  return new PageService(
    new PageCacheRepository(),
    new PageRepository(new ComposeApiClient(composeClient)),
    litClient,
    user
  );
}
