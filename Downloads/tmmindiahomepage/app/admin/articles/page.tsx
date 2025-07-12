"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Edit, Trash2, Eye, Heart, Calendar, Plus, Search, Filter, RefreshCw, TrendingUp, Users, FileText, Star } from "lucide-react"
import Footer from "../../../components/Footer"
import AdminRoute from "../../../components/AdminRoute"
import { useToast, ToastContainer } from "../../../components/Toast"

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
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedArticles, setSelectedArticles] = useState<number[]>([])
  const articlesPerPage = 10

  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

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
      showError("Failed to fetch articles")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      showError("Failed to fetch categories")
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchArticles()
    showInfo("Refreshing articles...")
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        const response = await fetch(`/api/articles/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          showSuccess("Article deleted successfully")
          fetchArticles()
        } else {
          showError("Failed to delete article")
        }
      } catch (error) {
        console.error("Failed to delete article:", error)
        showError("Failed to delete article")
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
        showSuccess(featured ? "Article unfeatured" : "Article featured")
        fetchArticles()
      } else {
        showError("Failed to update article")
      }
    } catch (error) {
      console.error("Failed to update article:", error)
      showError("Failed to update article")
    }
  }

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        showSuccess(`Article ${newStatus}`)
        fetchArticles()
      } else {
        showError("Failed to update article status")
      }
    } catch (error) {
      console.error("Failed to update article status:", error)
      showError("Failed to update article status")
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedArticles.length === 0) {
      showError("Please select articles first")
      return
    }

    const confirmMessage = {
      delete: "Are you sure you want to delete the selected articles?",
      publish: "Are you sure you want to publish the selected articles?",
      draft: "Are you sure you want to move the selected articles to draft?",
      feature: "Are you sure you want to feature the selected articles?",
      unfeature: "Are you sure you want to unfeature the selected articles?",
    }

    if (!confirm(confirmMessage[action as keyof typeof confirmMessage])) {
      return
    }

    try {
      const promises = selectedArticles.map(id => {
        const body: any = {}
        
        switch (action) {
          case "delete":
            return fetch(`/api/articles/${id}`, { method: "DELETE" })
          case "publish":
            body.status = "published"
            break
          case "draft":
            body.status = "draft"
            break
          case "feature":
            body.featured = true
            break
          case "unfeature":
            body.featured = false
            break
        }

        return fetch(`/api/articles/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      })

      const results = await Promise.all(promises)
      const allSuccessful = results.every(res => res.ok)

      if (allSuccessful) {
        showSuccess(`Bulk ${action} completed successfully`)
        setSelectedArticles([])
        fetchArticles()
      } else {
        showError("Some operations failed")
      }
    } catch (error) {
      console.error("Bulk action failed:", error)
      showError("Bulk action failed")
    }
  }

  const toggleArticleSelection = (id: number) => {
    setSelectedArticles(prev => 
      prev.includes(id) 
        ? prev.filter(articleId => articleId !== id)
        : [...prev, id]
    )
  }

  const selectAllArticles = () => {
    setSelectedArticles(articles.map(article => article.id))
  }

  const deselectAllArticles = () => {
    setSelectedArticles([])
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      scheduled: "bg-blue-100 text-blue-800",
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
  }

  // Calculate statistics
  const totalArticles = articles.length
  const publishedArticles = articles.filter(a => a.status === "published").length
  const draftArticles = articles.filter(a => a.status === "draft").length
  const featuredArticles = articles.filter(a => a.featured).length
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0)
  const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0)

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        </div>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles Management</h1>
              <p className="text-xl text-gray-600">Manage all your articles and content</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                title="Refresh articles"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <Link
                href="/admin/articles/new"
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Article
              </Link>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-900">{draftArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-2xl font-bold text-gray-900">{featuredArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-indigo-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          {/* Bulk Actions */}
          {selectedArticles.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedArticles.length} article(s) selected
                  </span>
                  <button
                    onClick={deselectAllArticles}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("publish")}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction("draft")}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Move to Draft
                  </button>
                  <button
                    onClick={() => handleBulkAction("feature")}
                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                  >
                    Feature
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Articles List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Articles ({articles.length} of {totalPages * articlesPerPage})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAllArticles}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {articles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-shrink-0">
                        <Image
                          src={article.image_url || "/placeholder.svg"}
                          alt={article.title}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {article.title}
                          </h3>
                          {article.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(article.status)}`}>
                            {article.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleStatus(article.id, article.status)}
                            className={`px-2 py-1 text-xs rounded ${
                              article.status === "published" 
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                                : "bg-green-100 text-green-800 hover:bg-green-200"
                            }`}
                          >
                            {article.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => toggleFeatured(article.id, article.featured)}
                            className={`px-2 py-1 text-xs rounded ${
                              article.featured 
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            }`}
                          >
                            {article.featured ? "Unfeature" : "Feature"}
                          </button>
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit article"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.excerpt}</p>

                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(article.publish_date).toLocaleDateString()}
                        </span>
                        <span>By {article.author}</span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {article.likes}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        {article.categories?.map((category) => (
                          <span
                            key={category.id}
                            className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminRoute>
  )
}
