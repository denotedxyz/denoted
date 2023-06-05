"use client";

import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useLit } from "../hooks/useLit";
import { AuthDialog } from "./AuthDialog";
import { PropsWithChildren } from "react";

export function AuthGuard({ children }: PropsWithChildren) {
  const ceramic = useCeramic();
  const lit = useLit();
  const account = useAccount();

  const isLoading = account.isConnecting || ceramic.isLoading || lit.isLoading;

  const isAuthenticated =
    account.isConnected &&
    ceramic.isComposeResourcesSigned &&
    ceramic.isSessionValid &&
    lit.isLitAuthenticated;

  const isOpen = !isLoading && !isAuthenticated;

  return (
    <>
      <AuthDialog open={isOpen} />
      {children}
    </>
  );
}
