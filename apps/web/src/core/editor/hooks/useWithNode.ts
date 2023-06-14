import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalNode, NodeKey, $getNodeByKey } from "lexical";

export function useWithNode<T extends LexicalNode>(
  nodeKey: NodeKey,
  nodeGuard: (node: LexicalNode | null) => node is T
) {
  const [editor] = useLexicalComposerContext();

  function withNode(cb: (node: T) => void, onUpdate?: () => void): void {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if (nodeGuard(node)) {
          cb(node);
        }
      },
      { onUpdate }
    );
  }

  return { withNode };
}
