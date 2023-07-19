import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@denoted/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AccountBalanceText,
  AccountBalanceTextProps,
  TextPill,
} from "../ui/account-balance-text";
import { $isAccountBalanceNode } from "./node";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@denoted/ui";
import { useState } from "react";
import { Address } from "viem";
import { mainnet } from "wagmi";
import { SUPPORTED_CHAINS } from "../../../constants/supported-chains";
import { useWithNode } from "../../../core/editor/hooks/useWithNode";
import { SupportedChainId } from "../../../core/schemas/account";
import { getNormalizedAddress } from "../../../utils/address";
import { EnsName } from "../../../utils/ens";

type Nullable<T> = { [Key in keyof T]: T[Key] | null };

export type AccountBalanceComponentState = Nullable<AccountBalanceTextProps>;

type ModuleBlockComponentProps<T> = T & {
  nodeKey: string;
};

type AccountBalanceComponentProps = ModuleBlockComponentProps<{
  state: AccountBalanceComponentState;
}>;

function validateState(
  state: AccountBalanceComponentState
): state is AccountBalanceTextProps {
  return Object.values(state).every((value) => value !== null);
}

const addressSchema = z
  .string()
  .startsWith("0x")
  .length(42)
  .refine((value): value is Address => true);

const ensSchema = z
  .string()
  .endsWith(".eth")
  .refine((value): value is EnsName => true);

const chainIdSchema = z.coerce
  .number()
  .refine((id: number): id is SupportedChainId =>
    SUPPORTED_CHAINS.some((chain) => chain.id === id)
  );

const formSchema = z.object({
  account: z.object({
    address: z.union([addressSchema, ensSchema]),
    chainId: chainIdSchema,
  }),
  tickerSymbol: z.string(),
});

export function AccountBalanceComponent({
  nodeKey,
  state: persistedState,
}: AccountBalanceComponentProps) {
  const [localState, setLocalState] = useState(persistedState);
  const isValidState = validateState(localState);
  const [isPopoverOpen, setIsPopoverOpen] = useState(!isValidState);
  const [editor] = useLexicalComposerContext();

  const { withNode } = useWithNode(nodeKey, $isAccountBalanceNode);

  function setState(state: AccountBalanceComponentState) {
    withNode(
      (node) => node.setState(state),
      () => setLocalState(state)
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: localState.account ?? {
        address: undefined,
        chainId: mainnet.id,
      },
      tickerSymbol: localState.tickerSymbol ?? undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const normalizedAddress = await getNormalizedAddress(
      values.account.address
    );

    setState({
      account: {
        address: normalizedAddress,
        chainId: values.account.chainId,
      },
      tickerSymbol: values.tickerSymbol.toUpperCase(),
    });

    setIsPopoverOpen(false);
  }

  return (
    <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
      <PopoverTrigger>
        {isValidState ? (
          <AccountBalanceText
            account={localState.account}
            tickerSymbol={localState.tickerSymbol}
          />
        ) : (
          <TextPill>config</TextPill>
        )}
      </PopoverTrigger>
      <PopoverContent align="start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tickerSymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="ETH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="vitalik.eth" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account.chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ethereum" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUPPORTED_CHAINS.map((chain) => (
                        <SelectItem
                          key={chain.name}
                          value={chain.id.toString()}
                        >
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" variant="secondary">
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
