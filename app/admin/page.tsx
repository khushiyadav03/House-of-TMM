"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FileText, 
  BookOpen, 
  Eye, 
  Heart, 
  Plus, 
  Edit, 
  BarChart3
} from "lucide-react"
import AdminRoute from "../../components/AdminRoute"
import { useToast, ToastContainer } from "../../components/Toast"

interface DashboardStats {
  totalArticles: number
  totalMagazines: number
  totalViews: number
  totalLikes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    totalMagazines: 0,
    totalViews: 0,
    totalLikes: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [articlesRes, magazinesRes] = await Promise.all([
        fetch("/api/articles?limit=1000"),
        fetch("/api/magazines")
      ])

      const articlesData = await articlesRes.json()
      const magazinesData = await magazinesRes.json()

      const articles = articlesData.articles || []
      const magazines = magazinesData || []

      // Calculate statistics
      const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0)
      const totalLikes = articles.reduce((sum: number, article: any) => sum + (article.likes || 0), 0)

      setStats({
        totalArticles: articles.length,
        totalMagazines: magazines.length,
        totalViews,
        totalLikes
      })

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      showError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    window.location.href = "/admin/login"
  }



  if (loading) {
    return (
      <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
      </AdminRoute>
    )
  }

  return (
    <AdminRoute>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-xl text-gray-600">Welcome back! Here's what's happening with your site.</p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchDashboardData}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                title="Refresh data"
              >
                <BarChart3 className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
        </div>

        {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Magazines</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMagazines}</p>
                </div>
              </div>
        </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                    </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
          </div>
        </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
          </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/admin/articles/new"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-green-600 mr-3" />
                  <span>Create New Article</span>
                </Link>
                <Link
                  href="/admin/pep-talks"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Manage PEP Talks</span>
                </Link>
                <Link
                  href="/admin/articles"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Manage Articles</span>
                </Link>
                <Link
                  href="/admin/magazines"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                  <span>Manage Magazines</span>
                </Link>
                <Link
                  href="/admin/cover-photos"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-orange-600 mr-3" />
                  <span>Manage Cover Photos</span>
                </Link>
                <Link
                  href="/admin/homepage"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit className="h-5 w-5 text-purple-600 mr-3" />
                  <span>Edit Homepage</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminRoute>
  )
}
