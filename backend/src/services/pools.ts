import { getSupabaseAdmin } from "../db/supabase.js";
import type {
  ContributionSummary,
  IntelPoolDetail,
  IntelPoolSummary,
} from "@intel-marketplace/shared";

function mapPool(row: any): IntelPoolSummary {
  return {
    poolAddress: row.pool_address,
    creatorWallet: row.creator_wallet,
    title: row.title,
    description: row.description ?? undefined,
    tokenAddress: row.token_address,
    priceThreshold: row.price_threshold,
    priceThresholdRaw: row.price_threshold_raw,
    totalRaised: row.total_raised,
    totalRaisedRaw: row.total_raised_raw,
    deadline: row.deadline_ts,
    status: row.status,
    uri: row.uri,
  };
}

export async function listPools(): Promise<IntelPoolSummary[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.rpc("intel_list_pools");
  if (error) {
    throw error;
  }
  return (data ?? []).map(mapPool);
}

export async function getPoolDetail(address: string): Promise<IntelPoolDetail | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc("intel_get_pool", { pool_address: address.toLowerCase() });
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }

  return {
    ...mapPool(data),
    contributions: (data.contributions ?? []).map(mapContribution),
    unlockTxHash: data.unlock_tx_hash ?? undefined,
    withdrawalTxHash: data.withdraw_tx_hash ?? undefined,
  };
}

export async function listContributions(address: string): Promise<ContributionSummary[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("contribution")
    .select("contributor_wallet,amount_raw,amount_usdc,tx_hash,block_number,block_ts,created_at")
    .eq("pool_address", address.toLowerCase())
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapContribution);
}

function mapContribution(row: any): ContributionSummary {
  return {
    contributorWallet: row.contributor_wallet,
    amountRaw: row.amount_raw,
    amountUsdc: row.amount_usdc,
    txHash: row.tx_hash,
    blockNumber: row.block_number ?? undefined,
    blockTimestamp: row.block_ts ?? row.created_at ?? undefined,
  };
}

export async function upsertPoolMetadata(
  address: string,
  payload: { title?: string; description?: string; uri?: string }
): Promise<IntelPoolDetail> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase credentials not configured");
  }

  const updates = {
    ...(payload.title ? { title: payload.title } : {}),
    ...(payload.description ? { description: payload.description } : {}),
    ...(payload.uri ? { uri: payload.uri } : {}),
  };

  const { data, error } = await supabase
    .from("intel_pool")
    .update(updates)
    .eq("pool_address", address.toLowerCase())
    .select("pool_address")
    .single();

  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Pool metadata update failed");
  }

  const refreshed = await getPoolDetail(address.toLowerCase());
  if (!refreshed) {
    throw new Error("Pool not found after update");
  }
  return refreshed;
}
