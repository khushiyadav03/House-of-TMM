"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const techAutoArticles = [
  {
    id: 1,
    title: "Electric Vehicles: The Future of Transportation",
    slug: "electric-vehicles-future-transportation",
    image_url: "https://picsum.photos/270/405?random=41",
    author: "Rajesh Kumar",
    publish_date: "2024-12-22",
    category: "Tech & Auto",
    excerpt: "How electric vehicles are revolutionizing the automotive industry in India...",
  },
  {
    id: 2,
    title: "AI in Automotive: Smart Cars Revolution",
    slug: "ai-automotive-smart-cars",
    image_url: "https://picsum.photos/270/405?random=42",
    author: "Anita Desai",
    publish_date: "2024-12-20",
    category: "Tech & Auto",
    excerpt: "Exploring how artificial intelligence is making cars smarter and safer...",
  },
  {
    id: 3,
    title: "Luxury Car Brands: Indian Market Expansion",
    slug: "luxury-cars-indian-market",
    image_url: "https://picsum.photos/270/405?random=43",
    author: "Suresh Reddy",
    publish_date: "2024-12-18",
    category: "Tech & Auto",
    excerpt: "Premium automotive brands are finding new opportunities in India...",
  },
  {
    id: 4,
    title: "Tech Gadgets for Modern Cars",
    slug: "tech-gadgets-modern-cars",
    image_url: "https://picsum.photos/270/405?random=44",
    author: "Kavya Nair",
    publish_date: "2024-12-16",
    category: "Tech & Auto",
    excerpt: "Essential technology accessories for the contemporary car owner...",
  },
  {
    id: 5,
    title: "Autonomous Driving: India's Roadmap",
    slug: "autonomous-driving-india-roadmap",
    image_url: "https://picsum.photos/270/405?random=45",
    author: "Amit Joshi",
    publish_date: "2024-12-14",
    category: "Tech & Auto",
    excerpt: "The journey towards self-driving cars in Indian conditions...",
  },
  {
    id: 6,
    title: "Motorcycle Culture: Indian Biking Scene",
    slug: "motorcycle-culture-indian-biking",
    image_url: "https://picsum.photos/270/405?random=46",
    author: "Ravi Tiwari",
    publish_date: "2024-12-12",
    category: "Tech & Auto",
    excerpt: "Exploring the vibrant motorcycle culture across India...",
  },
]

// Sort articles by publish_date in descending order (newest first)
techAutoArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function TechAutoPage() {
  return (
    <CategoryLayout
      categoryName="Tech & Auto"
      categorySlug="tech-auto"
      description="Stay updated with the latest in automotive technology, electric vehicles, and transportation innovations."
      initialArticles={techAutoArticles} // Pass static articles to CategoryLayout
    />
  )
}
