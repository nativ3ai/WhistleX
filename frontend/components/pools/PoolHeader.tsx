"use client";

import type { PoolDetail } from "@/types/pool";
import { motion } from "framer-motion";

export function PoolHeader({ pool }: { pool: PoolDetail }) {
  const totalRaised = Number(pool.totalRaised ?? 0);
  const priceThreshold = Number(pool.priceThreshold ?? 1) || 1;
  const progress = Math.min(100, (totalRaised / priceThreshold) * 100);

  return (
    <motion.section className="card space-y-6 bg-black/30" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">{pool.title}</h1>
          <p className="text-sm text-white/60">Pool address: {pool.poolAddress}</p>
        </div>
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
          {pool.status}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase text-white/60">Total Raised</p>
          <p className="text-2xl font-semibold">{totalRaised.toLocaleString()} USDC</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase text-white/60">Threshold</p>
          <p className="text-2xl font-semibold">{priceThreshold.toLocaleString()} USDC</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-xs uppercase text-white/60">Deadline</p>
          <p className="text-2xl font-semibold">{new Date(pool.deadlineTs).toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/70">
          <span>Creator: {pool.creatorWallet}</span>
          <span>{progress.toFixed(0)}% funded</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
      </div>
    </motion.section>
  );
}
