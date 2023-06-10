import { useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { Bold, Italic, Underline, Strikethrough, Code } from "lucide-react";

import { IconButton } from "./IconButton";
import { FloatingMenuComponentProps } from "lexical-floating-menu";

export type FloatingMenuState = {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
};

export function FloatingMenu({ editor }: FloatingMenuComponentProps) {
  const [state, setState] = useState<FloatingMenuState>({
    isBold: false,
    isCode: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
  });

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          setState({
            isBold: selection.hasFormat("bold"),
            isCode: selection.hasFormat("code"),
            isItalic: selection.hasFormat("italic"),
            isStrikethrough: selection.hasFormat("strikethrough"),
            isUnderline: selection.hasFormat("underline"),
          });
        });
      }
    );
    return unregisterListener;
  }, [editor]);

  return (
    <div className="flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1">
      <IconButton
        aria-label="Format text as bold"
        active={state.isBold}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        icon={Bold}
      />
      <IconButton
        aria-label="Format text as italics"
        active={state.isItalic}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        icon={Italic}
      />
      <IconButton
        aria-label="Format text to underlined"
        active={state.isUnderline}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        icon={Underline}
      />
      <IconButton
        aria-label="Format text with a strikethrough"
        active={state.isStrikethrough}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        icon={Strikethrough}
      />
      <IconButton
        aria-label="Format text with inline code"
        active={state.isCode}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
        icon={Code}
      />
    </div>
  );
}
