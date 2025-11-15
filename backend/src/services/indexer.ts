import { ethers } from "ethers";
import { getSupabaseAdmin } from "../db/supabase.js";
import IntelPoolFactoryAbi from "../contracts/abis/IntelPoolFactory.json" assert { type: "json" };

const factoryAddress = process.env.FACTORY_ADDRESS ?? "";
const startBlock = Number(process.env.START_BLOCK ?? "0");

export async function startIndexer(): Promise<void> {
  if (!process.env.BASE_RPC_WSS_URL) {
    throw new Error("BASE_RPC_WSS_URL not configured");
  }
  if (!factoryAddress) {
    throw new Error("FACTORY_ADDRESS not configured");
  }

  const provider = new ethers.WebSocketProvider(process.env.BASE_RPC_WSS_URL);
  const factory = new ethers.Contract(factoryAddress, IntelPoolFactoryAbi, provider);

  factory.on("PoolCreated", async (...args) => {
    const event = args[args.length - 1] as ethers.Log;
    await handlePoolCreated(factory.interface.parseLog(event));
  });

  provider.on("error", (err) => console.error("Indexer provider error", err));
  provider.on("close", () => console.warn("Indexer provider connection closed"));

  await catchUp(provider);
}

async function catchUp(provider: ethers.Provider) {
  if (!startBlock) return;
  const latest = await provider.getBlockNumber();
  const iface = new ethers.Interface(IntelPoolFactoryAbi);
  const logs = await provider.getLogs({
    fromBlock: startBlock,
    toBlock: latest,
    address: factoryAddress,
    topics: [iface.getEvent("PoolCreated").topicHash],
  });

  for (const log of logs) {
    await handlePoolCreated(iface.parseLog(log));
  }
}

async function handlePoolCreated(parsed: ethers.LogDescription) {
  const [pool, creator, token, priceThreshold, deadline, uri, contentHash, title] = parsed.args;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.warn("Indexer skipped PoolCreated event because Supabase credentials are missing");
    return;
  }

  const { error } = await supabase.from("intel_pool").upsert(
    {
      chain_id: 8453,
      factory_address: factoryAddress,
      pool_address: pool.toLowerCase(),
      creator_wallet: creator.toLowerCase(),
      title,
      token_address: token.toLowerCase(),
      price_threshold_raw: priceThreshold.toString(),
      price_threshold: Number(priceThreshold) / 1e6,
      deadline_ts: new Date(Number(deadline) * 1000).toISOString(),
      uri,
      content_hash: contentHash,
      status: "live",
    },
    { onConflict: "pool_address" }
  );

  if (error) {
    console.error("Failed to upsert intel_pool", error);
  }
}
