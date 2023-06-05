"use client";

import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { createLitClient } from "../lib/lit";

const LitContext = createContext<{
  litClient: LitNodeClient;
}>({
  litClient: null,
});

export function LitProvider({ children }: PropsWithChildren) {
  const [litClient] = useState(createLitClient());

  return (
    <LitContext.Provider value={{ litClient }}>{children}</LitContext.Provider>
  );
}

export const useLitContext = () => useContext(LitContext);
