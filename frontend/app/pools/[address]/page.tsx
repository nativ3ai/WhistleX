import { backendClient } from "@/lib/backendClient";
import { PoolHeader } from "@/components/pools/PoolHeader";
import { ContributionList } from "@/components/pools/ContributionList";
import { ContributeForm } from "@/components/forms/ContributeForm";
import { DecryptPanel } from "@/components/intel/DecryptPanel";
import Link from "next/link";

interface PoolDetailPageProps {
  params: { address: string };
}

async function fetchPool(address: string) {
  return backendClient.getPool(address);
}

export default async function PoolDetailPage({ params }: PoolDetailPageProps) {
  const pool = await fetchPool(params.address);

  if (!pool) {
    return (
      <section className="card space-y-4 bg-black/30 text-white/80">
        <h1 className="section-title">Pool not found</h1>
        <p>The backend has not indexed this pool yet. Return to the pools directory to browse available cases.</p>
        <Link href="/pools" className="btn-primary w-fit">Back to pools</Link>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <PoolHeader pool={pool} />
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="card space-y-3 bg-black/30">
            <h2 className="text-lg font-semibold text-white">Contributions</h2>
            <ContributionList contributions={pool.contributions} />
          </div>
          <DecryptPanel poolAddress={pool.poolAddress} uri={pool.uri} />
        </div>
        <ContributeForm poolAddress={pool.poolAddress} tokenAddress={pool.tokenAddress} />
      </div>
    </section>
  );
}
