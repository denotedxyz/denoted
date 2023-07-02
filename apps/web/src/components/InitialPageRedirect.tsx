"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { pageService } from "../core/page/service";

export function InitialPageRedirect() {
  const router = useRouter();

  const createPageMutation = useMutation(
    async () => {
      return await pageService.create();
    },
    {
      onSuccess: (page) => {
        router.push(`/${page.localId}`);
      },
    }
  );

  const pagesQuery = useQuery(["pages"], async () => {
    return await pageService.getAll();
  });

  if (pagesQuery.data) {
    const pages = pagesQuery.data ?? [];

    if (pages.length === 0) {
      createPageMutation.mutate();
      return "loading...";
    }

    const page = pages.at(0);

    if (page) {
      router.push(`/${page.localId}`);
      return "loading...";
    }
  }

  return "loading...";
}
