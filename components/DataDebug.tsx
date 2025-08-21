"use client"

import { useState, useEffect } from "react"

export default function DataDebug() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/articles?limit=5")
        const result = await response.json()
        setData(result)
        console.log("Debug component data:", result)
      } catch (error) {
        console.error("Debug component error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading debug data...</div>

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Data</h3>
      <pre className="text-xs overflow-auto max-h-40">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}