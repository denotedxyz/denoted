import { Button, Input } from "@denoted/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { ElementFormatType, NodeKey } from "lexical";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWithNode } from "../../../core/editor/hooks/useWithNode";
import { $isDuneEmbedNode } from "./node";

type DuneEmbedComponentState = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  queryId: string | null;
}>;

const formSchema = z.object({
  data: z.union([z.string().url(), z.coerce.number()]),
});

type FormValues = z.infer<typeof formSchema>;

export function DuneEmbedComponent({
  className,
  format,
  nodeKey,
  queryId,
}: DuneEmbedComponentState) {
  const [localQueryId, setLocalQueryId] = useState<string | null>(
    queryId ?? null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { withNode } = useWithNode(nodeKey, $isDuneEmbedNode);

  function setQueryId(queryId: string) {
    withNode(
      (node) => node.setQueryId(queryId),
      () => setLocalQueryId(queryId)
    );
  }

  function onSubmit({ data }: FormValues) {
    if (typeof data === "number") {
      return setQueryId(data.toString());
    }

    const duneUrlRegex = /https:\/\/dune\.com\/(queries|embeds)\/(\d+\/\d+)/;

    const match = data.match(duneUrlRegex);
    if (match) {
      const [_url, _type, id] = match;
      return setQueryId(id);
    }
  }

  console.log({ localQueryId });

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      {localQueryId ? (
        <iframe
          className="w-full aspect-video"
          src={`https://dune.com/embeds/${localQueryId}`}
          allowFullScreen={true}
        />
      ) : (
        <div className="p-4 w-full bg-gray-50 rounded-md">
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <Input
              {...form.register("data")}
              placeholder="https://dune.com/embeds/"
              autoFocus
              className="w-auto grow"
            />
            <Button type="submit">Save</Button>
          </form>
        </div>
      )}
    </BlockWithAlignableContents>
  );
}
