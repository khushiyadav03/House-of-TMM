"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const otherSportsArticles = [
  {
    id: 1,
    title: "Badminton: India's Shuttlecock Superstars",
    slug: "badminton-india-superstars",
    image: "https://picsum.photos/270/405?random=141",
    author: "Sports Analyst",
    date: "December 30, 2024",
    category: "Other Sports",
    excerpt: "Celebrating the rise of Indian badminton players on the global stage.",
  },
  {
    id: 2,
    title: "Hockey: The Resurgence of India's National Sport",
    slug: "hockey-india-national-sport",
    image: "https://picsum.photos/270/405?random=142",
    author: "Sports Historian",
    date: "December 28, 2024",
    category: "Other Sports",
    excerpt: "Tracing the journey of Indian hockey back to its glory days.",
  },
  {
    id: 3,
    title: "Tennis: Indian Aces on the Court",
    slug: "tennis-indian-aces-court",
    image: "https://picsum.photos/270/405?random=143",
    author: "Tennis Correspondent",
    date: "December 26, 2024",
    category: "Other Sports",
    excerpt: "Spotlight on Indian tennis players making their mark in international tournaments.",
  },
  {
    id: 4,
    title: "Kabaddi: India's Indigenous Sport Goes Global",
    slug: "kabaddi-indigenous-sport-global",
    image: "https://picsum.photos/270/405?random=144",
    author: "Sports Feature Writer",
    date: "December 24, 2024",
    category: "Other Sports",
    excerpt: "The journey of Kabaddi from rural India to an international phenomenon.",
  },
  {
    id: 5,
    title: "Emerging Sports in India: Beyond Cricket",
    slug: "emerging-sports-india-beyond-cricket",
    image: "https://picsum.photos/270/405?random=145",
    author: "Sports Enthusiast",
    date: "December 22, 2024",
    category: "Other Sports",
    excerpt: "Exploring the growing popularity of non-cricket sports like basketball, football, and more.",
  },
]

otherSportsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function OtherSportsPage() {
  return (
    <CategoryLayout
      categoryName="Other Sports"
      categorySlug="other-sports"
      description="Coverage of various sports including tennis, badminton, hockey, and emerging sports in India."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSportsArticles.map((article) => (
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
