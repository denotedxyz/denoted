import { formatEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { AccountBalanceService } from "../service";
import { Account } from "../../../core/schemas/account";
import { PropsWithChildren } from "react";
import { Skeleton, cn } from "@denoted/ui";
import { AccountBalanceLoading } from "./account-balance-loading";

export type AccountBalanceTextProps = {
  account: Account;
  tickerSymbol: string;
};

export function AccountBalanceText({
  account,
  tickerSymbol,
}: AccountBalanceTextProps) {
  const accountBalanceQuery = useQuery({
    queryKey: ["account-balance", account, tickerSymbol],
    queryFn: async () =>
      AccountBalanceService.getAccountBalance(account, tickerSymbol),
  });

  if (accountBalanceQuery.isLoading) {
    return <AccountBalanceLoading />;
  }

  if (accountBalanceQuery.isError) {
    return <TextPill>{JSON.stringify(accountBalanceQuery.error)}</TextPill>;
  }

  return (
    <TextPill>
      {formatEther(BigInt(accountBalanceQuery?.data?.balance)).substring(0, 5)}{" "}
      {tickerSymbol}
    </TextPill>
  );
}

export function TextPill({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn(className, "border rounded-md py-0.5 px-1")}>
      {children}
    </span>
  );
}
