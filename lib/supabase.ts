import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const PUBLIC_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY // server only
const PRIVATE_URL = process.env.SUPABASE_URL // server only (optional, usually same as PUBLIC_URL)

let _serverClient: SupabaseClient | undefined
let _browserClient: SupabaseClient | undefined

/**
 * Returns a Supabase client instance for server-side operations (API Routes, Server Components, Server Actions).
 * It prioritizes the SERVICE_ROLE_KEY for RLS bypass, falling back to the public ANON key.
 * This client is a singleton for the server environment.
 */
export function getSupabaseServer(): SupabaseClient {
  if (!_serverClient) {
    const url = (PRIVATE_URL || PUBLIC_URL) as string
    if (!url) {
      console.error(
        "Missing Supabase URL env-var for server client. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.",
      )
      throw new Error("Supabase URL not configured for server.")
    }

    let key: string | undefined
    if (SERVICE_ROLE) {
      key = SERVICE_ROLE
    } else if (PUBLIC_ANON) {
      key = PUBLIC_ANON
      console.warn(
        "SUPABASE_SERVICE_ROLE_KEY not found. Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for server client. Ensure RLS policies allow operations.",
      )
    } else {
      console.error(
        "Missing Supabase key env-var for server client. Please set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      )
      throw new Error("Supabase key not configured for server.")
    }

    _serverClient = createClient(url, key, { auth: { persistSession: false } })
  }
  return _serverClient
}

/**
 * Returns a Supabase client instance for client-side operations (Client Components).
 * It uses the public ANON key and is a singleton for the browser environment.
 * This function should only be called in a browser context.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be called in a browser environment.")
  }
  if (!_browserClient) {
    const url = PUBLIC_URL as string
    if (!url) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL env-var for browser client.")
      throw new Error("Supabase URL not configured for browser.")
    }
    const key = PUBLIC_ANON as string
    if (!key) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY env-var for browser client.")
      throw new Error("Supabase key not configured for browser.")
    }
    _browserClient = createClient(url, key, { auth: { persistSession: false } })
  }
  return _browserClient
}

// ---------- Domain Types (keeping them for completeness) ----------
export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  image_url: string
  author: string
  publish_date: string
  created_at: string
  updated_at: string
  featured: boolean
  likes: number
  views: number
  categories?: Category[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
}

export interface Magazine {
  id: number
  title: string
  description: string
  cover_image_url: string
  pdf_file_path: string
  price: number
  issue_date: string
  created_at: string
  updated_at: string
  sales_count: number
  status: string
}

export interface CoverPhoto {
  id: number
  title: string
  image_url: string
  description: string
  category: string
  is_active: boolean
  display_order: number
  created_at: string
}

export interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  is_main_video: boolean
  is_active: boolean
  display_order: number
  created_at: string
}

export interface BrandImage {
  id: number
  title: string
  image_url: string
  is_active: boolean
  display_order: number
  created_at: string
}
