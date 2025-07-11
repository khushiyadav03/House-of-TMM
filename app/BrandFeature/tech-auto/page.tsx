import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Tech & Auto articles
const techAutoArticles = [
  {
    id: 1,
    title: "The Future of Electric Vehicles in India",
    slug: "future-electric-vehicles-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "An in-depth look at the growing EV market and infrastructure in India.",
    category: "Tech & Auto",
  },
  {
    id: 2,
    title: "Top 5 Gadgets for the Modern Professional",
    slug: "top-5-gadgets-modern-professional",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Essential tech tools to boost productivity and efficiency in your daily work.",
    category: "Tech & Auto",
  },
  {
    id: 3,
    title: "Autonomous Driving: The Road Ahead",
    slug: "autonomous-driving-road-ahead",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Exploring the advancements and challenges in self-driving car technology.",
    category: "Tech & Auto",
  },
  {
    id: 4,
    title: "Smart Homes: Integrating Technology for Better Living",
    slug: "smart-homes-better-living",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "How smart devices are transforming homes into intelligent, connected spaces.",
    category: "Tech & Auto",
  },
  {
    id: 5,
    title: "Review: The Latest Flagship Smartphones",
    slug: "review-latest-flagship-smartphones",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "A detailed comparison of the newest high-end mobile devices on the market.",
    category: "Tech & Auto",
  },
  {
    id: 6,
    title: "Motorcycle Innovations: Speed, Safety, and Style",
    slug: "motorcycle-innovations",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Discover the cutting-edge technology and design in the world of motorcycles.",
    category: "Tech & Auto",
  },
  {
    id: 7,
    title: "AI in Everyday Life: Beyond the Hype",
    slug: "ai-everyday-life",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Practical applications of artificial intelligence that are already impacting our lives.",
    category: "Tech & Auto",
  },
  {
    id: 8,
    title: "Classic Cars: Restoring Automotive Legends",
    slug: "classic-cars-restoring-legends",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "A look into the passion and precision involved in bringing vintage automobiles back to life.",
    category: "Tech & Auto",
  },
  {
    id: 9,
    title: "Cybersecurity Tips for Digital Nomads",
    slug: "cybersecurity-digital-nomads",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Essential advice for staying safe online while working from anywhere in the world.",
    category: "Tech & Auto",
  },
  {
    id: 10,
    title: "The Evolution of Car Infotainment Systems",
    slug: "evolution-car-infotainment",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "From basic radios to advanced AI-powered dashboards, how car tech has changed.",
    category: "Tech & Auto",
  },
  {
    id: 11,
    title: "Wearable Technology: Health and Fitness Trackers",
    slug: "wearable-tech-health-fitness",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "A guide to the best smartwatches and fitness bands for monitoring your well-being.",
    category: "Tech & Auto",
  },
  {
    id: 12,
    title: "Off-Road Adventures: Best 4x4 Vehicles",
    slug: "off-road-adventures-4x4",
    image_url: "/placeholder.svg?height=405&width=270&text=Tech+Auto+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Top picks for rugged vehicles designed to conquer any terrain.",
    category: "Tech & Auto",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function TechAutoPage() {
  return (
    <CategoryLayout
      categoryName="Tech & Auto"
      categorySlug="tech-auto"
      description="Stay informed about the latest innovations in technology and the automotive industry."
      initialArticles={techAutoArticles}
    />
  )
}
