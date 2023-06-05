"use client";

import { PropsWithChildren, createContext, useState } from "react";
import { createComposeClient } from "../lib/compose";
import { useContext } from "react";
import { ComposeClient } from "@composedb/client";

const CeramicContext = createContext<{
  composeClient: ComposeClient;
}>({
  composeClient: null,
});

export function CeramicProvider({ children }: PropsWithChildren) {
  const [composeClient] = useState(createComposeClient());

  return (
    <CeramicContext.Provider value={{ composeClient }}>
      {children}
    </CeramicContext.Provider>
  );
}

export const useCeramicContext = () => useContext(CeramicContext);
