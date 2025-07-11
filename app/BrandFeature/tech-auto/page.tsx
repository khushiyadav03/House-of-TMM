"use client"
import Footer from "../../../components/Footer"

import CategoryLayout from "../../../components/CategoryLayout"

const techAutoArticles = [
  {
    id: 1,
    title: "Electric Vehicles: The Future of Transportation",
    slug: "electric-vehicles-future-transportation",
    image: "https://picsum.photos/400/300?random=41",
    author: "Rajesh Kumar",
    date: "December 22, 2024",
    category: "Tech & Auto",
    excerpt: "How electric vehicles are revolutionizing the automotive industry in India...",
  },
  {
    id: 2,
    title: "AI in Automotive: Smart Cars Revolution",
    slug: "ai-automotive-smart-cars",
    image: "https://picsum.photos/400/300?random=42",
    author: "Anita Desai",
    date: "December 20, 2024",
    category: "Tech & Auto",
    excerpt: "Exploring how artificial intelligence is making cars smarter and safer...",
  },
  {
    id: 3,
    title: "Luxury Car Brands: Indian Market Expansion",
    slug: "luxury-cars-indian-market",
    image: "https://picsum.photos/400/300?random=43",
    author: "Suresh Reddy",
    date: "December 18, 2024",
    category: "Tech & Auto",
    excerpt: "Premium automotive brands are finding new opportunities in India...",
  },
  {
    id: 4,
    title: "Tech Gadgets for Modern Cars",
    slug: "tech-gadgets-modern-cars",
    image: "https://picsum.photos/400/300?random=44",
    author: "Kavya Nair",
    date: "December 16, 2024",
    category: "Tech & Auto",
    excerpt: "Essential technology accessories for the contemporary car owner...",
  },
  {
    id: 5,
    title: "Autonomous Driving: India's Roadmap",
    slug: "autonomous-driving-india-roadmap",
    image: "https://picsum.photos/400/300?random=45",
    author: "Amit Joshi",
    date: "December 14, 2024",
    category: "Tech & Auto",
    excerpt: "The journey towards self-driving cars in Indian conditions...",
  },
  {
    id: 6,
    title: "Motorcycle Culture: Indian Biking Scene",
    slug: "motorcycle-culture-indian-biking",
    image: "https://picsum.photos/400/300?random=46",
    author: "Ravi Tiwari",
    date: "December 12, 2024",
    category: "Tech & Auto",
    excerpt: "Exploring the vibrant motorcycle culture across India...",
  },
]

export default function TechAutoPage() {
  return (
    <CategoryLayout
      categoryName="Tech & Auto"
      categorySlug="tech-auto"
      description="Stay updated with the latest in automotive technology, electric vehicles, and transportation innovations."
    >
      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-12">
        <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
          Previous
        </button>
        <button className="px-3 py-2 bg-black text-white rounded">1</button>
        <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
        <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
        <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
      </div>
      <Footer />
    </CategoryLayout>
  )
}
