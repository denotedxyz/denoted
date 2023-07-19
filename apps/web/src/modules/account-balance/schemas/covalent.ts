import { z } from "zod";

export const covalentBalanceItemSchema = z.object({
  contract_decimals: z.number(),
  contract_name: z.string(),
  contract_ticker_symbol: z.string(),
  contract_address: z.string(),
  supports_erc: z.any(),
  logo_url: z.string(),
  last_transferred_at: z.any(),
  native_token: z.boolean(),
  type: z.string(),
  balance: z.coerce.number(),
  balance_24h: z.coerce.number(),
  quote_rate: z.number().nullable(),
  quote_rate_24h: z.number().nullable(),
  quote: z.number().nullable(),
  quote_24h: z.number().nullable(),
  nft_data: z.any(),
});

export const covalentBalanceResponseSchema = z.object({
  data: z.object({
    items: z.array(covalentBalanceItemSchema),
  }),
});
