import { Address, isAddress } from "viem";
import { getEnsAddress } from "./ens";

export async function getNormalizedAddress(
  addressOrEns: string
): Promise<Address> {
  if (isAddress(addressOrEns)) {
    return addressOrEns;
  }

  const isEns = addressOrEns.endsWith(".eth");

  if (isEns) {
    return await getEnsAddress(addressOrEns);
  }

  throw new Error("Invalid address or ENS name");
}
