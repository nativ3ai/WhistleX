import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

function buildClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      "Supabase credentials missing; backend will operate in degraded mode until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided."
    );
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!cachedClient) {
    cachedClient = buildClient();
  }
  return cachedClient;
}
