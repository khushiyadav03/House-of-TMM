import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseServerInstance: SupabaseClient | null = null
let supabaseBrowserInstance: SupabaseClient | null = null

/**
 * Returns a Supabase client instance for server-side operations (API Routes, Server Components, Server Actions).
 * It strictly prioritizes the SERVICE_ROLE_KEY for RLS bypass.
 * This client is a singleton for the server environment.
 */
export function getSupabaseServer(): SupabaseClient {
  if (supabaseServerInstance) {
    return supabaseServerInstance
  }

  // Prefer SUPABASE_URL for server-side, fallback to NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error(
      "Error: Supabase URL is not defined for server client. Please set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.",
    )
    throw new Error("Supabase URL not configured for server.")
  }

  if (!serviceRoleKey) {
    console.error(
      "Error: SUPABASE_SERVICE_ROLE_KEY is not defined. This key is required for server-side operations to bypass RLS.",
    )
    throw new Error("Supabase SERVICE_ROLE_KEY not configured for server.")
  }

  supabaseServerInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false, // Sessions are not persisted on the server
    },
  })
  console.log("Supabase server client initialized with SERVICE_ROLE_KEY.")

  return supabaseServerInstance
}

/**
 * Returns a Supabase client instance for client-side operations (Client Components).
 * It uses the public NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * This client is a singleton for the browser environment.
 * This function should only be called in a browser context.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be called in a browser environment.")
  }
  if (supabaseBrowserInstance) {
    return supabaseBrowserInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !anonKey) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined for browser client.")
    throw new Error("Supabase URL or Anon Key is not defined for browser client.")
  }

  supabaseBrowserInstance = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: true, // Sessions are persisted in the browser
    },
  })
  console.log("Supabase browser client initialized with ANON_KEY.")

  return supabaseBrowserInstance
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
