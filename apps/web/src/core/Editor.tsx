import { $getRoot, $getSelection } from "lexical";
import { useEffect, useRef, useState } from "react";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TextareaAutosize from "react-textarea-autosize";

export const TITLE_PLACEHOLDER = "Untitled";

type EditorProps = {};

export function Editor({}: EditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    onError: (error) => console.error("Lexical Error:", error),
  };

  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = `${title ?? TITLE_PLACEHOLDER} | denoted`;
  }, [title]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <HistoryPlugin />
      <ListPlugin />
      <TextareaAutosize
        ref={titleRef}
        placeholder={TITLE_PLACEHOLDER}
        className="mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <div className="grow relative">
        <RichTextPlugin
          contentEditable={<ContentEditable className="h-full outline-none" />}
          placeholder={
            <p className="absolute top-0 left-0 text-slate-300">
              Use '/' for commands
            </p>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}
