import { buttonVariants } from "@denoted/ui/src/components/button";
import { Compass, PenBox } from "lucide-react";
import Link from "next/link";
import { cn } from "@denoted/ui";
import { Footer } from "./Footer";
import { Logo } from "./Logo";
import { SidebarPageList } from "./SidebarPageList";

type SidebarProps = {
  className?: string;
};

export function Sidebar({ className }: SidebarProps) {
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
      <nav className="w-full flex flex-col gap-4">
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
        </ul>
        <SidebarPageList />
      </nav>
      <Footer className="mt-auto" />
    </aside>
  );
}
