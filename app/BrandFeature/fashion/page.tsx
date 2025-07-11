"use client"

import { useEffect, useState } from "react"
import CategoryLayout from "@/components/CategoryLayout"

interface Article {
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

export default function FashionPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFashionArticles() {
      try {
        const response = await fetch("/api/articles?category=fashion&sort=created_at_desc")
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch fashion articles")
        }
        const data = await response.json()
        setArticles(data.articles)
      } catch (err: any) {
        setError(err.message)
        console.error("Fashion articles fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFashionArticles()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading fashion articles...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return <CategoryLayout categoryName="Fashion" articles={articles} />
}
