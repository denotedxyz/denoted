import { z } from "zod";

const pageContentSchema = z.string();

export const pageSchema = z.object({
  localId: z.string(),
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
