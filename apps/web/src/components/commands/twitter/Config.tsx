"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { CommandExtensionProps } from "../../../lib/tiptap/types";
import { Badge } from "@denoted/ui";
import { Popover } from "@denoted/ui";
import { useBlockConfigProps } from "../../use-block-config-props";
import { BlockConfigButton, BlockConfigForm } from "../BlockConfig";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@denoted/ui";

export const TweetConfig = (props: CommandExtensionProps<{ src: string }>) => {
  const { isConfigured, isOpen, onSubmit, setOpen } =
    useBlockConfigProps(props);

  const { src } = props.node.attrs;

  if (isConfigured) {
    try {
      const tweetUrl = new URL(src);
      const urlSegments = tweetUrl.pathname.split("/");
      const tweetId = urlSegments.pop() || urlSegments.pop() || "";

      return (
        <div>
          {/* <Tweet tweetId={tweetId} /> */}
          {tweetId}
        </div>
      );
    } catch (error) {
      const message =
        "message" in (error as any)
          ? (error as any).message
          : "something went wrong...";
      return (
        <div>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-md h-6 border-red-400 px-1 py-0 font-normal text-inherit"
                  )}
                >
                  error
                </Badge>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content>
                  <p>{message}</p>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="flex items-start justify-start gap-2">
        {props.editor.isEditable && (
          <Popover
            defaultOpen={!isConfigured}
            onOpenChange={setOpen}
            open={isOpen}
          >
            <BlockConfigButton isConfigured={isConfigured}>
              settings
            </BlockConfigButton>
            <BlockConfigForm
              fields={[
                {
                  name: "src",
                  type: "text",
                  defaultValue: src,
                  placeholder: "https://twitter.com/...",
                },
              ]}
              onSubmit={onSubmit}
            />
          </Popover>
        )}
        {isConfigured && (
          <Link href={src} target="_blank">
            <Badge variant="secondary">
              open <ExternalLink className="ml-1 h-3 w-3" />
            </Badge>
          </Link>
        )}
      </div>
    </div>
  );
};
