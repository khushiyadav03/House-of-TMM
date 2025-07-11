import { createClient } from "@supabase/supabase-js"

/**
 * Singleton Supabase client – works on both server & client.
 * Uses the public anon key only (read/write allowed by RLS).
 * We do NOT initialise with the service-role key inside API routes
 * to avoid “Invalid API key” errors and security risks.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Prevent re-creating the client in dev hot-reload
export const supabase =
  (global as any)._supabase ||
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })

if (process.env.NODE_ENV !== "production") {
  ;(global as any)._supabase = supabase
}

// ---------- Domain Types ----------
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at?: string
}

export interface Article {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  image_url?: string
  author?: string
  publish_date: string
  created_at?: string
  updated_at?: string
  status: "published" | "draft" | "scheduled"
  likes?: number
  views?: number
  featured: boolean
  categories?: Category[]
}

export interface Magazine {
  id: number
  title: string
  description?: string
  cover_image_url?: string
  pdf_file_path?: string
  price: number
  issue_date: string
  created_at?: string
  updated_at?: string
  status: "published" | "draft"
}

export interface CoverPhoto {
  id: number
  title: string
  image_url: string
  description?: string
  category?: string
  is_active: boolean
  display_order: number
  created_at?: string
}
