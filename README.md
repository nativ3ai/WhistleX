# Intel Marketplace Monorepo

This repository contains the full-stack scaffold for the Intel Marketplace built for the Base L2 chain. The system enables creators to monetize sensitive intelligence that unlocks when a USDC funding threshold is met. Contributors gain access to the encrypted intel through Lit Protocol once the pool unlocks.

## Packages

| Package | Description |
| --- | --- |
| [`contracts/`](contracts/README.md) | Hardhat project containing the `IntelPool` smart contracts, deployment config, and tests. |
| [`frontend/`](frontend/README.md) | Next.js + Tailwind web app featuring Lit encryption, pool creation flows, and animated pool dashboards. |
| [`backend/`](backend/README.md) | Node.js + Express API with Supabase integration and an indexer for on-chain events. Deployable to Google Cloud Run or App Engine. |
| [`shared/`](shared/README.md) | Reusable TypeScript domain types (installable separately when registry access is available). |
| [`infra/`](infra/README.md) | Deployment stubs (Dockerfile, App Engine config) and environment variable templates. |
| [`scripts/`](scripts/README.md) | Automation entry-points for local development and deployment helpers. |
| [`supabase/`](supabase/schema.sql) | Postgres schema and helper functions for Supabase. |

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

   This installs workspace dependencies (including the Next.js frontend). Backend and contract packages can be installed individually when you are ready to work on them.

2. **Run the frontend**

   ```bash
   npm run dev
   ```

   The Next.js dev server lives in [`frontend/`](frontend). Configure environment variables via `frontend/.env.local` to point at your backend (Cloud Run / App Engine) and Supabase project.

3. **Run the backend**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Backend environment variables are documented in [`backend/.env.example`](backend/.env.example).

4. **Compile contracts**

   ```bash
   cd contracts
   npm install
   npm run compile
   ```

## Architecture Overview

- **Smart Contracts** deploy on Base, escrow USDC contributions, and expose view methods consumed by Lit access-control conditions.
- **Frontend** handles Lit encryption/decryption entirely client-side, stores ciphertext blobs in Supabase, and orchestrates creator and contributor flows.
- **Backend** indexes contract events, mirrors pool state in Supabase, and serves encrypted blobs and aggregated statistics to the frontend.
- **Supabase** acts as both relational store (Postgres) and object store for encrypted blobs.
- **Lit Protocol** enforces decryption rights based on on-chain state.

For more detail, consult the individual package READMEs.
