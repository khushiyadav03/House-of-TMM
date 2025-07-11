import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Golf articles
const golfArticles = [
  {
    id: 1,
    title: "Mastering Your Swing: Tips from a Pro Golfer",
    slug: "mastering-your-swing",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Improve your golf game with expert advice on technique and form.",
    category: "Golf",
  },
  {
    id: 2,
    title: "The Best Golf Courses in India for a Weekend Getaway",
    slug: "best-golf-courses-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Discover top-rated golf destinations offering stunning views and challenging greens.",
    category: "Golf",
  },
  {
    id: 3,
    title: "Golf Equipment Guide: Choosing the Right Clubs",
    slug: "golf-equipment-guide",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "A comprehensive guide to selecting golf clubs that match your skill level and playing style.",
    category: "Golf",
  },
  {
    id: 4,
    title: "The Mental Game of Golf: Staying Focused Under Pressure",
    slug: "mental-game-golf",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Strategies to maintain composure and perform your best on the golf course.",
    category: "Golf",
  },
  {
    id: 5,
    title: "History of Golf: From Ancient Origins to Modern Sport",
    slug: "history-of-golf",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Trace the fascinating evolution of golf and its journey to becoming a global phenomenon.",
    category: "Golf",
  },
  {
    id: 6,
    title: "Golf Fitness: Exercises to Improve Your Game",
    slug: "golf-fitness-exercises",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Targeted workouts to enhance your strength, flexibility, and endurance for golf.",
    category: "Golf",
  },
  {
    id: 7,
    title: "Understanding Golf Handicaps: A Simple Explanation",
    slug: "understanding-golf-handicaps",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Demystifying the handicap system and how it levels the playing field for golfers.",
    category: "Golf",
  },
  {
    id: 8,
    title: "The Etiquette of Golf: Rules Beyond the Scorecard",
    slug: "etiquette-of-golf",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Essential guidelines for proper conduct and sportsmanship on the golf course.",
    category: "Golf",
  },
  {
    id: 9,
    title: "Junior Golf Programs: Nurturing Future Champions",
    slug: "junior-golf-programs",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Exploring initiatives and academies dedicated to developing young golf talents.",
    category: "Golf",
  },
  {
    id: 10,
    title: "Golf Course Design: Art and Strategy",
    slug: "golf-course-design",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "A look into the intricate process of designing challenging and beautiful golf courses.",
    category: "Golf",
  },
  {
    id: 11,
    title: "The Ryder Cup: A Legacy of Rivalry and Sportsmanship",
    slug: "ryder-cup-legacy",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Recalling the thrilling history and memorable moments of golf's premier team competition.",
    category: "Golf",
  },
  {
    id: 12,
    title: "Golf Travel: Planning Your Next Golfing Holiday",
    slug: "golf-travel-planning",
    image_url: "/placeholder.svg?height=405&width=270&text=Golf+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Tips and destinations for an unforgettable golf-focused vacation.",
    category: "Golf",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function GolfPage() {
  return (
    <CategoryLayout
      categoryName="Golf"
      categorySlug="golf"
      description="Dive into the world of golf with tips, course reviews, and news from the greens."
      initialArticles={golfArticles}
    />
  )
}
