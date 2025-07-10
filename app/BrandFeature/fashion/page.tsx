"use client"

import Image from "next/image"
import Link from "next/link"

import CategoryLayout from "../../../components/CategoryLayout"
import Footer from "../../../components/Footer"

const fashionArticles = [
  {
    id: 1,
    title: "Sustainable Fashion Brands Leading the Change",
    slug: "sustainable-fashion-brands-2025",
    image: "https://picsum.photos/400/300?random=31",
    author: "Maya Patel",
    date: "December 22, 2024",
    category: "Fashion",
    excerpt: "Discover the eco-conscious brands revolutionizing the fashion industry...",
  },
  {
    id: 2,
    title: "Indian Couture: Traditional Meets Modern",
    slug: "indian-couture-traditional-modern",
    image: "https://picsum.photos/400/300?random=32",
    author: "Arjun Sharma",
    date: "December 20, 2024",
    category: "Fashion",
    excerpt: "How Indian designers are blending heritage with contemporary aesthetics...",
  },
  {
    id: 3,
    title: "Fashion Week Highlights: Spring Summer 2025",
    slug: "fashion-week-spring-summer-2025",
    image: "https://picsum.photos/400/300?random=33",
    author: "Priya Singh",
    date: "December 18, 2024",
    category: "Fashion",
    excerpt: "The most stunning collections from the latest fashion week...",
  },
  {
    id: 4,
    title: "Luxury Accessories: Investment Pieces",
    slug: "luxury-accessories-investment",
    image: "https://picsum.photos/400/300?random=34",
    author: "Rohit Gupta",
    date: "December 16, 2024",
    category: "Fashion",
    excerpt: "Timeless luxury accessories that are worth the investment...",
  },
  {
    id: 5,
    title: "Street Fashion: Mumbai Style Chronicles",
    slug: "mumbai-street-fashion-chronicles",
    image: "https://picsum.photos/400/300?random=35",
    author: "Sneha Kapoor",
    date: "December 14, 2024",
    category: "Fashion",
    excerpt: "Capturing the vibrant street style culture of Mumbai...",
  },
  {
    id: 6,
    title: "Designer Spotlight: Emerging Talent",
    slug: "emerging-fashion-designers-india",
    image: "https://picsum.photos/400/300?random=36",
    author: "Vikram Mehta",
    date: "December 12, 2024",
    category: "Fashion",
    excerpt: "Meet the next generation of Indian fashion designers...",
  },
]

export default function FashionPage() {
  return (
    <CategoryLayout
      categoryName="Fashion"
      categorySlug="fashion"
      description="Explore the latest trends, designer spotlights, and fashion insights from India and around the world."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fashionArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-[360px] w-full">
                  <Image
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    width={300}
                    height={360}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded">
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
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-2 bg-black text-white rounded">1</button>
          <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
          <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
        </div>
      </div>
      <Footer />
    </CategoryLayout>
  )
}
