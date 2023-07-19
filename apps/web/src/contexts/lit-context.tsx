import { PropsWithChildren, createContext, useContext, useState } from "react";
import { getIsLitAuthenticated } from "../lib/lit";

const litContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => {},
});

export function LitContextProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(getIsLitAuthenticated);

  return (
    <litContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </litContext.Provider>
  );
}

export const useLitContext = () => useContext(litContext);
