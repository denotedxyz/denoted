"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { pageService } from "../core/page/service";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export function InitialPageRedirect() {
  const router = useRouter();
  const account = useAccount();
  const queryClient = useQueryClient();

  const createPageMutation = useMutation(
    async () => {
      return await pageService(account.address!).create();
    },
    {
      onSuccess: (page) => {
        queryClient.refetchQueries(["pages"]);
        router.push(`/${page.localId}`);
      },
    }
  );

  useEffect(() => {
    if (account.address) {
      createPageMutation.mutate();
    }
  }, [account.address]);

  // const pagesQuery = useQuery(["pages"], async () => {
  //   return await pageService.getAll();
  // });

  // if (pagesQuery.data) {
  //   const pages = pagesQuery.data ?? [];

  //   if (pages.length === 0) {
  //     createPageMutation.mutate();
  //     return "loading...";
  //   }

  //   const page = pages.at(0);

  //   if (page) {
  //     router.push(`/${page.localId}`);
  //     return "loading...";
  //   }
  // }

  return "loading...";
}
