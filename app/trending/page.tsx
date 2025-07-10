"use client"

import CategoryLayout from "../../components/CategoryLayout"
import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/Footer"
import { useState } from "react"

const trendingArticlesData = [
  {
    id: 1,
    title: "Viral Fashion Trends Taking Over Social Media",
    slug: "viral-fashion-trends-social-media",
    image: "https://picsum.photos/300/360?random=111",
    author: "Social Media Team",
    date: "December 22, 2024",
    category: "Trending",
    excerpt: "The fashion trends that are breaking the internet right now...",
  },
  {
    id: 2,
    title: "Celebrity Style Moments That Went Viral",
    slug: "celebrity-style-moments-viral",
    image: "https://picsum.photos/300/360?random=112",
    author: "Style Reporter",
    date: "December 20, 2024",
    category: "Trending",
    excerpt: "Red carpet looks and street style that captured everyone's attention...",
  },
  {
    id: 3,
    title: "Tech Gadgets Everyone's Talking About",
    slug: "tech-gadgets-everyone-talking",
    image: "https://picsum.photos/300/360?random=113",
    author: "Tech Reviewer",
    date: "December 18, 2024",
    category: "Trending",
    excerpt: "The latest tech innovations creating buzz in the market...",
  },
  {
    id: 4,
    title: "Wellness Trends Dominating 2025",
    slug: "wellness-trends-dominating-2025",
    image: "https://picsum.photos/300/360?random=114",
    author: "Wellness Expert",
    date: "December 16, 2024",
    category: "Trending",
    excerpt: "Health and wellness practices that are gaining massive popularity...",
  },
  {
    id: 5,
    title: "Food Trends: What's Hot in Culinary World",
    slug: "food-trends-hot-culinary-world",
    image: "https://picsum.photos/300/360?random=115",
    author: "Food Critic",
    date: "December 14, 2024",
    category: "Trending",
    excerpt: "Culinary innovations and food trends taking over restaurants...",
  },
  {
    id: 6,
    title: "Travel Destinations Going Viral",
    slug: "travel-destinations-going-viral",
    image: "https://picsum.photos/300/360?random=116",
    author: "Travel Blogger",
    date: "December 12, 2024",
    category: "Trending",
    excerpt: "Hidden gems and popular destinations trending on social media...",
  },
  {
    id: 7,
    title: "Beauty Trends: Makeup Looks Everyone's Copying",
    slug: "beauty-trends-makeup-looks-copying",
    image: "https://picsum.photos/300/360?random=117",
    author: "Beauty Guru",
    date: "December 10, 2024",
    category: "Trending",
    excerpt: "The beauty looks and techniques going viral on beauty platforms...",
  },
  {
    id: 8,
    title: "Lifestyle Hacks That Actually Work",
    slug: "lifestyle-hacks-actually-work",
    image: "https://picsum.photos/300/360?random=118",
    author: "Lifestyle Coach",
    date: "December 8, 2024",
    category: "Trending",
    excerpt: "Practical life hacks that are changing how people live...",
  },
  {
    id: 9,
    title: "Another Trend",
    slug: "another-trend",
    image: "https://picsum.photos/300/360?random=119",
    author: "Trend Setter",
    date: "December 6, 2024",
    category: "Trending",
    excerpt: "A new trend on the rise...",
  },
  {
    id: 10,
    title: "Yet Another Trend",
    slug: "yet-another-trend",
    image: "https://picsum.photos/300/360?random=120",
    author: "Trend Watcher",
    date: "December 4, 2024",
    category: "Trending",
    excerpt: "Keeping up with the latest...",
  },
  {
    id: 11,
    title: "One More Trend",
    slug: "one-more-trend",
    image: "https://picsum.photos/300/360?random=121",
    author: "Trend Analyst",
    date: "December 2, 2024",
    category: "Trending",
    excerpt: "Analyzing the trend landscape...",
  },
  {
    id: 12,
    title: "The Last Trend",
    slug: "the-last-trend",
    image: "https://picsum.photos/300/360?random=122",
    author: "Trend Forecaster",
    date: "November 30, 2024",
    category: "Trending",
    excerpt: "Forecasting future trends...",
  },
  {
    id: 13,
    title: "Extra Trend 1",
    slug: "extra-trend-1",
    image: "https://picsum.photos/300/360?random=123",
    author: "Trend Expert",
    date: "November 28, 2024",
    category: "Trending",
    excerpt: "More trends to explore...",
  },
  {
    id: 14,
    title: "Extra Trend 2",
    slug: "extra-trend-2",
    image: "https://picsum.photos/300/360?random=124",
    author: "Trend Enthusiast",
    date: "November 26, 2024",
    category: "Trending",
    excerpt: "Enjoying the trend wave...",
  },
]

export default function TrendingPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12
  const totalArticles = trendingArticlesData.length
  const totalPages = Math.ceil(totalArticles / articlesPerPage)

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const trendingArticles = trendingArticlesData.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <CategoryLayout
      categoryName="Trending"
      categorySlug="trending"
      description="Stay ahead of the curve with the latest trends in fashion, lifestyle, technology, and culture that everyone's talking about."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-[360px] w-full">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={300}
                    height={360}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-600 text-white px-3 py-1 text-sm font-semibold rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2 mt-12">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-2 text-gray-700 hover:text-gray-900"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </CategoryLayout>
  )
}
