import { getLitClient } from "./litClient";
import { buildPoolAccessControlConditions } from "./accessControl";

export async function encryptIntelForPool(plaintext: string, poolAddress: string) {
  if (!plaintext) throw new Error("Plaintext payload required");
  if (typeof window === "undefined") {
    throw new Error("Encryption is only available in the browser");
  }

  const client = await getLitClient();
  const unifiedAccessControlConditions = buildPoolAccessControlConditions(poolAddress);

  return client.encrypt({
    dataToEncrypt: plaintext,
    unifiedAccessControlConditions,
    chain: "base"
  });
}
