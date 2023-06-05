import { production, LensClient } from "@lens-protocol/client";

export const lensClient = new LensClient({
  environment: production,
});
