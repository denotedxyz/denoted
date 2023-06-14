import type {
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from "@lexical/react/LexicalDecoratorBlockNode";
import * as React from "react";
import { DuneEmbedComponent } from "./component";

export type SerializedDuneEmbedNode = Spread<
  {
    queryId: string;
  },
  SerializedDecoratorBlockNode
>;

export class DuneEmbedNode extends DecoratorBlockNode {
  __queryId: string;

  getQueryId(): string {
    const self = this.getLatest();
    return self.__queryId;
  }

  setQueryId(queryId: string) {
    const self = this.getWritable();
    self.__queryId = queryId;
  }

  static getType(): string {
    return "dune-embed";
  }

  static clone(node: DuneEmbedNode): DuneEmbedNode {
    return new DuneEmbedNode(node.getQueryId(), node.__format, node.getKey());
  }

  static importJSON(serializedNode: SerializedDuneEmbedNode): DuneEmbedNode {
    const node = $createDuneEmbedNode(serializedNode.queryId);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedDuneEmbedNode {
    return {
      ...super.exportJSON(),
      queryId: this.getQueryId(),
      type: this.getType(),
      version: 1,
    };
  }

  constructor(queryId: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__queryId = queryId;
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__queryId;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return `https://dune.com/embeds/${this.__queryId}`;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock;
    const className = {
      base: embedBlockTheme?.base ?? "",
      focus: embedBlockTheme?.focus ?? "",
    };
    return (
      <DuneEmbedComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        queryId={this.__queryId}
      />
    );
  }
}

export function $createDuneEmbedNode(queryId: string): DuneEmbedNode {
  return new DuneEmbedNode(queryId);
}

export function $isDuneEmbedNode(
  node: DuneEmbedNode | LexicalNode | null | undefined
): node is DuneEmbedNode {
  return node instanceof DuneEmbedNode;
}
