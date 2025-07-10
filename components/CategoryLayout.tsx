"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import Footer from "./Footer"

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

interface CategoryLayoutProps {
  categoryName: string
  categorySlug: string
  description?: string
}

export default function CategoryLayout({ categoryName, categorySlug, description }: CategoryLayoutProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const articlesPerPage = 12

  useEffect(() => {
    fetchArticles()
  }, [currentPage, categorySlug])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/articles?category=${categorySlug}&page=${currentPage}&limit=${articlesPerPage}`,
      )
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalPages(Math.ceil(data.total / articlesPerPage))
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-12">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {/* First Page */}
        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {/* Page Numbers */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
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

        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{categoryName}</h1>
          {description && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>}
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No articles found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                    <div className="relative w-full h-[320px]">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=320&width=300"}
                        alt={article.title}
                        width={300}
                        height={320}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black text-white px-3 py-1 text-sm font-semibold rounded">
                          {article.category}
                        </span>
                      </div>
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

            {/* Enhanced Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
