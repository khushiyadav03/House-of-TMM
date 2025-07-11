"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const financeArticles = [
  {
    id: 1,
    title: "Investing for Beginners: A Simple Guide",
    slug: "investing-for-beginners-guide",
    image: "https://picsum.photos/270/405?random=101",
    author: "Financial Advisor",
    date: "December 27, 2024",
    category: "Finance",
    excerpt: "Start your investment journey with fundamental concepts and strategies.",
  },
  {
    id: 2,
    title: "Budgeting Basics: Managing Your Money Effectively",
    slug: "budgeting-basics-money-management",
    image: "https://picsum.photos/270/405?random=102",
    author: "Money Coach",
    date: "December 25, 2024",
    category: "Finance",
    excerpt: "Learn practical tips to create a budget and take control of your finances.",
  },
  {
    id: 3,
    title: "Real Estate in India: Trends and Opportunities",
    slug: "real-estate-india-trends-opportunities",
    image: "https://picsum.photos/270/405?random=103",
    author: "Property Analyst",
    date: "December 23, 2024",
    category: "Finance",
    excerpt: "Explore the dynamic Indian real estate market and its investment potential.",
  },
  {
    id: 4,
    title: "Retirement Planning: Securing Your Future",
    slug: "retirement-planning-securing-future",
    image: "https://picsum.photos/270/405?random=104",
    author: "Retirement Specialist",
    date: "December 21, 2024",
    category: "Finance",
    excerpt: "Essential steps to plan for a comfortable and secure retirement.",
  },
  {
    id: 5,
    title: "Understanding Cryptocurrency: A Beginner's Guide",
    slug: "understanding-cryptocurrency-guide",
    image: "https://picsum.photos/270/405?random=105",
    author: "Crypto Expert",
    date: "December 19, 2024",
    category: "Finance",
    excerpt: "Demystify the world of digital currencies and blockchain technology.",
  },
  {
    id: 6,
    title: "Tax Saving Strategies for Indians",
    slug: "tax-saving-strategies-indians",
    image: "https://picsum.photos/270/405?random=106",
    author: "Tax Consultant",
    date: "December 17, 2024",
    category: "Finance",
    excerpt: "Smart ways to reduce your tax burden and maximize your savings.",
  },
]

financeArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function FinancePage() {
  return (
    <CategoryLayout
      categoryName="Finance"
      categorySlug="finance"
      description="Smart financial advice, investment tips, and money management strategies for modern living."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financeArticles.map((article) => (
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
