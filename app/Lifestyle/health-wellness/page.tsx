"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const healthWellnessArticles = [
  {
    id: 1,
    title: "Mindful Eating: A Path to Better Health",
    slug: "mindful-eating-better-health",
    image_url: "https://picsum.photos/270/405?random=61",
    author: "Dr. Anya Sharma",
    publish_date: "2024-12-25",
    category: "Health & Wellness",
    excerpt: "Learn how conscious eating can transform your well-being and relationship with food.",
  },
  {
    id: 2,
    title: "The Power of Sleep: Restoring Your Body and Mind",
    slug: "power-of-sleep-restoring-body-mind",
    image_url: "https://picsum.photos/270/405?random=62",
    author: "Sleep Expert Rakesh",
    publish_date: "2024-12-23",
    category: "Health & Wellness",
    excerpt: "Uncover the profound impact of quality sleep on your physical and mental health.",
  },
  {
    id: 3,
    title: "Yoga for Stress Relief: Poses and Practices",
    slug: "yoga-stress-relief-poses-practices",
    image_url: "https://picsum.photos/270/405?random=63",
    author: "Yoga Guru Priya",
    publish_date: "2024-12-21",
    category: "Health & Wellness",
    excerpt: "Discover simple yoga poses and breathing techniques to calm your mind and body.",
  },
  {
    id: 4,
    title: "Herbal Remedies: Ancient Wisdom for Modern Ailments",
    slug: "herbal-remedies-ancient-wisdom",
    image_url: "https://picsum.photos/270/405?random=64",
    author: "Ayurveda Specialist",
    publish_date: "2024-12-19",
    category: "Health & Wellness",
    excerpt: "Explore traditional herbal solutions for common health issues.",
  },
  {
    id: 5,
    title: "Digital Detox: Reclaiming Your Focus",
    slug: "digital-detox-reclaiming-focus",
    image_url: "https://picsum.photos/270/405?random=65",
    author: "Tech Wellness Coach",
    publish_date: "2024-12-17",
    category: "Health & Wellness",
    excerpt: "Tips and strategies for disconnecting from screens and reconnecting with yourself.",
  },
  {
    id: 6,
    title: "Gut Health: The Foundation of Well-being",
    slug: "gut-health-foundation-well-being",
    image_url: "https://picsum.photos/270/405?random=66",
    author: "Nutritionist Smita",
    publish_date: "2024-12-15",
    category: "Health & Wellness",
    excerpt: "Understand the importance of a healthy gut and how to nurture it.",
  },
  {
    id: 7,
    title: "Meditation for Beginners: A Simple Guide",
    slug: "meditation-for-beginners-guide",
    image_url: "https://picsum.photos/270/405?random=67",
    author: "Mindfulness Coach",
    publish_date: "2024-12-13",
    category: "Health & Wellness",
    excerpt: "Start your meditation journey with easy-to-follow techniques.",
  },
  {
    id: 8,
    title: "Boosting Immunity Naturally",
    slug: "boosting-immunity-naturally",
    image_url: "https://picsum.photos/270/405?random=68",
    author: "Health Researcher",
    publish_date: "2024-12-11",
    category: "Health & Wellness",
    excerpt: "Practical ways to strengthen your body's natural defenses.",
  },
]

healthWellnessArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function HealthWellnessPage() {
  return (
    <CategoryLayout
      categoryName="Health & Wellness"
      categorySlug="health-wellness"
      description="Discover the latest in health, wellness, and mindful living for a balanced lifestyle."
      initialArticles={healthWellnessArticles} // Pass static articles to CategoryLayout
    />
  )
}
