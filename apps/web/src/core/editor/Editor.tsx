"use client";

import { useEffect, useRef, useState } from "react";

import {
  EmbedConfig,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  DEFAULT_TRANSFORMERS,
  MarkdownShortcutPlugin,
} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

import { FloatingMenuPlugin } from "lexical-floating-menu";
import TextareaAutosize from "react-textarea-autosize";
import { modules } from "../../modules";
import { CommandMenuOption } from "../modules/define";
import { CORE_EDITOR_NODES } from "./nodes";
import { AutoLinkPlugin } from "./plugins/AutoLinkPlugin";
import { CodeHighlightPlugin } from "./plugins/CodeHighlightPlugin";
import { DraggableBlockPlugin } from "./plugins/DraggableBlockPlugin";
import { FloatingLinkEditorPlugin } from "./plugins/FloatingLinkEditorPlugin";
import { FloatingMenu } from "./plugins/FloatingMenu/components/FloatingMenu";
import { SlashMenuPlugin } from "./plugins/SlashMenu/SlashMenu";
import { TrailingNodePlugin } from "./plugins/TrailingNodePlugin";
import { LocalStoragePlugin } from "./plugins/LocalStoragePlugin";

export const TITLE_PLACEHOLDER = "Untitled";

const moduleNodes = modules.flatMap((module) => module.editor.nodes);

const NODES = [...CORE_EDITOR_NODES, ...moduleNodes];

const embeds = modules
  .flatMap((module) => module.editor.embed)
  .filter((embed): embed is EmbedConfig => Boolean(embed));

const commandMenuOptions = modules
  .flatMap((module) => module.editor.commandMenu)
  .filter((menu): menu is CommandMenuOption => Boolean(menu));

type EditorProps = {};

export function Editor({}: EditorProps) {
  const initialConfig: InitialConfigType = {
    namespace: "denoted",
    onError: (error) => {
      console.error("Lexical Error:", error);
      throw error;
    },
    nodes: NODES,
    theme: {
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
      <div className="flex flex-col grow">
        <AutoFocusPlugin />
        <AutoLinkPlugin />
        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin transformers={DEFAULT_TRANSFORMERS} />
        <TabIndentationPlugin />
        <LinkPlugin />
        <LexicalAutoEmbedPlugin
          embedConfigs={embeds}
          onOpenEmbedModalForConfig={console.log}
          menuRenderFn={(...args) => {
            console.log(...args);
            return null;
          }}
          getMenuOptions={() => []}
        />
        {/*
         * TODO: render this when editor is not editable
         * <LexicalClickableLinkPlugin />
         */}
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <CodeHighlightPlugin />
        <TrailingNodePlugin />
        <LocalStoragePlugin pageId={"test"} />
        {editorRef.current && (
          <>
            {modules.map((module) => (
              <module.editor.plugin key={module.name} />
            ))}
            <FloatingLinkEditorPlugin anchorElem={editorRef.current} />
            <DraggableBlockPlugin anchorElem={editorRef.current} />
            <FloatingMenuPlugin
              element={editorRef.current}
              MenuComponent={FloatingMenu}
            />
          </>
        )}
        <SlashMenuPlugin options={commandMenuOptions} />
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
              <ContentEditable
                spellCheck={false}
                className="grow outline-none px-8"
              />
            }
            placeholder={
              <p className="absolute top-5 left-8 text-slate-300 m-0 select-none pointer-events-none">
                Use '/' for commands
              </p>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
