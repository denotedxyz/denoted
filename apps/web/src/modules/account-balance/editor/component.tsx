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
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import {
  AccountBalanceText,
  AccountBalanceTextProps,
  TextPill,
} from "../ui/account-balance-text";
import { $isAccountBalanceNode, AccountBalanceNode } from "./node";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@denoted/ui";
import { Input } from "@denoted/ui";
import { SUPPORTED_CHAINS } from "../../../constants/supported-chains";
import { SupportedChainId } from "../../../core/schemas/account";
import { Address, getAddress } from "viem";
import { getEnsAddress } from "../../../utils/ens";
import { mainnet } from "wagmi";
import { useState } from "react";

type Nullable<T> = { [Key in keyof T]: T[Key] | null };

export type AccountBalanceComponentState = Nullable<AccountBalanceTextProps>;

type ModuleBlockComponentProps<T> = T & {
  nodeKey: string;
};

type AccountBalanceComponentProps = ModuleBlockComponentProps<{
  state: AccountBalanceComponentState;
}>;

function isValidState(
  state: AccountBalanceComponentState
): state is AccountBalanceTextProps {
  return Object.values(state).every((value) => value !== null);
}

const addressSchema = z
  .string()
  .startsWith("0x")
  .length(42)
  .refine((value): value is Address => true);

const ensSchema = z.string().endsWith(".eth");

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [editor] = useLexicalComposerContext();

  function setState(state: AccountBalanceComponentState) {
    withAccountBalanceNode(
      (node) => node.setState(state),
      () => setLocalState(state)
    );
  }

  const withAccountBalanceNode = (
    cb: (node: AccountBalanceNode) => void,
    onUpdate?: () => void
  ): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isAccountBalanceNode(node)) {
          cb(node);
        }
      },
      { onUpdate }
    );
  };

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
    const isEns = values.account.address.endsWith(".eth");

    const normalizedAddress = isEns
      ? await getEnsAddress(values.account.address)
      : (values.account.address as Address);

    setState({
      account: {
        address: normalizedAddress,
        chainId: values.account.chainId,
      },
      tickerSymbol: values.tickerSymbol,
    });

    setIsPopoverOpen(false);
  }

  return (
    <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
      <PopoverTrigger>
        {isValidState(localState) ? (
          <AccountBalanceText
            account={localState.account}
            tickerSymbol={localState.tickerSymbol}
          />
        ) : (
          <TextPill>config</TextPill>
        )}
      </PopoverTrigger>
      <PopoverContent className="bg-gray-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 border border-gray-300 shadow-sm">
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
