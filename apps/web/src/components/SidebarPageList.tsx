"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  buttonVariants,
  cn,
} from "@denoted/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { pageService } from "../core/page/service";
import { Page } from "../core/page/schema";
import { MoreVertical, Trash } from "lucide-react";

export function SidebarPageList() {
  const pathname = usePathname();
  const router = useRouter();

  const pagesQuery = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const pages = await pageService.getAll();
      return pages;
    },
  });

  const queryClient = useQueryClient();

  const createPageMutation = useMutation(
    async () => {
      return await pageService.create();
    },
    {
      onSuccess: (page) => {
        router.push(`/${page.localId}`);
        queryClient.setQueryData<Page[]>(["pages"], (pages) => {
          return pages?.concat(page) ?? [page];
        });
      },
    }
  );

  const deletePageMutation = useMutation(
    async (pageId: string) => {
      return await pageService.delete(pageId);
    },
    {
      onSuccess: (pageId) => {
        queryClient.setQueryData<Page[]>(["pages"], (pages) => {
          return pages?.filter((page) => page.localId !== pageId) ?? [];
        });
        const firstPage = pagesQuery.data?.at(0);
        router.push(`/${firstPage?.localId}`);
      },
    }
  );

  return (
    <div className="flex flex-col gap-3">
      <span className="mb-4 block text-sm text-gray-400">Pages</span>
      <ul className="flex flex-col gap-3">
        {pagesQuery.data?.map((page) => {
          const url = `/${page.localId}`;

          return (
            <li key={page.localId} className="relative group">
              <Link
                href={url}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start truncate block",
                  url === pathname && "border-gray-600"
                )}
              >
                {page.title.length > 0 ? page.title : "Untitled"}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 absolute w-6 h-6 p-0 rounded-sm top-1/2 right-2 transform -translate-y-1/2"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => deletePageMutation.mutate(page.localId)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>
      <Button variant="outline" onClick={() => createPageMutation.mutate()}>
        New page
      </Button>
    </div>
  );
}
