"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Article {
  id: number
  title: string
  slug: string
  image_url: string
  author: string
  publish_date: string
  excerpt: string
  category: string
  categories?: { id: number; name: string; slug: string }[]
}

interface Category {
  id: number
  name: string
  slug: string
  description: string
}

interface CategoryClientPageProps {
  categorySlug: string
}

export default function CategoryClientPage({ categorySlug }: CategoryClientPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchCategoryAndArticles()
  }, [categorySlug])

  // Set document title for SEO
  useEffect(() => {
    if (category?.name) {
      document.title = `${category.name} - TMM India`
    } else {
      const title = categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
      document.title = `${title} - TMM India`
    }
  }, [category, categorySlug])

  const fetchCategoryAndArticles = async () => {
    try {
      setLoading(true)
      
      // Check content type based on category
      const isCoverPhotoCategory = categorySlug === 'digital-cover' || categorySlug === 'editorial-shoot'
      const isPepTalkCategory = categorySlug === 'pep-talk'
      
      // Fetch category info and content in parallel
      const [categoryResponse, contentResponse] = await Promise.all([
        fetch(`/api/categories`),
        isCoverPhotoCategory 
          ? fetch(`/api/cover-photos/by-category/${categorySlug}?page=1&limit=12`)
          : isPepTalkCategory
          ? fetch(`/api/pep-talk?page=1&limit=12`)
          : fetch(`/api/articles/by-category/${categorySlug}?page=1&limit=12`)
      ])

      // Get category info
      const categoriesData = await categoryResponse.json()
      const foundCategory = categoriesData.find((cat: Category) => cat.slug === categorySlug)
      
      // Get content (articles or cover photos)
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setArticles(contentData.articles || [])
        setHasMore(contentData.hasMore || false)
        // If we got category info from the content API, use it
        if (contentData.category && !foundCategory) {
          setCategory(contentData.category)
        } else {
          setCategory(foundCategory || null)
        }
      } else {
        console.error('Failed to fetch content:', await contentResponse.text())
        setArticles([])
        setHasMore(false)
        setCategory(foundCategory || null)
      }
    } catch (error) {
      console.error('Failed to fetch category data:', error)
      setArticles([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore) return

    try {
      setLoadingMore(true)
      const nextPage = page + 1
      
      // Check content type based on category
      const isCoverPhotoCategory = categorySlug === 'digital-cover' || categorySlug === 'editorial-shoot'
      const isPepTalkCategory = categorySlug === 'pep-talk'
      
      const response = await fetch(
        isCoverPhotoCategory 
          ? `/api/cover-photos/by-category/${categorySlug}?page=${nextPage}&limit=12`
          : isPepTalkCategory
          ? `/api/pep-talk?page=${nextPage}&limit=12`
          : `/api/articles/by-category/${categorySlug}?page=${nextPage}&limit=12`
      )
      
      if (response.ok) {
        const data = await response.json()
        setArticles(prev => [...prev, ...(data.articles || [])])
        setHasMore(data.hasMore || false)
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Failed to load more articles:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  const categoryTitle = category?.name || categorySlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {categoryTitle}
          </h1>
          {category?.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {category.description}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h2>
            <p className="text-gray-600 mb-4">
              We don't have any articles in the {categoryTitle} category yet. Check back soon!
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Category slug: {categorySlug} | Category ID: {category?.id || 'Not found'}
            </p>
            <div className="space-x-4">
              <Link 
                href="/" 
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={() => window.open('/api/debug/articles', '_blank')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Debug Info
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article key={article.id} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* For PEP Talk videos, link to video URL; for others, link to article */}
                  {categorySlug === 'pep-talk' && (article as any).video_url ? (
                    <a 
                      href={(article as any).video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src={article.image_url || "/placeholder.svg?height=256&width=400"}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Play button overlay for videos */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{article.author}</span>
                          <span className="text-red-600 font-semibold">▶ Watch Video</span>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative w-full h-64">
                        <Image
                          src={article.image_url || "/placeholder.svg?height=256&width=400"}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{article.author}</span>
                          <span>{new Date(article.publish_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={loadMoreArticles}
                  disabled={loadingMore}
                  className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Articles'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}