import {
  DOMExportOutput,
  DecoratorNode,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import React, { Suspense } from "react";
import { AccountBalanceComponentState } from "./component";

const AccountBalanceComponent = React.lazy(async () =>
  import("./component").then((module) => ({
    default: module.AccountBalanceComponent,
  }))
);

export type SerializedAccountBalanceNode = Spread<
  AccountBalanceComponentState,
  SerializedLexicalNode
>;

export class AccountBalanceNode extends DecoratorNode<JSX.Element> {
  private __state: AccountBalanceComponentState = {
    account: null,
    tickerSymbol: null,
  };

  getState() {
    const self = this.getLatest();
    return self.__state;
  }

  setState(state: AccountBalanceComponentState) {
    const self = this.getWritable();
    self.__state = state;
  }

  constructor(state?: AccountBalanceComponentState, key?: string) {
    super(key);
    this.__state = state ?? this.__state;
  }

  static getType(): string {
    return "account-balance";
  }

  static clone(node: AccountBalanceNode): AccountBalanceNode {
    return new AccountBalanceNode(node.getState(), node.getKey());
  }

  static importJSON(
    _serializedNode: SerializedAccountBalanceNode
  ): AccountBalanceNode {
    return $createAccountBalanceNode({
      account: _serializedNode.account,
      tickerSymbol: _serializedNode.tickerSymbol,
    });
  }

  exportJSON(): SerializedAccountBalanceNode {
    const state = this.getState();
    return {
      version: 1,
      type: this.getType(),
      ...state,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    return { element };
  }

  createDOM(): HTMLElement {
    const elem = document.createElement("span");
    return elem;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <AccountBalanceComponent
          nodeKey={this.getKey()}
          state={this.getState()}
        />
      </Suspense>
    );
  }

  isInline(): boolean {
    return true;
  }
}

export function $createAccountBalanceNode(
  state?: AccountBalanceComponentState
) {
  return new AccountBalanceNode(state);
}

export function $isAccountBalanceNode(
  node: unknown
): node is AccountBalanceNode {
  return node instanceof AccountBalanceNode;
}
