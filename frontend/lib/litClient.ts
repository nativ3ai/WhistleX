import { createLitClient } from "@lit-protocol/lit-client";
import { nagaDev, nagaTest, datilDev } from "@lit-protocol/networks";

const networkName = process.env.NEXT_PUBLIC_LIT_NETWORK ?? "naga-dev";

const networkLookup: Record<string, any> = {
  "naga-dev": nagaDev,
  "naga-test": nagaTest,
  "datil-dev": datilDev
};

let clientPromise: ReturnType<typeof createLitClient> | null = null;

export function getLitClient() {
  if (!clientPromise) {
    const network = networkLookup[networkName] ?? nagaDev;
    clientPromise = createLitClient({
      network,
      debug: false
    });
  }
  return clientPromise;
}
