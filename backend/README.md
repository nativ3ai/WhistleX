# Backend

Node.js + Express API for the Intel Marketplace. Responsibilities include:

- Persisting encrypted intel blobs to Supabase Postgres.
- Serving pool metadata and aggregated contribution statistics to the frontend.
- Indexing smart contract events from Base and mirroring them into Supabase tables.
- Exposing REST endpoints for pools, contributions, and encrypted intel payloads.

## Commands

```bash
npm run dev      # start development server with ts-node-dev
npm run build    # compile to dist/
npm start        # run compiled server
```

Environment variables are described in `.env.example`. The server listens on `process.env.PORT || 8080`.

Database schema migrations live in [`supabase/schema.sql`](../supabase/schema.sql).
