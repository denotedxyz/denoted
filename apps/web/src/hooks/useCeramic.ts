import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { useQuery } from "@tanstack/react-query";
import { InjectedConnector } from "@wagmi/core";
import { DIDSession } from "did-session";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { trackEvent } from "../lib/analytics";
import { composeClient } from "../lib/compose";

export const LOCAL_STORAGE_KEYS = {
  DID:
    process.env.NODE_ENV === "production"
      ? "denoted.ceramic.did"
      : "denoted.DEV.ceramic.did",
  SIGNED_RESOURCES:
    process.env.NODE_ENV === "production"
      ? "denoted.ceramic.signed-resources"
      : "denoted.DEV.ceramic.signed-resources",
};

export function useCeramic() {
  const { address } = useAccount();

  const connector = new InjectedConnector();

  function getSessionValidity(session: DIDSession | null) {
    return !!session && session.hasSession && !session.isExpired;
  }

  async function hasSession() {
    const session = await getSession();
    return getSessionValidity(session);
  }

  const sessionValidQuery = useQuery(
    ["CERAMIC", "COMPOSE", "SESSION_VALID", composeClient.id],
    async () => {
      return await hasSession();
    },
    {
      cacheTime: 0,
    }
  );

  async function getSession() {
    if (!address) {
      return null;
    }

    // for production you will want a better place than localStorage for your sessions.
    const sessionStr = localStorage.getItem(LOCAL_STORAGE_KEYS.DID);

    if (!sessionStr) {
      return null;
    }

    const session = await DIDSession.fromSession(sessionStr);

    return session;
  }

  function getIsResourcesSigned(resources: string[]) {
    if (typeof window === "undefined") {
      return false;
    }

    const signedResources = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNED_RESOURCES) ?? "[]"
    ) as string[];

    return resources.every((resource) => {
      return signedResources.includes(resource);
    });
  }

  const isComposeResourcesSignedQuery = useQuery(
    ["CERAMIC", "AUTHENTICATED"],
    () => {
      return getIsResourcesSigned(composeClient.resources);
    },
    { cacheTime: 0 }
  );

  async function authenticate() {
    if (!address) {
      throw new Error("Address is undefined");
    }
    const provider = await connector.getProvider();

    // for production you will want a better place than localStorage for your sessions.
    const session = await getSession();

    const isResourcesSigned = getIsResourcesSigned(composeClient.resources);

    if (isResourcesSigned && session && getSessionValidity(session)) {
      composeClient.setDID(session.did);
      trackEvent("Ceramic Authenticated", { from: "session" });
    } else {
      const accountId = await getAccountId(provider, address);
      const authMethod = await EthereumWebAuth.getAuthMethod(
        provider,
        accountId
      );

      /**
       * Create DIDSession & provide capabilities that we want to access.
       * @NOTE: Any production applications will want to provide a more complete list of capabilities.
       *        This is not done here to allow you to add more datamodels to your application.
       */
      const newSession = await DIDSession.authorize(authMethod, {
        resources: composeClient.resources,
      });

      // Set our Ceramic DID to be our session DID.
      composeClient.setDID(newSession.did);
      trackEvent("Ceramic Authenticated", { from: "authenticate" });

      // Set the session in localStorage.
      localStorage.setItem(LOCAL_STORAGE_KEYS.DID, newSession.serialize());
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SIGNED_RESOURCES,
        JSON.stringify(composeClient.resources)
      );
    }

    isComposeResourcesSignedQuery.refetch();
    sessionValidQuery.refetch();
  }

  const isInitialized = Boolean(composeClient.id);

  useEffect(() => {
    async function run() {
      if (!isInitialized && (await hasSession())) {
        await authenticate();
      }
    }
    run();
  }, [isInitialized, hasSession, authenticate]);

  return {
    authenticate,
    hasSession,
    getSession,
    isInitialized: Boolean(composeClient.id),
    isComposeResourcesSigned: isComposeResourcesSignedQuery.data ?? false,
    isLoading: isComposeResourcesSignedQuery.isLoading,
    composeClient,
    isSessionValid: sessionValidQuery.data ?? false,
  };
}
