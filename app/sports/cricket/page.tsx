"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const cricketArticles = [
  {
    id: 1,
    title: "India's Dominance in Test Cricket: A Deep Dive",
    slug: "india-dominance-test-cricket",
    image: "https://picsum.photos/270/405?random=121",
    author: "Cricket Analyst",
    date: "December 28, 2024",
    category: "Cricket",
    excerpt: "Analyzing the factors behind India's consistent success in the longest format.",
  },
  {
    id: 2,
    title: "IPL 2025: Team Strategies and Player Auctions",
    slug: "ipl-2025-team-strategies-auctions",
    image: "https://picsum.photos/270/405?random=122",
    author: "Sports Journalist",
    date: "December 26, 2024",
    category: "Cricket",
    excerpt: "A look at how teams are preparing for the upcoming Indian Premier League season.",
  },
  {
    id: 3,
    title: "Rise of Women's Cricket in India",
    slug: "rise-of-womens-cricket-india",
    image: "https://picsum.photos/270/405?random=123",
    author: "Sports Reporter",
    date: "December 24, 2024",
    category: "Cricket",
    excerpt: "Celebrating the growing popularity and achievements of Indian women cricketers.",
  },
  {
    id: 4,
    title: "Young Talents to Watch in Indian Cricket",
    slug: "young-talents-indian-cricket",
    image: "https://picsum.photos/270/405?random=124",
    author: "Talent Scout",
    date: "December 22, 2024",
    category: "Cricket",
    excerpt: "Spotlight on the emerging stars who are set to make a big impact.",
  },
  {
    id: 5,
    title: "The Evolution of T20 Cricket",
    slug: "evolution-of-t20-cricket",
    image: "https://picsum.photos/270/405?random=125",
    author: "Cricket Historian",
    date: "December 20, 2024",
    category: "Cricket",
    excerpt: "How the shortest format of the game has transformed cricket globally.",
  },
  {
    id: 6,
    title: "Fan Culture in Indian Cricket",
    slug: "fan-culture-indian-cricket",
    image: "https://picsum.photos/270/405?random=126",
    author: "Social Commentator",
    date: "December 18, 2024",
    category: "Cricket",
    excerpt: "Exploring the passion and devotion of cricket fans across India.",
  },
]

cricketArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function CricketPage() {
  return (
    <CategoryLayout
      categoryName="Cricket"
      categorySlug="cricket"
      description="Follow the latest cricket news, match updates, and player insights from India and around the world."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cricketArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative h-[405px] w-[270px] mx-auto">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={270}
                      height={405}
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
                </article>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-black text-white">1</button>
            <button className="px-3 py-2 text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
          </div>
        </div>
      </div>
    </CategoryLayout>
  )
}
