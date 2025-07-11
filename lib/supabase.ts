import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client-side Supabase client
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createServerComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

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
