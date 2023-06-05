"use client";

import { Button, Skeleton, toast } from "@denoted/ui";
import { getPageQuery, updatePage } from "../composedb/page";
import { trackEvent } from "../lib/analytics";
import {
  serializePage,
  encryptPage,
  DeserializedPage,
  decryptPage,
  deletePage,
  deserializePage,
  importStoredEncryptionKey,
} from "../utils/page-helper";
import { SavePageData, PageEditor } from "./PageEditor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCeramic } from "../hooks/useCeramic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";
import { DeletePageDialog } from "./DeletePageDialog";
import { PublishMenu } from "./PublishMenu";
import { Loader2, Save, Edit } from "lucide-react";
import { useLit } from "../hooks/useLit";

export function UpdatePageEditor({ pageId }: { pageId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const { address } = useAccount();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { litClient } = useLit();
  const ceramic = useCeramic();

  const PAGE_QUERY_KEY = ["PAGE", pageId];

  const pageQuery = useQuery(
    PAGE_QUERY_KEY,
    async () => {
      const { data } = await getPageQuery(pageId, ceramic.composeClient);
      return data?.node;
    },
    { enabled: Boolean(pageId) }
  );

  type DeserializedPageQueryData = {
    page: DeserializedPage;
    key?: CryptoKey;
  };

  const DESERIALIZED_PAGE_QUERY_KEY = [
    "DESERIALIZED_PAGE",
    pageQuery.data?.id,
    pageQuery.data?.key,
    address,
  ];

  const deserializedPageQuery = useQuery<DeserializedPageQueryData>(
    DESERIALIZED_PAGE_QUERY_KEY,
    async () => {
      const serializedPage = pageQuery.data!;
      if (!serializedPage.key) {
        const deserializedPage = deserializePage(serializedPage);
        return { page: deserializedPage };
      }

      if (!address) {
        throw new Error("No address");
      }

      const { key } = await importStoredEncryptionKey(
        serializedPage.key!,
        address,
        litClient
      );

      const decryptedPage = await decryptPage(serializedPage, key);
      const deserializedPage = deserializePage(decryptedPage);

      return {
        page: deserializedPage,
        key,
      };
    },
    { enabled: pageQuery.isSuccess }
  );

  const page = deserializedPageQuery.data?.page;
  const key = deserializedPageQuery.data?.key;

  const isOwner = page?.createdBy.id === ceramic.composeClient.id;

  const updatePageMutation = useMutation(
    async ({ page: updatedPage, address, encryptionKey }: SavePageData) => {
      const pageInput = serializePage(
        "PAGE",
        updatedPage.title,
        updatedPage.content,
        new Date()
      );

      if (!address || !encryptionKey) {
        throw new Error("No user address or encryption key");
      }

      const updateResult = await updatePage(
        page!.id,
        await encryptPage(pageInput, address, encryptionKey, litClient),
        ceramic.composeClient
      );

      return updateResult;
    },
    {
      onMutate: ({ page }) => {
        trackEvent("Page Save Clicked");

        const previous = queryClient.getQueryData<DeserializedPageQueryData>(
          DESERIALIZED_PAGE_QUERY_KEY
        );

        if (previous) {
          const optimisticallyUpdatedPage: DeserializedPage = {
            ...previous.page,
            title: page.title,
            data: page.content,
          };

          queryClient.setQueryData<DeserializedPageQueryData>(
            DESERIALIZED_PAGE_QUERY_KEY,
            { ...previous, page: optimisticallyUpdatedPage }
          );
        }

        return { previous };
      },
      onError: (error, _, context) => {
        console.error("Update Page Error", error);

        if (context?.previous) {
          queryClient.setQueryData<DeserializedPageQueryData>(
            DESERIALIZED_PAGE_QUERY_KEY,
            context.previous
          );
        }
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Update Page Success", data, errors);

        const page = data?.updatePage?.document ?? null;

        if (page) {
          queryClient.invalidateQueries(["PAGES", ceramic.composeClient.id]);
          trackEvent("Page Saved", { pageId: page.id });
          setIsEditing(false);
        }
      },
    }
  );

  const deletePageMutation = useMutation(
    async () => {
      const ceramicSession = await ceramic.getSession();

      try {
        const response = await fetch("/api/page/unpublish", {
          method: "POST",
          body: JSON.stringify({
            pageId: page!.id,
            ceramicSession: ceramicSession?.serialize(),
          }),
        });

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        await response.json();
      } catch (error) {
        throw new Error("Unpublish Error", { cause: error });
      }

      try {
        trackEvent("Page Unpublished");
        return await deletePage(page!.id, ceramic.composeClient);
      } catch (error) {
        throw new Error("Delete Error", { cause: error });
      }
    },
    {
      onMutate: () => {
        trackEvent("Page Delete Clicked");
      },
      onSuccess: async ({ data, errors }) => {
        console.info("Delete Page Success", data, errors);

        const page = data?.updatePage?.document ?? null;

        if (page) {
          queryClient.invalidateQueries({
            queryKey: ["PAGES", ceramic.composeClient.id],
          });
          trackEvent("Page Deleted", { pageId: page!.id });

          router.push("/create");

          toast({
            title: "Page deleted ✔️",
            description:
              "Your page has been deleted but is still accessible on IPFS if it was published.",
          });
        }
      },
    }
  );

  if (pageQuery.isLoading || deserializedPageQuery.isLoading) {
    return (
      <div>
        <Skeleton className="mb-8 h-[60px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
        <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
      </div>
    );
  }

  if (!page) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-slate-500">Page not found</h1>
      </div>
    );
  }

  if (isEditing) {
    return (
      <PageEditor
        mode="UPDATE"
        page={page}
        encryptionKey={key}
        renderSubmit={({ isDisabled, getData }) => (
          <div className="mb-10 flex gap-4">
            <Button
              onClick={() => updatePageMutation.mutate(getData())}
              disabled={isDisabled || updatePageMutation.isLoading}
            >
              {updatePageMutation.isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {updatePageMutation.isLoading ? "Saving..." : "Save page"}
            </Button>
            <Button variant={"ghost"} onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      />
    );
  }

  return (
    <>
      {isOwner && (
        <div className="mb-10 flex items-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit page
          </Button>
          <PublishMenu page={page} encryptionKey={key} />
          <DeletePageDialog onDelete={deletePageMutation.mutate} />
        </div>
      )}
      <h1 className="mb-8 text-5xl font-bold leading-tight break-words">
        {page.title}
      </h1>
    </>
  );
}
