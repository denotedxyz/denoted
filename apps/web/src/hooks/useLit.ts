import { useMutation, useQuery } from "@tanstack/react-query";
import { trackEvent } from "../lib/analytics";
import { authenticate, getIsLitAuthenticated, litClient } from "../lib/lit";
import { useState } from "react";
import { useLitContext } from "../contexts/lit-context";

export function useLit() {
  const { isAuthenticated, setIsAuthenticated } = useLitContext();

  const authenticationMutation = useMutation({
    mutationFn: async () => await authenticate(),
    onSuccess: () => {
      setIsAuthenticated(true);
      trackEvent("Lit Authenticated");
    },
  });

  return {
    authenticate: authenticationMutation,
    isAuthenticated,
  };
}
