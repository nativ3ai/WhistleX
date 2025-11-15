import { Router } from "express";
import { getPoolDetail, listPools, listContributions, upsertPoolMetadata } from "../services/pools.js";

export const poolsRouter = Router();

poolsRouter.get("/", async (_req, res, next) => {
  try {
    const pools = await listPools();
    res.json({ pools });
  } catch (error) {
    next(error);
  }
});

poolsRouter.get("/:address", async (req, res, next) => {
  try {
    const pool = await getPoolDetail(req.params.address);
    if (!pool) {
      res.status(404).json({ error: "Pool not found" });
      return;
    }
    res.json({ pool });
  } catch (error) {
    next(error);
  }
});

poolsRouter.get("/:address/contributions", async (req, res, next) => {
  try {
    const contributions = await listContributions(req.params.address);
    res.json({ contributions });
  } catch (error) {
    next(error);
  }
});

poolsRouter.patch("/:address", async (req, res, next) => {
  try {
    const payload = req.body as { title?: string; description?: string; uri?: string };
    const pool = await upsertPoolMetadata(req.params.address, payload);
    res.json({ pool });
  } catch (error) {
    next(error);
  }
});
