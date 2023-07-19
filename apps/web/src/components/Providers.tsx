"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet } from "viem/chains";
import { UserContextProvider } from "../contexts/user-context";
import { ComposeContextProvider } from "../contexts/compose-context";
import { LitContextProvider } from "../contexts/lit-context";

const wagmiConfig = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: "denoted",
    infuraId: process.env.NEXT_PUBLIC_INFURA_KEY as string,
    chains: [mainnet],
    walletConnectProjectId: "",
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <ConnectKitProvider>
          <ComposeContextProvider>
            <LitContextProvider>
              <UserContextProvider>{children}</UserContextProvider>
            </LitContextProvider>
          </ComposeContextProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
