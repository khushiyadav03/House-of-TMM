import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Interviews articles
const interviewsArticles = [
  {
    id: 1,
    title: "Exclusive Interview: Bollywood Star on Life and Career",
    slug: "interview-bollywood-star",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "A candid conversation with one of India's most beloved actors about their journey.",
    category: "Interviews",
  },
  {
    id: 2,
    title: "Meet the Innovator: Tech Entrepreneur Changing the Game",
    slug: "meet-the-innovator-tech-entrepreneur",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "An inspiring chat with a visionary leader disrupting the tech industry.",
    category: "Interviews",
  },
  {
    id: 3,
    title: "Fashion Icon Speaks: Style, Sustainability, and Influence",
    slug: "fashion-icon-speaks",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Insights from a leading figure in fashion on their philosophy and impact.",
    category: "Interviews",
  },
  {
    id: 4,
    title: "Sports Legend: My Journey to Olympic Glory",
    slug: "sports-legend-olympic-glory",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "The untold story of dedication, challenges, and triumphs from an Olympic medalist.",
    category: "Interviews",
  },
  {
    id: 5,
    title: "Literary Voices: An Author's Creative Process",
    slug: "literary-voices-author-creative-process",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "A deep dive into the mind of a celebrated writer and their approach to storytelling.",
    category: "Interviews",
  },
  {
    id: 6,
    title: "Culinary Master: The Secrets Behind Award-Winning Dishes",
    slug: "culinary-master-award-winning-dishes",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "A renowned chef shares their philosophy on food and the art of cooking.",
    category: "Interviews",
  },
  {
    id: 7,
    title: "Environmental Activist: Fighting for a Greener Future",
    slug: "environmental-activist-greener-future",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "An inspiring conversation with a dedicated advocate for environmental conservation.",
    category: "Interviews",
  },
  {
    id: 8,
    title: "Art and Expression: A Painter's Perspective",
    slug: "art-expression-painters-perspective",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Insights into the world of a contemporary artist and their creative inspirations.",
    category: "Interviews",
  },
  {
    id: 9,
    title: "Social Entrepreneur: Making a Difference Through Business",
    slug: "social-entrepreneur-making-difference",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "How a visionary leader is combining business acumen with social impact.",
    category: "Interviews",
  },
  {
    id: 10,
    title: "Music Maestro: The Harmony of Life and Composition",
    slug: "music-maestro-harmony",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "A deep dive into the world of a celebrated musician and their creative journey.",
    category: "Interviews",
  },
  {
    id: 11,
    title: "Travel Photographer: Capturing the World's Beauty",
    slug: "travel-photographer-capturing-beauty",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "An adventurous photographer shares stories and tips from their global expeditions.",
    category: "Interviews",
  },
  {
    id: 12,
    title: "Fitness Guru: Inspiring a Healthier Generation",
    slug: "fitness-guru-healthier-generation",
    image_url: "/placeholder.svg?height=405&width=270&text=Interviews+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "A leading fitness expert shares their philosophy on well-being and motivation.",
    category: "Interviews",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function InterviewsPage() {
  return (
    <CategoryLayout
      categoryName="Interviews"
      categorySlug="interviews"
      description="Exclusive interviews with leading personalities from various fields, sharing their insights and journeys."
      initialArticles={interviewsArticles}
    />
  )
}
