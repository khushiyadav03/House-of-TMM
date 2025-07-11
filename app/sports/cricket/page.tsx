import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Cricket articles
const cricketArticles = [
  {
    id: 1,
    title: "IPL 2025: Team Previews and Predictions",
    slug: "ipl-2025-previews-predictions",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Get ready for the next season of Indian Premier League with our expert analysis.",
    category: "Cricket",
  },
  {
    id: 2,
    title: "The Rise of Young Indian Cricketers",
    slug: "rise-young-indian-cricketers",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Spotlight on the emerging talents set to dominate the future of Indian cricket.",
    category: "Cricket",
  },
  {
    id: 3,
    title: "Test Cricket: The Ultimate Format",
    slug: "test-cricket-ultimate-format",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "A deep dive into the enduring appeal and strategic depth of Test match cricket.",
    category: "Cricket",
  },
  {
    id: 4,
    title: "Women's Cricket: Breaking Barriers and Records",
    slug: "womens-cricket-breaking-barriers",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Celebrating the achievements and growing popularity of women's cricket globally.",
    category: "Cricket",
  },
  {
    id: 5,
    title: "Fantasy Cricket: Tips to Win Your League",
    slug: "fantasy-cricket-tips",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Expert strategies and player analysis to help you ace your fantasy cricket team.",
    category: "Cricket",
  },
  {
    id: 6,
    title: "The Evolution of Cricket Bat Technology",
    slug: "cricket-bat-technology",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "From willow selection to modern innovations, how bats have changed the game.",
    category: "Cricket",
  },
  {
    id: 7,
    title: "Iconic Moments in Indian Cricket History",
    slug: "iconic-moments-indian-cricket",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Relive the greatest victories and unforgettable performances of the Indian team.",
    category: "Cricket",
  },
  {
    id: 8,
    title: "Cricket Analytics: Data Driving Decisions",
    slug: "cricket-analytics",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "How statistics and data science are revolutionizing coaching and player performance.",
    category: "Cricket",
  },
  {
    id: 9,
    title: "The Art of Spin Bowling: A Masterclass",
    slug: "art-spin-bowling",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Insights into the techniques and strategies of cricket's most deceptive bowlers.",
    category: "Cricket",
  },
  {
    id: 10,
    title: "Fitness Regimen of Professional Cricketers",
    slug: "fitness-regimen-cricketers",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "The intense training and dietary plans that keep top cricketers in peak condition.",
    category: "Cricket",
  },
  {
    id: 11,
    title: "Cricket World Cup: A Look Back at Past Glories",
    slug: "cricket-world-cup-past-glories",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Recalling the most memorable moments and champions from cricket's biggest tournament.",
    category: "Cricket",
  },
  {
    id: 12,
    title: "The Role of Captaincy in Cricket",
    slug: "role-captaincy-cricket",
    image_url: "/placeholder.svg?height=405&width=270&text=Cricket+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Analyzing the leadership qualities and tactical decisions that define great cricket captains.",
    category: "Cricket",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function CricketPage() {
  return (
    <CategoryLayout
      categoryName="Cricket"
      categorySlug="cricket"
      description="All the latest news, analysis, and updates from the world of cricket."
      initialArticles={cricketArticles}
    />
  )
}
