"use client";

import { buttonVariants } from "@denoted/ui";
import { useQuery } from "@tanstack/react-query";
import { Compass, PenBox } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getPagesQuery } from "../composedb/page";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { composeClient } from "../lib/compose";
import { cn } from "../utils/classnames";
import { DecryptedText } from "./DecryptedText";
import { Footer } from "./Footer";
import { Logo } from "./Logo";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const [isCeramicSessionValid, setIsCeramicSessionValid] = useState(false);

  const pathname = usePathname();
  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  useEffect(() => {
    const run = async () =>
      setIsCeramicSessionValid(await ceramic.hasSession());
    run();
  }, [ceramic]);

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    isCeramicSessionValid &&
    lit.isLitAuthenticated;

  const myPagesQuery = useQuery(
    ["PAGES", composeClient.id],
    async () => {
      const query = await getPagesQuery();
      const pages = query.data?.pageIndex?.edges.map((edge) => edge.node) ?? [];
      const myPages = pages.filter(
        (page) => page.createdBy.id === composeClient.id && !page.deletedAt
      );
      return myPages;
    },
    {
      enabled: isAuthenticated,
    }
  );

  return (
    <aside
      className={cn(
        "flex h-full flex-col items-start gap-6 bg-slate-50 p-4",
        className
      )}
    >
      <header>
        <div className="flex justify-center">
          <Link href={`/`}>
            <Logo />
          </Link>
        </div>
      </header>
      <nav className="w-full">
        <ul className="flex flex-col gap-6">
          <li className="flex flex-col gap-3">
            <Link
              href={{
                pathname: "/create",
              }}
              className={buttonVariants()}
            >
              <PenBox className="mr-2 h-4 w-4" />
              Create page
            </Link>
            <Link
              href="/explore"
              className={buttonVariants({ variant: "secondary" })}
            >
              <Compass className="mr-2 h-4 w-4" />
              Explore
            </Link>
          </li>
          {isAuthenticated && (
            <li>
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
            </li>
          )}
        </ul>
      </nav>
      <Footer className="mt-auto" />
    </aside>
  );
}
