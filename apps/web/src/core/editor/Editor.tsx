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
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import {
  DEFAULT_TRANSFORMERS,
  MarkdownShortcutPlugin,
} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import TextareaAutosize from "react-textarea-autosize";
import { CORE_EDITOR_NODES } from "./nodes";
import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";
import { AutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import { DraggableBlockPlugin } from "./plugins/DraggableBlockPlugin";
import { SlashMenuPlugin } from "./plugins/SlashMenu";
import { FloatingLinkEditorPlugin } from "./plugins/FloatingLinkEditorPlugin";

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
    theme: {
      link: "cursor-pointer",
      code: "block",
      list: {
        nested: {
          listitem: "list-none before:hidden after:hidden",
        },
      },
    },
  };

  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTitle(event.target.value);
  }

  useEffect(() => {
    document.title = `${
      title.length > 0 ? title : TITLE_PLACEHOLDER
    } | denoted`;
  }, [title]);

  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <AutoFocusPlugin />
      <AutoLinkPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <MarkdownShortcutPlugin transformers={DEFAULT_TRANSFORMERS} />
      <TabIndentationPlugin />
      <LinkPlugin />
      {/*
       * TODO: render this when editor is not editable
       * <LexicalClickableLinkPlugin />
       */}
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <CodeHighlightPlugin />
      {editorRef.current && (
        <>
          <FloatingLinkEditorPlugin anchorElem={editorRef.current} />
          <DraggableBlockPlugin anchorElem={editorRef.current} />
        </>
      )}
      <SlashMenuPlugin />
      <TextareaAutosize
        ref={titleRef}
        placeholder={TITLE_PLACEHOLDER}
        className="px-8 mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-slate-200 focus:outline-none"
        value={title}
        onChange={handleTitleChange}
        required
      />
      <div className="grow flex relative prose prose-slate" ref={editorRef}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="grow outline-none px-8" />
          }
          placeholder={
            <p className="absolute top-5 left-8 text-slate-300 m-0 select-none pointer-events-none">
              Use '/' for commands
            </p>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}
