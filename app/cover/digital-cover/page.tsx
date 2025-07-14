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

export default function DigitalCoverPage() {
  const [coverPhotos, setCoverPhotos] = useState<CoverPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoverPhotos()
  }, [])

  const fetchCoverPhotos = async () => {
    try {
      const response = await fetch("/api/cover-photos")
      const data: CoverPhoto[] = await response.json()
      
      // Filter for digital cover photos that are active
      const digitalCoverPhotos = data.filter(
        photo => photo.category === "digital-cover" && photo.is_active
      )
      
      // Sort by display order
      digitalCoverPhotos.sort((a, b) => a.display_order - b.display_order)
      
      setCoverPhotos(digitalCoverPhotos)
    } catch (error) {
      console.error("Failed to fetch cover photos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Convert cover photos to article format for CategoryLayout
  const digitalCoverArticles = coverPhotos.map(photo => ({
    id: photo.id,
    title: photo.title,
    slug: `cover-photo-${photo.id}`,
    image_url: photo.image_url,
    author: "TMM India",
    publish_date: photo.created_at,
    category: "Digital Cover",
    excerpt: photo.description || "Explore our digital cover photography collection.",
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
      categoryName="Digital Cover"
      categorySlug="digital-cover"
      description="Explore the cutting-edge world of digital fashion and virtual experiences that are shaping the future of style."
      initialArticles={digitalCoverArticles}
    />
  )
}
