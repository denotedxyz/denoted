import { DOMExportOutput, DecoratorNode } from "lexical";
import { Suspense } from "react";
import { AccountBalanceComponentState } from "./component";
import React from "react";

const AccountBalanceComponent = React.lazy(async () =>
  import("./component").then((module) => ({
    default: module.AccountBalanceComponent,
  }))
);

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

export function $createAccountBalanceNode() {
  return new AccountBalanceNode();
}

export function $isAccountBalanceNode(
  node: unknown
): node is AccountBalanceNode {
  return node instanceof AccountBalanceNode;
}
