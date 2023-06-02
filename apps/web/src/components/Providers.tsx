"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, ConnectKitProvider } from "connectkit";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

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
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
