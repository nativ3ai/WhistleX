"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/lib/backendClient";
import type { PoolSummary } from "@/types/pool";

export function usePools() {
  return useQuery<PoolSummary[]>({
    queryKey: ["pools"],
    queryFn: () => backendClient.listPools()
  });
}
