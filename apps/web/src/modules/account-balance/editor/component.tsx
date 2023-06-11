import { Popover, PopoverContent, PopoverTrigger } from "@denoted/ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import {
  AccountBalanceText,
  AccountBalanceTextProps,
} from "../ui/account-balance-text";
import { $isAccountBalanceNode, AccountBalanceNode } from "./node";

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

export function AccountBalanceComponent({
  nodeKey,
  state,
}: AccountBalanceComponentProps) {
  const [editor] = useLexicalComposerContext();

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

  return (
    <Popover>
      <PopoverTrigger>
        {isValidState(state) ? (
          <AccountBalanceText
            account={state.account}
            tickerSymbol={state.tickerSymbol}
          />
        ) : (
          <span>config</span>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div>set account n stuff</div>
        <button
          onClick={() =>
            withAccountBalanceNode((node) =>
              node.setState({
                tickerSymbol: "ETH",
                account: {
                  address: "0x9768cead8f28bd7aA5e095D4402B8911b8484e7E",
                  chainId: 1,
                },
              })
            )
          }
        >
          set state
        </button>
      </PopoverContent>
    </Popover>
  );
}
