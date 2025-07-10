"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Footer from "../../../components/Footer"

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
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const articlesPerPage = 12

  useEffect(() => {
    fetchArticles()
  }, [currentPage])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/articles?category=fashion&page=${currentPage}&limit=${articlesPerPage}`)
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalPages(data.totalPages || 1)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading fashion articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Brand Feature - Fashion</h1>
          <p className="text-xl text-gray-600">Discover the latest fashion trends and brand collaborations</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No fashion articles found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/articles/${article.slug}`}>
                    <div className="relative h-48">
                      <Image
                        src={article.image_url || "/placeholder.svg?height=192&width=384"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-gray-600">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                </article>
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
                  className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
