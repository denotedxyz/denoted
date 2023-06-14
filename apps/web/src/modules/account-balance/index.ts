import { Wallet } from "lucide-react";
import { defineModule } from "../../core/modules/define";
import { AccountBalanceNode } from "./editor/node";
import {
  AccountBalancePlugin,
  INSERT_ACCOUNT_BALANCE_COMMAND,
} from "./editor/plugin";

export default defineModule({
  name: "account-balance",
  editor: {
    plugin: AccountBalancePlugin,
    nodes: [AccountBalanceNode],
    commandMenu: {
      title: "Balance",
      icon: Wallet,
      group: "account",
      onSelect: (editor) =>
        editor.dispatchCommand(INSERT_ACCOUNT_BALANCE_COMMAND, null),
    },
  },
});
