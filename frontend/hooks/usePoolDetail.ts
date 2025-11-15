"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/lib/backendClient";
import type { PoolDetail } from "@/types/pool";

export function usePoolDetail(address: string) {
  return useQuery<PoolDetail | null>({
    queryKey: ["pool", address],
    queryFn: () => backendClient.getPool(address),
    enabled: Boolean(address)
  });
}
