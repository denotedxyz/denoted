"use client";

import { Skeleton } from "@denoted/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { pageService } from "../core/page/service";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { DeserializedPage } from "../utils/page-helper";
import { PageEditor } from "./PageEditor";
import { Editor } from "../core/editor/components/Editor";

export function UpdatePageEditor({ pageId }: { pageId: string }) {
  // const pageQuery = useQuery({
  //   queryKey: ["PAGE", pageId],
  //   queryFn: async () => {
  //     const page = await pageService.getById(pageId);

  //     if (!page) {
  //       throw new Error("Page not found");
  //     }

  //     return page;
  //   },
  // });

  // if (pageQuery.isLoading) {
  //   return (
  //     <div>
  //       <Skeleton className="mb-8 h-[60px] w-full rounded-lg" />
  //       <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
  //       <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
  //       <Skeleton className="mb-2 h-[20px] w-full rounded-lg" />
  //     </div>
  //   );
  // }

  // if (pageQuery.data) {
  //   return <Editor pageId="1" />;
  // }

  return <Editor pageId={pageId} />;
}
