"use client";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@denoted/ui";
import { Avatar, ConnectKitButton } from "connectkit";
import { Check, KeyRound, Loader2, LogOut, Wallet } from "lucide-react";
import { useUser } from "../contexts/user-context";
import { useCompose } from "../hooks/useCompose";
import { useLit } from "../hooks/useLit";
import { useConnect, useDisconnect, useEnsName } from "wagmi";
import { truncate } from "../utils/index";
import * as Tooltip from "@radix-ui/react-tooltip";

export function AuthenticateButton() {
  const user = useUser();
  const compose = useCompose();
  const lit = useLit();

  const ensName = useEnsName({
    address: user?.address,
  });

  const { disconnect } = useDisconnect();

  return (
    <Popover>
      <PopoverTrigger asChild>
        {user?.state.account ? (
          <button className="flex gap-2 items-center justify-start">
            <Avatar address={user.address} size={24} />
            <span className="text-primary">
              {ensName.data ?? truncate(user?.address)}
            </span>
          </button>
        ) : (
          <Button className="w-full" variant="primary">
            Connect & Sign
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto">
        <ul className="flex flex-col gap-2 items-start">
          <li className="flex items-center">
            <ConnectKitButton.Custom>
              {(props) => {
                return (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={user?.state.account}
                    onClick={props.show}
                  >
                    {props.isConnecting ? (
                      <Loader2 />
                    ) : (
                      <>
                        {user?.state.account ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Wallet className="w-4 h-4 mr-2" />
                        )}
                        Connect
                      </>
                    )}
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          </li>
          <li className="flex items-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => compose.authenticate.mutate()}
              disabled={!user?.state.account || user?.state.compose}
            >
              {user?.state.compose ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <KeyRound className="w-4 h-4 mr-2" />
              )}
              Sign Ceramic
            </Button>
          </li>
          <li className="flex items-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => lit.authenticate.mutate()}
              disabled={!user?.state.account || user?.state.lit}
            >
              {user?.state.lit ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <KeyRound className="w-4 h-4 mr-2" />
              )}
              Sign Lit
            </Button>
          </li>
          {user?.state.account && (
            <li className="flex items-center mt-2">
              <Button size="sm" variant="ghost" onClick={() => disconnect()}>
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
