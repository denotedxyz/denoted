import { useAccount } from "wagmi";
import { createPageService } from "../page/service";
import { useMemo } from "react";
import { useUser } from "../../contexts/user-context";

export function usePageService() {
  const user = useUser();

  const pageService = useMemo(() => createPageService(user), [user]);

  return pageService;
}
