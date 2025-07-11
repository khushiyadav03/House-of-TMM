import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * We always have the anon key in the browser (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
 * and we sometimes have the Service-Role key on the server
 * (`SUPABASE_SERVICE_ROLE_KEY`).  Pick the strongest key that exists **once**
 * and re-use the client everywhere (singleton pattern).
 */
let _client: SupabaseClient | undefined

export const supabase = (() => {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL // fallback for server only

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL - please add it to your env-vars.")

  const key =
    // Prefer service-role key on the server when it exists
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    // Else fall back to the public anon key (works for reads + RLS-guarded writes)
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!key)
    throw new Error(
      "Missing Supabase key. Add NEXT_PUBLIC_SUPABASE_ANON_KEY (and/or SUPABASE_SERVICE_ROLE_KEY) to your env-vars.",
    )

  _client = createClient(url, key)
  return _client
})()
