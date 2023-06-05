"use client";

import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Label } from "../../Label";
import { Badge } from "@denoted/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@denoted/ui";
import { useBlockConfigProps } from "../../use-block-config-props";
import { GraphWidget, GraphWidgetProps } from "./Graph";
import { ConfigForm } from "../ConfigForm";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";

type GraphComponentProps = CommandExtensionProps<GraphWidgetProps>;

export const GraphConfig = (props: GraphComponentProps) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

  const { url, query, path } = props.node.attrs;

  return (
    <span>
      {isConfigured && !props.editor.isEditable && (
        <GraphWidget url={url} query={query} path={path} />
      )}
      {props.editor.isEditable && (
        <Popover
          defaultOpen={!isConfigured}
          onOpenChange={setOpen}
          open={isOpen}
        >
          <BlockConfigButton isConfigured={isConfigured}>
            <GraphWidget url={url} query={query} path={path} />
          </BlockConfigButton>

          <BlockConfigForm
            fields={[
              {
                name: "url",
                type: "text",
                defaultValue: url,
                placeholder: "https://api.thegraph.com/subgraphs/name/...",
              },
              {
                name: "query",
                type: "textarea",
                defaultValue: query,
                placeholder: `query {
  foo {
    bar
  }
}`,
              },
              {
                name: "path",
                type: "text",
                defaultValue: path,
                placeholder: "foo.bar",
              },
            ]}
            onSubmit={onSubmit}
          />
        </Popover>
      )}
    </span>
  );
};
