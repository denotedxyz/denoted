"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { identify, trackPage } from "../lib/analytics";

export function Analytics() {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      identify(address);
    }
  }, [address]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();
    trackPage(url);
  }, [pathname, searchParams]);

  return null;
}
