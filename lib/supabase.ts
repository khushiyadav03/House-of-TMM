import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * In the browser we can only expose the public ANON key.
 * On the server (Route Handlers, Server Actions, RSC) we prefer
 * the SERVICE-ROLE key if it exists to bypass RLS safely.
 *
 * We memo-ise per-runtime (one instance for the server process,
 * one instance for the browser) to avoid re-creates on hot-reload.
 */

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY // server only
const PRIVATE_URL = process.env.SUPABASE_URL // server only (optional)

function createSupabase(isServer: boolean): SupabaseClient {
  const url = (isServer ? (PRIVATE_URL ?? PUBLIC_URL) : PUBLIC_URL) as string
  if (!url) throw new Error("Missing Supabase URL env-var")

  const key = isServer ? (SERVICE_ROLE ?? PUBLIC_ANON) : PUBLIC_ANON
  if (!key) throw new Error("Missing Supabase key env-var")

  return createClient(url, key, { auth: { persistSession: false } })
}

// server singleton
let _serverClient: SupabaseClient | undefined
export const supabaseServer = (() => {
  if (typeof window !== "undefined") return undefined
  if (!_serverClient) _serverClient = createSupabase(true)
  return _serverClient
})()

// browser singleton
let _browserClient: SupabaseClient | undefined
export const supabaseBrowser = (() => {
  if (typeof window === "undefined") return undefined
  if (!_browserClient) _browserClient = createSupabase(false)
  return _browserClient
})()

/* ------------------------------------------------------------------ */
/* Shared domain types – keep the rest of the file as it was          */
/* ------------------------------------------------------------------ */

export type Article = {}
export type Category = {}
export type Magazine = {}
export type CoverPhoto = {}
export type YoutubeVideo = {}
export type BrandImage = {}
