"use client"

import { useState, useEffect } from "react"

export default function TestAllPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runTest = async () => {
      try {
        const response = await fetch('/api/test-all')
        const data = await response.json()
        setResults(data)
        console.log('Test results:', data)
      } catch (error) {
        console.error('Test failed:', error)
      } finally {
        setLoading(false)
      }
    }

    runTest()
  }, [])

  if (loading) {
    return <div className="p-8">Running database tests...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
      
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(results).map(([key, value]: [string, any]) => (
            <div key={key} className={`p-6 rounded-lg border ${value.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h2 className="text-xl font-bold mb-4 capitalize">{key}</h2>
              <div className="space-y-2">
                <p><strong>Status:</strong> {value.success ? '✅ Success' : '❌ Failed'}</p>
                <p><strong>Count:</strong> {value.count}</p>
                {value.error && <p><strong>Error:</strong> {value.error}</p>}
                {value.sample && (
                  <div className="mt-4">
                    <p><strong>Sample Data:</strong></p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(value.sample, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Quick Actions:</h3>
        <div className="space-x-4">
          <a href="/" className="text-blue-600 hover:underline">Go to Homepage</a>
          <a href="/magazine" className="text-blue-600 hover:underline">Go to Magazines</a>
          <a href="/admin" className="text-blue-600 hover:underline">Go to Admin</a>
        </div>
      </div>
    </div>
  )
}