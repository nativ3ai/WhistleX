"use client";

import { FormEvent, useState } from "react";
import { useWalletClient } from "wagmi";
import { IntelPoolAbi } from "@/lib/contracts";
import { parseUnits } from "viem";
import { Loader2 } from "lucide-react";

interface ContributeFormProps {
  poolAddress: string;
  tokenAddress: string;
}

export function ContributeForm({ poolAddress, tokenAddress }: ContributeFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: walletClient } = useWalletClient();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!walletClient || !walletClient.account) {
      setStatus("Connect your wallet to contribute.");
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus("Sending contribution transaction...");

      const hash = await walletClient.writeContract({
        address: poolAddress as `0x${string}`,
        abi: IntelPoolAbi as any,
        functionName: "contribute",
        account: walletClient.account,
        args: [parseUnits(amount || "0", 6)]
      });

      setStatus(`Contribution submitted: ${hash}. Track status in your wallet.`);
    } catch (error: any) {
      console.error(error);
      setStatus(error?.message ?? "Contribution failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 bg-black/30">
      <div>
        <h3 className="text-lg font-semibold text-white">Contribute USDC</h3>
        <p className="text-sm text-white/70">
          Approve the IntelPool contract on USDC first, then pledge your amount. Contributions remain locked until the pool unlocks
          or expires.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold uppercase tracking-wide text-white/70">Amount (USDC)</label>
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          type="number"
          min="0"
          step="0.1"
          placeholder="200"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-primary focus:outline-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting || !amount}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Contribute"}
      </button>
      {status && <p className="text-sm text-white/70">{status}</p>}
      <p className="text-xs text-white/50">Token: {tokenAddress}</p>
    </form>
  );
}
