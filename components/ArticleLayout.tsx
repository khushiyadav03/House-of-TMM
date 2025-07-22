"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
// Removed Header and Footer imports as they are now in app/layout.tsx

// Defining interfaces for props
interface Article {
  id: string
  title: string
  author: string
  date: string
  imageUrl: string
  content: string
  relatedArticles: { id: string; title: string; imageUrl: string; author: string; date: string }[]
}

interface ArticleLayoutProps {
  article: Article;
  children: React.ReactNode; // Allow children to be passed
}

/**
 * Renders the full page layout for a single article.
 * @param {ArticleLayoutProps} props - The component props.
 * @param {Article} props.article - The article data to be displayed.
 * @param {React.ReactNode} props.children - The main content of the article (e.g., the renderer).
 */
export default function ArticleLayout({ article, children }: ArticleLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = article.title

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank",
        )
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
        break
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Removed showHeader && <Header /> */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>By {article.author}</span>
              <span className="mx-2">|</span>
              <span>Published on {new Date(article.date).toLocaleDateString()}</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="md:col-span-11">
            {children} {/* Render the children here */}
          </div>

          {/* Share Bar (always at the end, centered) */}
          <div className="mt-12 pt-8 border-t flex flex-col items-center">
            <h3 className="text-center text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => handleShare("facebook")}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Share on Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Share on Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M 11 4 C 7.134 4 4 7.134 4 11 L 4 39 C 4 42.866 7.134 46 11 46 L 39 46 C 42.866 46 46 42.866 46 39 L 46 11 C 46 7.134 42.866 4 39 4 L 11 4 z M 13.085938 13 L 21.023438 13 L 26.660156 21.009766 L 33.5 13 L 36 13 L 27.789062 22.613281 L 37.914062 37 L 29.978516 37 L 23.4375 27.707031 L 15.5 37 L 13 37 L 22.308594 26.103516 L 13.085938 13 z M 16.914062 15 L 31.021484 35 L 34.085938 35 L 19.978516 15 L 16.914062 15 z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Share on LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 50 50"
                >
                  <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                </svg>
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="text-gray-600 hover:text-blue-600"
                aria-label="Copy link"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=toMU85oCiTAB&format=png&color=000000"
                  alt=""
                  width="24"
                  height="24"
                />
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {article.relatedArticles.map((related) => (
                  <Link key={related.id} href={`/articles/${related.id}`}>
                    <div className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-[200px] w-full">
                        <Image
                          src={related.imageUrl || "/placeholder.svg"}
                          alt={related.title}
                          width={300}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{related.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{related.author}</span>
                          <span>{related.date}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      {/* Removed Footer */}
    </div>
  )
}
