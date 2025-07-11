import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Trending articles
const trendingArticles = [
  {
    id: 1,
    title: "The Latest AI Breakthroughs and Their Impact",
    slug: "latest-ai-breakthroughs",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Stay updated on the most significant developments in artificial intelligence.",
    category: "Trending",
  },
  {
    id: 2,
    title: "Sustainable Living: Eco-Friendly Habits for a Better Planet",
    slug: "sustainable-living-eco-friendly",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Practical tips and lifestyle changes to reduce your environmental footprint.",
    category: "Trending",
  },
  {
    id: 3,
    title: "The Future of Work: Remote, Hybrid, and Beyond",
    slug: "future-of-work",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "How workplaces are evolving and adapting to new models of collaboration.",
    category: "Trending",
  },
  {
    id: 4,
    title: "Mental Health Awareness: Breaking the Stigma",
    slug: "mental-health-awareness",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Important discussions and resources for promoting mental well-being.",
    category: "Trending",
  },
  {
    id: 5,
    title: "The Rise of Creator Economy: Empowering Individuals",
    slug: "rise-creator-economy",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "How content creators are building successful careers and communities online.",
    category: "Trending",
  },
  {
    id: 6,
    title: "Space Exploration: New Discoveries and Missions",
    slug: "space-exploration-new-discoveries",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Updates from NASA, ISRO, and private companies pushing the boundaries of space travel.",
    category: "Trending",
  },
  {
    id: 7,
    title: "The Impact of Social Media on Society",
    slug: "impact-social-media-society",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Analyzing the profound effects of social platforms on communication, culture, and politics.",
    category: "Trending",
  },
  {
    id: 8,
    title: "Future of Food: Plant-Based and Lab-Grown Innovations",
    slug: "future-of-food",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Exploring sustainable and ethical alternatives to traditional food production.",
    category: "Trending",
  },
  {
    id: 9,
    title: "Cybersecurity Threats and How to Protect Yourself",
    slug: "cybersecurity-threats",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Essential tips and strategies to safeguard your digital life from online dangers.",
    category: "Trending",
  },
  {
    id: 10,
    title: "The Metaverse: Opportunities and Challenges",
    slug: "metaverse-opportunities-challenges",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "A deep dive into the virtual worlds and their potential impact on various industries.",
    category: "Trending",
  },
  {
    id: 11,
    title: "Renewable Energy: Powering a Sustainable Future",
    slug: "renewable-energy-sustainable-future",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Innovations and advancements in solar, wind, and other clean energy sources.",
    category: "Trending",
  },
  {
    id: 12,
    title: "The Gig Economy: Flexibility vs. Security",
    slug: "gig-economy-flexibility-security",
    image_url: "/placeholder.svg?height=405&width=270&text=Trending+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Analyzing the pros and cons of freelance work and its growing influence on the job market.",
    category: "Trending",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function TrendingPage() {
  return (
    <CategoryLayout
      categoryName="Trending"
      categorySlug="trending"
      description="Stay on top of the most talked-about topics, viral content, and emerging trends."
      initialArticles={trendingArticles}
    />
  )
}
