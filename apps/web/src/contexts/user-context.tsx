"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import { Address, useAccount } from "wagmi";
import { useCompose } from "../hooks/useCompose";
import { useLit } from "../hooks/useLit";

export type User = {
  address: Address;
  did: string | null;
  isAuthenticated: boolean;
  state: {
    lit: boolean;
    compose: boolean;
    account: boolean;
  };
} | null;

const userContext = createContext<User>(null);

export function UserContextProvider({ children }: PropsWithChildren) {
  const account = useAccount();
  const compose = useCompose();
  const lit = useLit();

  const isAuthenticated =
    account.isConnected && compose.isAuthenticated && lit.isAuthenticated;

  const user: User = account.isConnected
    ? {
        isAuthenticated,
        address: account.address!,
        did: compose.did,
        state: {
          lit: lit.isAuthenticated,
          compose: compose.isAuthenticated,
          account: account.isConnected,
        },
      }
    : null;

  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}

export function useUser() {
  return useContext(userContext);
}
