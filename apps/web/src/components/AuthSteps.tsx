"use client";

import { PropsWithChildren, useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { useCeramic } from "../hooks/useCeramic";
import { useCustomConnect } from "../hooks/useCustomConnect";
import { useLit } from "../hooks/useLit";
import { trackEvent } from "../lib/analytics";
import { cn } from "@denoted/ui";
import { Button } from "@denoted/ui";
import { Loader2, Wallet, Circle, CheckCircle2 } from "lucide-react";

type AuthStepProps = PropsWithChildren<{
  title: string;
  description: string;
  completed: boolean;
  index: number;
}>;

function AuthStep({
  title,
  description,
  completed,
  index,
  children,
}: AuthStepProps) {
  return (
    <li className="flex items-start gap-4">
      <span
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md  bg-gray-100 text-gray-500",
          completed && "bg-green-500 text-white"
        )}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <>
            <Circle className="h-5 w-5" />
            <span className="absolute text-xs font-bold">{index}</span>
          </>
        )}
      </span>
      <div className="flex flex-col items-start gap-4">
        <div className="gap-2">
          <h2 className="font-medium text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        {children}
      </div>
    </li>
  );
}

const fromAuthSteps = {
  from: "Auth Steps Modal",
};

export function AuthSteps() {
  const { isConnected } = useAccount();

  const { connect, isLoading, connectors } = useCustomConnect({
    eventProperties: fromAuthSteps,
  });

  const ceramic = useCeramic();
  const lit = useLit();

  const authenticateCeramicMutation = useMutation(
    async () => {
      return await ceramic.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Ceramic Authenticate Clicked", fromAuthSteps);
      },
    }
  );

  const authenticateLitMutation = useMutation(
    async () => {
      return await lit.authenticate();
    },
    {
      onMutate: () => {
        trackEvent("Lit Authenticate Clicked", fromAuthSteps);
      },
    }
  );

  const isCeramicConnected =
    ceramic.isComposeResourcesSigned && ceramic.isSessionValid;

  return (
    <div className="mb-2 rounded-3xl">
      <ul className="flex flex-col gap-12">
        <AuthStep
          index={1}
          title="Connect wallet"
          description="You need to connect your wallet in order to continue!"
          completed={isConnected}
        >
          <Button
            disabled={isConnected}
            onClick={() => connect({ connector: connectors[0] })}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Connecting..." : "Connect"}
          </Button>
        </AuthStep>
        <AuthStep
          index={2}
          title="Enable storage of pages"
          description="Allows you to persist data on the decentralized storage network. You will become the owner of your data which is stored immutably."
          completed={isConnected && isCeramicConnected}
        >
          <Button
            disabled={
              (ceramic.isComposeResourcesSigned && isCeramicConnected) ||
              !isConnected
            }
            onClick={() => authenticateCeramicMutation.mutate()}
          >
            {authenticateCeramicMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {authenticateCeramicMutation.isLoading
              ? "Waiting..."
              : "Sign message"}
          </Button>
        </AuthStep>
        <AuthStep
          index={3}
          title="Enable private pages"
          description="This ensures that even though your data is stored on the blockchain, it remains private and secure, with only authorized users having access to it."
          completed={isConnected && lit.isLitAuthenticated}
        >
          <Button
            disabled={lit.isLitAuthenticated || !isConnected}
            onClick={() => authenticateLitMutation.mutate()}
          >
            {authenticateLitMutation.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {authenticateLitMutation.isLoading ? "Waiting..." : "Sign message"}
          </Button>
        </AuthStep>
      </ul>
    </div>
  );
}
