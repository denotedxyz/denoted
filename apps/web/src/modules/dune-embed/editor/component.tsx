import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@denoted/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { ElementFormatType, NodeKey } from "lexical";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWithNode } from "../../../core/editor/hooks/useWithNode";
import { $isDuneEmbedNode } from "./node";
import { MoreVertical } from "lucide-react";

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

function DuneEmbedForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
      <Input
        {...form.register("data")}
        placeholder="https://dune.com/embeds/"
        autoFocus
        className="w-auto grow"
      />
      <Button type="submit" variant="secondary">
        Save
      </Button>
    </form>
  );
}

export function DuneEmbedComponent({
  className,
  format,
  nodeKey,
  queryId,
}: DuneEmbedComponentState) {
  const [localQueryId, setLocalQueryId] = useState<string | null>(
    queryId ?? null
  );

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

  const src = `https://dune.com/embeds/${localQueryId}`;

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      {localQueryId ? (
        <div className="relative group">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="opacity-0 z-10 group-hover:opacity-100 absolute p-0 w-8 h-8 top-2 right-2"
                variant="secondary"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-auto p-3 bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-300 shadow-sm"
            >
              <DuneEmbedForm
                onSubmit={onSubmit}
                defaultValues={{
                  data: src,
                }}
              />
            </PopoverContent>
          </Popover>
          <iframe
            className="w-full aspect-video border border-gray-100 rounded-sm"
            src={src}
            allowFullScreen={true}
          />
        </div>
      ) : (
        <div className="p-4 w-full bg-gray-50 rounded-md">
          <DuneEmbedForm onSubmit={onSubmit} />
        </div>
      )}
    </BlockWithAlignableContents>
  );
}
