import type { Klass, LexicalNode } from "lexical";

interface Module {
  name: "account-balance";
  editor: {
    plugin: () => null;
    nodes: Klass<LexicalNode>[];
  };
}

export function defineModule(module: Module): Module {
  return module;
}
