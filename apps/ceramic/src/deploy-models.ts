import { CeramicClient } from "@ceramicnetwork/http-client";
import { createDIDKey } from "did-session";
import * as fs from "node:fs";
import * as path from "node:path";
import { fromString } from "uint8arrays/from-string";

import { Composite } from "@composedb/devtools";
import {
  createComposite,
  writeEncodedComposite,
} from "@composedb/devtools-node";

import { config } from "dotenv";

config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

export async function createAndDeploy() {
  const privateKey = fromString(process.env.DID_PRIVATE_KEY as string, "hex");

  const did = await createDIDKey(privateKey);

  await did.authenticate();

  const ceramic = new CeramicClient(process.env.CERAMIC_API_URL);
  ceramic.setDID(did);

  const composites: Composite[] = [];

  const filePaths = fs.readdirSync(path.resolve("src/models"));

  for (const filePath of filePaths) {
    const composite = await createComposite(
      ceramic,
      `./src/models/${filePath}`
    );

    composites.push(composite);

    await writeEncodedComposite(
      composite,
      `./generated/composites/composites-${filePath.replace(
        ".graphql",
        ".json"
      )}`
    );
  }

  const mergedComposite = Composite.from(composites);

  await writeEncodedComposite(
    mergedComposite,
    "./generated/denoted-composite.json"
  );

  await mergedComposite.startIndexingOn(ceramic);
}

createAndDeploy();
