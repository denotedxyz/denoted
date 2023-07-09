"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { TitleEditor } from "./TitleEditor";

import { Skeleton } from "@denoted/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorThemeClasses } from "lexical";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { modules } from "../../../modules";
import { usePageService } from "../../hooks/use-page-service";
import { CORE_EDITOR_NODES } from "../nodes";
import { ContentEditor } from "./ContentEditor";
import { useUser } from "../../../contexts/user-context";

const moduleNodes = modules.flatMap((module) => module.editor.nodes);

const NODES = [...CORE_EDITOR_NODES, ...moduleNodes];

const editorTheme: EditorThemeClasses = {
  link: "cursor-pointer",
  code: "block",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
  list: {
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
  },
};

type PageEditorProps = {
  pageId: string;
};

export function PageEditor({ pageId }: PageEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const setIsSavingDebounced = useCallback(debounce(setIsSaving, 500), []);

  const user = useUser();

  const pageService = usePageService();

  const pageQuery = useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => await pageService.getById(pageId),
    cacheTime: Infinity,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const queryClient = useQueryClient();

  const updateTitleMutation = useMutation({
    mutationFn: async (title: string) =>
      await pageService.updateTitle(pageId, title),
    onSuccess: () => queryClient.refetchQueries(["pages"]),
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSavingDebounced(false),
  });

  const updateContentMutation = useMutation({
    mutationFn: async (content: string) =>
      await pageService.updateContent(pageId, content),
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSavingDebounced(false),
  });

  const debouncedUpdateTitle = useCallback(
    debounce(updateTitleMutation.mutate, 300),
    [updateTitleMutation.mutate]
  );

  const debouncedUpdateContent = useCallback(
    debounce(updateContentMutation.mutate, 300),
    [updateContentMutation.mutate]
  );

  if (pageQuery.isLoading) {
    return (
      <div className="flex flex-col grow gap-8 pt-14">
        <Skeleton className="w-full h-16 mb" />
        <div className="grid gap-4">
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    );
  }

  if (pageQuery.isError) {
    return (
      <div className="grid place-content-center h-full w-full">
        <h1 className="text-2xl">Page not found 🤔</h1>
      </div>
    );
  }

  const initialConfig: InitialConfigType = {
    namespace: "denoted",
    onError: (error) => {
      console.error("Lexical Error:", error);
      throw error;
    },
    nodes: NODES,
    theme: editorTheme,
    editorState: pageQuery.data?.content,
  };

  const isUpdateSuccess = [updateTitleMutation, updateContentMutation].every(
    (mutation) => mutation.isSuccess || mutation.isIdle
  );

  const isUpdateError = [updateTitleMutation, updateContentMutation].some(
    (mutation) => mutation.isError
  );
  const updateError = [updateTitleMutation, updateContentMutation]
    .map((mutation) => mutation.error)
    .find((error) => error !== undefined);

  return (
    <div>
      {!user?.isAuthenticated && (
        <div>
          <div className="bg-yellow-100 text-yellow-500 inline-block text-sm px-2 py-1 rounded-sm">
            You are not logged in. Changes will not be saved.
          </div>
        </div>
      )}
      <div className="bg-gray-100 text-gray-500 inline-block text-sm px-2 py-1 rounded-sm">
        {isSaving && "Saving..."}
        {!isSaving && isUpdateSuccess && "Saved"}
        {!isSaving && isUpdateError && (
          <span>
            {updateError instanceof Error
              ? updateError.message
              : "Unknown error"}
          </span>
        )}
      </div>
      <div key={pageId} className="flex flex-col grow gap-8 pt-14">
        <LexicalComposer initialConfig={initialConfig}>
          <TitleEditor
            onChange={debouncedUpdateTitle}
            initial={pageQuery.data?.title ?? ""}
          />
          <ContentEditor onChange={debouncedUpdateContent} />
        </LexicalComposer>
      </div>
    </div>
  );
}
