import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
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
  scheduled_date?: string
  likes: number
  views: number
  featured: boolean
  categories?: Category[]
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at?: string
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

export interface MagazinePurchase {
  id: number
  magazine_id: number
  user_email: string
  purchase_date: string
  payment_status: string
  payment_id?: string
  amount: number
}

export interface HomepageContent {
  id: number
  section_name: string
  content: any
  updated_at?: string
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

// Helper functions
export const getArticlesByCategory = async (categorySlug: string, page = 1, limit = 12) => {
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("articles")
    .select(
      `
      *,
      article_categories!inner(
        categories!inner(slug)
      )
    `,
      { count: "exact" },
    )
    .eq("article_categories.categories.slug", categorySlug)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { articles: data, total: count }
}

export const getArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      article_categories(
        categories(*)
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error) throw error
  return data
}

export const getAllCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) throw error
  return data
}

export const getMagazines = async () => {
  const { data, error } = await supabase
    .from("magazines")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const getHomepageContent = async (sectionName: string) => {
  const { data, error } = await supabase.from("homepage_content").select("*").eq("section_name", sectionName).single()

  if (error) throw error
  return data
}
