"use client";

import { Button } from "@denoted/ui";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import { generateEncryptionKey } from "../lib/crypto";
import { serializePage, encryptPage } from "../utils/page-helper";
import { SavePageData, PageEditor } from "./PageEditor";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";

export function CreatePageEditor() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { litClient } = useLit();

  const { composeClient } = useCeramic();

  const generateKeyMutation = useMutation(async () => {
    return await generateEncryptionKey();
  });

  const createPageMutation = useMutation(
    async ({ page, address, encryptionKey }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        page.title,
        page.content,
        new Date()
      );

      if (!address || !encryptionKey) {
        throw new Error("No user address or encryption key");
      }

      return await createPage(
        await encryptPage(pageInput, address, encryptionKey, litClient),
        composeClient
      );
    },
    {
      onMutate: () => trackEvent("Page Save Clicked"),
      onError: (error) => {
        console.error("Create Page Error", error);
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Create Page Success", data, errors);

        const id = data?.createPage?.document?.id ?? null;

        if (id) {
          queryClient.refetchQueries({
            queryKey: ["PAGES"],
          });
          trackEvent("Page Saved", { pageId: id });
          router.push(id);
        }
      },
    }
  );

  useEffect(() => {
    if (generateKeyMutation.isIdle) {
      generateKeyMutation.mutate();
    }
  }, [generateKeyMutation]);

  return (
    <PageEditor
      mode="CREATE"
      encryptionKey={generateKeyMutation.data}
      renderSubmit={({ isDisabled, getData }) => (
        <div className="mb-8 flex gap-4">
          <Button
            onClick={() => createPageMutation.mutate(getData())}
            disabled={isDisabled || createPageMutation.isLoading}
          >
            {createPageMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {createPageMutation.isLoading ? "Saving..." : "Save page"}
          </Button>
        </div>
      )}
    />
  );
}
