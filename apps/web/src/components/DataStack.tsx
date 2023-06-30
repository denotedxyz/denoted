import { cn } from "@denoted/ui";
import { PropsWithChildren } from "react";
import { QueryStatus, UseQueryResult } from "@tanstack/react-query";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Skeleton } from "@denoted/ui";

type DataStackProps = PropsWithChildren<{
  query: UseQueryResult;
  className?: string;
  status?: QueryStatus;
}>;

export const DataStack = ({
  className,
  query,
  status,
  children,
}: DataStackProps) => {
  const base = "rounded-md m-0 p-0";

  const isStatus = (s: QueryStatus) =>
    [query.status, status].some((x) => x === s);

  if (isStatus("loading")) {
    return (
      <span
        className={cn(base, "relative top-1 inline-flex overflow-hidden p-0")}
      >
        <Skeleton className="inline-flex h-6 w-20" />
      </span>
    );
  }

  if (isStatus("error")) {
    const message =
      "message" in (query.error as any)
        ? (query.error as any).message
        : "something went wrong...";
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger>
            <span className={cn(base, "bg-red-200")}>error</span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content>
              <p>{message}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <div className={cn(base, "bg-gray-100", className)}>
      <ul className="list-none divide-y divide-solid divide-gray-200 m-0 py-0 px-4 dark:divide-gray-700">
        <li className="px-0 py-3 sm:py-4 my-0">{children}</li>
      </ul>
    </div>
  );
};
