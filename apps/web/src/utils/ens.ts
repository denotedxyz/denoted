import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function getEnsAddress(ens: string) {
  return await publicClient.getEnsAddress({
    name: ens,
  });
}
