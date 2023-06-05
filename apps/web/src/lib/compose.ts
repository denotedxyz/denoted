import { ComposeClient } from "@composedb/client";
import { definition } from "../composedb/definition";

export function createComposeClient() {
  return new ComposeClient({
    ceramic: process.env.NEXT_PUBLIC_CERAMIC_API_URL as string,
    definition,
  });
}
