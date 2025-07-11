import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

// Define types for your database schema
export interface Article {
  id: number
  title: string
  author: string
  publish_date: string
  category: string
  content: string
  image_url: string
  slug: string
  created_at?: string
  updated_at?: string
}

export interface Magazine {
  id: number
  title: string
  description: string
  cover_image_url: string
  pdf_file_path: string
  price: number
  issue_date: string
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  created_at?: string
  updated_at?: string
}

export interface BrandImage {
  id: number
  image_url: string
  alt_text: string
  created_at?: string
}

export interface YoutubeVideo {
  id: number
  title: string
  video_url: string
  thumbnail_url: string
  description: string
  created_at?: string
}

// Type for the database schema
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article
        Insert: Omit<Article, "id" | "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }
        Update: Partial<Omit<Article, "id" | "created_at" | "updated_at">> & {
          created_at?: string
          updated_at?: string
        }
      }
      magazines: {
        Row: Magazine
        Insert: Omit<Magazine, "id" | "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }
        Update: Partial<Omit<Magazine, "id" | "created_at" | "updated_at">> & {
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: Category
        Insert: Omit<Category, "id" | "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">> & {
          created_at?: string
          updated_at?: string
        }
      }
      brand_images: {
        Row: BrandImage
        Insert: Omit<BrandImage, "id" | "created_at"> & { created_at?: string }
        Update: Partial<Omit<BrandImage, "id" | "created_at">> & { created_at?: string }
      }
      youtube_videos: {
        Row: YoutubeVideo
        Insert: Omit<YoutubeVideo, "id" | "created_at"> & { created_at?: string }
        Update: Partial<Omit<YoutubeVideo, "id" | "created_at">> & { created_at?: string }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Client-side Supabase client (for public data, RLS enabled)
let supabaseClient: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
  }
  if (!supabaseClient) {
    supabaseClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  }
  return supabaseClient
}

// Server-side Supabase client (for API routes, can bypass RLS with service role key)
let supabaseServerClient: SupabaseClient<Database> | null = null

export function getSupabaseServer(): SupabaseClient<Database> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables on the server.")
  }
  if (!supabaseServerClient) {
    supabaseServerClient = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false, // Important for server-side to not persist sessions
      },
    })
  }
  return supabaseServerClient
}
