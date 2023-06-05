"use client";

import { cn, buttonVariants } from "@denoted/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { getPagesQuery } from "../composedb/page";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { DecryptedText } from "./DecryptedText";
import { useQuery } from "@tanstack/react-query";

export function SidebarPageList() {
  const pathname = usePathname();
  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    ceramic.isSessionValid &&
    lit.isLitAuthenticated;

  const myPagesQuery = useQuery(
    ["PAGES", ceramic.composeClient.id],
    async () => {
      const query = await getPagesQuery(ceramic.composeClient);
      const pages = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];
      const myPages = pages.filter((page) => {
        const isMe =
          page.createdBy.id.toLowerCase() ===
          ceramic.composeClient.id.toLowerCase();
        return isMe && !page.deletedAt;
      });
      return myPages;
    },
    {
      enabled: isAuthenticated,
    }
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="mb-4 block text-sm text-slate-400">Pages</span>
      <ul className="flex flex-col gap-3">
        {myPagesQuery.data?.map((page) => {
          const url = `/${page.id}`;

          return (
            <li key={page.id}>
              <Link
                href={{
                  pathname: url,
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full justify-start",
                  url === pathname && "border-slate-600"
                )}
              >
                <span className="truncate">
                  {page.key ? (
                    <DecryptedText
                      encryptionKey={page.key}
                      value={page.title}
                    />
                  ) : (
                    page.title
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
