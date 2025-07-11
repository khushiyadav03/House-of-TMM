import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Other Sports articles
const otherSportsArticles = [
  {
    id: 1,
    title: "Football Fever: The Rise of Indian Super League",
    slug: "football-fever-isl",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Exploring the growing popularity and impact of professional football in India.",
    category: "Other Sports",
  },
  {
    id: 2,
    title: "Badminton Brilliance: India's Dominance on the Global Stage",
    slug: "badminton-brilliance-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Celebrating Indian shuttlers who are making their mark in international tournaments.",
    category: "Other Sports",
  },
  {
    id: 3,
    title: "Hockey Heroes: The Legacy of Indian Field Hockey",
    slug: "hockey-heroes-indian-field-hockey",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "A look back at India's glorious past in field hockey and its resurgence.",
    category: "Other Sports",
  },
  {
    id: 4,
    title: "Kabaddi: India's Indigenous Sport Goes Global",
    slug: "kabaddi-indigenous-sport-global",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "How the ancient Indian sport of Kabaddi is gaining international recognition.",
    category: "Other Sports",
  },
  {
    id: 5,
    title: "Motorsports in India: Speed, Thrills, and Challenges",
    slug: "motorsports-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "An overview of the motorsports scene, from Formula 1 to local rallies.",
    category: "Other Sports",
  },
  {
    id: 6,
    title: "Athletics: India's Quest for Olympic Medals",
    slug: "athletics-india-olympic-medals",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Highlighting Indian athletes and their pursuit of excellence on the world stage.",
    category: "Other Sports",
  },
  {
    id: 7,
    title: "Table Tennis: India's Growing Prowess",
    slug: "table-tennis-india-prowess",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "The rise of Indian paddlers and their impact on the international table tennis circuit.",
    category: "Other Sports",
  },
  {
    id: 8,
    title: "Boxing: Punching for Glory in India",
    slug: "boxing-punching-for-glory",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Stories of Indian boxers who have made their mark in the ring.",
    category: "Other Sports",
  },
  {
    id: 9,
    title: "Chess: India's Grandmasters and the Game of Minds",
    slug: "chess-indias-grandmasters",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "A look at India's rich chess heritage and its current crop of brilliant grandmasters.",
    category: "Other Sports",
  },
  {
    id: 10,
    title: "Wrestling: Traditional Roots and Modern Success",
    slug: "wrestling-traditional-modern",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "From ancient akhadas to Olympic medals, the journey of Indian wrestling.",
    category: "Other Sports",
  },
  {
    id: 11,
    title: "Archery: Precision and Focus in Indian Sports",
    slug: "archery-precision-focus",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Highlighting India's archers who are hitting the bullseye on the international stage.",
    category: "Other Sports",
  },
  {
    id: 12,
    title: "E-Sports in India: The Rise of Competitive Gaming",
    slug: "e-sports-india-competitive-gaming",
    image_url: "/placeholder.svg?height=405&width=270&text=Other+Sports+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Exploring the burgeoning world of electronic sports and its professional players in India.",
    category: "Other Sports",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function OtherSportsPage() {
  return (
    <CategoryLayout
      categoryName="Other Sports"
      categorySlug="other-sports"
      description="Beyond cricket and golf, explore a wide array of sports and athletic achievements."
      initialArticles={otherSportsArticles}
    />
  )
}
