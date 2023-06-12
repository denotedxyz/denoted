import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import { $createAccountBalanceNode, AccountBalanceNode } from "./node";

export const INSERT_ACCOUNT_BALANCE_COMMAND: LexicalCommand<null> =
  createCommand("INSERT_ACCOUNT_BALANCE_COMMAND");

export function AccountBalancePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([AccountBalanceNode])) {
      throw new Error(
        "AccountBalancePlugin: AccountBalanceNode not registered"
      );
    }

    return editor.registerCommand(
      INSERT_ACCOUNT_BALANCE_COMMAND,
      () => {
        const accountBalanceNode = $createAccountBalanceNode();
        $insertNodes([accountBalanceNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  });

  return null;
}
