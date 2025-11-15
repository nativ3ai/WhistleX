const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.BACKEND_URL ??
  "http://localhost:8080";

async function safeFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.warn(`Backend request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn("Backend unreachable", error);
    return null;
  }
}

export const backendClient = {
  listPools: async () => {
    const data = await safeFetch<{ pools: import("@/types/pool").PoolSummary[] }>("/pools");
    return data?.pools ?? [];
  },
  getPool: async (address: string) => {
    const data = await safeFetch<{ pool: import("@/types/pool").PoolDetail }>(`/pools/${address}`);
    return data?.pool ?? null;
  },
  listContributions: async (address: string) => {
    const data = await safeFetch<{ contributions: import("@/types/pool").Contribution[] }>(
      `/pools/${address}/contributions`
    );
    return data?.contributions ?? [];
  },
  createIntelBlob: async (payload: { poolAddress: string; encryptedData: unknown; contentHash: string }) =>
    safeFetch<{ id: string; uri: string }>("/intel", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  fetchIntelBlob: async (id: string) => safeFetch<any>(`/intel/${id}`)
};
