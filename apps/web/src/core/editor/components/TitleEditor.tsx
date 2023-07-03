"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

export const TITLE_PLACEHOLDER = "Untitled";

type TitleEditorProps = {
  initial: string;
  onChange: (title: string) => void;
};

export function TitleEditor({ initial, onChange }: TitleEditorProps) {
  const [title, setTitle] = useState(initial);

  const [editor] = useLexicalComposerContext();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange(newTitle);

    if (newTitle.length > 0) {
      document.title = `${newTitle} | denoted`;
    } else {
      document.title = `Untitled | denoted`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editor.focus();
    }
  };

  return (
    <TextareaAutosize
      ref={titleRef}
      placeholder={TITLE_PLACEHOLDER}
      className="px-8 mb-8 w-full resize-none text-5xl font-bold leading-tight placeholder:text-gray-200 focus:outline-none"
      value={title}
      onChange={handleTitleChange}
      onKeyDown={handleKeyDown}
      required
    />
  );
}
