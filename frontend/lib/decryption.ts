import type { WalletClient } from "viem";
import { getLitClient } from "./litClient";
import { buildPoolAccessControlConditions } from "./accessControl";
import { authManager } from "./authManager";

export async function decryptIntelForPool({
  encryptedData,
  poolAddress,
  walletClient
}: {
  encryptedData: any;
  poolAddress: string;
  walletClient: WalletClient;
}) {
  if (typeof window === "undefined") {
    throw new Error("Decryption is only available in the browser");
  }

  const client = await getLitClient();
  const unifiedAccessControlConditions = buildPoolAccessControlConditions(poolAddress);

  const authContext = await authManager.createEoaAuthContext({
    config: {
      account: walletClient.account
    },
    authConfig: {
      domain: window.location.host,
      statement: "Decrypt intel for pool",
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      resources: [
        ["access-control-condition-decryption", "*"],
        ["lit-action-execution", "*"]
      ]
    },
    litClient: client
  });

  return client.decrypt({
    data: encryptedData,
    unifiedAccessControlConditions,
    authContext,
    chain: "base"
  });
}
