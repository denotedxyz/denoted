import { z } from "zod";

export const composeDidSchema = z.object({
  id: z.string(),
});

export type ComposeDid = z.infer<typeof composeDidSchema>;

export const encryptedComposePageSchema = z.object({
  id: z.string(),
  localId: z.string(),
  encryptedKey: z.string().max(1024),
  title: z.string().max(1000000),
  content: z.string().max(100000),
  version: z.string(),
  createdBy: composeDidSchema,
  createdAt: z.string(),
  updatedBy: composeDidSchema,
  updatedAt: z.string(),
  deletedBy: composeDidSchema.nullable(),
  deletedAt: z.string().nullable(),
});

export type EncryptedComposePage = z.infer<typeof encryptedComposePageSchema>;
