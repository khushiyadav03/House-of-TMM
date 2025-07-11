"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const travelArticles = [
  {
    id: 1,
    title: "Exploring the Backwaters of Kerala",
    slug: "exploring-backwaters-kerala",
    image: "https://picsum.photos/270/405?random=91",
    author: "Travel Blogger Rohan",
    date: "December 26, 2024",
    category: "Travel",
    excerpt: "A serene journey through the picturesque canals and lagoons of Kerala.",
  },
  {
    id: 2,
    title: "Himalayan Treks: Adventures in the Mountains",
    slug: "himalayan-treks-mountains",
    image: "https://picsum.photos/270/405?random=92",
    author: "Mountaineer Pooja",
    date: "December 24, 2024",
    category: "Travel",
    excerpt: "Conquer breathtaking peaks and discover hidden trails in the Himalayas.",
  },
  {
    id: 3,
    title: "Goa Beyond Beaches: A Cultural Immersion",
    slug: "goa-beyond-beaches-cultural-immersion",
    image: "https://picsum.photos/270/405?random=93",
    author: "Culture Enthusiast",
    date: "December 22, 2024",
    category: "Travel",
    excerpt: "Uncover the rich history, vibrant markets, and unique traditions of Goa.",
  },
  {
    id: 4,
    title: "Wildlife Safaris in India: A Jungle Adventure",
    slug: "wildlife-safaris-india-jungle-adventure",
    image: "https://picsum.photos/270/405?random=94",
    author: "Wildlife Photographer",
    date: "December 20, 2024",
    category: "Travel",
    excerpt: "Encounter majestic tigers, elephants, and diverse wildlife in India's national parks.",
  },
  {
    id: 5,
    title: "Desert Delights: Rajasthan's Royal Charms",
    slug: "desert-delights-rajasthan-royal-charms",
    image: "https://picsum.photos/270/405?random=95",
    author: "Historian Ananya",
    date: "December 18, 2024",
    category: "Travel",
    excerpt: "Journey through the land of kings, forts, and vibrant folk culture.",
  },
  {
    id: 6,
    title: "Spiritual Journeys: Pilgrimage Sites of India",
    slug: "spiritual-journeys-pilgrimage-sites",
    image: "https://picsum.photos/270/405?random=96",
    author: "Spiritual Guide",
    date: "December 16, 2024",
    category: "Travel",
    excerpt: "Explore the sacred temples, ashrams, and spiritual centers across India.",
  },
]

travelArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function TravelPage() {
  return (
    <CategoryLayout
      categoryName="Travel"
      categorySlug="travel"
      description="Explore amazing destinations, travel tips, and cultural experiences from around the world."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelArticles.map((article) => (
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
