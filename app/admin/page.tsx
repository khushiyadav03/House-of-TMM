"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, BookOpen, ImageIcon, Tag, Home, TrendingUp, Users, DollarSign, Eye, Heart } from "lucide-react"
import Footer from "../../components/Footer"

interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalMagazines: number
  totalCategories: number
  totalViews: number
  totalLikes: number
  totalSales: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalMagazines: 0,
    totalCategories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalSales: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [articlesRes, magazinesRes, categoriesRes] = await Promise.all([
        fetch("/api/articles?limit=1000"),
        fetch("/api/magazines"),
        fetch("/api/categories"),
      ])

      const articlesData = await articlesRes.json()
      const magazinesData = await magazinesRes.json()
      const categoriesData = await categoriesRes.json()

      const articles = articlesData.articles || []
      const magazines = magazinesData || []

      const totalViews = articles.reduce((sum: number, article: any) => sum + (article.views || 0), 0)
      const totalLikes = articles.reduce((sum: number, article: any) => sum + (article.likes || 0), 0)
      const totalSales = magazines.reduce((sum: number, mag: any) => sum + (mag.sales_count || 0), 0)
      const totalRevenue = magazines.reduce((sum: number, mag: any) => sum + (mag.sales_count || 0) * mag.price, 0)

      setStats({
        totalArticles: articles.length,
        publishedArticles: articles.filter((a: any) => a.status === "published").length,
        draftArticles: articles.filter((a: any) => a.status === "draft").length,
        totalMagazines: magazines.length,
        totalCategories: categoriesData.length,
        totalViews,
        totalLikes,
        totalSales,
        totalRevenue,
      })
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      title: "Articles",
      description: "Manage all articles and blog posts",
      href: "/admin/articles",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Magazines",
      description: "Manage magazine issues and sales",
      href: "/admin/magazines",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Categories",
      description: "Organize content with categories",
      href: "/admin/categories",
      icon: Tag,
      color: "bg-purple-500",
    },
    {
      title: "Homepage Content",
      description: "Customize homepage sections",
      href: "/admin/homepage",
      icon: Home,
      color: "bg-orange-500",
    },
    {
      title: "Cover Photos",
      description: "Manage carousel and cover images",
      href: "/admin/cover-photos",
      icon: ImageIcon,
      color: "bg-pink-500",
    },
  ]

  const statCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Published",
      value: stats.publishedArticles,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Drafts",
      value: stats.draftArticles,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Magazines",
      value: stats.totalMagazines,
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Magazine Sales",
      value: stats.totalSales,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome to your content management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                <span>Dashboard loaded successfully</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Statistics updated</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Admin panel accessed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
