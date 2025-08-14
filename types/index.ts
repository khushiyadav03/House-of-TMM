// Shared type definitions for TMM India

export interface Magazine {
  id: number
  title: string
  description?: string // Optional to match database schema
  issue_date: string
  cover_image_url: string
  pdf_file_path: string
  price: number
  year?: number
  is_paid: boolean
  status?: "published" | "draft" | "scheduled"
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  alt_text?: string
  created_at?: string
  updated_at?: string
  sales_count?: number
}

export interface Article {
  id: number
  title: string
  content: string
  excerpt?: string
  author?: string
  published_at?: string
  status: "draft" | "published" | "scheduled"
  featured_image_url?: string
  slug: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  alt_text?: string
  likes_count?: number
  views_count?: number
  is_featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CoverPhoto {
  id: number
  title: string
  image_url: string
  alt_text?: string
  status: "active" | "inactive" | "scheduled"
  display_order?: number
  scheduled_at?: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email?: string
}

export interface UserProfile {
  phone: string
}

export interface MagazinePurchase {
  id: number
  user_id: string
  magazine_id: number
  razorpay_order_id: string
  razorpay_payment_id?: string
  amount: number
  currency: string
  status: "created" | "paid" | "failed" | "refunded"
  created_at?: string
  updated_at?: string
}
