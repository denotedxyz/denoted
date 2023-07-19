"use client";

import { Button, cn } from "@denoted/ui";
import { CheckCircle2, Circle, Loader2, Wallet } from "lucide-react";
import { PropsWithChildren } from "react";
import { useAccount } from "wagmi";
import { useCompose } from "../hooks/useCompose";
import { useCustomConnect } from "../hooks/useCustomConnect";
import { useLit } from "../hooks/useLit";

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
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md  bg-zinc-100 text-zinc-500",
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
          <h2 className="font-medium text-zinc-800">{title}</h2>
          <p className="text-sm text-zinc-500">{description}</p>
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

  const compose = useCompose();
  const lit = useLit();

  return (
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
        completed={isConnected && compose.isAuthenticated}
      >
        <Button
          disabled={compose.isAuthenticated || !isConnected}
          onClick={() => compose.authenticate.mutate()}
        >
          {compose.authenticate.isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          {compose.authenticate.isLoading ? "Waiting..." : "Sign message"}
        </Button>
      </AuthStep>
      <AuthStep
        index={3}
        title="Enable private pages"
        description="This ensures that even though your data is stored on the blockchain, it remains private and secure, with only authorized users having access to it."
        completed={isConnected && lit.isAuthenticated}
      >
        <Button
          disabled={lit.isAuthenticated || !isConnected}
          onClick={() => lit.authenticate.mutate()}
        >
          {lit.authenticate.isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wallet className="mr-2 h-4 w-4" />
          )}
          {lit.authenticate.isLoading ? "Waiting..." : "Sign message"}
        </Button>
      </AuthStep>
    </ul>
  );
}
