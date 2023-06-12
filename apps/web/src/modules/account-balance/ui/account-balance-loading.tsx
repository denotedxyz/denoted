import { Skeleton } from "@denoted/ui";
import { TextPill } from "./account-balance-text";

export function AccountBalanceLoading() {
  return (
    <TextPill>
      <Skeleton className="inline-block h-4 w-20" />
    </TextPill>
  );
}
