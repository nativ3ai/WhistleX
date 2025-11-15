"use client";

import { ReactNode, useMemo } from "react";
import { createConfig, http, WagmiConfig } from "wagmi";
import { base, baseSepolia } from "viem/chains";
import { injected } from "wagmi/connectors";

const BACKUP_RPC = "https://mainnet.base.org";

export function WagmiProviders({ children }: { children: ReactNode }) {
  const config = useMemo(
    () =>
      createConfig({
        chains: [base, baseSepolia],
        connectors: [
          injected({
            target: "metamask"
          })
        ],
        transports: {
          [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL ?? BACKUP_RPC),
          [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org")
        },
        ssr: true
      }),
    []
  );

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
