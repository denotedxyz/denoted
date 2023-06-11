import { defineModule } from "../../core/modules/define";
import { AccountBalanceNode } from "./editor/node";
import { AccountBalancePlugin } from "./editor/plugin";

export default defineModule({
  name: "account-balance",
  editor: {
    plugin: AccountBalancePlugin,
    nodes: [AccountBalanceNode],
  },
});
