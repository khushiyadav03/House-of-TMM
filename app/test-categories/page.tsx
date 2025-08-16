"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function TestCategoriesPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const categories = [
    { name: 'Digital Cover', slug: 'digital-cover', type: 'cover_photos' },
    { name: 'Editorial Shoot', slug: 'editorial-shoot', type: 'cover_photos' },
    { name: 'PEP Talk', slug: 'pep-talk', type: 'pep_talks' },
    { name: 'Fashion', slug: 'fashion', type: 'articles' },
    { name: 'Sports', slug: 'sports', type: 'articles' },
    { name: 'Finance', slug: 'finance', type: 'articles' },
    { name: 'Travel', slug: 'travel', type: 'articles' },
  ]

  const testCategory = async (slug: string, type: string) => {
    try {
      let url = ''
      if (type === 'cover_photos') {
        url = `/api/cover-photos/by-category/${slug}?page=1&limit=5`
      } else if (type === 'pep_talks') {
        url = `/api/pep-talk?page=1&limit=5`
      } else {
        url = `/api/articles/by-category/${slug}?page=1&limit=5`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      return {
        success: response.ok,
        count: data.articles?.length || 0,
        total: data.total || 0,
        error: data.error || null
      }
    } catch (error) {
      return {
        success: false,
        count: 0,
        total: 0,
        error: 'Network error'
      }
    }
  }

  const testAllCategories = async () => {
    setLoading(true)
    const results: any = {}
    
    for (const category of categories) {
      results[category.slug] = await testCategory(category.slug, category.type)
    }
    
    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Category Data Test</h1>
        
        <div className="mb-8">
          <button
            onClick={testAllCategories}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test All Categories'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category.slug} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">Type: {category.type}</p>
              
              {testResults[category.slug] && (
                <div className="mb-4">
                  <div className={`p-2 rounded ${testResults[category.slug].success ? 'bg-green-100' : 'bg-red-100'}`}>
                    <p className="text-sm">
                      Status: {testResults[category.slug].success ? '✅ Success' : '❌ Failed'}
                    </p>
                    <p className="text-sm">
                      Items: {testResults[category.slug].count} / {testResults[category.slug].total}
                    </p>
                    {testResults[category.slug].error && (
                      <p className="text-sm text-red-600">
                        Error: {testResults[category.slug].error}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              <Link 
                href={`/${category.slug}`}
                className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Visit Page
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Quick Links:</h2>
          <div className="space-x-4">
            <Link href="/api/debug/articles" className="text-blue-600 hover:underline">
              Debug Articles
            </Link>
            <Link href="/debug/populate" className="text-blue-600 hover:underline">
              Populate Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}