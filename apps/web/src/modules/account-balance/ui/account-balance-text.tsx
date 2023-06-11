import { formatEther } from "viem";
import { useQuery } from "@tanstack/react-query";
import { AccountBalanceService } from "../service";
import { Account } from "../../../core/schemas/account";

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
    return <span>Loading...</span>;
  }

  if (accountBalanceQuery.isError) {
    return <span>Error</span>;
  }

  return (
    <span>
      {formatEther(BigInt(accountBalanceQuery?.data?.balance)).substring(0, 5)}{" "}
      {tickerSymbol}
    </span>
  );
}
