"use client";

import type { Contribution } from "@/types/pool";
import { motion } from "framer-motion";

interface ContributionListProps {
  contributions: Contribution[];
}

export function ContributionList({ contributions }: ContributionListProps) {
  if (!contributions?.length) {
    return <p className="text-sm text-white/60">No contributions recorded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {contributions.map((contribution) => (
        <motion.div
          key={`${contribution.txHash}-${contribution.contributorWallet}`}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="truncate text-white/70">{contribution.contributorWallet}</span>
          <span className="font-medium text-white">{Number(contribution.amountUsdc).toLocaleString()} USDC</span>
        </motion.div>
      ))}
    </div>
  );
}
