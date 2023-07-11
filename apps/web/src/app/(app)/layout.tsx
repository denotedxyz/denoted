import { cn } from "@denoted/ui/src/utils";
import { PropsWithChildren } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className={cn("flex min-h-screen")}>
      <Sidebar className="fixed w-64 z-10" />
      <main className={cn("grow pl-64 relative h-full flex flex-col")}>
        {children}
      </main>
    </div>
  );
}
