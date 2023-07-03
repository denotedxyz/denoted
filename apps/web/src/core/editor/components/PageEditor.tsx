"use client";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { TitleEditor } from "./TitleEditor";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EditorThemeClasses } from "lexical";
import { modules } from "../../../modules";
import { usePageService } from "../../hooks/use-page-service";
import { CORE_EDITOR_NODES } from "../nodes";
import { useCallback } from "react";
import debounce from "lodash.debounce";
import { ContentEditor } from "./ContentEditor";

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
  const pageService = usePageService();

  const pageQuery = useQuery({
    queryKey: ["page", pageId],
    queryFn: async () => await pageService.getById(pageId),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const updateTitleMutation = useMutation({
    mutationFn: async (title: string) =>
      await pageService.updateTitle(pageId, title),
    onSuccess: () => queryClient.refetchQueries(["pages"]),
  });

  const debouncedUpdateTitle = useCallback(
    debounce(updateTitleMutation.mutate, 300),
    []
  );

  const updateContentMutation = useMutation({
    mutationFn: async (content: string) =>
      await pageService.updateContent(pageId, content),
  });

  const debouncedUpdateContent = useCallback(
    debounce(updateContentMutation.mutate, 300),
    []
  );

  if (pageQuery.isLoading) {
    return <div>Loading...</div>;
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col grow">
        <TitleEditor
          onChange={debouncedUpdateTitle}
          initial={pageQuery.data?.title ?? ""}
        />
        <ContentEditor onChange={debouncedUpdateContent} />
      </div>
    </LexicalComposer>
  );
}
