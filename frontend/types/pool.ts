export type PoolStatus = "live" | "unlocked" | "expired" | "withdrawn";

export interface PoolSummary {
  id: string;
  poolAddress: string;
  title: string;
  creatorWallet: string;
  priceThreshold: string;
  totalRaised: string;
  deadlineTs: string;
  status: PoolStatus;
  uri: string;
  tokenAddress: string;
}

export interface Contribution {
  contributorWallet: string;
  amountRaw: string;
  amountUsdc: string;
  txHash: string;
  createdAt: string;
}

export interface PoolDetail extends PoolSummary {
  description?: string | null;
  contributions: Contribution[];
  unlockTxHash?: string | null;
  withdrawalTxHash?: string | null;
}
