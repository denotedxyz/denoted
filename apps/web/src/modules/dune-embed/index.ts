import { LineChart } from "lucide-react";
import { defineModule } from "../../core/modules/define";
import { DuneEmbedNode } from "./editor/node";
import {
  DuneEmbedPlugin,
  INSERT_DUNE_EMBED_COMMAND,
  duneEmbedConfig,
} from "./editor/plugin";

export default defineModule({
  name: "dune-embed",
  editor: {
    nodes: [DuneEmbedNode],
    plugin: DuneEmbedPlugin,
    embed: duneEmbedConfig,
    commandMenu: {
      title: "Dune",
      icon: LineChart,
      description: "Embed a Dune dashboard",
      onSelect: (editor) =>
        editor.dispatchCommand(INSERT_DUNE_EMBED_COMMAND, null),
      group: "other",
    },
  },
});
