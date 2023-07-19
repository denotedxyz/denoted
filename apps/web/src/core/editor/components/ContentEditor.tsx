"use client";

import { useCallback, useRef } from "react";

import {
  EmbedConfig,
  LexicalAutoEmbedPlugin,
} from "@lexical/react/LexicalAutoEmbedPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
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

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import { modules } from "../../../modules";
import { CommandMenuOption } from "../../modules/define";
import { AutoLinkPlugin } from "../plugins/AutoLinkPlugin";
import { CodeHighlightPlugin } from "../plugins/CodeHighlightPlugin";
import { DraggableBlockPlugin } from "../plugins/DraggableBlockPlugin";
import { FloatingLinkEditorPlugin } from "../plugins/FloatingLinkEditorPlugin";
import { FloatingMenuPlugin } from "../plugins/FloatingMenu/FloatingMenuPlugin";
import { FloatingMenu } from "../plugins/FloatingMenu/components/FloatingMenu";
import { SlashMenuPlugin } from "../plugins/SlashMenu/SlashMenu";
import { TrailingNodePlugin } from "../plugins/TrailingNodePlugin";

const embeds = modules
  .flatMap((module) => module.editor.embed)
  .filter((embed): embed is EmbedConfig => Boolean(embed));

const commandMenuOptions = modules
  .flatMap((module) => module.editor.commandMenu)
  .filter((menu): menu is CommandMenuOption => Boolean(menu));

type ContentEditorProps = {
  onChange: (content: string) => void;
};

export function ContentEditor({ onChange }: ContentEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback((editorState: EditorState) => {
    onChange(JSON.stringify(editorState.toJSON()));
  }, []);

  return (
    <>
      <OnChangePlugin onChange={handleChange} />
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

      <div className="grow flex relative prose prose-slate" ref={editorRef}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              spellCheck={false}
              className="grow outline-none px-8"
            />
          }
          placeholder={
            <p className="absolute top-5 left-8 text-zinc-300 m-0 select-none pointer-events-none">
              Use '/' for commands
            </p>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </>
  );
}
