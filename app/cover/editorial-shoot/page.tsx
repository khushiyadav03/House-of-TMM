import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Editorial Shoot articles
const editorialShootArticles = [
  {
    id: 1,
    title: "Editorial: Summer Vibes Collection",
    slug: "editorial-summer-vibes",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "A vibrant collection capturing the essence of summer fashion and lifestyle.",
    category: "Editorial Shoot",
  },
  {
    id: 2,
    title: "Behind the Scenes: Autumn Elegance",
    slug: "behind-scenes-autumn-elegance",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+2",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Exclusive look at the making of our latest autumn fashion editorial.",
    category: "Editorial Shoot",
  },
  {
    id: 3,
    title: "Urban Chic: Street Style Photography",
    slug: "urban-chic-street-style",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+3",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Capturing the raw and dynamic energy of city fashion.",
    category: "Editorial Shoot",
  },
  {
    id: 4,
    title: "High Fashion in the Desert",
    slug: "high-fashion-desert",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+4",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Stunning visuals from our latest editorial shot in the breathtaking desert landscape.",
    category: "Editorial Shoot",
  },
  {
    id: 5,
    title: "Vintage Glamour: A Timeless Collection",
    slug: "vintage-glamour-timeless",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+5",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Revisiting classic styles with a modern twist in our new editorial.",
    category: "Editorial Shoot",
  },
  {
    id: 6,
    title: "The Art of Posing: A Model's Guide",
    slug: "art-of-posing-model-guide",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+6",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Tips and tricks from top models on how to master the perfect pose for any shoot.",
    category: "Editorial Shoot",
  },
  {
    id: 7,
    title: "Fashion Photography: Lighting Techniques",
    slug: "fashion-photography-lighting",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+7",
    author: "AI Assistant",
    publish_date: "2024-05-30T10:00:00Z",
    excerpt: "Expert advice on using light to create stunning fashion photographs.",
    category: "Editorial Shoot",
  },
  {
    id: 8,
    title: "Location Scouting for Editorial Shoots",
    slug: "location-scouting-editorial",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+8",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "How to find the perfect backdrop for your next fashion story.",
    category: "Editorial Shoot",
  },
  {
    id: 9,
    title: "The Evolution of Editorial Fashion",
    slug: "evolution-editorial-fashion",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+9",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "A historical look at how fashion editorials have shaped trends and culture.",
    category: "Editorial Shoot",
  },
  {
    id: 10,
    title: "Styling for the Camera: A Professional's Guide",
    slug: "styling-for-camera",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+10",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Learn the secrets to creating visually stunning outfits for editorial spreads.",
    category: "Editorial Shoot",
  },
  {
    id: 11,
    title: "The Power of Storytelling in Fashion Editorials",
    slug: "storytelling-fashion-editorials",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+11",
    author: "AI Assistant",
    publish_date: "2024-05-10T10:00:00Z",
    excerpt: "How narratives and themes elevate fashion photography beyond mere clothing display.",
    category: "Editorial Shoot",
  },
  {
    id: 12,
    title: "Collaborating with Creatives: A Successful Editorial",
    slug: "collaborating-creatives-editorial",
    image_url: "/placeholder.svg?height=405&width=270&text=Editorial+Shoot+12",
    author: "AI Assistant",
    publish_date: "2024-05-05T10:00:00Z",
    excerpt: "Insights into effective teamwork between photographers, stylists, and models.",
    category: "Editorial Shoot",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function EditorialShootPage() {
  return (
    <CategoryLayout
      categoryName="Editorial Shoot"
      categorySlug="editorial-shoot"
      description="Behind the scenes and stunning visuals from our exclusive fashion editorials."
      initialArticles={editorialShootArticles}
    />
  )
}
