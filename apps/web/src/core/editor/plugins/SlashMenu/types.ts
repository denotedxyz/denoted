import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export type SlashMenuOptionGroup = "basic" | "other";

export class SlashMenuOption extends MenuOption {
  // What group does this option belong to?
  group: SlashMenuOptionGroup;
  // What shows up in the editor
  title: string;
  // Description of plugin
  description?: string;
  // Icon for display
  icon?: string | ReactNode;
  // For extra searching.
  keywords: string[];
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      group: SlashMenuOptionGroup;
      description?: string;
      icon?: string | ReactNode;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.group = options.group;
    this.description = options.description;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}
