import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";
import { useEffect } from "react";
import { $createDuneEmbedNode, DuneEmbedNode } from "./node";
import { EmbedConfig } from "@lexical/react/LexicalAutoEmbedPlugin";

export const INSERT_DUNE_EMBED_COMMAND = createCommand<string | null>(
  "INSERT_DUNE_EMBED_COMMAND"
);

export const duneEmbedConfig: EmbedConfig = {
  type: "dune-embed",

  parseUrl(url) {
    const match = url.match(/https:\/\/dune\.analytics\/queries\/(\d+)/);
    if (match) {
      return {
        url: match[0],
        id: match[1],
      };
    }
    return null;
  },
  insertNode(editor, result) {
    editor.dispatchCommand(INSERT_DUNE_EMBED_COMMAND, result.id);
  },
};

export function DuneEmbedPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([DuneEmbedNode])) {
      throw new Error("DuneEmbedPlugin: DuneEmbedNode not registered");
    }

    return editor.registerCommand(
      INSERT_DUNE_EMBED_COMMAND,
      (queryId) => {
        const node = $createDuneEmbedNode(queryId);
        $insertNodes([node]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  });

  return null;
}
