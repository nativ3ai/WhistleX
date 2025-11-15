# Contracts

Hardhat project for the Intel Marketplace smart contracts deployed on Base. The project contains two contracts:

- `IntelPool.sol` – Escrows USDC contributions for a single intel case and exposes Lit access control helpers.
- `IntelPoolFactory.sol` – Deploys new `IntelPool` instances and emits indexable events.

## Structure

```
contracts/
  hardhat.config.ts
  package.json
  tsconfig.json
  scripts/
    deploy.ts
  src/
    IntelPool.sol
    IntelPoolFactory.sol
  test/
    IntelPool.test.ts
    IntelPoolFactory.test.ts
```

## Commands

```bash
npm install         # from repo root to install dependencies
npm run compile     # compile solidity
npm run test        # run unit tests (stubs provided)
```

Environment variables for Base RPC endpoints can be supplied via `.env` and loaded in `hardhat.config.ts`.
