"use client"

import Link from "next/link"
import Image from "next/image"
import CategoryLayout from "../../../components/CategoryLayout"

const fitnessSelfcareArticles = [
  {
    id: 1,
    title: "Home Workouts: Stay Fit Without the Gym",
    slug: "home-workouts-no-gym",
    image: "https://picsum.photos/270/405?random=81",
    author: "Fitness Coach Rahul",
    date: "December 24, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Effective exercises you can do from the comfort of your home.",
  },
  {
    id: 2,
    title: "Mindful Skincare: A Holistic Approach to Beauty",
    slug: "mindful-skincare-holistic-beauty",
    image: "https://picsum.photos/270/405?random=82",
    author: "Beauty Expert Anjali",
    date: "December 22, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Embrace a skincare routine that nourishes both your skin and soul.",
  },
  {
    id: 3,
    title: "Building Strength: A Beginner's Guide to Weight Training",
    slug: "building-strength-weight-training",
    image: "https://picsum.photos/270/405?random=83",
    author: "Trainer Vikram",
    date: "December 20, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Start your strength journey with essential tips and exercises.",
  },
  {
    id: 4,
    title: "Self-Care Rituals for a Busy Life",
    slug: "self-care-rituals-busy-life",
    image: "https://picsum.photos/270/405?random=84",
    author: "Wellness Blogger",
    date: "December 18, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Simple practices to prioritize your well-being amidst daily demands.",
  },
  {
    id: 5,
    title: "Nutrition for Athletes: Fueling Your Performance",
    slug: "nutrition-for-athletes-performance",
    image: "https://picsum.photos/270/405?random=85",
    author: "Sports Dietitian",
    date: "December 16, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Optimize your diet to enhance athletic performance and recovery.",
  },
  {
    id: 6,
    title: "The Benefits of Outdoor Workouts",
    slug: "benefits-outdoor-workouts",
    image: "https://picsum.photos/270/405?random=86",
    author: "Nature Enthusiast",
    date: "December 14, 2024",
    category: "Fitness & Selfcare",
    excerpt: "Discover how exercising outdoors can boost your mood and fitness.",
  },
]

fitnessSelfcareArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export default function FitnessSelfcarePage() {
  return (
    <CategoryLayout
      categoryName="Fitness & Selfcare"
      categorySlug="fitness-selfcare"
      description="Your guide to fitness routines, self-care practices, and maintaining a healthy lifestyle."
    >
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessSelfcareArticles.map((article) => (
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
