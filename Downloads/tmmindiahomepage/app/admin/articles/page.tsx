"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, Heart, Calendar, Plus, Search, Filter } from "lucide-react"
import Footer from "../../../components/Footer"

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  categories: { id: number; name: string }[]
  excerpt: string
  status: "published" | "draft" | "scheduled"
  scheduled_date?: string
  likes: number
  views: number
  featured: boolean
  created_at: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const articlesPerPage = 10

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [currentPage, searchTerm, selectedCategory, selectedStatus])

  const fetchArticles = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: articlesPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
      })

      const response = await fetch(`/api/articles?${params}`)
      const data = await response.json()
      setArticles(data.articles || [])
      setTotalPages(Math.ceil((data.total || 0) / articlesPerPage))
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        const response = await fetch(`/api/articles/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchArticles()
        } else {
          alert("Failed to delete article")
        }
      } catch (error) {
        console.error("Failed to delete article:", error)
        alert("Failed to delete article")
      }
    }
  }

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !featured }),
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error("Failed to update article:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles Management</h1>
            <p className="text-xl text-gray-600">Manage all your articles and content</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Article
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("")
                setSelectedStatus("")
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Articles ({articles.length})</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {articles.map((article) => (
              <div key={article.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                          {article.featured && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500 mb-2">
                          By {article.author} • {new Date(article.publish_date).toLocaleDateString()}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusBadge(article.status)}`}
                          >
                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                          </span>
                          {article.categories?.map((category) => (
                            <span
                              key={category.id}
                              className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{article.excerpt}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{article.likes || 0}</span>
                          </div>
                          {article.scheduled_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Scheduled: {new Date(article.scheduled_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => toggleFeatured(article.id, article.featured)}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            article.featured
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {article.featured ? "Unfeature" : "Feature"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {articles.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">No articles found</p>
                <p className="text-sm">Create your first article to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 ${
                  currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                } rounded`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
