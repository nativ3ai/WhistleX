"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { encryptIntelForPool } from "@/lib/encryption";
import { backendClient } from "@/lib/backendClient";
import { IntelPoolFactoryAbi, publicClient } from "@/lib/contracts";
import { useAccount, useWalletClient } from "wagmi";
import { base } from "viem/chains";
import { decodeEventLog, parseUnits } from "viem";
import { Loader2 } from "lucide-react";

interface CreatePoolFormState {
  title: string;
  threshold: string;
  deadline: string;
  plaintext: string;
  contentHash: string;
  tokenAddress: string;
  factoryAddress: string;
}

const defaultState: CreatePoolFormState = {
  title: "",
  threshold: "",
  deadline: "",
  plaintext: "",
  contentHash: "",
  tokenAddress: "0x833589fCD6eDb6E08f4c7C18CdcA886eA6A6B36A",
  factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? ""
};

export function CreatePoolForm() {
  const [state, setState] = useState<CreatePoolFormState>(defaultState);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: walletClient } = useWalletClient({ chainId: base.id });
  const { address } = useAccount();

  const isReady = useMemo(() => {
    return Boolean(
      state.title &&
        state.threshold &&
        state.deadline &&
        state.plaintext &&
        state.contentHash &&
        state.tokenAddress &&
        state.factoryAddress &&
        walletClient &&
        address
    );
  }, [state, walletClient, address]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!walletClient || !address || !walletClient.account) {
      setStatus("Connect your wallet with MetaMask to deploy pools.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Preparing Lit encryption and transaction...");

    try {
      const thresholdRaw = parseUnits(state.threshold, 6);
      const deadlineTs = Math.floor(new Date(state.deadline).getTime() / 1000);

      const placeholderUri = "https://placeholder.uri";
      const hash = await walletClient.writeContract({
        address: state.factoryAddress as `0x${string}`,
        abi: IntelPoolFactoryAbi as any,
        functionName: "createPool",
        account: walletClient.account,
        args: [
          state.tokenAddress,
          thresholdRaw,
          BigInt(deadlineTs),
          placeholderUri,
          state.contentHash as `0x${string}`,
          state.title
        ]
      });

      setStatus(`Transaction submitted: ${hash}. Waiting for confirmation...`);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const decodedLog = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi: IntelPoolFactoryAbi as any,
              data: log.data,
              topics: log.topics
            });
          } catch (error) {
            return null;
          }
        })
        .find((log) => log?.eventName === "PoolCreated");

      const poolAddress = decodedLog && typeof decodedLog.args === "object" ? (decodedLog.args as any).pool : null;

      if (!poolAddress) {
        throw new Error("Unable to determine deployed pool address from transaction logs.");
      }

      setStatus("Encrypting intel with Lit...");
      const encryptedData = await encryptIntelForPool(state.plaintext, poolAddress);
      const intelBlob = await backendClient.createIntelBlob({
        poolAddress,
        encryptedData,
        contentHash: state.contentHash
      });

      if (intelBlob?.uri) {
        setStatus(`Intel stored. Call setUri(${intelBlob.uri}) on your pool before unlocking.`);
      } else {
        setStatus(
          "Encryption succeeded but backend is offline. Preserve encrypted payload locally and upload when backend is available."
        );
      }
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message ?? "Failed to create pool. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card space-y-6 bg-black/30"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Factory Address</label>
        <input
          value={state.factoryAddress}
          onChange={(event) => setState((prev) => ({ ...prev, factoryAddress: event.target.value }))}
          placeholder="0x..."
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Title</label>
        <input
          value={state.title}
          onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Operation Starfall"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-white/70">USDC Threshold</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={state.threshold}
            onChange={(event) => setState((prev) => ({ ...prev, threshold: event.target.value }))}
            placeholder="1500"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-white/50">
            Raw amount: {state.threshold ? parseUnits(state.threshold || "0", 6).toString() : "0"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Deadline</label>
          <input
            type="datetime-local"
            value={state.deadline}
            onChange={(event) => setState((prev) => ({ ...prev, deadline: event.target.value }))}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Plaintext Intel</label>
        <textarea
          value={state.plaintext}
          onChange={(event) => setState((prev) => ({ ...prev, plaintext: event.target.value }))}
          rows={6}
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
          placeholder="Enter the intel that will be encrypted with Lit"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Content Hash (bytes32)</label>
        <input
          value={state.contentHash}
          onChange={(event) => setState((prev) => ({ ...prev, contentHash: event.target.value }))}
          placeholder="0x..."
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Payment Token</label>
        <input
          value={state.tokenAddress}
          onChange={(event) => setState((prev) => ({ ...prev, tokenAddress: event.target.value }))}
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
        />
        <p className="text-xs text-white/50">Defaults to USDC on Base (0x8335...B36A).</p>
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={!isReady || isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Deploy Intel Pool"}
      </button>
      {status && <p className="text-sm text-white/70">{status}</p>}
    </motion.form>
  );
}
