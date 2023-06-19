import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function getEnsAddress(ens: string) {
  const address = await publicClient.getEnsAddress({
    name: ens,
  });

  if (!address) {
    throw new Error(`No address found for ${ens}`);
  }

  return address;
}

export type EnsName = `${string}.eth`;
