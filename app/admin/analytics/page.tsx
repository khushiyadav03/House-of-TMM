"use client"
import { useState, useEffect } from "react"
import AdminRoute from "../../../components/AdminRoute"
import { useToast, ToastContainer } from "../../../components/Toast"
import { RefreshCw } from "lucide-react"

interface Analytic {
  id: number
  content_type: string
  content_id: number
  event_type: string
  event_data: any
  created_at: string
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytic[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      const data = await response.json()
      setAnalytics(data.analytics || [])
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      showError("Failed to fetch analytics")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
    showInfo("Refreshing analytics...")
  }

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
              <p className="text-xl text-gray-600">View content analytics and reports</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              title="Refresh analytics"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {analytics.map((analytic) => (
                <div key={analytic.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{analytic.event_type} on {analytic.content_type} #{analytic.content_id}</h3>
                      <p className="text-sm text-gray-600 mt-1">{new Date(analytic.created_at).toLocaleString()}</p>
                      <pre className="text-sm text-gray-500 mt-2">{JSON.stringify(analytic.event_data, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      </div>
    </AdminRoute>
  )
}