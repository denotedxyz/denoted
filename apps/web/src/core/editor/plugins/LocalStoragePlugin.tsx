import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import { useState, useRef, useEffect, useCallback } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return initialValue;
  });

  const setItem = (newValue: T) => {
    window.localStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };

  return [value, setItem];
}

export function LocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();
  const [serializedEditorState, setSerializedEditorState] = useLocalStorage<
    string | null
  >("my-editor-state-example-key", null);

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

  // TODO: add ignoreSelectionChange
  return <OnChangePlugin onChange={onChange} />;
}
