import { Address } from "viem";
import { SUPPORTED_CHAINS } from "../../constants/supported-chains";

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]["id"];

export type Account = {
  chainId: SupportedChainId;
  address: Address;
};
