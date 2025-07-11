import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Food & Drinks articles
const foodDrinksArticles = [
  {
    id: 1,
    title: "Exploring India's Diverse Culinary Landscape",
    slug: "india-culinary-landscape",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "A journey through the rich flavors and unique dishes of different Indian regions.",
    category: "Food & Drinks",
  },
  {
    id: 2,
    title: "Top 10 Must-Try Street Foods in Delhi",
    slug: "top-10-street-foods-delhi",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "From spicy chaat to delicious parathas, a guide to Delhi's best street eats.",
    category: "Food & Drinks",
  },
  {
    id: 3,
    title: "The Art of Indian Spices: A Beginner's Guide",
    slug: "art-indian-spices",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Unlock the secrets of Indian cooking with this essential guide to spices.",
    category: "Food & Drinks",
  },
  {
    id: 4,
    title: "Healthy Indian Recipes for a Balanced Diet",
    slug: "healthy-indian-recipes",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Delicious and nutritious Indian dishes that support a healthy lifestyle.",
    category: "Food & Drinks",
  },
  {
    id: 5,
    title: "Coffee Culture in India: From Bean to Brew",
    slug: "coffee-culture-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Discover the growing coffee scene and unique brewing traditions across India.",
    category: "Food & Drinks",
  },
  {
    id: 6,
    title: "The Best Indian Desserts You Need to Try",
    slug: "best-indian-desserts",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Indulge your sweet tooth with these traditional and modern Indian sweets.",
    category: "Food & Drinks",
  },
  {
    id: 7,
    title: "Wine Pairing with Indian Cuisine",
    slug: "wine-pairing-indian-cuisine",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "Expert recommendations for pairing wines with the complex flavors of Indian dishes.",
    category: "Food & Drinks",
  },
  {
    id: 8,
    title: "Farm-to-Table Movement in Indian Restaurants",
    slug: "farm-to-table-indian-restaurants",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "How Indian chefs are embracing local produce and sustainable practices.",
    category: "Food & Drinks",
  },
  {
    id: 9,
    title: "The History of Tea in India",
    slug: "history-tea-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "From colonial plantations to modern chai stalls, the story of India's favorite beverage.",
    category: "Food & Drinks",
  },
  {
    id: 10,
    title: "Vegan and Vegetarian Delights from India",
    slug: "vegan-vegetarian-india",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Discover the rich and diverse plant-based culinary traditions of India.",
    category: "Food & Drinks",
  },
  {
    id: 11,
    title: "Mastering Indian Breads: Naan, Roti, and More",
    slug: "mastering-indian-breads",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "A guide to making authentic Indian flatbreads at home.",
    category: "Food & Drinks",
  },
  {
    id: 12,
    title: "The Rise of Craft Beer in Indian Cities",
    slug: "craft-beer-indian-cities",
    image_url: "/placeholder.svg?height=405&width=270&text=Food+Drinks+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Exploring the burgeoning craft beer scene and local breweries across India.",
    category: "Food & Drinks",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function FoodDrinksPage() {
  return (
    <CategoryLayout
      categoryName="Food & Drinks"
      categorySlug="food-drinks"
      description="Savor the flavors of India and beyond with our articles on cuisine, recipes, and dining experiences."
      initialArticles={foodDrinksArticles}
    />
  )
}
