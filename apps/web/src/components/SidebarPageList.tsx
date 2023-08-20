"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  buttonVariants,
  cn,
} from "@denoted/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, RefreshCw, Trash } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePageService } from "../core/hooks/use-page-service";
import { useUser } from "../contexts/user-context";

export function SidebarPageList() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useUser();
  const pageService = usePageService();

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
        queryClient.refetchQueries(["pages"]);
      },
    }
  );

  const deletePageMutation = useMutation(
    async (pageId: string) => {
      return await pageService.delete(pageId);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries(["pages"]);
        const firstPage = pagesQuery.data?.at(0);
        router.push(`/${firstPage?.localId}`);
      },
    }
  );

  const syncPagesMutation = useMutation({
    mutationFn: () => pageService.sync(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">Pages</span>
        {user?.isAuthenticated && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => syncPagesMutation.mutate()}
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                syncPagesMutation.isLoading && "animate-spin"
              )}
            />
          </Button>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {pagesQuery.data?.map((page) => {
          const url = `/${page.localId}`;

          return (
            <li key={page.localId} className="relative group">
              <Link
                href={url}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full truncate justify-start"
                  // url === pathname && "border-zinc-600"
                )}
              >
                {page.title.length > 0 ? page.title : "Untitled"}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition absolute w-6 h-6 p-0 rounded-sm top-1/2 right-2 transform -translate-y-1/2"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <button
                        onClick={() => deletePageMutation.mutate(page.localId!)}
                        className="w-full"
                        type="button"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </button>
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
