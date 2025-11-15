import { PoolList } from "@/components/pools/PoolList";
import { backendClient } from "@/lib/backendClient";

async function fetchPools() {
  return backendClient.listPools();
}

export default async function PoolsPage() {
  const pools = (await fetchPools()) ?? [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title">Intel Pools</h1>
        <p className="text-sm text-white/70">
          Browse intel cases sourced from creators. Once the indexer posts on-chain events to Supabase, live data will populate
          below.
        </p>
      </div>
      <PoolList pools={pools} />
    </section>
  );
}
