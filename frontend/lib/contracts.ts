import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import IntelPoolAbi from "../abis/IntelPool.json";
import IntelPoolFactoryAbi from "../abis/IntelPoolFactory.json";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://mainnet.base.org")
});

export { IntelPoolAbi, IntelPoolFactoryAbi };
