"use client"

import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/Footer"
import { useState } from "react"

const lifestyleArticles = [
  {
    id: 1,
    title: "Wellness Retreats: Mind, Body, Soul",
    slug: "wellness-retreats-mind-body-soul",
    image: "https://picsum.photos/300/360?random=91",
    author: "Dr. Priya Wellness",
    date: "December 22, 2024",
    category: "Health & Wellness",
    excerpt: "Discover transformative wellness retreats across India...",
  },
  {
    id: 2,
    title: "Gourmet Food Experiences in Mumbai",
    slug: "gourmet-food-experiences-mumbai",
    image: "https://picsum.photos/300/360?random=92",
    author: "Chef Arjun",
    date: "December 20, 2024",
    category: "Food & Drinks",
    excerpt: "The finest dining experiences in the city of dreams...",
  },
  {
    id: 3,
    title: "Fitness Trends: Home Workout Revolution",
    slug: "fitness-trends-home-workout",
    image: "https://picsum.photos/300/360?random=93",
    author: "Fitness Guru Raj",
    date: "December 18, 2024",
    category: "Fitness & Selfcare",
    excerpt: "How home fitness is changing the wellness landscape...",
  },
  {
    id: 4,
    title: "Travel Diaries: Hidden Gems of Rajasthan",
    slug: "travel-diaries-rajasthan-gems",
    image: "https://picsum.photos/300/360?random=94",
    author: "Wanderer Kavya",
    date: "December 16, 2024",
    category: "Travel",
    excerpt: "Unexplored destinations in the land of kings...",
  },
  {
    id: 5,
    title: "Financial Planning for Young Professionals",
    slug: "financial-planning-young-professionals",
    image: "https://picsum.photos/300/360?random=95",
    author: "Finance Expert Rohit",
    date: "December 14, 2024",
    category: "Finance",
    excerpt: "Smart money management strategies for millennials...",
  },
  {
    id: 6,
    title: "Mindful Living: Daily Meditation Practices",
    slug: "mindful-living-meditation-practices",
    image: "https://picsum.photos/300/360?random=96",
    author: "Meditation Master",
    date: "December 12, 2024",
    category: "Health & Wellness",
    excerpt: "Incorporating mindfulness into your daily routine...",
  },
  {
    id: 7,
    title: "Craft Cocktails: Indian Spice Infusions",
    slug: "craft-cocktails-indian-spices",
    image: "https://picsum.photos/300/360?random=97",
    author: "Mixologist Sam",
    date: "December 10, 2024",
    category: "Food & Drinks",
    excerpt: "Innovative cocktails with traditional Indian flavors...",
  },
  {
    id: 8,
    title: "Adventure Travel: Himalayan Expeditions",
    slug: "adventure-travel-himalayan-expeditions",
    image: "https://picsum.photos/300/360?random=98",
    author: "Adventure Seeker",
    date: "December 8, 2024",
    category: "Travel",
    excerpt: "Thrilling adventures in the world's highest mountains...",
  },
  {
    id: 9,
    title: "Sustainable Living: Eco-Friendly Homes",
    slug: "sustainable-living-eco-friendly-homes",
    image: "https://picsum.photos/300/360?random=99",
    author: "Eco-Architect",
    date: "December 6, 2024",
    category: "Environment",
    excerpt: "Designing homes that are kind to the planet...",
  },
  {
    id: 10,
    title: "Tech Gadgets for a Smarter Lifestyle",
    slug: "tech-gadgets-smarter-lifestyle",
    image: "https://picsum.photos/300/360?random=100",
    author: "Tech Enthusiast",
    date: "December 4, 2024",
    category: "Technology",
    excerpt: "Latest innovations to enhance your daily life...",
  },
  {
    id: 11,
    title: "DIY Home Decor: Creative Ideas",
    slug: "diy-home-decor-creative-ideas",
    image: "https://picsum.photos/300/360?random=101",
    author: "Home Stylist",
    date: "December 2, 2024",
    category: "Home & Decor",
    excerpt: "Transform your living space with these easy projects...",
  },
  {
    id: 12,
    title: "The Art of Slow Travel: Experiencing Culture",
    slug: "art-of-slow-travel-experiencing-culture",
    image: "https://picsum.photos/300/360?random=102",
    author: "Travel Philosopher",
    date: "November 30, 2024",
    category: "Travel",
    excerpt: "Immerse yourself in local traditions and customs...",
  },
  {
    id: 13,
    title: "Investing in Art: A Beginner's Guide",
    slug: "investing-in-art-beginners-guide",
    image: "https://picsum.photos/300/360?random=103",
    author: "Art Investor",
    date: "November 28, 2024",
    category: "Finance",
    excerpt: "Understanding the art market and making smart investments...",
  },
  {
    id: 14,
    title: "Effective Time Management Techniques",
    slug: "effective-time-management-techniques",
    image: "https://picsum.photos/300/360?random=104",
    author: "Productivity Coach",
    date: "November 26, 2024",
    category: "Self-Improvement",
    excerpt: "Strategies to maximize your productivity and achieve goals...",
  },
  {
    id: 15,
    title: "The Benefits of Outdoor Meditation",
    slug: "benefits-outdoor-meditation",
    image: "https://picsum.photos/300/360?random=105",
    author: "Mindfulness Expert",
    date: "November 24, 2024",
    category: "Health & Wellness",
    excerpt: "Connecting with nature for enhanced mental clarity...",
  },
  {
    id: 16,
    title: "Exotic Spices: Culinary Adventures",
    slug: "exotic-spices-culinary-adventures",
    image: "https://picsum.photos/300/360?random=106",
    author: "Food Explorer",
    date: "November 22, 2024",
    category: "Food & Drinks",
    excerpt: "Exploring the world through unique and flavorful spices...",
  },
]

export default function LifestylePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = lifestyleArticles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(lifestyleArticles.length / articlesPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lifestyle</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the art of living well through wellness, travel, food, fitness, and financial wisdom that enriches
            your daily life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentArticles.map((article) => (
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
                    <span className="bg-green-600 text-white px-3 py-1 text-sm font-semibold rounded">
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
    </div>
  )
}
