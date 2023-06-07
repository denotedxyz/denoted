"use client";

import { useEffect, useRef, useState } from "react";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import TextareaAutosize from "react-textarea-autosize";
import { CORE_EDITOR_NODES } from "./nodes";

export const TITLE_PLACEHOLDER = "Untitled";

type EditorProps = {};

export function Editor({}: EditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "denoted",
    onError: (error) => {
      console.error("Lexical Error:", error);
      throw error;
    },
    nodes: CORE_EDITOR_NODES,
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
      <MarkdownShortcutPlugin />
      <TextareaAutosize
        ref={titleRef}
        placeholder={TITLE_PLACEHOLDER}
        className="mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <div className="grow flex relative prose">
        <RichTextPlugin
          contentEditable={<ContentEditable className="grow outline-none" />}
          placeholder={
            <p className="absolute top-5 left-0 text-slate-300 m-0 select-none pointer-events-none">
              Use '/' for commands
            </p>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}
