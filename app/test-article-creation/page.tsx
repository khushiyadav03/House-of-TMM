"use client"

import { useState } from "react"

export default function TestArticleCreation() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const generateToken = async () => {
    try {
      const response = await fetch("/api/admin/generate-token", {
        method: "POST"
      })
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem("adminToken", data.token)
        setResult(`✅ Token generated and stored: ${data.token.substring(0, 50)}...`)
      } else {
        setResult(`❌ Token generation failed: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    }
  }

  const testArticleCreation = async () => {
    setLoading(true)
    try {
      const testArticle = {
        title: "Test Article " + Date.now(),
        slug: "test-article-" + Date.now(),
        content: "This is a test article content.",
        excerpt: "This is a test excerpt.",
        author: "Test Author",
        publish_date: new Date().toISOString().split("T")[0],
        categories: [1], // Assuming category ID 1 exists
        status: "published"
      }

      // First try the debug endpoint
      const debugResponse = await fetch("/api/articles/create-debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testArticle)
      })

      if (debugResponse.ok) {
        const article = await debugResponse.json()
        setResult(`✅ Article created successfully via debug endpoint! ID: ${article.id}, Title: ${article.title}`)
      } else {
        const error = await debugResponse.json()
        setResult(`❌ Debug endpoint failed: ${error.error} - ${JSON.stringify(error.details)}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const testWithToken = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        setResult("❌ No admin token found. Generate one first.")
        setLoading(false)
        return
      }

      const testArticle = {
        title: "Test Article with Token " + Date.now(),
        slug: "test-article-token-" + Date.now(),
        content: "This is a test article content with token.",
        excerpt: "This is a test excerpt with token.",
        author: "Test Author",
        publish_date: new Date().toISOString().split("T")[0],
        categories: [1],
        status: "published"
      }

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token
        },
        body: JSON.stringify(testArticle)
      })

      if (response.ok) {
        const article = await response.json()
        setResult(`✅ Article created successfully with token! ID: ${article.id}, Title: ${article.title}`)
      } else {
        const error = await response.json()
        setResult(`❌ Token endpoint failed: ${error.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Article Creation Debug Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={generateToken}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            1. Generate Admin Token
          </button>
          
          <button
            onClick={testArticleCreation}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            2. Test Debug Endpoint (No Auth)
          </button>
          
          <button
            onClick={testWithToken}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            3. Test Main Endpoint (With Token)
          </button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
        
        {loading && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Testing...</p>
          </div>
        )}
      </div>
    </div>
  )
}
