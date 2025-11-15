"use client";

import type { PoolSummary } from "@/types/pool";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PoolCardProps {
  pool: PoolSummary;
}

export function PoolCard({ pool }: PoolCardProps) {
  const totalRaised = Number(pool.totalRaised ?? 0);
  const priceThreshold = Number(pool.priceThreshold ?? 1) || 1;
  const progress = Math.min(100, (totalRaised / priceThreshold) * 100);

  return (
    <motion.article
      className="card space-y-4 bg-black/30"
      whileHover={{ translateY: -6, transition: { type: "spring", stiffness: 220, damping: 18 } }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{pool.title}</h3>
          <p className="text-sm text-white/60">{pool.poolAddress}</p>
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
          {pool.status}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>{totalRaised.toLocaleString()} / {priceThreshold.toLocaleString()} USDC</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>
      <Link href={`/pools/${pool.poolAddress}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary">
        View details <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}
