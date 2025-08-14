"use client"

import { useState, useEffect } from "react"
import AdminRoute from "../../../components/AdminRoute"

export default function DebugAPI() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const testAPI = async (endpoint: string, name: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(endpoint, {
        headers: {
          "x-admin-token": token || "",
        },
      })
      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          data: Array.isArray(data) ? `Array with ${data.length} items` : data,
          success: response.ok
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          status: 'Error',
          data: error,
          success: false
        }
      }))
    }
    setLoading(false)
  }

  const testAllAPIs = async () => {
    await testAPI("/api/articles", "Articles")
    await testAPI("/api/magazines", "Magazines") 
    await testAPI("/api/categories", "Categories")
    await testAPI("/api/youtube-videos", "YouTube Videos")
    await testAPI("/api/brand-images", "Brand Images")
    await testAPI("/api/cover-photos", "Cover Photos")
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin API Debug</h1>
          
          <div className="mb-6">
            <button
              onClick={testAllAPIs}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Testing..." : "Test All APIs"}
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(results).map(([name, result]: [string, any]) => (
              <div key={name} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">{name}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded ${
                      result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Response:</span>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mounted && (
            <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Admin Token Status:</h3>
              <p className="text-sm">
                Token exists: {localStorage.getItem("adminToken") ? "✅ Yes" : "❌ No"}
              </p>
              <p className="text-sm">
                Admin auth: {localStorage.getItem("adminAuth") ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  )
}