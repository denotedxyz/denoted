import { cn } from "@denoted/ui/src/utils";
import { PropsWithChildren } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className={cn("flex min-h-screen")}>
      <Sidebar className="fixed w-64" />
      <div className="grow pt-4 pl-64">
        <Header className="absolute right-0 top-0 p-4 z-10" />
        <main
          className={cn("relative m-auto h-full max-w-3xl px-4 flex flex-col")}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
