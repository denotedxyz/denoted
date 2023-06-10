import { useCallback, useEffect, useState } from "react";
import { $isCodeHighlightNode } from "@lexical/code";
import {
  $isLinkNode,
  $isAutoLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";

import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
} from "lucide-react";

import { IconButton } from "./IconButton";
import { FloatingMenuComponentProps } from "lexical-floating-menu";
import { getSelectedNode } from "../../../utils/getSelectedNode";

export type FloatingMenuState = {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isLink: boolean;
};

export function FloatingMenu({ editor }: FloatingMenuComponentProps) {
  const [isText, setIsText] = useState(false);
  const [state, setState] = useState<FloatingMenuState>({
    isBold: false,
    isCode: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
    isSubscript: false,
    isSuperscript: false,
    isLink: false,
  });

  // const insertLink = useCallback(() => {
  //   if (!isLink) {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
  //   } else {
  //     editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  //   }
  // }, [editor, isLink]);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }
          const isCodeHighlight = $isCodeHighlightNode(
            selection.anchor.getNode()
          );

          const isEmptySelection = selection.getTextContent() === "";

          if (isCodeHighlight || isEmptySelection) {
            return setIsText(false);
          }

          const node = getSelectedNode(selection);
          const parent = node.getParent();

          setIsText($isTextNode(node));

          const isLink = [node, parent].some($isLinkNode);

          setState({
            isBold: selection.hasFormat("bold"),
            isCode: selection.hasFormat("code"),
            isItalic: selection.hasFormat("italic"),
            isStrikethrough: selection.hasFormat("strikethrough"),
            isUnderline: selection.hasFormat("underline"),
            isSubscript: selection.hasFormat("subscript"),
            isSuperscript: selection.hasFormat("superscript"),
            isLink,
          });
        });
      }
    );
    return unregisterListener;
  }, [editor]);

  if (!isText || state.isLink) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md gap-1">
      <div className="p-1 gap-1 border-r-[1px] border-slate-300 flex">
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
        <IconButton
          aria-label="Format text to subscript"
          active={state.isSubscript}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
          }}
          icon={Subscript}
        />
        <IconButton
          aria-label="Format text to superscript"
          active={state.isSuperscript}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
          }}
          icon={Superscript}
        />
        <IconButton
          aria-label="Convert to link"
          active={state.isLink}
          onClick={() => {
            const initialUrl = state.isLink ? null : "https://";
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, initialUrl);
          }}
          icon={Link2}
        />
      </div>
      <div className="p-1 gap-1 flex">
        <IconButton
          aria-label="Align text to the left"
          active={false}
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }}
          icon={AlignLeft}
        />
        <IconButton
          aria-label="Align text to the center"
          active={false}
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }}
          icon={AlignCenter}
        />
        <IconButton
          aria-label="Align text to the right"
          active={false}
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }}
          icon={AlignRight}
        />
      </div>
    </div>
  );
}
