import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Travel articles
const travelArticles = [
  {
    id: 1,
    title: "Exploring the Serene Backwaters of Kerala",
    slug: "kerala-backwaters",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "A tranquil journey through the picturesque canals and houseboats of South India.",
    category: "Travel",
  },
  {
    id: 2,
    title: "Adventure in the Himalayas: Trekking to Everest Base Camp",
    slug: "himalayas-everest-base-camp",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "An exhilarating account of conquering the majestic peaks and breathtaking landscapes.",
    category: "Travel",
  },
  {
    id: 3,
    title: "Cultural Immersion: A Guide to Rajasthan's Royal Heritage",
    slug: "rajasthan-royal-heritage",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Discover the opulent palaces, vibrant festivals, and rich history of Rajasthan.",
    category: "Travel",
  },
  {
    id: 4,
    title: "Beach Escapes: Top Coastal Destinations in Goa",
    slug: "beach-escapes-goa",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Sun, sand, and sea: find your perfect beach getaway in India's party capital.",
    category: "Travel",
  },
  {
    id: 5,
    title: "Wildlife Safaris: Encountering India's Big Cats",
    slug: "wildlife-safaris-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "A thrilling guide to national parks and tiger reserves for wildlife enthusiasts.",
    category: "Travel",
  },
  {
    id: 6,
    title: "Solo Travel in India: Tips for Female Explorers",
    slug: "solo-travel-india-female",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Safety tips, destination recommendations, and empowering stories for women traveling alone.",
    category: "Travel",
  },
  {
    id: 7,
    title: "Budget Travel: Exploring India on a Shoestring",
    slug: "budget-travel-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "How to experience the best of India without breaking the bank.",
    category: "Travel",
  },
  {
    id: 8,
    title: "Spiritual Journeys: Pilgrimage Sites in India",
    slug: "spiritual-journeys-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "A guide to sacred destinations and spiritual retreats across the country.",
    category: "Travel",
  },
  {
    id: 9,
    title: "Foodie's Guide to Indian Cities",
    slug: "foodies-guide-indian-cities",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Where to find the most authentic and delicious local cuisines in major Indian cities.",
    category: "Travel",
  },
  {
    id: 10,
    title: "Hidden Gems: Offbeat Destinations in India",
    slug: "hidden-gems-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Uncover lesser-known but equally captivating places for your next adventure.",
    category: "Travel",
  },
  {
    id: 11,
    title: "Responsible Tourism: Traveling Sustainably in India",
    slug: "responsible-tourism-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Tips for minimizing your environmental impact and supporting local communities while traveling.",
    category: "Travel",
  },
  {
    id: 12,
    title: "Photography Tips for Travel Enthusiasts",
    slug: "photography-tips-travel",
    image_url: "/placeholder.svg?height=405&width=270&text=Travel+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Learn how to capture stunning travel photos with these expert techniques.",
    category: "Travel",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function TravelPage() {
  return (
    <CategoryLayout
      categoryName="Travel"
      categorySlug="travel"
      description="Embark on a journey with our travel guides, destination highlights, and adventure stories."
      initialArticles={travelArticles}
    />
  )
}
