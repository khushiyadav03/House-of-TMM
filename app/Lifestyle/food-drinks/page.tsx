"use client"

import Link from "next/link"
import Image from "next/image"

import CategoryLayout from "../../../components/CategoryLayout"

const foodDrinksArticles = [
  {
    id: 1,
    title: "Mumbai's Hidden Culinary Gems",
    slug: "mumbai-hidden-culinary-gems",
    image: "https://picsum.photos/400/300?random=51",
    author: "Chef Meera Tandon",
    date: "December 22, 2024",
    category: "Food & Drinks",
    excerpt: "Discover the secret restaurants and street food spots that locals love...",
  },
  {
    id: 2,
    title: "Craft Cocktails: Indian Flavors Revolution",
    slug: "craft-cocktails-indian-flavors",
    image: "https://picsum.photos/400/300?random=52",
    author: "Arjun Mixologist",
    date: "December 20, 2024",
    category: "Food & Drinks",
    excerpt: "How Indian spices and ingredients are transforming the cocktail scene...",
  },
  {
    id: 3,
    title: "Farm to Table: Sustainable Dining",
    slug: "farm-to-table-sustainable-dining",
    image: "https://picsum.photos/400/300?random=53",
    author: "Priya Organic",
    date: "December 18, 2024",
    category: "Food & Drinks",
    excerpt: "Restaurants leading the sustainable and organic food movement...",
  },
  {
    id: 4,
    title: "Regional Indian Cuisines: A Culinary Journey",
    slug: "regional-indian-cuisines-journey",
    image: "https://picsum.photos/400/300?random=54",
    author: "Ravi Foodie",
    date: "December 16, 2024",
    category: "Food & Drinks",
    excerpt: "Exploring the diverse flavors from different states of India...",
  },
]

foodDrinksArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function FoodDrinksPage() {
  return (
    <CategoryLayout
      categoryName="Food & Drinks"
      categorySlug="food-drinks"
      description="Savor the flavors of India and beyond with our culinary adventures and beverage discoveries."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodDrinksArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative h-[360px] w-full">
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
            <button className="px-3 py-2 bg-black text-white rounded">1</button>
            <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
          </div>
        </div>
      </div>
    </CategoryLayout>
  )
}
