"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react" // Import Chevron icons for pagination

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  excerpt: string
  category: string
  categories?: { name: string; slug: string }[]
}

interface CategoryLayoutProps {
  categoryName: string
  categorySlug: string
  description: string
  children?: React.ReactNode
  initialArticles?: Article[] // New prop to accept static articles
}

export default function CategoryLayout({
  categoryName,
  categorySlug,
  description,
  children,
  initialArticles,
}: CategoryLayoutProps) {
  const articlesPerPage = 12
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])
  const [loading, setLoading] = useState(initialArticles ? false : true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchArticles()
  }, [currentPage, categorySlug])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/articles?category=${categorySlug}&page=${currentPage}&limit=${articlesPerPage}`,
      )
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      setArticles([]) // Ensure articles array is empty on error
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Strictly filter articles by categorySlug
  const filteredArticles = articles.filter(article =>
    article.categories?.some(cat => cat?.slug === categorySlug)
  )

  const currentArticlesToDisplay = filteredArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading {categoryName} articles...</p>
          </div>
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

        {currentArticlesToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {categoryName.toLowerCase()} articles found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticlesToDisplay.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <div className="relative w-full h-[405px]">
                      {/* Category badge */}
                      <span
                        className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold text-white
                          ${
                            article.categories?.[0]?.slug === "fashion"
                              ? "bg-pink-600"
                              : article.categories?.[0]?.slug === "tech & auto"
                              ? "bg-blue-600"
                              : article.categories?.[0]?.slug === "digital-cover"
                              ? "bg-yellow-600"
                              : article.categories?.[0]?.slug === "health-wellness"
                              ? "bg-green-600"
                              : article.categories?.[0]?.slug === "fitness-selfcare"
                              ? "bg-purple-600"
                              : article.categories?.[0]?.slug === "travel"
                              ? "bg-cyan-600"
                              : article.categories?.[0]?.slug === "finance"
                              ? "bg-orange-600"
                              : article.categories?.[0]?.slug === "cricket"
                              ? "bg-red-600"
                              : article.categories?.[0]?.slug === "golf"
                              ? "bg-emerald-700"
                              : article.categories?.[0]?.slug === "other-sports"
                              ? "bg-gray-700"
                              : article.categories?.[0]?.slug === "interviews"
                              ? "bg-indigo-700"
                              : article.categories?.[0]?.slug === "trending"
                              ? "bg-fuchsia-700"
                              : article.categories?.[0]?.slug === "cover"
                              ? "bg-black"
                              : "bg-gray-800"
                          } !rounded-none`}
                        style={{ borderRadius: 0 }}
                      >
                        {article.categories?.[0]?.name || "Uncategorized"}
                      </span>
                      <Image
                        src={article.image_url || "/placeholder.svg?height=405&width=270"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
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
                  className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  )
}
