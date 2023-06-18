import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  CLICK_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  ElementNode,
  KEY_ARROW_DOWN_COMMAND,
  LexicalNode,
  TextNode,
} from "lexical";
import { useEffect } from "react";

function $shouldInsertTrailingNode(
  lastNode: LexicalNode,
  focusedNode: TextNode | ElementNode
) {
  if ($isTextNode(focusedNode)) {
    const parentNode = focusedNode.getParent();

    if (lastNode === parentNode && !parentNode?.isEmpty()) {
      return true;
    }
  }

  if (lastNode === focusedNode && !focusedNode?.isEmpty()) {
    return true;
  }

  return false;
}

function onSelectionChange() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return true;
  }

  const focusedNode = selection.focus.getNode();
  const root = $getRoot();
  const lastNode = root.getLastChild();

  if (lastNode && $shouldInsertTrailingNode(lastNode, focusedNode)) {
    const paragraphNode = $createParagraphNode();
    lastNode.insertAfter(paragraphNode);
    paragraphNode.select();
  }

  return true;
}

export function TrailingNodePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        () => {
          return onSelectionChange();
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => {
          return onSelectionChange();
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return null;
}
