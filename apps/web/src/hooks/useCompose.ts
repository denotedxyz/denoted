import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { InjectedConnector } from "@wagmi/core";
import { DIDSession } from "did-session";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";

export const LOCAL_STORAGE_KEYS = {
  DID:
    process.env.NODE_ENV === "production"
      ? "denoted.ceramic.did"
      : "denoted.DEV.ceramic.did",
};

type UseComposeResult = {
  authenticate: UseMutationResult<void, unknown, void, unknown>;
} & (
  | {
      isAuthenticated: true;
      did: string;
    }
  | {
      isAuthenticated: false;
      did: null;
    }
);

export function useCompose(): UseComposeResult {
  const { address } = useAccount();
  const [isAuthenticated, setIsAuthenticated] = useState(
    composeClient.did?.authenticated
  );

  useEffect(() => {
    async function run() {
      const storedSession = await getSession();
      const isValidSession = getSessionValidity(storedSession);
      if (isValidSession) {
        composeClient.setDID(storedSession.did);
        setIsAuthenticated(true);
      }
    }
    run();
  }, []);

  const connector = new InjectedConnector();

  function getSessionValidity(
    session: DIDSession | null
  ): session is DIDSession {
    return (
      !!session &&
      session.hasSession &&
      !session.isExpired &&
      session.isAuthorized(composeClient.resources)
    );
  }

  async function getSession() {
    if (!address) {
      return null;
    }

    const sessionStr = localStorage.getItem(LOCAL_STORAGE_KEYS.DID);

    if (!sessionStr) {
      return null;
    }

    const session = await DIDSession.fromSession(sessionStr);

    return session;
  }

  async function authenticate() {
    if (!address) {
      throw new Error("Address is undefined");
    }
    const provider = await connector.getProvider();

    // for production you will want a better place than localStorage for your sessions.
    const session = await getSession();

    if (session && getSessionValidity(session)) {
      composeClient.setDID(session.did);
      trackEvent("Ceramic Authenticated", { from: "session" });
    } else {
      const accountId = await getAccountId(provider, address);
      const authMethod = await EthereumWebAuth.getAuthMethod(
        provider,
        accountId
      );

      const newSession = await DIDSession.authorize(authMethod, {
        resources: composeClient.resources,
      });

      // Set our Ceramic DID to be our session DID.
      composeClient.setDID(newSession.did);
      trackEvent("Ceramic Authenticated", { from: "authenticate" });

      // Set the session in localStorage.
      localStorage.setItem(LOCAL_STORAGE_KEYS.DID, newSession.serialize());
    }

    setIsAuthenticated(true);
  }

  const authenticateMutation = useMutation({
    mutationFn: authenticate,
    onSuccess: () => trackEvent("Ceramic Authenticated"),
  });

  if (isAuthenticated) {
    return {
      authenticate: authenticateMutation,
      isAuthenticated: true,
      did: composeClient.did!.id,
    };
  }

  return {
    authenticate: authenticateMutation,
    isAuthenticated: false,
    did: null,
  };
}
