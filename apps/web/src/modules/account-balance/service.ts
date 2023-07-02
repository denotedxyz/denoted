import { z } from "zod";
import { Account } from "../../core/schemas/account";
import { AccountBalance } from "./schemas/account-balance";
import { covalentBalanceResponseSchema } from "./schemas/covalent";

export class AccountBalanceService {
  public static async getAccountBalances(
    account: Account
  ): Promise<AccountBalance[]> {
    const response = await fetch(
      `https://api.covalenthq.com/v1/${account.chainId}/address/${account.address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_KEY}`
    );

    if (response.status === 404) {
      return [];
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.error_message);
    }

    const { data } = covalentBalanceResponseSchema.parse(json);

    return data.items.map<AccountBalance>((item) => ({
      tickerSymbol: item.contract_ticker_symbol,
      balance: z.coerce.number().parse(item.balance),
      decimals: item.contract_decimals,
    }));
  }

  public static async getAccountBalance(
    account: Account,
    tickerSymbol: string
  ): Promise<AccountBalance> {
    const balances = await this.getAccountBalances(account);
    const balance = balances.find(
      (balance) =>
        balance.tickerSymbol.toLowerCase() === tickerSymbol.toLowerCase()
    );

    if (!balance) {
      throw new Error(`Balance not found for ${tickerSymbol}`);
    }

    return balance;
  }
}
