import { EmbedConfig } from "@lexical/react/LexicalAutoEmbedPlugin";
import type { Klass, LexicalEditor, LexicalNode } from "lexical";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { SlashMenuOptionGroup } from "../editor/plugins/SlashMenu/types";

export type CommandMenuOption = {
  title: string;
  description?: string;
  icon: URL | LucideIcon;
  onSelect: (editor: LexicalEditor, query: string) => void;
  group: SlashMenuOptionGroup;
};

interface Module {
  name: string;
  editor: {
    plugin: () => null;
    nodes: Klass<LexicalNode>[];
    embed?: EmbedConfig;
    commandMenu: CommandMenuOption;
  };
}

export function defineModule(module: Module): Module {
  return module;
}
