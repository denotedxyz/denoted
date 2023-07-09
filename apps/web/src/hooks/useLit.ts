import { useMutation, useQuery } from "@tanstack/react-query";
import { trackEvent } from "../lib/analytics";
import { authenticate, getIsLitAuthenticated, litClient } from "../lib/lit";
import { useState } from "react";

export function useLit() {
  const [isAuthenticated, setIsAuthenticated] = useState(getIsLitAuthenticated);

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
