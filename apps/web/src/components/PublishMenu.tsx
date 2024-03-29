"use client";

import React, { useState } from "react";
import { getBaseUrl } from "../utils/base-url";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DeserializedPage } from "../utils/page-helper";
import { Database } from "../lib/supabase/supabase.types";
import { Share, Link as LinkIcon, TwitterIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@denoted/ui";
import { Button, buttonVariants } from "@denoted/ui";
import { cn } from "@denoted/ui";
import { useToast } from "@denoted/ui";
// import * as IpfsImage from "./commands/ipfs-image";
import { formatRelative } from "date-fns";

async function onPublishContent(
  blocks: any[],
  encryptionKey: CryptoKey | undefined
): Promise<any[]> {
  return await Promise.all(
    blocks.map(async (block) => {
      if (block.content) {
        block.content = await onPublishContent(block.content, encryptionKey);
      }

      // if (block.type === IpfsImage.extension.name) {
      //   block.attrs = await IpfsImage.onPublish(block.attrs, encryptionKey);
      // }

      return block;
    })
  );
}

const generateTweetLink = (title: string, url: string) => {
  const base = "https://twitter.com/intent/tweet";
  const text = [`check out ${title} on denoted`, url].join("\n\n");

  const params = new URLSearchParams({
    text,
  });

  return `${base}?${params.toString()}`;
};

export type PublishmenuProps = {
  page: DeserializedPage;
  encryptionKey: CryptoKey | undefined;
};

export const PublishMenu: React.FC<PublishmenuProps> = ({
  page,
  encryptionKey,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const { toast } = useToast();

  const publishMutation = useMutation(
    async () => {
      const pageToPublish = structuredClone(page);

      pageToPublish.data = await onPublishContent(
        pageToPublish.data,
        encryptionKey
      );

      const response = await fetch("/api/page/publish", {
        method: "POST",
        body: JSON.stringify({ page: pageToPublish }),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      return json;
    },
    {
      onSuccess: (data) => {
        toast({
          title: "Published page 🚀",
          description: `Your page has been published to IPFS. See it at ${getBaseUrl()}/p/${
            data.id
          }`,
        });
        publicationsQuery.refetch();
      },
    }
  );

  const publicationsQuery = useQuery(["PUBLICATIONS", page.id], async () => {
    const response = await fetch(`/api/page/publications?pageId=${page.id}`);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const json: Database["public"]["Tables"]["page_publication"]["Row"][] =
      await response.json();

    return json;
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Share className="mr-2 h-4 w-4" />
          <span>Publish</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-2 text-sm text-zinc-500">Publications</p>
        <div className="flex w-full flex-col gap-4">
          <Button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isLoading}
          >
            {publishMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Share className="mr-2 h-4 w-4" />
            )}
            Publish to IPFS
          </Button>
          {publicationsQuery.data?.slice(0, 1).map((publication) => {
            const url = `${getBaseUrl()}/p/${publication.id}`;

            return (
              <div className="flex w-full flex-col gap-3" key={publication.id}>
                <div>
                  <h3 className="mb-2 text-sm text-zinc-500">
                    Latest publication
                  </h3>
                  Version {publicationsQuery.data.length}{" "}
                  <span className="text-sm text-zinc-500">
                    (
                    {formatRelative(
                      new Date(publication.created_at),
                      new Date()
                    )}
                    )
                  </span>
                </div>
                <Button
                  variant={"outline"}
                  onClick={() => copyToClipboard(url)}
                >
                  {isCopied ? null : <LinkIcon className="mr-2 h-4 w-4" />}
                  <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                </Button>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-[#1DA1F2]"
                  )}
                  href={generateTweetLink(page.title, url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon className="mr-2 h-4 w-4" />
                  Share to Twitter
                </Link>
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-[#ABFE2C]"
                  )}
                  href={`https://lenster.xyz/?text=${encodeURIComponent(
                    page.title
                  )}&url=${url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="mr-2 block">
                    <span>lens</span>
                  </span>
                  Share to Lens
                </Link>
              </div>
            );
          })}
          {(publicationsQuery.data ?? []).length > 1 && (
            <div>
              <h3 className="mb-2 text-sm text-zinc-500">
                Previous publications
              </h3>
              <ol className="grid gap-1">
                {publicationsQuery.data
                  ?.slice(1)
                  .map((publication, index, array) => (
                    <li key={publication.id}>
                      <Link href={`/p/${publication.id}`} target="_blank">
                        Version {array.length - index}{" "}
                        <span className="text-sm text-zinc-500">
                          (
                          {formatRelative(
                            new Date(publication.created_at),
                            new Date()
                          )}
                          )
                        </span>
                      </Link>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
