"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/lib/supabase" // Import Article type

interface CategoryLayoutProps {
  categoryName: string
  categorySlug: string
  description: string
}

export default function CategoryLayout({ categoryName, categorySlug, description }: CategoryLayoutProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const articlesPerPage = 12

  useEffect(() => {
    fetchArticles()
  }, [currentPage, categorySlug])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/articles?category=${categorySlug}&page=${currentPage}&limit=${articlesPerPage}&sort=created_at_desc`,
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch articles")
      }
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalPages(Math.ceil((data.total || 0) / articlesPerPage))
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      setArticles([]) // Ensure articles array is empty on error
      setTotalPages(1) // Reset total pages on error
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading {categoryName} articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {categoryName.toLowerCase()} articles found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-none article-card">
                    <div className="relative w-full h-[405px] article-card-image-container">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=405&width=270"}
                        alt={article.title}
                        fill
                        className="object-cover article-card-image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 article-card-content">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 article-card-title">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 article-card-meta">
                        <span>{article.author}</span>
                        <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 ${
                      currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
