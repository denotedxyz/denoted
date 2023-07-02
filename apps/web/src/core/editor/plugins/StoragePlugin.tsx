import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useMutation } from "@tanstack/react-query";
import { EditorState } from "lexical";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { pageService } from "../../page/service";
import { Page } from "../../page/schema";
import { debounce } from "../../../utils/debounce";
import { useAccount } from "wagmi";

export function StoragePlugin({
  pageId,
  onLoad,
  delay = 300,
}: {
  pageId: string;
  onLoad: (page: Page) => void;
  delay?: number;
}) {
  const [editor] = useLexicalComposerContext();

  const account = useAccount();

  const service = useMemo(
    () => pageService(account.address!),
    [account.address]
  );

  const pageQuery = useMutation(
    async () => {
      return await service.getById(pageId);
    },
    {
      onSuccess: (page) => {
        if (page) {
          const initialEditorState = editor.parseEditorState(page.content);
          editor.setEditorState(initialEditorState);
          onLoad(page);
        }
      },
    }
  );

  const updateContentMutation = useMutation(async (content: string) => {
    return await service.updateContent(pageId, content);
  });

  const isInitialRenderRef = useRef(true);
  const isInitialRender = isInitialRenderRef.current ?? false;

  useEffect(() => {
    if (isInitialRender) {
      isInitialRenderRef.current = false;
      pageQuery.mutate();
    }
  }, [isInitialRender]);

  const onChange = useCallback((editorState: EditorState) => {
    updateContentMutation.mutate(JSON.stringify(editorState.toJSON()));
  }, []);

  const debouncedOnChange = useCallback(debounce(onChange, delay), [delay]);

  return <OnChangePlugin onChange={debouncedOnChange} />;
}
