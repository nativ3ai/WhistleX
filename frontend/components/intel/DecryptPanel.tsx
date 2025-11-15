"use client";

import { useState } from "react";
import { decryptIntelForPool } from "@/lib/decryption";
import { backendClient } from "@/lib/backendClient";
import { useWalletClient } from "wagmi";
import { Loader2 } from "lucide-react";

interface DecryptPanelProps {
  poolAddress: string;
  uri: string;
}

export function DecryptPanel({ poolAddress, uri }: DecryptPanelProps) {
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { data: walletClient } = useWalletClient();

  async function handleDecrypt() {
    if (!walletClient) {
      setStatus("Connect your wallet to attempt decryption.");
      return;
    }

    const id = uri.split("/").pop();
    if (!id) {
      setStatus("Pool URI missing blob identifier.");
      return;
    }

    setIsDecrypting(true);
    setStatus("Fetching encrypted intel...");

    try {
      const encryptedData = await backendClient.fetchIntelBlob(id);
      if (!encryptedData) {
        setStatus("Encrypted payload not found. Verify the backend deployment.");
        return;
      }

      setStatus("Verifying Lit access control...");
      const response = await decryptIntelForPool({
        encryptedData,
        poolAddress,
        walletClient
      });

      const plaintext = typeof response === "string" ? response : (response as any)?.data ?? JSON.stringify(response);
      setDecrypted(plaintext);
      setStatus("Intel decrypted successfully.");
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message ?? "Decryption failed. Ensure you contributed and the pool is unlocked.");
    } finally {
      setIsDecrypting(false);
    }
  }

  return (
    <div className="card space-y-4 bg-black/30">
      <div>
        <h3 className="text-lg font-semibold text-white">Decrypt Intel</h3>
        <p className="text-sm text-white/70">
          Lit Protocol enforces unlock + contributor checks client-side. Connect a wallet that contributed to this pool and request
          the ciphertext from the backend when ready.
        </p>
      </div>
      <button onClick={handleDecrypt} className="btn-primary w-full justify-center" disabled={isDecrypting}>
        {isDecrypting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decrypt with Lit"}
      </button>
      {status && <p className="text-sm text-white/70">{status}</p>}
      {decrypted && (
        <pre className="max-h-64 overflow-auto rounded-xl border border-white/10 bg-black/60 p-4 text-left text-sm text-white/80">
          {decrypted}
        </pre>
      )}
    </div>
  );
}
