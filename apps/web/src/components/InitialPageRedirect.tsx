"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useEffect, useRef } from "react";
import { usePageService } from "../core/hooks/use-page-service";

export function InitialPageRedirect() {
  const router = useRouter();
  const isRedirectingRef = useRef(false);

  const queryClient = useQueryClient();

  const pageService = usePageService();

  const pagesQuery = useQuery({
    queryKey: ["pages"],
    queryFn: async () => pageService.getAll(),
  });

  const createPageMutation = useMutation({
    mutationFn: async () => await pageService.create(),
    onSuccess: (page) => {
      queryClient.refetchQueries(["pages"]);
      router.push(`/${page.localId}`);
    },
  });

  const { data: pages = [], isLoading } = pagesQuery;

  useEffect(() => {
    if (isRedirectingRef.current || isLoading) {
      return;
    }

    if (pages.length === 0) {
      isRedirectingRef.current = true;
      return createPageMutation.mutate();
    }

    if (pages.length > 0) {
      const page = pages.at(0);
      if (page) {
        router.push(`/${page.localId}`);
      }
    }
  }, [pages, isLoading]);

  return null;
}
