"use client";

import { useQuery } from "@tanstack/react-query";
import { backendClient } from "@/lib/backendClient";
import type { Contribution } from "@/types/pool";

export function useContributions(address: string) {
  return useQuery<Contribution[]>({
    queryKey: ["pool", address, "contributions"],
    queryFn: () => backendClient.listContributions(address),
    enabled: Boolean(address)
  });
}
