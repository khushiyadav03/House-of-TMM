"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const healthWellnessArticles = [
  {
    id: 1,
    title: "Mindful Eating: A Path to Better Health",
    slug: "mindful-eating-better-health",
    image: "https://picsum.photos/270/405?random=61",
    author: "Dr. Anya Sharma",
    date: "December 25, 2024",
    category: "Health & Wellness",
    excerpt: "Learn how conscious eating can transform your well-being and relationship with food.",
  },
  {
    id: 2,
    title: "The Power of Sleep: Restoring Your Body and Mind",
    slug: "power-of-sleep-restoring-body-mind",
    image: "https://picsum.photos/270/405?random=62",
    author: "Sleep Expert Rakesh",
    date: "December 23, 2024",
    category: "Health & Wellness",
    excerpt: "Uncover the profound impact of quality sleep on your physical and mental health.",
  },
  {
    id: 3,
    title: "Yoga for Stress Relief: Poses and Practices",
    slug: "yoga-stress-relief-poses-practices",
    image: "https://picsum.photos/270/405?random=63",
    author: "Yoga Guru Priya",
    date: "December 21, 2024",
    category: "Health & Wellness",
    excerpt: "Discover simple yoga poses and breathing techniques to calm your mind and body.",
  },
  {
    id: 4,
    title: "Herbal Remedies: Ancient Wisdom for Modern Ailments",
    slug: "herbal-remedies-ancient-wisdom",
    image: "https://picsum.photos/270/405?random=64",
    author: "Ayurveda Specialist",
    date: "December 19, 2024",
    category: "Health & Wellness",
    excerpt: "Explore traditional herbal solutions for common health issues.",
  },
  {
    id: 5,
    title: "Digital Detox: Reclaiming Your Focus",
    slug: "digital-detox-reclaiming-focus",
    image: "https://picsum.photos/270/405?random=65",
    author: "Tech Wellness Coach",
    date: "December 17, 2024",
    category: "Health & Wellness",
    excerpt: "Tips and strategies for disconnecting from screens and reconnecting with yourself.",
  },
  {
    id: 6,
    title: "Gut Health: The Foundation of Well-being",
    slug: "gut-health-foundation-well-being",
    image: "https://picsum.photos/270/405?random=66",
    author: "Nutritionist Smita",
    date: "December 15, 2024",
    category: "Health & Wellness",
    excerpt: "Understand the importance of a healthy gut and how to nurture it.",
  },
  {
    id: 7,
    title: "Meditation for Beginners: A Simple Guide",
    slug: "meditation-for-beginners-guide",
    image: "https://picsum.photos/270/405?random=67",
    author: "Mindfulness Coach",
    date: "December 13, 2024",
    category: "Health & Wellness",
    excerpt: "Start your meditation journey with easy-to-follow techniques.",
  },
  {
    id: 8,
    title: "Boosting Immunity Naturally",
    slug: "boosting-immunity-naturally",
    image: "https://picsum.photos/270/405?random=68",
    author: "Health Researcher",
    date: "December 11, 2024",
    category: "Health & Wellness",
    excerpt: "Practical ways to strengthen your body's natural defenses.",
  },
]

healthWellnessArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function HealthWellnessPage() {
  return (
    <CategoryLayout
      categoryName="Health & Wellness"
      categorySlug="health-wellness"
      description="Discover the latest in health, wellness, and mindful living for a balanced lifestyle."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthWellnessArticles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}>
                <article className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  <div className="relative h-[405px] w-[270px] mx-auto">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={270}
                      height={405}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-black text-white">1</button>
            <button className="px-3 py-2 text-gray-700 hover:bg-gray-100">2</button>
            <button className="px-3 py-2 text-gray-700 hover:text-gray-900">Next</button>
          </div>
        </div>
      </div>
    </CategoryLayout>
  )
}
