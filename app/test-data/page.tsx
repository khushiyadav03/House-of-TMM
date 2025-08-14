"use client"

import { useState, useEffect } from "react"

export default function TestDataPage() {
  const [data, setData] = useState({
    articles: [],
    magazines: [],
    videos: [],
    brands: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      console.log("Fetching test data...")
      
      const [articlesRes, magazinesRes, videosRes, brandsRes] = await Promise.all([
        fetch("/api/articles?limit=10"),
        fetch("/api/magazines"),
        fetch("/api/youtube-videos"),
        fetch("/api/brand-images"),
      ])

      console.log("Response statuses:", {
        articles: articlesRes.status,
        magazines: magazinesRes.status,
        videos: videosRes.status,
        brands: brandsRes.status,
      })

      const articlesData = articlesRes.ok ? await articlesRes.json() : { articles: [] }
      const magazinesData = magazinesRes.ok ? await magazinesRes.json() : []
      const videosData = videosRes.ok ? await videosRes.json() : []
      const brandsData = brandsRes.ok ? await brandsRes.json() : []

      console.log("Raw data received:", {
        articles: articlesData,
        magazines: magazinesData,
        videos: videosData,
        brands: brandsData
      })

      setData({
        articles: Array.isArray(articlesData.articles) ? articlesData.articles : [],
        magazines: Array.isArray(magazinesData) ? magazinesData : [],
        videos: Array.isArray(videosData) ? videosData : [],
        brands: Array.isArray(brandsData) ? brandsData : []
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading test data...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Database Data Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Articles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Articles ({data.articles.length})</h2>
          {data.articles.length > 0 ? (
            <div className="space-y-4">
              {data.articles.map((article: any) => (
                <div key={article.id} className="border-b pb-2">
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-gray-600">Author: {article.author}</p>
                  <p className="text-sm text-gray-600">Status: {article.status}</p>
                  <p className="text-sm text-gray-600">Categories: {article.categories?.map((cat: any) => cat.name).join(', ') || 'None'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No articles found</p>
          )}
        </div>

        {/* Magazines */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Magazines ({data.magazines.length})</h2>
          {data.magazines.length > 0 ? (
            <div className="space-y-4">
              {data.magazines.map((magazine: any) => (
                <div key={magazine.id} className="border-b pb-2">
                  <h3 className="font-semibold">{magazine.title}</h3>
                  <p className="text-sm text-gray-600">Price: ₹{magazine.price}</p>
                  <p className="text-sm text-gray-600">Status: {magazine.status}</p>
                  <p className="text-sm text-gray-600">Issue Date: {magazine.issue_date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No magazines found</p>
          )}
        </div>

        {/* Videos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Videos ({data.videos.length})</h2>
          {data.videos.length > 0 ? (
            <div className="space-y-4">
              {data.videos.slice(0, 5).map((video: any) => (
                <div key={video.id} className="border-b pb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-600">Main Video: {video.is_main_video ? 'Yes' : 'No'}</p>
                  <p className="text-sm text-gray-600">Active: {video.is_active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No videos found</p>
          )}
        </div>

        {/* Brand Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Brand Images ({data.brands.length})</h2>
          {data.brands.length > 0 ? (
            <div className="space-y-4">
              {data.brands.slice(0, 5).map((brand: any) => (
                <div key={brand.id} className="border-b pb-2">
                  <h3 className="font-semibold">{brand.title}</h3>
                  <p className="text-sm text-gray-600">Order: {brand.display_order}</p>
                  <p className="text-sm text-gray-600">Active: {brand.is_active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No brand images found</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Summary:</h3>
        <p>Articles: {data.articles.length}</p>
        <p>Magazines: {data.magazines.length}</p>
        <p>Videos: {data.videos.length}</p>
        <p>Brand Images: {data.brands.length}</p>
      </div>
    </div>
  )
}