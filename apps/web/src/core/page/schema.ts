import { z } from "zod";
import { cryptoKeySchema } from "../../lib/crypto";

const pageContentSchema = z.string();

export const pageSchema = z.object({
  key: cryptoKeySchema.nullable(),
  localId: z.string().nullable(),
  remoteId: z.string().nullable(),
  title: z.string(),
  content: pageContentSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Page = z.infer<typeof pageSchema>;

const pageInputSchema = pageSchema.pick({
  title: true,
  content: true,
});

export type PageInput = z.infer<typeof pageInputSchema>;

export const encryptedPageSchema = pageSchema.omit({ key: true }).extend({
  encryptedKey: z.string(),
});

export type EncryptedPage = z.infer<typeof encryptedPageSchema>;
