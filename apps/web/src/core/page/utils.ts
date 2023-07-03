import { importEncryptionKey } from "../../lib/crypto";
import { getStoredEncryptionKey } from "../../lib/lit";
import { LitNodeClient } from "@lit-protocol/lit-node-client";

export async function importStoredEncryptionKey(
  key: string,
  userAddress: string,
  litClient: LitNodeClient
) {
  const { encryptionKey } = await getStoredEncryptionKey(
    key,
    userAddress,
    litClient
  );
  return await importEncryptionKey(encryptionKey);
}
