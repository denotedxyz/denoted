import { SUPPORTED_CHAINS } from "../../constants/supported-chains";
import { Address } from "viem";

export type SupportedChainId = typeof SUPPORTED_CHAINS[number]["id"];

export type Account = {
  chainId: SupportedChainId;
  address: Address;
};
