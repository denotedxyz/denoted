"use client";

import { useAccount } from "wagmi";
import { decryptString } from "../lib/crypto";
import { importStoredEncryptionKey } from "../utils/page-helper";
import { useLit } from "../hooks/useLit";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, cn } from "@denoted/ui";
import { useState } from "react";

export function DecryptedText({
  encryptionKey,
  value,
  className,
}: {
  encryptionKey: string;
  value: string;
  className?: string;
}) {
  const { address } = useAccount();
  const { litClient } = useLit();

  const decryptQuery = useQuery(
    ["DECRYPTED_TEXT", encryptionKey, value, address],
    async () => {
      const { key } = await importStoredEncryptionKey(
        encryptionKey,
        address!,
        litClient
      );
      return await decryptString(value, key);
    }
  );

  // random number between 0.5 and 1
  const [random] = useState(Math.random() * 0.5 + 0.5);

  if (decryptQuery.isLoading) {
    return (
      <Skeleton
        className="h-4"
        style={{
          animationDelay: random.toString(),
          width: `${(random * 100).toFixed(0)}%`,
        }}
      />
    );
  }

  return <span className={cn(className)}>{decryptQuery.data}</span>;
}
