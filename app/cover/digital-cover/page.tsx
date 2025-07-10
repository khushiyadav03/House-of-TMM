"use client"

import Link from "next/link"

import CategoryLayout from "../../../components/CategoryLayout"
import Footer from "../../../components/Footer"

const digitalCoverArticles = [
  {
    id: 1,
    title: "Digital Fashion Week: Virtual Runway Revolution",
    slug: "digital-fashion-week-virtual-runway",
    image: "https://picsum.photos/400/300?random=11",
    author: "Alexandra Smith",
    date: "December 18, 2024",
    category: "Digital Cover",
    excerpt: "How virtual fashion shows are changing the industry landscape...",
  },
  {
    id: 2,
    title: "NFT Fashion: The Future of Digital Couture",
    slug: "nft-fashion-digital-couture",
    image: "https://picsum.photos/400/300?random=12",
    author: "Marcus Johnson",
    date: "December 16, 2024",
    category: "Digital Cover",
    excerpt: "Exploring the intersection of blockchain technology and fashion...",
  },
  {
    id: 3,
    title: "Virtual Influencers: The New Face of Fashion",
    slug: "virtual-influencers-fashion",
    image: "https://picsum.photos/400/300?random=13",
    author: "Sophie Chen",
    date: "December 14, 2024",
    category: "Digital Cover",
    excerpt: "How AI-generated personalities are reshaping fashion marketing...",
  },
  {
    id: 4,
    title: "Augmented Reality Shopping Experience",
    slug: "ar-shopping-experience",
    image: "https://picsum.photos/400/300?random=14",
    author: "Ryan Martinez",
    date: "December 12, 2024",
    category: "Digital Cover",
    excerpt: "The future of retail through augmented reality technology...",
  },
]

export default function DigitalCoverPage() {
  return (
    <CategoryLayout
      categoryName="Digital Cover"
      categorySlug="digital-cover"
      description="Explore the cutting-edge world of digital fashion and virtual experiences that are shaping the future of style."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {digitalCoverArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative h-[360px] w-full">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 text-sm font-semibold rounded">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
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
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
          </div>
        </div>
        <Footer />
      </div>
    </CategoryLayout>
  )
}
