import { nanoid } from "nanoid";
import { PageCacheRepository, PageRepository } from "./repository";
import { EncryptedPage, Page, PageInput } from "./schema";

import { LitNodeClient } from "@lit-protocol/lit-node-client";
import {
  decryptString,
  encryptString,
  generateEncryptionKey,
  importEncryptionKey,
} from "../../lib/crypto";
import {
  getStoredEncryptionKey,
  litClient,
  storeEncryptionKey,
} from "../../lib/lit";
import { composeClient } from "../../lib/compose";
import { ComposeApiClient } from "../../composedb/api";
import { Address } from "viem";

export async function importStoredEncryptionKey(
  key: string,
  userAddress: string,
  litClient: LitNodeClient
) {
  const { encryptionKey } = await getStoredEncryptionKey(
    key,
    userAddress,
    litClient
  );
  return await importEncryptionKey(encryptionKey);
}

class PageService {
  constructor(
    private readonly userAddress: Address,
    private readonly pageCacheRepository: PageCacheRepository,
    private readonly pageRepository: PageRepository,
    private readonly litClient: LitNodeClient
  ) {}

  async create(input?: PageInput): Promise<Page> {
    const id = nanoid(8);
    const page: Page = {
      key: null,
      localId: id,
      remoteId: null,
      title: input?.title ?? "",
      content: input?.content ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const encryptionKey = await generateEncryptionKey();

    const encryptedPage = await this.encrypt(
      page,
      this.userAddress,
      encryptionKey
    );
    const remotePage = await this.pageRepository.create(encryptedPage);

    page.remoteId = remotePage.remoteId;
    page.key = encryptionKey;

    await this.pageCacheRepository.update(id, page);

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

    const encryptedPage = await this.encrypt(
      updatedPage,
      this.userAddress,
      updatedPage.key!
    );

    await this.pageRepository.update(page.remoteId!, encryptedPage);

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

    const encryptedPage = await this.encrypt(
      updatedPage,
      this.userAddress,
      updatedPage.key!
    );

    await this.pageRepository.update(page.remoteId!, encryptedPage);

    return updatedPage;
  }

  async getById(id: string) {
    const cachedPage = await this.pageCacheRepository.getById(id);

    if (cachedPage) {
      return cachedPage;
    }

    const pages = await this.pageRepository.getAll();

    const remotePage = pages.find((page) => page.localId === id);

    if (!remotePage) {
      throw new Error("Page not found");
    }

    const storedEncryptionKey = await importStoredEncryptionKey(
      remotePage.encryptedKey!,
      this.userAddress,
      this.litClient
    );

    const page = await this.decrypt(remotePage, storedEncryptionKey);

    await this.pageCacheRepository.update(id, page);

    return page;
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
      await encryptString(page.content, encryptionKey),
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

export function pageService(userAddress: Address) {
  return new PageService(
    userAddress,
    new PageCacheRepository(),
    new PageRepository(new ComposeApiClient(composeClient)),
    litClient
  );
}