"use client"

import CategoryLayout from "../../components/CategoryLayout"
import { useState } from "react"

const interviewArticles = [
  {
    id: 1,
    title: "In Conversation with Bollywood's Rising Star",
    slug: "bollywood-rising-star-interview",
    image: "https://picsum.photos/400/300?random=71",
    author: "Karan Johar",
    date: "December 22, 2024",
    category: "Celebrity Interview",
    excerpt: "An exclusive chat with the actor who's taking Bollywood by storm...",
  },
  {
    id: 2,
    title: "Tech Entrepreneur: Building India's Future",
    slug: "tech-entrepreneur-india-future",
    image: "https://picsum.photos/400/300?random=72",
    author: "Radhika Gupta",
    date: "December 20, 2024",
    category: "Business Interview",
    excerpt: "Meet the visionary entrepreneur revolutionizing India's tech landscape...",
  },
  {
    id: 3,
    title: "Fashion Designer's Journey to Success",
    slug: "fashion-designer-success-journey",
    image: "https://picsum.photos/400/300?random=73",
    author: "Manish Malhotra",
    date: "December 18, 2024",
    category: "Fashion Interview",
    excerpt: "The inspiring story of how passion became a global fashion empire...",
  },
  {
    id: 4,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 5,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 6,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 7,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 8,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 9,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 10,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 11,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 12,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 13,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
  {
    id: 14,
    title: "Sports Icon: Beyond the Game",
    slug: "sports-icon-beyond-game",
    image: "https://picsum.photos/400/300?random=74",
    author: "Virat Kohli",
    date: "December 16, 2024",
    category: "Sports Interview",
    excerpt: "A candid conversation about life, legacy, and what drives excellence...",
  },
]

interviewArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function InterviewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = interviewArticles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(interviewArticles.length / articlesPerPage)

  return (
    <CategoryLayout
      categoryName="Interviews"
      categorySlug="interviews"
      description="Exclusive conversations with the personalities shaping India's cultural, business, and creative landscape."
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative h-[360px] w-full">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </CategoryLayout>
  )
}
