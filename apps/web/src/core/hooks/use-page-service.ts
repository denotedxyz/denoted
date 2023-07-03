import { useAccount } from "wagmi";
import { createPageService } from "../page/service";
import { useMemo } from "react";

export function usePageService() {
  const account = useAccount();

  const pageService = useMemo(
    () => createPageService(account.address),
    [account.address]
  );

  return pageService;
}
