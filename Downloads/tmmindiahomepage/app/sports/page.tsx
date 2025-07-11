"use client"

import CategoryLayout from "../../components/CategoryLayout"
import Footer from "../../components/Footer"
import { useState } from "react"

const sportsArticles = [
  {
    id: 1,
    title: "Cricket World Cup 2025: India's Championship Journey",
    slug: "cricket-world-cup-2025-india",
    image: "https://picsum.photos/400/300?random=61",
    author: "Rohit Sharma",
    date: "December 22, 2024",
    category: "Cricket",
    excerpt: "Following Team India's incredible journey to the Cricket World Cup...",
  },
  {
    id: 2,
    title: "Golf in India: The Rising Sport",
    slug: "golf-india-rising-sport",
    image: "https://picsum.photos/400/300?random=62",
    author: "Anirban Lahiri",
    date: "December 20, 2024",
    category: "Golf",
    excerpt: "How golf is gaining popularity among Indian sports enthusiasts...",
  },
  {
    id: 3,
    title: "Olympic Dreams: Indian Athletes Preparation",
    slug: "olympic-dreams-indian-athletes",
    image: "https://picsum.photos/400/300?random=63",
    author: "Mary Kom",
    date: "December 18, 2024",
    category: "Olympics",
    excerpt: "Behind the scenes with India's Olympic hopefuls and their training...",
  },
  {
    id: 4,
    title: "Football Fever: ISL Season Highlights",
    slug: "football-isl-season-highlights",
    image: "https://picsum.photos/400/300?random=64",
    author: "Sunil Chhetri",
    date: "December 16, 2024",
    category: "Football",
    excerpt: "The most exciting moments from the Indian Super League season...",
  },
  {
    id: 5,
    title: "Hockey India League: New Talents Emerge",
    slug: "hockey-india-league-new-talents",
    image: "https://picsum.photos/400/300?random=65",
    author: "PR Sreejesh",
    date: "December 14, 2024",
    category: "Hockey",
    excerpt: "Discover the rising stars of the Hockey India League...",
  },
  {
    id: 6,
    title: "Badminton Buzz: India Open Highlights",
    slug: "badminton-buzz-india-open",
    image: "https://picsum.photos/400/300?random=66",
    author: "P.V. Sindhu",
    date: "December 12, 2024",
    category: "Badminton",
    excerpt: "Relive the thrilling moments from the India Open badminton tournament...",
  },
  {
    id: 7,
    title: "Tennis Titans: Indian Players on the Global Stage",
    slug: "tennis-titans-indian-players",
    image: "https://picsum.photos/400/300?random=67",
    author: "Sania Mirza",
    date: "December 10, 2024",
    category: "Tennis",
    excerpt: "A look at the achievements of Indian tennis players worldwide...",
  },
  {
    id: 8,
    title: "Kabaddi Kings: Pro Kabaddi League Season Review",
    slug: "kabaddi-kings-pro-kabaddi-league",
    image: "https://picsum.photos/400/300?random=68",
    author: "Anup Kumar",
    date: "December 8, 2024",
    category: "Kabaddi",
    excerpt: "The standout performances and memorable matches from the Pro Kabaddi League...",
  },
  {
    id: 9,
    title: "Chess Champions: India's Young Grandmasters",
    slug: "chess-champions-india-grandmasters",
    image: "https://picsum.photos/400/300?random=69",
    author: "Viswanathan Anand",
    date: "December 6, 2024",
    category: "Chess",
    excerpt: "Meet the talented young chess grandmasters making waves in India...",
  },
  {
    id: 10,
    title: "Wrestling Warriors: Indian Wrestlers at International Events",
    slug: "wrestling-warriors-indian-wrestlers",
    image: "https://picsum.photos/400/300?random=70",
    author: "Yogeshwar Dutt",
    date: "December 4, 2024",
    category: "Wrestling",
    excerpt: "Celebrating the achievements of Indian wrestlers in international competitions...",
  },
  {
    id: 11,
    title: "Boxing Bonanza: India's Boxing Scene",
    slug: "boxing-bonanza-india-boxing",
    image: "https://picsum.photos/400/300?random=71",
    author: "Vijender Singh",
    date: "December 2, 2024",
    category: "Boxing",
    excerpt: "An inside look at the vibrant boxing scene in India...",
  },
  {
    id: 12,
    title: "Shooting Stars: Indian Shooters Aim for Gold",
    slug: "shooting-stars-indian-shooters",
    image: "https://picsum.photos/400/300?random=72",
    author: "Abhinav Bindra",
    date: "November 30, 2024",
    category: "Shooting",
    excerpt: "The journey of Indian shooters as they prepare for major tournaments...",
  },
  {
    id: 13,
    title: "Archery Aces: India's Promising Archers",
    slug: "archery-aces-indian-archers",
    image: "https://picsum.photos/400/300?random=73",
    author: "Deepika Kumari",
    date: "November 28, 2024",
    category: "Archery",
    excerpt: "Highlighting the skills and dedication of India's top archers...",
  },
  {
    id: 14,
    title: "Weightlifting Wonders: Indian Weightlifters Shine",
    slug: "weightlifting-wonders-indian-weightlifters",
    image: "https://picsum.photos/400/300?random=74",
    author: "Mirabai Chanu",
    date: "November 26, 2024",
    category: "Weightlifting",
    excerpt: "Celebrating the success of Indian weightlifters on the world stage...",
  },
]

export default function SportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 12

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = sportsArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  const totalPages = Math.ceil(sportsArticles.length / articlesPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <CategoryLayout
      categoryName="Sports"
      categorySlug="sports"
      description="Stay updated with the latest in Indian and international sports, from cricket to golf and beyond."
    >
      <div className="min-h-screen bg-white">
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
              </div>
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
                className={`px-3 py-2 ${
                  currentPage === page ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                } rounded`}
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
      </div>
      <Footer />
    </CategoryLayout>
  )
}
