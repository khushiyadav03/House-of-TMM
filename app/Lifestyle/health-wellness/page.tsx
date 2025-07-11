import CategoryLayout from "@/components/CategoryLayout"

// Mock data for Health & Wellness articles
const healthWellnessArticles = [
  {
    id: 1,
    title: "Yoga for Beginners: A Path to Inner Peace",
    slug: "yoga-for-beginners",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+1",
    author: "AI Assistant",
    publish_date: "2024-07-01T10:00:00Z",
    excerpt: "Start your journey to mindfulness and physical well-being with these basic yoga poses.",
    category: "Health & Wellness",
  },
  {
    id: 2,
    title: "Mindful Eating: Nourishing Your Body and Soul",
    slug: "mindful-eating",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+2",
    author: "AI Assistant",
    publish_date: "2024-06-28T10:00:00Z",
    excerpt: "Learn how to develop a healthier relationship with food through conscious eating habits.",
    category: "Health & Wellness",
  },
  {
    id: 3,
    title: "The Benefits of Ayurvedic Practices for Modern Life",
    slug: "ayurvedic-practices",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+3",
    author: "AI Assistant",
    publish_date: "2024-06-25T10:00:00Z",
    excerpt: "Discover ancient Indian healing traditions and how they can enhance your well-being today.",
    category: "Health & Wellness",
  },
  {
    id: 4,
    title: "Stress Management: Techniques for a Calmer Mind",
    slug: "stress-management",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+4",
    author: "AI Assistant",
    publish_date: "2024-06-20T10:00:00Z",
    excerpt: "Effective strategies to reduce stress and promote mental clarity in your daily routine.",
    category: "Health & Wellness",
  },
  {
    id: 5,
    title: "Holistic Health: A Comprehensive Approach to Well-being",
    slug: "holistic-health",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+5",
    author: "AI Assistant",
    publish_date: "2024-06-15T10:00:00Z",
    excerpt: "Understanding how physical, mental, and spiritual health are interconnected.",
    category: "Health & Wellness",
  },
  {
    id: 6,
    title: "Sleep Hygiene: Tips for Restful Nights",
    slug: "sleep-hygiene",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+6",
    author: "AI Assistant",
    publish_date: "2024-06-10T10:00:00Z",
    excerpt: "Improve your sleep quality with practical advice for a better night's rest.",
    category: "Health & Wellness",
  },
  {
    id: 7,
    title: "The Power of Positive Affirmations",
    slug: "positive-affirmations",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+7",
    author: "AI Assistant",
    publish_date: "2024-06-05T10:00:00Z",
    excerpt: "How daily affirmations can transform your mindset and improve your overall well-being.",
    category: "Health & Wellness",
  },
  {
    id: 8,
    title: "Herbal Remedies: Nature's Pharmacy",
    slug: "herbal-remedies",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+8",
    author: "AI Assistant",
    publish_date: "2024-06-01T10:00:00Z",
    excerpt: "Discover the healing properties of various herbs and their traditional uses.",
    category: "Health & Wellness",
  },
  {
    id: 9,
    title: "Digital Detox: Reclaiming Your Time and Focus",
    slug: "digital-detox",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+9",
    author: "AI Assistant",
    publish_date: "2024-05-28T10:00:00Z",
    excerpt: "Strategies to reduce screen time and improve your mental well-being.",
    category: "Health & Wellness",
  },
  {
    id: 10,
    title: "Building Resilience: Bouncing Back from Adversity",
    slug: "building-resilience",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+10",
    author: "AI Assistant",
    publish_date: "2024-05-25T10:00:00Z",
    excerpt: "Develop mental toughness and emotional strength to navigate life's challenges.",
    category: "Health & Wellness",
  },
  {
    id: 11,
    title: "The Importance of Hydration for Health",
    slug: "importance-hydration",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+11",
    author: "AI Assistant",
    publish_date: "2024-05-20T10:00:00Z",
    excerpt: "Understand why staying hydrated is crucial for your body's functions and overall health.",
    category: "Health & Wellness",
  },
  {
    id: 12,
    title: "Meditation Techniques for Daily Practice",
    slug: "meditation-techniques",
    image_url: "/placeholder.svg?height=405&width=270&text=Health+Wellness+12",
    author: "AI Assistant",
    publish_date: "2024-05-15T10:00:00Z",
    excerpt: "Simple meditation exercises to incorporate into your routine for peace and clarity.",
    category: "Health & Wellness",
  },
].sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()) // Sort by date

export default function HealthWellnessPage() {
  return (
    <CategoryLayout
      categoryName="Health & Wellness"
      categorySlug="health-wellness"
      description="Discover articles on physical and mental well-being, mindful living, and holistic health practices."
      initialArticles={healthWellnessArticles}
    />
  )
}
