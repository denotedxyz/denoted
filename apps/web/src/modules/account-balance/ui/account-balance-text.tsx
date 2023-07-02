import { Address, formatEther, formatUnits } from "viem";
import { useQuery } from "@tanstack/react-query";
import { AccountBalanceService } from "../service";
import { Account } from "../../../core/schemas/account";
import { PropsWithChildren } from "react";
import { Skeleton, cn } from "@denoted/ui";
import { AccountBalanceLoading } from "./account-balance-loading";
import { getEnsAddress } from "../../../utils/ens";

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
    queryFn: async () => {
      return AccountBalanceService.getAccountBalance(account, tickerSymbol);
    },
  });

  if (accountBalanceQuery.isLoading) {
    return <AccountBalanceLoading />;
  }

  if (accountBalanceQuery.isError) {
    console.log(accountBalanceQuery.error);
    return <TextPill>{JSON.stringify(accountBalanceQuery.error)}</TextPill>;
  }

  const formatted = formatUnits(
    BigInt(accountBalanceQuery?.data?.balance),
    accountBalanceQuery.data.decimals
  );

  return (
    <TextPill>
      {formatted} {accountBalanceQuery.data.tickerSymbol}
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
