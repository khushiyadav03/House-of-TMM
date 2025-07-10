"use client"

import CategoryLayout from "../../components/CategoryLayout"
import Image from "next/image"
import Link from "next/link"
import Footer from "../../components/Footer"
import { useState } from "react"

const allCoverArticles = [
  {
    id: 1,
    title: "Digital Fashion Revolution: The New Era of Style",
    slug: "digital-fashion-revolution",
    image: "https://picsum.photos/400/300?random=1",
    author: "Sarah Johnson",
    date: "December 15, 2024",
    category: "Digital Cover",
    excerpt: "Exploring how digital technology is transforming the fashion industry...",
  },
  {
    id: 2,
    title: "Behind the Lens: Editorial Photography Masterclass",
    slug: "editorial-photography-masterclass",
    image: "https://picsum.photos/400/300?random=2",
    author: "Michael Chen",
    date: "December 12, 2024",
    category: "Editorial Shoot",
    excerpt: "A deep dive into the art of editorial photography and storytelling...",
  },
  {
    id: 3,
    title: "Cover Story: Rising Stars of 2025",
    slug: "rising-stars-2025",
    image: "https://picsum.photos/400/300?random=3",
    author: "Emma Wilson",
    date: "December 10, 2024",
    category: "Cover Story",
    excerpt: "Meet the personalities who will define the next year...",
  },
  {
    id: 4,
    title: "Fashion Forward: Sustainable Couture",
    slug: "sustainable-couture",
    image: "https://picsum.photos/400/300?random=4",
    author: "David Martinez",
    date: "December 8, 2024",
    category: "Digital Cover",
    excerpt: "How sustainable practices are reshaping high fashion...",
  },
  {
    id: 5,
    title: "The Art of Visual Storytelling",
    slug: "visual-storytelling-art",
    image: "https://picsum.photos/400/300?random=5",
    author: "Lisa Thompson",
    date: "December 5, 2024",
    category: "Editorial Shoot",
    excerpt: "Creating compelling narratives through visual media...",
  },
  {
    id: 6,
    title: "Iconic Covers That Changed Fashion",
    slug: "iconic-covers-fashion",
    image: "https://picsum.photos/400/300?random=6",
    author: "James Rodriguez",
    date: "December 3, 2024",
    category: "Cover Story",
    excerpt: "A retrospective look at magazine covers that made history...",
  },
  {
    id: 7,
    title: "Fashion Photography: Art Meets Commerce",
    slug: "fashion-photography-art-commerce",
    image: "https://picsum.photos/400/300?random=7",
    author: "Photo Director",
    date: "December 1, 2024",
    category: "Cover Story",
    excerpt: "The intersection of artistic vision and commercial success...",
  },
  {
    id: 8,
    title: "Digital Transformation in Fashion Media",
    slug: "digital-transformation-fashion-media",
    image: "https://picsum.photos/400/300?random=8",
    author: "Digital Editor",
    date: "November 28, 2024",
    category: "Digital Cover",
    excerpt: "How digital platforms are reshaping fashion journalism...",
  },
  {
    id: 9,
    title: "Sustainable Fashion Editorial",
    slug: "sustainable-fashion-editorial",
    image: "https://picsum.photos/400/300?random=9",
    author: "Eco Fashion Editor",
    date: "November 25, 2024",
    category: "Editorial Shoot",
    excerpt: "Creating beautiful fashion stories with environmental consciousness...",
  },
  {
    id: 10,
    title: "Celebrity Cover Stories That Made Headlines",
    slug: "celebrity-cover-stories-headlines",
    image: "https://picsum.photos/400/300?random=10",
    author: "Celebrity Editor",
    date: "November 22, 2024",
    category: "Cover Story",
    excerpt: "The most talked-about celebrity covers of the year...",
  },
  {
    id: 11,
    title: "Virtual Fashion Shows: The New Normal",
    slug: "virtual-fashion-shows-new-normal",
    image: "https://picsum.photos/400/300?random=11",
    author: "Fashion Tech Writer",
    date: "November 20, 2024",
    category: "Digital Cover",
    excerpt: "How virtual presentations are changing fashion week...",
  },
  {
    id: 12,
    title: "Behind the Scenes: Magazine Production",
    slug: "behind-scenes-magazine-production",
    image: "https://picsum.photos/400/300?random=12",
    author: "Production Team",
    date: "November 18, 2024",
    category: "Editorial Shoot",
    excerpt: "The intricate process of bringing a magazine to life...",
  },
  // Page 2 articles
  {
    id: 13,
    title: "Fashion Week Backstage Stories",
    slug: "fashion-week-backstage-stories",
    image: "https://picsum.photos/400/300?random=13",
    author: "Backstage Reporter",
    date: "November 15, 2024",
    category: "Editorial Shoot",
    excerpt: "Exclusive access to the chaos and creativity behind the runway...",
  },
  {
    id: 14,
    title: "Digital Fashion: NFTs and Virtual Clothing",
    slug: "digital-fashion-nfts-virtual-clothing",
    image: "https://picsum.photos/400/300?random=14",
    author: "Tech Fashion Writer",
    date: "November 12, 2024",
    category: "Digital Cover",
    excerpt: "The future of fashion in the metaverse and blockchain...",
  },
  {
    id: 15,
    title: "Cover Model Spotlight: New Faces",
    slug: "cover-model-spotlight-new-faces",
    image: "https://picsum.photos/400/300?random=15",
    author: "Model Scout",
    date: "November 10, 2024",
    category: "Cover Story",
    excerpt: "Introducing the fresh faces gracing magazine covers...",
  },
]

export default function CoverPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12
  const totalPages = Math.ceil(allCoverArticles.length / articlesPerPage)

  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = allCoverArticles.slice(startIndex, startIndex + articlesPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <CategoryLayout
      categoryName="Cover"
      categorySlug="cover"
      description="Discover our featured stories, digital covers, and editorial shoots that define contemporary culture and style."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                      <span className="bg-black text-white px-3 py-1 text-sm font-semibold">{article.category}</span>
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

          {/* Functional Pagination */}
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
                className={`px-3 py-2 ${
                  currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </CategoryLayout>
  )
}
