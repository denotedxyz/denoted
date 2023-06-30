import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import { useState, useRef, useEffect, useCallback } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return initialValue;
  });

  const setItem = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setItem];
}

function debounce<T extends (...args: any[]) => unknown>(fn: T, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function debounced(this: unknown, ...args: unknown[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

export function LocalStoragePlugin({ pageId }: { pageId: string }) {
  const [editor] = useLexicalComposerContext();
  const [serializedEditorState, setSerializedEditorState] = useLocalStorage<
    string | null
  >(["denoted", "page", pageId].join(":"), null);

  const isInitialRenderRef = useRef(true);
  const isInitialRender = isInitialRenderRef.current ?? false;

  useEffect(() => {
    if (isInitialRender) {
      isInitialRenderRef.current = false;
      if (serializedEditorState) {
        const initialEditorState = editor.parseEditorState(
          serializedEditorState
        );
        editor.setEditorState(initialEditorState);
      }
    }
  }, [isInitialRender, serializedEditorState, editor]);

  const onChange = useCallback(
    (editorState: EditorState) => {
      setSerializedEditorState(JSON.stringify(editorState.toJSON()));
    },
    [setSerializedEditorState]
  );

  const debouncedOnChange = useCallback(debounce(onChange), [onChange]);

  return <OnChangePlugin onChange={debouncedOnChange} />;
}
