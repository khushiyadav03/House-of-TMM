"use client"

import { useState } from 'react'

export default function PopulatePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handlePopulate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/populate-categories', {
        method: 'POST'
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to populate categories' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug: Populate Article Categories</h1>
        
        <div className="mb-8">
          <button
            onClick={handlePopulate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Populating...' : 'Populate Article Categories'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Result:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click "Populate Article Categories" to automatically assign categories to articles</li>
            <li>This will create relationships in the article_categories table</li>
            <li>After running this, category pages should show articles</li>
            <li>You can run this multiple times safely (it uses upsert)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}