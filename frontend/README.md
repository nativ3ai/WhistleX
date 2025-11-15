# Intel Marketplace Frontend

This package contains the Next.js + Tailwind client for the Intel Marketplace. It connects to the Node/Express backend for pool
metadata, Supabase for encrypted blob storage, Lit Protocol for client-side encryption/decryption, and Base for smart contracts.

## Getting started

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Environment variables:

- `NEXT_PUBLIC_BACKEND_URL` – Base URL for the Express API (e.g. `https://api.example.com`).
- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL for client-side reads.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key.
- `NEXT_PUBLIC_LIT_NETWORK` – Lit network id (`naga-dev`, `naga-test`, `datil-dev`).
- `NEXT_PUBLIC_FACTORY_ADDRESS` – Deployed `IntelPoolFactory` contract address on Base.
- `NEXT_PUBLIC_BASE_RPC_URL` – RPC endpoint for Base mainnet (defaults to the public RPC).
- `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` – RPC endpoint for Base Sepolia (optional fallback).

## Project layout

```
app/                # App Router routes
  page.tsx          # Landing page
  pools/            # Pool listing + detail views
  create/           # Creator wizard
components/         # UI modules for navigation, pools, forms, intel
hooks/              # React Query data hooks (unused on the server but available to clients)
lib/                # Lit, Supabase, backend, and viem helpers
abis/               # IntelPool and IntelPoolFactory ABIs for viem interactions
types/              # Shared domain types for pools and contributions
```

## Features

- Responsive, animated layout built with Tailwind and Framer Motion.
- Wallet-aware creator and contributor flows powered by `wagmi` + `viem`.
- Lit Protocol encryption/decryption helpers wired to the IntelPool access control conditions.
- Graceful empty states when the backend or Supabase are offline.
- Strict TypeScript types shared across forms, pool views, and backend responses.

## Scripts

- `npm run dev` – Start the Next.js dev server.
- `npm run build` – Build the production app.
- `npm run start` – Serve the built app.
- `npm run lint` – Run Next.js ESLint rules.
