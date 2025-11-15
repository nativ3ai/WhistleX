"use client";

import { motion } from "framer-motion";
import { PoolCard } from "./PoolCard";
import type { PoolSummary } from "@/types/pool";

interface PoolListProps {
  pools: PoolSummary[];
}

export function PoolList({ pools }: PoolListProps) {
  if (!pools?.length) {
    return (
      <motion.div
        className="card bg-black/30 text-center text-white/70"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p>No pools found yet. Once the backend indexer is deployed, live intel cases will appear here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {pools.map((pool) => (
        <PoolCard key={pool.poolAddress} pool={pool} />
      ))}
    </motion.div>
  );
}
