import { cn } from "@denoted/ui/src/utils";
import { PropsWithChildren } from "react";
import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { AuthGuard } from "../../components/AuthGuard";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className={cn("grid min-h-screen")}>
      <Sidebar className="fixed w-64" />
      <div className="py-4 pl-64">
        <Header className="absolute right-0 top-0 p-4" />
        <main className={cn("m-auto h-full max-w-3xl px-4 pt-14")}>
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
