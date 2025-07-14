"use client"

import { useState, useEffect } from "react"
import CategoryLayout from "../../../components/CategoryLayout"

interface CoverPhoto {
  id: number
  title: string
  image_url: string
  description: string
  category: string
  is_active: boolean
  display_order: number
  created_at: string
}

export default function EditorialShootPage() {
  const [coverPhotos, setCoverPhotos] = useState<CoverPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoverPhotos()
  }, [])

  const fetchCoverPhotos = async () => {
    try {
      const response = await fetch("/api/cover-photos")
      const data: CoverPhoto[] = await response.json()
      
      // Filter for editorial shoot photos that are active
      const editorialShootPhotos = data.filter(
        photo => photo.category === "editorial-shoot" && photo.is_active
      )
      
      // Sort by display order
      editorialShootPhotos.sort((a, b) => a.display_order - b.display_order)
      
      setCoverPhotos(editorialShootPhotos)
    } catch (error) {
      console.error("Failed to fetch cover photos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Convert cover photos to article format for CategoryLayout
  const editorialShootArticles = coverPhotos.map(photo => ({
    id: photo.id,
    title: photo.title,
    slug: `cover-photo-${photo.id}`,
    image_url: photo.image_url,
    author: "TMM India",
    publish_date: photo.created_at,
    category: "Editorial Shoot",
    excerpt: photo.description || "Explore our editorial photography collection.",
  }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <CategoryLayout
      categoryName="Editorial Shoot"
      categorySlug="editorial-shoot"
      description="Dive into the creative process behind our most stunning editorial photography and fashion storytelling."
      initialArticles={editorialShootArticles}
    />
  )
}
