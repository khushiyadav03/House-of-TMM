"use client"
import CategoryLayout from "../../../components/CategoryLayout" // Use CategoryLayout

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  excerpt: string
  category: string
}

export default function BrandFeatureFashion() {
  // This page will now rely on CategoryLayout for fetching and rendering
  // The CategoryLayout will handle the loading, articles state, and pagination
  return (
    <CategoryLayout
      categoryName="Fashion" // Changed heading to "Fashion"
      categorySlug="fashion"
      description="Discover the latest fashion trends and brand collaborations"
    />
  )
}
