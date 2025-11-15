import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { poolsRouter } from "./routes/pools.js";
import { intelRouter } from "./routes/intel.js";
import { startIndexer } from "./services/indexer.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/pools", poolsRouter);
app.use("/intel", intelRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  if (process.env.BASE_RPC_WSS_URL && process.env.FACTORY_ADDRESS) {
    startIndexer().catch((err) => {
      console.error("Indexer failed to start", err);
    });
  } else {
    console.log("Indexer disabled: BASE_RPC_WSS_URL or FACTORY_ADDRESS missing");
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error", err);
  res.status(500).json({ error: "Internal Server Error" });
});
