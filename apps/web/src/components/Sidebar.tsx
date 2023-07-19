"use client";

import { cn } from "@denoted/ui";
import { buttonVariants } from "@denoted/ui/src/components/button";
import { Compass } from "lucide-react";
import Link from "next/link";
import { Footer } from "./Footer";

import dynamic from "next/dynamic";
import { useUser } from "../contexts/user-context";
import { AuthenticateButton } from "./AuthenticateButton";

const SidebarPageList = dynamic(
  () => import("./SidebarPageList").then((module) => module.SidebarPageList),
  { ssr: false }
);

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
  const user = useUser();
  return (
    <aside
      className={cn(
        "h-full flex flex-col border-r border-zinc-100 p-4",
        className
      )}
    >
      <header className="mb-4 flex justify-between">
        <AuthenticateButton />
      </header>
      <nav className="w-full flex flex-col gap-4">
        <ul>
          <li>
            <Link
              href="/explore"
              className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            >
              <Compass className="mr-2 h-4 w-4" />
              Explore
            </Link>
          </li>
        </ul>
        <SidebarPageList />
      </nav>
      <Footer className="mt-auto" />
    </aside>
  );
}
