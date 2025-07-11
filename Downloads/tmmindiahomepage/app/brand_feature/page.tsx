"use client"

import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/Footer"
import { useState } from "react"

const brandFeatureArticles = [
  {
    id: 1,
    title: "Luxury Brand Collaborations in India",
    slug: "luxury-brand-collaborations-india",
    image: "https://picsum.photos/300/360?random=81",
    author: "Priya Sharma",
    date: "December 22, 2024",
    category: "Brand Feature",
    excerpt: "How international luxury brands are partnering with Indian designers...",
  },
  {
    id: 2,
    title: "Sustainable Fashion Brands Making Impact",
    slug: "sustainable-fashion-brands-impact",
    image: "https://picsum.photos/300/360?random=82",
    author: "Arjun Mehta",
    date: "December 20, 2024",
    category: "Brand Feature",
    excerpt: "Eco-conscious brands leading the sustainability revolution...",
  },
  {
    id: 3,
    title: "Tech Startups Disrupting Traditional Industries",
    slug: "tech-startups-disrupting-industries",
    image: "https://picsum.photos/300/360?random=83",
    author: "Kavya Nair",
    date: "December 18, 2024",
    category: "Brand Feature",
    excerpt: "Innovative startups changing the game across sectors...",
  },
  {
    id: 4,
    title: "Automotive Brands: Electric Future",
    slug: "automotive-brands-electric-future",
    image: "https://picsum.photos/300/360?random=84",
    author: "Rajesh Kumar",
    date: "December 16, 2024",
    category: "Brand Feature",
    excerpt: "How car manufacturers are embracing electric mobility...",
  },
  {
    id: 5,
    title: "Beauty Brands: Natural Revolution",
    slug: "beauty-brands-natural-revolution",
    image: "https://picsum.photos/300/360?random=85",
    author: "Sneha Kapoor",
    date: "December 14, 2024",
    category: "Brand Feature",
    excerpt: "The shift towards natural and organic beauty products...",
  },
  {
    id: 6,
    title: "Food Brands: Health-Conscious Choices",
    slug: "food-brands-health-conscious",
    image: "https://picsum.photos/300/360?random=86",
    author: "Chef Meera",
    date: "December 12, 2024",
    category: "Brand Feature",
    excerpt: "Brands leading the healthy food movement in India...",
  },
  {
    id: 7,
    title: "Fashion Tech: Wearable Innovation",
    slug: "fashion-tech-wearable-innovation",
    image: "https://picsum.photos/300/360?random=87",
    author: "Vikram Singh",
    date: "December 10, 2024",
    category: "Brand Feature",
    excerpt: "Where fashion meets technology in wearable devices...",
  },
  {
    id: 8,
    title: "Lifestyle Brands: Millennial Appeal",
    slug: "lifestyle-brands-millennial-appeal",
    image: "https://picsum.photos/300/360?random=88",
    author: "Anita Desai",
    date: "December 8, 2024",
    category: "Brand Feature",
    excerpt: "How brands are capturing the millennial market...",
  },
  {
    id: 9,
    title: "Another Brand Feature",
    slug: "another-brand-feature",
    image: "https://picsum.photos/300/360?random=89",
    author: "John Doe",
    date: "December 6, 2024",
    category: "Brand Feature",
    excerpt: "A new brand making waves...",
  },
  {
    id: 10,
    title: "Yet Another Brand",
    slug: "yet-another-brand",
    image: "https://picsum.photos/300/360?random=90",
    author: "Jane Smith",
    date: "December 4, 2024",
    category: "Brand Feature",
    excerpt: "Exploring innovative brand strategies...",
  },
  {
    id: 11,
    title: "Brand Innovation",
    slug: "brand-innovation",
    image: "https://picsum.photos/300/360?random=91",
    author: "David Lee",
    date: "December 2, 2024",
    category: "Brand Feature",
    excerpt: "The future of brand innovation...",
  },
  {
    id: 12,
    title: "Future Brands",
    slug: "future-brands",
    image: "https://picsum.photos/300/360?random=92",
    author: "Emily White",
    date: "November 30, 2024",
    category: "Brand Feature",
    excerpt: "Brands of the future...",
  },
  {
    id: 13,
    title: "Luxury Redefined",
    slug: "luxury-redefined",
    image: "https://picsum.photos/300/360?random=93",
    author: "Chris Brown",
    date: "November 28, 2024",
    category: "Brand Feature",
    excerpt: "Redefining luxury...",
  },
  {
    id: 14,
    title: "Tech Brands Evolving",
    slug: "tech-brands-evolving",
    image: "https://picsum.photos/300/360?random=94",
    author: "Ashley Green",
    date: "November 26, 2024",
    category: "Brand Feature",
    excerpt: "How tech brands are evolving...",
  },
  {
    id: 15,
    title: "Sustainable Future",
    slug: "sustainable-future",
    image: "https://picsum.photos/300/360?random=95",
    author: "Michael Gray",
    date: "November 24, 2024",
    category: "Brand Feature",
    excerpt: "A sustainable future...",
  },
  {
    id: 16,
    title: "Innovation Unleashed",
    slug: "innovation-unleashed",
    image: "https://picsum.photos/300/360?random=96",
    author: "Jessica Black",
    date: "November 22, 2024",
    category: "Brand Feature",
    excerpt: "Unleashing innovation...",
  },
]

export default function BrandFeaturePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = brandFeatureArticles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(brandFeatureArticles.length / articlesPerPage)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Brand Feature</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the brands that are shaping industries, driving innovation, and creating impact across fashion,
            technology, and lifestyle.
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
                    <span className="bg-purple-600 text-white px-3 py-1 text-sm font-semibold rounded">
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded ${
                currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
