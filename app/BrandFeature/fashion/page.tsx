import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Fashion articles
const fashionArticles = [
  {
    id: 1,
    title: "The Latest Trends in Sustainable Fashion",
    slug: "latest-trends-sustainable-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Discover eco-friendly styles and brands leading the way in sustainable practices.",
    category: "Fashion",
  },
  {
    id: 2,
    title: "Runway Report: Spring/Summer 2025 Highlights",
    slug: "runway-report-spring-summer-2025",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "A comprehensive look at the must-have trends from the latest fashion weeks.",
    category: "Fashion",
  },
  {
    id: 3,
    title: "Street Style: What's Hot in Urban Fashion",
    slug: "street-style-urban-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "From oversized blazers to chunky sneakers, see what's trending on the streets.",
    category: "Fashion",
  },
  {
    id: 4,
    title: "Interview with a Leading Indian Designer",
    slug: "interview-indian-designer",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Insights into the creative process and vision of a renowned fashion icon.",
    category: "Fashion",
  },
  {
    id: 5,
    title: "The Evolution of Traditional Indian Wear",
    slug: "evolution-traditional-indian-wear",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Tracing the journey of classic Indian garments through history and modern interpretations.",
    category: "Fashion",
  },
  {
    id: 6,
    title: "Accessorize Your Look: Tips and Tricks",
    slug: "accessorize-your-look",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "How to elevate any outfit with the right jewelry, bags, and shoes.",
    category: "Fashion",
  },
  {
    id: 7,
    title: "Men's Fashion: Beyond the Basics",
    slug: "mens-fashion-beyond-basics",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Exploring bold styles and sophisticated choices for the modern man.",
    category: "Fashion",
  },
  {
    id: 8,
    title: "The Impact of Social Media on Fashion",
    slug: "impact-social-media-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "How Instagram, TikTok, and other platforms are shaping fashion trends and consumer behavior.",
    category: "Fashion",
  },
  {
    id: 9,
    title: "Couture vs. Ready-to-Wear: Understanding the Differences",
    slug: "couture-vs-ready-to-wear",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "A deep dive into the two main categories of high fashion and their unique characteristics.",
    category: "Fashion",
  },
  {
    id: 10,
    title: "Fashion Photography: Capturing the Essence of Style",
    slug: "fashion-photography-capturing-style",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Tips and techniques for creating stunning fashion images that tell a story.",
    category: "Fashion",
  },
  {
    id: 11,
    title: "The Rise of Gender-Neutral Fashion",
    slug: "rise-gender-neutral-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Exploring the growing movement towards clothing designed for all, regardless of gender.",
    category: "Fashion",
  },
  {
    id: 12,
    title: "Textile Innovations: The Future of Fabrics",
    slug: "textile-innovations-future-fabrics",
    image_url: "/placeholder.svg?height=405&width=270&text=Fashion+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "From smart textiles to biodegradable materials, discover what's next in fabric technology.",
    category: "Fashion",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function FashionPage() {
  return (
    <CategoryLayout
      categoryName="Fashion"
      categorySlug="fashion"
      description="Stay updated with the latest trends, runway reports, and style guides from the world of fashion."
      initialArticles={fashionArticles}
    />
  )
}
