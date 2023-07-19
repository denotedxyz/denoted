import { PropsWithChildren, createContext, useContext, useState } from "react";
import { composeClient } from "../lib/compose";
import { useCompose } from "../hooks/useCompose";

const composeContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => {},
});

export function ComposeContextProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    composeClient.did?.authenticated ?? false
  );

  return (
    <composeContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </composeContext.Provider>
  );
}

export const useComposeContext = () => useContext(composeContext);
