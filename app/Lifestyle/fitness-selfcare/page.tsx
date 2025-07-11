"use client"

import CategoryLayout from "../../../components/CategoryLayout"

const fitnessSelfcareArticles = [
  {
    id: 1,
    title: "Home Workouts: Stay Fit Without the Gym",
    slug: "home-workouts-no-gym",
    image_url: "https://picsum.photos/270/405?random=81",
    author: "Fitness Coach Rahul",
    publish_date: "2024-12-24",
    category: "Fitness & Selfcare",
    excerpt: "Effective exercises you can do from the comfort of your home.",
  },
  {
    id: 2,
    title: "Mindful Skincare: A Holistic Approach to Beauty",
    slug: "mindful-skincare-holistic-beauty",
    image_url: "https://picsum.photos/270/405?random=82",
    author: "Beauty Expert Anjali",
    publish_date: "2024-12-22",
    category: "Fitness & Selfcare",
    excerpt: "Embrace a skincare routine that nourishes both your skin and soul.",
  },
  {
    id: 3,
    title: "Building Strength: A Beginner's Guide to Weight Training",
    slug: "building-strength-weight-training",
    image_url: "https://picsum.photos/270/405?random=83",
    author: "Trainer Vikram",
    publish_date: "2024-12-20",
    category: "Fitness & Selfcare",
    excerpt: "Start your strength journey with essential tips and exercises.",
  },
  {
    id: 4,
    title: "Self-Care Rituals for a Busy Life",
    slug: "self-care-rituals-busy-life",
    image_url: "https://picsum.photos/270/405?random=84",
    author: "Wellness Blogger",
    publish_date: "2024-12-18",
    category: "Fitness & Selfcare",
    excerpt: "Simple practices to prioritize your well-being amidst daily demands.",
  },
  {
    id: 5,
    title: "Nutrition for Athletes: Fueling Your Performance",
    slug: "nutrition-for-athletes-performance",
    image_url: "https://picsum.photos/270/405?random=85",
    author: "Sports Dietitian",
    publish_date: "2024-12-16",
    category: "Fitness & Selfcare",
    excerpt: "Optimize your diet to enhance athletic performance and recovery.",
  },
  {
    id: 6,
    title: "The Benefits of Outdoor Workouts",
    slug: "benefits-outdoor-workouts",
    image_url: "https://picsum.photos/270/405?random=86",
    author: "Nature Enthusiast",
    publish_date: "2024-12-14",
    category: "Fitness & Selfcare",
    excerpt: "Discover how exercising outdoors can boost your mood and fitness.",
  },
]

fitnessSelfcareArticles.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())

export default function FitnessSelfcarePage() {
  return (
    <CategoryLayout
      categoryName="Fitness & Selfcare"
      categorySlug="fitness-selfcare"
      description="Your guide to fitness routines, self-care practices, and maintaining a healthy lifestyle."
      initialArticles={fitnessSelfcareArticles} // Pass static articles to CategoryLayout
    />
  )
}
