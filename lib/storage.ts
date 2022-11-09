import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabase =
  (global as unknown as { supabase: SupabaseClient }).supabase ||
  createClient(
    process.env.STORAGE_URL as string,
    process.env.STORAGE_APIKEY as string
  );

if (process.env.NODE_ENV !== "production") {
  (global as unknown as { supabase: SupabaseClient }).supabase = supabase;
}

export const storage = supabase.storage;
