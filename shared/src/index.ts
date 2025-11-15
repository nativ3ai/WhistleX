export type PoolStatus = "live" | "unlocked" | "expired" | "withdrawn";

export interface IntelPoolSummary {
  poolAddress: string;
  creatorWallet: string;
  title: string;
  description?: string;
  tokenAddress: string;
  priceThreshold: string; // formatted USDC string
  priceThresholdRaw: string; // raw uint256 in wei (6 decimals)
  totalRaised: string;
  totalRaisedRaw: string;
  deadline: string; // ISO timestamp
  status: PoolStatus;
  uri: string;
}

export interface IntelPoolDetail extends IntelPoolSummary {
  contributions: ContributionSummary[];
  unlockTxHash?: string;
  withdrawalTxHash?: string;
}

export interface ContributionSummary {
  contributorWallet: string;
  amountRaw: string;
  amountUsdc: string;
  txHash: string;
  blockNumber?: number;
  blockTimestamp?: string;
}

export interface CreateIntelPayload {
  poolAddress: string;
  encryptedData: Record<string, unknown>;
  contentHash: string;
}

export interface CreateIntelResponse {
  id: string;
  uri: string;
}

export interface IntelBlobRecord {
  id: string;
  poolAddress: string;
  encryptedData: Record<string, unknown>;
  contentHash: string;
  createdAt: string;
}

export interface LitEncryptedData {
  ciphertext: string;
  dataToEncryptHash: string;
  encryptionAlgorithm: string;
  encryptedSymmetricKey: string;
  authenticationMethod: string;
  chain: string;
  accessControlConditions: unknown;
  [key: string]: unknown;
}

export interface SupabaseConfig {
  url: string;
  key: string;
}

export const USDC_DECIMALS = 6;
export const BASE_CHAIN_ID = 8453;
