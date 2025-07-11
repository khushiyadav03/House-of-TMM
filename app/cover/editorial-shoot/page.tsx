"use client"

import Link from "next/link"

import CategoryLayout from "../../../components/CategoryLayout"

const editorialShootArticles = [
  {
    id: 1,
    title: "Behind the Scenes: Luxury Fashion Editorial",
    slug: "luxury-fashion-editorial-bts",
    image: "https://picsum.photos/400/300?random=21",
    author: "Isabella Rodriguez",
    date: "December 20, 2024",
    category: "Editorial Shoot",
    excerpt: "An exclusive look at the making of our latest luxury fashion editorial...",
  },
  {
    id: 2,
    title: "Street Style Photography: Urban Elegance",
    slug: "street-style-urban-elegance",
    image: "https://picsum.photos/400/300?random=22",
    author: "Thomas Anderson",
    date: "December 18, 2024",
    category: "Editorial Shoot",
    excerpt: "Capturing the essence of urban fashion in metropolitan settings...",
  },
  {
    id: 3,
    title: "Minimalist Fashion: Less is More",
    slug: "minimalist-fashion-editorial",
    image: "https://picsum.photos/400/300?random=23",
    author: "Grace Kim",
    date: "December 16, 2024",
    category: "Editorial Shoot",
    excerpt: "Exploring the beauty of simplicity in contemporary fashion...",
  },
  {
    id: 4,
    title: "Avant-Garde Fashion: Breaking Boundaries",
    slug: "avant-garde-fashion-boundaries",
    image: "https://picsum.photos/400/300?random=24",
    author: "Oliver Thompson",
    date: "December 14, 2024",
    category: "Editorial Shoot",
    excerpt: "Pushing the limits of conventional fashion through artistic expression...",
  },
]

editorialShootArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function EditorialShootPage() {
  return (
    <CategoryLayout
      categoryName="Editorial Shoot"
      categorySlug="editorial-shoot"
      description="Dive into the creative process behind our most stunning editorial photography and fashion storytelling."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editorialShootArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative h-[360px] w-full">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="object-cover w-full h-full"
                      width="270"
                      height="405"
                    />
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
      </div>
    </CategoryLayout>
  )
}
