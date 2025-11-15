import { Router } from "express";
import crypto from "crypto";
import { getSupabaseAdmin } from "../db/supabase.js";
import type { CreateIntelPayload } from "@intel-marketplace/shared";

export const intelRouter = Router();

intelRouter.post("/", async (req, res, next) => {
  try {
    const payload = req.body as CreateIntelPayload;
    if (!payload?.poolAddress || !payload?.encryptedData || !payload?.contentHash) {
      res.status(400).json({ error: "poolAddress, encryptedData, and contentHash required" });
      return;
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      res.status(503).json({ error: "Supabase credentials not configured" });
      return;
    }

    const { data, error } = await supabase
      .from("intel_blob")
      .insert({
        pool_address: payload.poolAddress.toLowerCase(),
        encrypted_data: payload.encryptedData,
        content_hash: payload.contentHash,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    const id = data.id as string;
    const backendUrl = process.env.PUBLIC_BACKEND_URL ?? req.protocol + "://" + req.get("host");
    res.json({
      id,
      uri: `${backendUrl}/intel/${id}`,
    });
  } catch (error) {
    next(error);
  }
});

intelRouter.get("/:id", async (req, res, next) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      res.status(503).json({ error: "Supabase credentials not configured" });
      return;
    }

    const { data, error } = await supabase
      .from("intel_blob")
      .select("id,pool_address,encrypted_data,content_hash,created_at")
      .eq("id", req.params.id)
      .single();

    if (error) {
      throw error;
    }

    res.json({
      id: data.id,
      poolAddress: data.pool_address,
      encryptedData: data.encrypted_data,
      contentHash: data.content_hash,
      createdAt: data.created_at,
      checksum: crypto.createHash("sha256").update(JSON.stringify(data.encrypted_data)).digest("hex"),
    });
  } catch (error) {
    next(error);
  }
});
